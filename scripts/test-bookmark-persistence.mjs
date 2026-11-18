#!/usr/bin/env node
import { POST } from "../src/app/api/v1/me/bookmarks/route.ts";
import { countBookmarks, findBookmark, _resetMemoryBookmarks } from "../src/lib/db/bookmarks.ts";

async function main() {
  console.log("=================================================");
  console.log("       BOOKMARK API ROW PERSISTENCE PROOF        ");
  console.log("=================================================\n");

  _resetMemoryBookmarks();
  const testUserId = "user-audit-r3-test-123";
  const scenario1 = "550e8400-e29b-41d4-a716-446655440001";
  const scenario2 = "550e8400-e29b-41d4-a716-446655440002";

  // Step 1: Initial row count
  const count0 = await countBookmarks(testUserId);
  console.log(`[Step 1] Initial bookmark row count for ${testUserId}: ${count0}`);

  // Step 2: Logged-in creation call
  const req1 = new Request("http://localhost:3000/api/v1/me/bookmarks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-test-user-id": testUserId,
    },
    body: JSON.stringify({ scenarioId: scenario1 }),
  });
  const res1 = await POST(req1);
  const body1 = await res1.json();
  console.log(`[Step 2] POST /api/v1/me/bookmarks (logged-in):`);
  console.log(`         Status: ${res1.status} (expected: 201)`);
  console.log(`         Body:   ${JSON.stringify(body1)}`);

  const count1 = await countBookmarks(testUserId);
  console.log(`         Row count after call: ${count1} (expected: +1, was ${count0} -> ${count1})`);

  // Step 3: Repeat call (idempotent duplicate)
  const req2 = new Request("http://localhost:3000/api/v1/me/bookmarks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-test-user-id": testUserId,
    },
    body: JSON.stringify({ scenarioId: scenario1 }),
  });
  const res2 = await POST(req2);
  const body2 = await res2.json();
  console.log(`[Step 3] POST /api/v1/me/bookmarks (repeat call):`);
  console.log(`         Status: ${res2.status} (expected: 200)`);
  console.log(`         Body:   ${JSON.stringify(body2)}`);

  const count2 = await countBookmarks(testUserId);
  console.log(`         Row count after duplicate: ${count2} (expected: unchanged, count=${count2})`);

  // Step 4: Logged-out call
  const req3 = new Request("http://localhost:3000/api/v1/me/bookmarks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ scenarioId: scenario2 }),
  });
  const res3 = await POST(req3);
  const body3 = await res3.json();
  console.log(`[Step 4] POST /api/v1/me/bookmarks (logged-out):`);
  console.log(`         Status: ${res3.status} (expected: 401)`);
  console.log(`         Body:   ${JSON.stringify(body3)}`);

  const count3 = await countBookmarks(testUserId);
  console.log(`         Row count after logged-out: ${count3} (expected: unchanged, count=${count3})`);

  // Step 5: Body user_id spoofing attempt
  const req4 = new Request("http://localhost:3000/api/v1/me/bookmarks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-test-user-id": testUserId,
    },
    body: JSON.stringify({
      scenarioId: scenario2,
      user_id: "attacker-spoofed-user-999",
      userId: "attacker-spoofed-user-999",
    }),
  });
  const res4 = await POST(req4);
  const body4 = await res4.json();
  console.log(`[Step 5] POST /api/v1/me/bookmarks (spoof attempt in body):`);
  console.log(`         Status: ${res4.status} (expected: 201)`);
  console.log(`         Body:   ${JSON.stringify(body4)}`);

  const sessionUserRow = await findBookmark(testUserId, scenario2);
  const attackerUserRow = await findBookmark("attacker-spoofed-user-999", scenario2);
  console.log(`         Row written under session user (${testUserId}): ${!!sessionUserRow}`);
  console.log(`         Row written under attacker user (attacker-spoofed-user-999): ${!!attackerUserRow}`);

  const count4 = await countBookmarks(testUserId);
  console.log(`         Final row count for ${testUserId}: ${count4}`);

  if (count0 === 0 && count1 === 1 && count2 === 1 && count3 === 1 && count4 === 2 && !attackerUserRow && sessionUserRow) {
    console.log("\n✅ ALL BOOKMARK ROW COUNT & AUTH INTEGRITY CHECKS PASSED.");
    process.exit(0);
  } else {
    console.error("\n❌ BOOKMARK ROW COUNT INTEGRITY FAILED.");
    process.exit(1);
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
