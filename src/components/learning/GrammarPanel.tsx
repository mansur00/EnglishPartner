"use client";

import React from "react";
import { cn } from "@/lib/utils";
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

interface StructureRowProps {
  label: string;
  value: string;
  isMonospace?: boolean;
}

function StructureRow({ label, value, isMonospace = true }: StructureRowProps) {
  return (
    <div className="p-3 text-meta flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
      <span className="text-label text-primary min-w-28 shrink-0">{label}</span>
      <span className={cn("text-muted-foreground text-chip", isMonospace && "font-mono")}>
        {value}
      </span>
    </div>
  );
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
            <div className="size-control rounded-control bg-warning-bg text-warning border border-border flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Book01Icon} size={20} />
            </div>
            <div>
              <SheetTitle className="text-foreground text-card-title text-bangla">
                ব্যাকরণ বিশ্লেষণ ও গঠন (Grammar Insights)
              </SheetTitle>
              <SheetDescription className="text-chip text-muted-foreground mt-0.5">
                Sentence Structure & Syntax Breakdown
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {/* Target Sentence Banner */}
          <div className="bg-muted/40 p-4 rounded-panel border border-border">
            <span className="text-chip text-muted-foreground uppercase tracking-wider block mb-1">
              মূল বাক্য (Target Sentence)
            </span>
            <p className="text-body text-foreground italic leading-relaxed">
              &ldquo;{entry.sentenceText}&rdquo;
            </p>
          </div>

          {/* SVO Structure Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={SparklesIcon} size={16} className="text-primary" />
              <h4 className="text-label text-foreground text-bangla">
                বাক্যের গঠন ও উপাংশ (S-V-O Breakdown)
              </h4>
            </div>

            <div className="bg-card rounded-panel border border-border divide-y divide-border shadow-2xs">
              <StructureRow label="Subject (কর্তা):" value={entry.structure.subject} />
              <StructureRow label="Verb (ক্রিয়া):" value={entry.structure.verb} />
              <StructureRow label="Object / Complement:" value={entry.structure.objectOrComplement} />
              <div className="p-3 text-meta flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 bg-primary/5 dark:bg-primary/10">
                <span className="text-label text-primary min-w-28 shrink-0">
                  Tense Pattern:
                </span>
                <div>
                  <Badge variant="brand" size="sm" className="mb-1">
                    {entry.structure.tenseName}
                  </Badge>
                  <p className="text-chip text-muted-foreground font-mono">
                    {entry.structure.tensePattern}
                  </p>
                </div>
              </div>
            </div>

            {/* Why Used in Bengali */}
            <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-panel border border-primary/15">
              <span className="text-chip text-primary block mb-1 text-bangla">
                কেন এই গঠনটি ব্যবহার করা হয়েছে?
              </span>
              <p className="text-meta text-bangla text-foreground leading-relaxed">
                {entry.structure.whyUsedBn}
              </p>
            </div>
          </div>

          {/* Polite Natural Alternatives */}
          {entry.politeAlternatives && entry.politeAlternatives.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} className="text-success" />
                <h4 className="text-label text-foreground text-bangla">
                  বিকল্প মার্জিত প্রকাশভঙ্গি (Polite Alternatives)
                </h4>
              </div>
              <div className="space-y-2">
                {entry.politeAlternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-muted/40 rounded-panel border border-border text-meta text-foreground italic flex items-center gap-2"
                  >
                    <span className="text-success text-label">•</span>
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
                <h4 className="text-label text-foreground text-bangla">
                  সাধারণ ভুল ও সতর্কতা (Common Mistakes)
                </h4>
              </div>
              <div className="space-y-3">
                {entry.commonMistakes.map((mistake, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-panel border border-destructive/20 bg-destructive/5 space-y-2"
                  >
                    <div className="flex items-start gap-2 text-meta">
                      <span className="text-label text-destructive shrink-0">ভুল:</span>
                      <span className="line-through text-destructive italic">
                        &ldquo;{mistake.mistake}&rdquo;
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-meta">
                      <span className="text-label text-success shrink-0">সঠিক:</span>
                      <span className="text-foreground italic">
                        &ldquo;{mistake.correction}&rdquo;
                      </span>
                    </div>
                    <p className="text-chip text-bangla text-muted-foreground pt-1 border-t border-destructive/10 leading-relaxed">
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
            className="btn-press text-bangla text-label rounded-control"
          >
            বুঝেছি (Close)
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
