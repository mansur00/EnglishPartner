import { test } from "node:test";
import assert from "node:assert/strict";
import {
  computeScenarioLanguageCoverage,
  formatLanguageCoverageLine,
} from "../src/lib/content/language-coverage.ts";

test("AUD-KI-06: Language coverage computed dynamically from translation status", () => {
  // 1. English always available with checkmark
  const englishOnly = computeScenarioLanguageCoverage(["en"], []);
  assert.equal(englishOnly.length, 1);
  assert.equal(englishOnly[0].displayText, "English ✓");

  // 2. Draft Bangla lines must show "Bangla —" (not "Bangla ✓")
  const draftLines = [
    { translationBn: "হ্যালো", reviewStatus: "draft" },
    { translationBn: "কেমন আছেন?", reviewStatus: "draft" },
  ];
  const draftCoverage = computeScenarioLanguageCoverage(["en", "bn"], draftLines);
  assert.equal(draftCoverage.length, 2);
  assert.equal(draftCoverage[0].displayText, "English ✓");
  assert.equal(draftCoverage[1].displayText, "Bangla —");
  assert.equal(formatLanguageCoverageLine(["en", "bn"], draftLines), "English ✓ · Bangla —");

  // 3. Mixed/partial approved lines must show "Bangla —"
  const mixedLines = [
    { translationBn: "হ্যালো", reviewStatus: "approved" },
    { translationBn: "কেমন আছেন?", reviewStatus: "draft" },
  ];
  const mixedCoverage = computeScenarioLanguageCoverage(["en", "bn"], mixedLines);
  assert.equal(mixedCoverage[1].displayText, "Bangla —");

  // 4. Approved translations across ALL lines yield "Bangla ✓"
  const approvedLines = [
    { translationBn: "হ্যালো", reviewStatus: "approved" },
    { translationBn: "কেমন আছেন?", reviewStatus: "approved" },
  ];
  const approvedCoverage = computeScenarioLanguageCoverage(["en", "bn"], approvedLines);
  assert.equal(approvedCoverage[1].displayText, "Bangla ✓");
  assert.equal(formatLanguageCoverageLine(["en", "bn"], approvedLines), "English ✓ · Bangla ✓");

  // 5. Text plus symbol used per Multi-Language §6.3
  assert.ok(approvedCoverage[1].displayText.includes("✓"));
  assert.ok(draftCoverage[1].displayText.includes("—"));
});
