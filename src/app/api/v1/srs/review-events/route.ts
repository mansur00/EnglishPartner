import { getAuthenticatedUser } from "@/lib/supabase/server";
import { recordReviewEvent } from "@/lib/srs/review-service";
import { SRSRating } from "@/lib/srs/types";

/**
 * POST /api/v1/srs/review-events
 * Logs an SRS review outcome event per ECP_Exercises_SRS_Spec.md §6.4 & ECP_Privacy_Analytics_Retention.md §5.
 */
export async function POST(request: Request) {
  let body: {
    lemma?: string;
    rating?: string;
    reviewStage?: number;
    intervalDays?: number;
    easeFactor?: string;
    userVocabularyId?: string;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "INVALID_BODY", message: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const { lemma, rating, reviewStage, intervalDays, easeFactor, userVocabularyId } = body;

  if (!lemma || typeof lemma !== "string") {
    return Response.json(
      { error: "INVALID_LEMMA", message: "lemma string is required" },
      { status: 400 }
    );
  }

  const validRatings: SRSRating[] = ["again", "hard", "good", "easy"];
  if (!rating || !validRatings.includes(rating as SRSRating)) {
    return Response.json(
      {
        error: "INVALID_RATING",
        message: "rating must be one of: again, hard, good, easy",
      },
      { status: 400 }
    );
  }

  // Session user if authenticated
  const user = await getAuthenticatedUser(request);

  const result = await recordReviewEvent({
    userId: user?.id || null,
    userVocabularyId: userVocabularyId || null,
    lemma,
    rating: rating as SRSRating,
    reviewStage: typeof reviewStage === "number" ? reviewStage : undefined,
    intervalDays: typeof intervalDays === "number" ? intervalDays : undefined,
    easeFactor: typeof easeFactor === "string" ? easeFactor : undefined,
  });

  return Response.json(
    {
      success: true,
      eventId: result.eventId,
      source: result.source,
      loggedAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
