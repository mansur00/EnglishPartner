/**
 * AI Rate Limiter & Learner Quota Defense Engine (Milestone 4E)
 * Complies with ECP_API_Contract.md §4.7 & §7, ECP_System_Framework.md §13,
 * and ECP_Phase_Plan.md §7.1 (Track 4E).
 */

export interface RateLimitEntry {
  timestamps: number[];
  dayCount: number;
  dayStartMs: number;
}

export interface QuotaConfig {
  /** Maximum requests allowed in a 60-second window */
  rateLimitPerMinute: number;
  /** Maximum requests allowed in a rolling 24-hour day */
  dailyQuota: number;
}

export interface QuotaCheckResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
  resetAt: string;
  error?: "RATE_LIMITED" | "QUOTA_EXCEEDED";
  message?: string;
  retryAfterSeconds?: number;
}

/** Standard defaults defined in ECP_API_Contract.md §4.7 & §7 */
export const DEFAULT_AI_QUOTAS = {
  sayIt: {
    rateLimitPerMinute: 10,
    dailyQuota: 30,
  },
  wordDetails: {
    rateLimitPerMinute: 25,
    dailyQuota: 120,
  },
  roleplayTurn: {
    rateLimitPerMinute: 10,
    dailyQuota: 100, // 5 sessions * 20 turns
    maxTurnsPerSession: 20,
    dailySessionsQuota: 5,
  },
  quiz: {
    rateLimitPerMinute: 12,
    dailyQuota: 60,
  },
} as const;

export class MemoryQuotaStore {
  private store: Map<string, RateLimitEntry> = new Map();
  private nowProvider: () => number;

  constructor(nowProvider: () => number = () => Date.now()) {
    this.nowProvider = nowProvider;
  }

  /**
   * Evaluates and records an attempt for the given identifier and feature.
   */
  checkAndRecord(
    identifier: string,
    feature: "sayIt" | "roleplayTurn" | "quiz" | "wordDetails",
    config: QuotaConfig = DEFAULT_AI_QUOTAS[feature]
  ): QuotaCheckResult {
    const now = this.nowProvider();
    const key = `${feature}:${identifier}`;
    const oneMinuteAgo = now - 60_000;
    const oneDayMs = 86_400_000;

    let entry = this.store.get(key);
    if (!entry) {
      entry = {
        timestamps: [],
        dayCount: 0,
        dayStartMs: now,
      };
      this.store.set(key, entry);
    }

    // Reset daily counter if > 24 hours have elapsed
    if (now - entry.dayStartMs >= oneDayMs) {
      entry.dayCount = 0;
      entry.dayStartMs = now;
    }

    // Prune timestamps older than 60 seconds
    entry.timestamps = entry.timestamps.filter((ts) => ts > oneMinuteAgo);

    const minuteCount = entry.timestamps.length;

    // 1. Check daily quota exhaustion
    if (entry.dayCount >= config.dailyQuota) {
      const resetMs = entry.dayStartMs + oneDayMs - now;
      const resetSec = Math.ceil(Math.max(1, resetMs / 1000));
      const resetAt = new Date(now + resetMs).toISOString();

      return {
        allowed: false,
        limit: config.dailyQuota,
        remaining: 0,
        resetSeconds: resetSec,
        resetAt,
        error: "QUOTA_EXCEEDED",
        retryAfterSeconds: resetSec,
        message: `Daily quota of ${config.dailyQuota} requests reached. Resets in ${Math.ceil(resetSec / 60)} minutes.`,
      };
    }

    // 2. Check 1-minute burst rate limit
    if (minuteCount >= config.rateLimitPerMinute) {
      const oldestInWindow = entry.timestamps[0];
      const resetMs = oldestInWindow + 60_000 - now;
      const resetSec = Math.ceil(Math.max(1, resetMs / 1000));
      const resetAt = new Date(now + resetMs).toISOString();

      return {
        allowed: false,
        limit: config.rateLimitPerMinute,
        remaining: 0,
        resetSeconds: resetSec,
        resetAt,
        error: "RATE_LIMITED",
        retryAfterSeconds: resetSec,
        message: `Too many requests. Please wait ${resetSec} seconds before trying again.`,
      };
    }

    // Allowed: record timestamp & increment day count
    entry.timestamps.push(now);
    entry.dayCount += 1;

    const remaining = Math.min(
      config.rateLimitPerMinute - entry.timestamps.length,
      config.dailyQuota - entry.dayCount
    );

    const resetMs = Math.min(
      60_000,
      entry.dayStartMs + oneDayMs - now
    );
    const resetSec = Math.ceil(resetMs / 1000);

    return {
      allowed: true,
      limit: config.rateLimitPerMinute,
      remaining: Math.max(0, remaining),
      resetSeconds: resetSec,
      resetAt: new Date(now + resetMs).toISOString(),
    };
  }

  /** Clears store (useful for testing) */
  clear() {
    this.store.clear();
  }
}

/** Global singleton store for application runtime */
export const globalQuotaStore = new MemoryQuotaStore();

/**
 * Generates standard IETF draft rate limit headers per ECP_API_Contract.md §7.
 */
export function buildRateLimitHeaders(result: QuotaCheckResult): Record<string, string> {
  const headers: Record<string, string> = {
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(result.resetSeconds),
  };

  if (!result.allowed && result.retryAfterSeconds) {
    headers["Retry-After"] = String(result.retryAfterSeconds);
  }

  return headers;
}

/**
 * Extracts a robust client identifier from standard reverse proxy headers.
 */
export function extractClientIdentifier(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "anonymous-learner";
}
