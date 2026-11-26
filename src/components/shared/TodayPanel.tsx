"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { t, useLocale } from "@/lib/i18n";
import { HugeiconsIcon } from "@hugeicons/react";
import { FireIcon } from "@hugeicons/core-free-icons";

export interface TodayPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  streak?: number;
  minutesCompleted?: number;
  minutesGoal?: number;
  variant?: "band" | "card";
}

export function TodayPanel({
  className,
  streak = 1,
  minutesCompleted = 7,
  minutesGoal = 10,
  variant = "band",
  ...props
}: TodayPanelProps) {
  const locale = useLocale();
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const currentDayIndex = (new Date().getDay() + 6) % 7; // Monday = 0
  const remainingMinutes = Math.max(0, minutesGoal - minutesCompleted);

  const isCard = variant === "card";

  return (
    <div
      className={cn(
        "w-full md:w-auto rounded-panel p-4 shadow-xs space-y-3.5 min-w-0 sm:min-w-panel",
        isCard
          ? "bg-card text-foreground shadow-card"
          : "bg-band-panel text-band-panel-ink",
        className
      )}
      {...props}
    >
      {/* Row 1: Streak Number + Label + 7 Weekday Markers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={FireIcon} size={20} className="text-sun-500 shrink-0" />
          <div className="flex items-center gap-1.5">
            <span className={cn("text-stat leading-none", isCard ? "text-foreground" : "text-band-panel-ink")}>
              {streak}
            </span>
            <span className={cn("text-meta leading-none", isCard ? "text-muted-foreground" : "text-band-panel-ink/90")}>
              {t("dashboard.dayStreak", locale)}
            </span>
          </div>
        </div>

        {/* 7 Weekday Markers */}
        <div className="flex items-center justify-between sm:justify-start gap-1.5 w-full sm:w-auto">
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
                  "inline-flex items-center justify-center size-marker rounded-pill text-chip select-none",
                  isDone && "bg-sun-500 text-brand-950 shadow-xs",
                  !isDone && isPast && (isCard ? "bg-muted text-muted-foreground" : "bg-band-panel-past text-band-panel-ink/80"),
                  isFuture && (isCard ? "border border-dashed border-border text-muted-foreground/60" : "border border-dashed border-band-panel-marker-border text-band-panel-ink/50")
                )}
              >
                {day}
              </span>
            );
          })}
        </div>
      </div>

      {/* Row 2: Daily Goal with 10-Segment Minute Bar */}
      <div className={cn("space-y-1.5 pt-1 border-t", isCard ? "border-border" : "border-band-panel-border")}>
        <div className="flex items-center justify-between">
          <span className={cn("text-card-title", isCard ? "text-foreground" : "text-band-panel-ink")}>
            {minutesCompleted} / {minutesGoal} min
          </span>
          <span className={cn("text-meta", isCard ? "text-muted-foreground" : "text-band-panel-ink/80")}>
            {remainingMinutes === 0 ? t("dashboard.goalReached", locale) : `${remainingMinutes} ${t("dashboard.minutesToGo", locale)}`}
          </span>
        </div>
        {/* 10-Segment Minute Bar */}
        <div
          className="flex items-center gap-segment w-full"
          role="progressbar"
          aria-valuenow={minutesCompleted}
          aria-valuemin={0}
          aria-valuemax={minutesGoal}
        >
          {Array.from({ length: minutesGoal }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-segment flex-1 rounded-segment transition-colors",
                idx < minutesCompleted
                  ? "bg-sun-500"
                  : isCard
                    ? "bg-muted"
                    : "bg-band-segment-empty"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

