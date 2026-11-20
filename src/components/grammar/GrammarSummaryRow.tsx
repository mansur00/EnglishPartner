"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { LineAnnotation } from "@/lib/grammar/types";
import { getLabel, getRuleCard } from "@/lib/grammar/taxonomy";
import { useGrammar } from "@/lib/grammar/context";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";

interface GrammarSummaryRowProps {
  annotation: LineAnnotation;
  onRuleClick?: (ruleKey: string) => void;
  className?: string;
  lang?: "en" | "bn";
}

export function GrammarSummaryRow({
  annotation,
  onRuleClick,
  className,
  lang = "bn",
}: GrammarSummaryRowProps) {
  const { focusedKey, setFocusedKey, clearFocus } = useGrammar();

  // Extract all distinct summary items from groups and sentence properties
  const summaryItems: { key: string; labelEn: string; labelBn: string; type: "tense" | "voice" | "pattern" | "sentence" }[] = [];
  const seenKeys = new Set<string>();

  // 1. Groups: Verb Groups (Tenses & Voice)
  if (annotation.groups) {
    for (const group of annotation.groups) {
      if (group.type === "verb-group") {
        if (group.time && group.aspect) {
          const tenseKey = `${group.time}-${group.aspect}`;
          if (!seenKeys.has(tenseKey)) {
            seenKeys.add(tenseKey);
            const l = getLabel(tenseKey, lang);
            summaryItems.push({
              key: tenseKey,
              labelEn: getLabel(tenseKey, "en").name,
              labelBn: l.name,
              type: "tense",
            });
          }
        }
        if (group.voice && !seenKeys.has(group.voice)) {
          seenKeys.add(group.voice);
          const l = getLabel(group.voice, lang);
          summaryItems.push({
            key: group.voice,
            labelEn: getLabel(group.voice, "en").name,
            labelBn: l.name,
            type: "voice",
          });
        }
        if (group.keys) {
          for (const k of group.keys) {
            if (!seenKeys.has(k)) {
              seenKeys.add(k);
              const l = getLabel(k, lang);
              summaryItems.push({
                key: k,
                labelEn: getLabel(k, "en").name,
                labelBn: l.name,
                type: "tense",
              });
            }
          }
        }
      } else if (group.type === "pattern" && group.key) {
        if (!seenKeys.has(group.key)) {
          seenKeys.add(group.key);
          const l = getLabel(group.key, lang);
          summaryItems.push({
            key: group.key,
            labelEn: getLabel(group.key, "en").name,
            labelBn: l.name,
            type: "pattern",
          });
        }
      }
    }
  }

  // 2. Sentence properties
  if (annotation.sentence?.function) {
    const fnKey = `sentence-${annotation.sentence.function}`;
    if (!seenKeys.has(fnKey)) {
      seenKeys.add(fnKey);
      const l = getLabel(annotation.sentence.function, lang);
      summaryItems.push({
        key: annotation.sentence.function,
        labelEn: getLabel(annotation.sentence.function, "en").name,
        labelBn: l.name,
        type: "sentence",
      });
    }
  }

  if (summaryItems.length === 0) return null;

  const handleChipClick = (itemKey: string) => {
    if (focusedKey === itemKey) {
      clearFocus();
    } else {
      setFocusedKey(itemKey);
    }
    // Also trigger rule card click if rule card exists
    if (getRuleCard(itemKey, lang)) {
      onRuleClick?.(itemKey);
    }
  };

  return (
    <div className={cn("pt-2 flex flex-wrap items-center gap-1.5", className)}>
      <span className="text-chip text-muted-foreground inline-flex items-center gap-1 mr-1">
        <HugeiconsIcon icon={SparklesIcon} size={12} className="text-primary" />
        <span className="font-bangla text-bangla">গঠন:</span>
      </span>

      {summaryItems.map((item) => {
        const isFocused = focusedKey === item.key;
        const hasRule = Boolean(getRuleCard(item.key, lang));

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => handleChipClick(item.key)}
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-pill text-chip transition-all duration-150 cursor-pointer border",
              isFocused
                ? "bg-primary text-primary-foreground border-primary shadow-xs ring-2 ring-primary/30"
                : "bg-muted/70 hover:bg-muted text-foreground border-border",
              hasRule && "hover:border-primary/50"
            )}
            title={
              hasRule
                ? `নিয়ম ও বিস্তারিত দেখতে ক্লিক করুন: ${item.labelBn}`
                : `ফোকাস করতে ক্লিক করুন: ${item.labelBn}`
            }
          >
            <span className="font-bangla text-bangla">{item.labelBn}</span>
            {hasRule && (
              <span className="text-chip opacity-70 ml-0.5">ℹ</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
