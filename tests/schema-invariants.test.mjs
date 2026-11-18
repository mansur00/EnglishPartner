import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  translations,
  audioAssets,
  practiceSessions,
  practiceModeEnum,
  accentEnum,
  audioStatusEnum,
  reviewStatusEnum,
} from "../src/lib/db/schema.ts";

test("AUD-VERIFY KI-07: translations and audio_assets schema matches Register D-07 & D-08", () => {
  // 1. Translations table check (D-07)
  assert.ok(translations.scenarioId, "translations.scenario_id must exist");
  assert.ok(translations.dialogueLineId, "translations.dialogue_line_id must exist");
  assert.ok(translations.languageCode, "translations.language_code must exist");
  assert.ok(translations.sourceVersion, "translations.source_version must exist");
  assert.ok(translations.sourceHash, "translations.source_hash must exist");
  assert.ok(translations.reviewStatus, "translations.review_status must exist");

  // Review status enum
  const reviewStatuses = ["draft", "in_review", "approved", "stale", "rejected"];
  assert.deepEqual(reviewStatusEnum.enumValues, reviewStatuses);

  // 2. Audio assets table check (D-08)
  assert.ok(audioAssets.dialogueLineId, "audio_assets.dialogue_line_id must exist");
  assert.ok(audioAssets.conversationVersionId, "audio_assets.conversation_version_id must exist");
  assert.ok(audioAssets.languageCode, "audio_assets.language_code must exist");
  assert.ok(audioAssets.accent, "audio_assets.accent must exist");
  assert.ok(audioAssets.timingManifest, "audio_assets.timing_manifest must exist");
  assert.ok(audioAssets.status, "audio_assets.status must exist");
  assert.ok(audioAssets.sourceHash, "audio_assets.source_hash must exist");

  // Accent & audio status enums
  assert.deepEqual(accentEnum.enumValues, ["en-US", "en-GB"]);
  assert.deepEqual(audioStatusEnum.enumValues, ["processing", "ready", "failed", "stale", "archived"]);

  // Schema check constraints present in schema.ts
  const schemaSource = fs.readFileSync("src/lib/db/schema.ts", "utf-8");
  assert.ok(schemaSource.includes("translations_target_check"), "translations must have exactly-one check constraint");
  assert.ok(schemaSource.includes("audio_assets_target_check"), "audio_assets must have exactly-one check constraint");
});

test("AUD-VERIFY KI-09: drizzle config, db client, and .env.example exist and are configured", () => {
  assert.ok(fs.existsSync("drizzle.config.ts"), "drizzle.config.ts must exist");
  assert.ok(fs.existsSync("src/lib/db/index.ts"), "src/lib/db/index.ts client must exist");
  assert.ok(fs.existsSync(".env.example"), ".env.example must exist");

  const drizzleConfig = fs.readFileSync("drizzle.config.ts", "utf-8");
  assert.ok(drizzleConfig.includes("drizzle-kit"), "drizzle.config.ts must import drizzle-kit");
  assert.ok(drizzleConfig.includes("./src/lib/db/schema.ts"), "schema path must match");

  const dbClient = fs.readFileSync("src/lib/db/index.ts", "utf-8");
  assert.ok(dbClient.includes("drizzle-orm/postgres-js"), "db client must use postgres-js");
  assert.ok(dbClient.includes("export const db"), "db client must export db instance");
});

test("AUD-VERIFY KI-16: practice_sessions matches Exercises spec §3.4", () => {
  assert.ok(practiceSessions.status, "practice_sessions.status must exist");
  assert.ok(practiceSessions.scoreCorrect, "practice_sessions.score_correct must exist");
  assert.ok(practiceSessions.scoreTotal, "practice_sessions.score_total must exist");
  assert.ok(practiceSessions.lastItemPosition, "practice_sessions.last_item_position must exist");
  assert.ok(practiceSessions.mode, "practice_sessions.mode must exist");

  const expectedModes = [
    "listening_quiz",
    "sentence_builder",
    "dialogue_order",
    "hide_speaker",
    "complete_line",
    "read_aloud",
    "roleplay_text",
    "roleplay_voice",
    "flashcard",
  ];
  assert.deepEqual(practiceModeEnum.enumValues, expectedModes);
});
