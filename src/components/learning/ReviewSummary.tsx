"use client";

import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  VolumeHighIcon,
  Bookmark01Icon,
  BookmarkCheck01Icon,
  ArrowRight01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { VocabularyEntry } from "@/content/seed/vocabulary";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";

interface ReviewSummaryProps {
  scenarioTitleEn: string;
  scenarioTitleBn: string;
  vocabularyList: VocabularyEntry[];
  onRestart: () => void;
  onBookmarkScenario: () => void;
  isScenarioBookmarked?: boolean;
  nextScenarioSlug?: string;
  nextScenarioTitle?: string;
  savedWords?: Set<string>;
  onSaveWordToggle?: (lemma: string) => void;
}

export function ReviewSummary({
  scenarioTitleEn,
  scenarioTitleBn,
  vocabularyList,
  onRestart,
  onBookmarkScenario,
  isScenarioBookmarked = false,
  nextScenarioSlug,
  nextScenarioTitle,
  savedWords = new Set(),
  onSaveWordToggle,
}: ReviewSummaryProps) {
  const locale = useLocale();

  const playWord = (word: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="mt-8 rounded-card bg-card p-6 sm:p-8 shadow-xs">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-3.5">
          <div className="size-tile rounded-control bg-success-bg text-success flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={SparklesIcon} size={24} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill text-chip text-success bg-success-bg border border-border mb-1">
              <span>{locale === "bn" ? "অভিনন্দন!" : "Well Done!"}</span>
            </div>
            <h3 className="text-card-title text-foreground">
              {locale === "bn"
                ? `আপনি ${scenarioTitleBn} কথোপকথনটি সম্পন্ন করেছেন`
                : `You completed dialogue practice for: ${scenarioTitleEn}`}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onBookmarkScenario}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-control text-label border transition-all cursor-pointer ${
            isScenarioBookmarked
              ? "bg-primary/10 text-primary border-primary/30"
              : "bg-muted text-muted-foreground border-border hover:bg-card"
          }`}
        >
          {isScenarioBookmarked ? (
            <>
              <HugeiconsIcon icon={BookmarkCheck01Icon} size={16} className="text-primary" />
              <span className="text-bangla">বুকমার্ক করা আছে</span>
            </>
          ) : (
            <>
              <HugeiconsIcon icon={Bookmark01Icon} size={16} />
              <span className="text-bangla">বুকমার্ক করুন</span>
            </>
          )}
        </button>
      </div>

      {/* Vocabulary Learned Checklist */}
      {vocabularyList && vocabularyList.length > 0 && (
        <div className="py-6">
          <h4 className="text-card-title text-foreground mb-3 text-bangla flex items-center gap-2">
            <span>এই পাঠের প্রয়োজনীয় শব্দভান্ডার ({vocabularyList.length}টি শব্দ)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vocabularyList.map((item) => {
              const isSaved = savedWords.has(item.lemma);
              return (
                <div
                  key={item.lemma}
                  className="p-3 rounded-panel bg-muted/40 border border-border flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-label text-foreground font-sans truncate">
                        {item.word}
                      </span>
                      <span className="text-chip font-mono text-muted-foreground">
                        {item.ipa}
                      </span>
                    </div>
                    <p className="text-meta text-muted-foreground text-bangla truncate mt-0.5">
                      {item.contextualMeaningBn}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => playWord(item.word)}
                      aria-label={`Listen to ${item.word}`}
                      className="p-1.5 rounded-control text-muted-foreground hover:text-primary hover:bg-card transition-colors cursor-pointer"
                    >
                      <HugeiconsIcon icon={VolumeHighIcon} size={16} />
                    </button>
                    {onSaveWordToggle && (
                      <button
                        type="button"
                        onClick={() => onSaveWordToggle(item.lemma)}
                        aria-label={`Save ${item.word}`}
                        className={`p-1.5 rounded-control transition-colors cursor-pointer ${
                          isSaved
                            ? "text-success bg-success-bg"
                            : "text-muted-foreground hover:text-primary hover:bg-card"
                        }`}
                      >
                        <HugeiconsIcon icon={isSaved ? BookmarkCheck01Icon : Bookmark01Icon} size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Navigation / Next Step */}
      <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-control border border-border text-label text-foreground hover:bg-muted transition-colors text-bangla cursor-pointer"
        >
          <HugeiconsIcon icon={RefreshIcon} size={16} />
          <span>{locale === "bn" ? "পুনরায় শুরু করুন" : "Practice Again"}</span>
        </button>

        {nextScenarioSlug ? (
          <Link href={`/conversations/${nextScenarioSlug}`} className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto justify-center gap-2 text-label rounded-control font-bangla"
            >
              <span>পরবর্তী কথোপকথন: {nextScenarioTitle || "Next"}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          </Link>
        ) : (
          <Link href="/explore" className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto justify-center gap-2 text-label rounded-control font-bangla"
            >
              <span>{locale === "bn" ? "আরও কথোপকথন খুঁজুন" : "Explore All"}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
