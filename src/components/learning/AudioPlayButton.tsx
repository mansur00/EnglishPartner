"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayIcon,
  PauseIcon,
  VolumeMute01Icon,
} from "@hugeicons/core-free-icons";

export interface AudioPlayButtonProps {
  textToSpeak: string;
  accent?: "en-US" | "en-GB";
  audioUrl?: string;
  isAvailable?: boolean;
  isPlaying?: boolean;
  onPlayStateChange?: (playing: boolean) => void;
  ariaLabel?: string;
}

export function AudioPlayButton({
  textToSpeak,
  accent = "en-US",
  audioUrl,
  isAvailable = true,
  isPlaying: externalIsPlaying,
  onPlayStateChange,
  ariaLabel = "Play sentence audio",
}: AudioPlayButtonProps) {
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalIsPlaying;

  const setPlayingState = (state: boolean) => {
    setInternalIsPlaying(state);
    onPlayStateChange?.(state);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAvailable) return;

    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingState(false);
      return;
    }

    // 1. If static audioUrl exists
    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => setPlayingState(false);
        audioRef.current.onerror = () => setPlayingState(false);
      }
      audioRef.current.play().catch(() => setPlayingState(false));
      setPlayingState(true);
      return;
    }

    // 2. Client SpeechSynthesis Fallback (Natural audio preview)
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = accent === "en-GB" ? "en-GB" : "en-US";
      utterance.rate = 0.95; // Clear natural learning pace

      utterance.onend = () => setPlayingState(false);
      utterance.onerror = () => setPlayingState(false);

      setPlayingState(true);
      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingState(false);
    }
  };

  if (!isAvailable) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-muted-foreground bg-muted cursor-not-allowed select-none"
        title="Audio asset is being generated"
      >
        <HugeiconsIcon icon={VolumeMute01Icon} size={13} />
        <span>Audio unavailable</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--ecp-brand-800)] focus:ring-offset-1 select-none",
        isPlaying
          ? "bg-[var(--ecp-brand-800)] text-white shadow-xs"
          : "bg-[var(--ecp-surface-muted)] text-[var(--ecp-brand-800)] hover:bg-[var(--ecp-brand-100)] border border-[var(--ecp-border)]"
      )}
    >
      <HugeiconsIcon icon={isPlaying ? PauseIcon : PlayIcon} size={14} />
      <span>{isPlaying ? "Pause" : "Listen"}</span>
    </button>
  );
}
