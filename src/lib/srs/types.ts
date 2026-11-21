/**
 * Type definitions for Spaced Repetition System (SRS) using SM-2
 * Complies with ECP_Exercises_SRS_Spec.md §6
 */

export type SRSRating = "again" | "hard" | "good" | "easy";

export interface SRSState {
  reviewStage: number; // 0 to 8
  easeFactor: number;  // min 1.30, default 2.50
  intervalDays: number;// days until next review
  nextReviewAt: string;// ISO timestamp
  lastReviewedAt?: string;
  lapseCount: number;  // number of times item was forgotten (again rating)
}

export interface UserVocabularySRSItem extends SRSState {
  lemma: string;
}

export interface SM2CalculationInput {
  reviewStage: number;
  easeFactor: number;
  intervalDays: number;
  lapseCount: number;
  rating: SRSRating;
  now?: Date;
}

export interface SM2CalculationResult {
  reviewStage: number;
  easeFactor: number;
  intervalDays: number;
  lapseCount: number;
  nextReviewAt: string;
  lastReviewedAt: string;
}
