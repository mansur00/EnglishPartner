"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SpeakerLabel } from "./SpeakerLabel";
import { AudioPlayButton } from "./AudioPlayButton";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import type { DialogueSpeaker, DialogueLineItem } from "@/content/seed/dialogues";

interface ConversationTurnProps {
  line: DialogueLineItem;
  speaker: DialogueSpeaker;
  accent?: "en-US" | "en-GB";
  isGlobalTranslationVisible: boolean;
  isCurrentlyPlaying?: boolean;
  onLinePlayStart?: () => void;
  onLinePlayEnd?: () => void;
  onWordClick?: (word: string) => void;
}

export function ConversationTurn({
  line,
  speaker,
  accent = "en-US",
  isGlobalTranslationVisible,
  isCurrentlyPlaying = false,
  onLinePlayStart,
  onLinePlayEnd,
  onWordClick,
}: ConversationTurnProps) {
  const [localTranslationVisible, setLocalTranslationVisible] = useState<boolean | null>(null);

  // If local toggle hasn't been clicked, follow global; otherwise follow local override
  const isTranslationShown =
    localTranslationVisible !== null ? localTranslationVisible : isGlobalTranslationVisible;

  // Split english sentence to highlight key words
  const words = line.englishText.split(" ");

  return (
    <div
      className={cn(
        "rounded-2xl p-5 md:p-6 transition-all duration-200 border space-y-3.5",
        isCurrentlyPlaying
          ? "bg-[var(--ecp-brand-50)] border-[var(--ecp-brand-700)] shadow-sm ring-1 ring-[var(--ecp-brand-700)]/30"
          : speaker.colorScheme === "accent"
          ? "bg-[var(--ecp-surface-warm)] border-[var(--ecp-border)]"
          : "bg-[var(--ecp-surface)] border-[var(--ecp-border)]"
      )}
    >
      {/* Top Bar: Speaker & Audio Controls */}
      <div className="flex items-center justify-between gap-3">
        <SpeakerLabel speaker={speaker} />

        <div className="flex items-center gap-2">
          {/* Individual Sentence Audio Play */}
          <AudioPlayButton
            textToSpeak={line.englishText}
            accent={accent}
            audioUrl={line.audioUrl?.[accent]}
            isAvailable={true}
            isPlaying={isCurrentlyPlaying}
            onPlayStateChange={(playing) => {
              if (playing) onLinePlayStart?.();
              else onLinePlayEnd?.();
            }}
            ariaLabel={`Play line ${line.sequenceNumber} by ${speaker.name}`}
          />

          {/* Translation Toggle per Line */}
          <button
            type="button"
            onClick={() => setLocalTranslationVisible(!isTranslationShown)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-[var(--ecp-text-secondary)] hover:text-[var(--ecp-brand-800)] hover:bg-[var(--ecp-surface-muted)] transition-colors cursor-pointer"
            title={isTranslationShown ? "Hide Bangla translation" : "Show Bangla translation"}
          >
            <HugeiconsIcon icon={isTranslationShown ? ViewOffIcon : ViewIcon} size={14} />
            <span className="hidden sm:inline">{isTranslationShown ? "Hide" : "বাংলা"}</span>
          </button>
        </div>
      </div>

      {/* English Dialogue Line with Interactive Words */}
      <div className="pt-1">
        <p className="text-lg md:text-xl font-medium text-[var(--ecp-text-primary)] leading-relaxed tracking-tight">
          {words.map((word, idx) => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, "");
            const isHighlighted = line.wordHighlights?.some(
              (h) => h.toLowerCase() === cleanWord.toLowerCase()
            );

            return (
              <span
                key={idx}
                onClick={() => cleanWord && onWordClick?.(cleanWord)}
                className={cn(
                  "inline-block mr-1.5 transition-colors rounded px-0.5",
                  isHighlighted
                    ? "font-semibold text-[var(--ecp-brand-950)] underline decoration-[var(--ecp-accent-500)] decoration-2 underline-offset-4 cursor-pointer hover:bg-[var(--ecp-accent-100)]"
                    : "cursor-default"
                )}
                title={isHighlighted ? `Explore '${cleanWord}' meaning & grammar` : undefined}
              >
                {word}
              </span>
            );
          })}
        </p>
      </div>

      {/* Contextual Bangla Translation (Sentence-by-sentence) */}
      {isTranslationShown && (
        <div className="pt-2 border-t border-[var(--ecp-border)]/60 animate-in fade-in duration-200">
          <p className="text-sm md:text-base text-[var(--ecp-text-secondary)] font-[var(--ecp-font-bangla)] leading-relaxed">
            {line.translationBn}
          </p>
        </div>
      )}

      {/* Optional Learning Note */}
      {line.learningNote && (
        <div className="flex items-start gap-2 pt-1 text-xs text-[var(--ecp-brand-800)] bg-[var(--ecp-brand-50)]/80 p-2.5 rounded-lg border border-[var(--ecp-brand-100)]">
          <HugeiconsIcon icon={InformationCircleIcon} size={15} className="shrink-0 mt-0.5" />
          <span className="leading-snug">{line.learningNote}</span>
        </div>
      )}
    </div>
  );
}
