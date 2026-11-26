"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, t } from "@/lib/i18n";
import { TodayPanel, CefrChip, type CefrLevel } from "@/components/shared";
import { ReviewQueue } from "@/components/learning/ReviewQueue";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  SparklesIcon,
  Clock01Icon,
  ArrowRight01Icon,
  Bookmark02Icon,
  TaskDone01Icon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { DailyChallengeInfo } from "@/lib/challenges/daily-challenge-service";

export function DailyPracticeClient() {
  const locale = useLocale();
  const [challenge, setChallenge] = useState<DailyChallengeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [savedLemmas, setSavedLemmas] = useState<string[]>([]);
  const [streak, setStreak] = useState(3);
  const [minutesCompleted, setMinutesCompleted] = useState(8);
  const [minutesGoal, setMinutesGoal] = useState(15);

  const todayDateStr = new Date().toISOString().split("T")[0];

  const formattedDate = new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  // Load daily challenge, streak, and saved vocabulary
  useEffect(() => {
    // 1. Goal & Streak from localStorage
    queueMicrotask(() => {
      try {
        const storedGoal = localStorage.getItem("ecp_daily_goal_mins");
        if (storedGoal) setMinutesGoal(parseInt(storedGoal, 10));

        const storedStreak = localStorage.getItem("ecp_streak_count");
        if (storedStreak) setStreak(parseInt(storedStreak, 10));

        const storedMins = localStorage.getItem("ecp_today_minutes");
        if (storedMins) setMinutesCompleted(parseInt(storedMins, 10));

        // 2. Saved words for SRS
        const vocabRaw = localStorage.getItem("ecp_saved_vocabulary");
        if (vocabRaw) {
          const parsed = JSON.parse(vocabRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedLemmas(parsed);
          }
        }

        // 3. Challenge completed state
        const completedKey = `ecp_daily_challenge_${todayDateStr}`;
        if (localStorage.getItem(completedKey) === "completed") {
          setIsCompleted(true);
        }
      } catch {
        // LocalStorage access fallback
      }
    });

    // 4. Fetch daily challenge from API
    async function fetchChallenge() {
      try {
        const targetLevel = localStorage.getItem("ecp_user_target_level") || "A1";
        const res = await fetch(`/api/v1/challenges/daily?date=${todayDateStr}&level=${targetLevel}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.challenge) {
            setChallenge(data.challenge);
            if (data.challenge.status === "completed") {
              setIsCompleted(true);
            }
          }
        }
      } catch {
        // Fallback handled gracefully
      } finally {
        setIsLoading(false);
      }
    }

    fetchChallenge();
  }, [todayDateStr]);

  const handleToggleCompletion = async () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);

    const completedKey = `ecp_daily_challenge_${todayDateStr}`;
    try {
      if (nextState) {
        localStorage.setItem(completedKey, "completed");
        const newMins = minutesCompleted + 5;
        setMinutesCompleted(newMins);
        localStorage.setItem("ecp_today_minutes", newMins.toString());

        if (challenge?.id) {
          await fetch("/api/v1/challenges/daily", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ challengeId: challenge.id }),
          });
        }
      } else {
        localStorage.removeItem(completedKey);
      }
    } catch {
      // Best-effort persistence
    }
  };

  const handleAddStarterWords = () => {
    const starter = ["reservation", "discount", "receipt", "recommendation", "appointment"];
    setSavedLemmas(starter);
    try {
      localStorage.setItem("ecp_saved_vocabulary", JSON.stringify(starter));
    } catch {
      // Best effort
    }
  };

  const scenarioTitle = locale === "bn"
    ? challenge?.scenarioTitleBn || challenge?.scenarioTitle || "সুপারমার্কেটে কেনাকাটা"
    : challenge?.scenarioTitle || "Shopping at the Supermarket";

  const scenarioDesc = locale === "bn"
    ? challenge?.scenarioDescriptionBn || challenge?.scenarioDescription || "দোকানে গিয়ে প্রয়োজনীয় পণ্য খোঁজা ও মূল্য জিজ্ঞাসা করার বাস্তব সংলাপ।"
    : challenge?.scenarioDescription || "Practical dialogue asking for grocery items, inquiring about prices, and cashier checkout.";

  const scenarioSlug = challenge?.scenarioSlug || "buying-groceries";
  const scenarioLevel = challenge?.scenarioLevel || "A1";

  const quickWorkoutsContent = (
    <>
      <h2 className="text-chip uppercase tracking-wider text-muted-foreground">
        {locale === "bn" ? "চলমান শেখার পথ" : "Continue Learning Path"}
      </h2>

      <Link
        href="/explore/category/shopping-and-money"
        className="group block p-4 rounded-card bg-muted/50 border border-border hover:border-primary/40 hover:bg-muted transition-all space-y-2.5 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="size-9 rounded-control bg-status-success-bg text-status-success-ink flex items-center justify-center">
            <HugeiconsIcon icon={TaskDone01Icon} size={18} />
          </div>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={18}
            className="text-muted-foreground group-hover:text-primary transition-colors"
          />
        </div>
        <div>
          <h3 className="font-heading text-label font-semibold text-foreground group-hover:text-primary transition-colors">
            {locale === "bn" ? "শপিং ল্যাডার (২০ ধাপ)" : "Shopping Ladder (20 Steps)"}
          </h3>
          <p className="text-chip text-muted-foreground mt-1">
            {locale === "bn"
              ? "দোকান, দামদর, ক্যাশিয়ার ও রিফান্ডের ধাপে ধাপে বাস্তব পরিস্থিতি আয়ত্ত করুন।"
              : "20 step-by-step sequential scenarios from basic shopping to returns & checkout."}
          </p>
        </div>
      </Link>
    </>
  );

  const dailyChallengeContent = (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={SparklesIcon} size={18} className="text-primary shrink-0" />
          <h2 className="text-chip uppercase tracking-wider text-muted-foreground">
            {t("dailyPractice.todayChallenge", locale)}
          </h2>
        </div>
        <Badge variant={isCompleted ? "success" : "secondary"} size="sm">
          {isCompleted
            ? t("dailyPractice.challengeStatusCompleted", locale)
            : t("dailyPractice.challengeStatusAssigned", locale)}
        </Badge>
      </div>

      {isLoading ? (
        <Card className="p-6 text-center bg-muted/40 border border-border">
          <div className="inline-block size-6 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2" />
          <p className="text-meta text-muted-foreground">{t("common.loading", locale)}</p>
        </Card>
      ) : (
        <div className="rounded-card bg-muted/40 border border-border p-4 space-y-4">
          {isCompleted && (
            <div className="flex items-center gap-2.5 p-3 rounded-panel bg-status-success-bg text-status-success-ink">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} className="shrink-0" />
              <p className="text-chip">{t("dailyPractice.completedBanner", locale)}</p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CefrChip level={scenarioLevel as CefrLevel} />
              <div className="flex items-center gap-1 text-chip text-muted-foreground">
                <HugeiconsIcon icon={Clock01Icon} size={14} />
                <span>{challenge?.estimatedMinutes || 6}m</span>
              </div>
              <span className="text-muted-foreground text-chip">•</span>
              <span className="text-chip text-muted-foreground">
                {challenge?.exchangesCount || 8} {locale === "bn" ? "সংলাপ" : "exchanges"}
              </span>
            </div>

            <h3 className="font-heading text-card-title leading-snug text-foreground">
              {scenarioTitle}
            </h3>
            <p className="text-meta text-muted-foreground leading-relaxed">
              {scenarioDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 text-chip text-muted-foreground pt-1">
            <span>1. {t("dailyPractice.listenStep", locale)}</span>
            <span>·</span>
            <span>2. {t("dailyPractice.speakStep", locale)}</span>
            <span>·</span>
            <span>3. {t("dailyPractice.quizStep", locale)}</span>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <Link
              href={`/conversations/${scenarioSlug}`}
              className={cn(buttonVariants({ size: "md" }), "w-full justify-center rounded-control font-semibold")}
            >
              <HugeiconsIcon icon={PlayIcon} size={16} />
              <span>{t("dailyPractice.startChallenge", locale)}</span>
            </Link>

            <Button
              variant={isCompleted ? "outline" : "secondary"}
              size="md"
              onClick={handleToggleCompletion}
              className="w-full justify-center rounded-control text-label"
            >
              <HugeiconsIcon
                icon={isCompleted ? CheckmarkCircle02Icon : TaskDone01Icon}
                size={16}
                className={cn(isCompleted && "text-status-success-ink")}
              />
              <span>
                {isCompleted
                  ? t("dailyPractice.challengeStatusCompleted", locale)
                  : t("dailyPractice.markCompleted", locale)}
              </span>
            </Button>
          </div>
        </div>
      )}
    </section>
  );

  return (
    <div className="w-full lg:pr-80 xl:pr-96">
      <div className="w-full px-4 sm:px-6 lg:px-9 py-6 pb-16 space-y-8">
      {/* 1. Unified Header & Today Panel Card */}
      <Card className="p-5 sm:p-6 bg-card border border-border shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-chip text-muted-foreground uppercase tracking-wider">
              <HugeiconsIcon icon={Calendar03Icon} size={16} className="text-primary shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <h1 className="font-heading text-page-title text-foreground">
              {t("dailyPractice.title", locale)}
            </h1>
            <p className="text-body text-muted-foreground max-w-2xl">
              {t("dailyPractice.subtitle", locale)}
            </p>
          </div>

          {/* Live Streak & Today Panel */}
          <TodayPanel
            variant="card"
            streak={streak}
            minutesCompleted={minutesCompleted}
            minutesGoal={minutesGoal}
            className="shrink-0 bg-muted/35 border border-border/60"
          />
        </div>
      </Card>

      {/* 2. Spaced Repetition (SRS) Review Section */}
      <Card className="p-5 sm:p-6 bg-card border border-border space-y-5 shadow-xs">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
          <div className="size-9 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={Bookmark02Icon} size={18} />
          </div>
          <div>
            <h2 className="font-heading text-card-title text-foreground">
              {t("dailyPractice.vocabularyReviewTitle", locale)}
            </h2>
            <p className="text-meta text-muted-foreground">
              {t("dailyPractice.vocabularyReviewSubtitle", locale)}
            </p>
          </div>
        </div>

        {savedLemmas.length > 0 ? (
          <ReviewQueue
            savedLemmas={savedLemmas}
            onReviewCompleted={() => {
              const updated = minutesCompleted + 2;
              setMinutesCompleted(updated);
              try {
                localStorage.setItem("ecp_today_minutes", updated.toString());
              } catch {
                // Best effort
              }
            }}
          />
        ) : (
          <div className="p-6 text-center rounded-panel bg-muted/30 border border-border/60 space-y-4">
            <div className="mx-auto size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <HugeiconsIcon icon={Bookmark02Icon} size={24} />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-heading text-card-title text-foreground">
                {t("dailyPractice.noWordsDue", locale)}
              </h3>
              <p className="text-body text-muted-foreground">
                {locale === "bn"
                  ? "কথোপকথন পড়ার সময় অজানা শব্দের উপর ট্যাপ করে আপনার খাতায় যোগ করুন, অথবা শুরু করার জন্য নমুনা শব্দ যোগ করুন।"
                  : "Tap on any highlighted vocabulary while practicing conversations to save it to your SRS queue, or add starter vocabulary."}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="secondary"
                size="default"
                onClick={handleAddStarterWords}
                className="rounded-control"
              >
                <HugeiconsIcon icon={SparklesIcon} size={16} />
                <span>{locale === "bn" ? "নমুনা শব্দ যোগ করুন" : "Add Starter Vocabulary"}</span>
              </Button>
              <Link
                href="/vocabulary"
                className={cn(buttonVariants({ variant: "outline", size: "default" }), "rounded-control")}
              >
                <span>{t("nav.vocabulary", locale)}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Link>
            </div>
          </div>
        )}
      </Card>

      {/* Mobile/Tablet Challenge & Quick Speaking Workouts */}
      <div className="lg:hidden space-y-6">
        {dailyChallengeContent}
        <section className="space-y-4">
          {quickWorkoutsContent}
        </section>
      </div>
      </div>

      {/* ================= FIXED RIGHT SIDEBAR ================= */}
      <aside className="hidden lg:flex flex-col fixed right-0 top-header h-below-header w-80 xl:w-96 border-l border-border bg-card z-sidebar overflow-y-auto p-4 space-y-6">
        {dailyChallengeContent}
        <div className="pt-4 border-t border-border space-y-3">
          {quickWorkoutsContent}
        </div>
      </aside>
    </div>
  );
}
