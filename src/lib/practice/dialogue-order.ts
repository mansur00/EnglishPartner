/**
 * Core business logic, reordering helpers, and validation for Dialogue Ordering practice mode
 * Complies with ECP_Exercises_SRS_Spec.md §4.3
 */

import type { DialogueOrderTurn } from "@/content/seed/exercises";

export interface DialogueOrderValidationResult {
  isCorrect: boolean;
  misplacedIndices: number[];
  misplacedTurnIds: string[];
  firstMisplacedIndex: number;
}

export interface DialogueOrderHint {
  turnId: string;
  expectedSpeaker: string;
  expectedText: string;
  correctIndex: number;
  explanationBn: string;
}

/**
 * Validates the current sequential order of dialogue turns.
 * Sequential correctness requires currentTurns[i].correctSequence === i + 1
 */
export function validateDialogueOrder(
  currentTurns: DialogueOrderTurn[]
): DialogueOrderValidationResult {
  if (!currentTurns || currentTurns.length === 0) {
    return {
      isCorrect: true,
      misplacedIndices: [],
      misplacedTurnIds: [],
      firstMisplacedIndex: -1,
    };
  }

  const misplacedIndices: number[] = [];
  const misplacedTurnIds: string[] = [];

  currentTurns.forEach((turn, idx) => {
    const expectedSequence = idx + 1;
    if (turn.correctSequence !== expectedSequence) {
      misplacedIndices.push(idx);
      misplacedTurnIds.push(turn.id);
    }
  });

  const isCorrect = misplacedIndices.length === 0;
  const firstMisplacedIndex = isCorrect ? -1 : misplacedIndices[0];

  return {
    isCorrect,
    misplacedIndices,
    misplacedTurnIds,
    firstMisplacedIndex,
  };
}

/**
 * Moves a dialogue turn from one position to another in the array
 */
export function moveDialogueTurn(
  turns: DialogueOrderTurn[],
  fromIndex: number,
  toIndex: number
): DialogueOrderTurn[] {
  if (
    fromIndex < 0 ||
    fromIndex >= turns.length ||
    toIndex < 0 ||
    toIndex >= turns.length ||
    fromIndex === toIndex
  ) {
    return turns;
  }

  const result = [...turns];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Deterministically or pseudo-randomly shuffles dialogue turns.
 * Guarantees the output is not already in the 100% correct sequence.
 */
export function shuffleDialogueTurns(
  turns: DialogueOrderTurn[],
  seed?: number
): DialogueOrderTurn[] {
  if (turns.length <= 1) return [...turns];

  const shuffled = [...turns];

  if (typeof seed === "number") {
    // Deterministic pseudo-random Fisher-Yates using simple LCG
    let state = Math.abs(seed) || 12345;
    for (let i = shuffled.length - 1; i > 0; i--) {
      state = (state * 1664525 + 1013904223) % 4294967296;
      const j = Math.floor((state / 4294967296) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } else {
    // Standard Fisher-Yates
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }

  // Ensure it's not accidentally in the exact correct order
  const check = validateDialogueOrder(shuffled);
  if (check.isCorrect && shuffled.length >= 2) {
    // Swap first two to guarantee an exercise state
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }

  return shuffled;
}

/**
 * Computes a pedagogical hint for the learner:
 * Finds the first slot where the turn is misplaced and informs which turn belongs there
 */
export function getDialogueOrderHint(
  currentTurns: DialogueOrderTurn[]
): DialogueOrderHint | null {
  const check = validateDialogueOrder(currentTurns);
  if (check.isCorrect || check.firstMisplacedIndex === -1) {
    return null;
  }

  const targetIndex = check.firstMisplacedIndex;
  const targetSequence = targetIndex + 1;
  const correctTurn = currentTurns.find((t) => t.correctSequence === targetSequence);

  if (!correctTurn) return null;

  return {
    turnId: correctTurn.id,
    expectedSpeaker: correctTurn.speakerName,
    expectedText: correctTurn.englishText,
    correctIndex: targetIndex,
    explanationBn: `ধাপ ${targetSequence}-এ ${correctTurn.speakerName} এর ডায়লগটি আসবে: "${correctTurn.englishText}"।`,
  };
}
