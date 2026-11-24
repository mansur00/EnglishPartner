/**
 * 24-Tier Scalable CEFR Length & Complexity Registry
 * 6 CEFR Levels (A1 - C2) x 4 Length Tiers each = 24 Tiers
 * Turn progression: 6-9 turns (A1 Tier 1) -> 56-60 turns (C2 Tier 4)
 * Sentence progression: Ultra-short Simple -> Compound -> Complex -> Compound-Complex
 */

export const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevelCode = (typeof CEFR_LEVELS)[number];

export const CONVERSATION_STYLES = ["casual", "neutral", "formal"] as const;
export type ConversationStyle = (typeof CONVERSATION_STYLES)[number];

export type SentenceComplexity =
  | "basic_simple"
  | "elementary_compound"
  | "intermediate_compound"
  | "upper_complex"
  | "advanced_complex"
  | "mastery_compound_complex";

export interface LengthTier {
  id: string;
  cefrLevel: CefrLevelCode;
  tierIndex: 1 | 2 | 3 | 4;
  minTurns: number;
  maxTurns: number;
  targetTurns: number;
  labelEn: string;
  labelBn: string;
  complexity: SentenceComplexity;
}

export const LENGTH_TIERS: LengthTier[] = [
  // A1: Beginner (Ultra-short Simple Sentences, starting from "Hello...")
  { id: "a1-1", cefrLevel: "A1", tierIndex: 1, minTurns: 6, maxTurns: 9, targetTurns: 7, labelEn: "6-9 turns", labelBn: "৬-৯ টার্ন", complexity: "basic_simple" },
  { id: "a1-2", cefrLevel: "A1", tierIndex: 2, minTurns: 9, maxTurns: 11, targetTurns: 10, labelEn: "9-11 turns", labelBn: "৯-১১ টার্ন", complexity: "basic_simple" },
  { id: "a1-3", cefrLevel: "A1", tierIndex: 3, minTurns: 11, maxTurns: 13, targetTurns: 12, labelEn: "11-13 turns", labelBn: "১১-১৩ টার্ন", complexity: "basic_simple" },
  { id: "a1-4", cefrLevel: "A1", tierIndex: 4, minTurns: 14, maxTurns: 16, targetTurns: 15, labelEn: "14-16 turns", labelBn: "১৪-১৬ টার্ন", complexity: "basic_simple" },

  // A2: Elementary (Everyday Simple & Basic Compound)
  { id: "a2-1", cefrLevel: "A2", tierIndex: 1, minTurns: 16, maxTurns: 18, targetTurns: 17, labelEn: "16-18 turns", labelBn: "১৬-১৮ টার্ন", complexity: "elementary_compound" },
  { id: "a2-2", cefrLevel: "A2", tierIndex: 2, minTurns: 18, maxTurns: 20, targetTurns: 19, labelEn: "18-20 turns", labelBn: "১৮-২০ টার্ন", complexity: "elementary_compound" },
  { id: "a2-3", cefrLevel: "A2", tierIndex: 3, minTurns: 21, maxTurns: 23, targetTurns: 22, labelEn: "21-23 turns", labelBn: "২১-২৩ টার্ন", complexity: "elementary_compound" },
  { id: "a2-4", cefrLevel: "A2", tierIndex: 4, minTurns: 23, maxTurns: 25, targetTurns: 24, labelEn: "23-25 turns", labelBn: "২৩-২৫ টার্ন", complexity: "elementary_compound" },

  // B1: Intermediate (Connected Compound Sentences)
  { id: "b1-1", cefrLevel: "B1", tierIndex: 1, minTurns: 25, maxTurns: 27, targetTurns: 26, labelEn: "25-27 turns", labelBn: "২৫-২৭ টার্ন", complexity: "intermediate_compound" },
  { id: "b1-2", cefrLevel: "B1", tierIndex: 2, minTurns: 28, maxTurns: 30, targetTurns: 29, labelEn: "28-30 turns", labelBn: "২৮-৩০ টার্ন", complexity: "intermediate_compound" },
  { id: "b1-3", cefrLevel: "B1", tierIndex: 3, minTurns: 30, maxTurns: 32, targetTurns: 31, labelEn: "30-32 turns", labelBn: "৩০-৩২ টার্ন", complexity: "intermediate_compound" },
  { id: "b1-4", cefrLevel: "B1", tierIndex: 4, minTurns: 33, maxTurns: 35, targetTurns: 34, labelEn: "33-35 turns", labelBn: "৩৩-৩৫ টার্ন", complexity: "intermediate_compound" },

  // B2: Upper Intermediate (Complex Sentences & Conditionals)
  { id: "b2-1", cefrLevel: "B2", tierIndex: 1, minTurns: 35, maxTurns: 37, targetTurns: 36, labelEn: "35-37 turns", labelBn: "৩৫-৩৭ টার্ন", complexity: "upper_complex" },
  { id: "b2-2", cefrLevel: "B2", tierIndex: 2, minTurns: 38, maxTurns: 40, targetTurns: 39, labelEn: "38-40 turns", labelBn: "৩৮-৪০ টার্ন", complexity: "upper_complex" },
  { id: "b2-3", cefrLevel: "B2", tierIndex: 3, minTurns: 40, maxTurns: 42, targetTurns: 41, labelEn: "40-42 turns", labelBn: "৪০-৪২ টার্ন", complexity: "upper_complex" },
  { id: "b2-4", cefrLevel: "B2", tierIndex: 4, minTurns: 43, maxTurns: 45, targetTurns: 44, labelEn: "43-45 turns", labelBn: "৪৩-৪৫ টার্ন", complexity: "upper_complex" },

  // C1: Advanced (Idiomatic & Multi-clause Complex)
  { id: "c1-1", cefrLevel: "C1", tierIndex: 1, minTurns: 45, maxTurns: 47, targetTurns: 46, labelEn: "45-47 turns", labelBn: "৪৫-৪৭ টার্ন", complexity: "advanced_complex" },
  { id: "c1-2", cefrLevel: "C1", tierIndex: 2, minTurns: 48, maxTurns: 50, targetTurns: 49, labelEn: "48-50 turns", labelBn: "৪৮-৫০ টার্ন", complexity: "advanced_complex" },
  { id: "c1-3", cefrLevel: "C1", tierIndex: 3, minTurns: 50, maxTurns: 52, targetTurns: 51, labelEn: "50-52 turns", labelBn: "৫০-৫২ টার্ন", complexity: "advanced_complex" },
  { id: "c1-4", cefrLevel: "C1", tierIndex: 4, minTurns: 52, maxTurns: 54, targetTurns: 53, labelEn: "52-54 turns", labelBn: "৫২-৫৪ টার্ন", complexity: "advanced_complex" },

  // C2: Mastery (Full Compound-Complex Mastery)
  { id: "c2-1", cefrLevel: "C2", tierIndex: 1, minTurns: 54, maxTurns: 56, targetTurns: 55, labelEn: "54-56 turns", labelBn: "৫৪-৫৬ টার্ন", complexity: "mastery_compound_complex" },
  { id: "c2-2", cefrLevel: "C2", tierIndex: 2, minTurns: 55, maxTurns: 57, targetTurns: 56, labelEn: "55-57 turns", labelBn: "৫৫-৫৭ টার্ন", complexity: "mastery_compound_complex" },
  { id: "c2-3", cefrLevel: "C2", tierIndex: 3, minTurns: 56, maxTurns: 58, targetTurns: 57, labelEn: "56-58 turns", labelBn: "৫৬-৫৮ টার্ন", complexity: "mastery_compound_complex" },
  { id: "c2-4", cefrLevel: "C2", tierIndex: 4, minTurns: 56, maxTurns: 60, targetTurns: 58, labelEn: "56-60 turns", labelBn: "৫৬-৬০ টার্ন", complexity: "mastery_compound_complex" },
];

export function getLengthTiersForLevel(level: string): LengthTier[] {
  if (!level || level === "all") return LENGTH_TIERS;
  return LENGTH_TIERS.filter((t) => t.cefrLevel === level);
}

export function getLengthTierById(id: string): LengthTier | undefined {
  return LENGTH_TIERS.find((t) => t.id === id);
}

export function getDefaultLengthTierForLevel(level: string): LengthTier {
  const tiers = getLengthTiersForLevel(level);
  return tiers[0] || LENGTH_TIERS[0];
}
