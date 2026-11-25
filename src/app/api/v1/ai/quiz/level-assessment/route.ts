import { z } from "zod";
import { callStructuredLlm } from "@/lib/ai/llm-client";
import { buildFallbackLevelAssessment } from "@/lib/quiz/level-assessment-bank";
import { LEVEL_ASSESSMENT_QUESTION_COUNT, type QuizQuestion } from "@/lib/quiz/types";
import {
  globalQuotaStore,
  extractClientIdentifier,
  buildRateLimitHeaders,
} from "@/lib/ratelimit/quota";
import type { CefrLevelCode } from "@/lib/content/length-tiers";

const AiQuestionSchema = z.object({
  prompt: z.string().min(8),
  promptBn: z.string().optional(),
  options: z.array(z.string().min(1)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string().min(5),
  explanationBn: z.string().optional(),
  cefrLevel: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  skillTag: z
    .enum(["Vocabulary", "Grammar", "Comprehension", "Register", "Context"])
    .optional(),
});

const AiQuizBatchSchema = z.object({
  questions: z.array(AiQuestionSchema).min(5).max(25),
});

async function generateLevelBatch(
  levels: CefrLevelCode[],
  count: number,
  seed: number,
  batchTag: string
): Promise<{ questions: QuizQuestion[]; provider: string; model: string }> {
  const systemPrompt = `You are an expert CEFR English assessment designer.
Generate exactly ${count} fresh, diverse, unambiguous 4-option multiple-choice English questions evenly distributed across CEFR levels: ${levels.join(", ")}.
Include a mix of Grammar, Vocabulary, Register, and Context questions.
Each question MUST have:
- prompt (concise English question)
- promptBn (natural Bangla translation of the question)
- options (array of exactly 4 distinct plausible options)
- correctIndex (0, 1, 2, or 3)
- explanation (1 concise sentence explaining why)
- explanationBn (concise Bangla explanation)
- cefrLevel (one of ${levels.join(", ")})
- skillTag (one of Grammar, Vocabulary, Comprehension, Register, Context)
Variation seed: ${seed}. Ensure questions are fresh and non-repetitive.`;

  const result = await callStructuredLlm({
    taskName: "levelAssessmentQuiz",
    systemPrompt,
    userPrompt: `Create ${count} CEFR (${levels.join(", ")}) multiple-choice questions for seed ${seed} (${batchTag}). Return JSON object { "questions": [...] }.`,
    schema: AiQuizBatchSchema,
    temperature: 0.85,
    maxTokens: 3800,
    timeoutMs: 18000,
  });

  if (!result.success || !result.data) {
    return { questions: [], provider: result.provider, model: result.model };
  }

  const mapped: QuizQuestion[] = result.data.questions.map((q, idx) => ({
    id: `ai-la-${batchTag}-${seed}-${idx + 1}`,
    prompt: q.prompt,
    promptBn: q.promptBn,
    options: [q.options[0], q.options[1], q.options[2], q.options[3]],
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    explanationBn: q.explanationBn,
    cefrLevel: q.cefrLevel,
    skillTag: q.skillTag ?? "Grammar",
  }));

  return { questions: mapped, provider: result.provider, model: result.model };
}

/**
 * POST /api/v1/ai/quiz/level-assessment
 * Generates 40 fresh AI-powered CEFR A1-C2 questions with deterministic fallback.
 */
export async function POST(req: Request) {
  try {
    const identifier = extractClientIdentifier(req);
    const quotaResult = globalQuotaStore.checkAndRecord(identifier, "quiz");
    const rateHeaders = buildRateLimitHeaders(quotaResult);

    let seed = Math.floor(Math.random() * 100000);
    try {
      const body = await req.json();
      if (typeof body?.seed === "number") seed = body.seed;
    } catch {
      // Optional JSON body
    }

    if (!quotaResult.allowed) {
      const fallback = buildFallbackLevelAssessment(seed);
      return Response.json(
        {
          questions: fallback,
          source: "fallback",
          provider: "deterministic-fallback",
          rateLimited: true,
        },
        { status: 200, headers: rateHeaders }
      );
    }

    const [lowerBatch, upperBatch] = await Promise.all([
      generateLevelBatch(["A1", "A2", "B1"], 20, seed, "lower"),
      generateLevelBatch(["B2", "C1", "C2"], 20, seed + 1, "upper"),
    ]);

    const combined = [...lowerBatch.questions, ...upperBatch.questions];
    const fallback = buildFallbackLevelAssessment(seed);

    if (combined.length >= LEVEL_ASSESSMENT_QUESTION_COUNT) {
      return Response.json(
        {
          questions: combined.slice(0, LEVEL_ASSESSMENT_QUESTION_COUNT),
          source: "ai",
          provider: lowerBatch.provider,
          model: lowerBatch.model,
        },
        { status: 200, headers: rateHeaders }
      );
    }

    // Pad any shortfall with fallback questions so the learner always receives 40 questions
    const padded = [...combined];
    for (const fb of fallback) {
      if (padded.length >= LEVEL_ASSESSMENT_QUESTION_COUNT) break;
      padded.push({ ...fb, id: `${fb.id}-${seed}` });
    }

    return Response.json(
      {
        questions: padded.slice(0, LEVEL_ASSESSMENT_QUESTION_COUNT),
        source: combined.length > 0 ? "ai" : "fallback",
        provider: combined.length > 0 ? lowerBatch.provider : "deterministic-fallback",
        model: lowerBatch.model,
      },
      { status: 200, headers: rateHeaders }
    );
  } catch (error) {
    const fallback = buildFallbackLevelAssessment(Date.now() % 40);
    return Response.json(
      {
        questions: fallback,
        source: "fallback",
        error: error instanceof Error ? error.message : "Fallback used",
      },
      { status: 200 }
    );
  }
}
