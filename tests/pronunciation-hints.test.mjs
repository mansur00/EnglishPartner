import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeSpokenText,
  lookupWordPhoneticGuide,
  evaluatePronunciationQuality,
  PRONUNCIATION_HINTS_DICTIONARY,
  AUTOMATED_AUDIO_DISCLAIMER_BN,
} from "../src/lib/practice/pronunciation.ts";

test("Milestone 3C: normalizeSpokenText expands contractions and cleans punctuation", () => {
  const input = "It's five hundred taka, can't you see?!";
  const normalized = normalizeSpokenText(input);
  assert.equal(normalized, "it is five hundred taka cannot you see");
});

test("Milestone 3C: lookupWordPhoneticGuide finds curated tricky words in Bengali dictionary", () => {
  // Silent letter check
  const receiptGuide = lookupWordPhoneticGuide("receipt");
  assert.ok(receiptGuide);
  assert.equal(receiptGuide.phoneticHint, "ri-SEET");
  assert.equal(receiptGuide.category, "silent_letter");
  assert.ok(receiptGuide.bengaliTip.includes("অনুচ্চারিত"));

  // Syllable reduction check
  const comfortableGuide = lookupWordPhoneticGuide("comfortable");
  assert.ok(comfortableGuide);
  assert.equal(comfortableGuide.phoneticHint, "KOMF-tuh-bl");
  assert.equal(comfortableGuide.category, "vowel_reduction");
  assert.ok(comfortableGuide.bengaliTip.includes("তিনটি সিলেবলে"));

  // 'th' fricative check
  const threeGuide = lookupWordPhoneticGuide("three");
  assert.ok(threeGuide);
  assert.equal(threeGuide.category, "th_sound");
  assert.ok(threeGuide.bengaliTip.includes("জিহ্বার ডগা"));

  // Bengali 'ischool' epenthesis cluster check
  const schoolGuide = lookupWordPhoneticGuide("school");
  assert.ok(schoolGuide);
  assert.equal(schoolGuide.category, "consonant_cluster");
  assert.ok(schoolGuide.bengaliTip.includes("ischool"));
});

test("Milestone 3C: lookupWordPhoneticGuide provides phonological heuristic fallback", () => {
  // Unknown word with 'th'
  const thrillerGuide = lookupWordPhoneticGuide("thriller");
  assert.ok(thrillerGuide);
  assert.equal(thrillerGuide.category, "th_sound");

  // Unknown word starting with 'st' (consonant cluster)
  const stellarGuide = lookupWordPhoneticGuide("stellar");
  assert.ok(stellarGuide);
  assert.equal(stellarGuide.category, "consonant_cluster");
});

test("Milestone 3C: evaluatePronunciationQuality rates perfect speech as 'clear'", () => {
  const target = "Can I pay by card?";
  const spoken = "can i pay by card";
  const assessment = evaluatePronunciationQuality(target, spoken);

  assert.equal(assessment.tier, "clear");
  assert.equal(assessment.clearWordsCount, 5);
  assert.equal(assessment.unclearWordsCount, 0);
  assert.equal(assessment.missedWordsCount, 0);
  assert.equal(assessment.totalWords, 5);
  assert.ok(assessment.feedbackBn.includes("চমৎকার"));
  assert.equal(assessment.tokens.length, 5);
  assert.ok(assessment.tokens.every((t) => t.status === "clear"));
});

test("Milestone 3C: evaluatePronunciationQuality rates partial speech as 'getting_there'", () => {
  const target = "Hello. Can I help you?";
  const spoken = "Hello can you";
  const assessment = evaluatePronunciationQuality(target, spoken);

  // 3 of 5 words detected ("hello", "can", "you") -> >= half -> getting_there
  assert.equal(assessment.tier, "getting_there");
  assert.equal(assessment.clearWordsCount, 3);
  assert.ok(assessment.missedWordsCount > 0);
  assert.ok(assessment.feedbackBn.includes("বেশ ভালো হয়েছে"));

  // Actionable Bengali tips generated for missed/unclear words
  assert.ok(assessment.actionableTipsBn.length > 0);
  assert.ok(assessment.actionableTipsBn.some((tip) => tip.includes("help")));
});

test("Milestone 3C: evaluatePronunciationQuality rates poor or empty speech as 'needs_practice'", () => {
  const target = "It is five hundred taka.";
  const spoken = "";
  const assessment = evaluatePronunciationQuality(target, spoken);

  assert.equal(assessment.tier, "needs_practice");
  assert.equal(assessment.clearWordsCount, 0);
  assert.ok(assessment.feedbackBn.includes("কোনো স্পষ্ট শব্দ ধরা পড়েনি"));
});

test("Milestone 3C: Brief §9.3 & §20 Invariant - Strictly NO fake decimal or percentage precision scores", () => {
  const target = "Do you have it in blue?";
  const spoken = "do you have it";
  const assessment = evaluatePronunciationQuality(target, spoken);

  // Assert that assessment object has NO numeric "score" or "percentage" property
  const keys = Object.keys(assessment);
  assert.ok(!keys.includes("score"));
  assert.ok(!keys.includes("percentage"));
  assert.ok(!keys.includes("pronunciationScore"));
  assert.ok(!keys.includes("accuracyPercentage"));

  // Verify disclaimer is present and transparent
  assert.equal(assessment.disclaimerBn, AUTOMATED_AUDIO_DISCLAIMER_BN);
  assert.ok(assessment.disclaimerBn.includes("স্বয়ংক্রিয় অডিও বিশ্লেষণ"));
  assert.ok(assessment.disclaimerBn.includes("শতাংশ নম্বরের পরিবর্তে"));
});

test("Milestone 3C: PRONUNCIATION_HINTS_DICTIONARY has comprehensive coverage of essential vocabulary", () => {
  const sampleWords = ["receipt", "comfortable", "island", "three", "very", "water", "school", "help", "discount"];
  for (const word of sampleWords) {
    assert.ok(PRONUNCIATION_HINTS_DICTIONARY[word], `Missing dictionary entry for ${word}`);
    assert.ok(PRONUNCIATION_HINTS_DICTIONARY[word].phoneticHint);
    assert.ok(PRONUNCIATION_HINTS_DICTIONARY[word].bengaliTip);
  }
});
