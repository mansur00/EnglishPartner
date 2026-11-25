"use client";

import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Layers01Icon,
  TranslateIcon,
  BookOpen01Icon,
  VolumeHighIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GrammarModeSwitch } from "@/components/grammar/GrammarModeSwitch";
import { GrammarLayerPicker } from "@/components/grammar/GrammarLayerPicker";
import { GrammarLegend } from "@/components/grammar/GrammarLegend";
import { GrammarSummaryRow } from "@/components/grammar/GrammarSummaryRow";
import { createFallbackAnnotation } from "@/lib/grammar/fallback";
import { useTranslations, useLiveTranslation } from "@/lib/i18n";
import { isRtlLanguage, getLanguageMeta } from "@/lib/i18n/languages";
import { getLineTranslationDisplay } from "@/lib/content/translation-status";
import { speakText } from "@/lib/audio/speech-engine";
import { AudioPlayer } from "./AudioPlayer";
import {
  CONVERSATION_STYLES,
  type CefrLevelCode,
  type ConversationStyle,
  type LengthTier,
} from "@/lib/content/length-tiers";
import {
  SEED_GRAMMAR_EXPLANATIONS,
  type SentenceGrammarEntry,
} from "@/content/seed/vocabulary";
import type {
  ConversationVersionData,
  DialogueLineItem,
  DialogueSpeaker,
} from "@/content/seed/dialogues";
import type { LineAnnotation } from "@/lib/grammar/types";

interface ConversationInspectorSidebarProps {
  scenarioLevel?: CefrLevelCode;
  effectiveLevel: CefrLevelCode;
  levelTiers: LengthTier[];
  selectedTierId: string;
  onSelectTier: (tierId: string) => void;
  selectedStyle: ConversationStyle;
  onSelectStyle: (style: ConversationStyle) => void;
  versions: ConversationVersionData[];
  selectedVersionId: string;
  onSelectVersion: (versionId: string) => void;
  presentCategories: string[];
  selectedLine: DialogueLineItem | null;
  selectedSpeaker: DialogueSpeaker | null;
  selectedAnnotation?: LineAnnotation;
  accent?: "en-US" | "en-GB";
  onAccentChange?: (accent: "en-US" | "en-GB") => void;
  lines?: DialogueLineItem[];
  activeLineIndex?: number | null;
  onActiveLineChange?: (index: number | null) => void;
  onOpenFullGrammarModal?: (lineId: string) => void;
  onRuleClick?: (ruleKey: string) => void;
}

export function ConversationInspectorSidebar({
  scenarioLevel,
  effectiveLevel,
  levelTiers,
  selectedTierId,
  onSelectTier,
  selectedStyle,
  onSelectStyle,
  versions,
  selectedVersionId,
  onSelectVersion,
  presentCategories,
  selectedLine,
  selectedSpeaker,
  selectedAnnotation,
  accent = "en-US",
  onAccentChange,
  lines = [],
  activeLineIndex = null,
  onActiveLineChange,
  onOpenFullGrammarModal,
  onRuleClick,
}: ConversationInspectorSidebarProps) {
  const { locale, translationLocale } = useTranslations();

  const hasStaticBn =
    translationLocale === "bn" && Boolean(selectedLine?.translationBn?.trim());
  const needsLiveTranslation =
    Boolean(selectedLine) && translationLocale !== "none" && !hasStaticBn;

  const { translatedText: liveTranslation, isLoading: isTranslating } =
    useLiveTranslation(
      needsLiveTranslation ? selectedLine?.englishText : undefined,
      needsLiveTranslation ? translationLocale : "none"
    );

  const fallbackDisplay = selectedLine
    ? getLineTranslationDisplay(selectedLine, false)
    : null;

  const activeTranslationText = !selectedLine
    ? ""
    : hasStaticBn
    ? selectedLine.translationBn!
    : liveTranslation || (isTranslating ? "..." : fallbackDisplay?.displayText || "");

  const resolvedAnnotation = selectedLine
    ? selectedAnnotation ||
      createFallbackAnnotation(selectedLine.id, selectedLine.englishText)
    : null;

  const grammarEntry: SentenceGrammarEntry | null = selectedLine
    ? SEED_GRAMMAR_EXPLANATIONS[selectedLine.id] || {
        lineId: selectedLine.id,
        sentenceText: selectedLine.englishText,
        structure: {
          subject: "Identified Subject",
          verb: "Main Action / Verb Phrase",
          objectOrComplement: "Predicate / Complement",
          tenseName: `${effectiveLevel} Conversational Structure`,
          tensePattern: "Subject + Verb Phrase + Complement",
          whyUsedBn: "দৈনন্দিন স্বাভাবিক কথোপকথনে এই বাক্যটি ব্যবহৃত হয়।",
        },
        politeAlternatives: [],
        commonMistakes: [],
      }
    : null;

  const transLangMeta =
    translationLocale !== "none" ? getLanguageMeta(translationLocale) : null;

  return (
    <div className="space-y-4">
      {/* 0. Full Conversation Audio Player (Sidebar Mode) */}
      {lines.length > 0 && onAccentChange && onActiveLineChange && (
        <AudioPlayer
          variant="sidebar"
          lines={lines}
          accent={accent}
          onAccentChange={onAccentChange}
          activeLineIndex={activeLineIndex}
          onActiveLineChange={onActiveLineChange}
        />
      )}

      {/* 1. Length & Style Controls */}
      <div className="rounded-card bg-card p-4 shadow-xs border border-border/60 space-y-3.5">
        {scenarioLevel ? (
          <>
            {/* Length Tier Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-chip font-semibold text-foreground flex items-center gap-1.5">
                  <HugeiconsIcon icon={Layers01Icon} size={14} className="text-primary" />
                  {locale === "bn" ? `${effectiveLevel} দৈর্ঘ্য` : `${effectiveLevel} Length`}
                </span>
                <Badge variant="neutral" size="sm" className="font-mono">
                  {effectiveLevel}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {levelTiers.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => onSelectTier(tier.id)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-control text-chip text-left transition-all cursor-pointer truncate",
                      selectedTierId === tier.id
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {locale === "bn" ? tier.labelBn : tier.labelEn}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border/60" />

            {/* Style Selector */}
            <div className="space-y-2">
              <span className="text-chip font-semibold text-foreground block">
                {locale === "bn" ? "কথোপকথনের ধরন (Style)" : "Conversation Style"}
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {CONVERSATION_STYLES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onSelectStyle(st)}
                    className={cn(
                      "px-2 py-1.5 rounded-control text-chip capitalize transition-all cursor-pointer text-center",
                      selectedStyle === st
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {st === "casual"
                      ? locale === "bn"
                        ? "বন্ধুত্বপূর্ণ"
                        : "Casual"
                      : st === "formal"
                      ? locale === "bn"
                        ? "আনুষ্ঠানিক"
                        : "Formal"
                      : locale === "bn"
                      ? "স্বাভাবিক"
                      : "Neutral"}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : versions.length > 1 ? (
          <div className="space-y-2">
            <span className="text-chip font-semibold text-foreground flex items-center gap-1.5">
              <HugeiconsIcon icon={Layers01Icon} size={14} className="text-primary" />
              {locale === "bn" ? "সংস্করণ" : "Version"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {versions.map((ver) => (
                <button
                  key={ver.versionId}
                  type="button"
                  onClick={() => onSelectVersion(ver.versionId)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-control text-chip transition-all cursor-pointer",
                    selectedVersionId === ver.versionId
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {ver.versionName} ({ver.lines.length})
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="h-px bg-border/60" />

        {/* Grammar Controls */}
        <div className="space-y-2">
          <span className="text-chip font-semibold text-foreground block">
            {locale === "bn" ? "গ্রামার হাইলাইট" : "Grammar Highlight"}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <GrammarModeSwitch lang={locale === "bn" ? "bn" : "en"} />
            <GrammarLayerPicker lang={locale === "bn" ? "bn" : "en"} />
          </div>
          <GrammarLegend
            presentCategories={presentCategories}
            lang={locale === "bn" ? "bn" : "en"}
          />
        </div>
      </div>

      {/* 2. Tapped Sentence Inspector: Translation + Grammar */}
      <div className="rounded-card bg-card p-4 shadow-xs border border-border/60 space-y-4">
        {selectedLine && selectedSpeaker ? (
          <>
            {/* Selected Sentence Header */}
            <div className="space-y-2 pb-3 border-b border-border/60">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="brand" size="sm">
                    {selectedSpeaker.name}
                  </Badge>
                  <span className="text-chip font-mono text-muted-foreground">
                    #{selectedLine.sequenceNumber}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => speakText(selectedLine.englishText, { lang: accent })}
                  className="h-8 px-2.5 text-chip gap-1.5 rounded-control"
                >
                  <HugeiconsIcon icon={VolumeHighIcon} size={14} />
                  <span>{locale === "bn" ? "শুনুন" : "Listen"}</span>
                </Button>
              </div>
              <p className="text-meta font-conversation font-medium text-foreground leading-relaxed">
                &ldquo;{selectedLine.englishText}&rdquo;
              </p>
            </div>

            {/* Translation Section */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-chip font-semibold text-foreground flex items-center gap-1.5">
                  <HugeiconsIcon icon={TranslateIcon} size={14} className="text-primary" />
                  {locale === "bn" ? "অনুবাদ" : "Translation"}
                </span>
                {transLangMeta && (
                  <span className="text-chip text-muted-foreground font-mono">
                    {transLangMeta.nativeName}
                  </span>
                )}
              </div>
              {translationLocale === "none" ? (
                <p className="text-chip text-muted-foreground italic bg-muted/40 p-2.5 rounded-control">
                  {locale === "bn"
                    ? "অনুবাদ বন্ধ আছে (English Only)"
                    : "Translation is off (English Only mode)"}
                </p>
              ) : (
                <p
                  dir={isRtlLanguage(translationLocale) ? "rtl" : "ltr"}
                  className={cn(
                    "text-meta text-foreground bg-muted/40 p-3 rounded-control border border-border/50 leading-relaxed",
                    translationLocale === "bn" && "font-bangla text-bangla"
                  )}
                >
                  {activeTranslationText}
                </p>
              )}
            </div>

            {/* Grammar Section */}
            <div className="space-y-2.5 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between gap-2">
                <span className="text-chip font-semibold text-foreground flex items-center gap-1.5">
                  <HugeiconsIcon icon={BookOpen01Icon} size={14} className="text-primary" />
                  {locale === "bn" ? "গ্রামার ও গঠন" : "Grammar & Structure"}
                </span>
                {onOpenFullGrammarModal && (
                  <button
                    type="button"
                    onClick={() => onOpenFullGrammarModal(selectedLine.id)}
                    className="text-chip text-primary hover:underline cursor-pointer"
                  >
                    {locale === "bn" ? "বিস্তারিত" : "Full View"}
                  </button>
                )}
              </div>

              {resolvedAnnotation && (
                <GrammarSummaryRow
                  annotation={resolvedAnnotation}
                  lang={locale === "bn" ? "bn" : "en"}
                  onRuleClick={onRuleClick}
                />
              )}

              {grammarEntry && (
                <div className="rounded-control bg-muted/40 border border-border/50 p-3 space-y-2 text-chip">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <HugeiconsIcon icon={SparklesIcon} size={13} className="text-primary" />
                      Tense:
                    </span>
                    <span className="font-medium text-foreground text-right">
                      {grammarEntry.structure.tenseName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Pattern:</span>
                    <span className="font-mono text-primary text-right">
                      {grammarEntry.structure.tensePattern}
                    </span>
                  </div>
                  <div className="pt-1.5 border-t border-border/50 space-y-1">
                    <div>
                      <span className="text-muted-foreground">Subject: </span>
                      <span className="font-mono text-foreground">
                        {grammarEntry.structure.subject}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Verb: </span>
                      <span className="font-mono text-foreground">
                        {grammarEntry.structure.verb}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Complement: </span>
                      <span className="font-mono text-foreground">
                        {grammarEntry.structure.objectOrComplement}
                      </span>
                    </div>
                  </div>
                  {grammarEntry.structure.whyUsedBn && (
                    <p className="pt-1.5 border-t border-border/50 text-muted-foreground leading-relaxed">
                      {grammarEntry.structure.whyUsedBn}
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-6 text-center text-chip text-muted-foreground">
            {locale === "bn"
              ? "অনুবাদ ও গ্রামার দেখতে কনভারসেশনের যেকোনো বাক্যে ট্যাপ করুন।"
              : "Tap any sentence in the conversation to inspect its translation and grammar."}
          </div>
        )}
      </div>
    </div>
  );
}
