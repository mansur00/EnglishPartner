import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PYTHON_BIN = path.resolve(__dirname, "../services/nlp/.venv/bin/python");
const ANNOTATE_SCRIPT = path.resolve(__dirname, "../services/nlp/annotate.py");

function runAnnotator(text) {
  const stdout = execFileSync(PYTHON_BIN, [ANNOTATE_SCRIPT, "--text", text], {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  });
  // Strip any python urllib warning lines before JSON
  const jsonStart = stdout.indexOf("{");
  if (jsonStart === -1) {
    throw new Error(`Failed to find JSON output: ${stdout}`);
  }
  return JSON.parse(stdout.slice(jsonStart));
}

test("Grammar Tenses Unit Tests: All 12 Tenses, Passives, Inversions, and Negatives", async (t) => {
  const testCases = [
    {
      tense: "present-simple",
      text: "She lives in London.",
      expectedTime: "present",
      expectedAspect: "simple",
    },
    {
      tense: "present-continuous",
      text: "They are discussing the project right now.",
      expectedTime: "present",
      expectedAspect: "continuous",
    },
    {
      tense: "present-perfect",
      text: "He has visited five countries.",
      expectedTime: "present",
      expectedAspect: "perfect",
    },
    {
      tense: "present-perfect-continuous",
      text: "We have been waiting here for two hours.",
      expectedTime: "present",
      expectedAspect: "perfect-continuous",
    },
    {
      tense: "past-simple",
      text: "She bought a new dress yesterday.",
      expectedTime: "past",
      expectedAspect: "simple",
    },
    {
      tense: "past-continuous",
      text: "I was cooking dinner when the phone rang.",
      expectedTime: "past",
      expectedAspect: "continuous",
    },
    {
      tense: "past-perfect",
      text: "They had finished the report before noon.",
      expectedTime: "past",
      expectedAspect: "perfect",
    },
    {
      tense: "past-perfect-continuous",
      text: "He had been running for an hour before he rested.",
      expectedTime: "past",
      expectedAspect: "perfect-continuous",
    },
    {
      tense: "future-simple",
      text: "We will attend the meeting tomorrow.",
      expectedTime: "future",
      expectedAspect: "simple",
    },
    {
      tense: "future-continuous",
      text: "She will be traveling to Paris this evening.",
      expectedTime: "future",
      expectedAspect: "continuous",
    },
    {
      tense: "future-perfect",
      text: "I will have completed the project by Friday.",
      expectedTime: "future",
      expectedAspect: "perfect",
    },
    {
      tense: "future-perfect-continuous",
      text: "By next month, he will have been working here for a year.",
      expectedTime: "future",
      expectedAspect: "perfect-continuous",
    },
    {
      tense: "voice-passive",
      text: "The document was signed by the manager.",
      expectedVoice: "voice-passive",
    },
    {
      tense: "negative-form",
      text: "She does not work on weekends.",
      expectedTime: "present",
      expectedAspect: "simple",
    },
    {
      tense: "question-inversion",
      text: "Have you seen this movie before?",
      expectedTime: "present",
      expectedAspect: "perfect",
    },
    {
      tense: "adverb-inside-verb-group",
      text: "He has always supported our team.",
      expectedTime: "present",
      expectedAspect: "perfect",
    },
  ];

  for (const tc of testCases) {
    await t.test(`Tense test: ${tc.tense} ("${tc.text}")`, () => {
      const result = runAnnotator(tc.text);
      assert.ok(result.groups, `Result should have groups array for '${tc.text}'`);

      const verbGroups = result.groups.filter((g) => g.type === "verb-group");
      assert.ok(
        verbGroups.length > 0,
        `Expected at least one verb group for '${tc.text}', got 0`
      );

      const vg = verbGroups[0];
      if (tc.expectedTime) {
        assert.equal(
          vg.time,
          tc.expectedTime,
          `Expected time '${tc.expectedTime}' but got '${vg.time}' for '${tc.text}'`
        );
      }
      if (tc.expectedAspect) {
        assert.equal(
          vg.aspect,
          tc.expectedAspect,
          `Expected aspect '${tc.expectedAspect}' but got '${vg.aspect}' for '${tc.text}'`
        );
      }
      if (tc.expectedVoice) {
        assert.equal(
          vg.voice,
          tc.expectedVoice,
          `Expected voice '${tc.expectedVoice}' but got '${vg.voice}' for '${tc.text}'`
        );
      }
    });
  }
});
