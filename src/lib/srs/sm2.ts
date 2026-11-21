/**
 * Pure SM-2 Spaced Repetition Algorithm & Scheduling Functions
 * Specification: ECP_Exercises_SRS_Spec.md §6.2, §6.3
 */

import type {
  SRSRating,
  SRSState,
  UserVocabularySRSItem,
  SM2CalculationInput,
  SM2CalculationResult,
} from "./types.ts";

/**
 * Maps rating to SM-2 numeric quality (0-5)
 * again -> 0, hard -> 3, good -> 4, easy -> 5
 */
export function ratingToQuality(rating: SRSRating): number {
  switch (rating) {
    case "again":
      return 0;
    case "hard":
      return 3;
    case "good":
      return 4;
    case "easy":
      return 5;
  }
}

/**
 * Calculates next SM-2 review parameters
 */
export function calculateSM2(input: SM2CalculationInput): SM2CalculationResult {
  const {
    reviewStage,
    easeFactor,
    intervalDays,
    lapseCount,
    rating,
    now = new Date(),
  } = input;

  const q = ratingToQuality(rating);
  let nextStage = reviewStage;
  let nextInterval = intervalDays;
  let nextLapse = lapseCount;

  if (q < 3) {
    // Failure / lapse
    nextInterval = 1;
    nextLapse += 1;
    nextStage = 0;
  } else {
    // Successful recall
    if (reviewStage === 0) {
      nextInterval = 1;
      nextStage = 1;
    } else if (reviewStage === 1) {
      nextInterval = 6;
      nextStage = 2;
    } else {
      nextInterval = Math.round(intervalDays * easeFactor);
      nextStage = Math.min(8, reviewStage + 1);
    }
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const delta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  const updatedEase = Math.max(1.30, parseFloat((easeFactor + delta).toFixed(2)));

  const reviewTime = new Date(now.getTime());
  const nextReviewTime = new Date(
    now.getTime() + nextInterval * 24 * 60 * 60 * 1000
  );

  return {
    reviewStage: nextStage,
    easeFactor: updatedEase,
    intervalDays: nextInterval,
    lapseCount: nextLapse,
    lastReviewedAt: reviewTime.toISOString(),
    nextReviewAt: nextReviewTime.toISOString(),
  };
}

/**
 * Creates default SRS state for a freshly saved vocabulary word
 */
export function createDefaultSRSState(now: Date = new Date()): SRSState {
  return {
    reviewStage: 0,
    easeFactor: 2.50,
    intervalDays: 0,
    nextReviewAt: now.toISOString(),
    lapseCount: 0,
  };
}

/**
 * Filters and sorts due review items per Spec §6.3:
 * - nextReviewAt <= now
 * - ordered by nextReviewAt asc, then reviewStage asc
 * - bounded by dailyLimit (default 50)
 */
export function getDueReviewItems(
  items: UserVocabularySRSItem[],
  now: Date = new Date(),
  dailyLimit: number = 50
): UserVocabularySRSItem[] {
  const nowMs = now.getTime();

  return items
    .filter((item) => new Date(item.nextReviewAt).getTime() <= nowMs)
    .sort((a, b) => {
      const timeDiff =
        new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime();
      if (timeDiff !== 0) return timeDiff;
      return a.reviewStage - b.reviewStage;
    })
    .slice(0, dailyLimit);
}
