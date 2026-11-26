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
  synonyms: z.array(z.string()).default([]),
  antonyms: z.array(z.string()).default([]),
  tenseInfo: z
    .object({
      detectedTense: z.string().nullish(),
      explanationBn: z.string().nullish(),
    })
    .nullish(),
  verbForms: z
    .object({
      base: z.string().nullish(),
      thirdPerson: z.string().nullish(),
      past: z.string().nullish(),
      pastParticiple: z.string().nullish(),
      presentParticiple: z.string().nullish(),
    })
    .nullish(),
  nounAndAdjForms: z
    .object({
      plural: z.string().nullish(),
      comparative: z.string().nullish(),
      superlative: z.string().nullish(),
    })
    .nullish(),
  posFamily: z
    .object({
      noun: z.string().nullish(),
      verb: z.string().nullish(),
      adjective: z.string().nullish(),
      adverb: z.string().nullish(),
    })
    .nullish(),
  sentences: z.array(WordSentenceExampleSchema).min(1),
});

export type WordDetails = z.infer<typeof WordDetailsSchema>;
