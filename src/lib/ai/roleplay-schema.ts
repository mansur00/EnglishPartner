/**
 * Roleplay Engine Schemas: Schema R1 (Turn) & Schema F1 (Feedback)
 * Strictly conforms to ECP_AI_Prompt_Spec.md §3.5 and §3.6.
 */

import { z } from "zod";

export const RoleplayTurnStatusEnum = z.enum([
  "continue",
  "learner_finished",
  "off_scenario",
  "unsafe",
]);
export type RoleplayTurnStatus = z.infer<typeof RoleplayTurnStatusEnum>;

export const RoleplayCorrectionSchema = z.object({
  original: z.string().min(1),
  improved: z.string().min(1),
  reason: z.string().min(1).max(200),
});
export type RoleplayCorrection = z.infer<typeof RoleplayCorrectionSchema>;

export const RoleplayTurnResponseSchema = z.object({
  ai_reply: z.string().min(1),
  hint: z.string().nullable().default(null),
  correction: RoleplayCorrectionSchema.nullable().default(null),
  turn_status: RoleplayTurnStatusEnum.default("continue"),
});
export type RoleplayTurnResponse = z.infer<typeof RoleplayTurnResponseSchema>;

export const TranscriptTurnSchema = z.object({
  speaker: z.enum(["ai", "learner"]),
  text: z.string().min(1),
});
export type TranscriptTurn = z.infer<typeof TranscriptTurnSchema>;

export const RoleplayTurnRequestSchema = z.object({
  scenario_id: z.string().min(1),
  scenario_title: z.string().min(1),
  scenario_context: z.string().min(1),
  learning_objective: z.string().optional().default("Natural spoken conversation practice"),
  ai_role: z.string().min(1),
  learner_role: z.string().min(1),
  level: z.string().optional().default("A1"),
  style: z.string().optional().default("casual"),
  transcript: z.array(TranscriptTurnSchema).default([]),
  learner_message: z.string().min(1).max(500),
  explanation_language: z.string().optional().default("bn"),
});
export type RoleplayTurnRequest = z.infer<typeof RoleplayTurnRequestSchema>;
export type RoleplayTurnRequestInput = z.input<typeof RoleplayTurnRequestSchema>;

export const FocusAreaEnum = z.enum([
  "grammar",
  "vocabulary",
  "sentence_formation",
  "naturalness",
  "relevance",
]);
export type FocusAreaType = z.infer<typeof FocusAreaEnum>;

export const FocusAreaSchema = z.object({
  area: FocusAreaEnum,
  example_from_learner: z.string().min(1),
  suggestion: z.string().min(1),
  natural_alternative: z.string().min(1),
});
export type FocusArea = z.infer<typeof FocusAreaSchema>;

export const RoleplayFeedbackResponseSchema = z.object({
  summary: z.string().min(1),
  strengths: z.array(z.string()).max(3).default([]),
  focus_areas: z.array(FocusAreaSchema).max(3).default([]),
  next_step: z.string().min(1),
  limitations: z.string().min(1),
});
export type RoleplayFeedbackResponse = z.infer<typeof RoleplayFeedbackResponseSchema>;

export const RoleplayFeedbackRequestSchema = z.object({
  scenario_title: z.string().min(1),
  level: z.string().optional().default("A1"),
  learner_language: z.string().optional().default("bn"),
  transcript: z.array(TranscriptTurnSchema).min(1),
});
export type RoleplayFeedbackRequest = z.infer<typeof RoleplayFeedbackRequestSchema>;
export type RoleplayFeedbackRequestInput = z.input<typeof RoleplayFeedbackRequestSchema>;
