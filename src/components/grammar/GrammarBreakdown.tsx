"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { LineAnnotation } from "@/lib/grammar/types";
import { getLabel, getRuleCard } from "@/lib/grammar/taxonomy";
import { Badge } from "@/components/ui/badge";

interface GrammarBreakdownProps {
  annotation: LineAnnotation;
  className?: string;
  lang?: "en" | "bn";
  onRuleClick?: (ruleKey: string) => void;
}

export function GrammarBreakdown({
  annotation,
  className,
  lang = "bn",
  onRuleClick,
}: GrammarBreakdownProps) {
  const isBn = lang === "bn";

  return (
    <div className={cn("space-y-4", className)}>
      {/* 1. Sentence Structure Summary */}
      {annotation.sentence && (
        <div className="p-3 rounded-panel bg-muted/40 flex items-center justify-between text-chip">
          <div>
            <span className="text-label text-muted-foreground block font-bangla text-bangla">
              {isBn ? "বাক্যের ধরন (Sentence Structure):" : "Sentence Structure:"}
            </span>
            <span className="text-body text-foreground capitalize">
              {annotation.sentence.structure} • {annotation.sentence.function}
            </span>
          </div>
          {annotation.sentence.function && (
            <Badge variant="outline" size="sm" className="capitalize text-chip">
              {annotation.sentence.function}
            </Badge>
          )}
        </div>
      )}

      {/* 2. Tokens & Roles Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-chip border border-border rounded-panel">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              <th className="p-2 border-b border-border">{isBn ? "শব্দ (Word)" : "Word"}</th>
              <th className="p-2 border-b border-border">{isBn ? "পদ (POS)" : "POS"}</th>
              <th className="p-2 border-b border-border">{isBn ? "ভূমিকা (Role)" : "Role"}</th>
              <th className="p-2 border-b border-border">{isBn ? "মূল রূপ (Lemma)" : "Lemma"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {annotation.tokens
              .filter((tok) => tok.pos !== "punctuation")
              .map((tok) => {
                const posLabel = getLabel(tok.pos, lang);
                const roleLabel = tok.role ? getLabel(tok.role, lang) : null;

                return (
                  <tr key={tok.i} className="hover:bg-muted/30 transition-colors">
                    <td className="p-2 text-foreground">{tok.text}</td>
                    <td className="p-2">
                      <span className="inline-flex items-center gap-1 font-bangla text-bangla">
                        <span
                          className="size-1.5 rounded-full inline-block"
                          style={{
                            backgroundColor: `var(--gram-pos-${tok.pos}-ink, var(--brand-800))`,
                          }}
                        />
                        {posLabel.name}
                      </span>
                    </td>
                    <td className="p-2 font-bangla text-bangla text-muted-foreground">
                      {roleLabel ? roleLabel.name : "—"}
                    </td>
                    <td className="p-2 font-mono text-muted-foreground">{tok.lemma}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* 3. Detected Groups & Rules */}
      {annotation.groups && annotation.groups.length > 0 && (
        <div className="space-y-2">
          <span className="text-grammar-header">
            {isBn ? "চিহ্নিত ব্যাকরণিক নিয়ম ও কাল:" : "Rules & Tenses:"}
          </span>
          <div className="space-y-1.5">
            {annotation.groups.map((group) => {
              const ruleKey = group.type === "verb-group" && group.time && group.aspect
                ? `${group.time}-${group.aspect}`
                : group.key;

              if (!ruleKey) return null;
              const rule = getRuleCard(ruleKey, lang);
              const label = getLabel(ruleKey, lang);

              return (
                <div
                  key={group.id}
                  className="p-2.5 rounded-control bg-card flex items-center justify-between text-chip shadow-2xs"
                >
                  <div>
                    <span className="text-label text-foreground font-bangla text-bangla block">
                      {label.name}
                    </span>
                    <span className="text-muted-foreground font-bangla text-bangla">
                      {label.description}
                    </span>
                  </div>
                  {rule && onRuleClick && (
                    <button
                      type="button"
                      onClick={() => onRuleClick(ruleKey)}
                      className="px-2 py-1 text-label text-primary hover:underline cursor-pointer font-bangla text-bangla"
                    >
                      {isBn ? "নিয়ম দেখুন →" : "View Rule →"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
