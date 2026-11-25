"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { buildFallbackLevelAssessment } from "@/lib/quiz/level-assessment-bank";
import type { QuizQuestion } from "@/lib/quiz/types";
import { useTranslations } from "@/lib/i18n";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, SparklesIcon } from "@hugeicons/core-free-icons";

export default function LevelAssessmentPage() {
  const { locale } = useTranslations();
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    buildFallbackLevelAssessment(0)
  );
  const [source, setSource] = useState<"ai" | "hybrid" | "fallback">("fallback");
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [quizKey, setQuizKey] = useState(0);

  const fetchAiAssessment = useCallback(async () => {
    setIsRefreshing(true);
    const seed = Math.floor(Math.random() * 100000);
    try {
      const res = await fetch("/api/v1/ai/quiz/level-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.questions) && data.questions.length > 0) {
          setQuestions(data.questions);
          setSource(data.source === "ai" ? "ai" : "fallback");
          setQuizKey((k) => k + 1);
          return;
        }
      }
      setQuestions(buildFallbackLevelAssessment(seed));
      setSource("fallback");
    } catch {
      setQuestions(buildFallbackLevelAssessment(seed));
      setSource("fallback");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const seed = Math.floor(Math.random() * 100000);
    fetch("/api/v1/ai/quiz/level-assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data?.questions) && data.questions.length > 0) {
          setQuestions(data.questions);
          setSource(data.source === "ai" ? "ai" : "fallback");
          setQuizKey((k) => k + 1);
        } else {
          setQuestions(buildFallbackLevelAssessment(seed));
          setSource("fallback");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setQuestions(buildFallbackLevelAssessment(seed));
          setSource("fallback");
        }
      })
      .finally(() => {
        if (!cancelled) setIsRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageContainer className="py-6 sm:py-8 space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-1.5 cursor-pointer">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            <span>{locale === "bn" ? "ড্যাশবোর্ডে ফিরুন" : "Back to Dashboard"}</span>
          </Button>
        </Link>
        <Badge variant="brand" size="sm" className="gap-1">
          <HugeiconsIcon icon={SparklesIcon} size={13} />
          <span>
            {locale === "bn"
              ? "৪০টি প্রশ্ন • এআই লেভেল যাচাই"
              : "40 Questions • AI Level Assessment"}
          </span>
        </Badge>
      </div>

      <Card className="p-5 sm:p-6 bg-card border border-border space-y-1.5">
        <h1 className="text-page-title text-foreground">
          {locale === "bn"
            ? "ইংরেজি লেভেল যাচাই কুইজ (A1–C2)"
            : "English Level Assessment Quiz (A1–C2)"}
        </h1>
        <p className="text-body text-muted-foreground">
          {locale === "bn"
            ? "৪০টি প্রশ্নে আপনার বর্তমান CEFR দক্ষতা যাচাই করুন। একবার উত্তর দিলে পরিবর্তন করা যাবে না; রিফ্রেশ বাটনে চাপ দিলে এআই থেকে নতুন ৪০টি প্রশ্ন আসবে।"
            : "Test your CEFR proficiency across 40 questions. Answers lock once selected; tap Refresh anytime to generate 40 brand-new AI questions."}
        </p>
      </Card>

      <QuizRunner
        key={quizKey}
        kind="level-assessment"
        title="English Level Assessment (A1–C2)"
        titleBn="ইংরেজি লেভেল যাচাই কুইজ (A1–C2)"
        subtitle="40 AI-powered questions across A1 to C2 • 4 options each"
        subtitleBn="A1 থেকে C2 পর্যন্ত ৪০টি এআই প্রশ্ন • প্রতিটি প্রশ্নে ৪টি অপশন"
        questions={questions}
        source={source}
        isRefreshing={isRefreshing}
        onRefresh={fetchAiAssessment}
      />
    </PageContainer>
  );
}
