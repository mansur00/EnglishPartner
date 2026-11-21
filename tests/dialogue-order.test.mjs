import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateDialogueOrder,
  moveDialogueTurn,
  shuffleDialogueTurns,
  getDialogueOrderHint,
} from "../src/lib/practice/dialogue-order.ts";
import { SEED_EXERCISES_MAP } from "../src/content/seed/exercises.ts";

const sampleTurns = [
  {
    id: "turn-1",
    correctSequence: 1,
    speakerName: "Rafi",
    speakerRole: "Shop Assistant",
    englishText: "Hello. Can I help you?",
    translationBn: "নমস্কার। আমি কি আপনাকে সাহায্য করতে পারি?",
  },
  {
    id: "turn-2",
    correctSequence: 2,
    speakerName: "Nadia",
    speakerRole: "Customer",
    englishText: "Yes. How much is this bag?",
    translationBn: "হ্যাঁ। এই ব্যাগটার দাম কত?",
  },
  {
    id: "turn-3",
    correctSequence: 3,
    speakerName: "Rafi",
    speakerRole: "Shop Assistant",
    englishText: "It is five hundred taka.",
    translationBn: "এটির দাম পাঁচশো টাকা।",
  },
  {
    id: "turn-4",
    correctSequence: 4,
    speakerName: "Nadia",
    speakerRole: "Customer",
    englishText: "Okay. Thank you.",
    translationBn: "ঠিক আছে। ধন্যবাদ।",
  },
];

test("Dialogue Order: Empty or single turn array is trivially valid", () => {
  const emptyRes = validateDialogueOrder([]);
  assert.equal(emptyRes.isCorrect, true);
  assert.deepEqual(emptyRes.misplacedIndices, []);
  assert.equal(emptyRes.firstMisplacedIndex, -1);
});

test("Dialogue Order: Correct sequential order yields isCorrect: true", () => {
  const res = validateDialogueOrder(sampleTurns);
  assert.equal(res.isCorrect, true);
  assert.deepEqual(res.misplacedIndices, []);
  assert.deepEqual(res.misplacedTurnIds, []);
  assert.equal(res.firstMisplacedIndex, -1);
});

test("Dialogue Order: Swapped turns are identified with exact misplaced indices", () => {
  // Swap 1 and 2: [turn-2 (seq 2), turn-1 (seq 1), turn-3 (seq 3), turn-4 (seq 4)]
  const swapped = [sampleTurns[1], sampleTurns[0], sampleTurns[2], sampleTurns[3]];
  const res = validateDialogueOrder(swapped);

  assert.equal(res.isCorrect, false);
  assert.deepEqual(res.misplacedIndices, [0, 1]);
  assert.deepEqual(res.misplacedTurnIds, ["turn-2", "turn-1"]);
  assert.equal(res.firstMisplacedIndex, 0);
});

test("Dialogue Order: moveDialogueTurn accurately moves item up and down", () => {
  // Move index 2 ("turn-3") to index 0
  const moved = moveDialogueTurn(sampleTurns, 2, 0);
  assert.equal(moved.length, sampleTurns.length);
  assert.equal(moved[0].id, "turn-3");
  assert.equal(moved[1].id, "turn-1");
  assert.equal(moved[2].id, "turn-2");
  assert.equal(moved[3].id, "turn-4");

  // Move back from 0 to 2
  const movedBack = moveDialogueTurn(moved, 0, 2);
  assert.deepEqual(movedBack.map((t) => t.id), sampleTurns.map((t) => t.id));
});

test("Dialogue Order: moveDialogueTurn ignores invalid or identical indices", () => {
  const invalidNegative = moveDialogueTurn(sampleTurns, -1, 2);
  assert.equal(invalidNegative, sampleTurns);

  const invalidOutOfRange = moveDialogueTurn(sampleTurns, 0, 99);
  assert.equal(invalidOutOfRange, sampleTurns);

  const sameIndex = moveDialogueTurn(sampleTurns, 1, 1);
  assert.equal(sameIndex, sampleTurns);
});

test("Dialogue Order: shuffleDialogueTurns guarantees turns are not initially in 100% correct order", () => {
  const shuffled = shuffleDialogueTurns(sampleTurns, 42);
  assert.equal(shuffled.length, sampleTurns.length);

  // All turn IDs must still be present
  const originalIds = new Set(sampleTurns.map((t) => t.id));
  assert.equal(shuffled.every((t) => originalIds.has(t.id)), true);

  // Must not be 100% correct sequence
  const validation = validateDialogueOrder(shuffled);
  assert.equal(validation.isCorrect, false);
});

test("Dialogue Order: getDialogueOrderHint points out target turn for the first misplaced slot", () => {
  // Shuffled with turn-3 at index 0 (which should be turn-1)
  const misordered = [sampleTurns[2], sampleTurns[1], sampleTurns[0], sampleTurns[3]];
  const hint = getDialogueOrderHint(misordered);

  assert.ok(hint);
  assert.equal(hint.turnId, "turn-1");
  assert.equal(hint.correctIndex, 0);
  assert.equal(hint.expectedSpeaker, "Rafi");
  assert.ok(hint.explanationBn.includes("Rafi"));
});

test("Dialogue Order: Seed exercises data integrity for step-01", () => {
  const step01 = SEED_EXERCISES_MAP["shopping-money-step-01"];
  assert.ok(step01);
  assert.ok(step01.dialogueOrder);
  assert.equal(step01.dialogueOrder.shuffledTurns.length, 4);

  // Initial shuffled state must not be already solved
  const initialValidation = validateDialogueOrder(step01.dialogueOrder.shuffledTurns);
  assert.equal(initialValidation.isCorrect, false);

  // When sorted by correctSequence, must be completely valid
  const sorted = [...step01.dialogueOrder.shuffledTurns].sort(
    (a, b) => a.correctSequence - b.correctSequence
  );
  const sortedValidation = validateDialogueOrder(sorted);
  assert.equal(sortedValidation.isCorrect, true);
});
