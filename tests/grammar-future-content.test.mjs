import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GRAMMAR_DATA_DIR = path.resolve(__dirname, "../data/grammar");
const CHECK_SCRIPT = path.resolve(__dirname, "../scripts/grammar-check.mjs");
const FIXTURE_FILE = path.join(GRAMMAR_DATA_DIR, "temp-future-fixture.json");

test("Grammar Future-Content & Build Gate Integrity Test", async (t) => {
  // 1. Author valid temporary future conversation fixture
  const validFixture = {
    taxonomyVersion: 1,
    taggerVersion: "spacy-en_core_web_sm+rules-1.0",
    sourceId: "temp-future-fixture",
    lines: [
      {
        lineId: "turn-1",
        text: "Could I have the project details tomorrow?",
        textHash: "tempfuturehash001",
        override: false,
        tokens: [
          {
            i: 0,
            text: "Could",
            start: 0,
            end: 5,
            lemma: "could",
            pos: "verb",
            sub: "modal",
            role: "verb-phrase",
            confidence: 0.95,
          },
          {
            i: 1,
            text: "I",
            start: 6,
            end: 7,
            lemma: "i",
            pos: "pronoun",
            sub: "personal-subject",
            role: "subject",
            confidence: 0.95,
          },
          {
            i: 2,
            text: "have",
            start: 8,
            end: 12,
            lemma: "have",
            pos: "verb",
            sub: null,
            role: "verb-phrase",
            confidence: 0.95,
          },
          {
            i: 3,
            text: "the",
            start: 13,
            end: 16,
            lemma: "the",
            pos: "determiner",
            sub: null,
            role: null,
            confidence: 0.95,
          },
          {
            i: 4,
            text: "project",
            start: 17,
            end: 24,
            lemma: "project",
            pos: "noun",
            sub: "common",
            role: "direct-object",
            confidence: 0.95,
          },
          {
            i: 5,
            text: "details",
            start: 25,
            end: 32,
            lemma: "detail",
            pos: "noun",
            sub: "common",
            role: "direct-object",
            confidence: 0.95,
          },
          {
            i: 6,
            text: "tomorrow",
            start: 33,
            end: 41,
            lemma: "tomorrow",
            pos: "noun",
            sub: null,
            role: "adverbial",
            confidence: 0.95,
          },
          {
            i: 7,
            text: "?",
            start: 41,
            end: 42,
            lemma: "?",
            pos: "punctuation",
            sub: null,
            role: null,
            confidence: 0.95,
          },
        ],
        groups: [
          {
            id: "vg-1",
            type: "verb-group",
            tokens: [0, 2],
            keys: ["polite-request"],
            time: "present",
            aspect: "simple",
            voice: "voice-active",
            confidence: 0.95,
          },
          {
            id: "pat-1",
            type: "pattern",
            key: "polite-request",
            family: "polite-request",
            tokens: [0, 1, 2],
            confidence: 0.95,
          },
        ],
        sentence: {
          function: "interrogative",
          structure: "simple",
        },
      },
    ],
  };

  try {
    await t.test("Valid future-content fixture is accepted with zero code changes", () => {
      fs.writeFileSync(FIXTURE_FILE, JSON.stringify(validFixture, null, 2), "utf-8");

      const stdout = execFileSync("node", [CHECK_SCRIPT], {
        encoding: "utf-8",
        cwd: path.resolve(__dirname, ".."),
      });

      assert.match(
        stdout,
        /ALL GRAMMAR INTEGRITY & TAXONOMY CHECKS PASSED/,
        "grammar-check.mjs must pass on newly introduced conversation data without code modifications"
      );
    });

    await t.test("Corrupted/unregistered category in future-content blocks the build gate", () => {
      // Intentionally introduce an unmapped category key
      const corruptedFixture = JSON.parse(JSON.stringify(validFixture));
      corruptedFixture.lines[0].tokens[4].pos = "unregistered-alien-pos";

      fs.writeFileSync(FIXTURE_FILE, JSON.stringify(corruptedFixture, null, 2), "utf-8");

      let checkFailed = false;
      try {
        execFileSync("node", [CHECK_SCRIPT], {
          encoding: "utf-8",
          cwd: path.resolve(__dirname, ".."),
          stdio: "pipe",
        });
      } catch (err) {
        checkFailed = true;
        assert.match(
          err.stderr || err.stdout,
          /unknown token pos 'unregistered-alien-pos'/,
          "Build gate must catch unregistered categories"
        );
      }

      assert.equal(
        checkFailed,
        true,
        "Build gate must fail when future content violates taxonomy"
      );
    });
  } finally {
    // Strictly cleanup temporary fixture
    if (fs.existsSync(FIXTURE_FILE)) {
      fs.unlinkSync(FIXTURE_FILE);
    }
  }

  await t.test("Cleanup restoration passes cleanly", () => {
    assert.equal(fs.existsSync(FIXTURE_FILE), false, "Fixture must be removed");
    const stdout = execFileSync("node", [CHECK_SCRIPT], {
      encoding: "utf-8",
      cwd: path.resolve(__dirname, ".."),
    });
    assert.match(stdout, /ALL GRAMMAR INTEGRITY & TAXONOMY CHECKS PASSED/);
  });
});
