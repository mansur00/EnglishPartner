/**
 * Timing Manifest Generator & Audio Synchronization Engine
 * Complies with ECP_Audio_Voice_Guide.md §5.2 and known issue KI-13
 */

export interface TimingManifestLine {
  lineId: string;
  sequence: number;
  speaker: string;
  startMs: number;
  endMs: number;
  durationMs: number;
}

export interface AudioTimingManifest {
  conversationVersionId: string;
  accent: "en-US" | "en-GB";
  fullAudioKey?: string;
  durationMs: number;
  pauseBetweenLinesMs: number;
  lines: TimingManifestLine[];
}

/**
 * Estimates reading duration of a sentence based on typical speaking rate (approx 150 words/min = 2.5 words/sec)
 * and word length, with floor and ceiling per Audio spec §5.2.
 */
export function estimateSentenceDurationMs(text: string, playbackRate: number = 1): number {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).length;
  const chars = text.length;
  // Baseline: 400ms per word + 30ms per character, min 1200ms
  const baseMs = Math.max(1200, words * 380 + chars * 25);
  return Math.round(baseMs / Math.max(0.5, playbackRate));
}

/**
 * Builds an Audio Timing Manifest per Audio Guide §5.2
 */
export function buildAudioTimingManifest(
  lines: { id: string; speakerName: string; englishText: string }[],
  options: {
    conversationVersionId?: string;
    accent?: "en-US" | "en-GB";
    pauseBetweenLinesMs?: number;
    speakerChangePauseMs?: number;
    playbackRate?: number;
  } = {}
): AudioTimingManifest {
  const {
    conversationVersionId = "auto-manifest",
    accent = "en-US",
    pauseBetweenLinesMs = 600,
    speakerChangePauseMs = 900,
    playbackRate = 1,
  } = options;

  let currentMs = 0;
  let previousSpeaker = "";
  const manifestLines: TimingManifestLine[] = [];

  lines.forEach((line, index) => {
    // Longer pause when speaker changes per Audio Guide §5.3
    if (index > 0) {
      const isSpeakerChange = previousSpeaker && previousSpeaker !== line.speakerName;
      currentMs += isSpeakerChange ? speakerChangePauseMs : pauseBetweenLinesMs;
    }

    const durationMs = estimateSentenceDurationMs(line.englishText, playbackRate);
    const startMs = currentMs;
    const endMs = startMs + durationMs;

    manifestLines.push({
      lineId: line.id,
      sequence: index + 1,
      speaker: line.speakerName,
      startMs,
      endMs,
      durationMs,
    });

    currentMs = endMs;
    previousSpeaker = line.speakerName;
  });

  return {
    conversationVersionId,
    accent,
    durationMs: currentMs,
    pauseBetweenLinesMs,
    lines: manifestLines,
  };
}

/**
 * Finds the active line index given a millisecond timestamp
 */
export function findLineIndexAtTimestamp(
  manifest: AudioTimingManifest,
  currentMs: number
): number | null {
  if (!manifest.lines.length || currentMs < 0) return null;

  for (let i = 0; i < manifest.lines.length; i++) {
    const item = manifest.lines[i];
    // Inside the line speech window
    if (currentMs >= item.startMs && currentMs <= item.endMs) {
      return i;
    }
    // In pause window right before next line
    const nextItem = manifest.lines[i + 1];
    if (nextItem && currentMs > item.endMs && currentMs < nextItem.startMs) {
      return i;
    }
  }

  // After the last line
  if (currentMs >= manifest.durationMs) {
    return manifest.lines.length - 1;
  }

  return 0;
}

/**
 * Calculates percentage progress for a given millisecond timestamp
 */
export function timestampToPercentage(currentMs: number, totalDurationMs: number): number {
  if (totalDurationMs <= 0) return 0;
  const pct = (currentMs / totalDurationMs) * 100;
  return Math.min(100, Math.max(0, Math.round(pct * 10) / 10));
}

/**
 * Converts a percentage on the scrub bar (0 - 100) to millisecond timestamp
 */
export function percentageToTimestamp(percentage: number, totalDurationMs: number): number {
  if (totalDurationMs <= 0) return 0;
  const clamped = Math.min(100, Math.max(0, percentage));
  return Math.round((clamped / 100) * totalDurationMs);
}
