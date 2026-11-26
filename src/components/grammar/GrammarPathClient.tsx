"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Layers01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Pill } from "@/components/ui/pill";
import { LocaleTitle } from "@/components/shared";
import { useLocale, useTranslationLocale } from "@/lib/i18n";
import { isRtlLanguage } from "@/lib/i18n/languages";
import { cn } from "@/lib/utils";
import {
  GRAMMAR_STAGES,
  LEVEL_PRIORITIES,
  getTranslatedText,
  type GrammarLevelFilter,
} from "@/lib/grammar/learning-path";
import { GRAMMAR_LESSONS, getLessonsByStage } from "@/lib/grammar/learning-path-data";

export const COMPLETED_STORAGE_KEY = "ecp_grammar_path_completed_v1";

export function GrammarPathClient() {
  const locale = useLocale();
  const translationLocale = useTranslationLocale();
  const ruleLocale = translationLocale === "none" ? "en" : translationLocale;

  const [selectedLevel, setSelectedLevel] = useState<GrammarLevelFilter>("all");
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(COMPLETED_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setCompletedIds(parsed.filter((id): id is string => typeof id === "string"));
          }
        }
      } catch {
        // Ignore storage errors
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const activeLevelInfo = useMemo(
    () => LEVEL_PRIORITIES.find((lvl) => lvl.id === selectedLevel) ?? LEVEL_PRIORITIES[0],
    [selectedLevel]
  );

  const completedCount = completedIds.length;
  const totalCount = GRAMMAR_LESSONS.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isBangla = locale === "bn";

  return (
    <PageContainer className="py-6 space-y-6 pb-16">
      {/* Header & Progress Overview */}
      <Card className="p-5 sm:p-6 bg-card border border-border space-y-4 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Tag variant="brand" size="sm">
              8 Stages · {totalCount} Detailed Lessons
            </Tag>
            <Pill variant="neutral" size="sm">
              Rules · Word Bank · 5 Sentences · 10 Quiz
            </Pill>
          </div>
          <Pill variant="brand" size="sm">
            {completedCount} / {totalCount} Completed ({progressPercent}%)
          </Pill>
        </div>

        <div className="space-y-1.5">
          <LocaleTitle
            as="h1"
            titleEn="Grammar Learning Path"
            titleBn="গ্রামার লার্নিং পাথ"
            className="text-page-title text-foreground"
          />
          <p className={cn("text-meta text-muted-foreground", isBangla && "text-subtitle-bn")}>
            {isBangla
              ? "সহজ থেকে অ্যাডভান্সড পর্যন্ত ৮টি ধাপে সম্পূর্ণ ইংরেজি গ্রামার। প্রতিটি Stage-এ ঢুকে প্রতিটি টাইপের বিস্তারিত নিয়ম, ২০-৩০টি শব্দ, ৫টি বাক্য তৈরি, সঠিক শব্দ বাছাই এবং ১০ নম্বরের কুইজ দিয়ে শিখুন।"
              : locale === "hi"
              ? "बेसिक से एडवांस्ड तक 8 चरणों में विस्तृत अंग्रेजी ग्रामर। हर Stage में हर प्रकार के नियम, शब्द भंडार, 5 वाक्य बनाना और 10 प्रश्नों की क्विज़ शामिल है।"
              : "Master English grammar in depth across 8 structured stages. Each stage opens detailed lessons with sub-types, 20–30 word banks, 5 sentence-making prompts, right-word exercises, and a 10-question quiz."}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-pill bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Golden Sequence Trick + Daily Routine */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-panel bg-muted space-y-1">
            <div className="flex items-center gap-2 text-label text-foreground font-semibold">
              <HugeiconsIcon icon={SparklesIcon} size={16} className="text-primary" />
              <span>Golden Sequence Trick</span>
            </div>
            <p className={cn("text-meta text-muted-foreground", isBangla && "text-subtitle-bn")}>
              {isBangla
                ? '"Tense first, then Sentence, then Transformation." — Stage 1 থেকে 8 ধারাবাহিকভাবে এগোলে Voice বা Narration সহজ হয়ে যাবে।'
                : locale === "hi"
                ? '"Tense first, then Sentence, then Transformation." — Stage 1 से 8 तक क्रम से आगे बढ़ें।'
                : '"Tense first, then Sentence, then Transformation." — Follow Stages 1–8 in sequence.'}
            </p>
          </div>

          <div className="p-3.5 rounded-panel bg-muted space-y-1">
            <div className="flex items-center gap-2 text-label text-foreground font-semibold">
              <HugeiconsIcon icon={Clock01Icon} size={16} className="text-primary" />
              <span>Daily Routine (30–45 min)</span>
            </div>
            <p className={cn("text-meta text-muted-foreground", isBangla && "text-subtitle-bn")}>
              {isBangla
                ? "প্রতিদিন ১টি ছোট টপিক (৩০–৪৫ মিনিট): নিয়ম ও শব্দ শিখুন → ৫টি বাক্য বানান → কুইজ দিন। পরের দিন ৫ মিনিট রিভাইজ করুন।"
                : locale === "hi"
                ? "रोज़ 1 टॉपिक (30–45 मिनट): नियम सीखें → 5 वाक्य बनाएं → क्विज़ दें। अगले दिन 5 मिनट दोहराएं।"
                : "One topic per day (30–45 min): Study rules & words → Make 5 sentences → Take the 10-question quiz."}
            </p>
          </div>
        </div>
      </Card>

      {/* Level Priority Filter */}
      <Card className="p-4 sm:p-5 bg-card border border-border space-y-3">
        <div className="flex items-center gap-2 text-label text-foreground font-semibold">
          <HugeiconsIcon icon={Layers01Icon} size={18} className="text-primary" />
          <span>Focus by Goal / Level Priority</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {LEVEL_PRIORITIES.map((lvl) => {
            const isActive = selectedLevel === lvl.id;
            return (
              <Button
                key={lvl.id}
                type="button"
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel(lvl.id)}
              >
                {lvl.label}
              </Button>
            );
          })}
        </div>
        <p className={cn("text-meta text-muted-foreground", isBangla && "text-subtitle-bn")}>
          {activeLevelInfo.focusSummary[locale] || activeLevelInfo.focusSummary.en}
        </p>
      </Card>

      {/* 8 Stage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {GRAMMAR_STAGES.map((stage) => {
          const lessons = getLessonsByStage(stage.stageNumber);
          const doneInStage = lessons.filter((l) => completedIds.includes(l.id)).length;
          const stagePercent = lessons.length > 0 ? Math.round((doneInStage / lessons.length) * 100) : 0;
          const isRecommended =
            selectedLevel === "all" || activeLevelInfo.recommendedStages.includes(stage.stageNumber);

          return (
            <Card
              key={stage.stageNumber}
              className={cn(
                "p-5 sm:p-6 bg-card border border-border flex flex-col justify-between gap-4 transition-all",
                !isRecommended && "opacity-60"
              )}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Tag variant="brand" size="sm">
                      Stage {stage.stageNumber}
                    </Tag>
                    <Pill variant="neutral" size="sm">
                      {stage.focusTag}
                    </Pill>
                    {isRecommended && selectedLevel !== "all" && (
                      <Tag variant="success" size="sm">
                        Priority
                      </Tag>
                    )}
                  </div>
                  <Pill variant={doneInStage === lessons.length && lessons.length > 0 ? "brand" : "neutral"} size="sm">
                    {doneInStage} / {lessons.length} Lessons
                  </Pill>
                </div>

                <div className="space-y-1">
                  <h2 className="text-card-title text-foreground font-semibold">{stage.title}</h2>
                  <p className="text-meta text-primary">{stage.subtitle}</p>
                </div>

                <p
                  className={cn(
                    "text-meta text-muted-foreground leading-relaxed",
                    ruleLocale === "bn" && "text-subtitle-bn"
                  )}
                  dir={isRtlLanguage(ruleLocale) ? "rtl" : "ltr"}
                >
                  {getTranslatedText(stage.description, ruleLocale)}
                </p>

                {/* Lesson Chips Preview */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {lessons.slice(0, 5).map((lesson) => {
                    const isDone = completedIds.includes(lesson.id);
                    return (
                      <Pill key={lesson.id} variant={isDone ? "brand" : "neutral"} size="sm">
                        {isDone && (
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} className="mr-1 inline" />
                        )}
                        {lesson.title.replace(/^\d+\.\s*/, "")}
                      </Pill>
                    );
                  })}
                  {lessons.length > 5 && (
                    <Pill variant="neutral" size="sm">
                      +{lessons.length - 5} more
                    </Pill>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-border">
                <div className="w-full h-1.5 rounded-pill bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${stagePercent}%` }}
                  />
                </div>
                <Link href={`/grammar-path/${stage.slug}`} className="block">
                  <Button type="button" className="w-full justify-between">
                    <span>{doneInStage > 0 ? "Continue Lesson" : "Start Lesson"}</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
}
