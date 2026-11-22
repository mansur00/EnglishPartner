"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon } from "@hugeicons/core-free-icons";

interface GrammarToggleButtonProps {
  isActive: boolean;
  onToggle: () => void;
  className?: string;
  lang?: "en" | "bn";
}

export function GrammarToggleButton({
  isActive,
  onToggle,
  className,
  lang = "bn",
}: GrammarToggleButtonProps) {
  const label = lang === "bn" ? "ব্যাকরণ" : "Grammar";

  return (
    <button
      type="button"
      data-grammar-toggle="true"
      onClick={onToggle}
      aria-pressed={isActive}
      aria-label={`${label}: ${isActive ? "Active" : "Inactive"}`}
      title={isActive ? "Hide grammar color-coding" : "Show grammar color-coding"}
      className={cn(
        "relative inline-flex items-center justify-center gap-1.5 min-h-tap min-w-tap px-3 py-2 rounded-control text-label cursor-pointer transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isActive
          ? "rainbow-border bg-card text-foreground shadow-xs"
          : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground",
        className
      )}
    >
      <HugeiconsIcon
        icon={BookOpen01Icon}
        size={16}
        className={cn(
          "transition-colors",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      />
      <span className="hidden sm:inline font-bangla text-bangla text-label">
        {label}
      </span>
    </button>
  );
}
