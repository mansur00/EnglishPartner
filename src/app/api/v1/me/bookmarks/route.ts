import { getAuthenticatedUser } from "../../../../../lib/supabase/server.ts";
import { findBookmark, createBookmark } from "../../../../../lib/db/bookmarks.ts";

/**
 * POST /api/v1/me/bookmarks
 * Persists scenario bookmark to database for authenticated user.
 * 
 * Complies with:
 * - Decision D-07 to D-12 & DB Architecture §6 (bookmarks table)
 * - API Contract §4.5 (Idempotent: 201 on create, 200 on duplicate)
 * - Session user_id is derived strictly from server-side authentication, never from body.
 */
export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);

  if (!user || !user.id) {
    return Response.json(
      {
        error: "AUTH_REQUIRED",
        message: "Authentication is required to bookmark scenarios",
      },
      { status: 401 }
    );
  }

  let body: { scenarioId?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        error: "INVALID_BODY",
        message: "Request body must be valid JSON",
      },
      { status: 400 }
    );
  }

  const { scenarioId } = body;
  if (!scenarioId || typeof scenarioId !== "string") {
    return Response.json(
      {
        error: "INVALID_SCENARIO_ID",
        message: "scenarioId string is required",
      },
      { status: 400 }
    );
  }

  // Idempotency check: return 200 with existing row if already bookmarked
  const existing = await findBookmark(user.id, scenarioId);
  if (existing) {
    return Response.json(
      {
        id: existing.id,
        saved: true,
        idempotent: true,
      },
      { status: 200 }
    );
  }

  const created = await createBookmark(user.id, scenarioId);

  return Response.json(
    {
      id: created.id,
      saved: true,
    },
    { status: 201 }
  );
}
