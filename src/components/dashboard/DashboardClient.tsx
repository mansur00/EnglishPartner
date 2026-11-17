"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
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
      <div className="w-full bg-gradient-to-b from-brand-800 to-brand-900 dark:from-brand-900 dark:to-brand-950 text-white rounded-b-[24px] pt-8 pb-12 md:pt-10 md:pb-14 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-semibold font-heading text-white tracking-[-0.01em]">
                Good day, Learner! 👋
              </h1>
              <p className="text-sm md:text-base text-white/80 mt-1.5 font-medium">
                Ready to practice real-life English conversation today?
              </p>
            </div>

            {/* Gamification Stats: Single Combined "Today" Panel (Section 3.5) */}
            <div className="w-full md:w-auto bg-white/10 border border-white/15 rounded-[12px] p-4 text-white shadow-xs space-y-3.5 min-w-[320px] sm:min-w-[360px]">
              {/* Row 1: Streak Number + Label + 7 Weekday Markers */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={FireIcon} size={20} className="text-sun-500 shrink-0" />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-semibold leading-none text-white">1</span>
                    <span className="text-sm font-medium text-white/90">day streak</span>
                  </div>
                </div>

                {/* 7 Weekday Markers (28px) */}
                <div className="flex items-center gap-1.5">
                  {daysOfWeek.map((day, idx) => {
                    const isDone = idx === currentDayIndex;
                    const isPast = idx < currentDayIndex;
                    const isToday = idx === currentDayIndex;
                    const isFuture = idx > currentDayIndex;

                    return (
                      <span
                        key={idx}
                        title={`${day}: ${isToday ? "Today" : isDone ? "Completed" : "Upcoming"}`}
                        className={cn(
                          "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-all select-none",
                          isDone && "bg-sun-500 text-brand-950 shadow-xs",
                          !isDone && isPast && "bg-white/20 text-white/80",
                          isFuture && "border border-dashed border-white/30 text-white/50"
                        )}
                      >
                        {day}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Daily Goal with 10-Segment Minute Bar */}
              <div className="space-y-1.5 pt-1 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-white">7 / 10 min</span>
                  <span className="text-sm font-medium text-white/80">3 min to go</span>
                </div>
                {/* 10-Segment Minute Bar (8px tall, 3px gaps, rounded 2px) */}
                <div className="flex items-center gap-[3px] w-full" role="progressbar" aria-valuenow={7} aria-valuemin={0} aria-valuemax={10}>
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "h-2 flex-1 rounded-[2px] transition-colors",
                        idx < 7 ? "bg-sun-500" : "bg-white/20"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area Overlapping Header Band by 24px */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 -mt-6 relative z-10 space-y-8">
        {/* 2. Today's Recommended Conversation (Hero with Rainbow Border & Sunny Yellow CTA) */}
        <div className="rainbow-border rounded-[16px]">
          <Card
            data-topic="shopping"
            className="relative overflow-hidden border border-border bg-card shadow-sm p-6 md:p-8 rounded-[16px]"
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
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-[var(--topic-border)] bg-[var(--topic-tile)] text-[var(--topic-ink)] shadow-2xs">
                    Shopping & Money
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold font-heading text-foreground tracking-tight">
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
              <div className="lg:col-span-5 bg-[var(--topic-surface)] rounded-[12px] p-5 border border-border space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold text-[var(--topic-ink)] uppercase tracking-wider pb-2 border-b border-border">
                  <span className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Message01Icon} size={16} />
                    Dialogue Preview
                  </span>
                  <span className="text-sm font-semibold">2 turns</span>
                </div>

                {/* Bubble 1: Customer (Speaker 1) */}
                <div className="flex items-start gap-2.5 text-left">
                  <span className="w-8 h-8 rounded-full bg-[var(--brand-800)] text-white flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 shadow-xs">
                    C
                  </span>
                  <div className="bg-[var(--brand-100)] border border-border rounded-[12px] rounded-tl-[4px] p-3.5 shadow-2xs text-sm max-w-[88%]">
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
                  <div className="bg-[var(--topic-tile)] border border-border rounded-[12px] rounded-tr-[4px] p-3.5 shadow-2xs text-sm max-w-[88%] text-left">
                    <p className="font-semibold text-[var(--topic-ink)]">
                      &ldquo;Certainly! It is forty-five dollars with a 10% discount.&rdquo;
                    </p>
                    <p className="text-sm text-[var(--topic-ink)]/80 font-bangla mt-1 font-medium">
                      অবশ্যই! এটা ৪৫ ডলার, এবং ১০% ছাড় আছে।
                    </p>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-sun-500 text-brand-950 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 shadow-xs">
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
                <div className="w-12 h-12 rounded-[12px] emoji-tile flex items-center justify-center text-2xl font-semibold shadow-2xs">
                  ☕
                </div>
                <Badge variant="brand" size="md">20 Real Scenarios</Badge>
              </div>
              <h3 className="text-xl font-semibold font-heading text-foreground">
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
                <div className="w-12 h-12 rounded-[12px] emoji-tile flex items-center justify-center text-2xl font-semibold shadow-2xs">
                  💼
                </div>
                <Badge variant="accent" size="md">30+ Job Roles</Badge>
              </div>
              <h3 className="text-xl font-semibold font-heading text-foreground">
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
                        <div className="w-12 h-12 rounded-[12px] emoji-tile flex items-center justify-center shrink-0">
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold font-heading text-foreground">
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

                      <Link href="/conversations/asking-discount-and-payment" className="w-full sm:w-auto">
                        <Button variant="cta" size="md" className="btn-press w-full sm:w-auto gap-2">
                          <HugeiconsIcon icon={PlayCircleIcon} size={18} />
                          <span>Continue Step 02</span>
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ) : (
          <Card className="border border-dashed border-border bg-card p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-14 h-14 rounded-[12px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <HugeiconsIcon icon={CompassIcon} size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-heading text-foreground">
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
