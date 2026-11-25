"use client";

import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { VolumeHighIcon, StopIcon } from "@hugeicons/core-free-icons";
import { GrammarText } from "@/components/grammar/GrammarText";
import { useGrammar } from "@/lib/grammar/context";
import { createFallbackAnnotation } from "@/lib/grammar/fallback";
import { speakText, stopSpeech } from "@/lib/audio/speech-engine";
import type { LineAnnotation, RenderToken } from "@/lib/grammar/types";
import type { DialogueSpeaker, DialogueLineItem } from "@/content/seed/dialogues";

interface ChatTurnBubbleProps {
  line: DialogueLineItem;
  speaker: DialogueSpeaker;
  side: "left" | "right";
  accent?: "en-US" | "en-GB";
  isSelected: boolean;
  isCurrentlyPlaying: boolean;
  annotation?: LineAnnotation;
  onSelect: () => void;
  onLinePlayStart?: () => void;
  onLinePlayEnd?: () => void;
  onWordClick?: (word: string, tokenData?: RenderToken) => void;
}

export function ChatTurnBubble({
  line,
  speaker,
  side,
  accent = "en-US",
  isSelected,
  isCurrentlyPlaying,
  annotation,
  onSelect,
  onLinePlayStart,
  onLinePlayEnd,
  onWordClick,
}: ChatTurnBubbleProps) {
  const { isLineActive } = useGrammar();
  const isGrammarActive = isLineActive(line.id);

  const resolvedAnnotation =
    annotation || createFallbackAnnotation(line.id, line.englishText);

  const isRight = side === "right";

  const avatarColors = {
    brand: "bg-primary/15 text-primary border-primary/30",
    accent: "bg-warning-bg text-warning border-warning/30",
    peach: "bg-topic-tile text-topic-ink border-topic-border",
  };

  const handleAudioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentlyPlaying) {
      stopSpeech();
      onLinePlayEnd?.();
      return;
    }
    onLinePlayStart?.();
    speakText(line.englishText, {
      lang: accent,
      speakerGender: isRight ? "male" : "female",
      onEnd: () => onLinePlayEnd?.(),
      onError: () => onLinePlayEnd?.(),
    });
  };

  return (
    <div
      className={cn(
        "flex items-end gap-2.5 sm:gap-3 group",
        isRight ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Speaker Avatar */}
      <div
        className={cn(
          "size-9 sm:size-10 rounded-pill flex items-center justify-center text-label font-semibold border shrink-0 select-none shadow-2xs",
          avatarColors[speaker.colorScheme] || avatarColors.brand
        )}
        title={`${speaker.name} (${speaker.role})`}
      >
        {speaker.avatarChar}
      </div>

      {/* Chat Bubble (Pure English Only — Conversation Focused) */}
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
        aria-pressed={isSelected}
        aria-label={`Select sentence ${line.sequenceNumber} by ${speaker.name}`}
        className={cn(
          "relative max-w-[85%] sm:max-w-[78%] px-4 py-3 transition-all duration-150 cursor-pointer text-left border",
          isRight
            ? "rounded-card rounded-br-sm bg-primary/10 border-primary/15 hover:bg-primary/15"
            : "rounded-card rounded-bl-sm bg-muted/70 border-border/70 hover:bg-muted",
          (isSelected || isCurrentlyPlaying) &&
            "rainbow-border-thin border-transparent shadow-xs"
        )}
      >
        <div className="flex items-start justify-between gap-2.5">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-chip font-semibold tracking-tight",
                  isRight ? "text-primary" : "text-foreground"
                )}
              >
                {speaker.name}:
              </span>
              <span className="text-chip text-muted-foreground font-mono">
                #{line.sequenceNumber}
              </span>
            </div>

            <div className="text-conversation text-foreground">
              {isGrammarActive ? (
                <GrammarText
                  annotation={resolvedAnnotation}
                  onTokenClick={(tok) =>
                    onWordClick?.(tok.text.replace(/[.,!?;:'"()]/g, ""), tok)
                  }
                />
              ) : (
                <p className="select-text">{line.englishText}</p>
              )}
            </div>
          </div>

          {/* Compact Listen Icon */}
          <button
            type="button"
            onClick={handleAudioClick}
            aria-label={
              isCurrentlyPlaying
                ? `Stop audio for line ${line.sequenceNumber}`
                : `Listen to line ${line.sequenceNumber}`
            }
            className={cn(
              "size-8 rounded-pill flex items-center justify-center shrink-0 transition-colors cursor-pointer mt-0.5",
              isCurrentlyPlaying
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card/80 text-muted-foreground hover:text-primary hover:bg-card border border-border/60"
            )}
          >
            <HugeiconsIcon
              icon={isCurrentlyPlaying ? StopIcon : VolumeHighIcon}
              size={15}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
