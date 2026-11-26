import type { Locale } from "@/lib/i18n";

export type GrammarLevelFilter = "all" | "school" | "admission" | "ielts" | "spoken";

export interface GrammarTopic {
  id: string;
  stageNumber: number;
  title: string;
  formula: string;
  rules: Record<Locale, string>;
  examples: string[];
  practicePrompt: string;
  levels: Exclude<GrammarLevelFilter, "all">[];
}

export interface GrammarStage {
  stageNumber: number;
  title: string;
  subtitle: string;
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
    title: "Stage 1: Foundation",
    subtitle: "Parts of Speech, Sentence Basics, Articles & Determiners",
    focusTag: "Base",
    priorityLevels: ["school", "admission"],
  },
  {
    stageNumber: 2,
    title: "Stage 2: Core Engine",
    subtitle: "12 Tenses, Auxiliary & Modal Verbs, Subject-Verb Agreement",
    focusTag: "Heart of Grammar",
    priorityLevels: ["school", "admission", "ielts", "spoken"],
  },
  {
    stageNumber: 3,
    title: "Stage 3: Sentence Building",
    subtitle: "Phrases & Clauses, Simple/Compound/Complex, Linking Words",
    focusTag: "Structure",
    priorityLevels: ["admission", "ielts"],
  },
  {
    stageNumber: 4,
    title: "Stage 4: Verb Power",
    subtitle: "Non-finite Verbs, Right Form of Verb, Conditionals, Wish/Would rather",
    focusTag: "Verb Mastery",
    priorityLevels: ["school", "admission", "ielts"],
  },
  {
    stageNumber: 5,
    title: "Stage 5: Modifiers",
    subtitle: "Degrees of Comparison, Adjective/Adverb Order, Prepositions, Relative Pronouns",
    focusTag: "Precision",
    priorityLevels: ["admission", "ielts"],
  },
  {
    stageNumber: 6,
    title: "Stage 6: Transformation",
    subtitle: "Voice, Narration, Sentence Transformation, Question Tags, Causatives",
    focusTag: "Exam Core",
    priorityLevels: ["school", "admission"],
  },
  {
    stageNumber: 7,
    title: "Stage 7: Accuracy & Style",
    subtitle: "Punctuation, Common Errors, Idioms & Phrasal Verbs, Word Formation",
    focusTag: "Polish",
    priorityLevels: ["admission"],
  },
  {
    stageNumber: 8,
    title: "Stage 8: Real Use",
    subtitle: "Spoken English Patterns, IELTS Grammar, Paragraph & Essay Structure",
    focusTag: "Fluency",
    priorityLevels: ["ielts", "spoken"],
  },
];

export function getTopicRule(topic: GrammarTopic, translationLocale: string): string {
  if (translationLocale === "bn" || translationLocale === "hi" || translationLocale === "en") {
    return topic.rules[translationLocale];
  }
  return topic.rules.en;
}
