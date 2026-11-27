export type AudioBookKind = "audio_only" | "story_book";

export type AudioBookLevel = "A1" | "A2" | "B1" | "B2" | "C1";

export interface AudioBookItem {
  id: string;
  kind: AudioBookKind;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  level: AudioBookLevel;
  category: string;
  thumbnailUrl?: string;
  audioUrl?: string;
  durationLabel?: string;
  storyText?: string;
  summaryBn?: string;
  wordCount?: number;
  createdAt: string;
  isBuiltIn?: boolean;
}

/**
 * Splits story text into clean sentences for live audio-text sync highlighting.
 */
export function splitStorySentences(text: string): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  const matches = normalized.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g);
  return (matches ?? [normalized]).map((s) => s.trim()).filter(Boolean);
}

/**
 * Counts words in a story string.
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
