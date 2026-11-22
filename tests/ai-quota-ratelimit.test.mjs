import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  MemoryQuotaStore,
  buildRateLimitHeaders,
  extractClientIdentifier,
} from "../src/lib/ratelimit/quota.ts";
import { POST as sayItRoute } from "../src/app/api/v1/ai/say-it/route.ts";
import { POST as roleplayTurnRoute } from "../src/app/api/v1/ai/roleplay/turn/route.ts";

describe("Milestone 4E: AI Quotas, Rate Limiting & Cost Defense Engine", () => {
  let simulatedTime = 1_000_000_000_000;
  let store;

  beforeEach(() => {
    simulatedTime = 1_000_000_000_000;
    store = new MemoryQuotaStore(() => simulatedTime);
  });

  it("should allow requests up to the 1-minute burst limit (10 req/min)", () => {
    const learnerId = "learner-test-1";

    for (let i = 1; i <= 10; i++) {
      const result = store.checkAndRecord(learnerId, "sayIt");
      assert.equal(result.allowed, true, `Request ${i} should be allowed`);
      assert.equal(result.limit, 10);
      assert.equal(result.remaining, 10 - i);
    }

    // 11th request within same minute should be rejected
    const blocked = store.checkAndRecord(learnerId, "sayIt");
    assert.equal(blocked.allowed, false, "11th request should be blocked");
    assert.equal(blocked.error, "RATE_LIMITED");
    assert.equal(blocked.remaining, 0);
    assert.ok(blocked.retryAfterSeconds && blocked.retryAfterSeconds > 0);
  });

  it("should restore burst capacity after 60 seconds", () => {
    const learnerId = "learner-test-2";

    // Exhaust 10 requests
    for (let i = 1; i <= 10; i++) {
      store.checkAndRecord(learnerId, "sayIt");
    }

    // Still blocked at +30 seconds
    simulatedTime += 30_000;
    const blocked = store.checkAndRecord(learnerId, "sayIt");
    assert.equal(blocked.allowed, false);

    // Unblocked at +61 seconds from start
    simulatedTime += 31_000;
    const restored = store.checkAndRecord(learnerId, "sayIt");
    assert.equal(restored.allowed, true);
    assert.equal(restored.remaining, 9);
  });

  it("should enforce daily quota of 30 requests for 'What Should I Say?'", () => {
    const learnerId = "learner-test-3";

    // Perform 30 requests spread out across 30 minutes (1 per minute)
    for (let i = 1; i <= 30; i++) {
      const res = store.checkAndRecord(learnerId, "sayIt");
      assert.equal(res.allowed, true, `Daily request ${i} should be allowed`);
      simulatedTime += 60_000; // 1 min apart so burst limit never hits
    }

    // 31st request should hit daily quota limit
    const overDaily = store.checkAndRecord(learnerId, "sayIt");
    assert.equal(overDaily.allowed, false);
    assert.equal(overDaily.error, "QUOTA_EXCEEDED");
    assert.equal(overDaily.limit, 30);
    assert.ok(overDaily.message.includes("Daily quota of 30 requests reached"));
  });

  it("should build standard IETF draft rate limit headers", () => {
    const allowedHeaders = buildRateLimitHeaders({
      allowed: true,
      limit: 10,
      remaining: 7,
      resetSeconds: 45,
      resetAt: new Date().toISOString(),
    });

    assert.equal(allowedHeaders["RateLimit-Limit"], "10");
    assert.equal(allowedHeaders["RateLimit-Remaining"], "7");
    assert.equal(allowedHeaders["RateLimit-Reset"], "45");
    assert.equal(allowedHeaders["Retry-After"], undefined);

    const blockedHeaders = buildRateLimitHeaders({
      allowed: false,
      limit: 10,
      remaining: 0,
      resetSeconds: 15,
      resetAt: new Date().toISOString(),
      retryAfterSeconds: 15,
    });

    assert.equal(blockedHeaders["RateLimit-Limit"], "10");
    assert.equal(blockedHeaders["RateLimit-Remaining"], "0");
    assert.equal(blockedHeaders["RateLimit-Reset"], "15");
    assert.equal(blockedHeaders["Retry-After"], "15");
  });

  it("should extract client IP identifier accurately from proxy headers", () => {
    const reqWithForwarded = new Request("http://localhost/api", {
      headers: { "x-forwarded-for": "203.0.113.195, 70.41.3.18" },
    });
    assert.equal(extractClientIdentifier(reqWithForwarded), "203.0.113.195");

    const reqWithRealIp = new Request("http://localhost/api", {
      headers: { "x-real-ip": "198.51.100.42" },
    });
    assert.equal(extractClientIdentifier(reqWithRealIp), "198.51.100.42");

    const reqAnon = new Request("http://localhost/api");
    assert.equal(extractClientIdentifier(reqAnon), "anonymous-learner");
  });

  it("should enforce maximum 20 turns per roleplay session in route", async () => {
    // Construct transcript with 20 prior learner turns
    const transcript = Array.from({ length: 20 }, (_, i) => ({
      speaker: "learner",
      text: `Learner message ${i + 1}`,
    }));

    const requestPayload = {
      scenario_id: "grocery-shopping",
      scenario_title: "Grocery Shopping",
      scenario_context: "In a supermarket",
      ai_role: "Store Clerk",
      learner_role: "Shopper",
      level: "A1",
      transcript,
      learner_message: "Can you help me find milk?", // 21st turn
    };

    const req = new Request("http://localhost/api/v1/ai/roleplay/turn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestPayload),
    });

    const res = await roleplayTurnRoute(req);
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.error, "SESSION_TURN_LIMIT_EXCEEDED");
    assert.ok(body.message.includes("Maximum 20 turns per roleplay session"));
  });

  it("should return rate limit headers on say-it endpoint", async () => {
    const req = new Request("http://localhost/api/v1/ai/say-it", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent: "I need to request an extension on my deadline." }),
    });

    const res = await sayItRoute(req);
    assert.equal(res.status, 200);
    assert.ok(res.headers.get("RateLimit-Limit"));
    assert.ok(res.headers.get("RateLimit-Remaining"));
    assert.ok(res.headers.get("RateLimit-Reset"));

    const body = await res.json();
    assert.ok(body.options && body.options.length > 0);
  });
});
