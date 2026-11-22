/**
 * Phase 2 Milestone 2A: Listening Comprehension Quiz Engine
 * Strictly adheres to ECP_Exercises_SRS_Spec.md §4.1 and Brief §10.4.
 * Pure logic engine: zero hardcoded visual styles, zero Gemini in product code (AUD-A11).
 */

import { z } from "zod";
import type { ListeningQuizQuestion } from "@/content/seed/exercises";

// Spec §4.1 Zod Schema for multiple_choice / listening comprehension item data
export const MultipleChoiceOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  textBn: z.string().optional(),
});
export type MultipleChoiceOption = z.infer<typeof MultipleChoiceOptionSchema>;

export const ListeningQuizItemDataSchema = z.object({
  options: z.array(MultipleChoiceOptionSchema).min(2).max(5),
  correct_option_id: z.string().min(1),
  allow_multiple: z.boolean().default(false),
});
export type ListeningQuizItemData = z.infer<typeof ListeningQuizItemDataSchema>;

export interface QuizAnswerEvaluation {
  isCorrect: boolean;
  isSkipped: boolean;
  selectedOptionId: string | null;
  correctOptionId: string;
  scoreDelta: number;
  feedbackBn: string;
  explanationBn: string;
}

export type QuizPerformanceRating = "perfect" | "proficient" | "developing" | "needs_review";

export interface QuizScoreSummary {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  percentage: number;
  rating: QuizPerformanceRating;
  ratingLabelEn: string;
  ratingLabelBn: string;
}

/**
 * Evaluates learner selection against question key.
 * Never judges learner; returns constructive educational feedback.
 */
export function evaluateQuizAnswer(
  question: ListeningQuizQuestion,
  selectedOptionId: string | null
): QuizAnswerEvaluation {
  if (!selectedOptionId) {
    return {
      isCorrect: false,
      isSkipped: true,
      selectedOptionId: null,
      correctOptionId: question.correctOptionId,
      scoreDelta: 0,
      feedbackBn: "প্রশ্নটি বাদ দেওয়া হয়েছে।",
      explanationBn: question.explanationBn,
    };
  }

  const isCorrect = selectedOptionId === question.correctOptionId;

  return {
    isCorrect,
    isSkipped: false,
    selectedOptionId,
    correctOptionId: question.correctOptionId,
    scoreDelta: isCorrect ? 1 : 0,
    feedbackBn: isCorrect
      ? "চমৎকার! সঠিক উত্তর দিয়েছেন।"
      : "ঠিক হয়নি। নিচের ব্যাখ্যাটি ভালো করে লক্ষ্য করুন।",
    explanationBn: question.explanationBn,
  };
}

/**
 * Calculates score metrics and pedagogical performance tier.
 */
export function calculateQuizScore(
  totalQuestions: number,
  correctCount: number,
  skippedCount: number = 0
): QuizScoreSummary {
  const safeTotal = Math.max(1, totalQuestions);
  const safeCorrect = Math.max(0, Math.min(correctCount, safeTotal));
  const safeSkipped = Math.max(0, Math.min(skippedCount, safeTotal - safeCorrect));
  const incorrectCount = Math.max(0, safeTotal - safeCorrect - safeSkipped);
  const percentage = Math.round((safeCorrect / safeTotal) * 100);

  let rating: QuizPerformanceRating = "needs_review";
  let ratingLabelEn = "Keep Practicing";
  let ratingLabelBn = "আরও অনুশীলন প্রয়োজন";

  if (percentage === 100) {
    rating = "perfect";
    ratingLabelEn = "Mastery Achieved!";
    ratingLabelBn = "অসাধারণ দক্ষতা!";
  } else if (percentage >= 75) {
    rating = "proficient";
    ratingLabelEn = "Great Comprehension";
    ratingLabelBn = "খুব ভালো বোঝাপড়া";
  } else if (percentage >= 50) {
    rating = "developing";
    ratingLabelEn = "Good Effort";
    ratingLabelBn = "ভালো প্রচেষ্টা";
  }

  return {
    totalQuestions: safeTotal,
    correctCount: safeCorrect,
    incorrectCount,
    skippedCount: safeSkipped,
    percentage,
    rating,
    ratingLabelEn,
    ratingLabelBn,
  };
}

export interface MinimalDialogueLine {
  speakerName: string;
  englishText: string;
  translationBn: string;
}

/**
 * Contextual distractor generator for fallback listening quizzes.
 */
const FALLBACK_DISTRACTORS = [
  { text: "I do not need this right now.", textBn: "আমার এখনই এটা দরকার নেই।" },
  { text: "Could you show me another item?", textBn: "আমাকে অন্য একটি জিনিস দেখাতে পারেন?" },
  { text: "I will come back a bit later.", textBn: "আমি একটু পরে আবার আসব।" },
  { text: "Thank you for the help.", textBn: "সাহায্যের জন্য ধন্যবাদ।" },
  { text: "Where can I find the counter?", textBn: "কাউন্টারটি কোথায় পাব?" },
];

/**
 * Generates robust fallback listening quizzes from scenario dialogue lines.
 */
export function generateFallbackQuizzes(
  stepSlug: string,
  lines: MinimalDialogueLine[],
  maxCount: number = 3
): ListeningQuizQuestion[] {
  const selectedLines = lines.slice(0, maxCount);

  return selectedLines.map((line, idx) => {
    const distractors = [
      FALLBACK_DISTRACTORS[idx % FALLBACK_DISTRACTORS.length],
      FALLBACK_DISTRACTORS[(idx + 1) % FALLBACK_DISTRACTORS.length],
    ];

    const options = [
      { id: "a", text: line.englishText, textBn: line.translationBn },
      { id: "b", text: distractors[0].text, textBn: distractors[0].textBn },
      { id: "c", text: distractors[1].text, textBn: distractors[1].textBn },
    ];

    return {
      id: `${stepSlug}-auto-q${idx + 1}`,
      stepSlug,
      question: `What did ${line.speakerName} say?`,
      questionBn: `${line.speakerName} কী বলেছিলেন?`,
      audioPrompt: line.englishText,
      options,
      correctOptionId: "a",
      explanationBn: `সঠিক উত্তর! ${line.speakerName} বলেছিলেন: "${line.englishText}" (${line.translationBn})।`,
    };
  });
}
