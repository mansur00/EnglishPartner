"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/lib/i18n";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  RefreshIcon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  SparklesIcon,
  Analytics01Icon,
} from "@hugeicons/core-free-icons";
import {
  computeLevelBreakdown,
  estimateCefrLevelFromBreakdown,
  type QuizKind,
  type QuizQuestion,
  type QuizSessionResult,
} from "@/lib/quiz/types";
import { saveQuizSessionResult } from "@/lib/quiz/storage";
import type { CefrLevelCode, ConversationStyle } from "@/lib/content/length-tiers";

interface QuizRunnerProps {
  kind: QuizKind;
  title: string;
  titleBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  questions: QuizQuestion[];
  source: "ai" | "hybrid" | "fallback";
  isRefreshing?: boolean;
  onRefresh: () => void | Promise<void>;
  scenarioSlug?: string;
  level?: CefrLevelCode;
  lengthTierId?: string;
  lengthTierLabel?: string;
  style?: ConversationStyle;
  onClose?: () => void;
}

export function QuizRunner({
  kind,
  title,
  titleBn,
  subtitle,
  subtitleBn,
  questions,
  source,
  isRefreshing = false,
  onRefresh,
  scenarioSlug,
  level,
  lengthTierId,
  lengthTierLabel,
  style,
  onClose,
}: QuizRunnerProps) {
  const { locale } = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [completedResult, setCompletedResult] =
    useState<QuizSessionResult | null>(null);

  const total = questions.length;
  const currentQuestion = questions[currentIndex];
  const selectedOption = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;
  const isLocked = selectedOption !== undefined;
  const answeredCount = Object.keys(answers).length;
  const progressPct = total > 0 ? Math.round(((currentIndex + (isLocked ? 1 : 0)) / total) * 100) : 0;

  const handleSelectOption = (optionIdx: number) => {
    if (!currentQuestion || isLocked || isRefreshing) return;
    setAnswers((prev) => {
      if (prev[currentQuestion.id] !== undefined) return prev;
      return { ...prev, [currentQuestion.id]: optionIdx };
    });
  };

  const handleNextOrFinish = () => {
    if (!isLocked) return;
    if (currentIndex + 1 < total) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    let score = 0;
    for (const q of questions) {
      if (answers[q.id] === q.correctIndex) score += 1;
    }
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    const breakdown =
      kind === "level-assessment"
        ? computeLevelBreakdown(questions, answers)
        : undefined;
    const estimatedLevel = breakdown
      ? estimateCefrLevelFromBreakdown(breakdown)
      : undefined;

    const sessionId = `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const result: QuizSessionResult = {
      sessionId,
      kind,
      title,
      titleBn,
      scenarioSlug,
      level,
      lengthTierId,
      lengthTierLabel,
      style,
      questions,
      answers,
      score,
      total,
      percentage,
      estimatedLevel,
      levelBreakdown: breakdown,
      completedAt: new Date().toISOString(),
      source,
    };

    saveQuizSessionResult(result);
    setCompletedResult(result);
  };

  const handleRestartWithRefresh = async () => {
    setCurrentIndex(0);
    setAnswers({});
    setCompletedResult(null);
    await onRefresh();
  };

  if (total === 0) {
    return (
      <Card className="p-6 text-center space-y-3 bg-card">
        <p className="text-body text-muted-foreground">
          {locale === "bn"
            ? "কোনো প্রশ্ন লোড করা যায়নি। আবার চেষ্টা করুন।"
            : "No questions available right now. Please refresh."}
        </p>
        <Button onClick={handleRestartWithRefresh} disabled={isRefreshing} className="gap-2">
          <HugeiconsIcon icon={RefreshIcon} size={16} />
          <span>{locale === "bn" ? "রিফ্রেশ করুন" : "Refresh Questions"}</span>
        </Button>
      </Card>
    );
  }

  // Completed Summary View
  if (completedResult) {
    return (
      <div className="space-y-5">
        <Card className="p-5 sm:p-6 bg-card space-y-5 border border-border">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <Badge variant="brand" size="sm" className="gap-1">
                <HugeiconsIcon icon={SparklesIcon} size={13} />
                <span>
                  {kind === "level-assessment"
                    ? locale === "bn"
                      ? "লেভেল যাচাই সম্পন্ন"
                      : "Level Assessment Complete"
                    : locale === "bn"
                    ? "কুইজ সম্পন্ন"
                    : "Quiz Completed"}
                </span>
              </Badge>
              <h3 className="text-card-title text-foreground">
                {locale === "bn" && titleBn ? titleBn : title}
              </h3>
            </div>

            <div className="text-right">
              <div className="text-hero-title text-primary font-mono">
                {completedResult.score}/{completedResult.total}
              </div>
              <div className="text-chip text-muted-foreground">
                {completedResult.percentage}%{" "}
                {locale === "bn" ? "সঠিক" : "Accuracy"}
              </div>
            </div>
          </div>

          {kind === "level-assessment" && completedResult.estimatedLevel && (
            <div className="rounded-panel bg-primary/10 border border-primary/25 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-chip uppercase tracking-wider text-primary">
                  {locale === "bn" ? "আপনার আনুমানিক CEFR লেভেল" : "Estimated CEFR Level"}
                </span>
                <p className="text-meta text-muted-foreground">
                  {locale === "bn"
                    ? "এটি কেবল আপনার বর্তমান যাচাই ফলাফল; সেটিংস পরিবর্তন করা হয়নি।"
                    : "Diagnostic result only — your Settings target level was not modified."}
                </p>
              </div>
              <Badge variant="brand" size="md" className="text-card-title px-4 py-1.5 font-mono shrink-0">
                CEFR {completedResult.estimatedLevel}
              </Badge>
            </div>
          )}

          {completedResult.levelBreakdown && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(["A1", "A2", "B1", "B2", "C1", "C2"] as CefrLevelCode[]).map((lvl) => {
                const stat = completedResult.levelBreakdown?.[lvl];
                if (!stat || stat.total === 0) return null;
                return (
                  <div
                    key={lvl}
                    className="rounded-control bg-muted/50 border border-border p-2.5 text-center"
                  >
                    <div className="text-chip font-mono text-foreground">{lvl}</div>
                    <div className="text-label text-primary font-mono mt-0.5">
                      {stat.correct}/{stat.total}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={handleRestartWithRefresh}
              disabled={isRefreshing}
              className="gap-2 cursor-pointer"
            >
              <HugeiconsIcon
                icon={RefreshIcon}
                size={16}
                className={isRefreshing ? "animate-spin" : ""}
              />
              <span>
                {isRefreshing
                  ? locale === "bn"
                    ? "নতুন প্রশ্ন তৈরি হচ্ছে..."
                    : "Generating New Questions..."
                  : locale === "bn"
                  ? "রিফ্রেশ করে আবার শুরু করুন"
                  : "Refresh & Retake Quiz"}
              </span>
            </Button>

            <div className="flex items-center gap-2">
              {onClose && (
                <Button type="button" variant="ghost" onClick={onClose} className="cursor-pointer">
                  {locale === "bn" ? "বন্ধ করুন" : "Close"}
                </Button>
              )}
              <Link
                href={`/quiz/results?sessionId=${completedResult.sessionId}`}
                onClick={() => onClose?.()}
                className="w-full sm:w-auto"
              >
                <Button variant="cta" className="w-full sm:w-auto gap-2 cursor-pointer">
                  <HugeiconsIcon icon={Analytics01Icon} size={16} />
                  <span>
                    {locale === "bn" ? "বিস্তারিত স্কোর ও ভুল উত্তর দেখুন" : "View Score Details"}
                  </span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Bar: Title, Source Badge, Refresh Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={source === "ai" ? "brand" : "neutral"} size="sm" className="gap-1">
              <HugeiconsIcon icon={SparklesIcon} size={12} />
              <span>
                {source === "ai"
                  ? "AI Generated"
                  : source === "hybrid"
                  ? "Hybrid Quiz"
                  : "Practice Bank"}
              </span>
            </Badge>
            {currentQuestion?.cefrLevel && (
              <Badge variant="outline" size="sm" className="font-mono">
                {currentQuestion.cefrLevel}
              </Badge>
            )}
            {currentQuestion?.skillTag && (
              <Badge variant="neutral" size="sm">
                {currentQuestion.skillTag}
              </Badge>
            )}
          </div>
          {(subtitle || subtitleBn) && (
            <p className="text-meta text-muted-foreground">
              {locale === "bn" && subtitleBn ? subtitleBn : subtitle}
            </p>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRestartWithRefresh}
          disabled={isRefreshing}
          className="gap-1.5 cursor-pointer shrink-0"
        >
          <HugeiconsIcon
            icon={RefreshIcon}
            size={14}
            className={isRefreshing ? "animate-spin" : ""}
          />
          <span>
            {isRefreshing
              ? locale === "bn"
                ? "রিফ্রেশ হচ্ছে..."
                : "Refreshing..."
              : locale === "bn"
              ? "নতুন প্রশ্ন (Refresh)"
              : "Refresh Questions"}
          </span>
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-chip text-muted-foreground">
          <span>
            {locale === "bn"
              ? `প্রশ্ন ${currentIndex + 1} / ${total}`
              : `Question ${currentIndex + 1} of ${total}`}
          </span>
          <span className="font-mono">
            {answeredCount}/{total} {locale === "bn" ? "উত্তর দেওয়া হয়েছে" : "answered"}
          </span>
        </div>
        <div className="h-2 w-full rounded-pill bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-pill transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-5 sm:p-6 bg-card border border-border space-y-5">
        <div className="space-y-1.5">
          <h3 className="text-card-title text-foreground leading-snug">
            {currentQuestion.prompt}
          </h3>
          {locale === "bn" && currentQuestion.promptBn && (
            <p className="text-meta text-muted-foreground text-bangla">
              {currentQuestion.promptBn}
            </p>
          )}
        </div>

        {/* 4 Options (Locked once answered) */}
        <div className="grid grid-cols-1 gap-2.5">
          {currentQuestion.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correctIndex;
            const optionLetter = ["A", "B", "C", "D"][idx];

            let stateClass =
              "bg-background border-border text-foreground hover:bg-muted/60 hover:border-primary/40";
            if (isLocked) {
              if (isCorrect) {
                stateClass =
                  "bg-success-bg border-success text-foreground";
              } else if (isSelected && !isCorrect) {
                stateClass =
                  "bg-destructive/10 border-destructive text-foreground";
              } else {
                stateClass =
                  "bg-muted/30 border-border/60 text-muted-foreground opacity-75";
              }
            }

            return (
              <button
                key={`${currentQuestion.id}-opt-${idx}`}
                type="button"
                disabled={isLocked || isRefreshing}
                onClick={() => handleSelectOption(idx)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 p-3.5 rounded-control border text-left transition-all",
                  isLocked ? "cursor-default" : "cursor-pointer",
                  stateClass
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      "size-7 rounded-pill flex items-center justify-center text-chip font-mono shrink-0 border",
                      isLocked && isCorrect
                        ? "bg-success text-primary-foreground border-success"
                        : isLocked && isSelected && !isCorrect
                        ? "bg-destructive text-destructive-foreground border-destructive"
                        : "bg-muted text-foreground border-border"
                    )}
                  >
                    {optionLetter}
                  </span>
                  <span className="text-body leading-snug">{optionText}</span>
                </div>

                {isLocked && isCorrect && (
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={18}
                    className="text-success shrink-0"
                  />
                )}
                {isLocked && isSelected && !isCorrect && (
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={18}
                    className="text-destructive shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Locked Explanation + Next Button */}
        {isLocked && (
          <div className="pt-3 border-t border-border space-y-3">
            <div className="rounded-control bg-muted/45 border border-border/70 p-3 space-y-1">
              <div className="text-chip text-muted-foreground">
                {locale === "bn"
                  ? "উত্তর লক করা হয়েছে (পরিবর্তনযোগ্য নয়)"
                  : "Answer locked (cannot be changed)"}
              </div>
              <p className="text-meta text-foreground leading-relaxed">
                {locale === "bn" && currentQuestion.explanationBn
                  ? currentQuestion.explanationBn
                  : currentQuestion.explanation}
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="cta"
                onClick={handleNextOrFinish}
                className="gap-2 cursor-pointer"
              >
                <span>
                  {currentIndex + 1 < total
                    ? locale === "bn"
                      ? "পরবর্তী প্রশ্ন"
                      : "Next Question"
                    : locale === "bn"
                    ? "ফলাফল দেখুন"
                    : "Finish & See Score"}
                </span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
