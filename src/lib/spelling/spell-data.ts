import {
  SPELL_CATEGORIES,
  SPELL_CATEGORY_GROUPS,
  type SpellCategoryId,
  type SpellCategoryGroupId,
} from "./spell-categories";
import { CURATED_SPELL_WORDS } from "./spell-words-bank";

export {
  SPELL_CATEGORIES,
  SPELL_CATEGORY_GROUPS,
  CURATED_SPELL_WORDS,
  type SpellCategoryId,
  type SpellCategoryGroupId,
};

export type SpellRuleCategory =
  | "common-traps"
  | "i-before-e"
  | "silent-letter"
  | "double-consonant"
  | "suffix-rules";

export interface SpellWord {
  id: string;
  word: string;
  syllables: string[];
  phonetic: string;
  meaningBn: string;
  categories: SpellCategoryId[];
  ruleCategory: SpellRuleCategory;
  commonMistake: string;
  mnemonicBn: string;
  mnemonicEn: string;
  exampleSentence: string;
  difficulty: "easy" | "medium" | "hard";
  isCustom?: boolean;
}

export interface SpellingRule {
  id: SpellRuleCategory;
  title: string;
  titleBn: string;
  formula: string;
  explanationEn: string;
  explanationBn: string;
  examples: { word: string; note: string }[];
  exceptionNote: string;
}

export interface WeakWordRecord {
  wordId: string;
  word: string;
  ruleCategory: SpellRuleCategory;
  mistakes: number;
  correctStreak: number;
  lastWrongAttempt: string;
  nextReviewAt: number;
}

export interface SpellProgressState {
  xp: number;
  streak: number;
  bestStreak: number;
  score: number;
  masteredIds: string[];
  savedIds: string[];
  weakWords: Record<string, WeakWordRecord>;
  mistakePatterns: Record<SpellRuleCategory, number>;
  customWords: SpellWord[];
}

export const SPELL_STORAGE_KEY = "ecp_spell_master_v1";

export const DEFAULT_SPELL_PROGRESS: SpellProgressState = {
  xp: 0,
  streak: 0,
  bestStreak: 0,
  score: 0,
  masteredIds: [],
  savedIds: [],
  weakWords: {},
  mistakePatterns: {
    "common-traps": 0,
    "i-before-e": 0,
    "silent-letter": 0,
    "double-consonant": 0,
    "suffix-rules": 0,
  },
  customWords: [],
};

export const SPELL_BADGES = [
  {
    id: "first-5",
    title: "First 5 Words",
    titleBn: "প্রথম ৫টি শব্দ",
    description: "Master 5 spelling words",
    check: (s: SpellProgressState) => s.masteredIds.length >= 5,
  },
  {
    id: "streak-5",
    title: "5x Streak",
    titleBn: "টানা ৫ সঠিক",
    description: "Get 5 spellings right in a row",
    check: (s: SpellProgressState) => s.bestStreak >= 5,
  },
  {
    id: "trap-buster",
    title: "Trap Buster",
    titleBn: "ভুল ফাঁদ জয়ী",
    description: "Master 15 tricky words",
    check: (s: SpellProgressState) => s.masteredIds.length >= 15,
  },
  {
    id: "level-3",
    title: "Rising Speller",
    titleBn: "লেভেল ৩ অর্জন",
    description: "Reach Level 3 (200+ XP)",
    check: (s: SpellProgressState) => s.xp >= 200,
  },
  {
    id: "ai-collector",
    title: "Word Explorer",
    titleBn: "নতুন শব্দ সংগ্রাহক",
    description: "Add a custom word with AI",
    check: (s: SpellProgressState) => s.customWords.length >= 1,
  },
  {
    id: "spell-master",
    title: "Spell Champion",
    titleBn: "বানান চ্যাম্পিয়ন",
    description: "Master 30+ words",
    check: (s: SpellProgressState) => s.masteredIds.length >= 30,
  },
];

export const SPELLING_RULES: SpellingRule[] = [
  {
    id: "i-before-e",
    title: '"I" Before "E" Except After "C"',
    titleBn: '"C" ছাড়া সাধারণত "I" আগে, "E" পরে',
    formula: "ie (believe, achieve) | c + ei (receive, ceiling)",
    explanationEn:
      'Usually write "i" before "e" (believe, friend), EXCEPT right after the letter "c" (receive, deceive, ceiling) or when it sounds like "ay" (neighbor, weigh).',
    explanationBn:
      'সাধারণত i আগে ও e পরে বসে (believe), তবে c-এর ঠিক পরে বসলে e আগে ও i পরে হয় (receive, ceiling)।',
    examples: [
      { word: "receive", note: "after c -> ei" },
      { word: "believe", note: "no c -> ie" },
      { word: "ceiling", note: "after c -> ei" },
      { word: "neighbour", note: "sounds like 'ay' -> ei" },
    ],
    exceptionNote: "Common exceptions: weird, seize, leisure, protein.",
  },
  {
    id: "silent-letter",
    title: "Silent Letters in English",
    titleBn: "নীরব অক্ষর (Silent Letter) চেনার নিয়ম",
    formula: "kn- (knight) | -bt (debt) | ps- (psychology) | -st- (listen)",
    explanationEn:
      'Many English words keep historical letters that are not pronounced aloud: silent "k" before "n", silent "b" before "t", silent "p" before "s", and silent "t" in "-sten/-stle".',
    explanationBn:
      'ইংরেজি অনেক শব্দে কিছু অক্ষর উচ্চারিত হয় না কিন্তু বানানে লিখতে হয়—যেমন n-এর আগে k (knight), t-এর আগে b (debt), s-এর আগে p (psychology)।',
    examples: [
      { word: "knight", note: "silent k" },
      { word: "debt", note: "silent b" },
      { word: "psychology", note: "silent p" },
      { word: "Wednesday", note: "silent d" },
    ],
    exceptionNote: "Always break the word into visual chunks when memorizing.",
  },
  {
    id: "double-consonant",
    title: "Doubling the Final Consonant",
    titleBn: "শেষের Consonant ডাবল করার নিয়ম",
    formula: "1 Vowel + 1 Consonant (CVC) + Suffix -> Double Consonant",
    explanationEn:
      "When a short 1-syllable word (or stressed final syllable) ends in 1 vowel + 1 consonant (CVC), double the last consonant before adding -ing, -ed, or -er.",
    explanationBn:
      "শব্দের শেষে ১টি vowel + ১টি consonant থাকলে -ing বা -ed যোগ করার আগে শেষের consonant-টি ডাবল হয় (run -> running, stop -> stopped)।",
    examples: [
      { word: "running", note: "run + n + ing" },
      { word: "stopped", note: "stop + p + ed" },
      { word: "beginning", note: "begin + n + ing" },
      { word: "occurred", note: "occur + r + ed" },
    ],
    exceptionNote: "Do not double w, x, or y (playing, fixed, snowed).",
  },
  {
    id: "suffix-rules",
    title: "Adding -ing, -ed, -ly & Dropping -e",
    titleBn: "-ing, -ed, -ly যোগ ও শেষের -e বাদ দেওয়ার নিয়ম",
    formula: "make -> making | happy -> happily | careful -> carefully",
    explanationEn:
      'Drop silent final "-e" before adding vowel suffixes (-ing, -ed, -able), keep "-e" before consonant suffixes (-ly, -ful), and change consonant + "y" to "i" before -ly or -ed.',
    explanationBn:
      'শেষে নীরব e থাকলে -ing যোগের আগে e বাদ যায় (write -> writing), আর consonant + y থাকলে -ly/-ed-এর আগে y বদলে i হয় (happy -> happily)।',
    examples: [
      { word: "writing", note: "drop final e" },
      { word: "happily", note: "y -> i + ly" },
      { word: "carefully", note: "careful + ly (double l)" },
      { word: "truly", note: "exception: drop e before ly" },
    ],
    exceptionNote: "Exceptions: truly, duly, argument (drop e).",
  },
  {
    id: "common-traps",
    title: "Most Misspelled Everyday Traps",
    titleBn: "সবচেয়ে বেশি ভুল হওয়া শব্দগুলো",
    formula: "sep-A-rate | def-i-nite-ly | ac-COM-mo-date | ne-CES-sary",
    explanationEn:
      "Words with unstressed vowels or double-letter pairs cause most everyday and IELTS writing errors. Use visual memory tricks to lock them in.",
    explanationBn:
      "অনেক শব্দে ডাবল অক্ষর বা মাঝের ভাওয়েল (a/e/i) নিয়ে বিভ্রান্তি হয়। ছোট ছন্দ বা মেমরি ট্রিক দিয়ে এগুলো সহজে মনে রাখা যায়।",
    examples: [
      { word: "separate", note: "sep-A-rate (not e)" },
      { word: "definitely", note: "finite inside de-finite-ly" },
      { word: "necessary", note: "1 collar (c), 2 sleeves (ss)" },
      { word: "accommodate", note: "double c, double m" },
    ],
    exceptionNote: "Practice these 5 minutes daily until they become automatic.",
  },
];

export function getLevelFromXp(xp: number): {
  level: number;
  title: string;
  titleBn: string;
  currentXpInLevel: number;
  xpForNextLevel: number;
} {
  const xpPerLevel = 100;
  const level = Math.floor(xp / xpPerLevel) + 1;
  const titles = [
    { en: "Word Starter", bn: "শব্দ শিক্ষার্থী" },
    { en: "Syllable Explorer", bn: "সিলেবল অন্বেষক" },
    { en: "Rule Builder", bn: "নিয়ম দক্ষ" },
    { en: "Trap Buster", bn: "ভুল ফাঁদ জয়ী" },
    { en: "Spell Master", bn: "বানান মাস্টার" },
  ];
  const idx = Math.min(titles.length - 1, level - 1);
  return {
    level,
    title: titles[idx].en,
    titleBn: titles[idx].bn,
    currentXpInLevel: xp % xpPerLevel,
    xpForNextLevel: xpPerLevel,
  };
}
