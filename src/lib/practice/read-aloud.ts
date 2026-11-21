/**
 * Business logic, speech normalization, and comparison for Read Aloud practice mode
 * Complies with ECP_Exercises_SRS_Spec.md §4.6 and ECP_Audio_Voice_Guide.md §10.2
 */

export interface WordTokenComparison {
  word: string;
  isMatched: boolean;
}

export interface SpokenComparisonResult {
  tokens: WordTokenComparison[];
  matchedWords: string[];
  missingWords: string[];
  extraWords: string[];
  matchedCount: number;
  totalTargetWords: number;
  matchPercentage: number;
  feedbackBn: string;
}

export type SelfCheckRating = "needs_practice" | "getting_there" | "clear";

const CONTRACTION_MAP: Record<string, string> = {
  "i'm": "i am",
  "it's": "it is",
  "that's": "that is",
  "don't": "do not",
  "can't": "cannot",
  "won't": "will not",
  "i'll": "i will",
  "you're": "you are",
  "we're": "we are",
  "they're": "they are",
  "he's": "he is",
  "she's": "she is",
  "let's": "let us",
};

/**
 * Normalizes a word or sentence for spoken comparison:
 * Lowercases, strips punctuation, normalizes contractions and whitespace.
 */
export function normalizeSpokenText(text: string): string {
  if (!text) return "";

  let cleaned = text.trim().toLowerCase();

  // Replace contractions with expanded words
  for (const [contraction, expanded] of Object.entries(CONTRACTION_MAP)) {
    cleaned = cleaned.replace(new RegExp(`\\b${contraction}\\b`, "g"), expanded);
  }

  // Strip non-alphanumeric characters (keep single spaces)
  cleaned = cleaned.replace(/[^a-z0-9\s]/g, " ");

  return cleaned.replace(/\s+/g, " ").trim();
}

/**
 * Compares recognized spoken words against the target dialogue sentence.
 * Respects brief §9.3 & §10.2: Never treats score as absolute fact; highlights
 * which words were heard and provides constructive, actionable Bengali advice.
 */
export function compareSpokenSentence(
  spokenText: string,
  targetText: string
): SpokenComparisonResult {
  const normTarget = normalizeSpokenText(targetText);
  const normSpoken = normalizeSpokenText(spokenText);

  const targetWords = normTarget ? normTarget.split(" ") : [];
  const spokenWords = normSpoken ? normSpoken.split(" ") : [];

  const spokenSet = new Set(spokenWords);
  const matchedWords: string[] = [];
  const missingWords: string[] = [];
  const tokens: WordTokenComparison[] = [];

  for (const word of targetWords) {
    if (spokenSet.has(word)) {
      matchedWords.push(word);
      tokens.push({ word, isMatched: true });
    } else {
      missingWords.push(word);
      tokens.push({ word, isMatched: false });
    }
  }

  const targetSet = new Set(targetWords);
  const extraWords = spokenWords.filter((w) => !targetSet.has(w));

  const totalTargetWords = targetWords.length;
  const matchedCount = matchedWords.length;
  const matchPercentage =
    totalTargetWords > 0 ? Math.round((matchedCount / totalTargetWords) * 100) : 100;

  let feedbackBn = "";
  if (matchPercentage === 100) {
    feedbackBn = "চমৎকার! প্রতিটি শব্দ অত্যন্ত স্পষ্ট ও সুন্দরভাবে উচ্চারিত হয়েছে।";
  } else if (matchPercentage >= 50) {
    const missingStr = missingWords.slice(0, 2).map((w) => `"${w}"`).join(" ও ");
    feedbackBn = `বেশ ভালো হয়েছে! শুধু ${missingStr} শব্দটির উচ্চারণ মডেল অডিওর সাথে মিলিয়ে আরও একটু স্পষ্ট করার চেষ্টা করুন।`;
  } else if (matchPercentage > 0) {
    feedbackBn = "চেষ্টাটি প্রশংসনীয়! মডেল অডিওটি আরেকবার শুনুন এবং স্বাভাবিক গতিতে পুনরায় বলুন।";
  } else {
    feedbackBn = "মাইক্রোফোনে কোনো স্পষ্ট শব্দ ধরা পড়েনি। শান্ত পরিবেশে আরেকবার চেষ্টা করুন।";
  }

  return {
    tokens,
    matchedWords,
    missingWords,
    extraWords,
    matchedCount,
    totalTargetWords,
    matchPercentage,
    feedbackBn,
  };
}

/**
 * Self-check feedback descriptions for each rating
 */
export const SELF_CHECK_RATINGS: {
  rating: SelfCheckRating;
  labelEn: string;
  labelBn: string;
  descriptionBn: string;
}[] = [
  {
    rating: "needs_practice",
    labelEn: "Needs practice",
    labelBn: "আবার চেষ্টা করি",
    descriptionBn: "কিছু শব্দ বলতে একটু জড়তা এসেছে, আরেকবার চর্চা দরকার।",
  },
  {
    rating: "getting_there",
    labelEn: "Getting there",
    labelBn: "মোটামুটি হয়েছে",
    descriptionBn: "বেশিরভাগ কথা বোঝা গেছে, গতি ও টান আরও স্বাভাবিক করা সম্ভব।",
  },
  {
    rating: "clear",
    labelEn: "Felt clear & natural",
    labelBn: "স্পষ্ট ও স্বাভাবিক",
    descriptionBn: "উচ্চারণ ও স্বরভঙ্গি মডেল অডিওর মতোই সাবলীল মনে হয়েছে।",
  },
];
