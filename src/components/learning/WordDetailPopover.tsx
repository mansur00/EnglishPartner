"use client";

import React, { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  VolumeHighIcon,
  Bookmark01Icon,
  BookmarkCheck01Icon,
  Cancel01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { VocabularyEntry } from "@/content/seed/vocabulary";
import { Badge } from "@/components/ui/Badge";

interface WordDetailPopoverProps {
  entry: VocabularyEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveToggle: (wordKey: string) => void;
  isSaved?: boolean;
}

export function WordDetailPopover({
  entry,
  isOpen,
  onClose,
  onSaveToggle,
  isSaved = false,
}: WordDetailPopoverProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !entry) return null;

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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="word-popover-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        role="document"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-ecp-border p-5 sm:p-6 text-left max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-start justify-between pb-3 border-b border-ecp-border">
          <div className="flex items-center gap-3 flex-wrap">
            <h3
              id="word-popover-title"
              className="text-2xl font-bold text-ecp-text-primary tracking-tight font-sans"
            >
              {entry.word}
            </h3>
            <Badge variant={posBadgeVariant(entry.partOfSpeech)} size="sm">
              {entry.partOfSpeech}
            </Badge>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন (Close)"
            className="p-1.5 rounded-lg text-ecp-text-muted hover:text-ecp-text-primary hover:bg-ecp-bg-canvas transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </div>

        {/* Pronunciation & Audio */}
        <div className="flex items-center gap-3 py-3">
          <span className="text-sm font-mono text-ecp-text-secondary bg-ecp-bg-canvas px-2.5 py-1 rounded-md border border-ecp-border">
            {entry.ipa}
          </span>
          <button
            type="button"
            onClick={playPronunciation}
            aria-label={`উচ্চারণ শুনুন: ${entry.word}`}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              isPlayingAudio
                ? "bg-ecp-violet text-white shadow-xs"
                : "bg-ecp-violet-surface text-ecp-violet hover:bg-ecp-violet-surface/80"
            }`}
          >
            <HugeiconsIcon icon={VolumeHighIcon} size={15} />
            <span>উচ্চারণ শুনুন</span>
          </button>
        </div>

        {/* Meaning in context */}
        <div className="space-y-3.5 my-2">
          <div className="bg-ecp-violet-surface/40 p-3.5 rounded-xl border border-ecp-violet/15">
            <div className="text-xs font-semibold text-ecp-violet font-bangla mb-1 flex items-center gap-1.5">
              <HugeiconsIcon icon={SparklesIcon} size={14} />
              <span>এই প্রসঙ্গের অর্থ (Contextual Meaning):</span>
            </div>
            <p className="text-sm font-bangla text-ecp-text-primary leading-relaxed font-medium">
              {entry.contextualMeaningBn}
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-ecp-text-muted font-bangla uppercase tracking-wider block mb-1">
              সাধারণ অর্থ (General Meaning):
            </span>
            <p className="text-sm font-bangla text-ecp-text-secondary">
              {entry.generalMeaningBn}
            </p>
          </div>

          {/* Example Sentence */}
          <div className="bg-ecp-bg-canvas p-3 rounded-xl border border-ecp-border">
            <span className="text-xs font-semibold text-ecp-text-muted uppercase tracking-wider block mb-1">
              Example Sentence:
            </span>
            <p className="text-sm text-ecp-text-primary italic font-sans leading-relaxed">
              &ldquo;{entry.exampleSentence}&rdquo;
            </p>
          </div>

          {/* Word Forms if available */}
          {entry.wordForms && (
            <div className="pt-1">
              <span className="text-xs font-semibold text-ecp-text-muted uppercase tracking-wider block mb-1.5">
                Word Forms:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {entry.wordForms.past && (
                  <span className="px-2.5 py-1 bg-ecp-bg-canvas border border-ecp-border rounded-md text-ecp-text-secondary">
                    <strong className="text-ecp-text-primary">Past:</strong> {entry.wordForms.past}
                  </span>
                )}
                {entry.wordForms.pastParticiple && (
                  <span className="px-2.5 py-1 bg-ecp-bg-canvas border border-ecp-border rounded-md text-ecp-text-secondary">
                    <strong className="text-ecp-text-primary">Past Participle:</strong> {entry.wordForms.pastParticiple}
                  </span>
                )}
                {entry.wordForms.plural && (
                  <span className="px-2.5 py-1 bg-ecp-bg-canvas border border-ecp-border rounded-md text-ecp-text-secondary">
                    <strong className="text-ecp-text-primary">Plural:</strong> {entry.wordForms.plural}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Synonyms if available */}
          {entry.synonyms && entry.synonyms.length > 0 && (
            <div className="pt-1">
              <span className="text-xs font-semibold text-ecp-text-muted uppercase tracking-wider block mb-1.5">
                Synonyms / বিকল্প শব্দ:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {entry.synonyms.map((syn, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 rounded-full bg-ecp-bg-canvas border border-ecp-border text-ecp-text-secondary"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-4 border-t border-ecp-border flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onSaveToggle(entry.lemma)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-xs cursor-pointer ${
              isSaved
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-ecp-violet text-white hover:bg-ecp-violet-hover"
            }`}
          >
            {isSaved ? (
              <>
                <HugeiconsIcon icon={BookmarkCheck01Icon} size={16} />
                <span className="font-bangla">সংরক্ষিত (Saved)</span>
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Bookmark01Icon} size={16} />
                <span className="font-bangla">নোটবুকে সেভ করুন (Save Word)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-xs text-ecp-text-muted hover:text-ecp-text-secondary font-bangla px-3 py-2 cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
