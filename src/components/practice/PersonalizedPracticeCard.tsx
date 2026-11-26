"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  RefreshIcon,
  CheckmarkCircle02Icon,
  Alert01Icon,
  VolumeHighIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { speakText } from "@/lib/audio/speech-engine";
import { cn } from "@/lib/utils";
import {
  getFallbackPracticeSet,
  type ExerciseArea,
  type PersonalizedPracticeResponse,
  type PracticeFocusArea,
  type WeakAreaSummary,
} from "@/lib/practice/personalized-generator";

interface PersonalizedPracticeCardProps {
  locale: "en" | "bn";
  weakAreas: WeakAreaSummary[];
  weakWords: string[];
  onPracticeMinutesEarned: (minutes: number) => void;
}

const FOCUS_OPTIONS: { id: PracticeFocusArea; labelEn: string; labelBn: string }[] = [
  { id: "mixed", labelEn: "Auto (Weakest Mix)", labelBn: "অটো (দুর্বল মিক্স)" },
  { id: "tense", labelEn: "Tense", labelBn: "Tense" },
  { id: "preposition", labelEn: "Preposition", labelBn: "Preposition" },
  { id: "spelling", labelEn: "Spelling", labelBn: "Spelling" },
];

export function PersonalizedPracticeCard({
  locale,
  weakAreas,
  weakWords,
  onPracticeMinutesEarned,
}: PersonalizedPracticeCardProps) {
  const isBn = locale === "bn";
  const [focus, setFocus] = useState<PracticeFocusArea>("mixed");
  const [practiceSet, setPracticeSet] = useState<PersonalizedPracticeResponse>(() =>
    getFallbackPracticeSet("mixed", ["spelling", "tense", "preposition"])
  );
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const exercises = practiceSet.exercises;
  const activeQuestion = exercises[currentIndex] ?? exercises[0];

  const handleGenerate = async (nextFocus: PracticeFocusArea = focus) => {
    setFocus(nextFocus);
    setLoading(true);
    setCurrentIndex(0);
    setSelectedOption(null);
    setCorrectCount(0);
    setFinished(false);

    try {
      const res = await fetch("/api/v1/ai/personalized-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          focus: nextFocus,
          weakAreas: weakAreas.map((w) => w.area as ExerciseArea),
          weakWords,
          locale,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data: PersonalizedPracticeResponse = await res.json();
      setPracticeSet(data);
    } catch {
      setPracticeSet(
        getFallbackPracticeSet(
          nextFocus,
          weakAreas.map((w) => w.area)
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || !activeQuestion) return;
    setSelectedOption(idx);
    if (idx === activeQuestion.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= exercises.length) {
      setFinished(true);
      onPracticeMinutesEarned(3);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
    }
  };

  const areaBadgeVariant = (area: ExerciseArea): "brand" | "info" | "warning" => {
    if (area === "tense") return "info";
    if (area === "preposition") return "warning";
    return "brand";
  };

  return (
    <Card
      id="personalized-practice"
      className="p-5 sm:p-6 bg-card border border-border space-y-5 shadow-xs"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={SparklesIcon} size={18} />
          </div>
          <div>
            <h2 className="font-heading text-card-title text-foreground">
              {isBn ? "পার্সোনালাইজড প্র্যাকটিস জেনারেটর" : "Personalized Practice Generator"}
            </h2>
            <p className="text-meta text-muted-foreground">
              {isBn
                ? "আপনার দুর্বল দিক (Tense, Preposition, Spelling) ধরে স্বয়ংক্রিয় অনুশীলন"
                : "Auto-targeted exercises built from your weak areas (Tense, Preposition, Spelling)"}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="cta"
          size="sm"
          disabled={loading}
          onClick={() => handleGenerate(focus)}
          className="gap-2 shrink-0"
        >
          <HugeiconsIcon
            icon={loading ? RefreshIcon : SparklesIcon}
            size={15}
            className={cn(loading && "animate-spin")}
          />
          <span>
            {loading
              ? isBn
                ? "তৈরি হচ্ছে..."
                : "Generating..."
              : isBn
                ? "AI দিয়ে নতুন সেট বানান"
                : "Generate AI Set"}
          </span>
        </Button>
      </div>

      {/* Detected Weak Areas + Focus Selector (Single Row) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-chip font-semibold text-muted-foreground">
            {isBn ? "চিহ্নিত দুর্বল দিক:" : "Detected Focus:"}
          </span>
          {weakAreas.map((item) => (
            <Badge
              key={item.area}
              variant={
                item.severity === "high"
                  ? "error"
                  : item.severity === "medium"
                    ? "warning"
                    : "success"
              }
              size="sm"
              title={isBn ? item.reasonBn : item.reasonEn}
            >
              {isBn ? item.labelBn : item.labelEn}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {FOCUS_OPTIONS.map((opt) => (
            <Button
              key={opt.id}
              type="button"
              size="xs"
              variant={focus === opt.id ? "default" : "outline"}
              onClick={() => handleGenerate(opt.id)}
              disabled={loading}
            >
              {isBn ? opt.labelBn : opt.labelEn}
            </Button>
          ))}
        </div>
      </div>

      {/* Exercise Runner or Completion Summary */}
      {finished ? (
        <div className="rounded-panel bg-muted/35 border border-border/60 p-5 text-center space-y-3">
          <Badge variant="success" size="md">
            {isBn ? "সেশন সম্পন্ন!" : "Session Complete!"}
          </Badge>
          <h3 className="font-heading text-card-title text-foreground">
            {correctCount} / {exercises.length}{" "}
            {isBn ? "টি উত্তর সঠিক হয়েছে" : "Correct Answers"}
          </h3>
          <p className={cn("text-meta text-muted-foreground max-w-md mx-auto", isBn && "text-bangla")}>
            {isBn ? practiceSet.tipBn : practiceSet.tipEn}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <Button
              type="button"
              variant="cta"
              size="sm"
              onClick={() => handleGenerate(focus)}
              className="gap-1.5"
            >
              <HugeiconsIcon icon={SparklesIcon} size={15} />
              <span>{isBn ? "আরও একটি সেট করুন" : "Generate Another Set"}</span>
            </Button>
          </div>
        </div>
      ) : activeQuestion ? (
        <div className="rounded-panel bg-muted/30 border border-border/60 p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={areaBadgeVariant(activeQuestion.area)} size="sm">
                {activeQuestion.area.toUpperCase()}
              </Badge>
              <span className="text-chip text-muted-foreground">{activeQuestion.ruleTag}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => speakText(activeQuestion.prompt, { rate: 0.92 })}
                className="gap-1"
              >
                <HugeiconsIcon icon={VolumeHighIcon} size={14} />
                <span>{isBn ? "শুনুন" : "Listen"}</span>
              </Button>
              <Badge variant="outline" size="sm" className="font-mono">
                {currentIndex + 1} / {exercises.length}
              </Badge>
            </div>
          </div>

          <p className="text-lead font-semibold text-foreground">{activeQuestion.prompt}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeQuestion.options.map((opt, idx) => {
              const isPicked = selectedOption === idx;
              const isCorrect = idx === activeQuestion.correctIndex;
              const showResult = selectedOption !== null;

              return (
                <button
                  key={`${activeQuestion.id}-${idx}`}
                  type="button"
                  disabled={showResult}
                  onClick={() => handleSelectOption(idx)}
                  className={cn(
                    "p-3 rounded-control border text-left text-body transition-all flex items-center justify-between gap-2 cursor-pointer",
                    !showResult && "border-border bg-card hover:bg-muted/50",
                    showResult && isCorrect && "border-status-success-ink bg-status-success-bg text-status-success-ink",
                    showResult && isPicked && !isCorrect && "border-status-danger-ink bg-status-danger-bg text-status-danger-ink",
                    showResult && !isPicked && !isCorrect && "border-border bg-card opacity-60"
                  )}
                >
                  <span>{opt}</span>
                  {showResult && isCorrect && (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                  )}
                  {showResult && isPicked && !isCorrect && (
                    <HugeiconsIcon icon={Alert01Icon} size={16} />
                  )}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div className="rounded-control bg-card border border-border p-3.5 space-y-2">
              <p className={cn("text-meta text-foreground", isBn && "text-bangla")}>
                {isBn ? activeQuestion.explanationBn : activeQuestion.explanationEn}
              </p>
              <div className="flex justify-end">
                <Button type="button" size="sm" onClick={handleNext} className="gap-1.5">
                  <span>
                    {currentIndex + 1 >= exercises.length
                      ? isBn
                        ? "ফলাফল দেখুন"
                        : "Finish Set"
                      : isBn
                        ? "পরবর্তী প্রশ্ন"
                        : "Next Question"}
                  </span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </Card>
  );
}
