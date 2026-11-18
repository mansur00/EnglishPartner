"use client";

import React, { useState } from "react";
import { t } from "@/lib/i18n";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  VolumeHighIcon,
  Bookmark01Icon,
  BookmarkCheck01Icon,
  SparklesIcon,
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

interface WordDetailPopoverProps {
  entry: VocabularyEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveToggle: (wordKey: string) => void;
  isSaved?: boolean;
  grammarRole?: string;
}

export function WordDetailPopover({
  entry,
  isOpen,
  onClose,
  onSaveToggle,
  isSaved = false,
  grammarRole,
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
            {grammarRole && (
              <Badge variant="accent" size="sm" className="font-semibold text-xs">
                Role: {grammarRole}
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
            className="btn-press text-xs gap-1.5 h-8"
          >
            <HugeiconsIcon icon={VolumeHighIcon} size={15} />
            <span>উচ্চারণ শুনুন</span>
          </Button>
        </div>

        {/* Contextual Meaning */}
        <div className="space-y-3 my-2">
          <div className="bg-primary/5 dark:bg-primary/10 p-3.5 rounded-xl border border-primary/15">
            <div className="text-xs font-semibold text-primary font-[var(--ecp-font-bangla)] mb-1 flex items-center gap-1.5">
              <HugeiconsIcon icon={SparklesIcon} size={14} />
              <span>এই প্রসঙ্গের অর্থ (Contextual Meaning):</span>
            </div>
            <p className="text-sm font-[var(--ecp-font-bangla)] text-foreground leading-relaxed font-medium">
              {entry.contextualMeaningBn}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-muted-foreground font-[var(--ecp-font-bangla)] uppercase tracking-wider block mb-1">
              সাধারণ অর্থ (General Meaning):
            </span>
            <p className="text-sm font-[var(--ecp-font-bangla)] text-muted-foreground">
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
            className="btn-press gap-2 font-[var(--ecp-font-bangla)]"
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
            className="btn-press text-xs text-muted-foreground font-[var(--ecp-font-bangla)]"
          >
            বন্ধ করুন
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
