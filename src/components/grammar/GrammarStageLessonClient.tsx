"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Pill } from "@/components/ui/pill";
import { Input } from "@/components/ui/input";
import { useTranslationLocale } from "@/lib/i18n";
import { useLiveTranslation } from "@/lib/i18n/use-live-translation";
import { isRtlLanguage } from "@/lib/i18n/languages";
import { speakText } from "@/lib/audio/speech-engine";
import { cn } from "@/lib/utils";
import {
  GRAMMAR_STAGES,
  getTranslatedText,
  type GrammarDetailedLesson,
  type GrammarStage,
} from "@/lib/grammar/learning-path";
import { COMPLETED_STORAGE_KEY } from "./GrammarPathClient";
import type { GrammarCheckResponse } from "@/lib/ai/grammar-check";

type LessonTab = "learn" | "sentences" | "rightWord" | "quiz";

interface GrammarStageLessonClientProps {
  stage: GrammarStage;
  lessons: GrammarDetailedLesson[];
}

export function GrammarStageLessonClient({ stage, lessons }: GrammarStageLessonClientProps) {
  const translationLocale = useTranslationLocale();
  const ruleLocale = translationLocale === "none" ? "en" : translationLocale;
  const needsLiveTranslation = ruleLocale !== "bn" && ruleLocale !== "hi" && ruleLocale !== "en";

  const [activeLessonId, setActiveLessonId] = useState<string>(lessons[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<LessonTab>("learn");
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // 5 Sentence Making state (indexed 0..4)
  const [sentenceInputs, setSentenceInputs] = useState<Record<number, string>>({});
  const [checkingIdx, setCheckingIdx] = useState<number | null>(null);
  const [sentenceFeedbacks, setSentenceFeedbacks] = useState<Record<number, GrammarCheckResponse>>({});
  const [sentenceErrors, setSentenceErrors] = useState<Record<number, string>>({});

  // Right Word Choose state
  const [rightWordAnswers, setRightWordAnswers] = useState<Record<number, number>>({});

  // 10-Question Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(COMPLETED_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setCompletedIds(parsed.filter((id): id is string => typeof id === "string"));
          }
        }
      } catch {
        // Ignore storage errors
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const persistCompleted = (nextIds: string[]) => {
    setCompletedIds(nextIds);
    try {
      localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(nextIds));
    } catch {
      // Ignore storage errors
    }
  };

  const toggleLessonCompleted = (lessonId: string) => {
    if (completedIds.includes(lessonId)) {
      persistCompleted(completedIds.filter((id) => id !== lessonId));
    } else {
      persistCompleted([...completedIds, lessonId]);
    }
  };

  const activeLesson = useMemo(
    () => lessons.find((l) => l.id === activeLessonId) ?? lessons[0],
    [lessons, activeLessonId]
  );

  const { translatedText: liveOverviewRule } = useLiveTranslation(
    needsLiveTranslation && activeLesson ? activeLesson.overviewRule.en : undefined,
    ruleLocale
  );

  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveTab("learn");
    setSentenceInputs({});
    setSentenceFeedbacks({});
    setSentenceErrors({});
    setRightWordAnswers({});
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleCheckPromptSentence = async (idx: number, e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLesson) return;
    const text = (sentenceInputs[idx] || "").trim();
    if (text.length < 2) return;

    setCheckingIdx(idx);
    setSentenceErrors((prev) => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });

    try {
      const res = await fetch("/api/v1/ai/grammar-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: activeLesson.id,
          topicTitle: `${activeLesson.title} — ${activeLesson.sentencePrompts[idx] || ""}`,
          formula: activeLesson.formula,
          sentence: text,
          locale: ruleLocale,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSentenceErrors((prev) => ({ ...prev, [idx]: data.message || "Could not check sentence." }));
      } else {
        setSentenceFeedbacks((prev) => ({ ...prev, [idx]: data }));
      }
    } catch {
      setSentenceErrors((prev) => ({ ...prev, [idx]: "Network error while checking sentence." }));
    } finally {
      setCheckingIdx(null);
    }
  };

  if (!activeLesson) {
    return null;
  }

  const displayedOverviewRule =
    needsLiveTranslation && liveOverviewRule
      ? liveOverviewRule
      : getTranslatedText(activeLesson.overviewRule, ruleLocale);

  const quizScore = activeLesson.quizQuestions.reduce((acc, q, idx) => {
    return acc + (quizAnswers[idx] === q.correctIndex ? 1 : 0);
  }, 0);

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    if (quizScore >= 6 && !completedIds.includes(activeLesson.id)) {
      persistCompleted([...completedIds, activeLesson.id]);
    }
  };

  const sidebarContent = (
    <>
      <Link
        href="/grammar-path"
        className="inline-flex items-center gap-1.5 text-label text-primary hover:underline"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
        <span>All 8 Stages</span>
      </Link>

      <div className="p-3.5 rounded-panel bg-muted/60 space-y-1">
        <Tag variant="brand" size="sm">
          Stage {stage.stageNumber}
        </Tag>
        <h2 className="text-label font-semibold text-foreground">{stage.title}</h2>
        <p className="text-chip text-muted-foreground">{stage.subtitle}</p>
      </div>

      <div className="space-y-1.5">
        <p className="text-chip uppercase tracking-wider text-muted-foreground px-1">
          Lessons in Stage {stage.stageNumber} ({lessons.length})
        </p>
        {lessons.map((lesson) => {
          const isSelected = lesson.id === activeLesson.id;
          const isDone = completedIds.includes(lesson.id);
          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => handleSelectLesson(lesson.id)}
              className={cn(
                "w-full px-3 py-2.5 rounded-control flex items-center justify-between gap-2 text-left transition-colors cursor-pointer",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-foreground hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <HugeiconsIcon
                  icon={isDone ? CheckmarkCircle02Icon : BookOpen01Icon}
                  size={16}
                  className={cn(
                    "shrink-0",
                    isSelected ? "text-primary-foreground" : isDone ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span className="text-meta truncate">{lesson.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-3 border-t border-border space-y-2">
        <p className="text-chip uppercase tracking-wider text-muted-foreground px-1">
          Switch Stage
        </p>
        <div className="flex flex-wrap gap-1.5">
          {GRAMMAR_STAGES.map((st) => (
            <Link key={st.stageNumber} href={`/grammar-path/${st.slug}`}>
              <Button
                type="button"
                variant={st.stageNumber === stage.stageNumber ? "default" : "outline"}
                size="xs"
              >
                S{st.stageNumber}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="w-full lg:pr-80 xl:pr-96">
      {/* ================= MIDDLE CONTENT AREA ================= */}
      <div className="w-full px-4 sm:px-6 lg:px-9 py-6 pb-16 space-y-6">
        {/* Top Lesson Header */}
        <Card className="p-5 sm:p-6 bg-card border border-border space-y-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag variant="brand" size="sm">
                  {stage.title}
                </Tag>
                {activeLesson.levels.map((lvl) => (
                  <Pill key={lvl} variant="neutral" size="sm">
                    {lvl.toUpperCase()}
                  </Pill>
                ))}
              </div>
              <h1 className="text-page-title text-foreground">{activeLesson.title}</h1>
              <p className="text-meta text-primary font-mono">{activeLesson.formula}</p>
            </div>

            <Button
              type="button"
              variant={completedIds.includes(activeLesson.id) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLessonCompleted(activeLesson.id)}
              className="gap-1.5"
            >
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
              <span>{completedIds.includes(activeLesson.id) ? "Completed" : "Mark Complete"}</span>
            </Button>
          </div>

          {/* 4-Step Navigation Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant={activeTab === "learn" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("learn")}
            >
              1. Rules & Examples
            </Button>
            <Button
              type="button"
              variant={activeTab === "sentences" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("sentences")}
            >
              2. 5 Sentence Making
            </Button>
            <Button
              type="button"
              variant={activeTab === "rightWord" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("rightWord")}
            >
              3. Right Word Choose ({activeLesson.rightWordQuestions.length})
            </Button>
            <Button
              type="button"
              variant={activeTab === "quiz" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("quiz")}
            >
              4. Quiz ({activeLesson.quizQuestions.length})
            </Button>
          </div>
        </Card>

        {/* ================= TAB 1: DETAILED RULES, SUB-TYPES, WORD BANK & EXAMPLES ================= */}
        {activeTab === "learn" && (
          <div className="space-y-6">
            {/* Overview Rule (in user's translate language) */}
            <Card className="p-5 sm:p-6 bg-card border border-border space-y-3">
              <div className="flex items-center gap-2">
                <Tag variant="brand" size="sm">
                  Overview Rule
                </Tag>
              </div>
              <div
                className="p-4 rounded-panel bg-muted"
                dir={isRtlLanguage(ruleLocale) ? "rtl" : "ltr"}
              >
                <p
                  className={cn(
                    "text-body text-foreground",
                    ruleLocale === "bn" && "text-bangla"
                  )}
                >
                  {displayedOverviewRule}
                </p>
              </div>
            </Card>

            {/* Inner Sub-Types in Detail */}
            <Card className="p-5 sm:p-6 bg-card border border-border space-y-4">
              <div className="space-y-1">
                <h2 className="text-card-title text-foreground font-semibold">
                  Detailed Types & Sub-Rules ({activeLesson.subTypes.length})
                </h2>
                <p className="text-meta text-muted-foreground">
                  Every type explained clearly with dedicated word examples and sentences.
                </p>
              </div>

              <div className="space-y-4">
                {activeLesson.subTypes.map((sub, sIdx) => (
                  <div key={`${activeLesson.id}-sub-${sIdx}`} className="p-4 rounded-panel bg-muted/60 space-y-3">
                    <h3 className="text-lead text-foreground font-semibold">{sub.name}</h3>
                    <p
                      className={cn(
                        "text-body text-foreground",
                        ruleLocale === "bn" && "text-bangla"
                      )}
                      dir={isRtlLanguage(ruleLocale) ? "rtl" : "ltr"}
                    >
                      {getTranslatedText(sub.rule, ruleLocale)}
                    </p>

                    {/* Sub-type word chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {sub.words.map((w, wIdx) => (
                        <button
                          key={`${sub.name}-w-${wIdx}`}
                          type="button"
                          onClick={() => speakText(w)}
                          className="px-2.5 py-1 rounded-pill bg-card text-meta text-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>{w}</span>
                          <HugeiconsIcon icon={VolumeHighIcon} size={12} />
                        </button>
                      ))}
                    </div>

                    {/* Sub-type sentences */}
                    <div className="space-y-1.5 pt-1">
                      {sub.sentences.map((sent, sentIdx) => (
                        <div
                          key={`${sub.name}-s-${sentIdx}`}
                          className="p-2.5 rounded-control bg-card flex items-center justify-between gap-2"
                        >
                          <p className="text-meta text-foreground">{sent}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => speakText(sent)}
                            aria-label="Listen"
                          >
                            <HugeiconsIcon icon={VolumeHighIcon} size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* 20-30 Word Bank */}
            <Card className="p-5 sm:p-6 bg-card border border-border space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="text-card-title text-foreground font-semibold">
                  Word Bank ({activeLesson.wordBank.length} Words)
                </h2>
                <Pill variant="neutral" size="sm">
                  Tap any word to listen
                </Pill>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeLesson.wordBank.map((word, idx) => (
                  <button
                    key={`${activeLesson.id}-wb-${idx}`}
                    type="button"
                    onClick={() => speakText(word)}
                    className="px-3 py-1.5 rounded-pill bg-muted text-meta text-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>{word}</span>
                    <HugeiconsIcon icon={VolumeHighIcon} size={14} />
                  </button>
                ))}
              </div>
            </Card>

            {/* Sentence Examples */}
            <Card className="p-5 sm:p-6 bg-card border border-border space-y-3">
              <h2 className="text-card-title text-foreground font-semibold">
                Sentence Examples ({activeLesson.sentenceExamples.length})
              </h2>
              <div className="space-y-2">
                {activeLesson.sentenceExamples.map((ex, idx) => (
                  <div
                    key={`${activeLesson.id}-ex-${idx}`}
                    className="p-3 rounded-panel bg-muted/60 flex items-center justify-between gap-3"
                  >
                    <p className="text-body text-foreground">{ex}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => speakText(ex)}
                      aria-label={`Listen to example ${idx + 1}`}
                    >
                      <HugeiconsIcon icon={VolumeHighIcon} size={16} />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="pt-2 flex justify-end">
                <Button type="button" onClick={() => setActiveTab("sentences")}>
                  Next: 5 Sentence Making →
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* ================= TAB 2: 5 SENTENCE MAKING ================= */}
        {activeTab === "sentences" && (
          <Card className="p-5 sm:p-6 bg-card border border-border space-y-5">
            <div className="space-y-1">
              <h2 className="text-card-title text-foreground font-semibold">
                Practice 1: Make 5 Sentences
              </h2>
              <p className="text-meta text-muted-foreground">
                Write 1 English sentence for each prompt below and get instant AI grammar feedback.
              </p>
            </div>

            <div className="space-y-4">
              {activeLesson.sentencePrompts.map((prompt, idx) => {
                const fb = sentenceFeedbacks[idx];
                const err = sentenceErrors[idx];
                const isChecking = checkingIdx === idx;
                return (
                  <div key={`${activeLesson.id}-sp-${idx}`} className="p-4 rounded-panel bg-muted/50 space-y-3">
                    <div className="flex items-center gap-2">
                      <Tag variant="brand" size="sm">
                        Sentence {idx + 1} / {activeLesson.sentencePrompts.length}
                      </Tag>
                    </div>
                    <p className="text-body text-foreground font-semibold">{prompt}</p>
                    <form onSubmit={(e) => handleCheckPromptSentence(idx, e)} className="flex flex-col sm:flex-row gap-2">
                      <Input
                        value={sentenceInputs[idx] || ""}
                        onChange={(e) => setSentenceInputs((prev) => ({ ...prev, [idx]: e.target.value }))}
                        placeholder="Write your English sentence..."
                        className="flex-1"
                        disabled={isChecking}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        disabled={isChecking || (sentenceInputs[idx] || "").trim().length < 2}
                      >
                        {isChecking ? "Checking..." : "Check"}
                      </Button>
                    </form>
                    {err && <p className="text-meta text-destructive">{err}</p>}
                    {fb && (
                      <div
                        className="p-3 rounded-control bg-card space-y-1.5"
                        dir={isRtlLanguage(ruleLocale) ? "rtl" : "ltr"}
                      >
                        <Tag variant={fb.isCorrect ? "success" : "warning"} size="sm">
                          {fb.isCorrect ? "Correct" : "Needs Polish"}
                        </Tag>
                        <p className={cn("text-body text-foreground", ruleLocale === "bn" && "text-bangla")}>
                          {fb.feedback}
                        </p>
                        {fb.correctedSentence && (
                          <p className="text-meta text-primary font-semibold" dir="ltr">
                            Suggested: &ldquo;{fb.correctedSentence}&rdquo;
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveTab("learn")}>
                ← Back to Rules
              </Button>
              <Button type="button" onClick={() => setActiveTab("rightWord")}>
                Next: Right Word Choose →
              </Button>
            </div>
          </Card>
        )}

        {/* ================= TAB 3: RIGHT WORD CHOOSE ================= */}
        {activeTab === "rightWord" && (
          <Card className="p-5 sm:p-6 bg-card border border-border space-y-5">
            <div className="space-y-1">
              <h2 className="text-card-title text-foreground font-semibold">
                Practice 2: Choose the Right Word
              </h2>
              <p className="text-meta text-muted-foreground">
                Pick the option that accurately follows this lesson&apos;s rule.
              </p>
            </div>

            <div className="space-y-4">
              {activeLesson.rightWordQuestions.map((q, qIdx) => {
                const chosen = rightWordAnswers[qIdx];
                const isAnswered = chosen !== undefined;
                const isRight = chosen === q.correctIndex;
                return (
                  <div key={`${activeLesson.id}-rw-${qIdx}`} className="p-4 rounded-panel bg-muted/50 space-y-3">
                    <p className="text-body text-foreground font-semibold">
                      {qIdx + 1}. {q.prompt}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = chosen === oIdx;
                        const isCorrectOpt = oIdx === q.correctIndex;
                        return (
                          <Button
                            key={`${qIdx}-opt-${oIdx}`}
                            type="button"
                            variant={
                              !isAnswered
                                ? "outline"
                                : isCorrectOpt
                                ? "default"
                                : isSelected
                                ? "destructive"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setRightWordAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                            className="justify-start"
                          >
                            {opt}
                          </Button>
                        );
                      })}
                    </div>
                    {isAnswered && (
                      <div
                        className="p-3 rounded-control bg-card space-y-1"
                        dir={isRtlLanguage(ruleLocale) ? "rtl" : "ltr"}
                      >
                        <Tag variant={isRight ? "success" : "warning"} size="sm">
                          {isRight ? "Correct!" : "Review Rule"}
                        </Tag>
                        <p className={cn("text-body text-foreground", ruleLocale === "bn" && "text-bangla")}>
                          {getTranslatedText(q.explanation, ruleLocale)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveTab("sentences")}>
                ← Back to Sentence Making
              </Button>
              <Button type="button" onClick={() => setActiveTab("quiz")}>
                Next: 10-Question Quiz →
              </Button>
            </div>
          </Card>
        )}

        {/* ================= TAB 4: 10-QUESTION QUIZ ================= */}
        {activeTab === "quiz" && (
          <Card className="p-5 sm:p-6 bg-card border border-border space-y-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="space-y-1">
                <h2 className="text-card-title text-foreground font-semibold">
                  Final Quiz ({activeLesson.quizQuestions.length} Questions)
                </h2>
                <p className="text-meta text-muted-foreground">
                  Score 6 or higher to mark this lesson complete automatically.
                </p>
              </div>
              {quizSubmitted && (
                <Tag variant={quizScore >= 6 ? "success" : "warning"} size="md">
                  Score: {quizScore} / {activeLesson.quizQuestions.length}
                </Tag>
              )}
            </div>

            <div className="space-y-4">
              {activeLesson.quizQuestions.map((q, qIdx) => {
                const chosen = quizAnswers[qIdx];
                return (
                  <div key={`${activeLesson.id}-qz-${qIdx}`} className="p-4 rounded-panel bg-muted/50 space-y-3">
                    <p className="text-body text-foreground font-semibold">
                      {qIdx + 1}. {q.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = chosen === oIdx;
                        const isCorrectOpt = oIdx === q.correctIndex;
                        let variant: "default" | "outline" | "destructive" = isSelected ? "default" : "outline";
                        if (quizSubmitted) {
                          if (isCorrectOpt) variant = "default";
                          else if (isSelected) variant = "destructive";
                          else variant = "outline";
                        }
                        return (
                          <Button
                            key={`${qIdx}-qopt-${oIdx}`}
                            type="button"
                            variant={variant}
                            size="sm"
                            disabled={quizSubmitted}
                            onClick={() => setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                            className="justify-start"
                          >
                            {opt}
                          </Button>
                        );
                      })}
                    </div>
                    {quizSubmitted && (
                      <div
                        className="p-3 rounded-control bg-card"
                        dir={isRtlLanguage(ruleLocale) ? "rtl" : "ltr"}
                      >
                        <p className={cn("text-body text-foreground", ruleLocale === "bn" && "text-bangla")}>
                          {getTranslatedText(q.explanation, ruleLocale)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
              <Button type="button" variant="outline" onClick={() => setActiveTab("rightWord")}>
                ← Back to Right Word
              </Button>
              {!quizSubmitted ? (
                <Button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length < activeLesson.quizQuestions.length}
                >
                  Submit Quiz ({Object.keys(quizAnswers).length}/{activeLesson.quizQuestions.length})
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                >
                  Retake Quiz
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Mobile/Tablet Sidebar Controls */}
        <div className="lg:hidden p-4 rounded-card border border-border bg-card space-y-4">
          {sidebarContent}
        </div>
      </div>

      {/* ================= FIXED RIGHT SIDEBAR ================= */}
      <aside className="hidden lg:flex flex-col fixed right-0 top-header h-below-header w-80 xl:w-96 border-l border-border bg-card z-sidebar overflow-y-auto p-4 space-y-4">
        {sidebarContent}
      </aside>
    </div>
  );
}
