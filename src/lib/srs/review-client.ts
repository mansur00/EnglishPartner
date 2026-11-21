import type { SRSRating } from "./types.ts";

export interface LogReviewEventClientParams {
  lemma: string;
  rating: SRSRating;
  reviewStage?: number;
  intervalDays?: number;
  easeFactor?: string | number;
  userVocabularyId?: string;
}

const LOCAL_REVIEW_EVENTS_KEY = "ecp_pending_review_events";

/**
 * Client-side logging helper for SRS review events.
 * Posts to /api/v1/srs/review-events and gracefully falls back to local buffer if offline.
 */
export async function logReviewEventClient(
  params: LogReviewEventClientParams
): Promise<{ success: boolean; source: "api" | "local_queue" }> {
  try {
    const res = await fetch("/api/v1/srs/review-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      return { success: true, source: "api" };
    }
  } catch {
    // Network offline or fetch failed
  }

  // Fallback to local storage queue
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_REVIEW_EVENTS_KEY);
      const queue = stored ? JSON.parse(stored) : [];
      queue.push({
        ...params,
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        reviewedAt: new Date().toISOString(),
      });
      localStorage.setItem(LOCAL_REVIEW_EVENTS_KEY, JSON.stringify(queue.slice(-200)));
      return { success: true, source: "local_queue" };
    } catch {
      // Local storage unavailable
    }
  }

  return { success: true, source: "local_queue" };
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
