"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { t, useTranslations } from "@/lib/i18n";
import { useSessionAccess } from "@/components/auth/SessionIsolationProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  PageContainer,
  HeroBand,
  TodayPanel,
  TopicCard,
  CefrChip,
  LocaleTitle,
} from "@/components/shared";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayCircleIcon,
  ArrowRight01Icon,
  SparklesIcon,
  BotIcon,
  Bookmark02Icon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons";

export function DashboardClient() {
  const { locale } = useTranslations();
  const { isGuest } = useSessionAccess();
  const [streak, setStreak] = useState(0);
  const [minutesCompleted, setMinutesCompleted] = useState(0);
  const [minutesGoal, setMinutesGoal] = useState(15);

  useEffect(() => {
    queueMicrotask(() => {
      if (isGuest) {
        setStreak(0);
        setMinutesCompleted(0);
        setMinutesGoal(15);
        return;
      }
      try {
        const s = localStorage.getItem("ecp_streak_count");
        const m = localStorage.getItem("ecp_today_minutes");
        const g = localStorage.getItem("ecp_daily_goal_mins");
        setStreak(s ? parseInt(s, 10) || 0 : 0);
        setMinutesCompleted(m ? parseInt(m, 10) || 0 : 0);
        setMinutesGoal(g ? parseInt(g, 10) || 15 : 15);
      } catch {
        // Ignore storage errors
      }
    });
  }, [isGuest]);

  return (
    <PageContainer className="py-4 sm:py-6 space-y-5 sm:space-y-6 pb-24 md:pb-16">
      {/* 1. Rounded Deep-Violet Hero Banner Card */}
      <HeroBand className="rounded-card p-4 sm:p-6 md:p-7 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1">
            <h1 className="text-page-title text-band-panel-ink">
              {t("dashboard.heroTitle", locale)}
            </h1>
            <p className="text-meta text-band-panel-ink/80">
              {t("dashboard.heroSubtitle", locale)}
            </p>
          </div>

          <TodayPanel
            streak={streak}
            minutesCompleted={minutesCompleted}
            minutesGoal={minutesGoal}
          />
        </div>
      </HeroBand>

      {/* 2. Row 1: Level Assessment Quiz Card + AI Partner CTA Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Level Assessment Quiz Card */}
        <Card className="p-4 sm:p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={SparklesIcon} size={20} />
              </div>
              <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
                <Badge variant="brand" size="sm">
                  {locale === "bn" ? "৪০ প্রশ্ন • এআই কুইজ" : "40 Questions • AI"}
                </Badge>
                <CefrChip level="A1" label="A1–C2" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-card-title text-foreground">
                {locale === "bn"
                  ? "আপনার ইংরেজি লেভেল যাচাই করুন"
                  : "Level Assessment Quiz"}
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                {locale === "bn"
                  ? "প্রতিবার রিফ্রেশ করলে এআই থেকে নতুন ৪০টি প্রশ্ন তৈরি হবে। আপনার বর্তমান CEFR দক্ষতা যাচাই করুন।"
                  : "Test your CEFR level across 40 AI-powered questions. Tap Refresh anytime for 40 brand-new questions."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/dashboard/level-assessment" className="block w-full sm:w-auto">
              <Button variant="cta" size="md" className="btn-press w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer">
                <span>{locale === "bn" ? "লেভেল কুইজ শুরু করুন" : "Start Level Quiz"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* AI Partner CTA Card */}
        <Card className="p-4 sm:p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={BotIcon} size={20} />
              </div>
              <Badge variant="brand" size="sm">
                {locale === "bn" ? "ভয়েস ও টেক্সট" : "Voice & Text AI"}
              </Badge>
            </div>

            <div className="space-y-1">
              <h2 className="text-card-title text-foreground">
                {locale === "bn"
                  ? "এআই কনভারসেশন পার্টনার"
                  : "AI Conversation Partner"}
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                {locale === "bn"
                  ? "বাস্তব জীবনের পরিস্থিতি বা উন্মুক্ত আড্ডায় এআই পার্টনারের সাথে ভয়েস ও টেক্সটে ইংরেজি বলার অনুশীলন করুন।"
                  : "Practice real-world scenarios or freestyle speaking with your live AI voice & text partner."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/roleplay" className="block w-full sm:w-auto">
              <Button variant="default" size="md" className="btn-press w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer">
                <span>{locale === "bn" ? "এআই পার্টনারে যান" : "Open AI Partner"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* 3. Row 2: Full-Width Daily Conversation Practice Card (Rainbow Border) */}
      <div className="rainbow-border rounded-card">
        <TopicCard
          topic="shopping"
          className="p-4 sm:p-6 md:p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
            {/* Left Column: Concise Daily Conversation Focus & CTAs */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent" size="md">
                  ✨ {locale === "bn" ? "দৈনিক কথোপকথন" : "Daily Conversation"}
                </Badge>
                <CefrChip level="A1" label="A1–C2" />
              </div>

              <LocaleTitle
                as="h2"
                titleEn="Daily English Conversations"
                titleBn="দৈনিক ইংরেজি কথোপকথন"
                className="text-hero-title text-foreground"
              />

              <p className="text-body text-muted-foreground">
                {locale === "bn"
                  ? "প্রতিদিন বাস্তব জীবনের ইংরেজি বলার অনুশীলন করুন।"
                  : "Practice real-life English speaking every day."}
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
                <Link href="/daily-practice" className="w-full sm:w-auto">
                  <Button variant="cta" size="lg" className="btn-press w-full sm:w-auto inline-flex items-center justify-center shadow-xs gap-2 cursor-pointer">
                    <HugeiconsIcon icon={PlayCircleIcon} size={20} className="shrink-0" />
                    <span>{locale === "bn" ? "দৈনিক অনুশীলন" : "Start Daily Practice"}</span>
                  </Button>
                </Link>
                <Link href="/explore" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer">
                    <span>{locale === "bn" ? "সব কথোপকথন" : "Browse All"}</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Drive Illustration SVG */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="w-full rounded-panel bg-card/85 p-3 sm:p-4 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dashboard-illustration.svg"
                  alt="Daily English Conversation Practice"
                  className="w-full max-h-48 sm:max-h-64 object-contain"
                />
              </div>
            </div>
          </div>
        </TopicCard>
      </div>

      {/* 4. Row 3: Vocabulary CTA Card + Quiz CTA Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* Vocabulary CTA Card */}
        <Card className="p-4 sm:p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Bookmark02Icon} size={20} />
              </div>
              <Badge variant="neutral" size="sm">
                {locale === "bn" ? "৪০ ম্যাজিক কার্ড" : "40 Magic Cards"}
              </Badge>
            </div>

            <div className="space-y-1">
              <h2 className="text-card-title text-foreground">
                {locale === "bn"
                  ? "আমার শব্দভান্ডার ও ম্যাজিক কার্ড"
                  : "Vocabulary & Magic Cards"}
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                {locale === "bn"
                  ? "৪০টি থিমযুক্ত ম্যাজিক কার্ড থেকে নতুন শব্দ শিখুন, পছন্দের ক্যাটাগরিতে সেভ করুন এবং ফ্ল্যাশকার্ড রিভিউ দিন।"
                  : "Explore 40 themed Magic Cards, organize saved words by category, and review daily flashcards."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/vocabulary" className="block w-full sm:w-auto">
              <Button variant="default" size="md" className="btn-press w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer">
                <span>{locale === "bn" ? "শব্দভান্ডার দেখুন" : "Open Vocabulary"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Quiz CTA Card */}
        <Card className="p-4 sm:p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={20} />
              </div>
              <Badge variant="neutral" size="sm">
                {locale === "bn" ? "১০–৩০টি প্রশ্ন" : "10–30 Questions"}
              </Badge>
            </div>

            <div className="space-y-1">
              <h2 className="text-card-title text-foreground">
                {locale === "bn"
                  ? "কথোপকথন কুইজ অনুশীলন"
                  : "Conversation Quiz Practice"}
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed">
                {locale === "bn"
                  ? "প্রতিটি কথোপকথনের লেভেল, স্টাইল ও দৈর্ঘ্য অনুযায়ী কুইজ প্র্যাকটিস করে ভুল ও সঠিক উত্তর যাচাই করুন।"
                  : "Practice quizzes tailored to every conversation's CEFR level, style, and length with instant score review."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/quiz" className="block w-full sm:w-auto">
              <Button variant="default" size="md" className="btn-press w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer">
                <span>{locale === "bn" ? "কুইজ প্র্যাকটিস করুন" : "Open Quiz Practice"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
