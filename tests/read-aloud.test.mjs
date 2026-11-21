import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeSpokenText,
  compareSpokenSentence,
  SELF_CHECK_RATINGS,
} from "../src/lib/practice/read-aloud.ts";

test("Read Aloud: normalizeSpokenText expands contractions and strips punctuation", () => {
  const input = "It's five hundred taka, can't you see?!";
  const normalized = normalizeSpokenText(input);
  assert.equal(normalized, "it is five hundred taka cannot you see");
});

test("Read Aloud: compareSpokenSentence detects 100% match accurately", () => {
  const target = "How much is this bag?";
  const spoken = "how much is this bag";
  const res = compareSpokenSentence(spoken, target);

  assert.equal(res.matchPercentage, 100);
  assert.equal(res.matchedCount, 5);
  assert.equal(res.totalTargetWords, 5);
  assert.deepEqual(res.missingWords, []);
  assert.ok(res.feedbackBn.includes("চমৎকার"));
});

test("Read Aloud: compareSpokenSentence handles contraction in spoken speech", () => {
  const target = "It is five hundred taka.";
  const spoken = "It's five hundred taka.";
  const res = compareSpokenSentence(spoken, target);

  assert.equal(res.matchPercentage, 100);
  assert.deepEqual(res.missingWords, []);
});

test("Read Aloud: compareSpokenSentence flags missing words constructively", () => {
  const target = "Hello. Can I help you?";
  const spoken = "Hello can you";
  const res = compareSpokenSentence(spoken, target);

  assert.ok(res.matchPercentage < 100);
  assert.ok(res.missingWords.includes("i"));
  assert.ok(res.missingWords.includes("help"));
  assert.ok(res.feedbackBn.includes("মডেল অডিওর সাথে মিলিয়ে"));
});

test("Read Aloud: compareSpokenSentence handles empty spoken input cleanly", () => {
  const target = "Thank you very much.";
  const res = compareSpokenSentence("", target);

  assert.equal(res.matchedCount, 0);
  assert.equal(res.matchPercentage, 0);
  assert.equal(res.missingWords.length, 4);
  assert.ok(res.feedbackBn.includes("কোনো স্পষ্ট শব্দ ধরা পড়েনি"));
});

test("Read Aloud: SELF_CHECK_RATINGS has 3 levels with complete EN and BN metadata", () => {
  assert.equal(SELF_CHECK_RATINGS.length, 3);
  const ratings = SELF_CHECK_RATINGS.map((r) => r.rating);
  assert.deepEqual(ratings, ["needs_practice", "getting_there", "clear"]);

  for (const item of SELF_CHECK_RATINGS) {
    assert.ok(item.labelEn);
    assert.ok(item.labelBn);
    assert.ok(item.descriptionBn);
  }
});
