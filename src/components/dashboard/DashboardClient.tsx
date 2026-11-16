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
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* 1. Greeting & Tracker Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--ecp-brand-950)] dark:text-foreground">
            Good day, Learner! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ready to practice real-life English conversation today?
          </p>
        </div>

        {/* Gamification Stats: Streak & Goal Ring */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Streak Tracker with 7-Day Dots */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-card border border-border shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={FireIcon} size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground">1 Day Streak</span>
                <span className="text-[10px] text-muted-foreground">• Active</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {daysOfWeek.map((day, idx) => {
                  const isDone = idx === currentDayIndex;
                  return (
                    <span
                      key={idx}
                      title={`${day}: ${isDone ? "Completed" : "Upcoming"}`}
                      className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[9px] font-bold transition-all ${
                        isDone
                          ? "bg-amber-500 text-white shadow-xs scale-110"
                          : "bg-muted text-muted-foreground/60"
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
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-card border border-border shadow-xs">
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[var(--ecp-brand-800)] dark:text-primary transition-all duration-500"
                  strokeDasharray="70, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[9px] font-bold text-foreground">70%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Daily Goal</p>
              <p className="text-[11px] text-muted-foreground">7 / 10 mins</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Today's Recommended Conversation (Hero with Rainbow Border & Mini Preview) */}
      <div className="rainbow-border rounded-2xl">
        <Card className="relative overflow-hidden border border-border bg-card shadow-sm p-6 md:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: Recommendation Info & CTA */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent" size="sm" className="font-semibold">
                  ✨ Daily Recommendation
                </Badge>
                <Badge variant="secondary" size="sm">
                  A2 • Elementary
                </Badge>
                <Badge variant="neutral" size="sm">
                  Shopping & Money
                </Badge>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                  Asking for a Price & Product Details
                </h2>
                <p className="text-sm font-medium text-muted-foreground font-[var(--ecp-font-bangla)] mt-0.5">
                  দোকানে কোনো পণ্যের দাম ও বিবরণ জানতে চাওয়া
                </p>
              </div>

              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Master natural retail phrases to inquire about sizes, verify discount offers, and confirm prices without hesitation.
              </p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={Clock01Icon} size={15} className="text-primary" /> 5-8 minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={BookOpen01Icon} size={15} className="text-primary" /> 8 dialogue turns
                </span>
              </div>

              <div className="pt-2">
                <Link href="/conversations/asking-price-product-details">
                  <Button variant="default" size="lg" className="btn-press w-full sm:w-auto shadow-sm gap-2">
                    <HugeiconsIcon icon={PlayCircleIcon} size={18} />
                    <span>Start Conversation</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Mini Interactive Dialogue Preview (Replaces Empty Space) */}
            <div className="lg:col-span-5 bg-muted/40 rounded-xl p-4 border border-border/80 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border/60">
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={Message01Icon} size={13} />
                  Dialogue Preview
                </span>
                <span className="text-[10px] text-primary lowercase font-semibold">2 turns</span>
              </div>

              {/* Bubble 1: Customer */}
              <div className="flex items-start gap-2 text-left">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  C
                </span>
                <div className="bg-card border border-border/70 rounded-xl rounded-tl-none p-2.5 shadow-2xs text-xs text-foreground max-w-[90%]">
                  <p className="font-medium">
                    &ldquo;Excuse me, could you tell me how much this costs?&rdquo;
                  </p>
                  <p className="text-[11px] text-muted-foreground font-[var(--ecp-font-bangla)] mt-0.5">
                    মাফ করবেন, এটার দাম কত বলতে পারেন?
                  </p>
                </div>
              </div>

              {/* Bubble 2: Shop Assistant */}
              <div className="flex items-start gap-2 justify-end text-right">
                <div className="bg-primary/10 dark:bg-primary/20 border border-primary/20 rounded-xl rounded-tr-none p-2.5 shadow-2xs text-xs text-foreground max-w-[90%] text-left">
                  <p className="font-medium">
                    &ldquo;Certainly! It is forty-five dollars with a 10% discount.&rdquo;
                  </p>
                  <p className="text-[11px] text-muted-foreground font-[var(--ecp-font-bangla)] mt-0.5">
                    অবশ্যই! এটা ৪৫ ডলার, এবং ১০% ছাড় আছে।
                  </p>
                </div>
                <span className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  S
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Explore Modules Grid (Everyday + Professional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Everyday English Module */}
        <Card className="card-hover flex flex-col justify-between border-border bg-card">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center text-xl font-bold">
                🏡
              </div>
              <Badge variant="brand" size="sm">20 Real Scenarios</Badge>
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Everyday & Social English
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
              Shopping, public transport, airport navigation, dining out, and daily social conversations.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-border">
            <Link href="/explore">
              <Button variant="outline" size="sm" className="btn-press w-full justify-between">
                <span>Browse Everyday Library</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Professional English Module */}
        <Card className="card-hover flex flex-col justify-between border-border bg-card">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xl font-bold">
                💼
              </div>
              <Badge variant="accent" size="sm">30+ Job Roles</Badge>
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Professional Conversations
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
              Job-specific dialogues: UI/UX Designer, Software Engineer, Product Manager, Doctor, and Client Calls.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-border">
            <Link href="/explore?category=workplace-business">
              <Button variant="outline" size="sm" className="btn-press w-full justify-between">
                <span>Explore Professional Paths</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* 4. Active Progress or Actionable Empty State */}
      {isClient && completedSteps.length > 0 ? (
        <Card className="card-hover border-border bg-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    Continue Where You Left Off
                  </h3>
                  <Badge variant="success" size="sm">
                    {completedSteps.length} Completed
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Keep your momentum going! Practice the next dialogue in your active learning roadmap.
                </p>
              </div>
            </div>

            <Link href="/explore/category/shopping-and-money">
              <Button variant="default" size="sm" className="btn-press w-full sm:w-auto gap-1.5 shrink-0">
                <span>Resume Practice</span>
                <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="border border-dashed border-border bg-card/60 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={CompassIcon} size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Start Your First Conversation
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-md">
                  You haven&apos;t started any dialogues yet. Choose a real-world scenario from the library to track your vocabulary and fluency progress!
                </p>
              </div>
            </div>

            <Link href="/explore" className="w-full sm:w-auto">
              <Button variant="default" size="sm" className="btn-press w-full sm:w-auto gap-2">
                <HugeiconsIcon icon={PlayCircleIcon} size={16} />
                <span>Start First Conversation</span>
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
