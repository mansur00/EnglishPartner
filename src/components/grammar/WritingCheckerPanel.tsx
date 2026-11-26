"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  CheckmarkCircle02Icon,
  Alert01Icon,
  Copy01Icon,
  CheckmarkBadge01Icon,
  BookOpen01Icon,
  Award01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  WritingCheckResponse,
  WritingMode,
} from "@/lib/ai/writing-checker";

const SAMPLE_GENERAL =
  "Yesterday I go to the market for buy some fresh vegetables, but my friend don't came with me because he was very tired.";

const SAMPLE_IELTS =
  "Nowadays many people think that technology make our life easier, however some peoples believe it also cause social isolation. In my opinion, although mobile phones helps us communicate fast, we should spend more time with family in real life.";

export function WritingCheckerPanel({
  defaultLocale = "bn",
}: {
  defaultLocale?: string;
}) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<WritingMode>("general");
  const [explanationLocale, setExplanationLocale] = useState<"bn" | "en">(
    defaultLocale === "en" ? "en" : "bn"
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<WritingCheckResponse | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;

  const handleCopy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      // Ignore clipboard errors
    }
  };

  const handleAnalyze = async () => {
    if (text.trim().length < 3 || loading) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/ai/writing-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          mode,
          explanationLocale,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Could not analyze writing. Please try again.");
      } else {
        setResult(data as WritingCheckResponse);
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const isBn = explanationLocale === "bn";

  return (
    <div className="space-y-5">
      {/* Input & Controls Card */}
      <Card className="p-4 sm:p-6 bg-card border border-border rounded-card space-y-4 shadow-xs">
        {/* Top Mode & Explanation Language Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Mode Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: "general", label: "General Check" },
                { id: "ielts-task1", label: "IELTS Task 1" },
                { id: "ielts-task2", label: "IELTS Task 2" },
              ] as const
            ).map((opt) => (
              <Button
                key={opt.id}
                type="button"
                size="sm"
                variant={mode === opt.id ? "default" : "outline"}
                onClick={() => setMode(opt.id)}
              >
                {opt.label}
              </Button>
            ))}
          </div>

          {/* Explanation Language Toggle */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <Button
              type="button"
              size="xs"
              variant={explanationLocale === "bn" ? "secondary" : "ghost"}
              onClick={() => setExplanationLocale("bn")}
              className="text-bangla"
            >
              বাংলা ব্যাখ্যা
            </Button>
            <Button
              type="button"
              size="xs"
              variant={explanationLocale === "en" ? "secondary" : "ghost"}
              onClick={() => setExplanationLocale("en")}
            >
              English
            </Button>
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            maxLength={4000}
            placeholder={
              mode === "general"
                ? isBn
                  ? "আপনার ইংরেজি বাক্য বা প্যারাগ্রাফ এখানে লিখুন বা পেস্ট করুন..."
                  : "Write or paste any English sentence or paragraph here..."
                : isBn
                ? "আপনার IELTS Writing Task উত্তরটি এখানে লিখুন বা পেস্ট করুন..."
                : "Paste your IELTS Writing response here for band score & feedback..."
            }
            className="w-full rounded-panel border border-border bg-background p-4 text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 text-chip text-muted-foreground">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode("general");
                  setText(SAMPLE_GENERAL);
                  setResult(null);
                }}
                className="px-2.5 py-1 rounded-pill bg-muted hover:bg-accent text-foreground transition-colors cursor-pointer"
              >
                Sample: Grammar Mistake
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("ielts-task2");
                  setText(SAMPLE_IELTS);
                  setResult(null);
                }}
                className="px-2.5 py-1 rounded-pill bg-muted hover:bg-accent text-foreground transition-colors cursor-pointer"
              >
                Sample: IELTS Task 2
              </button>
              {text && (
                <button
                  type="button"
                  onClick={() => {
                    setText("");
                    setResult(null);
                    setErrorMsg(null);
                  }}
                  className="px-2.5 py-1 rounded-pill hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <span className="font-mono">
              {wordCount} {wordCount === 1 ? "word" : "words"} · {text.length}/4000
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-panel bg-destructive/10 border border-destructive/30 px-4 py-3 text-meta text-destructive flex items-center gap-2">
            <HugeiconsIcon icon={Alert01Icon} size={18} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            variant="cta"
            size="md"
            disabled={text.trim().length < 3 || loading}
            onClick={handleAnalyze}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <HugeiconsIcon
              icon={loading ? RefreshIcon : SparklesIcon}
              size={18}
              className={cn("shrink-0", loading && "animate-spin")}
            />
            <span>
              {loading
                ? isBn
                  ? "বিশ্লেষণ করা হচ্ছে..."
                  : "Analyzing..."
                : mode === "general"
                ? isBn
                  ? "গ্রামার ও রাইটিং চেক করুন"
                  : "Check Grammar & Style"
                : isBn
                ? "IELTS ব্যান্ড ও গ্রামার চেক করুন"
                : "Evaluate IELTS & Grammar"}
            </span>
          </Button>
        </div>
      </Card>

      {/* Results View */}
      {result && (
        <div className="space-y-5">
          {/* 1. IELTS Band Score Card (when in IELTS mode) */}
          {result.ielts && (
            <Card className="p-4 sm:p-6 bg-card border border-border rounded-card space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-10 rounded-control bg-sun-200 text-brand-950 flex items-center justify-center shrink-0">
                    <HugeiconsIcon icon={Award01Icon} size={20} />
                  </div>
                  <div>
                    <h3 className="text-card-title text-foreground">
                      Estimated IELTS Band Score
                    </h3>
                    <p className="text-chip text-muted-foreground">
                      {mode === "ielts-task1" ? "Writing Task 1" : "Writing Task 2"}
                    </p>
                  </div>
                </div>
                <Badge variant="accent" size="md" className="self-start sm:self-center font-mono text-lead px-4 py-1.5">
                  Band {result.ielts.bandScore.toFixed(1)} / 9.0
                </Badge>
              </div>

              {/* 4 Criteria Breakdown */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Task Response", score: result.ielts.criteria.taskResponse },
                  { label: "Coherence & Cohesion", score: result.ielts.criteria.coherenceCohesion },
                  { label: "Lexical Resource", score: result.ielts.criteria.lexicalResource },
                  { label: "Grammar Range", score: result.ielts.criteria.grammaticalRange },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="rounded-panel bg-muted/40 border border-border/60 p-3 space-y-1"
                  >
                    <p className="text-chip text-muted-foreground">{c.label}</p>
                    <p className="text-card-title font-mono text-foreground">
                      {c.score.toFixed(1)}
                    </p>
                  </div>
                ))}
              </div>

              <p className={cn("text-meta text-foreground leading-relaxed", isBn && "text-bangla")}>
                {result.ielts.feedback}
              </p>

              {(result.ielts.strengths.length > 0 || result.ielts.improvements.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {result.ielts.strengths.length > 0 && (
                    <div className="rounded-panel bg-primary/5 border border-primary/20 p-3.5 space-y-1.5">
                      <p className="text-chip text-primary">
                        {isBn ? "ভালো দিকসমূহ" : "Strengths"}
                      </p>
                      <ul className={cn("space-y-1 text-meta text-foreground", isBn && "text-bangla")}>
                        {result.ielts.strengths.map((s, idx) => (
                          <li key={idx}>• {s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.ielts.improvements.length > 0 && (
                    <div className="rounded-panel bg-sun-100/70 border border-sun-300/60 p-3.5 space-y-1.5">
                      <p className="text-chip text-brand-950">
                        {isBn ? "উন্নতির জায়গা" : "Key Improvements"}
                      </p>
                      <ul className={cn("space-y-1 text-meta text-foreground", isBn && "text-bangla")}>
                        {result.ielts.improvements.map((imp, idx) => (
                          <li key={idx}>• {imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}

          {/* 2. Corrected Version & Summary */}
          <Card className="p-4 sm:p-6 bg-card border border-border rounded-card space-y-4 shadow-xs">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <HugeiconsIcon
                  icon={result.isErrorFree ? CheckmarkCircle02Icon : BookOpen01Icon}
                  size={20}
                  className="text-primary shrink-0 mt-0.5"
                />
                <div className="space-y-1">
                  <h3 className="text-card-title text-foreground">
                    {result.isErrorFree
                      ? isBn
                        ? "চমৎকার! কোনো বড় ভুল নেই"
                        : "Clean & Accurate Writing"
                      : isBn
                      ? "সংশোধিত সংস্করণ ও সারসংক্ষেপ"
                      : "Corrected Version & Summary"}
                  </h3>
                  <p className={cn("text-meta text-muted-foreground", isBn && "text-bangla")}>
                    {result.summary}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => handleCopy("corrected", result.correctedText)}
                className="shrink-0 gap-1.5"
              >
                <HugeiconsIcon icon={Copy01Icon} size={14} />
                <span>{copiedKey === "corrected" ? "Copied" : "Copy"}</span>
              </Button>
            </div>

            <div className="rounded-panel bg-muted/40 border border-border/60 p-4 text-body text-foreground leading-relaxed">
              {result.correctedText}
            </div>
          </Card>

          {/* 3. Mistakes & Explanations */}
          {result.issues.length > 0 && (
            <Card className="p-4 sm:p-6 bg-card border border-border rounded-card space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-card-title text-foreground">
                  {isBn ? "ভুল ও কারণসমূহ" : "Mistakes & Explanations"}
                </h3>
                <Badge variant="outline" size="sm" className="font-mono">
                  {result.issues.length} {result.issues.length === 1 ? "issue" : "issues"}
                </Badge>
              </div>

              <div className="space-y-3">
                {result.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="rounded-panel bg-muted/35 border border-border/60 p-4 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-label">
                        <span className="line-through text-destructive">
                          {issue.original}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-label text-primary">
                          {issue.correction}
                        </span>
                      </div>
                      <Badge variant="neutral" size="sm">
                        {issue.category}
                      </Badge>
                    </div>
                    <p className={cn("text-meta text-muted-foreground leading-relaxed", isBn && "text-bangla")}>
                      {issue.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 4. Better Versions (Formal, Casual, IELTS) */}
          <Card className="p-4 sm:p-6 bg-card border border-border rounded-card space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={CheckmarkBadge01Icon} size={20} className="text-primary shrink-0" />
              <h3 className="text-card-title text-foreground">
                {isBn ? "আরও ভালো সংস্করণ (৩টি স্টাইল)" : "Better Versions (3 Styles)"}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  key: "formal",
                  title: "Formal Style",
                  subtitle: isBn ? "অফিস ও প্রফেশনাল" : "Workplace & Polite",
                  text: result.rewrites.formal,
                },
                {
                  key: "casual",
                  title: "Casual Style",
                  subtitle: isBn ? "স্বাভাবিক কথোপকথন" : "Everyday Natural",
                  text: result.rewrites.casual,
                },
                {
                  key: "ielts",
                  title: "IELTS Style",
                  subtitle: isBn ? "ব্যান্ড ৮+ একাডেমিক" : "Band 8+ Academic",
                  text: result.rewrites.ielts,
                },
              ].map((styleItem) => (
                <div
                  key={styleItem.key}
                  className="rounded-panel bg-muted/35 border border-border/60 p-4 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-label text-foreground">
                          {styleItem.title}
                        </p>
                        <p className="text-chip text-muted-foreground">
                          {styleItem.subtitle}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => handleCopy(styleItem.key, styleItem.text)}
                        aria-label={`Copy ${styleItem.title}`}
                      >
                        <HugeiconsIcon icon={Copy01Icon} size={14} />
                      </Button>
                    </div>
                    <p className="text-meta text-foreground leading-relaxed">
                      {styleItem.text}
                    </p>
                  </div>
                  {copiedKey === styleItem.key && (
                    <span className="text-chip text-primary">Copied!</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
