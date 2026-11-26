import { checkGrammarSentenceAsync, GrammarCheckRequestSchema } from "../../../../../lib/ai/grammar-check.ts";
import {
  globalQuotaStore,
  extractClientIdentifier,
  buildRateLimitHeaders,
} from "../../../../../lib/ratelimit/quota.ts";

/**
 * POST /api/v1/ai/grammar-check
 * Evaluates a learner's practice sentence for a Grammar Learning Path topic.
 */
export async function POST(req: Request) {
  try {
    const identifier = extractClientIdentifier(req);
    const quotaResult = globalQuotaStore.checkAndRecord(identifier, "grammarCheck", {
      rateLimitPerMinute: 20,
      dailyQuota: 100,
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
    const parsed = GrammarCheckRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "INVALID_REQUEST",
          message: "Please enter a valid sentence (2 to 400 characters).",
          details: parsed.error.issues,
        },
        { status: 400, headers: rateHeaders }
      );
    }

    const feedback = await checkGrammarSentenceAsync(parsed.data);
    return Response.json(feedback, { status: 200, headers: rateHeaders });
  } catch (error) {
    return Response.json(
      {
        error: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Failed to check sentence",
      },
      { status: 500 }
    );
  }
}
