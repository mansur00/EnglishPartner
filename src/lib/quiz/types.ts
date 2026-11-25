import type { CefrLevelCode, ConversationStyle } from "@/lib/content/length-tiers";

export type QuizKind = "level-assessment" | "conversation";

export type QuizSkillTag =
  | "Vocabulary"
  | "Grammar"
  | "Comprehension"
  | "Register"
  | "Context";

export interface QuizQuestion {
  id: string;
  prompt: string;
  promptBn?: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  explanationBn?: string;
  cefrLevel?: CefrLevelCode;
  skillTag?: QuizSkillTag;
}

export const CONVERSATION_QUIZ_COUNTS: Record<CefrLevelCode, number> = {
  A1: 10,
  A2: 14,
  B1: 18,
  B2: 22,
  C1: 26,
  C2: 30,
};

export const LEVEL_ASSESSMENT_QUESTION_COUNT = 40;

export type LevelBreakdown = Record<
  CefrLevelCode,
  {
    correct: number;
    total: number;
  }
>;

export interface QuizSessionResult {
  sessionId: string;
  kind: QuizKind;
  title: string;
  titleBn?: string;
  scenarioSlug?: string;
  level?: CefrLevelCode;
  lengthTierId?: string;
  lengthTierLabel?: string;
  style?: ConversationStyle;
  questions: QuizQuestion[];
  /** Question ID -> selected option index (0..3). Locked once answered. */
  answers: Record<string, number>;
  score: number;
  total: number;
  percentage: number;
  estimatedLevel?: CefrLevelCode;
  levelBreakdown?: LevelBreakdown;
  completedAt: string;
  source: "ai" | "hybrid" | "fallback";
}

export function getQuestionCountForLevel(level: CefrLevelCode): number {
  return CONVERSATION_QUIZ_COUNTS[level] ?? 10;
}

export function estimateCefrLevelFromBreakdown(
  breakdown: LevelBreakdown
): CefrLevelCode {
  const ordered: CefrLevelCode[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
  let highestMastered: CefrLevelCode = "A1";

  for (const lvl of ordered) {
    const stat = breakdown[lvl];
    if (!stat || stat.total === 0) continue;
    const accuracy = stat.correct / stat.total;
    if (accuracy >= 0.6) {
      highestMastered = lvl;
    } else {
      break;
    }
  }

  return highestMastered;
}

export function computeLevelBreakdown(
  questions: QuizQuestion[],
  answers: Record<string, number>
): LevelBreakdown {
  const breakdown: LevelBreakdown = {
    A1: { correct: 0, total: 0 },
    A2: { correct: 0, total: 0 },
    B1: { correct: 0, total: 0 },
    B2: { correct: 0, total: 0 },
    C1: { correct: 0, total: 0 },
    C2: { correct: 0, total: 0 },
  };

  for (const q of questions) {
    const lvl = q.cefrLevel ?? "A1";
    breakdown[lvl].total += 1;
    if (answers[q.id] === q.correctIndex) {
      breakdown[lvl].correct += 1;
    }
  }

  return breakdown;
}
