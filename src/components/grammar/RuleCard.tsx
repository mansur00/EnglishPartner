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
      <DialogContent className="w-full sm:max-w-lg bg-card border-border p-5 sm:p-6 text-left max-h-dialog overflow-y-auto">
        <DialogHeader className="pb-3 border-b border-border text-left">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-control bg-primary/10 text-primary">
              <HugeiconsIcon icon={SparklesIcon} size={18} />
            </div>
            <div>
              <DialogTitle className="text-card-title text-foreground tracking-tight font-sans">
                {rule.title}
              </DialogTitle>
              <p className="text-chip text-muted-foreground font-bangla text-bangla">
                {label.name} • {label.description}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Formula Box */}
        {rule.formula && (
          <div className="p-3.5 rounded-control bg-primary/5 border border-primary/20 space-y-1">
            <span className="text-grammar-header text-primary">
              {isBn ? "গঠন প্রণালী (Formula):" : "Formula:"}
            </span>
            <p className="text-meta font-mono text-foreground">
              {rule.formula}
            </p>
          </div>
        )}

        {/* Explanation */}
        <div className="space-y-1">
          <span className="text-grammar-header">
            {isBn ? "ব্যাখ্যা ও প্রয়োগ (Explanation):" : "Explanation:"}
          </span>
          <p className="text-body text-foreground leading-relaxed font-bangla text-bangla">
            {rule.explanation}
          </p>
        </div>

        {/* Usage points */}
        {rule.usage && rule.usage.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-grammar-header">
              {isBn ? "কখন ব্যবহার করবেন:" : "When to use:"}
            </span>
            <ul className="space-y-1 text-body text-foreground font-bangla text-bangla">
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
            <span className="text-grammar-header">
              {isBn ? "উদাহরণসমূহ (Examples):" : "Examples:"}
            </span>
            <div className="space-y-1.5">
              {rule.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-control bg-muted/40 border border-border space-y-0.5"
                >
                  <p className="text-body text-foreground italic">
                    &ldquo;{ex.text}&rdquo;
                  </p>
                  {ex.note && (
                    <p className="text-chip text-muted-foreground font-bangla text-bangla">
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
            <span className="text-grammar-header text-destructive">
              {isBn ? "সাধারণ ভুল যা এড়িয়ে চলবেন:" : "Common Mistakes:"}
            </span>
            <ul className="space-y-1 text-chip text-foreground font-bangla text-bangla">
              {rule.commonMistakes.map((m, idx) => (
                <li key={idx} className="list-disc ml-4">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-border flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-label font-bangla text-bangla">
            {isBn ? "বন্ধ করুন" : "Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
