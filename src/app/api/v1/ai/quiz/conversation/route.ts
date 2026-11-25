import { z } from "zod";
import { callStructuredLlm } from "@/lib/ai/llm-client";
import {
  globalQuotaStore,
  extractClientIdentifier,
  buildRateLimitHeaders,
} from "@/lib/ratelimit/quota";
import { getQuestionCountForLevel, type QuizQuestion } from "@/lib/quiz/types";

const RequestSchema = z.object({
  scenarioTitle: z.string().min(1),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  style: z.enum(["casual", "neutral", "formal"]),
  dialogueLines: z.array(z.string()).min(1).max(30),
  seed: z.number().optional(),
});

const AiQuestionSchema = z.object({
  prompt: z.string().min(8),
  promptBn: z.string().optional(),
  options: z.array(z.string().min(1)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(5),
  explanationBn: z.string().optional(),
  skillTag: z
    .enum(["Vocabulary", "Grammar", "Comprehension", "Register", "Context"])
    .optional(),
});

const ResponseSchema = z.object({
  questions: z.array(AiQuestionSchema).min(3).max(15),
});

/**
 * POST /api/v1/ai/quiz/conversation
 * Generates fresh AI questions tailored to a specific conversation, level, and style
 * to enrich the hybrid conversation quiz on Refresh.
 */
export async function POST(req: Request) {
  try {
    const identifier = extractClientIdentifier(req);
    const quotaResult = globalQuotaStore.checkAndRecord(identifier, "quiz");
    const rateHeaders = buildRateLimitHeaders(quotaResult);

    if (!quotaResult.allowed) {
      return Response.json(
        { questions: [], source: "fallback", rateLimited: true },
        { status: 200, headers: rateHeaders }
      );
    }

    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "INVALID_REQUEST", questions: [] },
        { status: 400, headers: rateHeaders }
      );
    }

    const { scenarioTitle, level, style, dialogueLines, seed = 1 } = parsed.data;
    const totalNeeded = getQuestionCountForLevel(level);
    const aiBatchSize = Math.min(10, totalNeeded);

    const systemPrompt = `You are an English conversation coach creating ${aiBatchSize} fresh 4-option multiple-choice questions for CEFR level ${level} (${style} register).
Base every question on the provided conversation "${scenarioTitle}".
Each item must include: prompt, promptBn (Bangla), options (exactly 4), correctIndex (0..3), explanation, explanationBn (Bangla), and skillTag.
Variation seed: ${seed}.`;

    const result = await callStructuredLlm({
      taskName: "conversationQuiz",
      systemPrompt,
      userPrompt: `Conversation lines:\n${dialogueLines
        .slice(0, 14)
        .map((l, i) => `${i + 1}. ${l}`)
        .join("\n")}\n\nGenerate ${aiBatchSize} fresh MCQ questions in JSON { "questions": [...] }.`,
      schema: ResponseSchema,
      temperature: 0.8,
      maxTokens: 2600,
      timeoutMs: 14000,
    });

    if (!result.success || !result.data) {
      return Response.json(
        { questions: [], source: "fallback" },
        { status: 200, headers: rateHeaders }
      );
    }

    const questions: QuizQuestion[] = result.data.questions.map((q, idx) => ({
      id: `ai-conv-${seed}-${idx + 1}`,
      prompt: q.prompt,
      promptBn: q.promptBn,
      options: [q.options[0], q.options[1], q.options[2], q.options[3]],
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      explanationBn: q.explanationBn,
      cefrLevel: level,
      skillTag: q.skillTag ?? "Comprehension",
    }));

    return Response.json(
      { questions, source: "ai", provider: result.provider, model: result.model },
      { status: 200, headers: rateHeaders }
    );
  } catch {
    return Response.json({ questions: [], source: "fallback" }, { status: 200 });
  }
}
