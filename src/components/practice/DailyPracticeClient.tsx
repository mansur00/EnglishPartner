"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, t } from "@/lib/i18n";
import { PageContainer, TodayPanel, CefrChip, type CefrLevel } from "@/components/shared";
import { ReviewQueue } from "@/components/learning/ReviewQueue";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  HeadphonesIcon,
  BotIcon,
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

  return (
    <PageContainer className="py-6 sm:py-8 space-y-8 max-w-5xl">
      {/* 1. Header Banner & Date */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
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
          className="shrink-0"
        />
      </div>

      {/* 2. Today's Conversation Challenge */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={SparklesIcon} size={20} className="text-primary" />
            <h2 className="font-heading text-card-title text-foreground">
              {t("dailyPractice.todayChallenge", locale)}
            </h2>
          </div>
          <Badge variant={isCompleted ? "success" : "secondary"}>
            {isCompleted
              ? t("dailyPractice.challengeStatusCompleted", locale)
              : t("dailyPractice.challengeStatusAssigned", locale)}
          </Badge>
        </div>

        {isLoading ? (
          <Card className="p-8 text-center bg-card">
            <div className="inline-block size-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2" />
            <p className="text-meta text-muted-foreground">{t("common.loading", locale)}</p>
          </Card>
        ) : (
          <div className="relative rounded-card overflow-hidden bg-card p-6 md:p-8 space-y-6 shadow-card">
            {/* Completion Banner if done */}
            {isCompleted && (
              <div className="flex items-center gap-3 p-4 rounded-panel bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} className="shrink-0" />
                <p className="text-label">
                  {t("dailyPractice.completedBanner", locale)}
                </p>
              </div>
            )}

            {/* Scenario Meta */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <CefrChip level={scenarioLevel as CefrLevel} />
                <div className="flex items-center gap-1.5 text-chip text-muted-foreground">
                  <HugeiconsIcon icon={Clock01Icon} size={15} />
                  <span>{challenge?.estimatedMinutes || 6}m</span>
                </div>
                <span className="text-muted-foreground text-chip">•</span>
                <span className="text-chip text-muted-foreground">
                  {challenge?.exchangesCount || 8} {locale === "bn" ? "সংলাপ" : "exchanges"}
                </span>
              </div>

              <h3 className="font-heading text-page-title leading-snug text-foreground">
                {scenarioTitle}
              </h3>
              <p className="text-body text-muted-foreground max-w-3xl leading-relaxed">
                {scenarioDesc}
              </p>
            </div>

            {/* 3 Steps to Fluency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
              {/* Step 1: Listen */}
              <Link
                href={`/conversations/${scenarioSlug}`}
                className="group p-4 rounded-panel bg-muted/60 hover:bg-muted transition-colors flex flex-col justify-between space-y-3 cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="size-9 rounded-control bg-primary/10 text-primary flex items-center justify-center">
                    <HugeiconsIcon icon={HeadphonesIcon} size={18} />
                  </div>
                  <h4 className="font-heading text-card-title text-foreground group-hover:text-primary transition-colors">
                    {t("dailyPractice.listenStep", locale)}
                  </h4>
                  <p className="text-meta text-muted-foreground">
                    {t("dailyPractice.listenStepDesc", locale)}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-chip text-primary">
                  <span>{locale === "bn" ? "শুনুন" : "Listen"}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </div>
              </Link>

              {/* Step 2: Speak */}
              <Link
                href={`/conversations/${scenarioSlug}?mode=practice`}
                className="group p-4 rounded-panel bg-muted/60 hover:bg-muted transition-colors flex flex-col justify-between space-y-3 cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="size-9 rounded-control bg-primary/10 text-primary flex items-center justify-center">
                    <HugeiconsIcon icon={BotIcon} size={18} />
                  </div>
                  <h4 className="font-heading text-card-title text-foreground group-hover:text-primary transition-colors">
                    {t("dailyPractice.speakStep", locale)}
                  </h4>
                  <p className="text-meta text-muted-foreground">
                    {t("dailyPractice.speakStepDesc", locale)}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-chip text-primary">
                  <span>{locale === "bn" ? "কথা বলুন" : "Speak"}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </div>
              </Link>

              {/* Step 3: Sentence builder / Quiz */}
              <Link
                href={`/conversations/${scenarioSlug}?tab=quiz`}
                className="group p-4 rounded-panel bg-muted/60 hover:bg-muted transition-colors flex flex-col justify-between space-y-3 cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="size-9 rounded-control bg-primary/10 text-primary flex items-center justify-center">
                    <HugeiconsIcon icon={SparklesIcon} size={18} />
                  </div>
                  <h4 className="font-heading text-card-title text-foreground group-hover:text-primary transition-colors">
                    {t("dailyPractice.quizStep", locale)}
                  </h4>
                  <p className="text-meta text-muted-foreground">
                    {t("dailyPractice.quizStepDesc", locale)}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-chip text-primary">
                  <span>{locale === "bn" ? "কুইজ শুরু করুন" : "Start Quiz"}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </div>
              </Link>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-border">
              <Link
                href={`/conversations/${scenarioSlug}`}
                className={cn(buttonVariants({ size: "lg" }), "rounded-control font-semibold")}
              >
                <HugeiconsIcon icon={PlayIcon} size={18} />
                <span>{t("dailyPractice.startChallenge", locale)}</span>
              </Link>

              <Button
                variant={isCompleted ? "outline" : "secondary"}
                size="lg"
                onClick={handleToggleCompletion}
                className="rounded-control text-label"
              >
                <HugeiconsIcon
                  icon={isCompleted ? CheckmarkCircle02Icon : TaskDone01Icon}
                  size={18}
                  className={cn(isCompleted && "text-emerald-600 dark:text-emerald-400")}
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

      {/* 3. Spaced Repetition (SRS) Review Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Bookmark02Icon} size={20} className="text-primary" />
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
          <Card className="p-8 text-center bg-card space-y-4">
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
          </Card>
        )}
      </section>

      {/* 4. Quick Speaking Workouts */}
      <section className="space-y-4">
        <h2 className="font-heading text-card-title text-foreground">
          {t("dailyPractice.quickWorkouts", locale)}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: What Should I Say? */}
          <Link
            href="/what-should-i-say"
            className="group block p-5 rounded-card bg-card shadow-card hover:shadow-md transition-shadow space-y-3 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="size-10 rounded-control bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <HugeiconsIcon icon={SparklesIcon} size={20} />
              </div>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={18}
                className="text-muted-foreground group-hover:text-primary transition-colors"
              />
            </div>
            <div>
              <h3 className="font-heading text-card-title text-foreground group-hover:text-primary transition-colors">
                {locale === "bn" ? "আমি কী বলতে পারি?" : "What Should I Say?"}
              </h3>
              <p className="text-meta text-muted-foreground mt-1">
                {locale === "bn"
                  ? "যেকোনো বাস্তব পরিস্থিতিতে সাথে সাথে দরকারি ইংরেজি বাক্য খুঁজুন ও শুনুন।"
                  : "Instant context-based English phrases for any real-life situation."}
              </p>
            </div>
          </Link>

          {/* Card 2: AI Voice Partner */}
          <Link
            href="/roleplay"
            className="group block p-5 rounded-card bg-card shadow-card hover:shadow-md transition-shadow space-y-3 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="size-10 rounded-control bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <HugeiconsIcon icon={BotIcon} size={20} />
              </div>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={18}
                className="text-muted-foreground group-hover:text-primary transition-colors"
              />
            </div>
            <div>
              <h3 className="font-heading text-card-title text-foreground group-hover:text-primary transition-colors">
                {locale === "bn" ? "এআই পার্টনার" : "AI Partner"}
              </h3>
              <p className="text-meta text-muted-foreground mt-1">
                {locale === "bn"
                  ? "১০টি বাস্তব বিষয় অথবা মুক্ত আড্ডায় মুখে বলে ইংরেজি কথোপকথন প্র্যাকটিস করুন।"
                  : "Practice real conversations aloud with 10 roleplay topics or freestyle mode."}
              </p>
            </div>
          </Link>

          {/* Card 3: Shopping Ladder */}
          <Link
            href="/explore/category/shopping-and-money"
            className="group block p-5 rounded-card bg-card shadow-card hover:shadow-md transition-shadow space-y-3 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="size-10 rounded-control bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <HugeiconsIcon icon={TaskDone01Icon} size={20} />
              </div>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={18}
                className="text-muted-foreground group-hover:text-primary transition-colors"
              />
            </div>
            <div>
              <h3 className="font-heading text-card-title text-foreground group-hover:text-primary transition-colors">
                {locale === "bn" ? "শপিং ল্যাডার" : "Shopping Ladder"}
              </h3>
              <p className="text-meta text-muted-foreground mt-1">
                {locale === "bn"
                  ? "দোকান, দামদর, ক্যাশিয়ার ও রিফান্ডের ধাপে ধাপে বাস্তব পরিস্থিতি আয়ত্ত করুন।"
                  : "20 step-by-step sequential scenarios from basic shopping to returns & checkout."}
              </p>
            </div>
          </Link>
        </div>
      </section>
    </PageContainer>
  );
}
