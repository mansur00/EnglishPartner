export type SpellCategoryGroupId =
  | "all"
  | "core_traps"
  | "spelling_rules"
  | "confusing_words"
  | "exam_goal"
  | "bangla_special"
  | "personal_special";

export type SpellCategoryId =
  // Group A: Core Traps (5)
  | "common-traps"
  | "i-before-e"
  | "silent-letter"
  | "double-consonant"
  | "suffix-rules"
  // Group B: Spelling Rules (12)
  | "prefix-rules"
  | "plural-rules"
  | "latin-greek-plurals"
  | "keep-the-e"
  | "able-vs-ible"
  | "ance-vs-ence"
  | "ant-vs-ent"
  | "tion-sion-cian"
  | "ous-ious-eous"
  | "tricky-patterns"
  | "irregular-verbs"
  | "days-months-numbers"
  // Group C: Confusing Words (5)
  | "homophones"
  | "confusing-pairs"
  | "apostrophe-contractions"
  | "compound-words"
  | "british-vs-american"
  // Group D: Exam & Goal (5)
  | "ielts-academic"
  | "ielts-general"
  | "ssc-hsc-admission"
  | "gre-sat"
  | "spelling-bee"
  // Group E: Bangla Speaker Special (1)
  | "bangla-mistakes"
  // Group F: Personal & Special (7)
  | "my-mistakes"
  | "saved-words"
  | "daily-word"
  | "word-families"
  | "long-word-challenge"
  | "borrowed-words"
  | "ai-added-words";

export interface SpellCategoryGroup {
  id: SpellCategoryGroupId;
  label: string;
  labelBn: string;
}

export interface SpellCategoryMeta {
  id: SpellCategoryId;
  label: string;
  group: Exclude<SpellCategoryGroupId, "all">;
  description: string;
  order: number;
}

export const SPELL_CATEGORY_GROUPS: SpellCategoryGroup[] = [
  { id: "all", label: "All", labelBn: "সব শব্দ" },
  { id: "core_traps", label: "Core Traps", labelBn: "মূল ভুল ফাঁদ" },
  { id: "spelling_rules", label: "Spelling Rules", labelBn: "বানানের নিয়ম" },
  { id: "confusing_words", label: "Confusing Words", labelBn: "বিভ্রান্তিকর শব্দ" },
  { id: "exam_goal", label: "Exam & Goal", labelBn: "পরীক্ষা ও লক্ষ্য" },
  { id: "bangla_special", label: "Bangla Special", labelBn: "বাংলাভাষী বিশেষ" },
  { id: "personal_special", label: "Personal & Special", labelBn: "ব্যক্তিগত ও বিশেষ" },
];

export const SPELL_CATEGORIES: SpellCategoryMeta[] = [
  // Group A: Core Traps
  { id: "common-traps", label: "Common Traps", group: "core_traps", description: "Most frequently misspelled everyday words", order: 1 },
  { id: "i-before-e", label: "I Before E", group: "core_traps", description: "Words following or breaking the ie/ei rule", order: 2 },
  { id: "silent-letter", label: "Silent Letters", group: "core_traps", description: "Letters you write but do not pronounce", order: 3 },
  { id: "double-consonant", label: "Double Consonant", group: "core_traps", description: "Doubling consonants in suffixes and roots", order: 4 },
  { id: "suffix-rules", label: "Suffix Rules", group: "core_traps", description: "Adding -ing, -ed, -ly and dropping final -e", order: 5 },

  // Group B: Spelling Rules
  { id: "prefix-rules", label: "Prefix Rules", group: "spelling_rules", description: "Adding un-, dis-, mis-, im-, il-, ir- cleanly", order: 6 },
  { id: "plural-rules", label: "Plural Rules", group: "spelling_rules", description: "-ies, -es, -ves and irregular plurals", order: 7 },
  { id: "latin-greek-plurals", label: "Latin & Greek Plurals", group: "spelling_rules", description: "Academic plurals like analyses, crises, criteria", order: 8 },
  { id: "keep-the-e", label: "Keep the E", group: "spelling_rules", description: "Keeping silent e after soft c and g", order: 9 },
  { id: "able-vs-ible", label: "-able vs -ible", group: "spelling_rules", description: "Choosing between -able and -ible endings", order: 10 },
  { id: "ance-vs-ence", label: "-ance vs -ence", group: "spelling_rules", description: "Noun endings in -ance and -ence", order: 11 },
  { id: "ant-vs-ent", label: "-ant vs -ent", group: "spelling_rules", description: "Adjective and noun endings in -ant/-ent", order: 12 },
  { id: "tion-sion-cian", label: "-tion / -sion / -cian", group: "spelling_rules", description: "Choosing -tion, -sion, or profession -cian", order: 13 },
  { id: "ous-ious-eous", label: "-ous / -ious / -eous", group: "spelling_rules", description: "Adjective endings with tricky vowel pairs", order: 14 },
  { id: "tricky-patterns", label: "Tricky Patterns", group: "spelling_rules", description: "ough, ph, ch=k, sc and similar patterns", order: 15 },
  { id: "irregular-verbs", label: "Irregular Verbs", group: "spelling_rules", description: "Past and participle forms with tricky spelling", order: 16 },
  { id: "days-months-numbers", label: "Days, Months & Numbers", group: "spelling_rules", description: "Commonly misspelled calendar and number words", order: 17 },

  // Group C: Confusing Words
  { id: "homophones", label: "Homophones", group: "confusing_words", description: "Same sound, different spelling and meaning", order: 18 },
  { id: "confusing-pairs", label: "Confusing Pairs", group: "confusing_words", description: "Similar sounding pairs like affect vs effect", order: 19 },
  { id: "apostrophe-contractions", label: "Apostrophes", group: "confusing_words", description: "Contractions vs possessives (it's/its)", order: 20 },
  { id: "compound-words", label: "Compound Words", group: "confusing_words", description: "One word vs two words (a lot, everyone)", order: 21 },
  { id: "british-vs-american", label: "British vs American", group: "confusing_words", description: "Regional spelling differences (colour/color)", order: 22 },

  // Group D: Exam & Goal
  { id: "ielts-academic", label: "IELTS Academic", group: "exam_goal", description: "High-frequency Task 1 & 2 academic words", order: 23 },
  { id: "ielts-general", label: "IELTS General & Daily", group: "exam_goal", description: "Practical everyday and letter-writing words", order: 24 },
  { id: "ssc-hsc-admission", label: "SSC / HSC & Admission", group: "exam_goal", description: "Board exam and university admission vocabulary", order: 25 },
  { id: "gre-sat", label: "GRE / SAT", group: "exam_goal", description: "Advanced test-prep vocabulary", order: 26 },
  { id: "spelling-bee", label: "Spelling Bee", group: "exam_goal", description: "Challenging competition-level words", order: 27 },

  // Group E: Bangla Speaker Special
  { id: "bangla-mistakes", label: "Bangla Speaker Mistakes", group: "bangla_special", description: "s-cluster, v/b, f/ph, sh, z/j & ending clusters", order: 28 },

  // Group F: Personal & Special
  { id: "my-mistakes", label: "My Mistakes", group: "personal_special", description: "Words you missed during tests", order: 29 },
  { id: "saved-words", label: "Saved Words", group: "personal_special", description: "Your bookmarked words", order: 30 },
  { id: "daily-word", label: "Daily Word", group: "personal_special", description: "Today's spotlight spelling word", order: 31 },
  { id: "word-families", label: "Word Families", group: "personal_special", description: "Root words with prefix and suffix branches", order: 32 },
  { id: "long-word-challenge", label: "Long Word Challenge", group: "personal_special", description: "Multi-syllable words broken into chunks", order: 33 },
  { id: "borrowed-words", label: "Borrowed Words", group: "personal_special", description: "French, German & Greek loanwords in English", order: 34 },
  { id: "ai-added-words", label: "AI Added Words", group: "personal_special", description: "Custom words you added via AI search", order: 35 },
];
