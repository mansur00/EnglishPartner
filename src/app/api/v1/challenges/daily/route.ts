import { getAuthenticatedUser } from "@/lib/supabase/server";
import {
  getOrCreateDailyChallenge,
  completeDailyChallenge,
  formatChallengeDate,
} from "@/lib/challenges/daily-challenge-service";

/**
 * GET /api/v1/challenges/daily
 * Retrieves or creates today's conversation challenge for the user per Spec §7.
 */
export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  const userId = user?.id || "guest-user";

  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date") || formatChallengeDate();
  const levelParam = searchParams.get("level") || "A1";

  const challenge = await getOrCreateDailyChallenge(userId, dateParam, levelParam);

  return Response.json(
    {
      challenge,
      retrievedAt: new Date().toISOString(),
    },
    { status: 200 }
  );
}

/**
 * POST /api/v1/challenges/daily
 * Marks a daily challenge as completed.
 */
export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  const userId = user?.id || "guest-user";

  let body: { challengeId?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "INVALID_BODY", message: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const { challengeId } = body;
  if (!challengeId || typeof challengeId !== "string") {
    return Response.json(
      { error: "INVALID_CHALLENGE_ID", message: "challengeId is required" },
      { status: 400 }
    );
  }

  const success = await completeDailyChallenge(challengeId, userId);

  return Response.json(
    {
      success,
      completedAt: new Date().toISOString(),
    },
    { status: 200 }
  );
}
