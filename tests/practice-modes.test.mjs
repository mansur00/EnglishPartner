import { test } from "node:test";
import assert from "node:assert/strict";
import { practiceModeEnum } from "../src/lib/db/schema.ts";

test("AUD-D-12: practice mode enum values match exercises spec §3.4 exactly", () => {
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
  assert.equal(practiceModeEnum.enumValues.length, 9);
});
