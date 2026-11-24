"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useGrammar } from "@/lib/grammar/context";
import { useLocale } from "@/lib/i18n";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon } from "@hugeicons/core-free-icons";

interface GrammarModeSwitchProps {
  className?: string;
  lang?: "en" | "bn";
}

export function GrammarModeSwitch({
  className,
  lang: propLang,
}: GrammarModeSwitchProps) {
  const currentLocale = useLocale();
  const lang = propLang || (currentLocale === "bn" ? "bn" : "en");
  const { isGlobalOn, toggleGlobal } = useGrammar();

  const label = lang === "bn" ? "সব বাক্যে ব্যাকরণ" : "Grammar (all lines)";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 h-9 rounded-control bg-card shadow-2xs select-none border-0",
        className
      )}
    >
      <HugeiconsIcon
        icon={BookOpen01Icon}
        size={16}
        className={cn(
          "transition-colors",
          isGlobalOn ? "text-primary" : "text-muted-foreground"
        )}
      />
      <label
        htmlFor="grammar-global-switch"
        className="text-label font-bangla text-bangla text-foreground cursor-pointer"
      >
        {label}
      </label>
      <Switch
        id="grammar-global-switch"
        checked={isGlobalOn}
        onCheckedChange={toggleGlobal}
        aria-label={label}
        className="cursor-pointer"
      />
    </div>
  );
}
