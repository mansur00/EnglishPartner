import { z } from "zod";
import { callStructuredLlm } from "./llm-client";

export const SpellRuleCategoryEnum = z.enum([
  "common-traps",
  "i-before-e",
  "silent-letter",
  "double-consonant",
  "suffix-rules",
]);

export const SpellLookupRequestSchema = z.object({
  action: z.literal("lookup"),
  word: z.string().trim().min(2).max(60),
});

export const SpellCoachRequestSchema = z.object({
  action: z.literal("coach"),
  weakWords: z.array(z.string()).max(20),
  mistakePatterns: z.record(z.string(), z.number()),
  locale: z.enum(["bn", "en"]).default("bn"),
});

export const SpellCheckTextRequestSchema = z.object({
  action: z.literal("check-text"),
  text: z.string().trim().min(3).max(2000),
  locale: z.enum(["bn", "en"]).default("bn"),
});

export const SpellMasterRequestSchema = z.discriminatedUnion("action", [
  SpellLookupRequestSchema,
  SpellCoachRequestSchema,
  SpellCheckTextRequestSchema,
]);

export type SpellMasterRequest = z.infer<typeof SpellMasterRequestSchema>;

export const SpellLookupResponseSchema = z.object({
  word: z.string().min(1),
  syllables: z.array(z.string()).min(1),
  phonetic: z.string().min(1),
  meaningBn: z.string().min(1),
  ruleCategory: SpellRuleCategoryEnum.catch("common-traps"),
  categories: z.array(z.string()).default(["common-traps", "ai-added-words"]),
  commonMistake: z.string().min(1),
  mnemonicBn: z.string().min(1),
  mnemonicEn: z.string().min(1),
  exampleSentence: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]).catch("medium"),
  isFallback: z.boolean().optional(),
});

export type SpellLookupResponse = z.infer<typeof SpellLookupResponseSchema>;

export const SpellCoachResponseSchema = z.object({
  diagnosis: z.string().min(1),
  topWeakCategory: z.string().min(1),
  memoryTips: z
    .array(
      z.object({
        word: z.string().min(1),
        tip: z.string().min(1),
      })
    )
    .default([]),
  quiz: z
    .array(
      z.object({
        question: z.string().min(1),
        options: z.array(z.string()).min(2),
        correctIndex: z.number().int().min(0),
        explanation: z.string().min(1),
      })
    )
    .default([]),
  isFallback: z.boolean().optional(),
});

export type SpellCoachResponse = z.infer<typeof SpellCoachResponseSchema>;

export const SpellCheckTextResponseSchema = z.object({
  isClean: z.boolean(),
  correctedText: z.string().min(1),
  mistakes: z
    .array(
      z.object({
        wrong: z.string().min(1),
        correct: z.string().min(1),
        explanation: z.string().min(1),
      })
    )
    .default([]),
  isFallback: z.boolean().optional(),
});

export type SpellCheckTextResponse = z.infer<typeof SpellCheckTextResponseSchema>;

function buildLookupFallback(word: string): SpellLookupResponse {
  const clean = word.trim().toLowerCase();
  const mid = Math.max(1, Math.floor(clean.length / 2));
  const syllables = clean.length >= 5 ? [clean.slice(0, mid), clean.slice(mid)] : [clean];
  return {
    word: clean,
    syllables,
    phonetic: `/${clean}/`,
    meaningBn: `"${clean}" শব্দটির বানান ও উচ্চারণ অনুশীলন করুন`,
    ruleCategory: "common-traps",
    categories: ["common-traps", "ai-added-words"],
    commonMistake: clean.length > 4 ? `${clean.slice(0, -1)}` : clean,
    mnemonicBn: `শব্দটি ভেঙে পড়ুন: ${syllables.join(" • ")}`,
    mnemonicEn: `Break it into chunks: ${syllables.join(" • ")}`,
    exampleSentence: `Please check the spelling of "${clean}" carefully.`,
    difficulty: clean.length >= 9 ? "hard" : clean.length >= 6 ? "medium" : "easy",
    isFallback: true,
  };
}

function buildCoachFallback(
  req: z.infer<typeof SpellCoachRequestSchema>
): SpellCoachResponse {
  const sorted = Object.entries(req.mistakePatterns).sort((a, b) => b[1] - a[1]);
  const topCat = sorted[0]?.[0] || "common-traps";
  const topCount = sorted[0]?.[1] || 0;
  const isBn = req.locale === "bn";

  const catNamesBn: Record<string, string> = {
    "double-consonant": "Double Consonant (যেমন running, stopped)",
    "i-before-e": "I Before E (যেমন receive, believe)",
    "silent-letter": "Silent Letter (যেমন knight, debt)",
    "suffix-rules": "-ing / -ed / -ly যোগের নিয়ম",
    "common-traps": "Common Misspelled Traps (যেমন separate, definitely)",
  };

  return {
    diagnosis: isBn
      ? topCount > 0
        ? `তুমি "${catNamesBn[topCat] || topCat}" নিয়মে বেশি ভুল করছো (${topCount} বার)। নিচের মেমরি ট্রিক ও কুইজ অনুশীলন করো!`
        : "এখনো বড় কোনো ভুলের প্যাটার্ন তৈরি হয়নি। আরও কয়েকটি বানান টেস্ট দিলে আমি তোমার দুর্বল দিকগুলো ধরতে পারব!"
      : topCount > 0
      ? `You make repeated mistakes in "${topCat}" (${topCount} times). Review these memory tricks and quiz!`
      : "No strong mistake pattern yet. Take a few spelling tests so I can diagnose your weak areas!",
    topWeakCategory: topCat,
    memoryTips: req.weakWords.slice(0, 3).map((wd) => ({
      word: wd,
      tip: isBn
        ? `"${wd}" শব্দটি সিলেবল ভেঙে ধীরে ধীরে লিখে অনুশীলন করুন।`
        : `Break "${wd}" into syllables and write it slowly three times.`,
    })),
    quiz: [
      {
        question: isBn
          ? "নিচের কোন বানানটি সঠিক?"
          : "Which spelling is correct?",
        options: ["definately", "definitely", "definitly", "definatly"],
        correctIndex: 1,
        explanation: isBn
          ? "'definitely'-এর ভেতরে 'finite' আছে (a নয়)।"
          : "Think of 'finite' inside de-FINITE-ly.",
      },
      {
        question: isBn
          ? "কোন বানানটি সঠিক?"
          : "Choose the correct spelling:",
        options: ["recieve", "receive", "receve", "receeve"],
        correctIndex: 1,
        explanation: isBn
          ? "'c'-এর ঠিক পরে 'e' আগে ও 'i' পরে বসে।"
          : "'i' before 'e' except after 'c' -> receive.",
      },
    ],
    isFallback: true,
  };
}

export async function runSpellMasterAsync(
  req: SpellMasterRequest
): Promise<SpellLookupResponse | SpellCoachResponse | SpellCheckTextResponse> {
  if (req.action === "lookup") {
    const systemPrompt = `You are an English spelling & pronunciation teacher for Bengali learners.
Given an English word, return ONLY valid JSON with:
{
  "word": "lowercase correct English word",
  "syllables": ["syl", "la", "bles"],
  "phonetic": "/IPA/",
  "meaningBn": "concise Bengali meaning",
  "ruleCategory": "common-traps | i-before-e | silent-letter | double-consonant | suffix-rules",
  "commonMistake": "most frequent wrong spelling",
  "mnemonicBn": "short catchy memory trick in Bengali",
  "mnemonicEn": "short catchy memory trick in English",
  "exampleSentence": "natural short English sentence using the word",
  "difficulty": "easy | medium | hard"
}`;
    const res = await callStructuredLlm({
      taskName: "grammarCheck",
      systemPrompt,
      userPrompt: `Word: "${req.word}"`,
      schema: SpellLookupResponseSchema,
      temperature: 0.2,
      maxTokens: 450,
      timeoutMs: 12000,
    });
    if (res.success && res.data) {
      return { ...res.data, isFallback: false };
    }
    return buildLookupFallback(req.word);
  }

  if (req.action === "coach") {
    const lang = req.locale === "bn" ? "Bengali (বাংলা)" : "English";
    const systemPrompt = `You are AI Spell Master, a personalized English spelling coach.
Analyze the learner's mistake patterns and weak words.
Write "diagnosis", "tip", "question", and "explanation" strictly in ${lang} (keeping English target words in English).
Return ONLY valid JSON:
{
  "diagnosis": "personalized diagnosis of their mistake pattern in ${lang}",
  "topWeakCategory": "category name",
  "memoryTips": [{ "word": "word", "tip": "personalized mnemonic in ${lang}" }],
  "quiz": [
    {
      "question": "practice question in ${lang} (or sentence with blank)",
      "options": ["opt1", "opt2", "opt3", "opt4"],
      "correctIndex": 0,
      "explanation": "why in ${lang}"
    }
  ]
}`;
    const userPrompt = `Weak words: ${req.weakWords.join(", ") || "none yet"}
Mistake pattern counts: ${JSON.stringify(req.mistakePatterns)}`;
    const res = await callStructuredLlm({
      taskName: "grammarCheck",
      systemPrompt,
      userPrompt,
      schema: SpellCoachResponseSchema,
      temperature: 0.3,
      maxTokens: 900,
      timeoutMs: 15000,
    });
    if (res.success && res.data) {
      return { ...res.data, isFallback: false };
    }
    return buildCoachFallback(req);
  }

  // check-text
  const lang = req.locale === "bn" ? "Bengali (বাংলা)" : "English";
  const systemPrompt = `You are an English spelling checker & teacher.
Find every spelling mistake in the user's pasted text. Explain each mistake in ${lang}.
Return ONLY valid JSON:
{
  "isClean": boolean,
  "correctedText": "full text with all spelling mistakes fixed",
  "mistakes": [
    { "wrong": "misspelled word", "correct": "correct spelling", "explanation": "why in ${lang}" }
  ]
}`;
  const res = await callStructuredLlm({
    taskName: "grammarCheck",
    systemPrompt,
    userPrompt: `Text:\n"""\n${req.text}\n"""`,
    schema: SpellCheckTextResponseSchema,
    temperature: 0.1,
    maxTokens: 800,
    timeoutMs: 15000,
  });
  if (res.success && res.data) {
    return { ...res.data, isFallback: false };
  }
  return {
    isClean: true,
    correctedText: req.text,
    mistakes: [],
    isFallback: true,
  };
}
