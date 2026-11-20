import { test } from "node:test";
import assert from "node:assert/strict";
import { validateSentenceOrder } from "../src/lib/practice/sentence-builder.ts";
import { SEED_EXERCISES_MAP } from "../src/content/seed/exercises.ts";

test("Sentence Builder: validateSentenceOrder matches correct exact order", () => {
  const placed = ["How much", "is", "this bag?"];
  const acceptedOrders = [["How much", "is", "this bag?"]];

  const result = validateSentenceOrder(placed, acceptedOrders);
  assert.equal(result.isCorrect, true);
  assert.deepEqual(result.misplacedIndices, []);
});

test("Sentence Builder: validateSentenceOrder handles case and trailing punctuation normalization", () => {
  const placed = ["how much", "IS", "this bag"];
  const acceptedOrders = [["How much", "is", "this bag?"]];

  const result = validateSentenceOrder(placed, acceptedOrders);
  assert.equal(result.isCorrect, true);
  assert.deepEqual(result.misplacedIndices, []);
});

test("Sentence Builder: validateSentenceOrder supports multiple acceptable alternative orders", () => {
  const acceptedOrders = [
    ["Please", "tell me", "the price"],
    ["Tell me", "the price", "please"]
  ];

  const result1 = validateSentenceOrder(["Please", "tell me", "the price"], acceptedOrders);
  assert.equal(result1.isCorrect, true);

  const result2 = validateSentenceOrder(["Tell me", "the price", "please"], acceptedOrders);
  assert.equal(result2.isCorrect, true);
});

test("Sentence Builder: validateSentenceOrder flags misplaced chunk indices", () => {
  const placed = ["is", "How much", "this bag?"];
  const acceptedOrders = [["How much", "is", "this bag?"]];

  const result = validateSentenceOrder(placed, acceptedOrders);
  assert.equal(result.isCorrect, false);
  // 'is' at index 0 and 'How much' at index 1 are out of place; 'this bag?' at index 2 matches
  assert.deepEqual(result.misplacedIndices, [0, 1]);
});

test("Sentence Builder: Seed exercises data integrity", () => {
  let count = 0;
  for (const [stepKey, stepData] of Object.entries(SEED_EXERCISES_MAP)) {
    if (stepData.sentenceBuilders) {
      for (const ex of stepData.sentenceBuilders) {
        count++;
        assert.ok(ex.id, `Exercise in ${stepKey} must have an id`);
        assert.ok(ex.fullSentence, `Exercise ${ex.id} must have a fullSentence`);
        assert.ok(ex.translationBn, `Exercise ${ex.id} must have a translationBn`);
        assert.ok(ex.chunks.length >= 2, `Exercise ${ex.id} must have at least 2 chunks`);
        assert.ok(ex.acceptedOrders.length >= 1, `Exercise ${ex.id} must have at least 1 accepted order`);
        assert.ok(ex.explanationBn, `Exercise ${ex.id} must have an explanationBn`);

        // Verify accepted orders contain matching chunks
        for (const order of ex.acceptedOrders) {
          assert.equal(
            order.length,
            ex.chunks.length,
            `Accepted order length in ${ex.id} must match chunks length`
          );
        }
      }
    }
  }

  assert.ok(count >= 4, "Expected at least 4 curated seed sentence builders across steps 1-3");
});
