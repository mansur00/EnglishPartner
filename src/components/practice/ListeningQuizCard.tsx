"use client";

import React, { useState, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  VolumeHighIcon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  SparklesIcon,
  ArrowRight01Icon,
  ArrowReloadHorizontalIcon,
  HelpCircleIcon,
  StopIcon,
} from "@hugeicons/core-free-icons";
import type { ListeningQuizQuestion } from "@/content/seed/exercises";
import {
  evaluateQuizAnswer,
  calculateQuizScore,
  type QuizAnswerEvaluation,
} from "@/lib/practice/listening-quiz";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";

interface ListeningQuizCardProps {
  questions: ListeningQuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E"];

export function ListeningQuizCard({ questions, onComplete }: ListeningQuizCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<QuizAnswerEvaluation | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSlowAudio, setIsSlowAudio] = useState(false);

  const currentQ = questions[currentIndex];

  const playPromptAudio = useCallback(
    (text?: string, slowOverride?: boolean) => {
      if (!text) return;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        const useSlow = slowOverride !== undefined ? slowOverride : isSlowAudio;
        utterance.rate = useSlow ? 0.75 : 0.95;

        setIsPlayingAudio(true);
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);

        window.speechSynthesis.speak(utterance);
      }
    },
    [isSlowAudio]
  );

  const stopAudio = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, []);

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (evaluation || !currentQ) return; // Already answered
      setSelectedOptionId(optionId);
      const result = evaluateQuizAnswer(currentQ, optionId);
      setEvaluation(result);

      if (result.isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }
    },
    [evaluation, currentQ]
  );

  const handleSkip = useCallback(() => {
    if (evaluation || !currentQ) return;
    const result = evaluateQuizAnswer(currentQ, null);
    setEvaluation(result);
    setSkippedCount((prev) => prev + 1);
  }, [evaluation, currentQ]);

  const handleNext = useCallback(() => {
    stopAudio();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setEvaluation(null);
    } else {
      setIsFinished(true);
      const finalCorrect = correctCount + (evaluation?.isCorrect ? 1 : 0);
      onComplete?.(finalCorrect, questions.length);
    }
  }, [stopAudio, currentIndex, questions.length, correctCount, evaluation, onComplete]);

  const handleRestart = () => {
    stopAudio();
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setEvaluation(null);
    setCorrectCount(0);
    setSkippedCount(0);
    setIsFinished(false);
  };

  // Keyboard shortcut navigation (1-4 / A-D, Space to play, Enter for next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished || !currentQ) return;

      if (!evaluation) {
        // Option selection
        const key = e.key.toLowerCase();
        if (["1", "a"].includes(key) && currentQ.options[0]) {
          handleSelectOption(currentQ.options[0].id);
        } else if (["2", "b"].includes(key) && currentQ.options[1]) {
          handleSelectOption(currentQ.options[1].id);
        } else if (["3", "c"].includes(key) && currentQ.options[2]) {
          handleSelectOption(currentQ.options[2].id);
        } else if (["4", "d"].includes(key) && currentQ.options[3]) {
          handleSelectOption(currentQ.options[3].id);
        } else if (key === "s") {
          handleSkip();
        }
      } else {
        // Next on Enter
        if (e.key === "Enter") {
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [evaluation, isFinished, currentQ, handleSelectOption, handleSkip, handleNext]);

  if (!currentQ) return null;

  // Completion View
  if (isFinished) {
    const summary = calculateQuizScore(questions.length, correctCount, skippedCount);

    return (
      <Card className="p-6 sm:p-8 bg-card border border-border rounded-card text-center space-y-5 shadow-xs animate-in fade-in">
        <div className="p-3 mx-auto rounded-pill bg-primary/10 text-primary inline-flex items-center justify-center">
          <HugeiconsIcon icon={SparklesIcon} size={28} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <Pill
              variant={summary.rating === "perfect" ? "accent" : summary.rating === "proficient" ? "success" : "neutral"}
              size="sm"
            >
              {summary.ratingLabelEn}
            </Pill>
          </div>
          <h3 className="text-card-title-bn">
            কুইজ সম্পন্ন হয়েছে! ({summary.ratingLabelBn})
          </h3>
          <p className="text-meta text-muted-foreground mt-1">
            আপনার স্কোর:{" "}
            <span className="text-primary font-mono text-lead">
              {summary.correctCount} / {summary.totalQuestions}
            </span>{" "}
            ({summary.percentage}%)
          </p>
        </div>

        {/* Breakdown Tags */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
          <Tag variant="success" size="sm">
            সঠিক: {summary.correctCount}
          </Tag>
          {summary.incorrectCount > 0 && (
            <Tag variant="destructive" size="sm">
              ভুল: {summary.incorrectCount}
            </Tag>
          )}
          {summary.skippedCount > 0 && (
            <Tag variant="outline" size="sm">
              বাদ দেওয়া: {summary.skippedCount}
            </Tag>
          )}
        </div>

        <p className="text-meta text-muted-foreground text-bangla max-w-sm mx-auto leading-relaxed">
          {summary.rating === "perfect"
            ? "অসাধারণ! আপনি প্রতিটি ডায়লগের অর্থ নিখুঁতভাবে অনুধাবন করেছেন।"
            : summary.rating === "proficient"
            ? "চমৎকার অগ্রগতি! সামান্য কিছু জায়গা আরেকবার শুনলে পুরো আয়ত্তে চলে আসবে।"
            : "ভালো চেষ্টা! অডিও ডায়লগগুলো মনোযোগ দিয়ে কয়েকবার শুনে আবার অনুশীলন করুন।"}
        </p>

        <div className="pt-3 flex items-center justify-center gap-3">
          <Button
            onClick={handleRestart}
            variant="outline"
            size="default"
            className="rounded-control text-bangla gap-1.5"
          >
            <HugeiconsIcon icon={ArrowReloadHorizontalIcon} size={15} />
            <span>পুনরায় কুইজ দিন (Try Again)</span>
          </Button>
        </div>
      </Card>
    );
  }

  const hasAnswered = !!evaluation;

  return (
    <Card className="p-5 sm:p-6 bg-card border border-border rounded-card space-y-5 shadow-xs">
      {/* Top Bar: Progress, Slow Audio Switch, and Audio Trigger */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border flex-wrap">
        <div className="flex items-center gap-2">
          <Pill variant="neutral" size="sm" className="font-mono">
            প্রশ্ন {currentIndex + 1} / {questions.length}
          </Pill>

          {!hasAnswered && (
            <Button
              variant="ghost"
              size="xs"
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground text-chip rounded-control px-2"
              title="প্রশ্নটি বাদ দিতে ক্লিক করুন"
            >
              বাদ দিন (Skip)
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Slow Audio Toggle */}
          <button
            type="button"
            onClick={() => setIsSlowAudio((prev) => !prev)}
            className={cn(
              "text-chip px-2.5 py-1 rounded-control border transition-colors cursor-pointer",
              isSlowAudio
                ? "bg-primary/10 border-primary/30 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
            title="ধীরগতির অডিও গতি পরিবর্তন করুন"
          >
            {isSlowAudio ? "0.75x ধীর" : "1.0x স্বাভাবিক"}
          </button>

          {/* Audio Listen Button */}
          {currentQ.audioPrompt && (
            <Button
              variant={isPlayingAudio ? "default" : "secondary"}
              size="sm"
              onClick={() => {
                if (isPlayingAudio) {
                  stopAudio();
                } else {
                  playPromptAudio(currentQ.audioPrompt);
                }
              }}
              className="rounded-control gap-1.5 text-chip"
              title="প্রশ্নের ডায়লগ শুনুন"
            >
              <HugeiconsIcon
                icon={isPlayingAudio ? StopIcon : VolumeHighIcon}
                size={14}
              />
              <span>{isPlayingAudio ? "থামান" : "শুনুন (Listen)"}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Question Header */}
      <div className="space-y-1">
        <h4 className="text-lead text-foreground font-sans leading-snug">
          {currentQ.question}
        </h4>
        <p className="text-meta text-muted-foreground text-bangla">
          {currentQ.questionBn}
        </p>
      </div>

      {/* Options List */}
      <div className="space-y-2.5" role="radiogroup" aria-label="কুইজের সম্ভাব্য উত্তর">
        {currentQ.options.map((opt, optIdx) => {
          const isSelected = selectedOptionId === opt.id;
          const isKeyOption = opt.id === currentQ.correctOptionId;

          let optionStyle = "border-border bg-card text-foreground hover:border-primary/40";
          let tagVariant: "outline" | "success" | "destructive" | "secondary" = "outline";

          if (hasAnswered) {
            if (isKeyOption) {
              optionStyle = "border-success bg-success-bg text-foreground";
              tagVariant = "success";
            } else if (isSelected) {
              optionStyle = "border-destructive bg-destructive/10 text-destructive";
              tagVariant = "destructive";
            } else {
              optionStyle = "border-border bg-muted/40 text-muted-foreground opacity-60";
              tagVariant = "secondary";
            }
          } else if (isSelected) {
            optionStyle = "border-primary bg-primary/5 text-primary";
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={hasAnswered}
              onClick={() => handleSelectOption(opt.id)}
              role="radio"
              aria-checked={isSelected}
              className={cn(
                "w-full p-3.5 rounded-control border text-left flex items-center justify-between gap-3 transition-all cursor-pointer select-none",
                optionStyle
              )}
            >
              <div className="flex items-center gap-3">
                <Tag variant={tagVariant} size="sm" className="font-mono">
                  {OPTION_LETTERS[optIdx] || opt.id.toUpperCase()}
                </Tag>
                <div>
                  <span className="text-label font-sans block">
                    {opt.text}
                  </span>
                  {opt.textBn && (
                    <span className="text-chip text-bangla text-muted-foreground">
                      {opt.textBn}
                    </span>
                  )}
                </div>
              </div>

              {hasAnswered && isKeyOption && (
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} className="text-success shrink-0" />
              )}
              {hasAnswered && isSelected && !isKeyOption && (
                <HugeiconsIcon icon={Cancel01Icon} size={18} className="text-destructive shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback & Explanation Banner */}
      {hasAnswered && evaluation && (
        <div
          className={cn(
            "p-4 rounded-panel text-meta text-bangla leading-relaxed border space-y-1.5 animate-in fade-in",
            evaluation.isCorrect
              ? "bg-success-bg border-success/30 text-foreground"
              : evaluation.isSkipped
              ? "bg-muted/40 border-border text-muted-foreground"
              : "bg-warning-bg border-warning/30 text-foreground"
          )}
        >
          <div className="text-label flex items-center gap-1.5">
            <HugeiconsIcon
              icon={
                evaluation.isCorrect
                  ? CheckmarkCircle01Icon
                  : evaluation.isSkipped
                  ? HelpCircleIcon
                  : SparklesIcon
              }
              size={16}
              className={
                evaluation.isCorrect
                  ? "text-success"
                  : evaluation.isSkipped
                  ? "text-muted-foreground"
                  : "text-warning"
              }
            />
            <span>{evaluation.feedbackBn}</span>
          </div>
          <p className="text-meta text-foreground">{evaluation.explanationBn}</p>
        </div>
      )}

      {/* Next Question / Finish Action */}
      {hasAnswered && (
        <div className="pt-2 flex justify-end">
          <Button
            onClick={handleNext}
            variant="default"
            size="default"
            className="rounded-control text-bangla gap-1.5"
          >
            <span>{currentIndex < questions.length - 1 ? "পরবর্তী প্রশ্ন" : "ফলাফল দেখুন"}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </Button>
        </div>
      )}
    </Card>
  );
}
