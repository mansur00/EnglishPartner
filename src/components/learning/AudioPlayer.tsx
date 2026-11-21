"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayIcon, PauseIcon, ReloadIcon } from "@hugeicons/core-free-icons";
import type { DialogueLineItem } from "@/content/seed/dialogues";
import {
  buildAudioTimingManifest,
  findLineIndexAtTimestamp,
} from "@/lib/audio/timing-manifest";

interface AudioPlayerProps {
  lines: DialogueLineItem[];
  accent: "en-US" | "en-GB";
  onAccentChange: (accent: "en-US" | "en-GB") => void;
  activeLineIndex: number | null;
  onActiveLineChange: (index: number | null) => void;
}

export function AudioPlayer({
  lines,
  accent,
  onAccentChange,
  activeLineIndex,
  onActiveLineChange,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastSelectedIdx, setLastSelectedIdx] = useState<number>(0);

  const isPlayingRef = useRef(false);
  const playLineRef = useRef<(index: number) => void>(() => {});
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Compute timing manifest per Audio Guide §5.2
  const manifest = useMemo(
    () =>
      buildAudioTimingManifest(
        lines.map((l) => ({ id: l.id, speakerName: l.speakerId, englishText: l.englishText })),
        { accent, playbackRate: playbackSpeed }
      ),
    [lines, accent, playbackSpeed]
  );

  const currentLineIdx = activeLineIndex ?? lastSelectedIdx;

  const progressPercent = useMemo(() => {
    if (isCompleted) return 100;
    if (activeLineIndex === null) return 0;
    const lineTiming = manifest.lines[activeLineIndex];
    if (lineTiming && manifest.durationMs > 0) {
      return Math.min(100, Math.max(0, Math.round((lineTiming.startMs / manifest.durationMs) * 100)));
    }
    return Math.min(100, Math.max(0, Math.round(((activeLineIndex + 1) / lines.length) * 100)));
  }, [isCompleted, activeLineIndex, manifest, lines.length]);

  const playLine = useCallback(
    (index: number) => {
      if (index >= lines.length) {
        setIsPlaying(false);
        isPlayingRef.current = false;
        setIsCompleted(true);
        setLastSelectedIdx(0);
        onActiveLineChange(null);
        return;
      }

      setIsCompleted(false);
      setLastSelectedIdx(index);
      onActiveLineChange(index);

      const targetLine = lines[index];
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(targetLine.englishText);
        utterance.lang = accent;
        utterance.rate = playbackSpeed;

        utterance.onend = () => {
          if (isPlayingRef.current) {
            setTimeout(() => {
              if (isPlayingRef.current) {
                playLineRef.current(index + 1);
              }
            }, 600);
          }
        };

        utterance.onerror = () => {
          setIsPlaying(false);
          isPlayingRef.current = false;
        };

        window.speechSynthesis.speak(utterance);
      }
    },
    [lines, accent, playbackSpeed, onActiveLineChange]
  );

  useEffect(() => {
    playLineRef.current = playLine;
  }, [playLine]);

  const seekToLine = (index: number) => {
    if (index < 0 || index >= lines.length) return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsCompleted(false);
    setLastSelectedIdx(index);
    onActiveLineChange(index);
    if (isPlaying) {
      playLine(index);
    }
  };

  const handleSeekFromEvent = (clientX: number) => {
    if (!progressBarRef.current || manifest.durationMs <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetMs = ratio * manifest.durationMs;
    const targetLineIdx = findLineIndexAtTimestamp(manifest, targetMs);

    if (targetLineIdx !== null) {
      seekToLine(targetLineIdx);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    handleSeekFromEvent(e.clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIdx = Math.min(lines.length - 1, currentLineIdx + 1);
      seekToLine(nextIdx);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIdx = Math.max(0, currentLineIdx - 1);
      seekToLine(prevIdx);
    } else if (e.key === "Home") {
      e.preventDefault();
      seekToLine(0);
    } else if (e.key === "End") {
      e.preventDefault();
      seekToLine(lines.length - 1);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      const startIdx = currentLineIdx >= lines.length ? 0 : currentLineIdx;
      playLine(startIdx);
    }
  };

  const handleReplay = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(true);
    isPlayingRef.current = true;
    setIsCompleted(false);
    setLastSelectedIdx(0);
    playLine(0);
  };

  const handleSpeedToggle = () => {
    const speeds = [0.75, 1, 1.25, 1.5];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="sticky bottom-4 z-20 mx-auto max-w-reading w-full bg-card/95 backdrop-blur-md border border-border rounded-card p-4 shadow-xl space-y-3">
      {/* Interactive Seek Bar (KI-13) */}
      <div
        ref={progressBarRef}
        role="slider"
        tabIndex={0}
        aria-label="Audio playback scrub bar"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        onClick={handleProgressBarClick}
        onKeyDown={handleKeyDown}
        className="relative w-full bg-muted h-2 rounded-pill overflow-hidden cursor-pointer group hover:h-2.5 transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div
          className="bg-primary h-full transition-all duration-150 rounded-pill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Play / Pause & Replay */}
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="md"
            onClick={handleTogglePlay}
            className="rounded-pill shadow-xs gap-1.5 min-w-24"
          >
            <HugeiconsIcon icon={isPlaying ? PauseIcon : PlayIcon} size={18} />
            <span>{isPlaying ? "Pause" : "Play Full"}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleReplay}
            title={t("audio.replay")}
            className="rounded-pill text-muted-foreground"
          >
            <HugeiconsIcon icon={ReloadIcon} size={16} />
          </Button>
        </div>

        {/* Center: Current Line Position Indicator */}
        <div className="text-chip text-muted-foreground">
          {isPlaying && activeLineIndex !== null ? (
            <span className="flex items-center gap-1.5 text-primary">
              <span className="size-2 rounded-pill bg-primary animate-pulse" />
              Playing Line {activeLineIndex + 1} of {lines.length}
            </span>
          ) : (
            <div className="flex items-center gap-1.5">
              <span>{t("audio.fullConversation")}</span>
              <Pill variant="neutral" size="sm" className="font-mono">
                {lines.length} lines
              </Pill>
            </div>
          )}
        </div>

        {/* Right: Speed Toggle & Accent Picker */}
        <div className="flex items-center gap-2">
          {/* Playback Speed */}
          <button
            type="button"
            onClick={handleSpeedToggle}
            className="px-2.5 py-1 rounded-control text-chip bg-muted border border-border text-foreground hover:border-primary/40 transition-colors cursor-pointer"
            title={t("audio.cycleSpeed")}
          >
            {playbackSpeed}x
          </button>

          {/* Accent Switcher (en-US / en-GB) */}
          <div className="inline-flex rounded-control border border-border bg-muted p-0.5 text-chip">
            <button
              type="button"
              onClick={() => onAccentChange("en-US")}
              className={`px-2 py-0.5 rounded-control transition-all cursor-pointer ${
                accent === "en-US"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              US
            </button>
            <button
              type="button"
              onClick={() => onAccentChange("en-GB")}
              className={`px-2 py-0.5 rounded-control transition-all cursor-pointer ${
                accent === "en-GB"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              UK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
