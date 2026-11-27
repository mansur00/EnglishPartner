"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { t, useTranslations } from "@/lib/i18n";
import { useSessionAccess } from "@/components/auth/SessionIsolationProvider";
import { useFeatureFlags } from "@/lib/features/use-feature-flags";
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
  HeadphonesIcon,
  BookOpen01Icon,
  Briefcase01Icon,
  Message01Icon,
} from "@hugeicons/core-free-icons";

export function DashboardClient() {
  const { locale } = useTranslations();
  const { isGuest } = useSessionAccess();
  const { isEnabled } = useFeatureFlags();
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

  const isBn = locale === "bn";
  const showAiPartner = isEnabled("ai_partner");
  const showSpellMaster = isEnabled("spell_master");
  const showQuiz = isEnabled("quiz");

  return (
    <PageContainer className="py-4 sm:py-6 space-y-5 sm:space-y-6 pb-24 md:pb-16">
      {/* 1. Hero Banner + Today Streak & Goal */}
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

      {/* 2. Priority 1: Daily English Conversations (Primary Daily Habit) */}
      <div className="rainbow-border rounded-card">
        <TopicCard topic="shopping" className="p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
            <div className="lg:col-span-7 space-y-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent" size="md">
                  ✨ {isBn ? "দৈনিক কথোপকথন" : "Daily Conversation"}
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
                {isBn
                  ? "প্রতিদিন বাস্তব জীবনের ইংরেজি বলার অনুশীলন করুন।"
                  : "Practice real-life English speaking every day."}
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
                <Link href="/daily-practice" className="w-full sm:w-auto">
                  <Button
                    variant="cta"
                    size="lg"
                    className="btn-press w-full sm:w-auto inline-flex items-center justify-center shadow-xs gap-2 cursor-pointer"
                  >
                    <HugeiconsIcon icon={PlayCircleIcon} size={20} className="shrink-0" />
                    <span>{isBn ? "দৈনিক অনুশীলন" : "Start Daily Practice"}</span>
                  </Button>
                </Link>
                <Link href="/explore" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isBn ? "সব কথোপকথন" : "Browse All"}</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0" />
                  </Button>
                </Link>
              </div>
            </div>

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

      {/* 3. Priority 2: Core Speaking & Listening (AI Partner + Audio Books) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {showAiPartner && (
          <Card className="p-4 sm:p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs h-full">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={BotIcon} size={20} />
                </div>
                <Badge variant="brand" size="sm">
                  {isBn ? "ভয়েস ও টেক্সট" : "Voice & Text AI"}
                </Badge>
              </div>

              <div className="space-y-1">
                <h2 className="text-card-title text-foreground line-clamp-2 break-words">
                  {isBn ? "এআই কনভারসেশন পার্টনার" : "AI Conversation Partner"}
                </h2>
                <p className="text-body text-muted-foreground leading-relaxed line-clamp-2">
                  {isBn
                    ? "বাস্তব জীবনের পরিস্থিতি বা উন্মুক্ত আড্ডায় এআই পার্টনারের সাথে ভয়েস ও টেক্সটে ইংরেজি বলার অনুশীলন করুন।"
                    : "Practice real-world scenarios or freestyle speaking with your live AI voice & text partner."}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/roleplay" className="block w-full sm:w-auto">
                <Button variant="default" size="md" className="btn-press w-full sm:w-auto gap-2">
                  <span>{isBn ? "এআই পার্টনারে যান" : "Open AI Partner"}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0" />
                </Button>
              </Link>
            </div>
          </Card>
        )}

        <Card className="p-4 sm:p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs h-full">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={HeadphonesIcon} size={20} />
              </div>
              <Badge variant="brand" size="sm">
                {isBn ? "অডিও ও স্টোরি বুক" : "Listening & Sync"}
              </Badge>
            </div>

            <div className="space-y-1">
              <h2 className="text-card-title text-foreground line-clamp-2 break-words">
                {isBn ? "অডিও বুক ও স্টোরি বুক" : "Audio Books & Story Books"}
              </h2>
              <p className="text-body text-muted-foreground leading-relaxed line-clamp-2">
                {isBn
                  ? "শোনার দক্ষতা বাড়াতে অডিও লেসন শুনুন এবং গল্পের সাথে লাইভ টেক্সট ফলো করুন।"
                  : "Improve listening comprehension with audio lessons and synchronized story books."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/audiobooks" className="block w-full sm:w-auto">
              <Button variant="default" size="md" className="btn-press w-full sm:w-auto gap-2">
                <span>{isBn ? "অডিও বুক খুলুন" : "Open Audio Books"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* 4. Priority 3: Core Language Foundations (Grammar + Vocabulary + Spell Master) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        <Card className="p-4 sm:p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs h-full">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={BookOpen01Icon} size={20} />
              </div>
              <Badge variant="neutral" size="sm">
                {isBn ? "৮টি স্টেজ" : "8 Stages"}
              </Badge>
            </div>

            <div className="space-y-1">
              <h2 className="text-card-title text-foreground line-clamp-2 break-words">
                {isBn ? "গ্রামার পাথ" : "Grammar Path"}
              </h2>
              <p className="text-meta text-muted-foreground leading-relaxed line-clamp-2">
                {isBn
                  ? "ধাপে ধাপে ইংরেজি বাক্য গঠন ও এআই রাইটিং চেকার অনুশীলন করুন।"
                  : "Master sentence structure step by step with interactive lessons and AI writing checks."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/grammar-path" className="block w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto gap-2">
                <span>{isBn ? "গ্রামার পাথ দেখুন" : "Open Grammar Path"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs h-full">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Bookmark02Icon} size={20} />
              </div>
              <Badge variant="neutral" size="sm">
                {isBn ? "৪০ ম্যাজিক কার্ড" : "40 Magic Cards"}
              </Badge>
            </div>

            <div className="space-y-1">
              <h2 className="text-card-title text-foreground line-clamp-2 break-words">
                {isBn ? "শব্দভান্ডার ও ম্যাজিক কার্ড" : "Vocabulary & Magic Cards"}
              </h2>
              <p className="text-meta text-muted-foreground leading-relaxed line-clamp-2">
                {isBn
                  ? "৪০টি থিমযুক্ত ম্যাজিক কার্ড থেকে নতুন শব্দ শিখুন এবং ফ্ল্যাশকার্ড রিভিউ দিন।"
                  : "Explore 40 themed Magic Cards, save words by category, and review flashcards."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/vocabulary" className="block w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto gap-2">
                <span>{isBn ? "শব্দভান্ডার দেখুন" : "Open Vocabulary"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0" />
              </Button>
            </Link>
          </div>
        </Card>

        {showSpellMaster && (
          <Card className="p-4 sm:p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs h-full">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={SparklesIcon} size={20} />
                </div>
                <Badge variant="neutral" size="sm">
                  {isBn ? "৫৫টি নিয়ম" : "55 Rules"}
                </Badge>
              </div>

              <div className="space-y-1">
                <h2 className="text-card-title text-foreground line-clamp-2 break-words">
                  {isBn ? "বানান মাস্টার" : "Spell Master"}
                </h2>
                <p className="text-meta text-muted-foreground leading-relaxed line-clamp-2">
                  {isBn
                    ? "বানানের নিয়ম, অডিও ডিকটেশন ও এআই স্পেল কোচের মাধ্যমে নির্ভুল বানান শিখুন।"
                    : "Master English spelling rules, audio dictation, and AI mistake coaching."}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/spell-master" className="block w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full sm:w-auto gap-2">
                  <span>{isBn ? "স্পেল মাস্টার" : "Open Spell Master"}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0" />
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* 5. Priority 4: Assessment, Quick Helper & Career Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {showQuiz && (
          <Card className="p-4 sm:p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs h-full">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={SparklesIcon} size={20} />
                </div>
                <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
                  <Badge variant="brand" size="sm">
                    {isBn ? "৪০ প্রশ্ন • এআই কুইজ" : "40 Questions • AI"}
                  </Badge>
                  <CefrChip level="A1" label="A1–C2" />
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-card-title text-foreground line-clamp-2 break-words">
                  {isBn ? "আপনার ইংরেজি লেভেল যাচাই করুন" : "Level Assessment Quiz"}
                </h2>
                <p className="text-meta text-muted-foreground leading-relaxed line-clamp-2">
                  {isBn
                    ? "প্রতিবার রিফ্রেশ করলে এআই থেকে নতুন ৪০টি প্রশ্ন তৈরি হবে। আপনার বর্তমান CEFR দক্ষতা যাচাই করুন।"
                    : "Test your CEFR level across 40 AI-powered questions. Tap Refresh anytime for brand-new questions."}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/dashboard/level-assessment" className="block w-full sm:w-auto">
                <Button variant="cta" size="md" className="btn-press w-full sm:w-auto gap-2">
                  <span>{isBn ? "লেভেল কুইজ শুরু করুন" : "Start Level Quiz"}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0" />
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {showQuiz && (
          <Card className="p-4 sm:p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs h-full">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={CheckmarkBadge01Icon} size={20} />
                </div>
                <Badge variant="neutral" size="sm">
                  {isBn ? "১০–৩০টি প্রশ্ন" : "10–30 Questions"}
                </Badge>
              </div>

              <div className="space-y-1">
                <h2 className="text-card-title text-foreground line-clamp-2 break-words">
                  {isBn ? "কথোপকথন কুইজ অনুশীলন" : "Conversation Quiz Practice"}
                </h2>
                <p className="text-meta text-muted-foreground leading-relaxed line-clamp-2">
                  {isBn
                    ? "প্রতিটি কথোপকথনের লেভেল, স্টাইল ও দৈর্ঘ্য অনুযায়ী কুইজ প্র্যাকটিস করে ভুল ও সঠিক উত্তর যাচাই করুন।"
                    : "Practice quizzes tailored to every conversation's CEFR level, style, and length."}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/quiz" className="block w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full sm:w-auto gap-2">
                  <span>{isBn ? "কুইজ প্র্যাকটিস করুন" : "Open Quiz Practice"}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0" />
                </Button>
              </Link>
            </div>
          </Card>
        )}

        <Card className="p-4 sm:p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs h-full">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Message01Icon} size={20} />
              </div>
              <Badge variant="neutral" size="sm">
                {isBn ? "তাৎক্ষণিক সাহায্য" : "Instant Phrase Helper"}
              </Badge>
            </div>

            <div className="space-y-1">
              <h2 className="text-card-title text-foreground line-clamp-2 break-words">
                {isBn ? "কী বলবো? (What Should I Say?)" : "What Should I Say?"}
              </h2>
              <p className="text-meta text-muted-foreground leading-relaxed line-clamp-2">
                {isBn
                  ? "বাংলায় আপনার পরিস্থিতি লিখুন এবং সাথে সাথে স্বাভাবিক ও ভদ্র ইংরেজি বাক্য পান।"
                  : "Describe any situation in Bangla or English and get natural, polite phrasing instantly."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/what-should-i-say" className="block w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto gap-2">
                <span>{isBn ? "বাক্য খুঁজুন" : "Open Helper"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0" />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs h-full">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="size-10 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Briefcase01Icon} size={20} />
              </div>
              <Badge variant="neutral" size="sm">
                {isBn ? "কর্মক্ষেত্র ও ক্যারিয়ার" : "Career Tracks"}
              </Badge>
            </div>

            <div className="space-y-1">
              <h2 className="text-card-title text-foreground line-clamp-2 break-words">
                {isBn ? "পেশাভিত্তিক ইংরেজি ট্র্যাক" : "Career & Profession Tracks"}
              </h2>
              <p className="text-meta text-muted-foreground leading-relaxed line-clamp-2">
                {isBn
                  ? "সফটওয়্যার, ডিজাইন, ব্যবসা ও স্বাস্থ্যসেবার জন্য বিশেষায়িত ইংরেজি কথোপকথন অনুশীলন।"
                  : "Practice workplace English tailored for tech, design, business, and healthcare roles."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/professions" className="block w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full sm:w-auto gap-2">
                <span>{isBn ? "ক্যারিয়ার ট্র্যাক দেখুন" : "Browse Career Tracks"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="shrink-0" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
