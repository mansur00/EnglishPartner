"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getQuizSessionResult } from "@/lib/quiz/storage";
import type { QuizSessionResult } from "@/lib/quiz/types";
import { useTranslations, useLiveTranslations } from "@/lib/i18n";
import { isRtlLanguage } from "@/lib/i18n/languages";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

export function QuizResultDetailClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const { locale, translationLocale } = useTranslations();
  const [result, setResult] = useState<QuizSessionResult | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState<"all" | "wrong" | "correct">("wrong");

  const needsLive = translationLocale !== "none" && translationLocale !== "bn";
  const liveTexts = useMemo(() => {
    if (!needsLive || !result) return [];
    const list: string[] = [];
    for (const q of result.questions) {
      if (q.prompt) list.push(q.prompt);
      if (q.explanation) list.push(q.explanation);
    }
    return list;
  }, [needsLive, result]);

  const { translations: liveMap } = useLiveTranslations(
    liveTexts,
    needsLive ? translationLocale : "none"
  );

  useEffect(() => {
    const found = sessionId ? getQuizSessionResult(sessionId) : null;
    queueMicrotask(() => {
      setResult(found);
      if (found && found.score === found.total) {
        setFilter("all");
      }
      setLoaded(true);
    });
  }, [sessionId]);

  if (!loaded) {
    return (
      <PageContainer className="py-6 pb-16">
        <Card className="p-6 bg-card text-center text-muted-foreground">
          {locale === "bn" ? "ফলাফল লোড হচ্ছে..." : "Loading quiz details..."}
        </Card>
      </PageContainer>
    );
  }

  if (!result) {
    return (
      <PageContainer className="py-6 space-y-4 pb-16">
        <Card className="p-6 bg-card text-center space-y-3">
          <h1 className="text-card-title text-foreground">
            {locale === "bn" ? "কুইজ ফলাফল পাওয়া যায়নি" : "Quiz Result Not Found"}
          </h1>
          <p className="text-body text-muted-foreground">
            {locale === "bn"
              ? "এই সেশনের বিস্তারিত তথ্য পাওয়া যায়নি। নতুন একটি কুইজ শুরু করুন।"
              : "This quiz session could not be found in your browser history."}
          </p>
          <div className="flex justify-center gap-2">
            <Link href="/quiz">
              <Button variant="cta">{locale === "bn" ? "কুইজ পেজে যান" : "Go to Quiz Page"}</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">{locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}</Button>
            </Link>
          </div>
        </Card>
      </PageContainer>
    );
  }

  const wrongCount = result.total - result.score;
  const backHref =
    result.kind === "level-assessment"
      ? "/dashboard/level-assessment"
      : result.scenarioSlug
      ? `/conversations/${result.scenarioSlug}`
      : "/quiz";

  const filteredQuestions = result.questions.filter((q) => {
    const isCorrect = result.answers[q.id] === q.correctIndex;
    if (filter === "wrong") return !isCorrect;
    if (filter === "correct") return isCorrect;
    return true;
  });

  return (
    <PageContainer className="py-6 space-y-6 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={backHref}>
          <Button variant="ghost" size="sm" className="gap-1.5 cursor-pointer">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            <span>
              {result.kind === "level-assessment"
                ? locale === "bn"
                  ? "লেভেল কুইজে ফিরুন"
                  : "Back to Level Assessment"
                : locale === "bn"
                ? "ফিরে যান"
                : "Back"}
            </span>
          </Button>
        </Link>

        <Link href={result.kind === "level-assessment" ? "/dashboard" : "/quiz"}>
          <Button variant="outline" size="sm" className="cursor-pointer">
            {result.kind === "level-assessment"
              ? locale === "bn"
                ? "ড্যাশবোর্ড"
                : "Dashboard"
              : locale === "bn"
              ? "সব কুইজ দেখুন"
              : "All Quizzes"}
          </Button>
        </Link>
      </div>

      {/* Score Overview Card */}
      <Card className="p-5 sm:p-6 bg-card border border-border space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" size="sm">
                {result.kind === "level-assessment"
                  ? locale === "bn"
                    ? "লেভেল যাচাই ফলাফল"
                    : "Level Assessment Report"
                  : locale === "bn"
                  ? "কথোপকথন কুইজ ফলাফল"
                  : "Conversation Quiz Report"}
              </Badge>
              {result.level && (
                <Badge variant="outline" size="sm" className="font-mono">
                  {result.level}
                </Badge>
              )}
              {result.estimatedLevel && (
                <Badge variant="brand" size="sm" className="font-mono">
                  Estimated: {result.estimatedLevel}
                </Badge>
              )}
            </div>
            <h1 className="text-page-title text-foreground">
              {locale === "bn" && result.titleBn ? result.titleBn : result.title}
            </h1>
          </div>

          <div className="text-right">
            <div className="text-hero-title text-primary font-mono">
              {result.score}/{result.total}
            </div>
            <div className="text-meta text-muted-foreground">
              {result.percentage}% • {wrongCount}{" "}
              {locale === "bn" ? "টি ভুল" : "wrong"}
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => setFilter("wrong")}
            className={cn(
              "px-3.5 py-1.5 rounded-control text-chip transition-colors cursor-pointer",
              filter === "wrong"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {locale === "bn" ? `ভুল উত্তর (${wrongCount})` : `Wrong Answers (${wrongCount})`}
          </button>
          <button
            type="button"
            onClick={() => setFilter("correct")}
            className={cn(
              "px-3.5 py-1.5 rounded-control text-chip transition-colors cursor-pointer",
              filter === "correct"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {locale === "bn" ? `সঠিক উত্তর (${result.score})` : `Correct (${result.score})`}
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-control text-chip transition-colors cursor-pointer",
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {locale === "bn" ? `সবগুলো (${result.total})` : `All Questions (${result.total})`}
          </button>
        </div>
      </Card>

      {/* Question-by-Question Review */}
      {filteredQuestions.length === 0 ? (
        <Card className="p-6 bg-card text-center text-body text-muted-foreground">
          {filter === "wrong"
            ? locale === "bn"
              ? "দারুণ! কোনো ভুল উত্তর নেই।"
              : "Awesome! You had zero wrong answers."
            : locale === "bn"
            ? "এই ফিল্টারে কোনো প্রশ্ন নেই।"
            : "No questions match this filter."}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const qNumber = result.questions.findIndex((item) => item.id === q.id) + 1;
            const userIdx = result.answers[q.id];
            const isCorrect = userIdx === q.correctIndex;

            return (
              <Card
                key={q.id}
                className={cn(
                  "p-5 bg-card border space-y-3",
                  isCorrect ? "border-border" : "border-destructive/40"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" size="sm" className="font-mono">
                        Q{qNumber}
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
                    <h2 className="text-card-title text-foreground">{q.prompt}</h2>
                    {translationLocale === "bn" && q.promptBn && (
                      <p className="text-meta text-muted-foreground text-bangla">
                        {q.promptBn}
                      </p>
                    )}
                    {needsLive && liveMap[q.prompt] && (
                      <p
                        dir={isRtlLanguage(translationLocale) ? "rtl" : "ltr"}
                        className="text-meta text-muted-foreground"
                      >
                        {liveMap[q.prompt]}
                      </p>
                    )}
                  </div>

                  {isCorrect ? (
                    <Badge variant="success" size="sm" className="gap-1 shrink-0">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                      <span>{locale === "bn" ? "সঠিক" : "Correct"}</span>
                    </Badge>
                  ) : (
                    <Badge variant="destructive" size="sm" className="gap-1 shrink-0">
                      <HugeiconsIcon icon={Cancel01Icon} size={14} />
                      <span>{locale === "bn" ? "ভুল" : "Wrong"}</span>
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {!isCorrect && (
                    <div className="p-3 rounded-control bg-destructive/10 border border-destructive/30 space-y-0.5">
                      <span className="text-chip text-destructive">
                        {locale === "bn" ? "আপনার উত্তর" : "Your Answer"}
                      </span>
                      <p className="text-body text-foreground">
                        {userIdx !== undefined ? q.options[userIdx] : "—"}
                      </p>
                    </div>
                  )}

                  <div
                    className={cn(
                      "p-3 rounded-control bg-success-bg border border-success/40 space-y-0.5",
                      isCorrect && "sm:col-span-2"
                    )}
                  >
                    <span className="text-chip text-success">
                      {locale === "bn" ? "সঠিক উত্তর" : "Right Answer"}
                    </span>
                    <p className="text-body text-foreground">
                      {q.options[q.correctIndex]}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-control bg-muted/40 border border-border/60 text-meta text-muted-foreground space-y-1">
                  <p className="text-foreground">{q.explanation}</p>
                  {translationLocale === "bn" && q.explanationBn && (
                    <p className="text-bangla">{q.explanationBn}</p>
                  )}
                  {needsLive && q.explanation && liveMap[q.explanation] && (
                    <p dir={isRtlLanguage(translationLocale) ? "rtl" : "ltr"}>
                      {liveMap[q.explanation]}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
