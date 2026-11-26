import type { Locale } from "@/lib/i18n";

export type GrammarLevelFilter = "all" | "school" | "admission" | "ielts" | "spoken";

export interface GrammarSubType {
  name: string;
  rule: Record<Locale, string>;
  words: string[];
  sentences: string[];
}

export interface RightWordQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: Record<Locale, string>;
}

export interface GrammarQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: Record<Locale, string>;
}

export interface GrammarDetailedLesson {
  id: string;
  stageNumber: number;
  title: string;
  formula: string;
  overviewRule: Record<Locale, string>;
  subTypes: GrammarSubType[];
  wordBank: string[];
  sentenceExamples: string[];
  sentencePrompts: string[];
  rightWordQuestions: RightWordQuestion[];
  quizQuestions: GrammarQuizQuestion[];
  levels: Exclude<GrammarLevelFilter, "all">[];
}

export interface GrammarStage {
  stageNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  description: Record<Locale, string>;
  focusTag: string;
  priorityLevels: Exclude<GrammarLevelFilter, "all">[];
}

export interface LevelPriorityInfo {
  id: GrammarLevelFilter;
  label: string;
  focusSummary: Record<Locale, string>;
  recommendedStages: number[];
}

export const LEVEL_PRIORITIES: LevelPriorityInfo[] = [
  {
    id: "all",
    label: "All Stages (1–8)",
    focusSummary: {
      bn: "ধাপে ধাপে Stage 1 থেকে Stage 8 পর্যন্ত সম্পূর্ণ গ্রামার শিখুন।",
      hi: "चरण 1 से चरण 8 तक क्रम से पूरा ग्रामर सीखें।",
      en: "Follow the complete step-by-step sequence from Stage 1 to Stage 8.",
    },
    recommendedStages: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    id: "school",
    label: "School (SSC / HSC)",
    focusSummary: {
      bn: "ফোকাস: Stage 1, 2, 4, 6 এবং বিশেষ করে Right Form of Verb।",
      hi: "फोकस: Stage 1, 2, 4, 6 और विशेष रूप से Right Form of Verb।",
      en: "Focus on Stages 1, 2, 4, 6 and especially Right Form of Verb.",
    },
    recommendedStages: [1, 2, 4, 6],
  },
  {
    id: "admission",
    label: "Admission",
    focusSummary: {
      bn: "ফোকাস: Stage 1 থেকে 7 — বিশেষ করে Preposition, Right Form ও Transformation।",
      hi: "फोकस: Stage 1 से 7 — विशेष रूप से Preposition, Right Form और Transformation।",
      en: "Focus on Stages 1 to 7, especially Prepositions, Right Form of Verb, and Transformation.",
    },
    recommendedStages: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    id: "ielts",
    label: "IELTS",
    focusSummary: {
      bn: "ফোকাস: Stage 2, 3, 4, 5, 8 (Complex sentence এবং accuracy)।",
      hi: "फोकस: Stage 2, 3, 4, 5, 8 (Complex sentence और accuracy)।",
      en: "Focus on Stages 2, 3, 4, 5, 8 for complex sentences and grammatical accuracy.",
    },
    recommendedStages: [2, 3, 4, 5, 8],
  },
  {
    id: "spoken",
    label: "Spoken English",
    focusSummary: {
      bn: "ফোকাস: Stage 2 (Tense ও Modals) এবং Stage 8 (Speaking patterns)।",
      hi: "फोकस: Stage 2 (Tense और Modals) और Stage 8 (Speaking patterns)।",
      en: "Focus on Stage 2 (Tenses & Modals) and Stage 8 (Speaking patterns).",
    },
    recommendedStages: [2, 8],
  },
];

export const GRAMMAR_STAGES: GrammarStage[] = [
  {
    stageNumber: 1,
    slug: "stage-1",
    title: "Stage 1: Foundation",
    subtitle: "8 Parts of Speech (in detail), Sentence Basics, Articles & Determiners",
    description: {
      bn: "শব্দের ৮টি শ্রেণি (Noun, Pronoun, Verb, Adjective, Adverb, Preposition, Conjunction, Interjection), বাক্যের গঠন ও Article-এর বিস্তারিত ব্যবহার।",
      hi: "शब्दों के 8 भेद, वाक्य की मूल संरचना और Articles का विस्तृत उपयोग।",
      en: "Master all 8 Parts of Speech individually with sub-types, Sentence Basics, and Articles & Determiners.",
    },
    focusTag: "Base",
    priorityLevels: ["school", "admission"],
  },
  {
    stageNumber: 2,
    slug: "stage-2",
    title: "Stage 2: Core Engine",
    subtitle: "12 Tenses (Present, Past, Future), Auxiliaries & Modals, Subject-Verb Agreement",
    description: {
      bn: "গ্রামারের হৃদয় — ১২টি Tense-এর বিস্তারিত নিয়ম, Auxiliary ও Modal Verb এবং Subject-Verb Agreement।",
      hi: "ग्रामर का दिल — 12 Tense, Auxiliary और Modal Verbs तथा Subject-Verb Agreement।",
      en: "The heart of grammar: 12 Tense forms, Auxiliary & Modal verbs, and Subject-Verb Agreement.",
    },
    focusTag: "Heart of Grammar",
    priorityLevels: ["school", "admission", "ielts", "spoken"],
  },
  {
    stageNumber: 3,
    slug: "stage-3",
    title: "Stage 3: Sentence Building",
    subtitle: "Phrases & Clauses, Simple/Compound/Complex, Conjunctions & Linking Words",
    description: {
      bn: "Phrase ও Clause-এর পার্থক্য, Simple, Compound, Complex বাক্য গঠন এবং Linking Words।",
      hi: "Phrase और Clause, Simple/Compound/Complex वाक्य और Linking Words।",
      en: "Build strong multi-clause sentences using Phrases, Clauses, and Linking Words.",
    },
    focusTag: "Structure",
    priorityLevels: ["admission", "ielts"],
  },
  {
    stageNumber: 4,
    slug: "stage-4",
    title: "Stage 4: Verb Power",
    subtitle: "Non-finite Verbs, Right Form of Verb, Conditionals, Wish / Would rather",
    description: {
      bn: "Infinitive, Gerund, Participle, Right Form of Verb, সব Conditionals এবং Wish/Would rather-এর নিয়ম।",
      hi: "Non-finite Verbs, Right Form of Verb, Conditionals और Wish/Would rather।",
      en: "Master advanced verb usage: Infinitives, Gerunds, Participles, Right Form of Verb, and Conditionals.",
    },
    focusTag: "Verb Mastery",
    priorityLevels: ["school", "admission", "ielts"],
  },
  {
    stageNumber: 5,
    slug: "stage-5",
    title: "Stage 5: Modifiers",
    subtitle: "Degrees of Comparison, Adjective/Adverb Order, Prepositions, Relative Pronouns",
    description: {
      bn: "তুলনার ডিগ্রি, Adjective ও Adverb-এর সঠিক ক্রম, Appropriate Preposition এবং Relative Pronoun।",
      hi: "Degrees of Comparison, Adjective/Adverb क्रम, Prepositions और Relative Pronouns।",
      en: "Refine precision with Degrees of Comparison, Modifier Order, Prepositions, and Relative Pronouns.",
    },
    focusTag: "Precision",
    priorityLevels: ["admission", "ielts"],
  },
  {
    stageNumber: 6,
    slug: "stage-6",
    title: "Stage 6: Transformation",
    subtitle: "Voice, Narration, Sentence Transformation, Question Tags, Causatives",
    description: {
      bn: "Active ও Passive Voice, Direct/Indirect Narration, Sentence Transformation, Question Tags এবং Causative Verbs।",
      hi: "Voice, Narration, Sentence Transformation, Question Tags और Causative Verbs।",
      en: "Transform sentences effortlessly across Voice, Speech, Question Tags, and Causatives.",
    },
    focusTag: "Exam Core",
    priorityLevels: ["school", "admission"],
  },
  {
    stageNumber: 7,
    slug: "stage-7",
    title: "Stage 7: Accuracy & Style",
    subtitle: "Punctuation, Common Errors, Idioms & Phrasal Verbs, Word Formation",
    description: {
      bn: "বিরামচিহ্ন ও Capitalization, প্রচলিত ভুল সংশোধন, Idioms & Phrasal Verbs এবং Prefix/Suffix।",
      hi: "Punctuation, Common Errors, Idioms/Phrasal Verbs और Word Formation।",
      en: "Eliminate common mistakes and polish style with Punctuation, Idioms, Phrasal Verbs, and Word Formation.",
    },
    focusTag: "Polish",
    priorityLevels: ["admission"],
  },
  {
    stageNumber: 8,
    slug: "stage-8",
    title: "Stage 8: Real Use",
    subtitle: "Spoken English Patterns, IELTS Grammar, Paragraph & Essay Structure",
    description: {
      bn: "দৈনন্দিন কথোপকথনের প্যাটার্ন, IELTS High-Band গ্রামার এবং আদর্শ Paragraph ও Essay লেখার কাঠামো।",
      hi: "Spoken English Patterns, IELTS Grammar और Paragraph/Essay संरचना।",
      en: "Apply grammar in real life: Spoken English patterns, IELTS structures, and Essay writing.",
    },
    focusTag: "Fluency",
    priorityLevels: ["ielts", "spoken"],
  },
];

export function getTranslatedText(
  map: Record<Locale, string>,
  translationLocale: string
): string {
  if (translationLocale === "bn" || translationLocale === "hi" || translationLocale === "en") {
    return map[translationLocale];
  }
  return map.en;
}
