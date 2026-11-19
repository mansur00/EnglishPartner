"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getLineTranslationDisplay } from "@/lib/content/translation-status";
import { SpeakerLabel } from "./SpeakerLabel";
import { AudioPlayButton } from "./AudioPlayButton";
import { GrammarToggleButton } from "@/components/grammar/GrammarToggleButton";
import { GrammarText } from "@/components/grammar/GrammarText";
import { GrammarSummaryRow } from "@/components/grammar/GrammarSummaryRow";
import { useGrammar } from "@/lib/grammar/context";
import { createFallbackAnnotation } from "@/lib/grammar/fallback";
import type { LineAnnotation, RenderToken } from "@/lib/grammar/types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  ViewOffIcon,
  InformationCircleIcon,
  BookOpen01Icon,
} from "@hugeicons/core-free-icons";
import type { DialogueSpeaker, DialogueLineItem } from "@/content/seed/dialogues";

interface ConversationTurnProps {
  line: DialogueLineItem;
  speaker: DialogueSpeaker;
  accent?: "en-US" | "en-GB";
  isGlobalTranslationVisible: boolean;
  isCurrentlyPlaying?: boolean;
  onLinePlayStart?: () => void;
  onLinePlayEnd?: () => void;
  onWordClick?: (word: string, tokenData?: RenderToken) => void;
  onGrammarClick?: (lineId: string) => void;
  onRuleClick?: (ruleKey: string) => void;
  hasGrammarExplanation?: boolean;
  isAdminPreview?: boolean;
  annotation?: LineAnnotation;
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
  onGrammarClick,
  onRuleClick,
  hasGrammarExplanation = false,
  isAdminPreview = false,
  annotation,
}: ConversationTurnProps) {
  const [localTranslationVisible, setLocalTranslationVisible] = useState<boolean | null>(null);

  const { isLineActive, toggleLine } = useGrammar();
  const isGrammarActive = isLineActive(line.id);

  // Resolved annotation (from props or runtime fallback)
  const resolvedAnnotation =
    annotation || createFallbackAnnotation(line.id, line.englishText);

  const translationDisplay = getLineTranslationDisplay(line, isAdminPreview);

  // If local toggle hasn't been clicked, follow global; otherwise follow local override
  const isTranslationShown =
    localTranslationVisible !== null ? localTranslationVisible : isGlobalTranslationVisible;

  return (
    <div
      className={cn(
        "rounded-[16px] p-5 md:p-6 transition-all duration-200 border space-y-3.5",
        isCurrentlyPlaying
          ? "bg-primary/10 border-primary shadow-xs ring-1 ring-primary/30"
          : speaker.colorScheme === "accent"
            ? "bg-card border-border"
            : "bg-card border-border"
      )}
    >
      {/* Top Bar: Speaker & Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        <SpeakerLabel speaker={speaker} />

        <div className="flex items-center gap-1.5 sm:gap-2">
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

          {/* Grammar Color-Coding Toggle (per turn) */}
          <GrammarToggleButton
            isActive={isGrammarActive}
            onToggle={() => toggleLine(line.id)}
          />

          {/* Detailed Grammar Explanation Modal Button (if static explanation exists) */}
          {hasGrammarExplanation && (
            <button
              type="button"
              onClick={() => onGrammarClick?.(line.id)}
              className="inline-flex items-center gap-1 min-h-[44px] px-2.5 py-1 rounded-control text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer"
              title="বাক্যের ব্যাকরণ ও গঠন বিশ্লেষণ দেখুন"
            >
              <HugeiconsIcon icon={BookOpen01Icon} size={14} />
              <span className="hidden sm:inline font-bangla">বিশ্লেষণ</span>
            </button>
          )}

          {/* Translation Toggle per Line */}
          <button
            type="button"
            onClick={() => setLocalTranslationVisible(!isTranslationShown)}
            className="inline-flex items-center gap-1 min-h-[44px] px-2.5 py-1 rounded-control text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer border border-border"
            title={isTranslationShown ? "Hide Bangla translation" : "Show Bangla translation"}
          >
            <HugeiconsIcon icon={isTranslationShown ? ViewOffIcon : ViewIcon} size={14} />
            <span className="hidden sm:inline font-bangla">{isTranslationShown ? "লুকান" : "বাংলা"}</span>
          </button>
        </div>
      </div>

      {/* English Dialogue Line */}
      <div className="pt-1">
        <div className="text-lg md:text-xl font-medium text-[var(--ecp-text-primary)] leading-[1.7] tracking-tight">
          {isGrammarActive ? (
            <GrammarText
              annotation={resolvedAnnotation}
              onTokenClick={(token) => {
                const cleanWord = token.lemma || token.text.replace(/[^a-zA-Z]/g, "").toLowerCase();
                if (cleanWord) {
                  onWordClick?.(cleanWord, token);
                }
              }}
            />
          ) : (
            resolvedAnnotation.tokens.map((token, index) => {
              const cleanWord = token.lemma || token.text.replace(/[^a-zA-Z]/g, "").toLowerCase();
              const isPunctuation = token.pos === "punctuation";
              const isClickable = !isPunctuation;

              return (
                <span key={`${token.i}-${index}`}>
                  <span
                    role={cleanWord ? "button" : undefined}
                    tabIndex={cleanWord ? 0 : undefined}
                    onClick={() => cleanWord && onWordClick?.(cleanWord)}
                    onKeyDown={(e) => {
                      if (cleanWord && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        onWordClick?.(cleanWord);
                      }
                    }}
                    className={cn(
                      "gram-token",
                      isClickable &&
                        "cursor-pointer hover:bg-muted/40 transition-colors duration-150 outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-xs"
                    )}
                    title={cleanWord ? `Click to see meaning for '${token.text}'` : undefined}
                  >
                    {token.text}
                  </span>
                  {index < resolvedAnnotation.tokens.length - 1 &&
                    resolvedAnnotation.tokens[index + 1].pos !== "punctuation" &&
                    " "}
                </span>
              );
            })
          )}
        </div>

        {/* Grammar Summary Row (Chips for Tenses & Patterns when active) */}
        {isGrammarActive && (
          <GrammarSummaryRow
            annotation={resolvedAnnotation}
            onRuleClick={onRuleClick}
          />
        )}
      </div>

      {/* Contextual Bangla Translation (Multi-Language §6.2) */}
      {isTranslationShown && (
        <div className="pt-2 border-t border-[var(--ecp-border)]/60 animate-in fade-in duration-200">
          <div>
            <p
              className={cn(
                "leading-[1.75]",
                translationDisplay.isComingSoon
                  ? "text-sm text-muted-foreground italic font-sans"
                  : "text-sm md:text-base text-[var(--ecp-text-secondary)] font-bangla"
              )}
            >
              {translationDisplay.displayText}
            </p>
            {translationDisplay.isDraftPreview && (
              <span className="inline-block mt-1 text-chip font-medium text-amber-800 bg-amber-500/10 px-2 py-0.5 rounded border border-border">
                Draft Preview (Unreviewed)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Optional Learning Note */}
      {line.learningNote && (
        <div className="flex items-start gap-2 pt-1 text-xs text-[var(--ecp-brand-800)] bg-[var(--ecp-brand-50)]/80 p-2.5 rounded-[12px] border border-[var(--ecp-brand-100)]">
          <HugeiconsIcon icon={InformationCircleIcon} size={15} className="shrink-0 mt-0.5" />
          <span className="leading-snug">{line.learningNote}</span>
        </div>
      )}
    </div>
  );
}
