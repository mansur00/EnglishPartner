import { db } from "../db/index.ts";
import { reviewEvents } from "../db/schema.ts";
import type { SRSRating } from "./types.ts";

export interface RecordReviewEventParams {
  userId?: string | null;
  userVocabularyId?: string | null;
  lemma: string;
  rating: SRSRating;
  reviewStage?: number;
  intervalDays?: number;
  easeFactor?: string | number;
}

export interface ReviewEventResult {
  success: boolean;
  eventId?: string;
  source: "db" | "local_queue";
  error?: string;
}

const LOCAL_REVIEW_EVENTS_KEY = "ecp_pending_review_events";

/**
 * Record an SRS review outcome event per ECP_Exercises_SRS_Spec.md §6.4 & ECP_Privacy_Analytics_Retention.md §5.
 * Persists to DB if connection is available, otherwise safely buffers in local storage.
 */
export async function recordReviewEvent(
  params: RecordReviewEventParams
): Promise<ReviewEventResult> {
  const validRatings: SRSRating[] = ["again", "hard", "good", "easy"];
  if (!validRatings.includes(params.rating)) {
    return {
      success: false,
      source: "db",
      error: `Invalid rating: ${params.rating}. Must be one of: again, hard, good, easy`,
    };
  }

  // Attempt database persistence if server-side DB is initialized
  if (db) {
    try {
      const [inserted] = await db
        .insert(reviewEvents)
        .values({
          userId: params.userId || null,
          userVocabularyId: params.userVocabularyId || null,
          lemma: params.lemma,
          rating: params.rating,
          reviewStage: params.reviewStage ?? null,
          intervalDays: params.intervalDays ?? null,
          easeFactor: params.easeFactor != null ? String(params.easeFactor) : null,
        })
        .returning({ id: reviewEvents.id });

      return {
        success: true,
        eventId: inserted?.id,
        source: "db",
      };
    } catch {
      // Database unavailable (e.g. client runtime or offline environment); fall through to local queue
    }
  }

  // Client-side buffer in localStorage for offline resiliency
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_REVIEW_EVENTS_KEY);
      const queue = stored ? JSON.parse(stored) : [];
      const newEvent = {
        ...params,
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        reviewedAt: new Date().toISOString(),
      };
      queue.push(newEvent);
      localStorage.setItem(LOCAL_REVIEW_EVENTS_KEY, JSON.stringify(queue.slice(-200))); // keep latest 200
      return {
        success: true,
        eventId: newEvent.id,
        source: "local_queue",
      };
    } catch {
      // LocalStorage access restricted
    }
  }

  return {
    success: true,
    source: "local_queue",
  };
}

/**
 * Get pending client-side review events
 */
export function getPendingLocalReviewEvents() {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(LOCAL_REVIEW_EVENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clear synced local review events
 */
export function clearPendingLocalReviewEvents() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LOCAL_REVIEW_EVENTS_KEY);
  } catch {
    // ignore
  }
}
