import { GRAMMAR_STAGES, type GrammarDetailedLesson, type GrammarStage } from "./learning-path";
import { STAGE_1_LESSONS } from "./lessons/stage-1";
import { STAGE_2_TO_4_LESSONS } from "./lessons/stages-2-to-4";
import { STAGE_5_TO_8_LESSONS } from "./lessons/stages-5-to-8";

export const GRAMMAR_LESSONS: GrammarDetailedLesson[] = [
  ...STAGE_1_LESSONS,
  ...STAGE_2_TO_4_LESSONS,
  ...STAGE_5_TO_8_LESSONS,
];

export function getLessonsByStage(stageNumber: number): GrammarDetailedLesson[] {
  return GRAMMAR_LESSONS.filter((lesson) => lesson.stageNumber === stageNumber);
}

export function getStageBySlug(slug: string): GrammarStage | undefined {
  return GRAMMAR_STAGES.find((stage) => stage.slug === slug);
}
