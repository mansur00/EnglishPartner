import { runSpellMasterAsync, SpellMasterRequestSchema } from "../../../../../lib/ai/spell-master";
import {
  globalQuotaStore,
  extractClientIdentifier,
  buildRateLimitHeaders,
} from "../../../../../lib/ratelimit/quota";
import { getServerAiDailyLimit } from "../../../../../lib/features/server-config";

/**
 * POST /api/v1/ai/spell-master
 * Handles AI word lookup, personalized mistake pattern coaching + quiz, and text spell checking.
 */
export async function POST(req: Request) {
  try {
    const identifier = extractClientIdentifier(req);
    const quotaResult = globalQuotaStore.checkAndRecord(identifier, "grammarCheck", {
      rateLimitPerMinute: 20,
      dailyQuota: await getServerAiDailyLimit(),
    });
    const rateHeaders = buildRateLimitHeaders(quotaResult);

    if (!quotaResult.allowed) {
      return Response.json(
        {
          error: quotaResult.error || "RATE_LIMITED",
          message: quotaResult.message,
          retry_after_seconds: quotaResult.retryAfterSeconds,
        },
        { status: 429, headers: rateHeaders }
      );
    }

    const body = await req.json();
    const parsed = SpellMasterRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "INVALID_REQUEST",
          message: "Invalid Spell Master request.",
          details: parsed.error.issues,
        },
        { status: 400, headers: rateHeaders }
      );
    }

    const result = await runSpellMasterAsync(parsed.data);
    return Response.json(result, { status: 200, headers: rateHeaders });
  } catch (error) {
    return Response.json(
      {
        error: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Spell Master request failed",
      },
      { status: 500 }
    );
  }
}
