"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { t, useTranslations } from "@/lib/i18n";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  VolumeHighIcon,
  Bookmark01Icon,
  BookmarkCheck01Icon,
  SparklesIcon,
  BookOpen01Icon,
} from "@hugeicons/core-free-icons";
import { VocabularyEntry } from "@/content/seed/vocabulary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RenderToken } from "@/lib/grammar/types";
import { getLabel, getRuleCard } from "@/lib/grammar/taxonomy";

interface WordDetailPopoverProps {
  entry: VocabularyEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveToggle: (wordKey: string) => void;
  isSaved?: boolean;
  grammarRole?: string;
  tokenData?: RenderToken | null;
  onRuleClick?: (ruleKey: string) => void;
}

function GrammarItemCard({
  title,
  value,
  isMonospace,
}: {
  title: string;
  value: React.ReactNode;
  isMonospace?: boolean;
}) {
  return (
    <div className="p-2 rounded-control bg-card shadow-2xs">
      <span className="text-muted-foreground block text-bangla">{title}</span>
      <span className={cn("text-foreground", isMonospace ? "font-mono" : "text-bangla")}>
        {value}
      </span>
    </div>
  );
}

function WordFormBadge({ label, value }: { label: string; value: string }) {
  return (
    <span className="px-2.5 py-1 bg-muted/60 border-0 rounded-control text-muted-foreground">
      <strong className="text-foreground">{label}:</strong> {value}
    </span>
  );
}

export function WordDetailPopover({
  entry,
  isOpen,
  onClose,
  onSaveToggle,
  isSaved = false,
  grammarRole,
  tokenData,
  onRuleClick,
}: WordDetailPopoverProps) {
  const { locale, translationLocale } = useTranslations();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!entry) return null;

  const playPronunciation = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsPlayingAudio(true);
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(entry.word);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const posBadgeVariant = (pos: VocabularyEntry["partOfSpeech"]): "brand" | "neutral" | "accent" | "peach" => {
    switch (pos) {
      case "verb":
        return "brand";
      case "noun":
        return "neutral";
      case "adjective":
        return "accent";
      case "adverb":
        return "peach";
      default:
        return "brand";
    }
  };

  // Grammar labels if tokenData provided
  const grammarLang = locale === "bn" ? "bn" : "en";
  const posLabel = tokenData && tokenData.pos !== "unannotated" ? getLabel(tokenData.pos, grammarLang) : null;
  const subLabel = tokenData && tokenData.sub ? getLabel(tokenData.sub, grammarLang) : null;
  const roleLabel = tokenData && tokenData.role ? getLabel(tokenData.role, grammarLang) : null;

  const tenseKey =
    tokenData && tokenData.tenseTime && tokenData.tenseAspect
      ? `${tokenData.tenseTime}-${tokenData.tenseAspect}`
      : null;
  const tenseRule = tenseKey ? getRuleCard(tenseKey, grammarLang) : null;
  const tenseLabel = tenseKey ? getLabel(tenseKey, grammarLang) : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full sm:max-w-lg bg-card border-0 shadow-lg p-5 sm:p-6 text-left max-h-dialog overflow-y-auto">
        {/* Header with Title, POS and Grammar Role */}
        <DialogHeader className="pb-3 border-b border-border text-left">
          <div className="flex items-center gap-2.5 flex-wrap">
            <DialogTitle className="text-card-title text-foreground tracking-tight font-sans">
              {entry.word}
            </DialogTitle>
            <Badge variant={posBadgeVariant(entry.partOfSpeech)} size="sm" className="uppercase text-chip">
              {entry.partOfSpeech}
            </Badge>
            {(grammarRole || roleLabel) && (
              <Badge variant="accent" size="sm" className={cn("text-chip", locale === "bn" && "text-bangla")}>
                {locale === "bn" ? "ভূমিকা:" : "Role:"} {roleLabel ? roleLabel.name : grammarRole}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Pronunciation & Audio */}
        <div className="flex items-center gap-3 py-2">
          <span className="text-chip font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-control border-0">
            {entry.ipa}
          </span>
          <Button
            variant={isPlayingAudio ? "default" : "outline"}
            size="sm"
            onClick={playPronunciation}
            aria-label={`${t("reader.listen", locale)}: ${entry.word}`}
            className={cn("btn-press text-label gap-1.5 h-9 rounded-control", locale === "bn" && "text-bangla")}
          >
            <HugeiconsIcon icon={VolumeHighIcon} size={15} />
            <span>{t("reader.listen", locale)}</span>
          </Button>
        </div>

        {/* Enhanced Grammar Breakdown (when token data is available) */}
        {tokenData && (
          <div className="my-2 p-3.5 rounded-panel bg-muted/50 space-y-2.5 border-0">
            <div className="text-chip text-primary text-bangla flex items-center gap-1.5">
              <HugeiconsIcon icon={BookOpen01Icon} size={14} />
              <span>{locale === "bn" ? "ব্যাকরণগত বিশ্লেষণ:" : "Grammar Breakdown:"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-chip">
              {posLabel && (
                <GrammarItemCard
                  title={locale === "bn" ? "পদ প্রকরণ:" : "Part of Speech:"}
                  value={`${posLabel.name} ${subLabel ? `(${subLabel.name})` : ""}`}
                />
              )}
              {roleLabel && (
                <GrammarItemCard
                  title={locale === "bn" ? "বাক্যের ভূমিকা:" : "Sentence Role:"}
                  value={roleLabel.name}
                />
              )}
              {tokenData.lemma && (
                <GrammarItemCard
                  title={locale === "bn" ? "মূল শব্দ:" : "Lemma:"}
                  value={tokenData.lemma}
                  isMonospace
                />
              )}
              {tenseLabel && (
                <GrammarItemCard
                  title={locale === "bn" ? "ক্রিয়ার কাল:" : "Tense:"}
                  value={tenseLabel.name}
                />
              )}
            </div>

            {/* If tense formula available */}
            {tenseRule && (
              <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-chip">
                <span className="font-mono text-muted-foreground">
                  Formula: {tenseRule.formula}
                </span>
                {onRuleClick && tenseKey && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onRuleClick(tenseKey);
                    }}
                    className={cn("text-chip text-primary hover:underline cursor-pointer", locale === "bn" && "text-bangla")}
                  >
                    {locale === "bn" ? "নিয়ম দেখুন →" : "View Rule →"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Contextual Meaning */}
        <div className="space-y-3 my-2">
          <div className="bg-primary/5 dark:bg-primary/10 p-3.5 rounded-panel border-0">
            <div className={cn("text-chip text-primary mb-1 flex items-center gap-1.5", locale === "bn" && "text-bangla")}>
              <HugeiconsIcon icon={SparklesIcon} size={14} />
              <span>{t("vocabulary.contextualMeaningLabel", locale)}:</span>
            </div>
            <p className={cn("text-meta text-foreground leading-relaxed", translationLocale === "bn" && "text-bangla")}>
              {translationLocale === "bn"
                ? entry.contextualMeaningBn
                : (entry.contextualMeaningEn || entry.contextualMeaningBn)}
            </p>
          </div>

          <div>
            <span className={cn("text-chip text-muted-foreground uppercase tracking-wider block mb-1", locale === "bn" && "text-bangla")}>
              {t("vocabulary.generalMeaningLabel", locale)}:
            </span>
            <p className={cn("text-meta text-muted-foreground", translationLocale === "bn" && "text-bangla")}>
              {translationLocale === "bn"
                ? entry.generalMeaningBn
                : (entry.generalMeaningEn || entry.generalMeaningBn)}
            </p>
          </div>

          {/* Example Sentence */}
          <div className="bg-muted/40 p-3.5 rounded-panel border-0">
            <span className="text-chip text-muted-foreground uppercase tracking-wider block mb-1">
              Example Sentence:
            </span>
            <p className="text-body text-foreground italic font-sans leading-relaxed">
              &ldquo;{entry.exampleSentence}&rdquo;
            </p>
          </div>

          {/* Word Forms if available */}
          {entry.wordForms && (
            <div className="pt-1">
              <span className="text-chip text-muted-foreground uppercase tracking-wider block mb-1.5">
                Word Forms:
              </span>
              <div className="flex flex-wrap gap-2 text-chip">
                {entry.wordForms.past && (
                  <WordFormBadge label={t("learning.past", locale)} value={entry.wordForms.past} />
                )}
                {entry.wordForms.pastParticiple && (
                  <WordFormBadge
                    label={t("learning.pastParticiple", locale)}
                    value={entry.wordForms.pastParticiple}
                  />
                )}
                {entry.wordForms.plural && (
                  <WordFormBadge label={t("learning.plural", locale)} value={entry.wordForms.plural} />
                )}
              </div>
            </div>
          )}

          {/* Synonyms if available */}
          {entry.synonyms && entry.synonyms.length > 0 && (
            <div className="pt-1">
              <span className="text-chip text-muted-foreground uppercase tracking-wider block mb-1.5">
                {locale === "bn" ? "বিকল্প শব্দ:" : "Synonyms:"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {entry.synonyms.map((syn, idx) => (
                  <span
                    key={idx}
                    className="text-chip px-2.5 py-1 rounded-pill bg-muted text-muted-foreground border-0"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3.5 border-t border-border flex items-center justify-between gap-3">
          <Button
            variant={isSaved ? "secondary" : "default"}
            size="sm"
            onClick={() => onSaveToggle(entry.lemma)}
            className="btn-press gap-2 font-bangla text-label rounded-control h-9"
          >
            {isSaved ? (
              <>
                <HugeiconsIcon icon={BookmarkCheck01Icon} size={16} className="text-success" />
                <span>{t("learning.saved", locale)}</span>
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Bookmark01Icon} size={16} />
                <span>{t("learning.saveWord", locale)}</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="btn-press text-label font-bangla rounded-control h-9"
          >
            বন্ধ করুন
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
