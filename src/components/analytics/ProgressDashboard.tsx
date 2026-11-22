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
  const [stats] = useState<LearnerRawStats>(INITIAL_LEARNER_STATS);
  const [context] = useState<RecommendationContext>(INITIAL_CONTEXT);

  const metrics = computeProgressMetrics(stats);
  const recommendations = generatePersonalizedRecommendations(context);

  const kpis = [
    {
      label: "Daily Streak",
      value: `${metrics.currentStreak}`,
      unit: "দিন সক্রিয়",
      subtitle: `সর্বোচ্চ রেকর্ড: ${metrics.bestStreak} দিন`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: FireIcon as any,
      colorClass: "bg-warning-bg text-warning",
    },
    {
      label: "Time Practiced",
      value: `${metrics.practiceTimeMinutes}`,
      unit: "মিনিট",
      subtitle: "সাপ্তাহিক লক্ষ্য: ১০০ মিনিট",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: Time02Icon as any,
      colorClass: "bg-primary/10 text-primary",
    },
    {
      label: "Conversations",
      value: `${metrics.completedScenariosCount} / ${metrics.totalScenariosAvailable}`,
      subtitle: "শপিং ও মানি ল্যাডার সক্রিয়",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: CheckmarkCircle01Icon as any,
      colorClass: "bg-success-bg text-success",
    },
    {
      label: "Accuracy Rate",
      value: `${metrics.practiceAccuracy}%`,
      unit: "সঠিক",
      subtitle: "কুইজ ও অনুশীলন গড়",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: Target01Icon as any,
      colorClass: "bg-primary/10 text-primary",
    },
  ];

  return (
    <div className="space-y-8 max-w-container mx-auto">
      {/* Header */}
      <div className="space-y-1 pb-2 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <Tag variant="brand" size="sm">
            Milestone 3D & 3E
          </Tag>
          <Pill variant="neutral" size="sm">
            Personalised Analytics
          </Pill>
        </div>
        <h1 className="text-page-title text-foreground">
          My Learning Progress (আমার অগ্রগতি)
        </h1>
        <p className="text-meta-bn text-muted-foreground">
          আপনার ধারাবাহিকতা, শব্দভাণ্ডার আয়ত্ত করার হার এবং পরবর্তী সুপারিশকৃত পাঠের বিস্তারিত ড্যাশবোর্ড।
        </p>
      </div>

      {/* Top 4 KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="p-4 sm:p-5 bg-card rounded-card space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-meta uppercase font-sans text-muted-foreground">
                {kpi.label}
              </span>
              <div className={`p-2 rounded-pill ${kpi.colorClass}`}>
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
              <p className="text-chip text-muted-foreground mt-1">
                {kpi.subtitle}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Vocabulary Retention & Weekly Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vocabulary Retention Stages (SM-2 Breakdown) */}
        <Card className="p-5 sm:p-6 bg-card rounded-card space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-pill bg-primary/10 text-primary">
                <HugeiconsIcon icon={BookOpen01Icon} size={18} />
              </div>
              <div>
                <h3 className="text-card-title text-foreground">
                  Vocabulary Retention (শব্দভাণ্ডার আয়ত্ত)
                </h3>
                <p className="text-meta text-muted-foreground">
                  Spaced Repetition (SM-2) Stage Distribution
                </p>
              </div>
            </div>
            <Pill variant="success" size="sm">
              {metrics.vocabulary.retentionRate}% Retained
            </Pill>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-chip text-muted-foreground">
              <span>মোট সংরক্ষিত শব্দ: <strong className="text-foreground font-mono">{metrics.vocabulary.totalSaved}</strong></span>
              <span>স্থায়ী ধারণ ক্ষমতা: <strong className="text-success font-mono">{metrics.vocabulary.retentionRate}%</strong></span>
            </div>

            {/* Stage Progress Breakdown */}
            <div className="space-y-3">
              {[
                { label: "Learning (শুরু করেছি / Stages 0–2)", count: metrics.vocabulary.learning, barColor: "bg-primary/40" },
                { label: "Reviewing (নিয়মিত চর্চা / Stages 3–5)", count: metrics.vocabulary.reviewing, barColor: "bg-primary" },
                { label: "Mastered (আয়ত্তে এসেছে / Stages 6–8)", count: metrics.vocabulary.mastered, barColor: "bg-success" },
              ].map((stage, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <div className="flex justify-between text-chip">
                    <span className="text-foreground">{stage.label}</span>
                    <span className="font-mono text-muted-foreground">{stage.count} words</span>
                  </div>
                  <div className="h-2 rounded-pill bg-muted overflow-hidden">
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

            <div className="pt-2 flex justify-end">
              <Link href="/vocabulary">
                <Button variant="outline" size="sm" className="rounded-control text-chip gap-1.5 cursor-pointer">
                  <span>ভোকাবুলারি অনুশীলন করুন</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Weekly Practice Activity */}
        <Card className="p-5 sm:p-6 bg-card rounded-card space-y-4 shadow-xs">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-pill bg-warning-bg text-warning">
                <HugeiconsIcon icon={Award01Icon} size={18} />
              </div>
              <div>
                <h3 className="text-card-title text-foreground">
                  Weekly Activity (সাপ্তাহিক অনুশীলন)
                </h3>
                <p className="text-meta text-muted-foreground">
                  Last 7 Days Practice Minutes
                </p>
              </div>
            </div>
            <Pill variant="neutral" size="sm">
              7 Days Active
            </Pill>
          </div>

          <div className="space-y-6 pt-2">
            {/* Visual Bar Columns */}
            <div className="grid grid-cols-7 gap-2 items-end h-32 pt-4">
              {metrics.weeklyActivity.map((day, idx) => {
                const heightPercent = Math.min(100, (day.minutes / 25) * 100);

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="font-mono text-chip text-muted-foreground">
                      {day.minutes > 0 ? `${day.minutes}m` : "-"}
                    </span>
                    <div className="w-full bg-muted/60 rounded-control h-20 flex items-end overflow-hidden p-0.5">
                      <div
                        className={
                          day.isToday
                            ? "w-full bg-primary rounded-control transition-all"
                            : "w-full bg-primary/40 rounded-control transition-all"
                        }
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span
                      className={
                        day.isToday
                          ? "text-chip text-primary"
                          : "text-chip text-muted-foreground"
                      }
                    >
                      {day.dayBn}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-meta-bn text-muted-foreground">
              প্রতিদিন অন্তত ১০ মিনিট অনুশীলন করলে ফ্লুয়েন্সি ও স্মৃতিশক্তি সবচেয়ে দ্রুত বৃদ্ধি পায়।
            </p>
          </div>
        </Card>
      </div>

      {/* Personalized Learning Recommendations (Milestone 3D) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={SparklesIcon} size={20} className="text-primary" />
            <h2 className="text-section-title text-foreground">
              Recommended Next Steps (আপনার জন্য প্রস্তাবিত পাঠ)
            </h2>
          </div>
          <Tag variant="brand" size="sm">
            AI Personalized
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
                  <h4 className="text-lead text-foreground font-sans leading-snug">
                    {rec.title}
                  </h4>
                  <p className="text-meta-bn text-muted-foreground">
                    {rec.titleBn}
                  </p>
                </div>

                <p className="text-chip text-muted-foreground leading-relaxed pt-1">
                  <strong className="text-foreground">কেন প্রস্তাবিত?</strong> {rec.reasonBn}
                </p>
              </div>

              <div className="pt-2">
                <Link href={rec.actionUrl} className="w-full block">
                  <Button variant="default" size="sm" className="w-full rounded-control gap-1.5 cursor-pointer">
                    <span>অনুশীলন শুরু করুন</span>
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
