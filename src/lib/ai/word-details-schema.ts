import { z } from "zod";

export const WordDetailsRequestSchema = z.object({
  word: z.string().trim().min(1).max(80),
  partOfSpeech: z.string().trim().max(40).optional(),
  contextSentence: z.string().trim().max(400).optional(),
  existingMeaning: z.string().trim().max(400).optional(),
});

export type WordDetailsRequest = z.infer<typeof WordDetailsRequestSchema>;

export const WordSentenceExampleSchema = z.object({
  label: z.string(),
  en: z.string(),
  bn: z.string(),
});

export const WordDetailsSchema = z.object({
  word: z.string(),
  ipa: z.string(),
  partOfSpeech: z.string(),
  meaningEn: z.string(),
  meaningBn: z.string(),
  contextualMeaningBn: z.string(),
  synonyms: z.array(z.string()).max(6),
  antonyms: z.array(z.string()).max(4),
  tenseInfo: z
    .object({
      detectedTense: z.string().optional(),
      explanationBn: z.string().optional(),
    })
    .optional(),
  verbForms: z
    .object({
      base: z.string().optional(),
      thirdPerson: z.string().optional(),
      past: z.string().optional(),
      pastParticiple: z.string().optional(),
      presentParticiple: z.string().optional(),
    })
    .optional(),
  nounAndAdjForms: z
    .object({
      plural: z.string().optional(),
      comparative: z.string().optional(),
      superlative: z.string().optional(),
    })
    .optional(),
  posFamily: z
    .object({
      noun: z.string().optional(),
      verb: z.string().optional(),
      adjective: z.string().optional(),
      adverb: z.string().optional(),
    })
    .optional(),
  sentences: z.array(WordSentenceExampleSchema).min(1).max(4),
});

export type WordDetails = z.infer<typeof WordDetailsSchema>;
