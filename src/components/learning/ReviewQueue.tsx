"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  VolumeHighIcon,
  SparklesIcon,
  ArrowRight01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  SRSRating,
  UserVocabularySRSItem,
} from "@/lib/srs/types";
import {
  calculateSM2,
  createDefaultSRSState,
  getDueReviewItems,
} from "@/lib/srs/sm2";
import {
  SEED_VOCABULARY,
} from "@/content/seed/vocabulary";
import type { VocabularyEntry } from "@/content/seed/vocabulary";
import { cn } from "@/lib/utils";

interface ReviewQueueProps {
  savedLemmas: string[];
  onReviewCompleted?: () => void;
}

const STORAGE_KEY = "ecp_vocabulary_srs";

export function ReviewQueue({ savedLemmas, onReviewCompleted }: ReviewQueueProps) {
  const [srsMap, setSrsMap] = useState<Record<string, UserVocabularySRSItem>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedSessionCount, setReviewedSessionCount] = useState(0);

  // Load and sync SRS data from localStorage
  useEffect(() => {
    let storedMap: Record<string, UserVocabularySRSItem> = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        storedMap = JSON.parse(raw);
      }
    } catch {
      // LocalStorage access issue
    }

    // Ensure every saved lemma has an SRS record
    const updatedMap: Record<string, UserVocabularySRSItem> = { ...storedMap };
    let hasChanges = false;
    const now = new Date();

    for (const lemma of savedLemmas) {
      if (!updatedMap[lemma]) {
        updatedMap[lemma] = {
          lemma,
          ...createDefaultSRSState(now),
        };
        hasChanges = true;
      }
    }

    if (hasChanges) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMap));
      } catch {
        // ignore
      }
    }

    queueMicrotask(() => {
      setSrsMap(updatedMap);
      setIsLoaded(true);
    });
  }, [savedLemmas]);

  // Compute due review items
  const dueItems = useMemo(() => {
    if (!isLoaded) return [];
    const allItems = Object.values(srsMap);
    return getDueReviewItems(allItems, new Date());
  }, [srsMap, isLoaded]);

  const currentSRSItem = dueItems[currentIndex];

  // Resolve vocabulary entry metadata
  const currentVocabEntry: VocabularyEntry | null = useMemo(() => {
    if (!currentSRSItem) return null;
    const lemma = currentSRSItem.lemma;
    const found =
      SEED_VOCABULARY[lemma] ||
      Object.values(SEED_VOCABULARY).find(
        (v) => v.lemma.toLowerCase() === lemma.toLowerCase()
      );

    if (found) return found;

    return {
      word: lemma.charAt(0).toUpperCase() + lemma.slice(1),
      lemma,
      ipa: `/${lemma}/`,
      partOfSpeech: "noun" as const,
      contextualMeaningBn: "সংরক্ষিত শব্দ",
      generalMeaningBn: "সংরক্ষিত শব্দ",
      exampleSentence: `Practice using "${lemma}" in your conversations.`,
      exampleSentenceBn: `কথোপকথনে "${lemma}" শব্দটি ব্যবহারের অনুশীলন করুন।`,
    };
  }, [currentSRSItem]);

  const handleSpeak = useCallback((text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleRating = useCallback(
    (rating: SRSRating) => {
      if (!currentSRSItem) return;

      const calcResult = calculateSM2({
        reviewStage: currentSRSItem.reviewStage,
        easeFactor: currentSRSItem.easeFactor,
        intervalDays: currentSRSItem.intervalDays,
        lapseCount: currentSRSItem.lapseCount,
        rating,
        now: new Date(),
      });

      const updatedItem: UserVocabularySRSItem = {
        lemma: currentSRSItem.lemma,
        ...calcResult,
      };

      const nextMap = {
        ...srsMap,
        [currentSRSItem.lemma]: updatedItem,
      };

      setSrsMap(nextMap);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMap));
      } catch {
        // ignore
      }

      setReviewedSessionCount((prev) => prev + 1);
      setIsFlipped(false);
      onReviewCompleted?.();

      // If at end of current due batch, keep index at 0 since dueItems recalculates
      if (currentIndex >= dueItems.length - 1) {
        setCurrentIndex(0);
      }
    },
    [currentSRSItem, srsMap, currentIndex, dueItems.length, onReviewCompleted]
  );

  if (!isLoaded) {
    return (
      <div className="card-practice p-8 text-center text-meta text-muted-foreground">
        রিভিউ কিউ লোড হচ্ছে...
      </div>
    );
  }

  // Empty state: Nothing due today per Spec §6.3
  if (dueItems.length === 0 || !currentVocabEntry) {
    return (
      <div className="card-practice-result space-y-4">
        <div className="badge-success-icon mx-auto">
          <HugeiconsIcon icon={SparklesIcon} size={28} />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-card-title text-foreground text-bangla">
            আজকে কোনো রিভিউ বাকি নেই (Nothing due today)
          </h3>
          <p className="text-meta-lead-bn text-muted-foreground max-w-md mx-auto">
            {reviewedSessionCount > 0
              ? `চমৎকার! আপনি এই সেশনে ${reviewedSessionCount}টি শব্দ সফলভাবে রিভিশন করেছেন। পরবর্তী রিভিউর সময় হলে শব্দগুলো আবার আসবে।`
              : "আপনার সংরক্ষিত শব্দগুলোর কোনোটিই আজ রিভিশনের জন্য নির্ধারিত নেই। নতুন শব্দ শিখতে কথোপকথন শুরু করুন!"}
          </p>
        </div>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
          <Link href="/explore">
            <Button variant="cta" size="md" className="rounded-control text-label text-bangla flex items-center gap-2">
              <span>নতুন কথোপকথন খুঁজুন (Explore)</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate interval hints for the 4 buttons
  const stage = currentSRSItem.reviewStage;
  const ease = currentSRSItem.easeFactor;
  const interval = currentSRSItem.intervalDays;

  const hardInterval = stage === 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
  const goodInterval = stage === 0 ? 1 : stage === 1 ? 6 : Math.round(interval * ease);
  const easyInterval = stage === 0 ? 2 : stage === 1 ? 7 : Math.round(interval * ease * 1.3);

  return (
    <div className="space-y-6">
      {/* Progress & Queue Header */}
      <div className="practice-header-row">
        <div className="flex items-center gap-2">
          <span className="text-chip-mono">
            {String(currentIndex + 1).padStart(2, "0")} / {String(dueItems.length).padStart(2, "0")}
          </span>
          <span className="inline-block w-1 h-1 rounded-pill bg-border" />
          <span className="text-chip text-primary text-bangla">
            দৈনিক ফ্ল্যাশকার্ড রিভিউ
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-chip-bn">
            পর্যায়: {currentSRSItem.reviewStage} / ৮
          </span>
          <Badge variant="outline" size="sm" className="font-mono text-chip">
            EF {currentSRSItem.easeFactor.toFixed(2)}
          </Badge>
        </div>
      </div>

      {/* Interactive Flashcard Container */}
      <div className="card-practice min-h-slot p-6 sm:p-8 flex flex-col justify-between transition-all">
        {/* Card Content Area */}
        <div className="space-y-6">
          {/* Top Row: Word & Listen Button */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-stat text-foreground tracking-tight">
                  {currentVocabEntry.word}
                </h2>
                <Badge variant="secondary" size="sm">
                  {currentVocabEntry.partOfSpeech}
                </Badge>
              </div>
              <p className="text-meta text-muted-foreground font-mono mt-1">
                {currentVocabEntry.ipa}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSpeak(currentVocabEntry.word)}
              className="p-2.5 rounded-control bg-card border border-border text-foreground hover:bg-muted/60 transition-all cursor-pointer shadow-2xs"
              title="উচ্চারণ শুনুন"
              aria-label={`Listen to ${currentVocabEntry.word}`}
            >
              <HugeiconsIcon icon={VolumeHighIcon} size={20} className="text-primary" />
            </button>
          </div>

          {/* Front / Back Conditional Reveal */}
          {!isFlipped ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-meta-lead-bn text-muted-foreground">
                শব্দটির প্রাসঙ্গিক অর্থ এবং ব্যবহার মনে করার চেষ্টা করুন...
              </p>
              <Button
                type="button"
                onClick={() => setIsFlipped(true)}
                variant="outline"
                size="md"
                className="rounded-control text-label text-bangla gap-2 cursor-pointer"
              >
                <HugeiconsIcon icon={ViewIcon} size={16} />
                <span>উত্তর দেখুন (Show Answer)</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-5 pt-2 border-t border-border animate-in fade-in duration-200">
              {/* Meaning Section */}
              <div className="space-y-1.5">
                <span className="text-chip-bn">
                  প্রাসঙ্গিক অর্থ (Meaning):
                </span>
                <p className="text-card-title-bn text-foreground">
                  {currentVocabEntry.contextualMeaningBn}
                </p>
                {currentVocabEntry.generalMeaningBn !== currentVocabEntry.contextualMeaningBn && (
                  <p className="text-meta-lead-bn text-muted-foreground">
                    সাধারণ অর্থ: {currentVocabEntry.generalMeaningBn}
                  </p>
                )}
              </div>

              {/* Example Sentence Section */}
              {currentVocabEntry.exampleSentence && (
                <div className="p-3.5 rounded-panel bg-muted/20 border border-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-chip-bn">
                      বাক্যে প্রয়োগ (Example Sentence):
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeak(currentVocabEntry.exampleSentence)}
                      className="text-chip text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <HugeiconsIcon icon={VolumeHighIcon} size={12} />
                      <span>Listen</span>
                    </button>
                  </div>
                  <p className="text-body text-foreground font-sans">
                    &ldquo;{currentVocabEntry.exampleSentence}&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rating Controls (Visible only after card is flipped) */}
        {isFlipped && (
          <div className="pt-6 border-t border-border space-y-2.5">
            <span className="text-chip-bn block text-center">
              শব্দটি মনে করা কতটা সহজ ছিল? (Rate your recall):
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Again: q=0 */}
              <button
                type="button"
                onClick={() => handleRating("again")}
                className={cn(
                  "p-2.5 rounded-control border text-center transition-all cursor-pointer shadow-2xs",
                  "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                )}
              >
                <div className="text-label text-bangla">আবার (Again)</div>
                <div className="text-chip opacity-80 font-mono mt-0.5">১ দিন</div>
              </button>

              {/* Hard: q=3 */}
              <button
                type="button"
                onClick={() => handleRating("hard")}
                className={cn(
                  "p-2.5 rounded-control border text-center transition-all cursor-pointer shadow-2xs",
                  "border-border bg-card text-foreground hover:bg-muted/60"
                )}
              >
                <div className="text-label text-bangla">কঠিন (Hard)</div>
                <div className="text-chip opacity-70 font-mono mt-0.5">
                  {hardInterval} দিন
                </div>
              </button>

              {/* Good: q=4 */}
              <button
                type="button"
                onClick={() => handleRating("good")}
                className={cn(
                  "p-2.5 rounded-control border text-center transition-all cursor-pointer shadow-2xs",
                  "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <div className="text-label text-bangla">ভালো (Good)</div>
                <div className="text-chip opacity-80 font-mono mt-0.5">
                  {goodInterval} দিন
                </div>
              </button>

              {/* Easy: q=5 */}
              <button
                type="button"
                onClick={() => handleRating("easy")}
                className={cn(
                  "p-2.5 rounded-control border text-center transition-all cursor-pointer shadow-2xs",
                  "border-success/40 bg-success-bg text-success hover:bg-success-bg/80"
                )}
              >
                <div className="text-label text-bangla">সহজ (Easy)</div>
                <div className="text-chip opacity-80 font-mono mt-0.5">
                  {easyInterval} দিন
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
