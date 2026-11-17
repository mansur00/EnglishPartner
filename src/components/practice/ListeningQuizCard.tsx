"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  VolumeHighIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  SparklesIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { ListeningQuizQuestion } from "@/content/seed/exercises";
import { Button } from "@/components/ui/button";

interface ListeningQuizCardProps {
  questions: ListeningQuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export function ListeningQuizCard({ questions, onComplete }: ListeningQuizCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const playPromptAudio = (text?: string) => {
    if (!text) return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return;
    setSelectedOptionId(optionId);
    setHasAnswered(true);

    if (optionId === currentQ.correctOptionId) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasAnswered(false);
    } else {
      setIsFinished(true);
      onComplete?.(score + (selectedOptionId === currentQ.correctOptionId ? 1 : 0), questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  if (!currentQ) return null;

  if (isFinished) {
    const finalScore = score;
    const isPerfect = finalScore === questions.length;

    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-ecp-border text-center space-y-4 shadow-2xs">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <HugeiconsIcon icon={SparklesIcon} size={28} />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-ecp-text-primary font-bangla">
            কুইজ সম্পন্ন হয়েছে! (Quiz Completed)
          </h3>
          <p className="text-sm text-ecp-text-secondary mt-1">
            আপনার স্কোর: <strong className="text-ecp-violet text-lg font-mono">{finalScore} / {questions.length}</strong>
          </p>
        </div>

        <p className="text-xs sm:text-sm text-ecp-text-muted font-bangla max-w-sm mx-auto">
          {isPerfect
            ? "অসাধারণ! আপনি প্রতিটি প্রশ্নের সঠিক উত্তর দিয়েছেন।"
            : "ভালো চেষ্টা! পুনরায় অনুশীলন করে পূর্ণাঙ্গ স্কোর অর্জন করতে পারেন।"}
        </p>

        <div className="pt-2">
          <Button onClick={handleRestart} variant="outline" className="font-bangla text-xs">
            পুনরায় কুইজ দিন (Try Again)
          </Button>
        </div>
      </div>
    );
  }

  const isCorrect = selectedOptionId === currentQ.correctOptionId;

  return (
    <div className="p-6 rounded-2xl bg-white border border-ecp-border space-y-5 shadow-2xs">
      {/* Progress & Audio Cue */}
      <div className="flex items-center justify-between pb-3 border-b border-ecp-border">
        <span className="text-xs font-mono font-semibold text-ecp-violet bg-ecp-violet-surface px-2.5 py-1 rounded-md">
          প্রশ্ন {currentIndex + 1} / {questions.length}
        </span>

        {currentQ.audioPrompt && (
          <button
            type="button"
            onClick={() => playPromptAudio(currentQ.audioPrompt)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-ecp-violet bg-ecp-violet-surface hover:bg-ecp-violet-surface/80 transition-colors cursor-pointer"
            title="প্রশ্নের ডায়লগ শুনুন"
          >
            <HugeiconsIcon icon={VolumeHighIcon} size={15} />
            <span>শুনুন (Listen)</span>
          </button>
        )}
      </div>

      {/* Question Text */}
      <div className="space-y-1">
        <h4 className="text-base sm:text-lg font-semibold text-ecp-text-primary font-sans leading-snug">
          {currentQ.question}
        </h4>
        <p className="text-xs sm:text-sm text-ecp-text-secondary font-bangla">
          {currentQ.questionBn}
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-2.5">
        {currentQ.options.map((opt) => {
          let btnStyle = "border-ecp-border bg-white text-ecp-text-primary hover:border-ecp-violet/40";

          if (hasAnswered) {
            if (opt.id === currentQ.correctOptionId) {
              btnStyle = "border-success bg-success/10 text-foreground font-semibold";
            } else if (opt.id === selectedOptionId) {
              btnStyle = "border-destructive bg-destructive/10 text-destructive";
            } else {
              btnStyle = "border-border bg-muted/40 text-muted-foreground opacity-60";
            }
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={hasAnswered}
              onClick={() => handleSelectOption(opt.id)}
              className={`w-full p-3.5 rounded-[12px] border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${btnStyle}`}
            >
              <div>
                <span className="font-semibold text-sm font-sans block">
                  {opt.text}
                </span>
                <span className="text-xs font-bangla text-ecp-text-secondary">
                  {opt.textBn}
                </span>
              </div>

              {hasAnswered && opt.id === currentQ.correctOptionId && (
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} className="text-emerald-600 shrink-0" />
              )}
              {hasAnswered && opt.id === selectedOptionId && opt.id !== currentQ.correctOptionId && (
                <HugeiconsIcon icon={Cancel01Icon} size={18} className="text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation & Feedback */}
      {hasAnswered && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-bangla leading-relaxed animate-in fade-in border ${
            isCorrect
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          <div className="font-semibold mb-1 flex items-center gap-1.5">
            <HugeiconsIcon
              icon={isCorrect ? CheckmarkCircle01Icon : SparklesIcon}
              size={16}
              className={isCorrect ? "text-emerald-600" : "text-amber-600"}
            />
            <span>{isCorrect ? "সঠিক উত্তর!" : "ব্যাখ্যা লক্ষ্য করুন:"}</span>
          </div>
          <p>{currentQ.explanationBn}</p>
        </div>
      )}

      {/* Next Question Action */}
      {hasAnswered && (
        <div className="pt-2 flex justify-end">
          <Button onClick={handleNext} className="gap-1.5 font-bangla text-xs">
            <span>{currentIndex < questions.length - 1 ? "পরবর্তী প্রশ্ন" : "ফলাফল দেখুন"}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}
