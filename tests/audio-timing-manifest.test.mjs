import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  estimateSentenceDurationMs,
  buildAudioTimingManifest,
  findLineIndexAtTimestamp,
  timestampToPercentage,
  percentageToTimestamp,
} from "../src/lib/audio/timing-manifest.ts";

describe("Milestone 1C+ / KI-13: Audio Timing Manifest & Interactive Seek", () => {
  const sampleLines = [
    { id: "line-1", speakerName: "Rafi", englishText: "Hello! Can I help you?" },
    { id: "line-2", speakerName: "Nabila", englishText: "Yes, how much is this bag?" },
    { id: "line-3", speakerName: "Rafi", englishText: "It is five hundred taka." },
  ];

  describe("1. Duration Estimation", () => {
    it("estimates positive duration with sensible floor for short sentences", () => {
      const dur = estimateSentenceDurationMs("Hello!");
      assert.ok(dur >= 1200, "Must be at least baseline floor 1200ms");
    });

    it("scales inversely with playback rate", () => {
      const normal = estimateSentenceDurationMs("This is a test sentence.", 1.0);
      const fast = estimateSentenceDurationMs("This is a test sentence.", 2.0);
      assert.ok(fast < normal, "2x speed duration must be shorter than 1x");
    });
  });

  describe("2. Timing Manifest Assembly (Audio Guide §5.2 & §5.3)", () => {
    it("builds strictly sequential start and end timestamps", () => {
      const manifest = buildAudioTimingManifest(sampleLines, {
        accent: "en-US",
        pauseBetweenLinesMs: 600,
        speakerChangePauseMs: 900,
      });

      assert.equal(manifest.lines.length, 3);
      assert.equal(manifest.accent, "en-US");
      assert.ok(manifest.durationMs > 0);

      // Line 1 starts at 0
      assert.equal(manifest.lines[0].startMs, 0);
      assert.ok(manifest.lines[0].endMs > manifest.lines[0].startMs);

      // Line 2 (speaker change from Rafi to Nabila) has 900ms pause
      const pause1 = manifest.lines[1].startMs - manifest.lines[0].endMs;
      assert.equal(pause1, 900, "Speaker change must apply 900ms pause per Audio Guide §5.3");

      // Line 3 (speaker change from Nabila to Rafi) has 900ms pause
      const pause2 = manifest.lines[2].startMs - manifest.lines[1].endMs;
      assert.equal(pause2, 900);
    });
  });

  describe("3. Interactive Seek & Timestamp Mapping (KI-13)", () => {
    it("maps timestamps accurately to active dialogue line index", () => {
      const manifest = buildAudioTimingManifest(sampleLines, {
        accent: "en-US",
        pauseBetweenLinesMs: 600,
        speakerChangePauseMs: 900,
      });

      // At start (0ms) -> Line 0
      assert.equal(findLineIndexAtTimestamp(manifest, 0), 0);

      // In middle of Line 1 -> Line 1
      const line1Mid = (manifest.lines[1].startMs + manifest.lines[1].endMs) / 2;
      assert.equal(findLineIndexAtTimestamp(manifest, line1Mid), 1);

      // In middle of Line 2 -> Line 2
      const line2Mid = (manifest.lines[2].startMs + manifest.lines[2].endMs) / 2;
      assert.equal(findLineIndexAtTimestamp(manifest, line2Mid), 2);
    });

    it("converts timestamps and scrub bar percentages bidirectionally", () => {
      const totalMs = 10000;
      assert.equal(timestampToPercentage(5000, totalMs), 50);
      assert.equal(percentageToTimestamp(50, totalMs), 5000);
      assert.equal(timestampToPercentage(0, totalMs), 0);
      assert.equal(timestampToPercentage(10000, totalMs), 100);
    });
  });
});
