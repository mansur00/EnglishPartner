import { checkWritingAsync, WritingCheckRequestSchema } from "../../../../../lib/ai/writing-checker";
import {
  globalQuotaStore,
  extractClientIdentifier,
  buildRateLimitHeaders,
} from "../../../../../lib/ratelimit/quota";

/**
 * POST /api/v1/ai/writing-check
 * Analyzes learner sentences or paragraphs for grammar errors, explanations (BN/EN),
 * formal/casual/IELTS rewrites, and optional IELTS Writing band score feedback.
 */
export async function POST(req: Request) {
  try {
    const identifier = extractClientIdentifier(req);
    const quotaResult = globalQuotaStore.checkAndRecord(identifier, "grammarCheck", {
      rateLimitPerMinute: 15,
      dailyQuota: 80,
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
    const parsed = WritingCheckRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "INVALID_REQUEST",
          message: "Please enter between 3 and 4000 characters.",
          details: parsed.error.issues,
        },
        { status: 400, headers: rateHeaders }
      );
    }

    const feedback = await checkWritingAsync(parsed.data);
    return Response.json(feedback, { status: 200, headers: rateHeaders });
  } catch (error) {
    return Response.json(
      {
        error: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Failed to analyze writing",
      },
      { status: 500 }
    );
  }
}
