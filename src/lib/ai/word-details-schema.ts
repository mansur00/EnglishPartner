import { z } from "zod";

export const WordDetailsRequestSchema = z.object({
  word: z.string().trim().min(1).max(80),
  partOfSpeech: z.string().trim().max(40).optional(),
  contextSentence: z.string().trim().max(400).optional(),
  existingMeaning: z.string().trim().max(400).optional(),
});

export type WordDetailsRequest = z.infer<typeof WordDetailsRequestSchema>;

export const TranslatedWordItemSchema = z.union([
  z.object({
    word: z.string(),
    meaningBn: z.string(),
  }),
  z.string().transform((s) => ({ word: s, meaningBn: "" })),
]);

export type TranslatedWordItem = z.infer<typeof TranslatedWordItemSchema>;

export const WordSentenceExampleSchema = z.object({
  label: z.string(),
  en: z.string(),
  bn: z.string(),
});

export const WordDetailsSchema = z.object({
  word: z.string(),
  ipa: z.string(),
  partOfSpeech: z.string(),
  wordMeaningBn: z.string().nullish(),
  meaningEn: z.string(),
  meaningBn: z.string(),
  contextualMeaningBn: z.string(),
  synonyms: z.array(TranslatedWordItemSchema).default([]),
  antonyms: z.array(TranslatedWordItemSchema).default([]),
  relatedWords: z.array(TranslatedWordItemSchema).default([]),
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
  isFallback: z.boolean().optional(),
});

export type WordDetails = z.infer<typeof WordDetailsSchema>;
