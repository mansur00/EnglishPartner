"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useLocale, t } from "@/lib/i18n";
import { TodayPanel } from "@/components/shared";
import { ReviewQueue } from "@/components/learning/ReviewQueue";
import { PersonalizedPracticeCard } from "@/components/practice/PersonalizedPracticeCard";
import { Badge } from "@/components/ui/badge";
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
  CheckmarkCircle02Icon,
  CompassIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import {
  buildDailyPlan,
  detectWeakAreas,
  type UserProgressSnapshot,
} from "@/lib/practice/personalized-generator";
import {
  CHALLENGE_90_STORAGE_KEY,
  DEFAULT_CHALLENGE_90_STATE,
  getPhaseForDay,
  type Challenge90State,
} from "@/lib/practice/challenge-90";

export function DailyPracticeClient() {
  const locale = useLocale();
  const [savedLemmas, setSavedLemmas] = useState<string[]>([]);
  const [streak, setStreak] = useState(3);
  const [minutesCompleted, setMinutesCompleted] = useState(8);
  const [minutesGoal, setMinutesGoal] = useState(15);
  const [weakWords, setWeakWords] = useState<
    { word: string; mistakes: number; ruleCategory: string }[]
  >([]);
  const [ruleMistakesCount, setRuleMistakesCount] = useState(0);
  const [quizLowCategories, setQuizLowCategories] = useState<string[]>([]);
  const [completedGrammarIds, setCompletedGrammarIds] = useState<string[]>([]);
  const [challengeState, setChallengeState] = useState<Challenge90State>(
    DEFAULT_CHALLENGE_90_STATE
  );

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

        const spellRaw = localStorage.getItem("ecp_spell_master_v1");
        if (spellRaw) {
          const spellParsed = JSON.parse(spellRaw);
          if (spellParsed?.weakWords && typeof spellParsed.weakWords === "object") {
            const list = Object.values(spellParsed.weakWords) as {
              word: string;
              mistakes: number;
              ruleCategory: string;
            }[];
            setWeakWords(list.filter((w) => w && typeof w.word === "string"));
          }
          if (spellParsed?.ruleMistakes && typeof spellParsed.ruleMistakes === "object") {
            const totalRuleMistakes = Object.values(
              spellParsed.ruleMistakes as Record<string, number>
            ).reduce((sum, n) => sum + (typeof n === "number" ? n : 0), 0);
            setRuleMistakesCount(totalRuleMistakes);
          }
        }

        const quizRaw = localStorage.getItem("ecp_quiz_results_v1");
        if (quizRaw) {
          const quizParsed = JSON.parse(quizRaw);
          if (Array.isArray(quizParsed)) {
            const lowCats = quizParsed
              .filter(
                (q: { score?: number; total?: number; category?: string }) =>
                  typeof q?.score === "number" &&
                  typeof q?.total === "number" &&
                  q.total > 0 &&
                  q.score / q.total < 0.7 &&
                  typeof q.category === "string"
              )
              .map((q: { category: string }) => q.category);
            setQuizLowCategories(lowCats);
          }
        }

        const grammarRaw = localStorage.getItem("ecp_grammar_path_completed_v1");
        if (grammarRaw) {
          const grammarParsed = JSON.parse(grammarRaw);
          if (Array.isArray(grammarParsed)) {
            setCompletedGrammarIds(
              grammarParsed.filter((id): id is string => typeof id === "string")
            );
          }
        }

        const challengeRaw = localStorage.getItem(CHALLENGE_90_STORAGE_KEY);
        if (challengeRaw) {
          const challengeParsed = JSON.parse(challengeRaw);
          if (challengeParsed && typeof challengeParsed.currentDay === "number") {
            setChallengeState({ ...DEFAULT_CHALLENGE_90_STATE, ...challengeParsed });
          }
        }
      } catch {
        // LocalStorage access fallback
      }
    });
  }, []);

  const progressSnapshot = useMemo<UserProgressSnapshot>(
    () => ({
      weakWords,
      ruleMistakesCount,
      quizLowCategories,
      completedGrammarIds,
      savedVocabCount: savedLemmas.length,
      todayMinutes: minutesCompleted,
    }),
    [
      weakWords,
      ruleMistakesCount,
      quizLowCategories,
      completedGrammarIds,
      savedLemmas.length,
      minutesCompleted,
    ]
  );

  const weakAreas = useMemo(() => detectWeakAreas(progressSnapshot), [progressSnapshot]);
  const { nextLesson, planSteps } = useMemo(
    () => buildDailyPlan(progressSnapshot),
    [progressSnapshot]
  );

  const addPracticeMinutes = (mins: number) => {
    const updated = minutesCompleted + mins;
    setMinutesCompleted(updated);
    try {
      localStorage.setItem("ecp_today_minutes", updated.toString());
    } catch {
      // Best effort
    }
  };

  const handleChallengeChange = (next: Challenge90State) => {
    setChallengeState(next);
    try {
      localStorage.setItem(CHALLENGE_90_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Best effort
    }
  };

  const topWeakArea = weakAreas[0];
  const challengePhase = getPhaseForDay(challengeState.currentDay);

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
      {/* AI Coach Insight & 90-Day Snapshot */}
      <div className="rounded-card bg-muted/40 border border-border p-4 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="success" size="sm">
            {locale === "bn" ? "AI কোচ ইনসাইট" : "AI Coach Insight"}
          </Badge>
          <span className="text-chip font-mono text-muted-foreground">
            Day {challengeState.currentDay}/90
          </span>
        </div>
        <p className="text-meta text-foreground leading-snug">
          {challengeState.enrolled
            ? locale === "bn"
              ? `${challengePhase.titleBn} — আজকের স্পোকেন প্র্যাকটিসে ${topWeakArea ? topWeakArea.labelBn : "বাক্য গঠন"} উন্নত করতে AI পার্টনারের সাথে কথা বলুন।`
              : `${challengePhase.titleEn} — Focus today's speaking session on ${topWeakArea ? topWeakArea.labelEn : "natural flow"} with live roleplay.`
            : locale === "bn"
              ? "৯০-দিনের স্পোকেন ইংলিশ চ্যালেঞ্জ শুরু করলে আপনার স্পিকিং অগ্রগতি অনুযায়ী প্রতিদিন কাস্টম প্ল্যান পাবেন।"
              : "Enroll in the 90-Day Spoken English Challenge for an adaptive daily speaking plan."}
        </p>
        <Link
          href="/roleplay"
          className="inline-flex items-center gap-1 text-chip font-semibold text-primary hover:underline"
        >
          <span>{locale === "bn" ? "AI Roleplay খুলুন" : "Open AI Roleplay"}</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        </Link>
      </div>

      {/* Next Recommended Lesson */}
      <div className="rounded-card bg-primary/10 border border-primary/25 p-4 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="brand" size="sm">
            {locale === "bn" ? "পরবর্তী লেসন" : "Next Lesson"}
          </Badge>
          <span className="text-chip font-mono text-muted-foreground">
            {nextLesson.completedCount}/{nextLesson.totalCount}
          </span>
        </div>
        <div>
          <h3 className="font-heading text-label font-semibold text-foreground">
            {nextLesson.lessonTitle}
          </h3>
          <p className="text-chip text-muted-foreground mt-0.5">
            {locale === "bn" ? nextLesson.reasonBn : nextLesson.reasonEn}
          </p>
        </div>
        <Link
          href={nextLesson.href}
          className={cn(buttonVariants({ variant: "cta", size: "sm" }), "w-full gap-1.5")}
        >
          <span>{locale === "bn" ? "লেসন শুরু করুন" : "Start Next Lesson"}</span>
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
        </Link>
      </div>

      {/* Today's Daily Plan */}
      <div className="space-y-2">
        <h2 className="text-chip uppercase tracking-wider text-muted-foreground">
          {locale === "bn" ? "আজকের ডেইলি প্ল্যান" : "Today's Daily Plan"}
        </h2>
        <div className="space-y-2">
          {planSteps.map((step) => (
            <Link
              key={step.id}
              href={step.href}
              className="flex items-start gap-2.5 p-3 rounded-panel bg-muted/40 border border-border/60 hover:border-primary/40 transition-colors"
            >
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={16}
                className={cn(
                  "mt-0.5 shrink-0",
                  step.completed ? "text-status-success-ink" : "text-muted-foreground"
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-meta font-semibold text-foreground leading-snug">
                  {locale === "bn" ? step.titleBn : step.titleEn}
                </p>
                <p className="text-chip text-muted-foreground mt-0.5">
                  {step.tag} · ~{step.durationMin} min
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <h2 className="text-chip uppercase tracking-wider text-muted-foreground pt-1">
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

        {/* 2. 90-Day Personalized Spoken English Challenge */}
        <PersonalizedPracticeCard
          locale={locale === "bn" ? "bn" : "en"}
          challengeState={challengeState}
          onChallengeChange={handleChallengeChange}
          onPracticeMinutesEarned={addPracticeMinutes}
        />

        {/* 3. Spaced Repetition (SRS) Review Section */}
        <Card id="srs-review" className="p-5 sm:p-6 bg-card border border-border space-y-5 shadow-xs">
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
