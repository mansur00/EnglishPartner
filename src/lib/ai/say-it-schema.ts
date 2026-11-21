/**
 * Schema S1: "What Should I Say?" Data Contract
 * Strictly adheres to ECP_AI_Prompt_Spec.md §3.4 and ECP_API_Contract.md §4.7.
 */

import { z } from "zod";

export const ToneEnum = z.enum(["polite_professional", "neutral", "casual"]);
export type ToneType = z.infer<typeof ToneEnum>;

export const SayItOptionSchema = z.object({
  tone: ToneEnum,
  english: z.string().min(1),
  translation: z.string().min(1),
  placeholders: z.array(z.string()).default([]),
});
export type SayItOption = z.infer<typeof SayItOptionSchema>;

export const UsefulPhraseSchema = z.object({
  phrase: z.string().min(1),
  meaning: z.string().min(1),
});
export type UsefulPhrase = z.infer<typeof UsefulPhraseSchema>;

export const SayItResponseSchema = z.object({
  understood_intent: z.string().min(1),
  options: z.array(SayItOptionSchema).min(0),
  useful_phrases: z.array(UsefulPhraseSchema).max(5).default([]),
  clarifying_question: z.string().nullable().default(null),
});
export type SayItResponse = z.infer<typeof SayItResponseSchema>;

export const SayItRequestSchema = z.object({
  intent: z.string().min(1).max(500),
  input_lang: z.string().optional().default("auto"),
  output_lang: z.string().optional().default("bn"),
});
export type SayItRequest = z.input<typeof SayItRequestSchema>;
export type SayItRequestOutput = z.infer<typeof SayItRequestSchema>;
