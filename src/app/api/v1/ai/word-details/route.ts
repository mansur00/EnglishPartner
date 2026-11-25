import { resolveWordDetailsAsync } from "../../../../../lib/ai/word-details.ts";
import { WordDetailsRequestSchema } from "../../../../../lib/ai/word-details-schema.ts";
import {
  globalQuotaStore,
  extractClientIdentifier,
  buildRateLimitHeaders,
} from "../../../../../lib/ratelimit/quota.ts";

/**
 * POST /api/v1/ai/word-details
 * Returns comprehensive word intelligence (meaning, synonyms, antonyms,
 * tense/POS word forms, and multi-tense sentence making examples).
 */
export async function POST(req: Request) {
  try {
    const identifier = extractClientIdentifier(req);
    const quotaResult = globalQuotaStore.checkAndRecord(identifier, "wordDetails");
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
    const parsed = WordDetailsRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        {
          error: "INVALID_REQUEST",
          message: "Word must be between 1 and 80 characters.",
          details: parsed.error.issues,
        },
        { status: 400, headers: rateHeaders }
      );
    }

    const details = await resolveWordDetailsAsync(parsed.data);
    return Response.json(details, { status: 200, headers: rateHeaders });
  } catch (error) {
    return Response.json(
      {
        error: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Failed to fetch word details",
      },
      { status: 500 }
    );
  }
}
