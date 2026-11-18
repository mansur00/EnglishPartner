"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { HugeiconsIcon } from "@hugeicons/react";
import { FireIcon } from "@hugeicons/core-free-icons";

export interface TodayPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  streak?: number;
  minutesCompleted?: number;
  minutesGoal?: number;
}

export function TodayPanel({
  className,
  streak = 1,
  minutesCompleted = 7,
  minutesGoal = 10,
  ...props
}: TodayPanelProps) {
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const currentDayIndex = (new Date().getDay() + 6) % 7; // Monday = 0
  const remainingMinutes = Math.max(0, minutesGoal - minutesCompleted);

  return (
    <div
      className={cn(
        "w-full md:w-auto bg-band-panel border border-band-panel-border rounded-panel p-4 text-white shadow-xs space-y-3.5 min-w-0 sm:min-w-[360px]",
        className
      )}
      {...props}
    >
      {/* Row 1: Streak Number + Label + 7 Weekday Markers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={FireIcon} size={20} className="text-sun-500 shrink-0" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-stat text-white">{streak}</span>
            <span className="text-meta text-white/90">{t("dashboard.dayStreak")}</span>
          </div>
        </div>

        {/* 7 Weekday Markers */}
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
                  "inline-flex items-center justify-center size-marker rounded-pill text-chip select-none",
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
      <div className="space-y-1.5 pt-1 border-t border-band-panel-border">
        <div className="flex items-center justify-between">
          <span className="text-body font-semibold text-white">
            {minutesCompleted} / {minutesGoal} min
          </span>
          <span className="text-meta text-white/80">
            {remainingMinutes === 0 ? t("dashboard.goalReached") : `${remainingMinutes} ${t("dashboard.minutesToGo")}`}
          </span>
        </div>
        {/* 10-Segment Minute Bar */}
        <div
          className="flex items-center gap-[3px] w-full"
          role="progressbar"
          aria-valuenow={minutesCompleted}
          aria-valuemin={0}
          aria-valuemax={minutesGoal}
        >
          {Array.from({ length: minutesGoal }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-segment flex-1 rounded-[2px] transition-colors",
                idx < minutesCompleted ? "bg-sun-500" : "bg-band-segment-empty"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

