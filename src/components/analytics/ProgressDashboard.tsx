"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FireIcon,
  Time02Icon,
  BookOpen01Icon,
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
  SparklesIcon,
  Target01Icon,
  Award01Icon,
} from "@hugeicons/core-free-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { Tag } from "@/components/ui/tag";
import { LocaleTitle } from "@/components/shared";
import { useTranslations } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  computeProgressMetrics,
  generatePersonalizedRecommendations,
  type LearnerRawStats,
  type RecommendationContext,
} from "@/lib/analytics/progress-metrics";

// Sample active learner state
const INITIAL_LEARNER_STATS: LearnerRawStats = {
  currentStreak: 5,
  bestStreak: 12,
  practiceTimeMinutes: 75,
  completedScenariosCount: 3,
  totalScenariosAvailable: 20,
  totalQuizAnswers: 28,
  correctQuizAnswers: 24,
  userVocabularyItems: [
    { reviewStage: 1 },
    { reviewStage: 2 },
    { reviewStage: 2 },
    { reviewStage: 3 },
    { reviewStage: 4 },
    { reviewStage: 5 },
    { reviewStage: 6 },
    { reviewStage: 7 },
  ],
  weeklyMinutes: [
    { day: "Sat", dayBn: "শনি", minutes: 10, isToday: false },
    { day: "Sun", dayBn: "রবি", minutes: 15, isToday: false },
    { day: "Mon", dayBn: "সোম", minutes: 12, isToday: false },
    { day: "Tue", dayBn: "মঙ্গল", minutes: 18, isToday: false },
    { day: "Wed", dayBn: "বুধ", minutes: 20, isToday: false },
    { day: "Thu", dayBn: "বৃহঃ", minutes: 0, isToday: false },
    { day: "Fri", dayBn: "শুক্র", minutes: 15, isToday: true },
  ],
};

const INITIAL_CONTEXT: RecommendationContext = {
  lastCompletedStepSlug: "shopping-money-step-01",
  lastCompletedStepNumber: 1,
  nextStepSlug: "shopping-money-step-02",
  nextStepTitle: "Asking for a Discount",
  dueVocabularyCount: 3,
  quizAccuracy: 86,
  hasTriedRoleplay: false,
};

export function ProgressDashboard() {
  const { locale, t } = useTranslations();
  const [stats] = useState<LearnerRawStats>(INITIAL_LEARNER_STATS);
  const [context] = useState<RecommendationContext>(INITIAL_CONTEXT);

  const metrics = computeProgressMetrics(stats);
  const recommendations = generatePersonalizedRecommendations(context);

  const kpis = [
    {
      label: t("progress.streakLabel"),
      value: `${metrics.currentStreak}`,
      unit: t("progress.streakUnit"),
      subtitle: t("progress.streakBest").replace("{count}", String(metrics.bestStreak)),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: FireIcon as any,
      colorClass: "bg-warning-bg text-warning",
      accentBorder: "border-warning/30",
    },
    {
      label: t("progress.timePracticedLabel"),
      value: `${metrics.practiceTimeMinutes}`,
      unit: t("progress.timeUnit"),
      subtitle: t("progress.timeTarget"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: Time02Icon as any,
      colorClass: "bg-primary/10 text-primary",
      accentBorder: "border-primary/25",
    },
    {
      label: t("progress.conversationsLabel"),
      value: `${metrics.completedScenariosCount} / ${metrics.totalScenariosAvailable}`,
      subtitle: t("progress.conversationsActive"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: CheckmarkCircle01Icon as any,
      colorClass: "bg-success-bg text-success",
      accentBorder: "border-success/30",
    },
    {
      label: t("progress.accuracyLabel"),
      value: `${metrics.practiceAccuracy}%`,
      unit: t("progress.accuracyUnit"),
      subtitle: t("progress.accuracySubtitle"),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: Target01Icon as any,
      colorClass: "bg-primary/10 text-primary",
      accentBorder: "border-primary/25",
    },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Unified Header Card */}
      <Card className="p-5 sm:p-6 bg-card border border-border shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Pill variant="brand" size="sm">
                {locale === "bn" ? "ব্যক্তিগত বিশ্লেষণ" : "Personalised Analytics"}
              </Pill>
            </div>
            <LocaleTitle
              as="h1"
              titleEn="My Learning Progress"
              titleBn="আমার অগ্রগতি"
              className="text-page-title text-foreground"
            />
            <p className={cn("text-meta text-muted-foreground", locale === "bn" && "text-bangla")}>
              {t("progress.subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link href="/daily-practice">
              <Button variant="cta" size="sm" className="gap-1.5 cursor-pointer">
                <span>{locale === "bn" ? "দৈনিক অনুশীলন" : "Daily Practice"}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
              </Button>
            </Link>
            <Link href="/quiz">
              <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer">
                <span>{locale === "bn" ? "কুইজ দিন" : "Take Quiz"}</span>
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Top 4 KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <Card
            key={idx}
            className={cn(
              "p-4 sm:p-5 bg-card rounded-card border flex flex-col justify-between space-y-3 shadow-xs",
              kpi.accentBorder
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-meta uppercase font-sans text-muted-foreground">
                {kpi.label}
              </span>
              <div className={cn("size-9 rounded-control flex items-center justify-center shrink-0", kpi.colorClass)}>
                <HugeiconsIcon icon={kpi.icon} size={18} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-stat font-mono text-foreground leading-none">
                  {kpi.value}
                </span>
                {kpi.unit && (
                  <span className="text-meta-bn text-muted-foreground">{kpi.unit}</span>
                )}
              </div>
              <p className="text-chip text-muted-foreground mt-1.5">
                {kpi.subtitle}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Vocabulary Retention & Weekly Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vocabulary Retention Stages (SM-2 Breakdown) */}
        <Card className="p-5 sm:p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-2 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={BookOpen01Icon} size={18} />
                </div>
                <div>
                  <LocaleTitle
                    as="h3"
                    titleEn="Vocabulary Retention"
                    titleBn="শব্দভাণ্ডার ধারণ ক্ষমতা"
                    className="text-card-title text-foreground"
                  />
                  <p className="text-meta text-muted-foreground">
                    {t("progress.retentionSubtitle")}
                  </p>
                </div>
              </div>
              <Pill variant="success" size="sm" className="shrink-0">
                {metrics.vocabulary.retentionRate}% {t("progress.retained")}
              </Pill>
            </div>

            <div className="flex justify-between items-center text-chip text-muted-foreground">
              <span>{t("progress.totalSaved")}: <strong className="text-foreground font-mono">{metrics.vocabulary.totalSaved}</strong></span>
              <span>{t("progress.retained")}: <strong className="text-success font-mono">{metrics.vocabulary.retentionRate}%</strong></span>
            </div>

            {/* Stage Progress Breakdown */}
            <div className="space-y-3">
              {[
                { label: t("progress.stageLearning"), count: metrics.vocabulary.learning, barColor: "bg-chart-4" },
                { label: t("progress.stageReviewing"), count: metrics.vocabulary.reviewing, barColor: "bg-warning" },
                { label: t("progress.stageMastered"), count: metrics.vocabulary.mastered, barColor: "bg-chart-3" },
              ].map((stage, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <div className="flex justify-between text-chip">
                    <span className={cn("text-foreground", locale === "bn" && "text-bangla")}>{stage.label}</span>
                    <span className="font-mono text-muted-foreground">{stage.count} words</span>
                  </div>
                  <div className="h-2.5 rounded-pill bg-muted/70 overflow-hidden">
                    <div
                      className={`h-full ${stage.barColor} rounded-pill transition-all`}
                      style={{
                        width: `${(stage.count / Math.max(1, metrics.vocabulary.totalSaved)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border/60 flex justify-end">
            <Link href="/vocabulary">
              <Button variant="default" size="sm" className="rounded-control text-chip gap-1.5 cursor-pointer">
                <span className={locale === "bn" ? "text-bangla" : ""}>{t("progress.practiceVocabBtn")}</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Weekly Practice Activity */}
        <Card className="p-5 sm:p-6 bg-card border border-border rounded-card flex flex-col justify-between space-y-4 shadow-xs">
          <div className="flex justify-between items-center gap-2 pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-control bg-warning-bg text-warning flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Award01Icon} size={18} />
              </div>
              <div>
                <LocaleTitle
                  as="h3"
                  titleEn="Weekly Activity"
                  titleBn="সাপ্তাহিক সক্রিয়তা"
                  className="text-card-title text-foreground"
                />
                <p className="text-meta text-muted-foreground">
                  {t("progress.weeklyActivitySubtitle")}
                </p>
              </div>
            </div>
            <Pill variant="brand" size="sm" className="shrink-0">
              7 {t("progress.daysActive")}
            </Pill>
          </div>

          <div className="space-y-6 pt-2">
            {/* Visual Bar Columns */}
            <div className="grid grid-cols-7 gap-2 items-end h-32 pt-4">
              {metrics.weeklyActivity.map((day, idx) => {
                const heightPercent = Math.min(100, (day.minutes / 25) * 100);
                const dayLabel = locale === "bn" ? day.dayBn : day.day;

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="font-mono text-chip text-muted-foreground">
                      {day.minutes > 0 ? `${day.minutes}m` : "-"}
                    </span>
                    <div className="w-full bg-muted/60 rounded-control h-20 flex items-end overflow-hidden p-0.5">
                      <div
                        className={
                          day.isToday
                            ? "w-full bg-chart-2 rounded-control transition-all"
                            : "w-full bg-chart-2/60 rounded-control transition-all"
                        }
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span
                      className={
                        day.isToday
                          ? "text-chip text-warning"
                          : "text-chip text-muted-foreground"
                      }
                    >
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className={cn("text-meta text-muted-foreground", locale === "bn" && "text-bangla")}>
              {t("progress.weeklyTip")}
            </p>
          </div>
        </Card>
      </div>

      {/* Personalized Learning Recommendations (Milestone 3D) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={SparklesIcon} size={20} className="text-primary" />
            <LocaleTitle
              as="h2"
              titleEn="Recommended Next Steps"
              titleBn="আপনার জন্য প্রস্তাবিত পাঠ"
              className="text-section-title text-foreground"
            />
          </div>
          <Tag variant="brand" size="sm">
            {t("progress.personalizedTag")}
          </Tag>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec) => (
            <Card
              key={rec.id}
              className="p-5 bg-card rounded-card space-y-3 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Pill
                    variant={
                      rec.priority === "high" ? "brand" : rec.badge === "Interactive" ? "accent" : "neutral"
                    }
                    size="sm"
                  >
                    {rec.badge}
                  </Pill>
                  <Tag variant="outline" size="sm">
                    {rec.type.replace("_", " ")}
                  </Tag>
                </div>

                <div className="space-y-0.5">
                  <LocaleTitle
                    as="h4"
                    titleEn={rec.title}
                    titleBn={rec.titleBn}
                    className="text-lead text-foreground font-sans leading-snug"
                  />
                </div>

                <p className="text-chip text-muted-foreground leading-relaxed pt-1">
                  <strong className="text-foreground">
                    {locale === "bn" ? "কেন প্রস্তাবিত?" : "Why recommended?"}
                  </strong>{" "}
                  {locale === "bn" ? rec.reasonBn : rec.reason}
                </p>
              </div>

              <div className="pt-2">
                <Link href={rec.actionUrl} className="w-full block">
                  <Button variant="default" size="sm" className="w-full rounded-control gap-1.5 cursor-pointer">
                    <span className={locale === "bn" ? "text-bangla" : ""}>
                      {t("progress.startPractice")}
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
