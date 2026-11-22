import { generateRoleplayTurnAsync } from "../../../../../../lib/ai/roleplay.ts";
import { RoleplayTurnRequestSchema } from "../../../../../../lib/ai/roleplay-schema.ts";
import {
  globalQuotaStore,
  extractClientIdentifier,
  buildRateLimitHeaders,
  DEFAULT_AI_QUOTAS,
} from "../../../../../../lib/ratelimit/quota.ts";

/**
 * POST /api/v1/ai/roleplay/turn
 * Generates an in-character AI response turn.
 * Conforms to ECP_AI_Prompt_Spec.md §3.5 (Schema R1), ECP_API_Contract.md §4.7 & §7, and Brief §9.
 * Rate limited to 10 req/min and max 20 turns per session.
 */
export async function POST(req: Request) {
  try {
    const identifier = extractClientIdentifier(req);
    const quotaResult = globalQuotaStore.checkAndRecord(identifier, "roleplayTurn");
    const rateHeaders = buildRateLimitHeaders(quotaResult);

    if (!quotaResult.allowed) {
      return Response.json(
        {
          error: quotaResult.error || "RATE_LIMITED",
          message: quotaResult.message,
          retry_after_seconds: quotaResult.retryAfterSeconds,
          quota: {
            limit: quotaResult.limit,
            remaining: quotaResult.remaining,
            reset_at: quotaResult.resetAt,
          },
        },
        { status: 429, headers: rateHeaders }
      );
    }

    const body = await req.json();
    const parsed = RoleplayTurnRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "INVALID_REQUEST",
          message: "Invalid roleplay turn request.",
          details: parsed.error.issues,
        },
        { status: 400, headers: rateHeaders }
      );
    }

    // Turn count guard per ECP_API_Contract §4.7: Max 20 turns per session
    const learnerTurnCount =
      parsed.data.transcript.filter((t) => t.speaker === "learner").length + 1;

    if (learnerTurnCount > DEFAULT_AI_QUOTAS.roleplayTurn.maxTurnsPerSession) {
      return Response.json(
        {
          error: "SESSION_TURN_LIMIT_EXCEEDED",
          message: "Maximum 20 turns per roleplay session reached. Please conclude and view session feedback.",
        },
        { status: 400, headers: rateHeaders }
      );
    }

    const response = await generateRoleplayTurnAsync(parsed.data);
    return Response.json(response, { status: 200, headers: rateHeaders });
  } catch (error) {
    return Response.json(
      {
        error: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Failed to generate roleplay turn",
      },
      { status: 500 }
    );
  }
}
