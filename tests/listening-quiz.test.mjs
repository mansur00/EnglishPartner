import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateQuizAnswer,
  calculateQuizScore,
  generateFallbackQuizzes,
  ListeningQuizItemDataSchema,
} from "../src/lib/practice/listening-quiz.ts";
import { SEED_EXERCISES_MAP } from "../src/content/seed/exercises.ts";

describe("Milestone 2A: Listening Comprehension Quiz Engine", () => {
  const mockQuestion = {
    id: "q-test-01",
    stepSlug: "test-step",
    question: "How much does the shirt cost?",
    questionBn: "শার্টটির দাম কত ছিল?",
    audioPrompt: "The shirt is twenty dollars.",
    options: [
      { id: "a", text: "Ten dollars", textBn: "দশ ডলার" },
      { id: "b", text: "Twenty dollars", textBn: "বিশ ডলার" },
      { id: "c", text: "Thirty dollars", textBn: "ত্রিশ ডলার" },
    ],
    correctOptionId: "b",
    explanationBn: 'দোকানদার বলেছিলেন: "The shirt is twenty dollars" (বিশ ডলার)।',
  };

  describe("1. Answer Evaluation (Brief §10.4 & §20 Rule 5)", () => {
    it("correctly identifies the right answer and adds positive feedback", () => {
      const evaluation = evaluateQuizAnswer(mockQuestion, "b");
      assert.equal(evaluation.isCorrect, true);
      assert.equal(evaluation.isSkipped, false);
      assert.equal(evaluation.scoreDelta, 1);
      assert.match(evaluation.feedbackBn, /সঠিক/);
      assert.equal(evaluation.correctOptionId, "b");
    });

    it("evaluates incorrect answer gently without judgement", () => {
      const evaluation = evaluateQuizAnswer(mockQuestion, "a");
      assert.equal(evaluation.isCorrect, false);
      assert.equal(evaluation.isSkipped, false);
      assert.equal(evaluation.scoreDelta, 0);
      assert.match(evaluation.feedbackBn, /ব্যাখ্যাটি ভালো করে লক্ষ্য করুন/);
      assert.equal(evaluation.explanationBn, mockQuestion.explanationBn);
    });

    it("handles skipped question gracefully", () => {
      const evaluation = evaluateQuizAnswer(mockQuestion, null);
      assert.equal(evaluation.isCorrect, false);
      assert.equal(evaluation.isSkipped, true);
      assert.equal(evaluation.scoreDelta, 0);
      assert.match(evaluation.feedbackBn, /বাদ দেওয়া হয়েছে/);
    });
  });

  describe("2. Score & Pedagogical Tier Calculation", () => {
    it("rates 100% score as perfect mastery", () => {
      const score = calculateQuizScore(5, 5, 0);
      assert.equal(score.percentage, 100);
      assert.equal(score.rating, "perfect");
      assert.match(score.ratingLabelEn, /Mastery/i);
    });

    it("rates 80% score as proficient", () => {
      const score = calculateQuizScore(5, 4, 0);
      assert.equal(score.percentage, 80);
      assert.equal(score.rating, "proficient");
    });

    it("rates 60% score as developing", () => {
      const score = calculateQuizScore(5, 3, 0);
      assert.equal(score.percentage, 60);
      assert.equal(score.rating, "developing");
    });

    it("rates low score as needs review", () => {
      const score = calculateQuizScore(5, 1, 1);
      assert.equal(score.percentage, 20);
      assert.equal(score.rating, "needs_review");
      assert.equal(score.skippedCount, 1);
      assert.equal(score.incorrectCount, 3);
    });
  });

  describe("3. Item Data Schema Conformance (ECP_Exercises_SRS_Spec §4.1)", () => {
    it("validates compliant listening quiz item data", () => {
      const validItem = {
        options: [
          { id: "a", text: "The station is across the road." },
          { id: "b", text: "The station is closed today." },
          { id: "c", text: "The station is far from here." },
        ],
        correct_option_id: "a",
        allow_multiple: false,
      };

      const parsed = ListeningQuizItemDataSchema.safeParse(validItem);
      assert.equal(parsed.success, true);
    });

    it("rejects item data with fewer than 2 options", () => {
      const invalidItem = {
        options: [{ id: "a", text: "Only one option" }],
        correct_option_id: "a",
      };

      const parsed = ListeningQuizItemDataSchema.safeParse(invalidItem);
      assert.equal(parsed.success, false);
    });
  });

  describe("4. Fallback Quiz Generation", () => {
    it("generates fallback quizzes from dialogue lines", () => {
      const mockLines = [
        { speakerName: "Salesperson", englishText: "Hello, how can I help you?", translationBn: "হ্যালো, কীভাবে সাহায্য করতে পারি?" },
        { speakerName: "Customer", englishText: "How much is this watch?", translationBn: "এই ঘড়িটির দাম কত?" },
      ];

      const quizzes = generateFallbackQuizzes("test-step", mockLines);
      assert.equal(quizzes.length, 2);
      assert.equal(quizzes[0].correctOptionId, "a");
      assert.equal(quizzes[0].options[0].text, mockLines[0].englishText);
      assert.equal(quizzes[0].options.length, 3);
      assert.match(quizzes[0].question, /Salesperson/);
    });
  });

  describe("5. Seed Exercises Data Integrity", () => {
    const stepsToCheck = [
      "shopping-money-step-01",
      "shopping-money-step-02",
      "shopping-money-step-03",
    ];

    for (const stepKey of stepsToCheck) {
      it(`verifies listening quiz items in ${stepKey}`, () => {
        const stepData = SEED_EXERCISES_MAP[stepKey];
        assert.ok(stepData);
        assert.ok(stepData.listeningQuizzes.length >= 2);

        for (const quiz of stepData.listeningQuizzes) {
          assert.ok(quiz.id);
          assert.ok(quiz.question.length > 0);
          assert.ok(quiz.questionBn.length > 0);
          assert.ok(quiz.options.length >= 2);
          assert.ok(quiz.explanationBn.length > 0);

          const optionIds = quiz.options.map((o) => o.id);
          assert.ok(
            optionIds.includes(quiz.correctOptionId),
            `Question ${quiz.id} correctOptionId (${quiz.correctOptionId}) not found in options [${optionIds.join(", ")}]`
          );
        }
      });
    }
  });
});
