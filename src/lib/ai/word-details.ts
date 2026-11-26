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
    wordMeaningBn: `"${cleanWord}" — প্রাসঙ্গিক ইংরেজি শব্দ।`,
    meaningEn: req.existingMeaning || `Common English ${pos} "${cleanWord}" used in everyday conversation.`,
    meaningBn: `"${cleanWord}" — প্রাসঙ্গিক ইংরেজি শব্দ।`,
    contextualMeaningBn: req.contextSentence
      ? `"${cleanWord}" শব্দটি এই বাক্যে প্রাসঙ্গিকভাবে ব্যবহৃত হয়েছে।`
      : `"${cleanWord}" — দৈনন্দিন কথোপকথনে ব্যবহৃত শব্দ।`,
    synonyms: [],
    antonyms: [],
    relatedWords: [],
    isFallback: true,
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
Given an English word (and optional part of speech, context sentence, or short meaning), return comprehensive learner-friendly word details in STRICT JSON matching this exact shape:
{
  "word": "need",
  "ipa": "/niːd/",
  "partOfSpeech": "verb / noun",
  "wordMeaningBn": "প্রয়োজন / দরকার / অভাব",
  "meaningEn": "require something because it is essential or very important",
  "meaningBn": "কোনো কিছু প্রয়োজন হওয়া বা দরকার হওয়া",
  "contextualMeaningBn": "এখানে 'need' ক্রিয়া হিসেবে 'কোনো কিছু দরকার হওয়া' অর্থে ব্যবহৃত হয়েছে।",
  "synonyms": [
    { "word": "require", "meaningBn": "প্রয়োজন হওয়া" },
    { "word": "want", "meaningBn": "চাওয়া" },
    { "word": "necessitate", "meaningBn": "আবশ্যক করা" }
  ],
  "antonyms": [
    { "word": "have", "meaningBn": "থাকা" },
    { "word": "possess", "meaningBn": "অধিকারী হওয়া" }
  ],
  "relatedWords": [
    { "word": "necessity", "meaningBn": "প্রয়োজনীয়তা" },
    { "word": "essential", "meaningBn": "অপরিহার্য" },
    { "word": "urgent", "meaningBn": "জরুরি" }
  ],
  "tenseInfo": {
    "detectedTense": "Present Simple",
    "explanationBn": "এটি Present Simple tense-এ মূল ক্রিয়া হিসেবে ব্যবহৃত হয়েছে।"
  },
  "verbForms": {
    "base": "need",
    "thirdPerson": "needs",
    "past": "needed",
    "pastParticiple": "needed",
    "presentParticiple": "needing"
  },
  "nounAndAdjForms": {
    "plural": "needs",
    "comparative": null,
    "superlative": null
  },
  "posFamily": {
    "noun": "need / necessity",
    "verb": "need",
    "adjective": "needy / needless",
    "adverb": "needlessly"
  },
  "sentences": [
    { "label": "Present Simple", "en": "I need some water.", "bn": "আমার কিছু পানি দরকার।" },
    { "label": "Past Simple", "en": "She needed help yesterday.", "bn": "গতকাল তার সাহায্য দরকার ছিল।" },
    { "label": "Question", "en": "Do you need anything else?", "bn": "আপনার কি আর কিছু প্রয়োজন?" }
  ]
}
Keep every field accurate for the given word. Use null for non-applicable sub-fields (for example, verbForms can be null if the word is strictly a concrete noun like "latte"). Always provide 3 practical sentences.`;

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
    maxTokens: 1400,
    timeoutMs: 14000,
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
