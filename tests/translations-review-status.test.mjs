import { test } from "node:test";
import assert from "node:assert/strict";
import { SEED_DIALOGUES } from "../src/content/seed/dialogues.ts";
import { getLineTranslationDisplay } from "../src/lib/content/translation-status.ts";
import { t } from "../src/lib/i18n/index.ts";

test("AUD-KI-07: Seed translations are draft until reviewed by a qualified Bangla reviewer", () => {
  // 1. All seed dialogue lines must default to draft review status
  for (const [slug, versions] of Object.entries(SEED_DIALOGUES)) {
    for (const version of versions) {
      for (const line of version.lines) {
        assert.notEqual(
          line.translationReviewStatus,
          "approved",
          `Seed line "${line.id}" in "${slug}" must not be marked approved without human reviewer sign-off`
        );
      }
    }
  }
});

test("AUD-KI-07: getLineTranslationDisplay returns 'Bangla translation coming soon' for unreviewed lines in learner view", () => {
  const draftLine = {
    translationBn: "নমস্কার, আমি কীভাবে সাহায্য করতে পারি?",
    translationReviewStatus: "draft",
  };

  // Learner view (isAdminPreview = false)
  const learnerDisplay = getLineTranslationDisplay(draftLine, false);
  assert.equal(learnerDisplay.isApproved, false);
  assert.equal(learnerDisplay.isComingSoon, true);
  assert.equal(learnerDisplay.isDraftPreview, false);
  assert.equal(learnerDisplay.displayText, t("reader.translationComingSoon"));

  // Admin preview (isAdminPreview = true)
  const adminDisplay = getLineTranslationDisplay(draftLine, true);
  assert.equal(adminDisplay.isApproved, false);
  assert.equal(adminDisplay.isComingSoon, false);
  assert.equal(adminDisplay.isDraftPreview, true);
  assert.equal(adminDisplay.displayText, draftLine.translationBn);

  // Approved line
  const approvedLine = {
    translationBn: "নমস্কার, আমি কীভাবে সাহায্য করতে পারি?",
    translationReviewStatus: "approved",
  };
  const approvedDisplay = getLineTranslationDisplay(approvedLine, false);
  assert.equal(approvedDisplay.isApproved, true);
  assert.equal(approvedDisplay.isComingSoon, false);
  assert.equal(approvedDisplay.displayText, approvedLine.translationBn);
});
