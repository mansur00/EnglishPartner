import { z } from "zod";
import { callStructuredLlm } from "./llm-client";

export const WritingModeEnum = z.enum(["general", "ielts-task1", "ielts-task2"]);
export type WritingMode = z.infer<typeof WritingModeEnum>;

export const WritingCheckRequestSchema = z.object({
  text: z.string().trim().min(3).max(4000),
  mode: WritingModeEnum.default("general"),
  explanationLocale: z.enum(["bn", "en"]).default("bn"),
});

export type WritingCheckRequest = z.infer<typeof WritingCheckRequestSchema>;

export const WritingIssueSchema = z.object({
  original: z.string().min(1),
  correction: z.string().min(1),
  category: z.string().min(1),
  explanation: z.string().min(1),
});

export const IeltsFeedbackSchema = z.object({
  bandScore: z.number().min(0).max(9),
  criteria: z.object({
    taskResponse: z.number().min(0).max(9),
    coherenceCohesion: z.number().min(0).max(9),
    lexicalResource: z.number().min(0).max(9),
    grammaticalRange: z.number().min(0).max(9),
  }),
  feedback: z.string().min(1),
  strengths: z.array(z.string()).default([]),
  improvements: z.array(z.string()).default([]),
});

export const WritingCheckResponseSchema = z.object({
  isErrorFree: z.boolean(),
  summary: z.string().min(1),
  correctedText: z.string().min(1),
  issues: z.array(WritingIssueSchema).default([]),
  rewrites: z.object({
    formal: z.string().min(1),
    casual: z.string().min(1),
    ielts: z.string().min(1),
  }),
  ielts: IeltsFeedbackSchema.nullish().catch(undefined),
  isFallback: z.boolean().optional(),
});

export type WritingCheckResponse = z.infer<typeof WritingCheckResponseSchema>;

function buildWritingFallback(req: WritingCheckRequest): WritingCheckResponse {
  const trimmed = req.text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const startsUpper = /^[A-Z"']/.test(trimmed);
  const endsPunct = /[.!?]$/.test(trimmed);
  const fixed = `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}${endsPunct ? "" : "."}`;
  const isBn = req.explanationLocale === "bn";

  const issues: WritingCheckResponse["issues"] = [];
  if (!startsUpper) {
    issues.push({
      original: trimmed.slice(0, Math.min(12, trimmed.length)),
      correction: fixed.slice(0, Math.min(12, fixed.length)),
      category: "Capitalization",
      explanation: isBn
        ? "ইংরেজি বাক্যের প্রথম অক্ষর সবসময় বড় হাতের (Capital letter) হতে হয়।"
        : "Every English sentence should begin with a capital letter.",
    });
  }
  if (!endsPunct) {
    issues.push({
      original: trimmed.slice(-Math.min(12, trimmed.length)),
      correction: fixed.slice(-Math.min(13, fixed.length)),
      category: "Punctuation",
      explanation: isBn
        ? "বাক্যের শেষে সঠিক বিরামচিহ্ন (. / ? / !) ব্যবহার করা প্রয়োজন।"
        : "End the sentence with proper punctuation (. / ? / !).",
    });
  }

  const baseBand = Math.min(7.5, Math.max(4.5, words.length >= 120 ? 6.0 : words.length >= 40 ? 5.5 : 5.0));

  return {
    isErrorFree: issues.length === 0,
    summary: isBn
      ? issues.length === 0
        ? "আপনার লেখাটির প্রাথমিক গঠন পরিষ্কার। বিস্তারিত AI বিশ্লেষণের জন্য অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।"
        : "আপনার লেখায় কিছু প্রাথমিক বানান/বিরামচিহ্নগত সংশোধন পাওয়া গেছে।"
      : issues.length === 0
      ? "Your writing looks structurally clean at a basic check."
      : "A few basic capitalization or punctuation issues were detected.",
    correctedText: fixed,
    issues,
    rewrites: {
      formal: fixed,
      casual: fixed,
      ielts: fixed,
    },
    ielts:
      req.mode !== "general"
        ? {
            bandScore: baseBand,
            criteria: {
              taskResponse: baseBand,
              coherenceCohesion: baseBand,
              lexicalResource: baseBand,
              grammaticalRange: baseBand,
            },
            feedback: isBn
              ? `আপনার লেখায় ${words.length}টি শব্দ রয়েছে। IELTS Writing-এ ভালো ব্যান্ড স্কোরের জন্য স্পষ্ট যুক্তি, লিংকিং ওয়ার্ড এবং বৈচিত্র্যময় বাক্য গঠন ব্যবহার করুন।`
              : `Your response contains ${words.length} words. Use clear topic sentences, cohesive devices, and varied grammatical structures for a higher band.`,
            strengths: [
              isBn ? "মূল বক্তব্য বোঝা যাচ্ছে।" : "Core message is understandable.",
            ],
            improvements: [
              isBn
                ? "বাক্যগুলোর মধ্যে সংযোগ (However, Moreover, Consequently) বাড়ান।"
                : "Increase use of cohesive linking phrases and academic vocabulary.",
            ],
          }
        : undefined,
    isFallback: true,
  };
}

export async function checkWritingAsync(
  req: WritingCheckRequest
): Promise<WritingCheckResponse> {
  const isBn = req.explanationLocale === "bn";
  const explLang = isBn ? "Bengali (বাংলা)" : "English";
  const isIelts = req.mode !== "general";
  const taskLabel =
    req.mode === "ielts-task1"
      ? "IELTS Academic/General Writing Task 1"
      : req.mode === "ielts-task2"
      ? "IELTS Writing Task 2 Essay"
      : "General English Sentence / Paragraph";

  const systemPrompt = `You are an expert English grammar teacher and certified IELTS Writing examiner.
Analyze the learner's English text carefully.

Rules:
1. Identify EVERY grammar, tense, subject-verb agreement, article, preposition, spelling, punctuation, or awkward phrasing error in "issues".
2. Write "summary", each issue's "explanation", and IELTS "feedback"/"strengths"/"improvements" strictly in ${explLang}.
3. Write "correctedText" and all 3 "rewrites" ("formal", "casual", "ielts") in natural, accurate English:
   - "formal": Polite, professional workplace/academic tone.
   - "casual": Natural everyday conversational tone.
   - "ielts": High-scoring Band 8.0+ IELTS lexical and grammatical sophistication.
4. ${
    isIelts
      ? `Since mode is ${taskLabel}, provide an honest "ielts" evaluation with realistic band scores (0.0 to 9.0 in 0.5 steps) for overall "bandScore" and the 4 official criteria.`
      : `Set "ielts" to null since mode is general.`
  }
5. Return ONLY valid JSON matching this exact structure:
{
  "isErrorFree": boolean,
  "summary": "string in ${explLang}",
  "correctedText": "string in English",
  "issues": [
    {
      "original": "wrong phrase from text",
      "correction": "fixed phrase",
      "category": "Grammar | Tense | Preposition | Article | Spelling | Punctuation | Word Choice | Structure",
      "explanation": "clear explanation of why it is wrong in ${explLang}"
    }
  ],
  "rewrites": {
    "formal": "English formal rewrite",
    "casual": "English casual rewrite",
    "ielts": "English IELTS Band 8+ rewrite"
  },
  "ielts": ${
    isIelts
      ? `{
    "bandScore": 6.5,
    "criteria": {
      "taskResponse": 6.5,
      "coherenceCohesion": 6.5,
      "lexicalResource": 6.0,
      "grammaticalRange": 6.5
    },
    "feedback": "detailed examiner feedback in ${explLang}",
    "strengths": ["strength 1 in ${explLang}"],
    "improvements": ["improvement 1 in ${explLang}"]
  }`
      : "null"
  }
}`;

  const userPrompt = `Mode: ${taskLabel}
Explanation Language: ${explLang}
Learner Text:
"""
${req.text}
"""`;

  const result = await callStructuredLlm({
    taskName: "grammarCheck",
    systemPrompt,
    userPrompt,
    schema: WritingCheckResponseSchema,
    temperature: 0.2,
    maxTokens: 1400,
    timeoutMs: 20000,
  });

  if (result.success && result.data) {
    return {
      ...result.data,
      isFallback: false,
    };
  }

  return buildWritingFallback(req);
}
