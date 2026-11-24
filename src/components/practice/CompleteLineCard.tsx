"use client";

import React, { useState } from "react";
import { speakText } from "@/lib/audio/speech-engine";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  Cancel01Icon,
  SparklesIcon,
  ArrowRight01Icon,
  VolumeHighIcon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { CompleteLineExercise } from "@/content/seed/exercises";
import { useLocale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Pill } from "@/components/ui/pill";
import { validateBlankAnswer } from "@/lib/practice/complete-line";

interface CompleteLineCardProps {
  exercises: CompleteLineExercise[];
  onComplete?: () => void;
}

export function CompleteLineCard({ exercises, onComplete }: CompleteLineCardProps) {
  const locale = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = exercises[currentIndex];
  const blank = currentItem?.blanks[0];

  const playSentenceAudio = (text: string) => {
    speakText(text);
  };

  const handleSelectWord = (word: string) => {
    if (hasChecked) return;
    setSelectedWord(word);
  };

  const handleCheck = () => {
    if (!selectedWord || !blank) return;
    setHasChecked(true);
    const { isCorrect } = validateBlankAnswer(selectedWord, [blank.correctAnswer]);
    if (isCorrect) {
      playSentenceAudio(currentItem.fullSentence);
    }
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
      <div className="card-practice-result space-y-4">
        <div className="badge-success-icon">
          <HugeiconsIcon icon={SparklesIcon} size={28} />
        </div>

        <div>
          <h3 className="text-card-title-bn">
            শব্দ বসানোর অনুশীলন সম্পন্ন হয়েছে!
          </h3>
          <p className="text-meta text-muted-foreground mt-1 text-bangla">
            আপনি সফলভাবে বাক্যের শূন্যস্থানের সঠিক শব্দগুলো শনাক্ত করেছেন।
          </p>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleRestart}
            variant="outline"
            className="btn-restart-action"
          >
            <HugeiconsIcon icon={RefreshIcon} size={14} />
            <span>পুনরায় অনুশীলন করুন</span>
          </Button>
        </div>
      </div>
    );
  }

  const { isCorrect } = validateBlankAnswer(selectedWord || "", [blank.correctAnswer]);

  return (
    <div className="card-practice space-y-5">
      {/* Header Counter */}
      <div className="flex items-center justify-between pb-3 border-b border-border text-chip">
        <Pill variant="default" size="sm" className="font-mono">
          বাক্য {currentIndex + 1} / {exercises.length}
        </Pill>
        <span className="text-muted-foreground text-bangla">
          সঠিক শব্দটি নির্বাচন করে শূন্যস্থান পূরণ করুন
        </span>
      </div>

      {/* Masked Sentence Display */}
      <div className="p-5 rounded-panel bg-muted/40 border border-border space-y-3 text-center">
        <p className="text-card-title text-foreground font-sans leading-relaxed">
          {currentItem.maskedSentence.split("___").map((part, idx, arr) => (
            <React.Fragment key={idx}>
              {part}
              {idx < arr.length - 1 && (
                <span
                  className={`inline-block min-w-16 px-3 py-1 mx-1 rounded-control border font-mono text-label transition-all ${
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

        <p className="text-meta-bn">
          {currentItem.translationBn}
        </p>

        {hasChecked && (
          <div className="pt-1 flex justify-center">
            <button
              type="button"
              onClick={() => playSentenceAudio(currentItem.fullSentence)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-chip text-primary bg-primary/10 hover:bg-primary/15 transition-colors cursor-pointer"
            >
              <HugeiconsIcon icon={VolumeHighIcon} size={14} />
              <span className="text-bangla">
                {locale === "bn" ? "সম্পূর্ণ বাক্যটি শুনুন" : "Listen to Full Sentence"}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Word Options Chips via Design System Tag */}
      <div className="space-y-2.5">
        <span className="text-chip text-muted-foreground uppercase tracking-wider block">
          {locale === "bn" ? "শব্দ বেছে নিন:" : "Choose Word:"}
        </span>
        <div className="flex flex-wrap gap-2.5">
          {blank.options.map((word) => {
            const isSelected = selectedWord === word;
            let tagVariant: "brand" | "outline" | "success" | "destructive" = "outline";

            if (isSelected) {
              if (hasChecked) {
                tagVariant = isCorrect ? "success" : "destructive";
              } else {
                tagVariant = "brand";
              }
            }

            return (
              <Tag
                key={word}
                selected={isSelected}
                variant={tagVariant}
                size="default"
                onClick={() => handleSelectWord(word)}
                className="cursor-pointer text-label px-4 py-2 transition-all"
              >
                {word}
              </Tag>
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
          <Button onClick={handleNext} className="btn-nav-action">
            <span>{currentIndex < exercises.length - 1 ? "পরবর্তী বাক্য" : "সমাপ্ত করুন"}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
