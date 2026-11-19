"use client";

import React, { useState } from "react";
import { t } from "@/lib/i18n";
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
  const posLabel = tokenData && tokenData.pos !== "unannotated" ? getLabel(tokenData.pos, "bn") : null;
  const subLabel = tokenData && tokenData.sub ? getLabel(tokenData.sub, "bn") : null;
  const roleLabel = tokenData && tokenData.role ? getLabel(tokenData.role, "bn") : null;

  const tenseKey =
    tokenData && tokenData.tenseTime && tokenData.tenseAspect
      ? `${tokenData.tenseTime}-${tokenData.tenseAspect}`
      : null;
  const tenseRule = tenseKey ? getRuleCard(tenseKey, "bn") : null;
  const tenseLabel = tenseKey ? getLabel(tenseKey, "bn") : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full sm:max-w-lg bg-card border-border p-5 sm:p-6 text-left max-h-[90vh] overflow-y-auto">
        {/* Header with Title, POS and Grammar Role */}
        <DialogHeader className="pb-3 border-b border-border text-left">
          <div className="flex items-center gap-2.5 flex-wrap">
            <DialogTitle className="text-2xl font-semibold text-foreground tracking-tight font-sans">
              {entry.word}
            </DialogTitle>
            <Badge variant={posBadgeVariant(entry.partOfSpeech)} size="sm" className="uppercase text-xs">
              {entry.partOfSpeech}
            </Badge>
            {(grammarRole || roleLabel) && (
              <Badge variant="accent" size="sm" className="font-semibold text-xs font-bangla">
                ভূমিকা: {roleLabel ? roleLabel.name : grammarRole}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Pronunciation & Audio */}
        <div className="flex items-center gap-3 py-2">
          <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border">
            {entry.ipa}
          </span>
          <Button
            variant={isPlayingAudio ? "default" : "secondary"}
            size="sm"
            onClick={playPronunciation}
            aria-label={`উচ্চারণ শুনুন: ${entry.word}`}
            className="btn-press text-xs gap-1.5 h-8 font-bangla"
          >
            <HugeiconsIcon icon={VolumeHighIcon} size={15} />
            <span>উচ্চারণ শুনুন</span>
          </Button>
        </div>

        {/* Enhanced Grammar Breakdown (when token data is available) */}
        {tokenData && (
          <div className="my-2 p-3.5 rounded-panel bg-primary/5 border border-primary/20 space-y-2">
            <div className="text-xs font-semibold text-primary font-bangla flex items-center gap-1.5">
              <HugeiconsIcon icon={BookOpen01Icon} size={14} />
              <span>ব্যাকরণগত বিশ্লেষণ (Grammar Breakdown):</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {posLabel && (
                <div className="p-2 rounded-control bg-card border border-border">
                  <span className="text-muted-foreground block font-bangla">পদ (POS):</span>
                  <span className="font-semibold text-foreground font-bangla">
                    {posLabel.name} {subLabel ? `(${subLabel.name})` : ""}
                  </span>
                </div>
              )}
              {roleLabel && (
                <div className="p-2 rounded-control bg-card border border-border">
                  <span className="text-muted-foreground block font-bangla">বাক্যের ভূমিকা (Role):</span>
                  <span className="font-semibold text-foreground font-bangla">{roleLabel.name}</span>
                </div>
              )}
              {tokenData.lemma && (
                <div className="p-2 rounded-control bg-card border border-border">
                  <span className="text-muted-foreground block font-bangla">মূল শব্দ (Lemma):</span>
                  <span className="font-mono font-medium text-foreground">{tokenData.lemma}</span>
                </div>
              )}
              {tenseLabel && (
                <div className="p-2 rounded-control bg-card border border-border">
                  <span className="text-muted-foreground block font-bangla">কাল (Tense):</span>
                  <span className="font-semibold text-foreground font-bangla">{tenseLabel.name}</span>
                </div>
              )}
            </div>

            {/* If tense formula available */}
            {tenseRule && (
              <div className="pt-1.5 border-t border-border/60 flex items-center justify-between text-xs">
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
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer font-bangla"
                  >
                    নিয়ম দেখুন →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Contextual Meaning */}
        <div className="space-y-3 my-2">
          <div className="bg-primary/5 dark:bg-primary/10 p-3.5 rounded-xl border border-primary/15">
            <div className="text-xs font-semibold text-primary font-bangla mb-1 flex items-center gap-1.5">
              <HugeiconsIcon icon={SparklesIcon} size={14} />
              <span>এই প্রসঙ্গের অর্থ (Contextual Meaning):</span>
            </div>
            <p className="text-sm font-bangla text-foreground leading-relaxed font-medium">
              {entry.contextualMeaningBn}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted-foreground font-bangla uppercase tracking-wider block mb-1">
              সাধারণ অর্থ (General Meaning):
            </span>
            <p className="text-sm font-bangla text-muted-foreground">
              {entry.generalMeaningBn}
            </p>
          </div>

          {/* Example Sentence */}
          <div className="bg-muted/40 p-3 rounded-xl border border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Example Sentence:
            </span>
            <p className="text-sm text-foreground italic font-sans leading-relaxed">
              &ldquo;{entry.exampleSentence}&rdquo;
            </p>
          </div>

          {/* Word Forms if available */}
          {entry.wordForms && (
            <div className="pt-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Word Forms:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {entry.wordForms.past && (
                  <span className="px-2.5 py-1 bg-muted/60 border border-border rounded-md text-muted-foreground">
                    <strong className="text-foreground">{t("learning.past")}:</strong> {entry.wordForms.past}
                  </span>
                )}
                {entry.wordForms.pastParticiple && (
                  <span className="px-2.5 py-1 bg-muted/60 border border-border rounded-md text-muted-foreground">
                    <strong className="text-foreground">{t("learning.pastParticiple")}:</strong> {entry.wordForms.pastParticiple}
                  </span>
                )}
                {entry.wordForms.plural && (
                  <span className="px-2.5 py-1 bg-muted/60 border border-border rounded-md text-muted-foreground">
                    <strong className="text-foreground">{t("learning.plural")}:</strong> {entry.wordForms.plural}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Synonyms if available */}
          {entry.synonyms && entry.synonyms.length > 0 && (
            <div className="pt-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Synonyms / বিকল্প শব্দ:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {entry.synonyms.map((syn, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-muted/60 border border-border text-muted-foreground"
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
            className="btn-press gap-2 font-bangla"
          >
            {isSaved ? (
              <>
                <HugeiconsIcon icon={BookmarkCheck01Icon} size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>{t("learning.saved")}</span>
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Bookmark01Icon} size={16} />
                <span>{t("learning.saveWord")}</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="btn-press text-xs text-muted-foreground font-bangla"
          >
            বন্ধ করুন
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
