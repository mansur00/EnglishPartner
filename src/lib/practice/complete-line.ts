/**
 * Business logic for Complete Line / Fill-in-the-blanks exercise mode
 * Complies with ECP_Exercises_SRS_Spec.md §4.5
 */

/**
 * Normalizes an answer string by trimming, lowercasing, and stripping surrounding punctuation
 */
export function normalizeAnswer(text: string): string {
  if (!text) return "";
  return text
    .trim()
    .toLowerCase()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/[.,!?;:]+$/g, "");
}

/**
 * Validates a user's answer against accepted answers
 */
export function validateBlankAnswer(
  userInput: string,
  acceptedAnswers: string[]
): { isCorrect: boolean; normalizedInput: string } {
  const normalizedInput = normalizeAnswer(userInput);
  if (!normalizedInput) {
    return { isCorrect: false, normalizedInput: "" };
  }

  const isCorrect = acceptedAnswers.some(
    (ans) => normalizeAnswer(ans) === normalizedInput
  );

  return { isCorrect, normalizedInput };
}

/**
 * Replaces target word in a full sentence with blank marker (default: '___')
 */
export function generateMaskedSentence(
  fullSentence: string,
  targetWord: string,
  blankMarker: string = "___"
): string {
  if (!fullSentence || !targetWord) return fullSentence;
  const regex = new RegExp(`\\b${targetWord}\\b`, "i");
  return fullSentence.replace(regex, blankMarker);
}
