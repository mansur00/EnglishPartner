import { test } from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/api/v1/me/bookmarks/route.ts";
import { findBookmark, countBookmarks, _resetMemoryBookmarks } from "../src/lib/db/bookmarks.ts";

test("AUD-KI-02: Bookmark API DB Persistence and Auth Guards", async () => {
  _resetMemoryBookmarks();

  const testScenarioId = "550e8400-e29b-41d4-a716-446655440000";
  const testUserId = "user-test-uuid-12345";

  // 1. Logged-out call must return 401 AUTH_REQUIRED and write nothing to DB
  const initialCount = await countBookmarks();
  const unauthRequest = new Request("http://localhost:3000/api/v1/me/bookmarks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenarioId: testScenarioId }),
  });

  const unauthResponse = await POST(unauthRequest);
  assert.equal(unauthResponse.status, 401, "Logged-out request must return 401");
  const unauthJson = await unauthResponse.json();
  assert.equal(unauthJson.error, "AUTH_REQUIRED");

  const countAfterUnauth = await countBookmarks();
  assert.equal(countAfterUnauth, initialCount, "Logged-out call must not write any row to database");

  // 2. Authenticated call writes a row to DB and returns 201 with created row id
  const authRequest = new Request("http://localhost:3000/api/v1/me/bookmarks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-test-user-id": testUserId,
    },
    body: JSON.stringify({ scenarioId: testScenarioId }),
  });

  const authResponse = await POST(authRequest);
  assert.equal(authResponse.status, 201, "Authenticated request must return 201 Created");
  const authJson = await authResponse.json();
  assert.ok(authJson.id, "Response must include created row id");
  assert.equal(authJson.saved, true);

  // Assert DB row actually exists
  const persistedRow = await findBookmark(testUserId, testScenarioId);
  assert.ok(persistedRow, "DB row must exist after authenticated call");
  assert.equal(persistedRow.id, authJson.id);
  assert.equal(persistedRow.userId, testUserId);
  assert.equal(persistedRow.scenarioId, testScenarioId);

  // 3. Idempotent re-submission returns 200 with existing row id
  const duplicateRequest = new Request("http://localhost:3000/api/v1/me/bookmarks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-test-user-id": testUserId,
    },
    body: JSON.stringify({ scenarioId: testScenarioId }),
  });

  const duplicateResponse = await POST(duplicateRequest);
  assert.equal(duplicateResponse.status, 200, "Duplicate bookmark must return 200 OK (idempotent)");
  const duplicateJson = await duplicateResponse.json();
  assert.equal(duplicateJson.id, authJson.id);
  assert.equal(duplicateJson.idempotent, true);

  // 4. Request body user_id / userId spoofing is ignored; user_id strictly derived from server session
  const spoofScenarioId = "660e8400-e29b-41d4-a716-446655440001";
  const spoofAttemptRequest = new Request("http://localhost:3000/api/v1/me/bookmarks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-test-user-id": testUserId,
    },
    body: JSON.stringify({
      scenarioId: spoofScenarioId,
      user_id: "attacker-user-id-9999",
      userId: "attacker-user-id-9999",
    }),
  });

  const spoofResponse = await POST(spoofAttemptRequest);
  assert.equal(spoofResponse.status, 201, "Valid authenticated request returns 201");
  const spoofJson = await spoofResponse.json();
  assert.ok(spoofJson.id, "Created bookmark must return row id");
  const spoofPersistedRow = await findBookmark(testUserId, spoofScenarioId);
  assert.ok(spoofPersistedRow, "Row must exist under the authenticated user");
  assert.equal(spoofPersistedRow.userId, testUserId, "user_id in DB must match server session, ignoring body");

  const attackerRow = await findBookmark("attacker-user-id-9999", spoofScenarioId);
  assert.equal(attackerRow, null, "Attacker body user_id must be completely ignored");
});
