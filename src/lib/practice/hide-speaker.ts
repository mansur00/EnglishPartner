import type { LadderSpeaker, LadderDialogueLine } from "../../content/seed/niche_shopping_money.ts";
import { normalizeAnswer } from "./complete-line.ts";

export interface RoleplayPerspective {
  learnerSpeaker: LadderSpeaker;
  partnerSpeaker: LadderSpeaker;
}

export type RevealMode = "on_request" | "after_answer";

/**
 * Resolves learner and partner speakers given selected speaker ID
 */
export function resolveSpeakerPerspective(
  speakers: LadderSpeaker[],
  learnerSpeakerId: string
): RoleplayPerspective {
  const learner =
    speakers.find((s) => s.id === learnerSpeakerId) ||
    speakers[1] ||
    speakers[0];
  const partner =
    speakers.find((s) => s.id !== learner.id) ||
    speakers[0];

  return {
    learnerSpeaker: learner,
    partnerSpeaker: partner,
  };
}

/**
 * Checks whether a given dialogue line belongs to the learner
 */
export function isLearnerLine(
  line: LadderDialogueLine,
  learnerSpeakerId: string
): boolean {
  return line.speakerId === learnerSpeakerId;
}

/**
 * Evaluates a learner's typed or transcribed speech against target sentence
 */
export function evaluateLearnerTurn(
  userInput: string,
  targetEnglish: string
): { isMatch: boolean; score: number } {
  const normUser = normalizeAnswer(userInput);
  const normTarget = normalizeAnswer(targetEnglish);

  if (!normUser || !normTarget) {
    return { isMatch: false, score: 0 };
  }

  if (normUser === normTarget) {
    return { isMatch: true, score: 100 };
  }

  const userWords = normUser.split(/\s+/);
  const targetWords = normTarget.split(/\s+/);

  let matchedWords = 0;
  for (const word of targetWords) {
    if (userWords.includes(word)) {
      matchedWords++;
    }
  }

  const score = Math.round((matchedWords / targetWords.length) * 100);
  return {
    isMatch: score >= 70,
    score,
  };
}
