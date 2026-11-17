"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayCircleIcon,
  ArrowRight01Icon,
  BookOpen01Icon,
  Clock01Icon,
  FireIcon,
  CheckmarkCircle02Icon,
  CompassIcon,
  Message01Icon,
} from "@hugeicons/core-free-icons";

export function DashboardClient() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    let resolvedCompleted: string[] = [];
    try {
      const storedCompleted = localStorage.getItem("ecp_completed_steps");
      if (storedCompleted) {
        const parsed = JSON.parse(storedCompleted);
        if (Array.isArray(parsed)) resolvedCompleted = parsed;
      }
    } catch {
      // LocalStorage unavailable
    }

    queueMicrotask(() => {
      setCompletedSteps(resolvedCompleted);
      setIsClient(true);
    });
  }, []);

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const currentDayIndex = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="w-full pb-16">
      {/* 1. Curved Deep-Violet Header Band (Reference 1 Layout Motif: Full Width of Main Area) */}
      <div className="w-full bg-primary text-primary-foreground rounded-b-[32px] pt-8 pb-14 md:pt-10 md:pb-16 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
                Good day, Learner! 👋
              </h1>
              <p className="text-sm md:text-base text-white/80 mt-1.5 font-medium">
                Ready to practice real-life English conversation today?
              </p>
            </div>

            {/* Gamification Stats: Streak & Goal Ring inside Header Band */}
            <div className="flex items-center gap-3.5 flex-wrap">
              {/* Streak Tracker with 7-Day Dots */}
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-[var(--brand-950)] flex items-center justify-center shrink-0 shadow-xs">
                  <HugeiconsIcon icon={FireIcon} size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">1 Day Streak</span>
                    <span className="text-sm font-medium text-white/80">• Active</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {daysOfWeek.map((day, idx) => {
                      const isDone = idx === currentDayIndex;
                      return (
                        <span
                          key={idx}
                          title={`${day}: ${isDone ? "Completed" : "Upcoming"}`}
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all ${
                            isDone
                              ? "bg-amber-400 text-[var(--brand-950)] shadow-xs scale-105"
                              : "bg-white/20 text-white/80"
                          }`}
                        >
                          {day}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Daily Goal Progress Ring */}
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xs">
                <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                  <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/20"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-amber-300 transition-all duration-500"
                      strokeDasharray="70, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-white">70%</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Daily Goal</p>
                  <p className="text-sm text-white/80 font-medium">7 / 10 mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area Overlapping Header Band by 24px */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-6 relative z-10 space-y-8">
        {/* 2. Today's Recommended Conversation (Hero with Rainbow Border & Sunny Yellow CTA) */}
        <div className="rainbow-border rounded-2xl">
          <Card
            data-topic="shopping"
            className="relative overflow-hidden border border-border bg-card shadow-sm p-6 md:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Recommendation Info & CTA */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="accent" size="md">
                    ✨ Daily Recommendation
                  </Badge>
                  <Badge variant="secondary" size="md">
                    A2 • Elementary
                  </Badge>
                  <Badge variant="neutral" size="md">
                    Shopping & Money
                  </Badge>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold font-heading text-foreground tracking-tight">
                    Asking for a Price & Product Details
                  </h2>
                  <p className="text-base font-medium text-muted-foreground font-bangla mt-1">
                    দোকানে কোনো পণ্যের দাম ও বিবরণ জানতে চাওয়া
                  </p>
                </div>

                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Master natural retail phrases to inquire about sizes, verify discount offers, and confirm prices without hesitation.
                </p>

                <div className="flex items-center gap-5 text-sm text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <HugeiconsIcon icon={Clock01Icon} size={16} className="text-primary" /> 5-8 minutes
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <HugeiconsIcon icon={BookOpen01Icon} size={16} className="text-primary" /> 8 dialogue turns
                  </span>
                </div>

                <div className="pt-2">
                  <Link href="/conversations/asking-price-product-details">
                    <Button variant="cta" size="lg" className="btn-press w-full sm:w-auto shadow-sm gap-2">
                      <HugeiconsIcon icon={PlayCircleIcon} size={20} />
                      <span>Start Conversation</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Mini Interactive Dialogue Preview (Replaces Empty Space) */}
              <div className="lg:col-span-5 bg-[var(--topic-surface)] rounded-2xl p-5 border border-border space-y-3">
                <div className="flex items-center justify-between text-sm font-bold text-[var(--topic-ink)] uppercase tracking-wider pb-2 border-b border-border">
                  <span className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Message01Icon} size={16} />
                    Dialogue Preview
                  </span>
                  <span className="text-sm font-semibold">2 turns</span>
                </div>

                {/* Bubble 1: Customer (Speaker 1) */}
                <div className="flex items-start gap-2.5 text-left">
                  <span className="w-8 h-8 rounded-full bg-[var(--brand-800)] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                    C
                  </span>
                  <div className="bg-[var(--brand-100)] border border-border rounded-2xl rounded-tl-none p-3.5 shadow-2xs text-sm max-w-[88%]">
                    <p className="font-semibold text-[var(--brand-950)]">
                      &ldquo;Excuse me, could you tell me how much this costs?&rdquo;
                    </p>
                    <p className="text-sm text-muted-foreground font-bangla mt-1 font-medium">
                      মাফ করবেন, এটার দাম কত বলতে পারেন?
                    </p>
                  </div>
                </div>

                {/* Bubble 2: Shop Assistant (Speaker 2) */}
                <div className="flex items-start gap-2.5 justify-end text-right">
                  <div className="bg-[var(--topic-tile)] border border-border rounded-2xl rounded-tr-none p-3.5 shadow-2xs text-sm max-w-[88%] text-left">
                    <p className="font-semibold text-[var(--topic-ink)]">
                      &ldquo;Certainly! It is forty-five dollars with a 10% discount.&rdquo;
                    </p>
                    <p className="text-sm text-[var(--topic-ink)]/80 font-bangla mt-1 font-medium">
                      অবশ্যই! এটা ৪৫ ডলার, এবং ১০% ছাড় আছে।
                    </p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-sun-500 text-brand-950 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                    S
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 3. Explore Modules Grid (Soft Pastel Topic Panels - Reference 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Everyday English Module (Mint Topic) */}
          <Card
            data-topic="social"
            className="card-hover flex flex-col justify-between p-6 md:p-7 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl emoji-tile flex items-center justify-center text-2xl font-bold shadow-2xs">
                  ☕
                </div>
                <Badge variant="brand" size="md">20 Real Scenarios</Badge>
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground">
                Everyday & Social English
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mt-1.5 leading-relaxed">
                Shopping, public transport, airport navigation, dining out, and daily social communications.
              </p>

              {/* Progress bar motif */}
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-sm font-semibold text-[var(--topic-ink)] mb-1.5">
                  <span>Active Track Progress</span>
                  <span>40% complete</span>
                </div>
                <div className="h-2 w-full bg-[var(--topic-tile)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--topic-accent)] rounded-full w-[40%]" />
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-border">
              <Link href="/explore">
                <Button variant="default" size="md" className="btn-press w-full justify-between">
                  <span>Browse Everyday Library</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                </Button>
              </Link>
            </div>
          </Card>

          {/* Professional English Module (Lilac Topic) */}
          <Card
            data-topic="professional"
            className="card-hover flex flex-col justify-between p-6 md:p-7 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl emoji-tile flex items-center justify-center text-2xl font-bold shadow-2xs">
                  💼
                </div>
                <Badge variant="accent" size="md">30+ Job Roles</Badge>
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground">
                Professional Conversations
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mt-1.5 leading-relaxed">
                Job-specific dialogues: UI/UX Designer, Software Engineer, Product Manager, Doctor, and Client Calls.
              </p>

              {/* Progress bar motif */}
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex items-center justify-between text-sm font-semibold text-[var(--topic-ink)] mb-1.5">
                  <span>Professional Track</span>
                  <span>15% complete</span>
                </div>
                <div className="h-2 w-full bg-[var(--topic-tile)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--topic-accent)] rounded-full w-[15%]" />
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-border">
              <Link href="/explore?category=workplace-business">
                <Button variant="outline" size="md" className="btn-press w-full justify-between">
                  <span>Explore Professional Paths</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* 4. Active Progress or Actionable Empty State */}
        {isClient && completedSteps.length > 0 ? (
          <Card data-topic="shopping" className="card-hover p-6 md:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl emoji-tile flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold font-heading text-foreground">
                      Continue Where You Left Off
                    </h3>
                    <Badge variant="success" size="md">
                      {completedSteps.length} Completed
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Step 02: Asking for a Discount & Payment Method
                  </p>
                </div>
              </div>

              <Link href="/explore/category/shopping-and-money">
                <Button variant="cta" size="md" className="btn-press w-full sm:w-auto gap-2 shrink-0">
                  <span>Resume Practice</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="border border-dashed border-border bg-card p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={CompassIcon} size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-heading text-foreground">
                    Start Your First Conversation
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    You haven&apos;t started any dialogues yet. Choose a real-world scenario from the library to track your vocabulary and fluency progress!
                  </p>
                </div>
              </div>

              <Link href="/explore" className="w-full sm:w-auto">
                <Button variant="cta" size="md" className="btn-press w-full sm:w-auto gap-2">
                  <HugeiconsIcon icon={PlayCircleIcon} size={18} />
                  <span>Start First Conversation</span>
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
