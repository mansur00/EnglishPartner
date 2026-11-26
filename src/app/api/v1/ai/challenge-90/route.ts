import {
  Challenge90RequestSchema,
  runChallengeSpeakingActionAsync,
} from "../../../../../lib/practice/challenge-90";
import {
  globalQuotaStore,
  extractClientIdentifier,
  buildRateLimitHeaders,
} from "../../../../../lib/ratelimit/quota";
import { getServerAiDailyLimit } from "../../../../../lib/features/server-config";

/**
 * POST /api/v1/ai/challenge-90
 * Generates daily spoken-English prompts and 5-step speaking feedback for the 90-Day Challenge.
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
    const parsed = Challenge90RequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "INVALID_REQUEST",
          message: "Invalid 90-Day Challenge request.",
          details: parsed.error.issues,
        },
        { status: 400, headers: rateHeaders }
      );
    }

    const result = await runChallengeSpeakingActionAsync(parsed.data);
    return Response.json(result, { status: 200, headers: rateHeaders });
  } catch (error) {
    return Response.json(
      {
        error: "INTERNAL_ERROR",
        message:
          error instanceof Error ? error.message : "90-Day Challenge request failed",
      },
      { status: 500 }
    );
  }
}
