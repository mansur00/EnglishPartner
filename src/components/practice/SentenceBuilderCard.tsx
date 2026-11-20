"use client";

import React, { useState, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  Cancel01Icon,
  SparklesIcon,
  ArrowRight01Icon,
  RotateLeft01Icon,
  UndoIcon,
  VolumeHighIcon,
  HelpCircleIcon,
} from "@hugeicons/core-free-icons";
import { SentenceBuilderExercise } from "@/content/seed/exercises";
import { validateSentenceOrder } from "@/lib/practice/sentence-builder";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SentenceBuilderCardProps {
  exercises: SentenceBuilderExercise[];
  onComplete?: () => void;
}

interface PoolChunk {
  id: string;
  text: string;
  isPlaced: boolean;
}

/**
 * Normalizes a chunk for matching
 */
function normalizeChunk(text: string): string {
  return text.trim().toLowerCase().replace(/[.,?!]+$/, "");
}

interface QuestionViewProps {
  currentItem: SentenceBuilderExercise;
  currentIndex: number;
  totalCount: number;
  onNext: (firstAttemptCorrect: boolean) => void;
}

function SentenceBuilderQuestionView({
  currentItem,
  currentIndex,
  totalCount,
  onNext,
}: QuestionViewProps) {
  const [placedChunks, setPlacedChunks] = useState<PoolChunk[]>([]);
  const [availableChunks, setAvailableChunks] = useState<PoolChunk[]>(() => {
    const rawChunks = currentItem.chunks.map((text, idx) => ({
      id: `${currentItem.id}-chunk-${idx}-${text}`,
      text,
      isPlaced: false,
    }));

    return [...rawChunks].sort((a, b) => {
      const hashA = (a.text.charCodeAt(0) * 17 + a.text.length) % 7;
      const hashB = (b.text.charCodeAt(0) * 17 + b.text.length) % 7;
      return hashA - hashB;
    });
  });

  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [misplacedIndices, setMisplacedIndices] = useState<number[]>([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  const handlePlaceChunk = useCallback(
    (chunk: PoolChunk) => {
      if (chunk.isPlaced) return;

      setAvailableChunks((prev) =>
        prev.map((item) => (item.id === chunk.id ? { ...item, isPlaced: true } : item))
      );
      setPlacedChunks((prev) => [...prev, { ...chunk, isPlaced: true }]);

      if (hasChecked) {
        setHasChecked(false);
        setIsCorrect(false);
        setMisplacedIndices([]);
      }
    },
    [hasChecked]
  );

  const handleRemoveChunk = useCallback(
    (indexToRemove: number) => {
      const chunkToRemove = placedChunks[indexToRemove];
      if (!chunkToRemove) return;

      setPlacedChunks((prev) => prev.filter((_, idx) => idx !== indexToRemove));
      setAvailableChunks((prev) =>
        prev.map((item) => (item.id === chunkToRemove.id ? { ...item, isPlaced: false } : item))
      );

      if (hasChecked) {
        setHasChecked(false);
        setIsCorrect(false);
        setMisplacedIndices([]);
      }
    },
    [placedChunks, hasChecked]
  );

  const handleUndo = useCallback(() => {
    if (placedChunks.length === 0) return;
    handleRemoveChunk(placedChunks.length - 1);
  }, [placedChunks, handleRemoveChunk]);

  const handleReset = useCallback(() => {
    setPlacedChunks([]);
    setAvailableChunks((prev) => prev.map((item) => ({ ...item, isPlaced: false })));
    setHasChecked(false);
    setIsCorrect(false);
    setMisplacedIndices([]);
  }, []);

  const handleHint = useCallback(() => {
    if (isCorrect) return;

    setHintUsed(true);
    const targetOrder = currentItem.acceptedOrders[0] || currentItem.chunks;
    const nextSlotIndex = placedChunks.length;

    if (nextSlotIndex >= targetOrder.length) return;

    const nextNeededChunkText = targetOrder[nextSlotIndex];
    const normNeeded = normalizeChunk(nextNeededChunkText);

    const found = availableChunks.find(
      (c) => !c.isPlaced && normalizeChunk(c.text) === normNeeded
    );

    if (found) {
      handlePlaceChunk(found);
    }
  }, [isCorrect, currentItem, placedChunks, availableChunks, handlePlaceChunk]);

  const handleCheck = useCallback(() => {
    if (placedChunks.length === 0) return;

    setHasAttempted(true);
    const placedTexts = placedChunks.map((c) => c.text);
    const result = validateSentenceOrder(placedTexts, currentItem.acceptedOrders);

    setHasChecked(true);
    setIsCorrect(result.isCorrect);
    setMisplacedIndices(result.misplacedIndices);
  }, [placedChunks, currentItem]);

  const handleSpeak = useCallback((text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const allChunksPlaced = placedChunks.length === availableChunks.length && availableChunks.length > 0;
  const isFirstAttemptSuccess = isCorrect && !hasAttempted && !hintUsed;

  return (
    <div className="card-practice space-y-6">
      {/* Exercise Progress Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-chip text-muted-foreground font-mono">
            {String(currentIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
          </span>
          <span className="inline-block w-1 h-1 rounded-pill bg-border" />
          <span className="text-chip text-primary text-bangla">সেন্টেন্স বিল্ডার</span>
        </div>

        {/* Action Controls: Hint, Undo, Reset */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleHint}
            disabled={isCorrect || allChunksPlaced}
            title="পরবর্তী সঠিক শব্দের ইঙ্গিত নিন"
            className={cn(
              "px-2.5 py-1.5 rounded-control text-chip flex items-center gap-1 transition-all cursor-pointer",
              "border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60",
              "disabled:opacity-40 disabled:pointer-events-none"
            )}
          >
            <HugeiconsIcon icon={HelpCircleIcon} size={14} />
            <span className="text-bangla">ইঙ্গিত (Hint)</span>
          </button>

          <button
            type="button"
            onClick={handleUndo}
            disabled={placedChunks.length === 0 || isCorrect}
            title="সর্বশেষ বসানো শব্দ ফেরত নিন"
            className={cn(
              "p-1.5 rounded-control text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all cursor-pointer",
              "disabled:opacity-40 disabled:pointer-events-none"
            )}
            aria-label="Undo last chunk"
          >
            <HugeiconsIcon icon={UndoIcon} size={16} />
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={placedChunks.length === 0 || isCorrect}
            title="সবগুলো শব্দ রিসেট করুন"
            className={cn(
              "p-1.5 rounded-control text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all cursor-pointer",
              "disabled:opacity-40 disabled:pointer-events-none"
            )}
            aria-label="Reset all chunks"
          >
            <HugeiconsIcon icon={RotateLeft01Icon} size={16} />
          </button>
        </div>
      </div>

      {/* Target Meaning Prompt */}
      <div className="space-y-1.5">
        <span className="text-chip text-muted-foreground text-bangla">
          নিচের শব্দগুলো ছুঁয়ে সঠিক ইংরেজি বাক্যটি তৈরি করুন:
        </span>
        <h3 className="text-card-title text-foreground text-bangla leading-relaxed">
          &ldquo;{currentItem.promptBn || currentItem.translationBn}&rdquo;
        </h3>
      </div>

      {/* Assembled Sentence Workspace Slot */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-chip text-muted-foreground">
          <span>গঠিত বাক্য (Assembled Sentence):</span>
          {placedChunks.length > 0 && !hasChecked && (
            <span className="text-bangla">শব্দে ট্যাপ করে ফেরত পাঠাতে পারেন</span>
          )}
        </div>

        <div
          role="region"
          aria-label="Assembled sentence slot"
          className={cn(
            "min-h-slot p-3 rounded-panel border-2 border-dashed transition-all flex flex-wrap items-center gap-2",
            isCorrect
              ? "border-success/40 bg-success-bg/40"
              : hasChecked
              ? "border-destructive/30 bg-destructive/5"
              : placedChunks.length > 0
              ? "border-primary/30 bg-muted/20"
              : "border-border bg-muted/10 justify-center"
          )}
        >
          {placedChunks.length === 0 ? (
            <p className="text-meta text-muted-foreground select-none text-center text-bangla py-1">
              নিচ থেকে শব্দগুলো নির্বাচন করুন...
            </p>
          ) : (
            placedChunks.map((chunk, idx) => {
              const isMisplaced = hasChecked && !isCorrect && misplacedIndices.includes(idx);
              const isChunkCorrect = hasChecked && isCorrect;

              return (
                <button
                  key={`placed-${chunk.id}-${idx}`}
                  type="button"
                  onClick={() => !isCorrect && handleRemoveChunk(idx)}
                  disabled={isCorrect}
                  className={cn(
                    "px-3.5 py-2 rounded-control text-label transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs",
                    isChunkCorrect
                      ? "bg-success-bg text-success border border-success/40"
                      : isMisplaced
                      ? "bg-destructive/10 text-destructive border border-destructive/50 ring-1 ring-destructive/30"
                      : "bg-card border border-border text-foreground hover:border-primary/50 hover:bg-muted/50"
                  )}
                  title={isCorrect ? undefined : "ফেরত পাঠাতে ট্যাপ করুন"}
                >
                  <span>{chunk.text}</span>
                  {!isCorrect && (
                    <span className="text-chip text-muted-foreground opacity-60 ml-0.5">×</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Available Chunks Pool */}
      <div className="space-y-2">
        <span className="text-chip text-muted-foreground text-bangla">
          ব্যবহারযোগ্য শব্দাংশ (Word Pool):
        </span>
        <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-panel bg-muted/20 border border-border min-h-slot">
          {availableChunks.map((chunk) => (
            <button
              key={chunk.id}
              type="button"
              onClick={() => handlePlaceChunk(chunk)}
              disabled={chunk.isPlaced || isCorrect}
              className={cn(
                "px-4 py-2 rounded-control text-label transition-all cursor-pointer shadow-2xs select-none",
                chunk.isPlaced
                  ? "opacity-25 border border-dashed border-border bg-transparent pointer-events-none"
                  : "bg-card border border-border text-foreground hover:border-primary hover:bg-muted/60 active:scale-95"
              )}
            >
              {chunk.text}
            </button>
          ))}
        </div>
      </div>

      {/* Result & Feedback Box */}
      {hasChecked && (
        <div
          role="alert"
          className={cn(
            "p-4 rounded-panel border space-y-2.5 transition-all",
            isCorrect
              ? "bg-success-bg/60 border-success/30 text-success"
              : "bg-destructive/5 border-destructive/20 text-foreground"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={isCorrect ? CheckmarkCircle01Icon : Cancel01Icon}
                size={20}
                className={isCorrect ? "text-success" : "text-destructive"}
              />
              <span className="text-label text-bangla">
                {isCorrect ? "চমৎকার! বাক্যটি সঠিক হয়েছে।" : "সঠিক হয়নি, আরেকবার লক্ষ্য করুন।"}
              </span>
            </div>

            {/* Audio Button for Hearing Full Sentence */}
            <button
              type="button"
              onClick={() => handleSpeak(currentItem.fullSentence)}
              className="px-2.5 py-1 rounded-control bg-card border border-border text-foreground hover:bg-muted/60 text-chip flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="সম্পূর্ণ বাক্যটির অডিও শুনুন"
            >
              <HugeiconsIcon icon={VolumeHighIcon} size={14} className="text-primary" />
              <span>Listen</span>
            </button>
          </div>

          <p className="text-meta-lead-bn text-muted-foreground">
            {currentItem.explanationBn}
          </p>

          {!isCorrect && (
            <p className="text-chip text-destructive/80 text-bangla">
              টিপস: লাল চিহ্নিত শব্দের অবস্থান ভুল হতে পারে। শব্দ ছুঁয়ে পরিবর্তন করে পুনরায় পরখ করুন।
            </p>
          )}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        {!isCorrect ? (
          <Button
            onClick={handleCheck}
            disabled={placedChunks.length === 0}
            variant="cta"
            size="md"
            className="rounded-control text-label text-bangla cursor-pointer min-w-36"
          >
            <span>পরখ করুন (Check order)</span>
          </Button>
        ) : (
          <Button
            onClick={() => onNext(isFirstAttemptSuccess)}
            variant="default"
            size="md"
            className="rounded-control text-label text-bangla flex items-center gap-2 cursor-pointer"
          >
            <span>
              {currentIndex < totalCount - 1
                ? "পরবর্তী বাক্য (Next Sentence)"
                : "অনুশীলন সম্পন্ন করুন (Finish)"}
            </span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}

export function SentenceBuilderCard({ exercises, onComplete }: SentenceBuilderCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [firstAttemptCorrectCount, setFirstAttemptCorrectCount] = useState(0);

  const handleNextQuestion = useCallback(
    (wasFirstAttemptSuccess: boolean) => {
      if (wasFirstAttemptSuccess) {
        setFirstAttemptCorrectCount((prev) => prev + 1);
      }

      if (currentIndex < exercises.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
        onComplete?.();
      }
    },
    [currentIndex, exercises.length, onComplete]
  );

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setIsFinished(false);
    setFirstAttemptCorrectCount(0);
  }, []);

  if (exercises.length === 0) return null;

  if (isFinished) {
    return (
      <div className="card-practice-result space-y-4">
        <div className="badge-success-icon mx-auto">
          <HugeiconsIcon icon={SparklesIcon} size={28} />
        </div>
        <div className="space-y-1">
          <h3 className="text-card-title text-foreground text-bangla">
            অভিনন্দন! সেন্টেন্স বিল্ডার সম্পূর্ণ হয়েছে
          </h3>
          <p className="text-meta-lead-bn text-muted-foreground">
            আপনি সফলভাবে সবগুলো বাক্য সঠিকভাবে সাজিয়েছেন!
          </p>
          <div className="inline-block mt-2 px-3 py-1 rounded-pill bg-muted text-chip text-foreground font-mono">
            প্রথম চেষ্টায় সঠিক: {firstAttemptCorrectCount} / {exercises.length}
          </div>
        </div>
        <div className="pt-2">
          <Button
            onClick={handleRestart}
            variant="default"
            size="md"
            className="rounded-control text-label text-bangla"
          >
            আবার অনুশীলন করুন (Practice Again)
          </Button>
        </div>
      </div>
    );
  }

  const currentItem = exercises[currentIndex];
  if (!currentItem) return null;

  return (
    <SentenceBuilderQuestionView
      key={currentItem.id}
      currentItem={currentItem}
      currentIndex={currentIndex}
      totalCount={exercises.length}
      onNext={handleNextQuestion}
    />
  );
}
