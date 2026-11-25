import test from "node:test";
import assert from "node:assert/strict";
import {
  CONVERSATION_QUIZ_COUNTS,
  LEVEL_ASSESSMENT_QUESTION_COUNT,
  computeLevelBreakdown,
  estimateCefrLevelFromBreakdown,
} from "../src/lib/quiz/types.ts";
import { buildFallbackLevelAssessment } from "../src/lib/quiz/level-assessment-bank.ts";
import { buildConversationQuizQuestions } from "../src/lib/quiz/conversation-quiz.ts";
import { SEED_SCENARIOS } from "../src/content/seed/scenarios.ts";
import { SEED_DIALOGUES } from "../src/content/seed/dialogues.ts";

test("Quiz Engine: level assessment bank provides 40 4-option MCQs across A1-C2", () => {
  const questions = buildFallbackLevelAssessment(0);
  assert.equal(questions.length, LEVEL_ASSESSMENT_QUESTION_COUNT);
  for (const q of questions) {
    assert.equal(q.options.length, 4);
    assert.ok(q.correctIndex >= 0 && q.correctIndex <= 3);
    assert.ok(q.prompt.length > 0);
  }
});

test("Quiz Engine: conversation quiz scales 10-30 questions by CEFR level", () => {
  const scenario = SEED_SCENARIOS[0];
  const lines = SEED_DIALOGUES[scenario.slug][0].lines;

  for (const [level, expectedCount] of Object.entries(CONVERSATION_QUIZ_COUNTS)) {
    const qs = buildConversationQuizQuestions({
      scenario,
      lines,
      level,
      lengthTierId: `${level.toLowerCase()}-short`,
      style: "neutral",
      seedOffset: 1,
    });
    assert.equal(qs.length, expectedCount, `Expected ${expectedCount} questions for ${level}`);
    for (const q of qs) {
      assert.equal(q.options.length, 4);
      assert.ok(q.correctIndex >= 0 && q.correctIndex <= 3);
    }
  }
});

test("Quiz Engine: CEFR breakdown & estimation works accurately", () => {
  const questions = buildFallbackLevelAssessment(0);
  const answers = {};
  for (const q of questions) {
    // Answer A1, A2, B1 correctly; miss B2, C1, C2
    answers[q.id] =
      q.cefrLevel === "A1" || q.cefrLevel === "A2" || q.cefrLevel === "B1"
        ? q.correctIndex
        : (q.correctIndex + 1) % 4;
  }
  const breakdown = computeLevelBreakdown(questions, answers);
  const estimated = estimateCefrLevelFromBreakdown(breakdown);
  assert.equal(estimated, "B1");
});
