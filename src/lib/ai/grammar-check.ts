import { z } from "zod";
import { callStructuredLlm } from "./llm-client";

export const GrammarCheckRequestSchema = z.object({
  topicId: z.string().min(1).max(80),
  topicTitle: z.string().min(1).max(160),
  formula: z.string().min(1).max(300),
  sentence: z.string().trim().min(2).max(400),
  locale: z.string().min(2).max(16).default("bn"),
});

export type GrammarCheckRequest = z.infer<typeof GrammarCheckRequestSchema>;

export const GrammarCheckResponseSchema = z.object({
  isCorrect: z.boolean(),
  feedback: z.string().min(1),
  correctedSentence: z.string().nullish().catch(undefined),
  tip: z.string().nullish().catch(undefined),
  isFallback: z.boolean().optional(),
});

export type GrammarCheckResponse = z.infer<typeof GrammarCheckResponseSchema>;

function buildFallbackResponse(req: GrammarCheckRequest): GrammarCheckResponse {
  const words = req.sentence.trim().split(/\s+/).filter(Boolean);
  const startsUpper = /^[A-Z"']/.test(req.sentence.trim());
  const endsPunct = /[.!?]$/.test(req.sentence.trim());
  const hasEnoughWords = words.length >= 3;
  const looksValid = hasEnoughWords && startsUpper && endsPunct;

  if (req.locale === "bn") {
    return {
      isCorrect: looksValid,
      feedback: looksValid
        ? "চমৎকার! আপনার বাক্যটি গঠনগতভাবে সুন্দর হয়েছে।"
        : "বাক্যটি আরেকটু গুছিয়ে লিখুন — বড় হাতের অক্ষর দিয়ে শুরু করুন, অন্তত ৩টি শব্দ ব্যবহার করুন এবং শেষে বিরামচিহ্ন (. / ? / !) দিন।",
      correctedSentence: looksValid ? undefined : `${req.sentence.trim().charAt(0).toUpperCase()}${req.sentence.trim().slice(1)}${endsPunct ? "" : "."}`,
      tip: `টিপস: "${req.topicTitle}" নিয়মটি মাথায় রেখে আরেকটি বাক্য লিখে দেখুন।`,
      isFallback: true,
    };
  }

  if (req.locale === "hi") {
    return {
      isCorrect: looksValid,
      feedback: looksValid
        ? "बहुत बढ़िया! आपका वाक्य संरचनात्मक रूप से अच्छा है।"
        : "कृपया वाक्य को बड़े अक्षर से शुरू करें, कम से कम 3 शब्द लिखें और अंत में विराम चिह्न (. / ? / !) लगाएं।",
      correctedSentence: looksValid ? undefined : `${req.sentence.trim().charAt(0).toUpperCase()}${req.sentence.trim().slice(1)}${endsPunct ? "" : "."}`,
      tip: `सुझाव: "${req.topicTitle}" नियम को ध्यान में रखकर एक और वाक्य बनाएं।`,
      isFallback: true,
    };
  }

  return {
    isCorrect: looksValid,
    feedback: looksValid
      ? "Great job! Your sentence structure looks clean."
      : "Try starting with a capital letter, using at least 3 words, and ending with punctuation (. / ? / !).",
    correctedSentence: looksValid ? undefined : `${req.sentence.trim().charAt(0).toUpperCase()}${req.sentence.trim().slice(1)}${endsPunct ? "" : "."}`,
    tip: `Tip: Keep the "${req.topicTitle}" pattern in mind.`,
    isFallback: true,
  };
}

export async function checkGrammarSentenceAsync(
  req: GrammarCheckRequest
): Promise<GrammarCheckResponse> {
  const langMap: Record<string, string> = {
    bn: "Bengali (বাংলা)",
    hi: "Hindi (हिन्दी)",
    ur: "Urdu (اردو)",
    ar: "Arabic (العربية)",
    en: "English",
  };
  const langName = langMap[req.locale] || req.locale;

  const systemPrompt = `You are a supportive English grammar coach.
Evaluate the learner's English sentence against the target grammar topic.
Write "feedback" and "tip" strictly in ${langName}.
Write "correctedSentence" in natural English ONLY if the learner's sentence has a grammar/spelling mistake or does not match the topic (otherwise omit or set null).
Return ONLY valid JSON matching this shape:
{
  "isCorrect": true,
  "feedback": "Short encouraging evaluation in ${langName}",
  "correctedSentence": null,
  "tip": "One short practical tip in ${langName}"
}`;

  const userPrompt = `Topic: ${req.topicTitle}
Pattern/Formula: ${req.formula}
Learner Sentence: "${req.sentence}"`;

  const result = await callStructuredLlm({
    taskName: "grammarCheck",
    systemPrompt,
    userPrompt,
    schema: GrammarCheckResponseSchema,
    temperature: 0.2,
    maxTokens: 350,
    timeoutMs: 12000,
  });

  if (result.success && result.data) {
    return {
      ...result.data,
      isFallback: false,
    };
  }

  return buildFallbackResponse(req);
}
