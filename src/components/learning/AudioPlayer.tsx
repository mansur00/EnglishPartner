"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayIcon, PauseIcon, ReloadIcon } from "@hugeicons/core-free-icons";
import type { DialogueLineItem } from "@/content/seed/dialogues";

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
  const [currentLineIdx, setCurrentLineIdx] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const isPlayingRef = useRef(false);
  const playLineRef = useRef<(index: number) => void>(() => {});

  const playLine = useCallback(
    (index: number) => {
      if (index >= lines.length) {
        setIsPlaying(false);
        isPlayingRef.current = false;
        setCurrentLineIdx(0);
        onActiveLineChange(null);
        setProgressPercent(100);
        return;
      }

      setCurrentLineIdx(index);
      onActiveLineChange(index);
      const progress = ((index + 1) / lines.length) * 100;
      setProgressPercent(progress);

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
    setProgressPercent(0);
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
    <div className="sticky bottom-4 z-20 mx-auto max-w-3xl w-full bg-[var(--ecp-surface)]/95 backdrop-blur-md border border-[var(--ecp-border)] rounded-2xl p-4 shadow-xl space-y-3">
      {/* Progress Bar */}
      <div className="w-full bg-[var(--ecp-surface-muted)] h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-[var(--ecp-brand-800)] h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Play / Pause & Replay */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={handleTogglePlay}
            className="rounded-full shadow-sm gap-1.5 min-w-[100px]"
          >
            <HugeiconsIcon icon={isPlaying ? PauseIcon : PlayIcon} size={18} />
            <span>{isPlaying ? "Pause" : "Play Full"}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleReplay}
            title={t("audio.replay")}
            className="rounded-full text-[var(--ecp-text-secondary)]"
          >
            <HugeiconsIcon icon={ReloadIcon} size={16} />
          </Button>
        </div>

        {/* Center: Current Line Position Indicator */}
        <div className="text-xs font-semibold text-[var(--ecp-text-secondary)]">
          {isPlaying && activeLineIndex !== null ? (
            <span className="flex items-center gap-1.5 text-[var(--ecp-brand-800)] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[var(--ecp-brand-800)] animate-pulse" />
              Playing Line {activeLineIndex + 1} of {lines.length}
            </span>
          ) : (
            <span>{t("audio.fullConversation")}</span>
          )}
        </div>

        {/* Right: Speed Toggle & Accent Picker */}
        <div className="flex items-center gap-2">
          {/* Playback Speed */}
          <button
            type="button"
            onClick={handleSpeedToggle}
            className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[var(--ecp-surface-muted)] border border-[var(--ecp-border)] text-[var(--ecp-text-primary)] hover:border-[var(--ecp-brand-800)]/40 transition-colors"
            title={t("audio.cycleSpeed")}
          >
            {playbackSpeed}x
          </button>

          {/* Accent Switcher (en-US / en-GB) */}
          <div className="inline-flex rounded-lg border border-[var(--ecp-border)] bg-[var(--ecp-surface-muted)] p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onAccentChange("en-US")}
              className={`px-2 py-0.5 rounded-md transition-all ${
                accent === "en-US"
                  ? "bg-[var(--ecp-brand-800)] text-white shadow-2xs"
                  : "text-[var(--ecp-text-muted)] hover:text-[var(--ecp-text-primary)]"
              }`}
            >
              US
            </button>
            <button
              type="button"
              onClick={() => onAccentChange("en-GB")}
              className={`px-2 py-0.5 rounded-md transition-all ${
                accent === "en-GB"
                  ? "bg-[var(--ecp-brand-800)] text-white shadow-2xs"
                  : "text-[var(--ecp-text-muted)] hover:text-[var(--ecp-text-primary)]"
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
