/**
 * Pronunciation Hints & Acoustic Word-Level Feedback Engine
 * Complies with ECP_Phase_Plan.md §6.1 (Milestone 3C),
 * ECP_Audio_Voice_Guide.md §10.2, and Brief §9.3 & §20.
 *
 * Invariant: Never computes or presents arbitrary decimal/percentage scores.
 * Uses qualitative relative tiers (clear | getting_there | needs_practice),
 * word-level token alignment, and Bengali phonetic advice for tricky ESL sounds.
 */

export type WordPronunciationStatus = "clear" | "unclear" | "missed";

export interface WordPhoneticGuide {
  word: string;
  phoneticHint: string;
  ipa?: string;
  bengaliTip: string;
  category:
    | "silent_letter"
    | "consonant_cluster"
    | "vowel_reduction"
    | "th_sound"
    | "v_w_sound"
    | "general";
}

export interface PronunciationWordToken {
  original: string;
  clean: string;
  status: WordPronunciationStatus;
  isPunctuation?: boolean;
  phoneticGuide?: WordPhoneticGuide;
}

export type PronunciationTier = "clear" | "getting_there" | "needs_practice";

export interface PronunciationAssessment {
  tokens: PronunciationWordToken[];
  tier: PronunciationTier;
  tierLabelBn: string;
  tierLabelEn: string;
  totalWords: number;
  clearWordsCount: number;
  unclearWordsCount: number;
  missedWordsCount: number;
  extraWords: string[];
  feedbackBn: string;
  actionableTipsBn: string[];
  disclaimerBn: string;
}

export const AUTOMATED_AUDIO_DISCLAIMER_BN =
  "এটি ব্রাউজারের স্বয়ংক্রিয় অডিও বিশ্লেষণ। ডিভাইস ও পারিপার্শ্বিক শব্দের ওপর ভিত্তি করে ফলাফল পরিবর্তিত হতে পারে। তাই কৃত্রিম কোনো সংখ্যা বা শতাংশ নম্বরের পরিবর্তে শব্দভিত্তিক গঠনমূলক নির্দেশনা দেওয়া হয়েছে।";

/**
 * Curated phonetic guide dictionary for common tricky words for Bengali speakers.
 * Focuses on silent letters, epenthesis ('ischool' trap), 'th' fricatives, 'v' vs 'w',
 * and syllable reduction.
 */
export const PRONUNCIATION_HINTS_DICTIONARY: Record<string, WordPhoneticGuide> = {
  // Silent letters
  receipt: {
    word: "receipt",
    phoneticHint: "ri-SEET",
    ipa: "/rɪˈsiːt/",
    bengaliTip: "'p' অক্ষরটি পুরোপুরি অনুচ্চারিত (silent)। সরাসরি 'রিসিট' বলুন।",
    category: "silent_letter",
  },
  island: {
    word: "island",
    phoneticHint: "EYE-luhnd",
    ipa: "/ˈaɪlənd/",
    bengaliTip: "'s' অক্ষরটি অনুচ্চারিত। 'আইল্যান্ড' বলুন, 'ইস-ল্যান্ড' নয়।",
    category: "silent_letter",
  },
  debt: {
    word: "debt",
    phoneticHint: "DET",
    ipa: "/dɛt/",
    bengaliTip: "'b' অক্ষরটি অনুচ্চারিত। 'ডেট' বলুন।",
    category: "silent_letter",
  },
  doubt: {
    word: "doubt",
    phoneticHint: "DOWT",
    ipa: "/daʊt/",
    bengaliTip: "'b' অক্ষরটি অনুচ্চারিত। 'ডাউট' বলুন।",
    category: "silent_letter",
  },
  half: {
    word: "half",
    phoneticHint: "HAF",
    ipa: "/hæf/",
    bengaliTip: "'l' অক্ষরটি অনুচ্চারিত। 'হাফ' বলুন, 'হালফ' নয়।",
    category: "silent_letter",
  },
  talk: {
    word: "talk",
    phoneticHint: "TAWK",
    ipa: "/tɔːk/",
    bengaliTip: "'l' অক্ষরটি অনুচ্চারিত। 'টক' বলুন।",
    category: "silent_letter",
  },
  walk: {
    word: "walk",
    phoneticHint: "WAWK",
    ipa: "/wɔːk/",
    bengaliTip: "'l' অক্ষরটি অনুচ্চারিত। 'ওয়াক' বলুন।",
    category: "silent_letter",
  },
  would: {
    word: "would",
    phoneticHint: "WOOD",
    ipa: "/wʊd/",
    bengaliTip: "'l' অনুচ্চারিত। ঠোঁট গোল করে নরম সুরে 'উড' বলুন।",
    category: "silent_letter",
  },
  could: {
    word: "could",
    phoneticHint: "KOOD",
    ipa: "/kʊd/",
    bengaliTip: "'l' অনুচ্চারিত। 'কুড' বলুন।",
    category: "silent_letter",
  },
  should: {
    word: "should",
    phoneticHint: "SHOOD",
    ipa: "/ʃʊd/",
    bengaliTip: "'l' অনুচ্চারিত। 'শুড' বলুন।",
    category: "silent_letter",
  },
  listen: {
    word: "listen",
    phoneticHint: "LIS-uhn",
    ipa: "/ˈlɪsən/",
    bengaliTip: "'t' অক্ষরটি অনুচ্চারিত। 'লিসেন' বলুন, 'লিস্টেন' নয়।",
    category: "silent_letter",
  },
  castle: {
    word: "castle",
    phoneticHint: "KAS-uhl",
    ipa: "/ˈkæsəl/",
    bengaliTip: "'t' অনুচ্চারিত। 'ক্যাসেল' বলুন।",
    category: "silent_letter",
  },
  knife: {
    word: "knife",
    phoneticHint: "NYFE",
    ipa: "/naɪf/",
    bengaliTip: "'k' অনুচ্চারিত। 'নাইফ' বলুন।",
    category: "silent_letter",
  },
  know: {
    word: "know",
    phoneticHint: "NOH",
    ipa: "/noʊ/",
    bengaliTip: "'k' অনুচ্চারিত। 'নো' বলুন।",
    category: "silent_letter",
  },
  knowledge: {
    word: "knowledge",
    phoneticHint: "NOL-ij",
    ipa: "/ˈnɒlɪdʒ/",
    bengaliTip: "'k' ও 'd' সংকুচিত। 'নলেজ' বলুন।",
    category: "silent_letter",
  },
  write: {
    word: "write",
    phoneticHint: "RYTE",
    ipa: "/raɪt/",
    bengaliTip: "'w' অনুচ্চারিত। 'রাইট' বলুন।",
    category: "silent_letter",
  },
  wrong: {
    word: "wrong",
    phoneticHint: "RAWNG",
    ipa: "/rɔːŋ/",
    bengaliTip: "'w' অনুচ্চারিত। 'রং' বলুন।",
    category: "silent_letter",
  },

  // Syllable reduction
  comfortable: {
    word: "comfortable",
    phoneticHint: "KOMF-tuh-bl",
    ipa: "/ˈkʌmftəbəl/",
    bengaliTip: "চারটি নয়, তিনটি সিলেবলে বলুন: 'কম্ফ-টা-ব্-ল'। 'টেবল' উচ্চারণ করবেন না।",
    category: "vowel_reduction",
  },
  vegetable: {
    word: "vegetable",
    phoneticHint: "VEJ-tuh-bl",
    ipa: "/ˈvɛdʒtəbəl/",
    bengaliTip: "মাঝের 'e' বাদ দিয়ে তিন সিলেবলে 'ভেজ-টা-ব্-ল' বলুন।",
    category: "vowel_reduction",
  },
  restaurant: {
    word: "restaurant",
    phoneticHint: "RES-tuh-rahnt",
    ipa: "/ˈrɛstərənt/",
    bengaliTip: "'রেস্ট-রন্ট' বা 'রেস্ট-রান্ট' বলুন।",
    category: "vowel_reduction",
  },
  schedule: {
    word: "schedule",
    phoneticHint: "SKED-yool",
    ipa: "/ˈskɛdʒuːl/",
    bengaliTip: "আমেরিকান উচ্চারণে 'স্কেডিউল' এবং ব্রিটিশ উচ্চারণে 'শেডিউল' বলা হয়।",
    category: "vowel_reduction",
  },
  chocolate: {
    word: "chocolate",
    phoneticHint: "CHOK-lit",
    ipa: "/ˈtʃɒklɪt/",
    bengaliTip: "'চকলেট' নয়, দুই সিলেবলে 'চক-লিট' বলুন।",
    category: "vowel_reduction",
  },

  // 'th' fricative sounds
  three: {
    word: "three",
    phoneticHint: "THREE",
    ipa: "/θriː/",
    bengaliTip: "জিহ্বার ডগা ওপরের দাঁতের নিচে আলতো স্পর্শ করিয়ে নরম 'থ্রি' বলুন; 'ট্রি' (tree) যেন না শোনায়।",
    category: "th_sound",
  },
  think: {
    word: "think",
    phoneticHint: "THINGK",
    ipa: "/θɪŋk/",
    bengaliTip: "জিহ্বার ডগা দাঁতের ফাঁকে রেখে নরম 'থিংক' বলুন।",
    category: "th_sound",
  },
  thank: {
    word: "thank",
    phoneticHint: "THANGK",
    ipa: "/θæŋk/",
    bengaliTip: "জিহ্বার ডগা দাঁতের অগ্রভাগে রেখে 'থ্যাংক' বলুন।",
    category: "th_sound",
  },
  the: {
    word: "the",
    phoneticHint: "thuh / thee",
    ipa: "/ðə/",
    bengaliTip: "জিহ্বার ডগা ওপরের দাঁতের পেছনে রেখে নরম 'দ' ধ্বনি দিন।",
    category: "th_sound",
  },
  this: {
    word: "this",
    phoneticHint: "THIS",
    ipa: "/ðɪs/",
    bengaliTip: "জিহ্বার ডগা ওপরের দাঁতে স্পর্শ করে নরম 'দিস' বলুন।",
    category: "th_sound",
  },
  that: {
    word: "that",
    phoneticHint: "THAT",
    ipa: "/ðæt/",
    bengaliTip: "জিহ্বার ডগা দাঁতে স্পর্শ করিয়ে 'দ্যাট' বলুন।",
    category: "th_sound",
  },
  these: {
    word: "these",
    phoneticHint: "THEEZ",
    ipa: "/ðiːz/",
    bengaliTip: "দীর্ঘ ঈ-কার ও শেষের ধ্বনি নরম 'য': 'দীয' বলা হয়।",
    category: "th_sound",
  },
  those: {
    word: "those",
    phoneticHint: "THOHZ",
    ipa: "/ðoʊz/",
    bengaliTip: "ও-কার ও শেষের ধ্বনি নরম 'য': 'দৌজ' বলা হয়।",
    category: "th_sound",
  },
  there: {
    word: "there",
    phoneticHint: "THAIR",
    ipa: "/ðɛər/",
    bengaliTip: "জিহ্বার ডগা দাঁতে রেখে নরম 'দেয়ার' বলুন।",
    category: "th_sound",
  },

  // 'v' vs 'w' sounds
  very: {
    word: "very",
    phoneticHint: "VE-ree",
    ipa: "/ˈvɛri/",
    bengaliTip: "ওপরের দাঁত দিয়ে নিচের ঠোঁট আলতো ছুঁয়ে 'ভেরি' বলুন, 'বেরি' (berry) যেন না শোনায়।",
    category: "v_w_sound",
  },
  water: {
    word: "water",
    phoneticHint: "WAH-ter",
    ipa: "/ˈwɔːtər/",
    bengaliTip: "ঠোঁট দুটি গোল করে 'উয়া-টার' ধ্বনি দিয়ে শুরু করুন।",
    category: "v_w_sound",
  },
  welcome: {
    word: "welcome",
    phoneticHint: "WEL-kuhm",
    ipa: "/ˈwɛlkəm/",
    bengaliTip: "ঠোঁট গোল করে 'ওয়েল-কাম' বলুন।",
    category: "v_w_sound",
  },

  // Consonant clusters (Bengali 'ischool' epenthesis trap)
  school: {
    word: "school",
    phoneticHint: "SKOOL",
    ipa: "/skuːl/",
    bengaliTip: "শুরুতে অতিরিক্ত 'ই' (ischool) না জুড়ে সরাসরি 'স্' দিয়ে 'স্কুল' বলুন।",
    category: "consonant_cluster",
  },
  special: {
    word: "special",
    phoneticHint: "SPESH-uhl",
    ipa: "/ˈspɛʃəl/",
    bengaliTip: "শুরুতে 'ই' না জুড়ে সরাসরি 'স্পেশাল' বলুন।",
    category: "consonant_cluster",
  },
  station: {
    word: "station",
    phoneticHint: "STAY-shuhn",
    ipa: "/ˈsteɪʃən/",
    bengaliTip: "সরাসরি 'স্টে-শান' বলুন, 'ইস্টেশন' নয়।",
    category: "consonant_cluster",
  },
  speak: {
    word: "speak",
    phoneticHint: "SPEEK",
    ipa: "/spiːk/",
    bengaliTip: "সরাসরি 'স্পীক' বলুন, 'ইসপিক' নয়।",
    category: "consonant_cluster",
  },
  start: {
    word: "start",
    phoneticHint: "START",
    ipa: "/stɑːrt/",
    bengaliTip: "সরাসরি 'স্টার্ট' বলুন, 'ইস্টারট' নয়।",
    category: "consonant_cluster",
  },

  // Daily dialogue & shopping vocabulary
  help: {
    word: "help",
    phoneticHint: "HELP",
    ipa: "/hɛlp/",
    bengaliTip: "শেষের 'lp' ক্লাস্টারটি স্পষ্ট করুন এবং বিনম্র সুরে বলুন।",
    category: "general",
  },
  card: {
    word: "card",
    phoneticHint: "KARD",
    ipa: "/kɑːrd/",
    bengaliTip: "শেষের 'd' স্পষ্ট কিন্তু অতিরিক্ত ভারী না করে 'কার্ড' বলুন।",
    category: "general",
  },
  cash: {
    word: "cash",
    phoneticHint: "KASH",
    ipa: "/kæʃ/",
    bengaliTip: "তালব্য 'শ' বজায় রেখে 'ক্যাশ' বলুন।",
    category: "general",
  },
  change: {
    word: "change",
    phoneticHint: "CHAYNJ",
    ipa: "/tʃeɪndʒ/",
    bengaliTip: "শেষের 'ঞ্জ' ধ্বনিটি স্পষ্ট রাখুন: 'চেঞ্জ' বলা হয়।",
    category: "general",
  },
  discount: {
    word: "discount",
    phoneticHint: "DIS-kownt",
    ipa: "/ˈdɪskaʊnt/",
    bengaliTip: "প্রথম সিলেবল 'ডিস'-এ হালকা জোর দিন: 'ডিস-কাউন্ট' বলা হয়।",
    category: "general",
  },
  price: {
    word: "price",
    phoneticHint: "PRYSS",
    ipa: "/praɪs/",
    bengaliTip: "শেষের 'স' স্পষ্ট রাখুন: 'প্রাইস' বলা হয়।",
    category: "general",
  },
  please: {
    word: "please",
    phoneticHint: "PLEEZ",
    ipa: "/pliːz/",
    bengaliTip: "শেষের ধ্বনিটি নরম 'য': 'প্লিজ' বলা হয়।",
    category: "general",
  },
  excuse: {
    word: "excuse",
    phoneticHint: "ik-SKYOOZ",
    ipa: "/ɪkˈskjuːz/",
    bengaliTip: "'ইক-স্কিউজ' - বিনম্র সুরে বলুন।",
    category: "general",
  },
  blue: {
    word: "blue",
    phoneticHint: "BLOO",
    ipa: "/bluː/",
    bengaliTip: "প্রশ্ন করার সময় শেষের 'blue' শব্দে কণ্ঠস্বর সামান্য ওপরের দিকে ওঠান।",
    category: "general",
  },
  bag: {
    word: "bag",
    phoneticHint: "BAG",
    ipa: "/bæɡ/",
    bengaliTip: "স্বরধ্বনিটি কিছুটা বিস্তৃত করে 'ব্যাগ' বলুন।",
    category: "general",
  },
  thousand: {
    word: "thousand",
    phoneticHint: "THOW-zuhnd",
    ipa: "/ˈθaʊzənd/",
    bengaliTip: "'থ' দিয়ে শুরু করে মাঝে নরম 'য' ধ্বনি: 'থাউজেন্ড' বলুন।",
    category: "th_sound",
  },
  hundred: {
    word: "hundred",
    phoneticHint: "HUN-drid",
    ipa: "/ˈhʌndrɪd/",
    bengaliTip: "দুই সিলেবলে 'হান-ড্রিড' বা 'হান-ড্রেড' বলুন।",
    category: "general",
  },
};

const CONTRACTION_EXPANSIONS: Record<string, string> = {
  "i'm": "i am",
  "it's": "it is",
  "that's": "that is",
  "don't": "do not",
  "can't": "cannot",
  "won't": "will not",
  "i'll": "i will",
  "you're": "you are",
  "we're": "we are",
  "they're": "they are",
  "he's": "he is",
  "she's": "she is",
  "let's": "let us",
};

/**
 * Normalizes speech text by expanding common contractions and stripping punctuation.
 */
export function normalizeSpokenText(text: string): string {
  if (!text) return "";

  let cleaned = text.trim().toLowerCase();

  for (const [contraction, expanded] of Object.entries(CONTRACTION_EXPANSIONS)) {
    cleaned = cleaned.replace(new RegExp(`\\b${contraction}\\b`, "g"), expanded);
  }

  cleaned = cleaned.replace(/[^a-z0-9\s]/g, " ");
  return cleaned.replace(/\s+/g, " ").trim();
}

/**
 * Returns phonetic guidance for a word, querying the dictionary first
 * or inferring heuristic rules for common English phonemes.
 */
export function lookupWordPhoneticGuide(rawWord: string): WordPhoneticGuide | undefined {
  const clean = rawWord.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!clean) return undefined;

  // Direct dictionary hit
  if (PRONUNCIATION_HINTS_DICTIONARY[clean]) {
    return PRONUNCIATION_HINTS_DICTIONARY[clean];
  }

  // Heuristic fallbacks for phonological patterns
  if (clean.startsWith("th") || clean.endsWith("th")) {
    return {
      word: clean,
      phoneticHint: clean.toUpperCase(),
      bengaliTip: "জিহ্বার ডগা ওপরের দাঁতের নিচে আলতো স্পর্শ করিয়ে নরম 'থ' বা 'দ' ধ্বনি দিন।",
      category: "th_sound",
    };
  }

  if (
    clean.length > 3 &&
    clean.startsWith("s") &&
    ["p", "t", "k", "c", "m", "n", "l"].includes(clean[1])
  ) {
    return {
      word: clean,
      phoneticHint: clean.toUpperCase(),
      bengaliTip: "শুরুতে অতিরিক্ত 'ই' (ischool ট্র্যাপ) না জুড়ে সরাসরি 'স্' দিয়ে শুরু করুন।",
      category: "consonant_cluster",
    };
  }

  if (clean.startsWith("v")) {
    return {
      word: clean,
      phoneticHint: clean.toUpperCase(),
      bengaliTip: "ওপরের দাঁত দিয়ে নিচের ঠোঁট আলতো ছুঁয়ে 'ভ' ধ্বনি দিন ('ব' যেন না শোনায়)।",
      category: "v_w_sound",
    };
  }

  if (clean.startsWith("w")) {
    return {
      word: clean,
      phoneticHint: clean.toUpperCase(),
      bengaliTip: "ঠোঁট দুটি গোল করে 'উয়া' দিয়ে উচ্চারণ শুরু করুন।",
      category: "v_w_sound",
    };
  }

  return undefined;
}

/**
 * Evaluates spoken audio against target sentence without any fake decimal/percentage scoring.
 * Assigns relative qualitative tiers and specific actionable Bengali tips.
 */
export function evaluatePronunciationQuality(
  targetSentence: string,
  spokenText: string
): PronunciationAssessment {
  const cleanTargetWords = targetSentence.trim().split(/\s+/).filter(Boolean);
  const normalizedSpoken = normalizeSpokenText(spokenText);
  const spokenWordsList = normalizedSpoken ? normalizedSpoken.split(" ") : [];
  const spokenWordSet = new Set(spokenWordsList);

  const tokens: PronunciationWordToken[] = [];
  let clearCount = 0;
  let unclearCount = 0;
  let missedCount = 0;

  for (const rawToken of cleanTargetWords) {
    const clean = rawToken.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!clean) continue;

    const guide = lookupWordPhoneticGuide(clean);

    if (spokenWordSet.has(clean)) {
      clearCount++;
      tokens.push({
        original: rawToken,
        clean,
        status: "clear",
        phoneticGuide: guide,
      });
    } else {
      // Check for partial or near phonetic matches
      const isNearMatch = spokenWordsList.some(
        (spk) => spk.includes(clean) || clean.includes(spk) || (guide && guide.phoneticHint.toLowerCase().includes(spk))
      );

      if (isNearMatch) {
        unclearCount++;
        tokens.push({
          original: rawToken,
          clean,
          status: "unclear",
          phoneticGuide: guide,
        });
      } else {
        missedCount++;
        tokens.push({
          original: rawToken,
          clean,
          status: "missed",
          phoneticGuide: guide,
        });
      }
    }
  }

  const totalWords = tokens.length;

  // Extra words spoken that were not in target sentence
  const targetCleanSet = new Set(tokens.map((t) => t.clean));
  const extraWords = spokenWordsList.filter((w) => !targetCleanSet.has(w));

  // Determine qualitative tier (no fake percentages)
  let tier: PronunciationTier = "needs_practice";
  let tierLabelBn = "চর্চা প্রয়োজন";
  let tierLabelEn = "Needs practice";
  let feedbackBn = "";

  if (spokenWordsList.length === 0) {
    tier = "needs_practice";
    tierLabelBn = "কোনো শব্দ ধরা পড়েনি";
    tierLabelEn = "No clear audio";
    feedbackBn = "মাইক্রোফোনে কোনো স্পষ্ট শব্দ ধরা পড়েনি। শান্ত পরিবেশে আরেকবার চেষ্টা করুন।";
  } else if (clearCount === totalWords && unclearCount === 0) {
    tier = "clear";
    tierLabelBn = "স্পষ্ট ও সাবলীল";
    tierLabelEn = "Clear & natural";
    feedbackBn = "চমৎকার! প্রতিটি শব্দ অত্যন্ত স্পষ্ট ও সুন্দরভাবে উচ্চারিত হয়েছে।";
  } else if (clearCount >= Math.ceil(totalWords / 2)) {
    tier = "getting_there";
    tierLabelBn = "মোটামুটি হয়েছে";
    tierLabelEn = "Getting there";
    feedbackBn = "বেশ ভালো হয়েছে! বাক্যটির অধিকাংশ শব্দ স্পষ্ট ছিল; কিছু নির্দিষ্ট শব্দ আরেকটু স্পষ্ট করা প্রয়োজন।";
  } else {
    tier = "needs_practice";
    tierLabelBn = "চর্চা প্রয়োজন";
    tierLabelEn = "Needs practice";
    feedbackBn = "চেষ্টাটি প্রশংসনীয়! মডেল অডিওটি ধীর গতিতে শুনুন এবং স্বাভাবিক গতিতে পুনরায় বলুন।";
  }

  // Generate actionable tips targeting unclear and missed words
  const actionableTipsBn: string[] = [];
  const trickyTokens = tokens.filter((t) => t.status !== "clear");

  for (const tok of trickyTokens.slice(0, 3)) {
    if (tok.phoneticGuide?.bengaliTip) {
      actionableTipsBn.push(`"${tok.clean}": ${tok.phoneticGuide.bengaliTip}`);
    } else {
      actionableTipsBn.push(`"${tok.clean}": শব্দটি মডেল অডিওর সাথে মিলিয়ে আরেকটু স্পষ্ট করে বলুন।`);
    }
  }

  if (actionableTipsBn.length === 0 && tier === "clear") {
    actionableTipsBn.push("উচ্চারণ নির্ভুল হয়েছে! এবার সম্পূর্ণ বাক্যের সুর ও স্বরভঙ্গি স্বাভাবিক রাখার অভ্যাস করুন।");
  }

  return {
    tokens,
    tier,
    tierLabelBn,
    tierLabelEn,
    totalWords,
    clearWordsCount: clearCount,
    unclearWordsCount: unclearCount,
    missedWordsCount: missedCount,
    extraWords,
    feedbackBn,
    actionableTipsBn,
    disclaimerBn: AUTOMATED_AUDIO_DISCLAIMER_BN,
  };
}
