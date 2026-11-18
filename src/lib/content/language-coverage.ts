/**
 * Scenario Language Coverage Calculator
 * Complies with Multi-Language Strategy §6.3:
 * "Each scenario shows which languages it has, on the card and detail page:
 *  Languages: English ✓   Bangla ✓   Hindi —
 *  Use text plus a symbol, not colour alone."
 *
 * Rules:
 * - English ✓ is shown always.
 * - Bangla ✓ is shown only if an approved translation exists for each line, otherwise "Bangla —".
 */

export interface LanguageCoverageStatus {
  code: string;
  label: string;
  hasApproved: boolean;
  displayText: string;
}

export function computeScenarioLanguageCoverage(
  scenarioLanguages: string[] = ["en", "bn"],
  lines?: Array<{ translationBn?: string; reviewStatus?: string }>
): LanguageCoverageStatus[] {
  const result: LanguageCoverageStatus[] = [
    {
      code: "en",
      label: "English",
      hasApproved: true,
      displayText: "English ✓",
    },
  ];

  if (scenarioLanguages.includes("bn")) {
    const hasLines = Boolean(lines && lines.length > 0);
    const hasApprovedBangla =
      hasLines &&
      lines!.every(
        (l) => l.reviewStatus === "approved" && Boolean(l.translationBn && l.translationBn.trim())
      );

    result.push({
      code: "bn",
      label: "Bangla",
      hasApproved: hasApprovedBangla,
      displayText: hasApprovedBangla ? "Bangla ✓" : "Bangla —",
    });
  }

  return result;
}

export function formatLanguageCoverageLine(
  scenarioLanguages: string[] = ["en", "bn"],
  lines?: Array<{ translationBn?: string; reviewStatus?: string }>
): string {
  const coverage = computeScenarioLanguageCoverage(scenarioLanguages, lines);
  return coverage.map((c) => c.displayText).join(" · ");
}
