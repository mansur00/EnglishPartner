"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon } from "@hugeicons/core-free-icons";

interface GrammarToggleButtonProps {
  isActive: boolean;
  onToggle: () => void;
  className?: string;
  lang?: "en" | "bn";
  size?: "sm" | "default";
}

export function GrammarToggleButton({
  isActive,
  onToggle,
  className,
  lang: propLang,
  size = "default",
}: GrammarToggleButtonProps) {
  const currentLocale = useLocale();
  const lang = propLang || (currentLocale === "bn" ? "bn" : "en");
  const label = lang === "bn" ? "ব্যাকরণ" : "Grammar";

  return (
    <Button
      type="button"
      variant={isActive ? "default" : "outline"}
      size={size === "sm" ? "sm" : "default"}
      data-grammar-toggle="true"
      onClick={onToggle}
      aria-pressed={isActive}
      aria-label={`${label}: ${isActive ? "Active" : "Inactive"}`}
      title={isActive ? "Hide grammar color-coding" : "Show grammar color-coding"}
      className={cn(
        size === "sm"
          ? "h-control-sm px-2.5 text-chip gap-1.5 rounded-control transition-all"
          : "h-control-md px-3 text-label gap-1.5 rounded-control transition-all",
        isActive ? "rainbow-border bg-card text-foreground shadow-xs border-0" : "",
        className
      )}
    >
      <HugeiconsIcon
        icon={BookOpen01Icon}
        size={size === "sm" ? 14 : 16}
        className={cn(
          "transition-colors",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      />
      <span className={cn("hidden sm:inline", lang === "bn" && "font-bangla text-bangla")}>
        {label}
      </span>
    </Button>
  );
}
