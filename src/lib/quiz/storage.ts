import type { QuizSessionResult } from "./types";

const QUIZ_RESULTS_STORAGE_KEY = "ecp_quiz_results_v1";
const MAX_STORED_RESULTS = 50;

export function listQuizSessionResults(): QuizSessionResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUIZ_RESULTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QuizSessionResult[]) : [];
  } catch {
    return [];
  }
}

export function saveQuizSessionResult(result: QuizSessionResult): void {
  if (typeof window === "undefined") return;
  try {
    const existing = listQuizSessionResults().filter(
      (item) => item.sessionId !== result.sessionId
    );
    const updated = [result, ...existing].slice(0, MAX_STORED_RESULTS);
    localStorage.setItem(QUIZ_RESULTS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function getQuizSessionResult(
  sessionId: string
): QuizSessionResult | null {
  const all = listQuizSessionResults();
  return all.find((item) => item.sessionId === sessionId) ?? null;
}

export function getLatestResultForScenario(
  slug: string,
  lengthTierId?: string,
  style?: string
): QuizSessionResult | null {
  const all = listQuizSessionResults();
  return (
    all.find(
      (item) =>
        item.kind === "conversation" &&
        item.scenarioSlug === slug &&
        (!lengthTierId || item.lengthTierId === lengthTierId) &&
        (!style || item.style === style)
    ) ?? null
  );
}
