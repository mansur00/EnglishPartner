"use client";

import React from "react";
import { getRuleCard, getLabel } from "@/lib/grammar/taxonomy";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon, CheckmarkBadge01Icon } from "@hugeicons/core-free-icons";

interface RuleCardDialogProps {
  ruleKey: string | null;
  isOpen: boolean;
  onClose: () => void;
  lang?: "en" | "bn";
}

export function RuleCardDialog({
  ruleKey,
  isOpen,
  onClose,
  lang = "bn",
}: RuleCardDialogProps) {
  if (!ruleKey) return null;

  const rule = getRuleCard(ruleKey, lang);
  const label = getLabel(ruleKey, lang);

  if (!rule) return null;

  const isBn = lang === "bn";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full sm:max-w-lg bg-card border-border p-5 sm:p-6 text-left max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3 border-b border-border text-left">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-control bg-primary/10 text-primary">
              <HugeiconsIcon icon={SparklesIcon} size={18} />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground tracking-tight font-sans">
                {rule.title}
              </DialogTitle>
              <p className="text-xs text-muted-foreground font-bangla">
                {label.name} • {label.description}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Formula Box */}
        {rule.formula && (
          <div className="p-3.5 rounded-control bg-primary/5 border border-primary/20 space-y-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider block font-bangla">
              {isBn ? "গঠন প্রণালী (Formula):" : "Formula:"}
            </span>
            <p className="text-sm font-mono font-medium text-foreground">
              {rule.formula}
            </p>
          </div>
        )}

        {/* Explanation */}
        <div className="space-y-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block font-bangla">
            {isBn ? "ব্যাখ্যা ও প্রয়োগ (Explanation):" : "Explanation:"}
          </span>
          <p className="text-sm text-foreground leading-relaxed font-bangla">
            {rule.explanation}
          </p>
        </div>

        {/* Usage points */}
        {rule.usage && rule.usage.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block font-bangla">
              {isBn ? "কখন ব্যবহার করবেন:" : "When to use:"}
            </span>
            <ul className="space-y-1 text-sm text-foreground font-bangla">
              {rule.usage.map((u, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <HugeiconsIcon icon={CheckmarkBadge01Icon} size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Examples */}
        {rule.examples && rule.examples.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block font-bangla">
              {isBn ? "উদাহরণসমূহ (Examples):" : "Examples:"}
            </span>
            <div className="space-y-1.5">
              {rule.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-control bg-muted/40 border border-border space-y-0.5"
                >
                  <p className="text-sm font-medium text-foreground italic">
                    &ldquo;{ex.text}&rdquo;
                  </p>
                  {ex.note && (
                    <p className="text-xs text-muted-foreground font-bangla">
                      {ex.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Mistakes */}
        {rule.commonMistakes && rule.commonMistakes.length > 0 && (
          <div className="p-3 rounded-control bg-destructive/5 border border-destructive/20 space-y-1">
            <span className="text-xs font-semibold text-destructive uppercase tracking-wider block font-bangla">
              {isBn ? "সাধারণ ভুল যা এড়িয়ে চলবেন:" : "Common Mistakes:"}
            </span>
            <ul className="space-y-1 text-xs text-foreground font-bangla">
              {rule.commonMistakes.map((m, idx) => (
                <li key={idx} className="list-disc ml-4">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs font-bangla">
            {isBn ? "বন্ধ করুন" : "Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
