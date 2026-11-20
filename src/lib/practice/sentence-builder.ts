/**
 * Core business logic and validators for Sentence Builder practice mode
 * Complies with ECP_Exercises_SRS_Spec.md §4.2 and §5
 */

/**
 * Normalizes a chunk for comparison: trims whitespace, lowercases, and strips trailing punctuation
 */
export function normalizeChunk(text: string): string {
  return text.trim().toLowerCase().replace(/[.,?!]+$/, "");
}

/**
 * Validates a placed sequence of chunks against accepted orders.
 * Returns isCorrect boolean and array of 0-based indices for misplaced chunks.
 */
export function validateSentenceOrder(
  placed: string[],
  acceptedOrders: string[][]
): { isCorrect: boolean; misplacedIndices: number[] } {
  const normPlaced = placed.map(normalizeChunk);

  // Check if fully matching any accepted order
  for (const order of acceptedOrders) {
    if (order.length === placed.length) {
      const normOrder = order.map(normalizeChunk);
      const isMatch = normPlaced.every((chunk, idx) => chunk === normOrder[idx]);
      if (isMatch) {
        return { isCorrect: true, misplacedIndices: [] };
      }
    }
  }

  // If not matching, find closest order to identify specifically out-of-place chunks
  let bestOrder = acceptedOrders[0] || [];
  let maxMatches = -1;

  for (const order of acceptedOrders) {
    const normOrder = order.map(normalizeChunk);
    let matches = 0;
    for (let i = 0; i < Math.min(normPlaced.length, normOrder.length); i++) {
      if (normPlaced[i] === normOrder[i]) matches++;
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestOrder = order;
    }
  }

  const normBest = bestOrder.map(normalizeChunk);
  const misplaced: number[] = [];

  for (let i = 0; i < normPlaced.length; i++) {
    if (normPlaced[i] !== normBest[i]) {
      misplaced.push(i);
    }
  }

  return { isCorrect: false, misplacedIndices: misplaced };
}
