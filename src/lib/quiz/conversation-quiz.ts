import type { DialogueLineItem } from "@/content/seed/dialogues";
import type { ScenarioItem } from "@/content/seed/scenarios";
import { SEED_VOCABULARY } from "../../content/seed/vocabulary.ts";
import type { CefrLevelCode, ConversationStyle } from "../content/length-tiers.ts";
import { getQuestionCountForLevel, type QuizQuestion } from "./types.ts";

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createPrng(seed: number): () => number {
  let state = seed || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function seededShuffle<T>(items: T[], rand: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildOptionsWithCorrect(
  correct: string,
  distractors: string[],
  rand: () => number
): { options: [string, string, string, string]; correctIndex: number } {
  const uniqueDistractors: string[] = [];
  for (const d of distractors) {
    const trimmed = d.trim();
    if (
      trimmed &&
      trimmed.toLowerCase() !== correct.trim().toLowerCase() &&
      !uniqueDistractors.some((x) => x.toLowerCase() === trimmed.toLowerCase())
    ) {
      uniqueDistractors.push(trimmed);
    }
    if (uniqueDistractors.length === 3) break;
  }

  const fallbackPool = [
    "Could you repeat that more slowly?",
    "I am not sure about that right now.",
    "Let me check the details for you.",
    "Thank you very much for your help.",
  ];
  for (const fb of fallbackPool) {
    if (uniqueDistractors.length === 3) break;
    if (
      fb.toLowerCase() !== correct.trim().toLowerCase() &&
      !uniqueDistractors.some((x) => x.toLowerCase() === fb.toLowerCase())
    ) {
      uniqueDistractors.push(fb);
    }
  }

  const combined = [correct.trim(), ...uniqueDistractors.slice(0, 3)];
  const indexed = combined.map((text, idx) => ({ text, isCorrect: idx === 0 }));
  const shuffled = seededShuffle(indexed, rand);
  const correctIndex = shuffled.findIndex((item) => item.isCorrect);

  return {
    options: [
      shuffled[0].text,
      shuffled[1].text,
      shuffled[2].text,
      shuffled[3].text,
    ],
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
  };
}

const CLOZE_STOPWORDS = new Set([
  "the",
  "and",
  "that",
  "this",
  "with",
  "from",
  "have",
  "your",
  "what",
  "when",
  "where",
  "which",
  "will",
  "would",
  "could",
  "should",
  "there",
  "their",
  "about",
  "very",
  "here",
  "just",
  "some",
  "they",
  "them",
  "been",
]);

const STYLE_LABELS: Record<ConversationStyle, { en: string; bn: string }> = {
  casual: { en: "Casual", bn: "সহজ ও বন্ধুত্বপূর্ণ" },
  neutral: { en: "Neutral", bn: "স্বাভাবিক ও ভদ্র" },
  formal: { en: "Formal", bn: "আনুষ্ঠানিক ও পেশাদার" },
};

export interface BuildConversationQuizInput {
  scenario: ScenarioItem;
  lines: DialogueLineItem[];
  level: CefrLevelCode;
  lengthTierId: string;
  style: ConversationStyle;
  seedOffset?: number;
}

/**
 * Generates 10-30 deterministic 4-option MCQs based on level (A1=10 .. C2=30),
 * conversation lines, style, and length tier.
 */
export function buildConversationQuizQuestions({
  scenario,
  lines,
  level,
  lengthTierId,
  style,
  seedOffset = 0,
}: BuildConversationQuizInput): QuizQuestion[] {
  const targetCount = getQuestionCountForLevel(level);
  const rand = createPrng(
    hashSeed(`${scenario.slug}:${level}:${lengthTierId}:${style}:${seedOffset}`)
  );

  const candidates: QuizQuestion[] = [];
  const allLineTexts = lines.map((l) => l.englishText).filter(Boolean);
  const allWordCandidates = Array.from(
    new Set(
      allLineTexts
        .join(" ")
        .replace(/[^a-zA-Z\s'-]/g, " ")
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length >= 4 && !CLOZE_STOPWORDS.has(w.toLowerCase()))
    )
  );

  // 1. Cloze (Fill in the blank) questions from dialogue lines
  lines.forEach((line, idx) => {
    const tokens = line.englishText.split(/\s+/);
    const eligible = tokens
      .map((raw, tIdx) => ({
        raw,
        clean: raw.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, ""),
        tIdx,
      }))
      .filter(
        (t) =>
          t.clean.length >= 4 && !CLOZE_STOPWORDS.has(t.clean.toLowerCase())
      );

    if (eligible.length === 0) return;
    const picked = eligible[Math.floor(rand() * eligible.length)];
    const blanked = tokens
      .map((tok, i) =>
        i === picked.tIdx ? tok.replace(picked.clean, "_____") : tok
      )
      .join(" ");

    const distractors = seededShuffle(
      allWordCandidates.filter(
        (w) => w.toLowerCase() !== picked.clean.toLowerCase()
      ),
      rand
    ).slice(0, 3);

    while (distractors.length < 3) {
      const extra = ["schedule", "option", "moment", "detail", "service"][
        distractors.length
      ];
      if (extra && extra.toLowerCase() !== picked.clean.toLowerCase()) {
        distractors.push(extra);
      } else {
        distractors.push("phrase");
      }
    }

    const { options, correctIndex } = buildOptionsWithCorrect(
      picked.clean,
      distractors,
      rand
    );

    candidates.push({
      id: `${scenario.slug}-cloze-${idx}-${seedOffset}`,
      prompt: `Complete the sentence from the conversation: "${blanked}"`,
      promptBn: `কথোপকথনের এই বাক্যটি সম্পূর্ণ করুন: "${blanked}"`,
      options,
      correctIndex,
      explanation: `In this ${STYLE_LABELS[style].en.toLowerCase()} dialogue, "${picked.clean}" fits naturally: "${line.englishText}".`,
      explanationBn: `এই সংলাপে সঠিক শব্দটি হলো "${picked.clean}" — সম্পূর্ণ বাক্য: "${line.englishText}"।`,
      cefrLevel: level,
      skillTag: "Grammar",
    });
  });

  // 2. Next-turn / Contextual response questions
  for (let i = 0; i < lines.length - 1; i++) {
    const promptLine = lines[i];
    const replyLine = lines[i + 1];
    const otherReplies = seededShuffle(
      allLineTexts.filter((txt) => txt !== replyLine.englishText),
      rand
    ).slice(0, 3);

    const { options, correctIndex } = buildOptionsWithCorrect(
      replyLine.englishText,
      otherReplies,
      rand
    );

    candidates.push({
      id: `${scenario.slug}-turn-${i}-${seedOffset}`,
      prompt: `How does the other speaker respond right after: "${promptLine.englishText}"?`,
      promptBn: `"${promptLine.englishText}" — এই কথার পরের স্বাভাবিক উত্তর কোনটি?`,
      options,
      correctIndex,
      explanation: `"${replyLine.englishText}" directly answers "${promptLine.englishText}" in this scenario.`,
      explanationBn: `সংলাপ অনুযায়ী "${promptLine.englishText}" এর পরের সঠিক উত্তর হলো: "${replyLine.englishText}"।`,
      cefrLevel: level,
      skillTag: "Comprehension",
    });
  }

  // 3. Bangla-to-English intent matching from dialogue lines
  lines.forEach((line, idx) => {
    if (!line.translationBn) return;
    const otherEnglish = seededShuffle(
      allLineTexts.filter((txt) => txt !== line.englishText),
      rand
    ).slice(0, 3);

    const { options, correctIndex } = buildOptionsWithCorrect(
      line.englishText,
      otherEnglish,
      rand
    );

    candidates.push({
      id: `${scenario.slug}-bn2en-${idx}-${seedOffset}`,
      prompt: `Which English line from "${scenario.title}" expresses: "${line.translationBn}"?`,
      promptBn: `"${line.translationBn}" — এই অর্থটি প্রকাশ করে এমন সঠিক ইংরেজি বাক্য কোনটি?`,
      options,
      correctIndex,
      explanation: `"${line.englishText}" means "${line.translationBn}".`,
      explanationBn: `"${line.translationBn}" এর সঠিক ইংরেজি রূপ হলো "${line.englishText}"।`,
      cefrLevel: level,
      skillTag: "Context",
    });
  });

  // 4. Register / Style awareness question
  const styleOptionsMap: Record<ConversationStyle, string> = {
    casual: "Relaxed, friendly, everyday phrasing with contractions",
    neutral: "Balanced, polite, everyday standard phrasing",
    formal: "Respectful, structured, professional phrasing",
  };
  const { options: styleOpts, correctIndex: styleCorrect } =
    buildOptionsWithCorrect(
      styleOptionsMap[style],
      [
        ...Object.entries(styleOptionsMap)
          .filter(([k]) => k !== style)
          .map(([, v]) => v),
        "Slang-heavy street idioms only",
      ],
      rand
    );

  candidates.push({
    id: `${scenario.slug}-style-${seedOffset}`,
    prompt: `Which communication style best describes this ${STYLE_LABELS[style].en} version of "${scenario.title}"?`,
    promptBn: `"${scenario.titleBn}" কথোপকথনের ${STYLE_LABELS[style].bn} ধরনটি কোন বৈশিষ্ট্যের?`,
    options: styleOpts,
    correctIndex: styleCorrect,
    explanation: `This conversation version uses the ${STYLE_LABELS[style].en} register: ${styleOptionsMap[style]}.`,
    explanationBn: `এই সংস্করণটি ${STYLE_LABELS[style].bn} রীতিতে লেখা হয়েছে।`,
    cefrLevel: level,
    skillTag: "Register",
  });

  // 5. Vocabulary questions from SEED_VOCABULARY
  const vocabList = Object.values(SEED_VOCABULARY);
  const matchingVocab = seededShuffle(vocabList, rand).slice(0, 12);
  matchingVocab.forEach((entry, idx) => {
    const distractorMeanings = seededShuffle(
      vocabList
        .filter((v) => v.lemma !== entry.lemma)
        .map((v) => v.generalMeaningBn || v.contextualMeaningBn),
      rand
    ).slice(0, 3);

    const correctMeaning = entry.contextualMeaningBn || entry.generalMeaningBn;
    const { options, correctIndex } = buildOptionsWithCorrect(
      correctMeaning,
      distractorMeanings,
      rand
    );

    candidates.push({
      id: `${scenario.slug}-vocab-${idx}-${seedOffset}`,
      prompt: `What is the best meaning of "${entry.word}" (${entry.partOfSpeech})?`,
      promptBn: `"${entry.word}" (${entry.partOfSpeech}) শব্দটির সঠিক অর্থ কী?`,
      options,
      correctIndex,
      explanation: `"${entry.word}" (${entry.ipa}) means "${correctMeaning}". Example: "${entry.exampleSentence}".`,
      explanationBn: `"${entry.word}" এর অর্থ "${correctMeaning}"। উদাহরণ: "${entry.exampleSentence}"।`,
      cefrLevel: level,
      skillTag: "Vocabulary",
    });
  });

  const shuffled = seededShuffle(candidates, rand);
  const result: QuizQuestion[] = [];

  for (let i = 0; i < targetCount; i++) {
    const base = shuffled[i % shuffled.length];
    result.push({
      ...base,
      id: `${base.id}-q${i + 1}`,
    });
  }

  return result;
}
