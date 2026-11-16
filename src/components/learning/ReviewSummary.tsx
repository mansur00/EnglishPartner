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
    <div className="mt-8 rounded-2xl bg-white border border-ecp-border p-6 sm:p-8 shadow-xs">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-ecp-border">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={SparklesIcon} size={24} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
              <span>অভিনন্দন! (Well Done)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-ecp-text-primary font-bangla">
              আপনি {scenarioTitleBn} কথোপকথনটি সম্পন্ন করেছেন
            </h3>
            <p className="text-xs sm:text-sm text-ecp-text-muted font-sans">
              Completed dialogue practice for: {scenarioTitleEn}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBookmarkScenario}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            isScenarioBookmarked
              ? "bg-ecp-violet-surface text-ecp-violet border-ecp-violet/30"
              : "bg-ecp-bg-canvas text-ecp-text-secondary border-ecp-border hover:bg-white"
          }`}
        >
          {isScenarioBookmarked ? (
            <>
              <HugeiconsIcon icon={BookmarkCheck01Icon} size={16} className="text-ecp-violet" />
              <span className="font-bangla">বুকমার্ক করা আছে</span>
            </>
          ) : (
            <>
              <HugeiconsIcon icon={Bookmark01Icon} size={16} />
              <span className="font-bangla">বুকমার্ক করুন</span>
            </>
          )}
        </button>
      </div>

      {/* Vocabulary Learned Checklist */}
      {vocabularyList && vocabularyList.length > 0 && (
        <div className="py-6">
          <h4 className="text-sm font-bold text-ecp-text-primary mb-3 font-bangla flex items-center gap-2">
            <span>এই পাঠের প্রয়োজনীয় শব্দভান্ডার ({vocabularyList.length}টি শব্দ)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vocabularyList.map((item) => {
              const isSaved = savedWords.has(item.lemma);
              return (
                <div
                  key={item.lemma}
                  className="p-3 rounded-xl bg-ecp-bg-canvas border border-ecp-border flex items-center justify-between gap-3 hover:border-ecp-violet/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ecp-text-primary text-sm font-sans truncate">
                        {item.word}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {item.ipa}
                      </span>
                    </div>
                    <p className="text-xs font-bangla text-ecp-text-secondary truncate mt-0.5">
                      {item.contextualMeaningBn}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => playWord(item.word)}
                      aria-label={`Listen to ${item.word}`}
                      className="p-1.5 rounded-lg text-ecp-text-muted hover:text-ecp-violet hover:bg-white transition-colors cursor-pointer"
                    >
                      <HugeiconsIcon icon={VolumeHighIcon} size={16} />
                    </button>
                    {onSaveWordToggle && (
                      <button
                        type="button"
                        onClick={() => onSaveWordToggle(item.lemma)}
                        aria-label={`Save ${item.word}`}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSaved
                            ? "text-emerald-600 bg-emerald-50"
                            : "text-ecp-text-muted hover:text-ecp-violet hover:bg-white"
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
      <div className="pt-4 border-t border-ecp-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-ecp-border text-xs sm:text-sm font-semibold text-ecp-text-primary hover:bg-ecp-bg-canvas transition-colors font-bangla cursor-pointer"
        >
          <HugeiconsIcon icon={RefreshIcon} size={16} />
          <span>পুনরায় শুরু করুন (Practice Again)</span>
        </button>

        {nextScenarioSlug ? (
          <Link href={`/conversations/${nextScenarioSlug}`} className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto justify-center gap-2 font-bangla"
            >
              <span>পরবর্তী কথোপকথন: {nextScenarioTitle || "Next"}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          </Link>
        ) : (
          <Link href="/explore" className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto justify-center gap-2 font-bangla"
            >
              <span>আরও কথোপকথন খুঁজুন (Explore All)</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
