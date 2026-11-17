import { test } from "node:test";
import assert from "node:assert/strict";
import { getSafeRedirectUrl, GET } from "../src/app/auth/callback/route.ts";

test("AUD-KI-03: Auth Callback Safe Internal Redirect Validation", async () => {
  // 1. External targets must be rejected and fallback to /dashboard
  assert.equal(getSafeRedirectUrl("https://malicious.com"), "/dashboard");
  assert.equal(getSafeRedirectUrl("http://phishing.site/login"), "/dashboard");
  assert.equal(getSafeRedirectUrl("//evil.com"), "/dashboard");
  assert.equal(getSafeRedirectUrl("/\\evil.com"), "/dashboard");
  assert.equal(getSafeRedirectUrl("javascript:alert(1)"), "/dashboard");
  assert.equal(getSafeRedirectUrl("data:text/html,<html>"), "/dashboard");
  assert.equal(getSafeRedirectUrl(""), "/dashboard");
  assert.equal(getSafeRedirectUrl(null), "/dashboard");
  assert.equal(getSafeRedirectUrl(undefined), "/dashboard");

  // 2. Safe relative internal paths must be preserved
  assert.equal(getSafeRedirectUrl("/dashboard"), "/dashboard");
  assert.equal(getSafeRedirectUrl("/explore"), "/explore");
  assert.equal(getSafeRedirectUrl("/explore/category/shopping-and-money"), "/explore/category/shopping-and-money");
  assert.equal(getSafeRedirectUrl("/conversations/asking-price-product-details"), "/conversations/asking-price-product-details");
  assert.equal(getSafeRedirectUrl("/vocabulary?tag=shopping"), "/vocabulary?tag=shopping");

  // 3. Callback Route Handler redirects safely when given external param
  const maliciousReq = new Request("http://localhost:3000/auth/callback?code=mock_code&next=https://attacker.com");
  const response = await GET(maliciousReq);
  assert.ok([302, 303, 307, 308].includes(response.status), "Redirect status expected");
  const location = response.headers.get("location");
  assert.ok(location, "Location header must be set");
  assert.ok(!location.includes("attacker.com"), "Redirect must not contain attacker domain");
  assert.ok(location.startsWith("http://localhost:3000/"), "Redirect must stay on internal origin");
});
