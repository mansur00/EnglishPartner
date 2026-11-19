import type { LineAnnotation, GrammarToken, GrammarGroup } from "./types";

const PRONOUNS = new Set([
  "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them",
  "my", "your", "his", "its", "our", "their", "mine", "yours", "hers", "ours", "theirs",
  "this", "that", "these", "those", "what", "which", "who", "whom", "whose"
]);

const DETERMINERS = new Set(["the", "a", "an", "this", "that", "these", "those", "each", "every", "some", "any", "no"]);

const PREPOSITIONS = new Set([
  "in", "on", "at", "to", "for", "with", "from", "by", "about", "into", "over", "after",
  "before", "between", "under", "through", "during", "without"
]);

const CONJUNCTIONS = new Set(["and", "but", "or", "so", "because", "although", "while", "if", "unless", "since"]);

const AUX_MODAL_VERBS = new Set([
  "is", "am", "are", "was", "were", "be", "being", "been",
  "have", "has", "had", "having",
  "do", "does", "did",
  "can", "could", "will", "would", "shall", "should", "may", "might", "must"
]);

export function createFallbackAnnotation(lineId: string, text: string): LineAnnotation {
  const tokens: GrammarToken[] = [];
  const groups: GrammarGroup[] = [];

  // Match words, contractions, and punctuation
  const tokenRegex = /([a-zA-Z]+(?:'[a-zA-Z]+)?|[0-9]+|[^\s\w])/g;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    const rawWord = match[0];
    const lower = rawWord.toLowerCase();
    const start = match.index;
    const end = start + rawWord.length;

    let pos = "noun";
    let sub: string | null = null;
    let role: string | null = null;

    if (/^[.,!?;:]$/.test(rawWord)) {
      pos = "punctuation";
    } else if (/^[0-9]+$/.test(rawWord)) {
      pos = "numeral";
    } else if (DETERMINERS.has(lower)) {
      pos = "determiner";
    } else if (PRONOUNS.has(lower)) {
      pos = "pronoun";
      role = i === 0 ? "subject" : "direct-object";
    } else if (PREPOSITIONS.has(lower)) {
      pos = "preposition";
    } else if (CONJUNCTIONS.has(lower)) {
      pos = "conjunction";
    } else if (AUX_MODAL_VERBS.has(lower)) {
      pos = "verb";
      sub = "auxiliary";
      role = "verb-phrase";
    } else if (lower.endsWith("ing") || lower.endsWith("ed") || lower.endsWith("s")) {
      pos = "verb";
      role = "verb-phrase";
    } else if (lower.endsWith("ly")) {
      pos = "adverb";
      role = "adverbial";
    } else if (lower.endsWith("ful") || lower.endsWith("able") || lower.endsWith("ive") || lower.endsWith("ous")) {
      pos = "adjective";
    }

    tokens.push({
      i,
      text: rawWord,
      start,
      end,
      lemma: lower,
      pos,
      sub,
      role,
      confidence: 0.65,
    });

    i++;
  }

  // Detect simple sentence function
  const isQuestion = text.trim().endsWith("?");
  const isExclamation = text.trim().endsWith("!");

  return {
    lineId,
    text,
    textHash: "runtime-fallback",
    tokens,
    groups,
    sentence: {
      function: isQuestion ? "interrogative" : isExclamation ? "exclamatory" : "declarative",
      structure: "simple",
    },
  };
}
