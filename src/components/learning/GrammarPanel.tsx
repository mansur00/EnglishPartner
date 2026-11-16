"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
  Book01Icon,
} from "@hugeicons/core-free-icons";
import { SentenceGrammarEntry } from "@/content/seed/vocabulary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface GrammarPanelProps {
  entry: SentenceGrammarEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GrammarPanel({ entry, isOpen, onClose }: GrammarPanelProps) {
  if (!entry) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-card border-l border-border flex flex-col justify-between p-0 overflow-y-auto"
      >
        {/* Header */}
        <SheetHeader className="sticky top-0 bg-card/95 backdrop-blur z-10 p-5 sm:p-6 border-b border-border text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Book01Icon} size={20} />
            </div>
            <div>
              <SheetTitle className="font-bold text-foreground text-base sm:text-lg font-[var(--ecp-font-bangla)]">
                ব্যাকরণ বিশ্লেষণ ও গঠন (Grammar Insights)
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                Sentence Structure & Syntax Breakdown
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {/* Target Sentence Banner */}
          <div className="bg-muted/40 p-4 rounded-xl border border-border">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">
              মূল বাক্য (Target Sentence)
            </span>
            <p className="text-base font-medium text-foreground italic leading-relaxed">
              &ldquo;{entry.sentenceText}&rdquo;
            </p>
          </div>

          {/* SVO Structure Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={SparklesIcon} size={16} className="text-primary" />
              <h4 className="text-sm font-bold text-foreground font-[var(--ecp-font-bangla)]">
                বাক্যের গঠন ও উপাংশ (S-V-O Breakdown)
              </h4>
            </div>

            <div className="bg-card rounded-xl border border-border divide-y divide-border shadow-2xs">
              <div className="p-3 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                <span className="font-semibold text-primary min-w-28 shrink-0">
                  Subject (কর্তা):
                </span>
                <span className="text-muted-foreground font-mono text-xs">
                  {entry.structure.subject}
                </span>
              </div>
              <div className="p-3 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                <span className="font-semibold text-primary min-w-28 shrink-0">
                  Verb (ক্রিয়া):
                </span>
                <span className="text-muted-foreground font-mono text-xs">
                  {entry.structure.verb}
                </span>
              </div>
              <div className="p-3 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                <span className="font-semibold text-primary min-w-28 shrink-0">
                  Object / Complement:
                </span>
                <span className="text-muted-foreground font-mono text-xs">
                  {entry.structure.objectOrComplement}
                </span>
              </div>
              <div className="p-3 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 bg-primary/5 dark:bg-primary/10">
                <span className="font-semibold text-primary min-w-28 shrink-0">
                  Tense Pattern:
                </span>
                <div>
                  <Badge variant="brand" size="sm" className="mb-1">
                    {entry.structure.tenseName}
                  </Badge>
                  <p className="text-xs text-muted-foreground font-mono">
                    {entry.structure.tensePattern}
                  </p>
                </div>
              </div>
            </div>

            {/* Why Used in Bengali */}
            <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/15">
              <span className="text-xs font-semibold text-primary block mb-1 font-[var(--ecp-font-bangla)]">
                কেন এই গঠনটি ব্যবহার করা হয়েছে?
              </span>
              <p className="text-xs sm:text-sm font-[var(--ecp-font-bangla)] text-foreground leading-relaxed">
                {entry.structure.whyUsedBn}
              </p>
            </div>
          </div>

          {/* Polite Natural Alternatives */}
          {entry.politeAlternatives && entry.politeAlternatives.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} className="text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-sm font-bold text-foreground font-[var(--ecp-font-bangla)]">
                  বিকল্প মার্জিত প্রকাশভঙ্গি (Polite Alternatives)
                </h4>
              </div>
              <div className="space-y-2">
                {entry.politeAlternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-muted/40 rounded-xl border border-border text-xs sm:text-sm text-foreground italic flex items-center gap-2"
                  >
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                    <span>&ldquo;{alt}&rdquo;</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes */}
          {entry.commonMistakes && entry.commonMistakes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={InformationCircleIcon} size={16} className="text-destructive" />
                <h4 className="text-sm font-bold text-foreground font-[var(--ecp-font-bangla)]">
                  সাধারণ ভুল ও সতর্কতা (Common Mistakes)
                </h4>
              </div>
              <div className="space-y-3">
                {entry.commonMistakes.map((mistake, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-destructive/20 bg-destructive/5 space-y-2"
                  >
                    <div className="flex items-start gap-2 text-xs sm:text-sm">
                      <span className="font-bold text-destructive shrink-0">ভুল:</span>
                      <span className="line-through text-destructive italic">
                        &ldquo;{mistake.mistake}&rdquo;
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-xs sm:text-sm">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">সঠিক:</span>
                      <span className="font-medium text-foreground italic">
                        &ldquo;{mistake.correction}&rdquo;
                      </span>
                    </div>
                    <p className="text-xs font-[var(--ecp-font-bangla)] text-muted-foreground pt-1 border-t border-destructive/10 leading-relaxed">
                      {mistake.explanationBn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="btn-press font-[var(--ecp-font-bangla)] text-xs"
          >
            বুঝেছি (Close)
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
