"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
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
      {/* Compact Header & Progress Overview */}
      <Card className="p-5 sm:p-6 bg-card border border-border space-y-3.5 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Tag variant="brand" size="sm">
            8 Stages · {totalCount} Lessons
          </Tag>
          <Pill variant="brand" size="sm">
            {completedCount} / {totalCount} Completed ({progressPercent}%)
          </Pill>
        </div>

        <div className="space-y-1">
          <LocaleTitle
            as="h1"
            titleEn="Grammar Learning Path"
            titleBn="গ্রামার লার্নিং পাথ"
            className="text-page-title text-foreground"
          />
          <p className={cn("text-meta text-muted-foreground", isBangla && "text-subtitle-bn")}>
            {isBangla
              ? "সহজ থেকে অ্যাডভান্সড পর্যন্ত ৮টি ধাপে সম্পূর্ণ ইংরেজি গ্রামার — প্রতিটি লেসনে বিস্তারিত নিয়ম, উদাহরণ ও কুইজ।"
              : locale === "hi"
              ? "बेसिक से एडवांस्ड तक 8 चरणों में विस्तृत अंग्रेजी ग्रामर।"
              : "Master English grammar step by step across 8 stages — rules, examples, practice, and quizzes."}
          </p>
        </div>

        <div className="w-full h-2 rounded-pill bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center gap-2 text-chip text-muted-foreground pt-0.5">
          <HugeiconsIcon icon={SparklesIcon} size={15} className="text-primary shrink-0" />
          <span className={cn(isBangla && "text-bangla")}>
            {isBangla
              ? '"Tense first, then Sentence, then Transformation" — প্রতিদিন ১টি লেসন (৩০–৪৫ মি.) অনুশীলন করুন।'
              : '"Tense first, then Sentence, then Transformation" — 1 lesson/day (30–45 min).'}
          </span>
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

      {/* Clean 8 Stage Cards Grid */}
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
                "p-5 bg-card border border-border flex flex-col justify-between gap-4 transition-all",
                !isRecommended && "opacity-60"
              )}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Tag variant="brand" size="sm">
                      Stage {stage.stageNumber}
                    </Tag>
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

                <h2 className="text-card-title text-foreground font-semibold">{stage.title}</h2>

                <p
                  className={cn(
                    "text-meta text-muted-foreground line-clamp-2",
                    ruleLocale === "bn" && "text-bangla"
                  )}
                  dir={isRtlLanguage(ruleLocale) ? "rtl" : "ltr"}
                >
                  {getTranslatedText(stage.description, ruleLocale)}
                </p>
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
