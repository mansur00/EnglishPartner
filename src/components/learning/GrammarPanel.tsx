"use client";

import React, { useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  SparklesIcon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
  Book01Icon,
} from "@hugeicons/core-free-icons";
import { SentenceGrammarEntry } from "@/content/seed/vocabulary";
import { Badge } from "@/components/ui/badge";

interface GrammarPanelProps {
  entry: SentenceGrammarEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export function GrammarPanel({ entry, isOpen, onClose }: GrammarPanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !entry) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="grammar-panel-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="document"
        className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-ecp-border flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs z-10 p-5 sm:p-6 border-b border-ecp-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-ecp-warm-surface text-ecp-warm flex items-center justify-center">
              <HugeiconsIcon icon={Book01Icon} size={20} />
            </div>
            <div>
              <h3
                id="grammar-panel-title"
                className="font-bold text-ecp-text-primary text-base sm:text-lg font-bangla"
              >
                ব্যাকরণ বিশ্লেষণ ও গঠন (Grammar Insights)
              </h3>
              <p className="text-xs text-ecp-text-muted">
                Sentence Structure Breakdown
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="বন্ধ করুন (Close)"
            className="p-1.5 rounded-lg text-ecp-text-muted hover:text-ecp-text-primary hover:bg-ecp-bg-canvas transition-colors cursor-pointer"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {/* Target Sentence Banner */}
          <div className="bg-ecp-bg-canvas p-4 rounded-xl border border-ecp-border">
            <span className="text-[11px] font-semibold text-ecp-text-muted uppercase tracking-wider block mb-1">
              মূল বাক্য (Target Sentence)
            </span>
            <p className="text-base font-medium text-ecp-text-primary italic leading-relaxed">
              &ldquo;{entry.sentenceText}&rdquo;
            </p>
          </div>

          {/* SVO Structure Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={SparklesIcon} size={16} className="text-ecp-violet" />
              <h4 className="text-sm font-bold text-ecp-text-primary font-bangla">
                বাক্যের গঠন ও উপাংশ (S-V-O Breakdown)
              </h4>
            </div>

            <div className="bg-white rounded-xl border border-ecp-border divide-y divide-ecp-border shadow-2xs">
              <div className="p-3 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                <span className="font-semibold text-ecp-violet min-w-28 shrink-0">
                  Subject (কর্তা):
                </span>
                <span className="text-ecp-text-secondary font-mono text-xs">
                  {entry.structure.subject}
                </span>
              </div>
              <div className="p-3 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                <span className="font-semibold text-ecp-violet min-w-28 shrink-0">
                  Verb (ক্রিয়া):
                </span>
                <span className="text-ecp-text-secondary font-mono text-xs">
                  {entry.structure.verb}
                </span>
              </div>
              <div className="p-3 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                <span className="font-semibold text-ecp-violet min-w-28 shrink-0">
                  Object / Complement:
                </span>
                <span className="text-ecp-text-secondary font-mono text-xs">
                  {entry.structure.objectOrComplement}
                </span>
              </div>
              <div className="p-3 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 bg-ecp-violet-surface/20">
                <span className="font-semibold text-ecp-violet min-w-28 shrink-0">
                  Tense Pattern:
                </span>
                <div>
                  <Badge variant="brand" size="sm" className="mb-1">
                    {entry.structure.tenseName}
                  </Badge>
                  <p className="text-xs text-ecp-text-muted font-mono">
                    {entry.structure.tensePattern}
                  </p>
                </div>
              </div>
            </div>

            {/* Why Used in Bengali */}
            <div className="bg-ecp-violet-surface/40 p-4 rounded-xl border border-ecp-violet/15">
              <span className="text-xs font-semibold text-ecp-violet block mb-1 font-bangla">
                কেন এই গঠনটি ব্যবহার করা হয়েছে?
              </span>
              <p className="text-xs sm:text-sm font-bangla text-ecp-text-primary leading-relaxed">
                {entry.structure.whyUsedBn}
              </p>
            </div>
          </div>

          {/* Polite Natural Alternatives */}
          {entry.politeAlternatives && entry.politeAlternatives.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} className="text-emerald-600" />
                <h4 className="text-sm font-bold text-ecp-text-primary font-bangla">
                  বিকল্প মার্জিত প্রকাশভঙ্গি (Polite Alternatives)
                </h4>
              </div>
              <div className="space-y-2">
                {entry.politeAlternatives.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-ecp-bg-canvas rounded-xl border border-ecp-border text-xs sm:text-sm text-ecp-text-primary italic flex items-center gap-2"
                  >
                    <span className="text-emerald-600 font-bold">•</span>
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
                <HugeiconsIcon icon={InformationCircleIcon} size={16} className="text-rose-500" />
                <h4 className="text-sm font-bold text-ecp-text-primary font-bangla">
                  সাধারণ ভুল ও সতর্কতা (Common Mistakes)
                </h4>
              </div>
              <div className="space-y-3">
                {entry.commonMistakes.map((mistake, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2"
                  >
                    <div className="flex items-start gap-2 text-xs sm:text-sm">
                      <span className="font-bold text-rose-600 shrink-0">ভুল:</span>
                      <span className="line-through text-rose-700 italic">
                        &ldquo;{mistake.mistake}&rdquo;
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-xs sm:text-sm">
                      <span className="font-bold text-emerald-600 shrink-0">সঠিক:</span>
                      <span className="font-medium text-emerald-800 italic">
                        &ldquo;{mistake.correction}&rdquo;
                      </span>
                    </div>
                    <p className="text-xs font-bangla text-ecp-text-secondary pt-1 border-t border-rose-100 leading-relaxed">
                      {mistake.explanationBn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-ecp-border bg-ecp-bg-canvas flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-ecp-border rounded-xl text-xs font-medium text-ecp-text-primary hover:bg-ecp-bg-canvas transition-colors font-bangla shadow-2xs cursor-pointer"
          >
            বুঝেছি (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
