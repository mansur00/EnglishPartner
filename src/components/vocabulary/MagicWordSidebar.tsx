"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  VolumeHighIcon,
  Bookmark02Icon,
  BookmarkCheck02Icon,
  TranslateIcon,
  BookOpen01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GrammarSummaryRow } from "@/components/grammar/GrammarSummaryRow";
import { createFallbackAnnotation } from "@/lib/grammar/fallback";
import { useTranslations, useLiveTranslations } from "@/lib/i18n";
import { isRtlLanguage, getLanguageMeta } from "@/lib/i18n/languages";
import { speakText } from "@/lib/audio/speech-engine";
import type { MagicCardDeck, MagicWordItem } from "@/content/seed/magic-cards";
import { useWordDetails } from "@/lib/ai/use-word-details";
import { WordDetailsSections } from "@/components/shared/WordDetailsSections";

interface MagicWordSidebarProps {
  activeDeck: MagicCardDeck | null;
  selectedWord: MagicWordItem | null;
  isSaved: boolean;
  onToggleSave: (lemma: string) => void;
  onRemoveFromCategory?: (lemma: string) => void;
  activeCategoryLabel?: string | null;
  totalCards: number;
  totalWords: number;
  savedCount: number;
}

export function MagicWordSidebar({
  activeDeck,
  selectedWord,
  isSaved,
  onToggleSave,
  onRemoveFromCategory,
  activeCategoryLabel,
  totalCards,
  totalWords,
  savedCount,
}: MagicWordSidebarProps) {
  const { locale, translationLocale } = useTranslations();

  const needsLive = Boolean(selectedWord) && translationLocale !== "none";
  const textsToTranslate = useMemo(() => {
    if (!needsLive || !selectedWord) return [];
    return [selectedWord.word, selectedWord.meaning, selectedWord.example];
  }, [needsLive, selectedWord]);

  const { translations: liveMap, isLoading } = useLiveTranslations(
    textsToTranslate,
    needsLive ? translationLocale : "none"
  );

  const transLangMeta =
    translationLocale !== "none" ? getLanguageMeta(translationLocale) : null;

  const exampleAnnotation = useMemo(() => {
    if (!selectedWord) return null;
    return createFallbackAnnotation(selectedWord.id, selectedWord.example);
  }, [selectedWord]);

  const wordDetailsReq = useMemo(
    () =>
      selectedWord
        ? {
            word: selectedWord.word,
            partOfSpeech: selectedWord.pos,
            contextSentence: selectedWord.example,
            existingMeaning: selectedWord.meaning,
          }
        : null,
    [selectedWord]
  );

  const { details, isLoading: isLoadingDetails } = useWordDetails(
    wordDetailsReq,
    Boolean(selectedWord)
  );

  if (!selectedWord) {
    return (
      <div className="space-y-4">
        <div className="rounded-card bg-muted/40 border border-border/60 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-page-title leading-none">🪄</span>
            <div>
              <h3 className="font-heading text-card-title text-foreground">
                {locale === "bn" ? "ম্যাজিক ওয়ার্ড ইন্সপেক্টর" : "Magic Word Inspector"}
              </h3>
              <p className="text-chip text-muted-foreground">
                {totalCards} {locale === "bn" ? "টি কার্ড" : "Magic Cards"} • {totalWords}{" "}
                {locale === "bn" ? "টি শব্দ" : "words"}
              </p>
            </div>
          </div>

          <p className="text-meta text-muted-foreground leading-relaxed">
            {activeDeck
              ? locale === "bn"
                ? `"${activeDeck.title}" কার্ডের যেকোনো শব্দে ট্যাপ করলে এখানে তার উচ্চারণ, অনুবাদ, উদাহরণ ও গ্রামার দেখাবে।`
                : `Tap any word in "${activeDeck.title}" to inspect its pronunciation, translation, example, and grammar here.`
              : locale === "bn"
              ? "যেকোনো একটি Magic Card ওপেন করুন, তারপর শব্দে ট্যাপ করে ডানপাশে সম্পূর্ণ বিশ্লেষণ দেখুন।"
              : "Open any Magic Card, then tap any word inside to inspect its pronunciation, translation, and grammar here."}
          </p>
        </div>

        <div className="rounded-card bg-muted/30 border border-border/60 p-4 space-y-2">
          <div className="flex items-center justify-between text-chip">
            <span className="text-muted-foreground">
              {locale === "bn" ? "মোট ম্যাজিক কার্ড" : "Total Magic Cards"}
            </span>
            <span className="font-mono font-semibold text-foreground">{totalCards}</span>
          </div>
          <div className="flex items-center justify-between text-chip">
            <span className="text-muted-foreground">
              {locale === "bn" ? "মোট শব্দ" : "Curated Words"}
            </span>
            <span className="font-mono font-semibold text-foreground">{totalWords}</span>
          </div>
          <div className="flex items-center justify-between text-chip">
            <span className="text-muted-foreground">
              {locale === "bn" ? "নোটবুকে সেভ করা" : "Saved in Notebook"}
            </span>
            <span className="font-mono font-semibold text-primary">{savedCount}</span>
          </div>
        </div>
      </div>
    );
  }

  const translatedWord = liveMap[selectedWord.word] || (isLoading ? "..." : "");
  const translatedMeaning = liveMap[selectedWord.meaning] || (isLoading ? "..." : "");
  const translatedExample = liveMap[selectedWord.example] || (isLoading ? "..." : "");

  return (
    <div className="space-y-4">
      {/* Deck Context Pill */}
      {activeDeck && (
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60">
          <span className="text-chip font-medium text-muted-foreground truncate">
            {activeDeck.emoji} {activeDeck.title}
          </span>
          <Badge variant="brand" size="sm">
            {activeDeck.level}
          </Badge>
        </div>
      )}

      {/* Selected Word Hero */}
      <div className="space-y-3 pb-3 border-b border-border/60">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading text-section-heading text-foreground break-words">
                {selectedWord.word}
              </h3>
              <Badge variant="neutral" size="sm">
                {selectedWord.pos}
              </Badge>
            </div>
            <p className="text-chip font-mono text-muted-foreground mt-0.5">
              {selectedWord.ipa}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => speakText(selectedWord.word)}
            className="h-9 px-2.5 rounded-control gap-1.5 shrink-0"
            aria-label={`Pronounce ${selectedWord.word}`}
          >
            <HugeiconsIcon icon={VolumeHighIcon} size={15} />
            <span className="text-chip">{locale === "bn" ? "শুনুন" : "Listen"}</span>
          </Button>
        </div>

        <Button
          type="button"
          variant={isSaved ? "secondary" : "default"}
          size="sm"
          onClick={() => onToggleSave(selectedWord.lemma)}
          className="w-full rounded-control gap-1.5 text-chip cursor-pointer"
        >
          <HugeiconsIcon
            icon={isSaved ? BookmarkCheck02Icon : Bookmark02Icon}
            size={15}
          />
          <span>
            {isSaved
              ? activeCategoryLabel
                ? `${locale === "bn" ? "সেভ করা:" : "Saved in"} ${activeCategoryLabel}`
                : locale === "bn"
                ? "নোটবুকে সেভ করা আছে (ক্যাটাগরি বদলান)"
                : "Saved (Manage Category)"
              : locale === "bn"
              ? "ক্যাটাগরিতে সেভ করুন"
              : "Save to Category"}
          </span>
        </Button>

        {onRemoveFromCategory && isSaved && (
          <button
            type="button"
            onClick={() => onRemoveFromCategory(selectedWord.lemma)}
            className="w-full text-center text-chip text-destructive hover:underline cursor-pointer"
          >
            {locale === "bn" ? "এই ক্যাটাগরি থেকে সরান" : "Remove from this category"}
          </button>
        )}
      </div>

      {/* Live Translation */}
      <div className="space-y-2 pb-3 border-b border-border/60">
        <div className="flex items-center justify-between gap-2">
          <span className="text-chip font-semibold text-foreground flex items-center gap-1.5">
            <HugeiconsIcon icon={TranslateIcon} size={14} className="text-primary" />
            {locale === "bn" ? "অনুবাদ" : "Translation"}
          </span>
          {transLangMeta && (
            <span className="text-chip font-mono text-muted-foreground">
              {transLangMeta.nativeName}
            </span>
          )}
        </div>

        {translationLocale === "none" ? (
          <p className="text-chip text-muted-foreground italic bg-muted/40 p-2.5 rounded-control">
            {locale === "bn"
              ? "অনুবাদ বন্ধ আছে (English Only Mode)"
              : "Translation is off (English Only mode)"}
          </p>
        ) : (
          <div
            dir={isRtlLanguage(translationLocale) ? "rtl" : "ltr"}
            className={cn(
              "p-3 rounded-control bg-muted/40 border border-border/50 space-y-1.5",
              translationLocale === "bn" && "font-bangla text-bangla"
            )}
          >
            {translatedWord && (
              <p className="text-label font-semibold text-primary">
                {translatedWord}
              </p>
            )}
            <p className="text-meta text-foreground leading-relaxed">
              {translatedMeaning || selectedWord.meaning}
            </p>
          </div>
        )}
      </div>

      {/* English Meaning */}
      <div className="space-y-1.5 pb-3 border-b border-border/60">
        <span className="text-chip font-semibold text-foreground flex items-center gap-1.5">
          <HugeiconsIcon icon={SparklesIcon} size={14} className="text-primary" />
          {locale === "bn" ? "ইংরেজি অর্থ" : "English Meaning"}
        </span>
        <p className="text-meta text-muted-foreground leading-relaxed">
          {selectedWord.meaning}
        </p>
      </div>

      {/* Example Sentence & Grammar */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-chip font-semibold text-foreground flex items-center gap-1.5">
            <HugeiconsIcon icon={BookOpen01Icon} size={14} className="text-primary" />
            {locale === "bn" ? "উদাহরণ ও গ্রামার" : "Example & Grammar"}
          </span>
          <button
            type="button"
            onClick={() => speakText(selectedWord.example)}
            className="text-chip text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <HugeiconsIcon icon={VolumeHighIcon} size={13} />
            <span>{locale === "bn" ? "বাক্য শুনুন" : "Play"}</span>
          </button>
        </div>

        <div className="p-3 rounded-control bg-muted/40 border border-border/50 space-y-2">
          <p className="text-meta text-foreground italic leading-relaxed">
            &ldquo;{selectedWord.example}&rdquo;
          </p>
          {translationLocale !== "none" && translatedExample && (
            <p
              dir={isRtlLanguage(translationLocale) ? "rtl" : "ltr"}
              className="text-chip text-muted-foreground border-t border-border/50 pt-1.5"
            >
              {translatedExample}
            </p>
          )}
        </div>

        {exampleAnnotation && (
          <GrammarSummaryRow
            annotation={exampleAnnotation}
            lang={locale === "bn" ? "bn" : "en"}
          />
        )}
      </div>

      {/* Rich Word Intelligence: Synonyms, Antonyms, Tense/POS Forms, Sentence Making */}
      <WordDetailsSections
        details={details}
        isLoading={isLoadingDetails}
        locale={locale}
      />
    </div>
  );
}
