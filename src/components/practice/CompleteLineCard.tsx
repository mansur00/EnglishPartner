"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  Cancel01Icon,
  SparklesIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { CompleteLineExercise } from "@/content/seed/exercises";
import { Button } from "@/components/ui/button";

interface CompleteLineCardProps {
  exercises: CompleteLineExercise[];
  onComplete?: () => void;
}

export function CompleteLineCard({ exercises, onComplete }: CompleteLineCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = exercises[currentIndex];
  const blank = currentItem?.blanks[0];

  const handleSelectWord = (word: string) => {
    if (hasChecked) return;
    setSelectedWord(word);
  };

  const handleCheck = () => {
    if (!selectedWord) return;
    setHasChecked(true);
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedWord(null);
      setHasChecked(false);
    } else {
      setIsFinished(true);
      onComplete?.();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedWord(null);
    setHasChecked(false);
    setIsFinished(false);
  };

  if (!currentItem || !blank) return null;

  if (isFinished) {
    return (
      <div className="p-6 sm:p-8 rounded-card bg-card border border-border text-center space-y-4 shadow-2xs">
        <div className="size-control rounded-control bg-success-bg text-success flex items-center justify-center mx-auto">
          <HugeiconsIcon icon={SparklesIcon} size={28} />
        </div>

        <div>
          <h3 className="text-card-title text-foreground text-bangla">
            শব্দ বসানোর অনুশীলন সম্পন্ন হয়েছে!
          </h3>
          <p className="text-meta text-muted-foreground mt-1 text-bangla">
            আপনি সফলভাবে বাক্যের শূন্যস্থানের সঠিক শব্দগুলো শনাক্ত করেছেন।
          </p>
        </div>

        <div className="pt-2">
          <Button onClick={handleRestart} variant="outline" className="text-bangla text-label rounded-control">
            পুনরায় অনুশীলন করুন
          </Button>
        </div>
      </div>
    );
  }

  const isCorrect = selectedWord === blank.correctAnswer;

  return (
    <div className="p-6 rounded-card bg-card border border-border space-y-5 shadow-2xs">
      {/* Header Counter */}
      <div className="flex items-center justify-between pb-3 border-b border-border text-chip">
        <span className="font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-control border border-primary/20">
          বাক্য {currentIndex + 1} / {exercises.length}
        </span>
        <span className="text-muted-foreground text-bangla">
          সঠিক শব্দটি নির্বাচন করে শূন্যস্থান পূরণ করুন
        </span>
      </div>

      {/* Masked Sentence Display */}
      <div className="p-5 rounded-panel bg-muted/40 border border-border space-y-2 text-center">
        <p className="text-card-title text-foreground font-sans leading-relaxed">
          {currentItem.maskedSentence.split("___").map((part, idx, arr) => (
            <React.Fragment key={idx}>
              {part}
              {idx < arr.length - 1 && (
                <span
                  className={`inline-block min-w-16 px-2.5 py-0.5 mx-1 rounded-control border font-mono text-label transition-all ${
                    selectedWord
                      ? hasChecked
                        ? isCorrect
                          ? "bg-success-bg text-success border-success/40"
                          : "bg-destructive/10 text-destructive border-destructive/40"
                        : "bg-primary/10 text-primary border-primary/30"
                      : "bg-card border-dashed border-border text-transparent"
                  }`}
                >
                  {selectedWord || "___"}
                </span>
              )}
            </React.Fragment>
          ))}
        </p>

        <p className="text-meta text-bangla text-muted-foreground pt-1">
          {currentItem.translationBn}
        </p>
      </div>

      {/* Word Options Chips */}
      <div className="space-y-2">
        <span className="text-chip text-muted-foreground uppercase tracking-wider block">
          শব্দ বেছে নিন:
        </span>
        <div className="flex flex-wrap gap-2.5">
          {blank.options.map((word) => {
            const isSelected = selectedWord === word;
            let chipStyle =
              "bg-card border-border text-foreground hover:border-primary/40 hover:bg-primary/5";

            if (isSelected) {
              if (hasChecked) {
                chipStyle = isCorrect
                  ? "bg-success-bg text-success border-success shadow-xs"
                  : "bg-destructive/10 text-destructive border-destructive shadow-xs";
              } else {
                chipStyle = "bg-primary text-primary-foreground border-primary shadow-xs";
              }
            }

            return (
              <button
                key={word}
                type="button"
                disabled={hasChecked}
                onClick={() => handleSelectWord(word)}
                className={`px-4 py-2 rounded-control border text-label transition-all cursor-pointer ${chipStyle}`}
              >
                {word}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation Banner */}
      {hasChecked && (
        <div
          className={`p-4 rounded-panel text-meta text-bangla leading-relaxed border animate-in fade-in ${
            isCorrect
              ? "bg-success-bg border-success/30 text-foreground"
              : "bg-warning-bg border-warning/30 text-foreground"
          }`}
        >
          <div className="text-label mb-1 flex items-center gap-1.5">
            <HugeiconsIcon
              icon={isCorrect ? CheckmarkCircle01Icon : Cancel01Icon}
              size={16}
              className={isCorrect ? "text-success" : "text-warning"}
            />
            <span>{isCorrect ? "চমৎকার! সঠিক হয়েছে।" : "সঠিক উত্তর নয়"}</span>
          </div>
          <p>{currentItem.explanationBn}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 flex justify-end gap-2.5">
        {!hasChecked ? (
          <Button
            onClick={handleCheck}
            disabled={!selectedWord}
            className="text-bangla text-label rounded-control"
          >
            উত্তর যাচাই করুন
          </Button>
        ) : (
          <Button onClick={handleNext} className="gap-1.5 text-bangla text-label rounded-control">
            <span>{currentIndex < exercises.length - 1 ? "পরবর্তী বাক্য" : "সমাপ্ত করুন"}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
