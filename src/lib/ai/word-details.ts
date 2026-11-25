import { callStructuredLlm, GLOBAL_AI_SAFETY_INSTRUCTION } from "./llm-client.ts";
import {
  WordDetails,
  WordDetailsRequest,
  WordDetailsSchema,
} from "./word-details-schema.ts";

const serverWordCache = new Map<string, WordDetails>();
const MAX_SERVER_CACHE = 400;

function makeCacheKey(req: WordDetailsRequest): string {
  return `${req.word.toLowerCase()}::${(req.partOfSpeech || "").toLowerCase()}::${(req.contextSentence || "").slice(0, 80).toLowerCase()}`;
}

function buildFallbackWordDetails(req: WordDetailsRequest): WordDetails {
  const cleanWord = req.word.trim();
  const lower = cleanWord.toLowerCase();
  const pos = (req.partOfSpeech || "word").toLowerCase();
  const isVerb = pos.includes("verb");
  const isNoun = pos.includes("noun");
  const isAdj = pos.includes("adj");

  const regularPast = lower.endsWith("e") ? `${cleanWord}d` : `${cleanWord}ed`;
  const regularIng = lower.endsWith("e") && !lower.endsWith("ee")
    ? `${cleanWord.slice(0, -1)}ing`
    : `${cleanWord}ing`;
  const thirdPerson = /(s|sh|ch|x|z|o)$/i.test(cleanWord) ? `${cleanWord}es` : `${cleanWord}s`;

  return {
    word: cleanWord,
    ipa: `/${lower}/`,
    partOfSpeech: req.partOfSpeech || "general",
    meaningEn: req.existingMeaning || `Common English ${pos} "${cleanWord}" used in everyday conversation.`,
    meaningBn: `"${cleanWord}" — প্রাসঙ্গিক ইংরেজি শব্দ।`,
    contextualMeaningBn: req.contextSentence
      ? `"${cleanWord}" শব্দটি এই বাক্যে প্রাসঙ্গিকভাবে ব্যবহৃত হয়েছে।`
      : `"${cleanWord}" — দৈনন্দিন কথোপকথনে ব্যবহৃত শব্দ।`,
    synonyms: [],
    antonyms: [],
    tenseInfo: isVerb
      ? {
          detectedTense: "Base / Present",
          explanationBn: "ক্রিয়ার রূপ বাক্যের Tense ও Subject অনুযায়ী পরিবর্তিত হয়।",
        }
      : undefined,
    verbForms: isVerb
      ? {
          base: cleanWord,
          thirdPerson,
          past: regularPast,
          pastParticiple: regularPast,
          presentParticiple: regularIng,
        }
      : undefined,
    nounAndAdjForms: isNoun
      ? { plural: thirdPerson }
      : isAdj
      ? { comparative: `more ${cleanWord}`, superlative: `most ${cleanWord}` }
      : undefined,
    posFamily: {
      ...(isNoun ? { noun: cleanWord } : {}),
      ...(isVerb ? { verb: cleanWord } : {}),
      ...(isAdj ? { adjective: cleanWord } : {}),
    },
    sentences: [
      {
        label: "Daily Use",
        en: req.contextSentence || `We often use "${cleanWord}" in daily English.`,
        bn: `"${cleanWord}" শব্দটি দৈনন্দিন ইংরেজি কথোপকথনে ব্যবহৃত হয়।`,
      },
    ],
  };
}

export async function resolveWordDetailsAsync(
  req: WordDetailsRequest
): Promise<WordDetails> {
  const cacheKey = makeCacheKey(req);
  const cached = serverWordCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const systemPrompt = `${GLOBAL_AI_SAFETY_INSTRUCTION}

You are an expert English-Bangla bilingual lexicographer and grammar teacher.
Given an English word (and optional part of speech, context sentence, or short meaning), return comprehensive learner-friendly word details in strict JSON matching the schema:
- ipa: accurate IPA pronunciation (e.g. "/niːd/")
- partOfSpeech: primary part(s) of speech (e.g. "verb / noun")
- meaningEn: clear, concise English definition
- meaningBn: natural, accurate Bangla meaning (in Bengali script)
- contextualMeaningBn: Bangla explanation of how this word means/functions in the given context (or general usage if no context)
- synonyms: 3 to 5 accurate English synonyms
- antonyms: 2 to 4 accurate English antonyms (empty array only if none exist, e.g. concrete drinks like "latte")
- tenseInfo: if the word is a verb or appears in a context sentence, identify the tense/usage ("detectedTense" in English, "explanationBn" in Bangla)
- verbForms: if the word is or can be used as a verb, provide base (V1), thirdPerson (s/es), past (V2), pastParticiple (V3), and presentParticiple (V-ing)
- nounAndAdjForms: if applicable, provide plural, comparative, and superlative forms
- posFamily: show the word's forms across Parts of Speech (noun, verb, adjective, adverb) whenever valid forms exist in English (omit forms that don't exist)
- sentences: 3 practical sentence-making examples showing different tenses or real-life contexts, each with "label" (e.g. "Present Simple", "Past Simple", "Question / Polite"), "en" (English sentence), and "bn" (natural Bangla translation).`;

  const userPrompt = JSON.stringify({
    word: req.word,
    partOfSpeech: req.partOfSpeech || null,
    contextSentence: req.contextSentence || null,
    existingMeaning: req.existingMeaning || null,
  });

  const result = await callStructuredLlm({
    systemPrompt,
    userPrompt,
    schema: WordDetailsSchema,
    taskName: "wordDetails",
    temperature: 0.25,
    maxTokens: 900,
    timeoutMs: 12000,
  });

  const resolved = result.success && result.data ? result.data : buildFallbackWordDetails(req);

  if (result.success && result.data) {
    if (serverWordCache.size >= MAX_SERVER_CACHE) {
      const firstKey = serverWordCache.keys().next().value;
      if (firstKey) serverWordCache.delete(firstKey);
    }
    serverWordCache.set(cacheKey, resolved);
  }

  return resolved;
}
