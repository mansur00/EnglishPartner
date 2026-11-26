"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, t } from "@/lib/i18n";
import { TodayPanel } from "@/components/shared";
import { ReviewQueue } from "@/components/learning/ReviewQueue";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  SparklesIcon,
  ArrowRight01Icon,
  Bookmark02Icon,
  BookOpen01Icon,
  CheckmarkBadge01Icon,
  CompassIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export function DailyPracticeClient() {
  const locale = useLocale();
  const [savedLemmas, setSavedLemmas] = useState<string[]>([]);
  const [streak, setStreak] = useState(3);
  const [minutesCompleted, setMinutesCompleted] = useState(8);
  const [minutesGoal, setMinutesGoal] = useState(15);

  const formattedDate = new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const storedGoal = localStorage.getItem("ecp_daily_goal_mins");
        if (storedGoal) setMinutesGoal(parseInt(storedGoal, 10));

        const storedStreak = localStorage.getItem("ecp_streak_count");
        if (storedStreak) setStreak(parseInt(storedStreak, 10));

        const storedMins = localStorage.getItem("ecp_today_minutes");
        if (storedMins) setMinutesCompleted(parseInt(storedMins, 10));

        const vocabRaw = localStorage.getItem("ecp_saved_vocabulary");
        if (vocabRaw) {
          const parsed = JSON.parse(vocabRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedLemmas(parsed);
          }
        }
      } catch {
        // LocalStorage access fallback
      }
    });
  }, []);

  const handleAddStarterWords = () => {
    const starter = ["reservation", "discount", "receipt", "recommendation", "appointment"];
    setSavedLemmas(starter);
    try {
      localStorage.setItem("ecp_saved_vocabulary", JSON.stringify(starter));
    } catch {
      // Best effort
    }
  };

  const continuePaths = [
    {
      href: "/explore/category/shopping-and-money",
      icon: CompassIcon,
      toneClass: "bg-status-success-bg text-status-success-ink",
      title: locale === "bn" ? "কথোপকথন (Conversation)" : "Conversation",
      desc:
        locale === "bn"
          ? "শপিং ল্যাডার ও বাস্তব জীবনের সংলাপ অনুশীলন চালিয়ে যান।"
          : "Continue Shopping Ladder & real-world dialogue practice.",
    },
    {
      href: "/grammar-path",
      icon: BookOpen01Icon,
      toneClass: "bg-status-info-bg text-status-info-ink",
      title: locale === "bn" ? "গ্রামার (Grammar)" : "Grammar",
      desc:
        locale === "bn"
          ? "৮ ধাপের গ্রামার পাথ থেকে আপনার পরবর্তী নিয়ম ও কুইজ শিখুন।"
          : "Continue your 8-stage grammar lessons, examples & quizzes.",
    },
    {
      href: "/vocabulary",
      icon: Bookmark02Icon,
      toneClass: "bg-status-warning-bg text-status-warning-ink",
      title: locale === "bn" ? "শব্দভাণ্ডার (Vocabulary)" : "Vocabulary",
      desc:
        locale === "bn"
          ? "ম্যাজিক কার্ড ও সংরক্ষিত শব্দগুলোর অর্থ ও ব্যবহার দেখুন।"
          : "Explore Magic Cards and review your saved words.",
    },
    {
      href: "/quiz",
      icon: CheckmarkBadge01Icon,
      toneClass: "bg-primary/10 text-primary",
      title: locale === "bn" ? "কুইজ (Quiz)" : "Quiz",
      desc:
        locale === "bn"
          ? "ইংরেজি লেভেল ও প্র্যাকটিস কুইজ দিয়ে নিজেকে যাচাই করুন।"
          : "Test your level and reinforce what you have learned.",
    },
  ];

  const continueLearningSidebar = (
    <>
      <h2 className="text-chip uppercase tracking-wider text-muted-foreground">
        {locale === "bn" ? "শেখা চালিয়ে যান" : "Continue Learning Path"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
        {continuePaths.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group block p-4 rounded-card bg-muted/50 border border-border hover:border-primary/40 hover:bg-muted transition-all space-y-2 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className={cn("size-9 rounded-control flex items-center justify-center", item.toneClass)}>
                <HugeiconsIcon icon={item.icon} size={18} />
              </div>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={18}
                className="text-muted-foreground group-hover:text-primary transition-colors"
              />
            </div>
            <div>
              <h3 className="font-heading text-label font-semibold text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-chip text-muted-foreground mt-1">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <div className="w-full lg:pr-80 xl:pr-96">
      {/* ================= MIDDLE CONTENT AREA ================= */}
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

        {/* Mobile/Tablet Continue Learning Path */}
        <section className="lg:hidden space-y-4">
          {continueLearningSidebar}
        </section>
      </div>

      {/* ================= FIXED RIGHT SIDEBAR ================= */}
      <aside className="hidden lg:flex flex-col fixed right-0 top-header h-below-header w-80 xl:w-96 border-l border-border bg-card z-sidebar overflow-y-auto p-4 space-y-4">
        {continueLearningSidebar}
      </aside>
    </div>
  );
}
