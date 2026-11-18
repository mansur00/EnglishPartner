import { t } from "../i18n/index.ts";

export interface LineTranslationDisplay {
  displayText: string;
  isDraftPreview: boolean;
  isComingSoon: boolean;
  isApproved: boolean;
}

/**
 * Resolves honest learner vs admin translation display state per Multi-Language §6.2:
 * - Approved: full translation text
 * - Draft / In-Review (Learner): "Bangla translation coming soon"
 * - Draft / In-Review (Admin): full translation text with Draft Preview badge
 */
export function getLineTranslationDisplay(
  line: { translationBn?: string; translationReviewStatus?: string },
  isAdminPreview = false
): LineTranslationDisplay {
  const isApproved = line.translationReviewStatus === "approved";

  if (isApproved) {
    return {
      displayText: line.translationBn || "",
      isDraftPreview: false,
      isComingSoon: false,
      isApproved: true,
    };
  }

  if (isAdminPreview) {
    return {
      displayText: line.translationBn || "",
      isDraftPreview: true,
      isComingSoon: false,
      isApproved: false,
    };
  }

  return {
    displayText: t("reader.translationComingSoon"),
    isDraftPreview: false,
    isComingSoon: true,
    isApproved: false,
  };
}
