"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useGrammar } from "@/lib/grammar/context";
import { getTaxonomy, getLabel } from "@/lib/grammar/taxonomy";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon, Cancel01Icon } from "@hugeicons/core-free-icons";

interface GrammarLegendProps {
  presentCategories?: string[];
  className?: string;
  lang?: "en" | "bn";
}

export function GrammarLegend({
  presentCategories = [],
  className,
  lang = "bn",
}: GrammarLegendProps) {
  const { activeLayers, detailLevel, focusedKey, setFocusedKey, clearFocus } =
    useGrammar();
  const [showAll, setShowAll] = useState(false);

  const taxonomy = getTaxonomy();
  const isBn = lang === "bn";

  // Filter categories according to active layers and detail level
  const allFilteredCategories = Object.values(taxonomy.categories).filter(
    (cat) => {
      if (!activeLayers.includes(cat.layer)) return false;
      if (detailLevel === "basic" && !cat.basic) return false;
      return true;
    }
  );

  // If presentCategories provided and showAll is false, filter to only present ones
  const visibleCategories =
    showAll || presentCategories.length === 0
      ? allFilteredCategories
      : allFilteredCategories.filter((cat) =>
          presentCategories.includes(cat.id)
        );

  const handleCategoryClick = (catId: string) => {
    if (focusedKey === catId) {
      clearFocus();
    } else {
      setFocusedKey(catId);
    }
  };

  return (
    <div
      className={cn(
        "p-3 rounded-panel border border-border bg-card/60 space-y-2.5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-semibold font-bangla text-foreground">
          <HugeiconsIcon icon={SparklesIcon} size={14} className="text-primary" />
          <span>{isBn ? "ব্যাকরণ লেজেন্ড (Legend)" : "Grammar Legend"}</span>
          {focusedKey && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-normal">
              {isBn ? "ফোকাস চালু" : "Focus active"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {focusedKey && (
            <button
              type="button"
              onClick={clearFocus}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={12} />
              <span>{isBn ? "মুছুন" : "Clear"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-medium text-primary hover:underline cursor-pointer font-bangla"
          >
            {showAll
              ? isBn
                ? "শুধুমাত্র বাক্যের পদ"
                : "Active only"
              : isBn
                ? "সব ক্যাটাগরি দেখুন"
                : "Show all"}
          </button>
        </div>
      </div>

      {/* Category Swatches / Pills */}
      <div className="flex flex-wrap gap-1.5">
        {visibleCategories.map((cat) => {
          const isFocused = focusedKey === cat.id;
          const label = getLabel(cat.id, lang);

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-semibold transition-all duration-150 cursor-pointer border",
                isFocused
                  ? "bg-primary text-primary-foreground border-primary shadow-xs ring-2 ring-primary/30"
                  : focusedKey
                    ? "bg-muted/40 text-muted-foreground opacity-60 border-border"
                    : "bg-muted/60 hover:bg-muted text-foreground border-border"
              )}
              title={
                isBn
                  ? `ফোকাস করতে ক্লিক করুন: ${label.name}`
                  : `Click to focus: ${label.name}`
              }
            >
              {/* Category indicator: POS dot, Role underline indicator, or Tense bar */}
              {cat.layer === "pos" && (
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: `var(--gram-pos-${cat.id}-ink, var(--brand-800))`,
                  }}
                />
              )}
              {cat.layer === "role" && (
                <span
                  className="w-2.5 h-1 rounded-xs shrink-0"
                  style={{
                    backgroundColor: `var(--gram-role-${cat.id}-line, var(--primary))`,
                  }}
                />
              )}
              {cat.layer === "tense" && (
                <span className="w-2.5 h-1 border-b-2 border-primary shrink-0" />
              )}

              <span className="font-bangla text-xs font-medium">{label.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
