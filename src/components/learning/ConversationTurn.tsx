"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
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
    const locale = useLocale();
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
                "rounded-card p-5 md:p-6 transition-all duration-200 space-y-3.5",
                isCurrentlyPlaying
                    ? "bg-primary/10 shadow-xs ring-2 ring-primary/40 border-0"
                    : "bg-card shadow-sm border-0 hover:shadow-md"
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
                        className="h-control-sm px-2.5 text-chip"
                    />

                    {/* Grammar Color-Coding Toggle (per turn) */}
                    <GrammarToggleButton
                        isActive={isGrammarActive}
                        onToggle={() => toggleLine(line.id)}
                        lang={locale === "bn" ? "bn" : "en"}
                        size="sm"
                    />

                    {/* Detailed Grammar Explanation Modal Button (if static explanation exists) */}
                    {hasGrammarExplanation && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onGrammarClick?.(line.id)}
                            className="h-control-sm px-2.5 text-chip gap-1 text-primary hover:text-primary rounded-control"
                            title={locale === "bn" ? "বাক্যের ব্যাকরণ ও গঠন বিশ্লেষণ দেখুন" : "View sentence grammar and syntax breakdown"}
                        >
                            <HugeiconsIcon icon={BookOpen01Icon} size={14} />
                            <span className="hidden sm:inline font-bangla">{locale === "bn" ? "বিশ্লেষণ" : "Explain"}</span>
                        </Button>
                    )}

                    {/* Translation Toggle per Line (Shown when in Bengali/translation mode) */}
                    {locale === "bn" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setLocalTranslationVisible(!isTranslationShown)}
                        className="h-control-sm px-2.5 text-chip gap-1 text-muted-foreground hover:text-foreground rounded-control"
                        title={isTranslationShown ? "অনুবাদ লুকান" : "অনুবাদ দেখুন"}
                      >
                        <HugeiconsIcon icon={isTranslationShown ? ViewOffIcon : ViewIcon} size={14} />
                        <span className="hidden sm:inline font-bangla">
                          {isTranslationShown ? "লুকান" : "অনুবাদ"}
                        </span>
                      </Button>
                    )}
                </div>
            </div>

            {/* English Dialogue Line */}
            <div className="pt-1">
                <div className="text-lead text-foreground tracking-tight">
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

            {/* Contextual Bangla Translation (shown only when user interface is in Bengali) */}
            {locale === "bn" && isTranslationShown && (
                <div className="pt-2 border-t border-border/60 animate-in fade-in duration-200">
                    <div>
                        <p
                            className={cn(
                                translationDisplay.isComingSoon
                                    ? "text-meta text-muted-foreground italic font-sans"
                                    : "text-meta text-muted-foreground text-bangla"
                            )}
                        >
                            {translationDisplay.displayText}
                        </p>
                        {translationDisplay.isDraftPreview && (
                            <span className="inline-block mt-1 text-chip text-warning bg-warning-bg px-2 py-0.5 rounded-pill border border-border">
                                Draft Preview (Unreviewed)
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Optional Learning Note */}
            {line.learningNote && (
                <div className="flex items-start gap-2 pt-1 text-chip text-primary bg-primary/10 p-2.5 rounded-panel border border-primary/20">
                    <HugeiconsIcon icon={InformationCircleIcon} size={15} className="shrink-0 mt-0.5" />
                    <span className="leading-snug">{line.learningNote}</span>
                </div>
            )}
        </div>
    );
}
