import {
  PersonalizedPracticeRequestSchema,
  runPersonalizedPracticeAsync,
} from "../../../../../lib/practice/personalized-generator";
import {
  globalQuotaStore,
  extractClientIdentifier,
  buildRateLimitHeaders,
} from "../../../../../lib/ratelimit/quota";
import { getServerAiDailyLimit } from "../../../../../lib/features/server-config";

/**
 * POST /api/v1/ai/personalized-practice
 * Generates personalized exercises targeting the user's weak areas (tense, preposition, spelling).
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
    const parsed = PersonalizedPracticeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "INVALID_REQUEST",
          message: "Invalid personalized practice request.",
          details: parsed.error.issues,
        },
        { status: 400, headers: rateHeaders }
      );
    }

    const result = await runPersonalizedPracticeAsync(parsed.data);
    return Response.json(result, { status: 200, headers: rateHeaders });
  } catch (error) {
    return Response.json(
      {
        error: "INTERNAL_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Personalized practice generation failed",
      },
      { status: 500 }
    );
  }
}
