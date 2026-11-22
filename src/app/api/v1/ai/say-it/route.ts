import { resolveSayItIntent } from "../../../../../lib/ai/say-it.ts";
import { SayItRequestSchema } from "../../../../../lib/ai/say-it-schema.ts";
import {
  globalQuotaStore,
  extractClientIdentifier,
  buildRateLimitHeaders,
} from "../../../../../lib/ratelimit/quota.ts";

/**
 * POST /api/v1/ai/say-it
 * "What Should I Say?" API Endpoint
 * Complies with ECP_API_Contract.md §4.7 and ECP_AI_Prompt_Spec.md §3.4.
 * Rate limited to 10 req/min and 30 req/day per learner.
 */
export async function POST(req: Request) {
  try {
    const identifier = extractClientIdentifier(req);
    const quotaResult = globalQuotaStore.checkAndRecord(identifier, "sayIt");
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
    const parsed = SayItRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "INVALID_REQUEST",
          message: "Intent must be between 1 and 500 characters.",
          details: parsed.error.issues,
        },
        { status: 400, headers: rateHeaders }
      );
    }

    const response = resolveSayItIntent(parsed.data);
    return Response.json(response, { status: 200, headers: rateHeaders });
  } catch (error) {
    return Response.json(
      {
        error: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Failed to process intent",
      },
      { status: 500 }
    );
  }
}
