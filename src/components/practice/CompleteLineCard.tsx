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
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-ecp-border text-center space-y-4 shadow-2xs">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <HugeiconsIcon icon={SparklesIcon} size={28} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-ecp-text-primary font-bangla">
            শব্দ বসানোর অনুশীলন সম্পন্ন হয়েছে!
          </h3>
          <p className="text-xs sm:text-sm text-ecp-text-secondary mt-1 font-bangla">
            আপনি সফলভাবে বাক্যের শূন্যস্থানের সঠিক শব্দগুলো শনাক্ত করেছেন।
          </p>
        </div>

        <div className="pt-2">
          <Button onClick={handleRestart} variant="outline" className="font-bangla text-xs">
            পুনরায় অনুশীলন করুন
          </Button>
        </div>
      </div>
    );
  }

  const isCorrect = selectedWord === blank.correctAnswer;

  return (
    <div className="p-6 rounded-2xl bg-white border border-ecp-border space-y-5 shadow-2xs">
      {/* Header Counter */}
      <div className="flex items-center justify-between pb-3 border-b border-ecp-border text-xs">
        <span className="font-mono font-bold text-ecp-violet bg-ecp-violet-surface px-2.5 py-1 rounded-md">
          বাক্য {currentIndex + 1} / {exercises.length}
        </span>
        <span className="text-ecp-text-muted font-bangla">
          সঠিক শব্দটি নির্বাচন করে শূন্যস্থান পূরণ করুন
        </span>
      </div>

      {/* Masked Sentence Display */}
      <div className="p-5 rounded-2xl bg-ecp-bg-canvas border border-ecp-border space-y-2 text-center">
        <p className="text-lg sm:text-xl font-bold text-ecp-text-primary font-sans leading-relaxed">
          {currentItem.maskedSentence.split("___").map((part, idx, arr) => (
            <React.Fragment key={idx}>
              {part}
              {idx < arr.length - 1 && (
                <span
                  className={`inline-block min-w-16 px-2.5 py-0.5 mx-1 rounded-lg border font-mono text-base font-bold transition-all ${
                    selectedWord
                      ? hasChecked
                        ? isCorrect
                          ? "bg-emerald-100 text-emerald-800 border-emerald-400"
                          : "bg-rose-100 text-rose-800 border-rose-400"
                        : "bg-ecp-violet-surface text-ecp-violet border-ecp-violet"
                      : "bg-white border-dashed border-ecp-text-muted text-transparent"
                  }`}
                >
                  {selectedWord || "___"}
                </span>
              )}
            </React.Fragment>
          ))}
        </p>

        <p className="text-xs sm:text-sm font-bangla text-ecp-text-secondary pt-1">
          {currentItem.translationBn}
        </p>
      </div>

      {/* Word Options Chips */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-ecp-text-muted uppercase tracking-wider block">
          শব্দ বেছে নিন:
        </span>
        <div className="flex flex-wrap gap-2.5">
          {blank.options.map((word) => {
            const isSelected = selectedWord === word;
            let chipStyle =
              "bg-white border-ecp-border text-ecp-text-primary hover:border-ecp-violet hover:bg-ecp-violet-surface/20";

            if (isSelected) {
              if (hasChecked) {
                chipStyle = isCorrect
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-rose-600 text-white border-rose-600 shadow-xs";
              } else {
                chipStyle = "bg-ecp-violet text-white border-ecp-violet shadow-xs";
              }
            }

            return (
              <button
                key={word}
                type="button"
                disabled={hasChecked}
                onClick={() => handleSelectWord(word)}
                className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${chipStyle}`}
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
          className={`p-4 rounded-xl text-xs sm:text-sm font-bangla leading-relaxed border animate-in fade-in ${
            isCorrect
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          <div className="font-bold mb-1 flex items-center gap-1.5">
            <HugeiconsIcon
              icon={isCorrect ? CheckmarkCircle01Icon : Cancel01Icon}
              size={16}
              className={isCorrect ? "text-emerald-600" : "text-amber-600"}
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
            className="font-bangla text-xs"
          >
            উত্তর যাচাই করুন
          </Button>
        ) : (
          <Button onClick={handleNext} className="gap-1.5 font-bangla text-xs">
            <span>{currentIndex < exercises.length - 1 ? "পরবর্তী বাক্য" : "সমাপ্ত করুন"}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
