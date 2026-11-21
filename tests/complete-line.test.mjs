import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeAnswer,
  validateBlankAnswer,
  generateMaskedSentence,
} from "../src/lib/practice/complete-line.ts";
import { SEED_EXERCISES_MAP } from "../src/content/seed/exercises.ts";

describe("Milestone 2C: Complete Line (Fill-in-the-blanks) Practice Mode", () => {
  describe("1. Answer Normalization", () => {
    it("handles lowercase conversion, trimming, and punctuation removal", () => {
      assert.equal(normalizeAnswer("  Much.  "), "much");
      assert.equal(normalizeAnswer('"Bag?"'), "bag");
      assert.equal(normalizeAnswer("welcome!"), "welcome");
      assert.equal(normalizeAnswer(""), "");
    });
  });

  describe("2. Blank Answer Validation", () => {
    it("accepts exact and case-insensitive matching answers", () => {
      const { isCorrect } = validateBlankAnswer("much", ["much", "many"]);
      assert.equal(isCorrect, true);

      const caseCheck = validateBlankAnswer("MUCH", ["much"]);
      assert.equal(caseCheck.isCorrect, true);
    });

    it("rejects incorrect answers cleanly", () => {
      const { isCorrect } = validateBlankAnswer("cost", ["much"]);
      assert.equal(isCorrect, false);
    });

    it("handles empty input gracefully", () => {
      const { isCorrect } = validateBlankAnswer("", ["much"]);
      assert.equal(isCorrect, false);
    });
  });

  describe("3. Masked Sentence Generation", () => {
    it("replaces target word with blank marker", () => {
      const masked = generateMaskedSentence("How much is this bag?", "much");
      assert.equal(masked, "How ___ is this bag?");
    });

    it("handles words case-insensitively", () => {
      const masked = generateMaskedSentence("Can I HELP you?", "help");
      assert.equal(masked, "Can I ___ you?");
    });
  });

  describe("4. Seed Exercises Data Integrity", () => {
    it("verifies Step 01 complete line exercises exist with valid answers", () => {
      const step1 = SEED_EXERCISES_MAP["shopping-money-step-01"];
      assert.ok(step1, "Step 01 exercises must exist");
      assert.ok(step1.completeLines.length >= 2, "Step 01 must have at least 2 complete line exercises");

      for (const ex of step1.completeLines) {
        assert.ok(ex.maskedSentence.includes("___"), "Must contain blank marker");
        assert.ok(ex.fullSentence, "Must have full sentence");
        assert.ok(ex.translationBn, "Must have Bengali translation");
        assert.ok(ex.blanks[0].options.includes(ex.blanks[0].correctAnswer), "Options must contain correct answer");
      }
    });
  });
});
