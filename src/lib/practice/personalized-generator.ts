import { z } from "zod";
import { callStructuredLlm } from "@/lib/ai/llm-client";
import { GRAMMAR_STAGES } from "@/lib/grammar/learning-path";
import { GRAMMAR_LESSONS } from "@/lib/grammar/learning-path-data";

export type PracticeFocusArea = "mixed" | "tense" | "preposition" | "spelling";
export type ExerciseArea = "tense" | "preposition" | "spelling";

export interface WeakAreaSummary {
  area: ExerciseArea;
  labelEn: string;
  labelBn: string;
  severity: "high" | "medium" | "low";
  score: number;
  reasonEn: string;
  reasonBn: string;
}

export interface DailyPlanStep {
  id: string;
  titleEn: string;
  titleBn: string;
  durationMin: number;
  href: string;
  completed: boolean;
  tag: string;
}

export interface NextLessonSuggestion {
  lessonId: string;
  lessonTitle: string;
  stageNumber: number;
  stageTitle: string;
  href: string;
  completedCount: number;
  totalCount: number;
  reasonEn: string;
  reasonBn: string;
}

export const PracticeExerciseItemSchema = z.object({
  id: z.string().min(1),
  area: z.enum(["tense", "preposition", "spelling"]).catch("tense"),
  prompt: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  correctIndex: z.number().int().min(0).max(3),
  explanationBn: z.string().min(1),
  explanationEn: z.string().min(1),
  ruleTag: z.string().min(1),
});

export type PracticeExerciseItem = z.infer<typeof PracticeExerciseItemSchema>;

export const PersonalizedPracticeRequestSchema = z.object({
  focus: z.enum(["mixed", "tense", "preposition", "spelling"]).default("mixed"),
  weakAreas: z.array(z.enum(["tense", "preposition", "spelling"])).max(3).default([]),
  weakWords: z.array(z.string()).max(15).default([]),
  locale: z.enum(["bn", "en"]).default("bn"),
});

export type PersonalizedPracticeRequest = z.infer<typeof PersonalizedPracticeRequestSchema>;

export const PersonalizedPracticeResponseSchema = z.object({
  focusLabel: z.string().min(1),
  tipBn: z.string().min(1),
  tipEn: z.string().min(1),
  exercises: z.array(PracticeExerciseItemSchema).min(3).max(6),
  isFallback: z.boolean().optional(),
});

export type PersonalizedPracticeResponse = z.infer<typeof PersonalizedPracticeResponseSchema>;

export interface UserProgressSnapshot {
  weakWords: { word: string; mistakes: number; ruleCategory: string }[];
  ruleMistakesCount: number;
  quizLowCategories: string[];
  completedGrammarIds: string[];
  savedVocabCount: number;
  todayMinutes: number;
}

/**
 * Computes ranked weak areas (tense, preposition, spelling) from the user's
 * Spell Master mistakes, Quiz scores, and Grammar Path progress.
 */
export function detectWeakAreas(snapshot: UserProgressSnapshot): WeakAreaSummary[] {
  const spellMistakeWeight =
    snapshot.weakWords.reduce((acc, w) => acc + w.mistakes, 0) + snapshot.ruleMistakesCount;
  const quizText = snapshot.quizLowCategories.join(" ").toLowerCase();

  const tenseCompleted = snapshot.completedGrammarIds.filter((id) => id.startsWith("s2-")).length;
  const prepCompleted = snapshot.completedGrammarIds.filter((id) => id.startsWith("s1-")).length;

  const tenseScore =
    (quizText.includes("tense") || quizText.includes("verb") ? 45 : 15) +
    (tenseCompleted === 0 ? 25 : 0);
  const prepScore =
    (quizText.includes("preposition") || quizText.includes("grammar") ? 40 : 15) +
    (prepCompleted < 3 ? 20 : 0);
  const spellScore = Math.min(95, 10 + spellMistakeWeight * 12);

  const items: WeakAreaSummary[] = [
    {
      area: "spelling",
      labelEn: "Spelling",
      labelBn: "বানান (Spelling)",
      severity: spellScore >= 40 ? "high" : spellScore >= 20 ? "medium" : "low",
      score: spellScore,
      reasonEn:
        snapshot.weakWords.length > 0
          ? `${snapshot.weakWords.length} weak word(s) tracked in Spell Master`
          : "Reinforce common English spelling traps",
      reasonBn:
        snapshot.weakWords.length > 0
          ? `Spell Master-এ ${snapshot.weakWords.length}টি দুর্বল শব্দ ট্র্যাক হয়েছে`
          : "সাধারণ ইংরেজি বানানের ভুলগুলো ঝালাই করুন",
    },
    {
      area: "tense",
      labelEn: "Tense & Verbs",
      labelBn: "Tense ও ক্রিয়ার রূপ",
      severity: tenseScore >= 40 ? "high" : tenseScore >= 25 ? "medium" : "low",
      score: tenseScore,
      reasonEn:
        tenseCompleted === 0
          ? "Stage 2 Tense lessons not completed yet"
          : "Keep past, present & perfect forms sharp",
      reasonBn:
        tenseCompleted === 0
          ? "Stage 2-এর Tense লেসনগুলো এখনো বাকি আছে"
          : "Present, Past ও Perfect tense অনুশীলন করুন",
    },
    {
      area: "preposition",
      labelEn: "Prepositions",
      labelBn: "Preposition (in/on/at)",
      severity: prepScore >= 35 ? "high" : prepScore >= 20 ? "medium" : "low",
      score: prepScore,
      reasonEn:
        prepCompleted < 3
          ? "Core Stage 1 preposition & article drills recommended"
          : "Practice tricky time/place prepositions",
      reasonBn:
        prepCompleted < 3
          ? "Stage 1-এর Preposition ও Article অনুশীলন প্রয়োজন"
          : "সময় ও স্থানের Preposition ব্যবহার ঝালাই করুন",
    },
  ];

  return items.sort((a, b) => b.score - a.score);
}

/**
 * Recommends the next Grammar lesson and builds a 3-step Daily Plan.
 */
export function buildDailyPlan(snapshot: UserProgressSnapshot): {
  nextLesson: NextLessonSuggestion;
  planSteps: DailyPlanStep[];
} {
  const completedSet = new Set(snapshot.completedGrammarIds);
  const nextGrammar =
    GRAMMAR_LESSONS.find((l) => !completedSet.has(l.id)) ?? GRAMMAR_LESSONS[0];
  const stage =
    GRAMMAR_STAGES.find((s) => s.stageNumber === nextGrammar.stageNumber) ?? GRAMMAR_STAGES[0];

  const nextLesson: NextLessonSuggestion = {
    lessonId: nextGrammar.id,
    lessonTitle: nextGrammar.title,
    stageNumber: stage.stageNumber,
    stageTitle: stage.title,
    href: `/grammar-path/${stage.slug}`,
    completedCount: snapshot.completedGrammarIds.length,
    totalCount: GRAMMAR_LESSONS.length,
    reasonEn: `Stage ${stage.stageNumber}: ${stage.subtitle}`,
    reasonBn: `স্টেজ ${stage.stageNumber}: ${stage.title}-এর পরবর্তী ধাপ`,
  };

  const planSteps: DailyPlanStep[] = [
    {
      id: "weak-drill",
      titleEn: "Weak-Area 5-Question Drill",
      titleBn: "দুর্বল বিষয়ে ৫টি প্র্যাকটিস প্রশ্ন",
      durationMin: 5,
      href: "#personalized-practice",
      completed: snapshot.todayMinutes >= 5,
      tag: "Auto-Targeted",
    },
    {
      id: "next-grammar",
      titleEn: `Next Lesson: ${nextGrammar.title}`,
      titleBn: `পরবর্তী লেসন: ${nextGrammar.title}`,
      durationMin: 7,
      href: nextLesson.href,
      completed: completedSet.has(nextGrammar.id),
      tag: `Stage ${stage.stageNumber}`,
    },
    {
      id: "srs-spell",
      titleEn:
        snapshot.weakWords.length > 0
          ? `Review ${snapshot.weakWords.length} Weak Spelling Words`
          : "Review Saved Vocabulary (SRS)",
      titleBn:
        snapshot.weakWords.length > 0
          ? `${snapshot.weakWords.length}টি দুর্বল বানান রিভিউ করুন`
          : "সেভ করা শব্দ রিভিউ করুন (SRS)",
      durationMin: 4,
      href: snapshot.weakWords.length > 0 ? "/spell-master" : "#srs-review",
      completed: snapshot.todayMinutes >= 12,
      tag: snapshot.weakWords.length > 0 ? "Spell Master" : "SRS",
    },
  ];

  return { nextLesson, planSteps };
}

const LOCAL_PRACTICE_BANK: Record<ExerciseArea, PracticeExerciseItem[]> = {
  tense: [
    {
      id: "tense-1",
      area: "tense",
      prompt: "She _____ in Dhaka since 2021.",
      options: ["lives", "is living", "has been living", "lived"],
      correctIndex: 2,
      explanationBn:
        "'since 2021' থাকায় কাজটি অতীতে শুরু হয়ে এখনো চলছে বোঝাচ্ছে—তাই Present Perfect Continuous ('has been living') সঠিক।",
      explanationEn:
        "With 'since 2021' for an action continuing into the present, use Present Perfect Continuous ('has been living').",
      ruleTag: "Present Perfect Continuous",
    },
    {
      id: "tense-2",
      area: "tense",
      prompt: "By the time we arrived at the station, the train _____.",
      options: ["left", "has left", "had already left", "was leaving"],
      correctIndex: 2,
      explanationBn:
        "অতীতে দুটি কাজের মধ্যে যেটি আগে ঘটেছিল, সেটিতে Past Perfect ('had already left') বসে।",
      explanationEn:
        "When one past action happened before another past action, use Past Perfect ('had already left').",
      ruleTag: "Past Perfect",
    },
    {
      id: "tense-3",
      area: "tense",
      prompt: "If it rains tomorrow, we _____ the meeting indoors.",
      options: ["hold", "will hold", "held", "would hold"],
      correctIndex: 1,
      explanationBn:
        "First Conditional-এ 'If + Present Simple' এর পর main clause-এ 'will + base verb' বসে।",
      explanationEn:
        "In a First Conditional sentence, 'If + Present Simple' pairs with 'will + base verb'.",
      ruleTag: "First Conditional",
    },
    {
      id: "tense-4",
      area: "tense",
      prompt: "He usually _____ coffee in the morning, but today he is drinking tea.",
      options: ["drink", "drinks", "is drinking", "drank"],
      correctIndex: 1,
      explanationBn:
        "'usually' থাকায় অভ্যাসগত কাজ বোঝাচ্ছে এবং Subject 'He' (3rd person singular) হওয়ায় 'drinks' হবে।",
      explanationEn:
        "Habitual action with 'usually' and third-person singular subject 'He' requires 'drinks'.",
      ruleTag: "Present Simple Habit",
    },
  ],
  preposition: [
    {
      id: "prep-1",
      area: "preposition",
      prompt: "The meeting will start _____ 10:30 AM _____ Monday.",
      options: ["in / on", "at / on", "on / at", "at / in"],
      correctIndex: 1,
      explanationBn:
        "নির্দিষ্ট সময়ের আগে 'at' (at 10:30 AM) এবং বার বা দিনের আগে 'on' (on Monday) বসে।",
      explanationEn:
        "Use 'at' for exact clock times (at 10:30 AM) and 'on' for days of the week (on Monday).",
      ruleTag: "Time Prepositions (at / on)",
    },
    {
      id: "prep-2",
      area: "preposition",
      prompt: "She is very good _____ explaining complex grammar rules.",
      options: ["in", "on", "at", "with"],
      correctIndex: 2,
      explanationBn:
        "কোনো বিষয়ে দক্ষতা বোঝাতে 'good at' ব্যবহৃত হয় ('good in' নয়)।",
      explanationEn:
        "Use the collocation 'good at' (not 'good in') to express skill in something.",
      ruleTag: "Adjective + Preposition",
    },
    {
      id: "prep-3",
      area: "preposition",
      prompt: "We have been waiting here _____ two hours.",
      options: ["since", "for", "from", "during"],
      correctIndex: 1,
      explanationBn:
        "মোট সময়কাল (duration: two hours) বোঝাতে 'for' বসে; নির্দিষ্ট শুরুর সময় বোঝাতে 'since' বসে।",
      explanationEn:
        "Use 'for' with a duration of time ('two hours'), and 'since' with a starting point.",
      ruleTag: "For vs Since",
    },
    {
      id: "prep-4",
      area: "preposition",
      prompt: "Please submit your report _____ Friday evening.",
      options: ["by", "until", "in", "at"],
      correctIndex: 0,
      explanationBn:
        "নির্দিষ্ট ডেডলাইনের মধ্যে বা তার আগে বোঝাতে 'by' বসে (by Friday evening)।",
      explanationEn:
        "Use 'by' to indicate a deadline ('no later than Friday evening').",
      ruleTag: "Deadline (by vs until)",
    },
  ],
  spelling: [
    {
      id: "spell-1",
      area: "spelling",
      prompt: "Choose the correctly spelled word:",
      options: ["definately", "definitely", "definitly", "definatly"],
      correctIndex: 1,
      explanationBn:
        "সঠিক বানান 'definitely' — এর ভেতরে 'finite' আছে (কোনো 'a' নেই)।",
      explanationEn:
        "'definitely' comes from 'definite' (finite) — never spell it with an 'a'.",
      ruleTag: "Common Trap",
    },
    {
      id: "spell-2",
      area: "spelling",
      prompt: "Choose the correctly spelled word:",
      options: ["seperate", "separate", "seperete", "saparate"],
      correctIndex: 1,
      explanationBn:
        "সঠিক বানান 'separate' — মনে রাখার ট্রিক: sep-A-RAT-e (মাঝে 'a rat' আছে)।",
      explanationEn:
        "'separate' has 'a' in the middle (sep-A-RAT-e).",
      ruleTag: "Vowel Trap",
    },
    {
      id: "spell-3",
      area: "spelling",
      prompt: "Choose the correctly spelled word:",
      options: ["accomodate", "acommodate", "accommodate", "acomodate"],
      correctIndex: 2,
      explanationBn:
        "সঠিক বানান 'accommodate' — এতে ২টি 'c' এবং ২টি 'm' থাকে।",
      explanationEn:
        "'accommodate' has double 'c' and double 'm'.",
      ruleTag: "Double Consonant",
    },
    {
      id: "spell-4",
      area: "spelling",
      prompt: "Choose the correctly spelled word:",
      options: ["recieve", "receive", "receeve", "recive"],
      correctIndex: 1,
      explanationBn:
        "নিয়ম: 'I before E except after C' — তাই c-এর পর 'ei' বসে (receive)।",
      explanationEn:
        "Rule R27: I before E except after C -> 'receive'.",
      ruleTag: "R27: I before E",
    },
  ],
};

/**
 * Returns an immediate curated fallback practice set based on focus & weak areas.
 */
export function getFallbackPracticeSet(
  focus: PracticeFocusArea,
  weakAreas: ExerciseArea[] = ["spelling", "tense", "preposition"]
): PersonalizedPracticeResponse {
  let exercises: PracticeExerciseItem[] = [];

  if (focus === "mixed") {
    const primary = weakAreas[0] ?? "tense";
    const secondary = weakAreas[1] ?? "preposition";
    const tertiary = weakAreas[2] ?? "spelling";
    exercises = [
      LOCAL_PRACTICE_BANK[primary][0],
      LOCAL_PRACTICE_BANK[primary][1],
      LOCAL_PRACTICE_BANK[secondary][0],
      LOCAL_PRACTICE_BANK[secondary][1],
      LOCAL_PRACTICE_BANK[tertiary][0],
    ];
  } else {
    exercises = [...LOCAL_PRACTICE_BANK[focus]];
    const extra = focus === "tense" ? LOCAL_PRACTICE_BANK.preposition[0] : LOCAL_PRACTICE_BANK.tense[0];
    exercises.push(extra);
  }

  return {
    focusLabel:
      focus === "mixed"
        ? "Auto-Targeted Mixed Practice"
        : focus === "tense"
          ? "Tense & Verb Focus"
          : focus === "preposition"
            ? "Preposition Focus"
            : "Spelling Mastery Focus",
    tipBn:
      "ভুল উত্তর হলেই নিচের বাংলা ব্যাখ্যাটি পড়ে নিন—এতে একই ভুল বারবার হবে না।",
    tipEn:
      "Review the explanation after each question to lock in the pattern and avoid repeat mistakes.",
    exercises,
    isFallback: true,
  };
}

/**
 * Generates personalized practice exercises via Groq LLM with instant fallback.
 */
export async function runPersonalizedPracticeAsync(
  input: PersonalizedPracticeRequest
): Promise<PersonalizedPracticeResponse> {
  const focusInstruction =
    input.focus === "mixed"
      ? `Mix 5 questions focusing especially on the user's top weak areas: ${input.weakAreas.join(", ") || "tense, preposition, spelling"}.`
      : `Generate 5 targeted questions specifically for ${input.focus}.`;

  const weakWordHint =
    input.weakWords.length > 0
      ? `The user recently misspelled these words: ${input.weakWords.slice(0, 8).join(", ")}. Include 1-2 spelling questions using them or similar patterns if spelling is included.`
      : "";

  const systemPrompt = `You are an expert English tutor for Bangladeshi learners.
Generate a personalized 5-question multiple-choice practice set.
${focusInstruction}
${weakWordHint}
Each question must have:
- id: short unique string (e.g. "q1")
- area: "tense" | "preposition" | "spelling"
- prompt: clear fill-in-the-blank or "Choose the correctly spelled word:" sentence
- options: array of exactly 4 distinct options
- correctIndex: integer 0..3
- explanationBn: concise explanation in natural Bangla script
- explanationEn: concise explanation in clear English
- ruleTag: short rule label (e.g. "Present Perfect", "Time Prepositions", "Double Consonant")
Return JSON matching the schema strictly.`;

  const llmResult = await callStructuredLlm({
    taskName: "grammarCheck",
    systemPrompt,
    userPrompt: `Create 5 personalized English practice exercises for focus="${input.focus}" (locale=${input.locale}).`,
    schema: PersonalizedPracticeResponseSchema,
    temperature: 0.4,
    maxTokens: 1400,
  });

  if (llmResult.success && llmResult.data) {
    return { ...llmResult.data, isFallback: false };
  }

  return getFallbackPracticeSet(
    input.focus,
    input.weakAreas.length > 0 ? input.weakAreas : ["tense", "preposition", "spelling"]
  );
}
