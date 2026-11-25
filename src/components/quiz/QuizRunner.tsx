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
}: QuizRunnerProps) {
  const { locale } = useTranslations();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submittedResult, setSubmittedResult] =
    useState<QuizSessionResult | null>(null);

  const total = questions.length;
  const answeredCount = Object.keys(answers).length;
  const isSubmitted = submittedResult !== null;
  const progressPct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (isSubmitted || isRefreshing) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    if (isSubmitted || total === 0) return;

    let score = 0;
    for (const q of questions) {
      if (answers[q.id] === q.correctIndex) score += 1;
    }
    const percentage = Math.round((score / total) * 100);
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
    setSubmittedResult(result);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRestartWithRefresh = async () => {
    setAnswers({});
    setSubmittedResult(null);
    await onRefresh();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

  const scoreSidebarContent = submittedResult && (
    <div className="space-y-4">
      <div className="rounded-card border border-border bg-muted/25 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="brand" size="sm" className="gap-1">
            <HugeiconsIcon icon={SparklesIcon} size={12} />
            <span>
              {kind === "level-assessment"
                ? locale === "bn"
                  ? "লেভেল যাচাই স্কোর"
                  : "Assessment Score"
                : locale === "bn"
                ? "কুইজ স্কোর"
                : "Quiz Score"}
            </span>
          </Badge>
          <span className="text-chip font-mono text-muted-foreground">
            {submittedResult.percentage}%
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div className="text-hero-title text-primary font-mono">
            {submittedResult.score}/{submittedResult.total}
          </div>
          <div className="text-chip text-muted-foreground">
            {submittedResult.total - submittedResult.score}{" "}
            {locale === "bn" ? "টি ভুল" : "wrong"}
          </div>
        </div>

        <div className="h-2 w-full rounded-pill bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-pill transition-all"
            style={{ width: `${submittedResult.percentage}%` }}
          />
        </div>
      </div>

      {kind === "level-assessment" && submittedResult.estimatedLevel && (
        <div className="rounded-card border border-primary/25 bg-primary/10 p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-chip uppercase tracking-wider text-primary">
              {locale === "bn" ? "আনুমানিক CEFR লেভেল" : "Estimated Level"}
            </span>
            <Badge variant="brand" size="md" className="font-mono">
              CEFR {submittedResult.estimatedLevel}
            </Badge>
          </div>
          <p className="text-chip text-muted-foreground leading-snug">
            {locale === "bn"
              ? "এটি কেবল আপনার বর্তমান যাচাই ফলাফল; সেটিংস পরিবর্তন করা হয়নি।"
              : "Diagnostic only — your Settings target level was not modified."}
          </p>
        </div>
      )}

      {submittedResult.levelBreakdown && (
        <div className="rounded-card border border-border bg-muted/25 p-3.5 space-y-2">
          <span className="text-label text-foreground block">
            {locale === "bn" ? "লেভেল অনুযায়ী ফলাফল" : "Level Breakdown"}
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {(["A1", "A2", "B1", "B2", "C1", "C2"] as CefrLevelCode[]).map((lvl) => {
              const stat = submittedResult.levelBreakdown?.[lvl];
              if (!stat || stat.total === 0) return null;
              return (
                <div
                  key={lvl}
                  className="rounded-control bg-background border border-border/70 p-2 text-center"
                >
                  <div className="text-chip font-mono text-muted-foreground">{lvl}</div>
                  <div className="text-label text-primary font-mono">
                    {stat.correct}/{stat.total}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2 pt-1">
        <Link
          href={`/quiz/results?sessionId=${submittedResult.sessionId}`}
          className="block w-full"
        >
          <Button variant="cta" className="w-full gap-2 cursor-pointer">
            <HugeiconsIcon icon={Analytics01Icon} size={16} />
            <span>
              {locale === "bn" ? "বিস্তারিত স্কোর দেখুন" : "View Score Details"}
            </span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Button>
        </Link>

        <Button
          type="button"
          variant="outline"
          onClick={handleRestartWithRefresh}
          disabled={isRefreshing}
          className="w-full gap-2 cursor-pointer"
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
              ? "রিফ্রেশ করে আবার দিন"
              : "Refresh & Retake"}
          </span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-5", isSubmitted && "lg:pr-80 xl:pr-96")}>
      {/* Top Status & Refresh Bar */}
      <Card className="p-4 sm:p-5 bg-card border border-border space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 space-y-1">
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
              <Badge variant="outline" size="sm" className="font-mono">
                {total} {locale === "bn" ? "প্রশ্ন" : "Questions"}
              </Badge>
              {!isSubmitted && (
                <Badge variant="neutral" size="sm">
                  {locale === "bn"
                    ? "সাবমিটের আগে উত্তর পরিবর্তন করা যাবে"
                    : "You can change answers before submitting"}
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

        <div className="space-y-1">
          <div className="flex items-center justify-between text-chip text-muted-foreground">
            <span>
              {locale === "bn"
                ? `উত্তর দেওয়া হয়েছে: ${answeredCount} / ${total}`
                : `Answered: ${answeredCount} of ${total}`}
            </span>
            <span className="font-mono">{progressPct}%</span>
          </div>
          <div className="h-2 w-full rounded-pill bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-pill transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Mobile/Tablet Score Card after Submit (< lg) */}
      {isSubmitted && (
        <div className="lg:hidden">{scoreSidebarContent}</div>
      )}

      {/* All Questions Rendered Vertically on One Scrollable Page */}
      <div className="space-y-4">
        {questions.map((q, qIdx) => {
          const selectedOption = answers[q.id];
          const isCorrect = isSubmitted && selectedOption === q.correctIndex;
          const isWrong =
            isSubmitted &&
            selectedOption !== undefined &&
            selectedOption !== q.correctIndex;

          return (
            <Card
              key={q.id}
              className={cn(
                "p-5 sm:p-6 bg-card border space-y-4",
                isWrong
                  ? "border-destructive/50"
                  : isCorrect
                  ? "border-success/50"
                  : "border-border"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" size="sm" className="font-mono">
                      Q{qIdx + 1}
                    </Badge>
                    {q.cefrLevel && (
                      <Badge variant="neutral" size="sm" className="font-mono">
                        {q.cefrLevel}
                      </Badge>
                    )}
                    {q.skillTag && (
                      <Badge variant="neutral" size="sm">
                        {q.skillTag}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-card-title text-foreground leading-snug">
                    {q.prompt}
                  </h3>
                  {locale === "bn" && q.promptBn && (
                    <p className="text-meta text-muted-foreground text-bangla">
                      {q.promptBn}
                    </p>
                  )}
                </div>

                {isSubmitted && (
                  <Badge
                    variant={isCorrect ? "success" : "destructive"}
                    size="sm"
                    className="gap-1 shrink-0"
                  >
                    <HugeiconsIcon
                      icon={isCorrect ? CheckmarkCircle02Icon : Cancel01Icon}
                      size={14}
                    />
                    <span>
                      {isCorrect
                        ? locale === "bn"
                          ? "সঠিক"
                          : "Right"
                        : locale === "bn"
                        ? "ভুল"
                        : "Wrong"}
                    </span>
                  </Badge>
                )}
              </div>

              {/* 4 Options: Free to change before submit; reveals right/wrong after submit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((optionText, idx) => {
                  const isSelected = selectedOption === idx;
                  const isRightOption = idx === q.correctIndex;
                  const optionLetter = ["A", "B", "C", "D"][idx];

                  let stateClass = isSelected
                    ? "bg-primary/10 border-primary text-foreground shadow-2xs"
                    : "bg-background border-border text-foreground hover:bg-muted/60 hover:border-primary/40";

                  if (isSubmitted) {
                    if (isRightOption) {
                      stateClass = "bg-success-bg border-success text-foreground";
                    } else if (isSelected && !isRightOption) {
                      stateClass =
                        "bg-destructive/10 border-destructive text-foreground";
                    } else {
                      stateClass =
                        "bg-muted/30 border-border/60 text-muted-foreground opacity-75";
                    }
                  }

                  return (
                    <button
                      key={`${q.id}-opt-${idx}`}
                      type="button"
                      disabled={isSubmitted || isRefreshing}
                      onClick={() => handleSelectOption(q.id, idx)}
                      className={cn(
                        "w-full flex items-center justify-between gap-2.5 p-3 rounded-control border text-left transition-all",
                        isSubmitted ? "cursor-default" : "cursor-pointer",
                        stateClass
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={cn(
                            "size-7 rounded-pill flex items-center justify-center text-chip font-mono shrink-0 border",
                            isSubmitted && isRightOption
                              ? "bg-success text-primary-foreground border-success"
                              : isSubmitted && isSelected && !isRightOption
                              ? "bg-destructive text-destructive-foreground border-destructive"
                              : !isSubmitted && isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted text-foreground border-border"
                          )}
                        >
                          {optionLetter}
                        </span>
                        <span className="text-body leading-snug">{optionText}</span>
                      </div>

                      {isSubmitted && isRightOption && (
                        <HugeiconsIcon
                          icon={CheckmarkCircle02Icon}
                          size={18}
                          className="text-success shrink-0"
                        />
                      )}
                      {isSubmitted && isSelected && !isRightOption && (
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

              {/* Explanation shown ONLY after Submit */}
              {isSubmitted && (
                <div className="rounded-control bg-muted/45 border border-border/70 p-3 text-meta text-foreground leading-relaxed">
                  {locale === "bn" && q.explanationBn
                    ? q.explanationBn
                    : q.explanation}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Bottom Submit Action (Before Submit) */}
      {!isSubmitted && (
        <Card className="p-4 sm:p-5 bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-4 z-10 shadow-card">
          <div className="text-meta text-muted-foreground">
            {answeredCount < total
              ? locale === "bn"
                ? `আরও ${total - answeredCount}টি প্রশ্ন বাকি আছে (এখনো উত্তর পরিবর্তন করতে পারবেন)`
                : `${total - answeredCount} unanswered remaining — you can still change any option`
              : locale === "bn"
              ? "সব প্রশ্নের উত্তর দেওয়া হয়েছে! সাবমিট করে স্কোর দেখুন।"
              : "All questions answered! Submit to view your score and right/wrong answers."}
          </div>
          <Button
            type="button"
            variant="cta"
            size="md"
            disabled={answeredCount === 0 || isRefreshing}
            onClick={handleSubmitQuiz}
            className="w-full sm:w-auto gap-2 cursor-pointer"
          >
            <span>{locale === "bn" ? "কুইজ সাবমিট করুন" : "Submit Quiz"}</span>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Button>
        </Card>
      )}

      {/* Desktop Right Sidebar — Appears ONLY after Submit */}
      {isSubmitted && (
        <aside className="hidden lg:flex flex-col fixed right-0 top-header h-below-header w-80 xl:w-96 border-l border-border bg-card z-sidebar overflow-y-auto p-4">
          {scoreSidebarContent}
        </aside>
      )}
    </div>
  );
}
