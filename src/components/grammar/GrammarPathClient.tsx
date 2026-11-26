"use client";

import React, { useState, useEffect, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  VolumeHighIcon,
  SparklesIcon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  Clock01Icon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";
import { PageContainer } from "@/components/shared/PageContainer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Pill } from "@/components/ui/pill";
import { Input } from "@/components/ui/input";
import { LocaleTitle } from "@/components/shared";
import { useLocale, useTranslationLocale } from "@/lib/i18n";
import { useLiveTranslation } from "@/lib/i18n/use-live-translation";
import { isRtlLanguage } from "@/lib/i18n/languages";
import { speakText } from "@/lib/audio/speech-engine";
import { cn } from "@/lib/utils";
import {
  GRAMMAR_STAGES,
  LEVEL_PRIORITIES,
  getTopicRule,
  type GrammarLevelFilter,
  type GrammarTopic,
} from "@/lib/grammar/learning-path";
import { GRAMMAR_TOPICS } from "@/lib/grammar/learning-path-data";
import type { GrammarCheckResponse } from "@/lib/ai/grammar-check";

const COMPLETED_STORAGE_KEY = "ecp_grammar_path_completed_v1";

export function GrammarPathClient() {
  const locale = useLocale();
  const translationLocale = useTranslationLocale();
  const ruleLocale = translationLocale === "none" ? "en" : translationLocale;
  const [selectedLevel, setSelectedLevel] = useState<GrammarLevelFilter>("all");
  const [expandedStage, setExpandedStage] = useState<number>(1);
  const [activeTopicId, setActiveTopicId] = useState<string>(GRAMMAR_TOPICS[0].id);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [sentenceInput, setSentenceInput] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<GrammarCheckResponse | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

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

  const toggleTopicCompleted = (topicId: string) => {
    if (completedIds.includes(topicId)) {
      persistCompleted(completedIds.filter((id) => id !== topicId));
    } else {
      persistCompleted([...completedIds, topicId]);
    }
  };

  const activeLevelInfo = useMemo(
    () => LEVEL_PRIORITIES.find((lvl) => lvl.id === selectedLevel) ?? LEVEL_PRIORITIES[0],
    [selectedLevel]
  );

  const activeTopic: GrammarTopic = useMemo(
    () => GRAMMAR_TOPICS.find((t) => t.id === activeTopicId) ?? GRAMMAR_TOPICS[0],
    [activeTopicId]
  );

  const needsLiveRuleTranslation =
    ruleLocale !== "bn" && ruleLocale !== "hi" && ruleLocale !== "en";
  const { translatedText: liveTranslatedRule } = useLiveTranslation(
    needsLiveRuleTranslation ? activeTopic.rules.en : undefined,
    ruleLocale
  );
  const displayedRule =
    needsLiveRuleTranslation && liveTranslatedRule
      ? liveTranslatedRule
      : getTopicRule(activeTopic, ruleLocale);

  const handleSelectTopic = (topic: GrammarTopic) => {
    setActiveTopicId(topic.id);
    setExpandedStage(topic.stageNumber);
    setSentenceInput("");
    setCheckResult(null);
    setCheckError(null);
  };

  const handleCheckSentence = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = sentenceInput.trim();
    if (trimmed.length < 2) return;

    setIsChecking(true);
    setCheckError(null);
    setCheckResult(null);

    try {
      const res = await fetch("/api/v1/ai/grammar-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: activeTopic.id,
          topicTitle: activeTopic.title,
          formula: activeTopic.formula,
          sentence: trimmed,
          locale: ruleLocale,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckError(data.message || "Could not check sentence right now.");
      } else {
        setCheckResult(data);
        if (data.isCorrect && !completedIds.includes(activeTopic.id)) {
          persistCompleted([...completedIds, activeTopic.id]);
        }
      }
    } catch {
      setCheckError("Network error while checking your sentence.");
    } finally {
      setIsChecking(false);
    }
  };

  const completedCount = completedIds.length;
  const totalCount = GRAMMAR_TOPICS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const isBangla = locale === "bn";

  return (
    <PageContainer className="py-6 space-y-6 pb-16">
      {/* Header & Progress Overview */}
      <Card className="p-5 sm:p-6 bg-card border border-border space-y-4 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Tag variant="brand" size="sm">
              8 Stages · {totalCount} Topics
            </Tag>
            <Pill variant="neutral" size="sm">
              Step-by-Step Roadmap
            </Pill>
          </div>
          <Pill variant="brand" size="sm">
            {completedCount} / {totalCount} Completed ({progressPercent}%)
          </Pill>
        </div>

        <div className="space-y-1.5">
          <LocaleTitle
            as="h1"
            titleEn="Grammar Learning Path"
            titleBn="গ্রামার লার্নিং পাথ"
            className="text-page-title text-foreground"
          />
          <p className={cn("text-meta text-muted-foreground", isBangla && "text-subtitle-bn")}>
            {isBangla
              ? "সহজ থেকে অ্যাডভান্সড পর্যন্ত ৮টি ধাপে সম্পূর্ণ ইংরেজি গ্রামার। প্রতিটি টপিকে নিয়ম (বাংলায়), ৫-৮টি উদাহরণ এবং নিজে বাক্য বানানোর অনুশীলন রয়েছে।"
              : locale === "hi"
              ? "बेसिक से एडवांस्ड तक 8 चरणों में पूरा अंग्रेजी ग्रामर। हर टॉपिक में नियम (हिन्दी में), 5-8 उदाहरण और खुद वाक्य बनाने का अभ्यास है।"
              : "Master English grammar from foundation to fluency across 8 structured stages. Each topic includes a concise rule, 5–8 examples, and sentence-making practice."}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-pill bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Core Trick + Daily Routine */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-panel bg-muted space-y-1">
            <div className="flex items-center gap-2 text-label text-foreground font-semibold">
              <HugeiconsIcon icon={SparklesIcon} size={16} className="text-primary" />
              <span>Golden Sequence Trick</span>
            </div>
            <p className={cn("text-meta text-muted-foreground", isBangla && "text-subtitle-bn")}>
              {isBangla
                ? '"Tense first, then Sentence, then Transformation." — Tense হলো গ্রামারের হৃদয়। Stage 1 থেকে 8 ধারাবাহিকভাবে এগোলে Voice বা Narration সহজ হয়ে যাবে।'
                : locale === "hi"
                ? '"Tense first, then Sentence, then Transformation." — Tense ग्रामर का दिल है। Stage 1 से 8 तक क्रम से आगे बढ़ें।'
                : '"Tense first, then Sentence, then Transformation." — Tenses are the heart of grammar. Follow Stages 1–8 in order to avoid confusion.'}
            </p>
          </div>

          <div className="p-3.5 rounded-panel bg-muted space-y-1">
            <div className="flex items-center gap-2 text-label text-foreground font-semibold">
              <HugeiconsIcon icon={Clock01Icon} size={16} className="text-primary" />
              <span>Daily Routine (30–45 min)</span>
            </div>
            <p className={cn("text-meta text-muted-foreground", isBangla && "text-subtitle-bn")}>
              {isBangla
                ? "প্রতিদিন ১টি ছোট টপিক (৩০–৪৫ মিনিট): নিয়ম বুঝুন → উদাহরণ দেখুন → নিজের বাক্য বানান। পরের দিন আগের টপিক ৫ মিনিট রিভাইজ করে নতুন টপিক শুরু করুন।"
                : locale === "hi"
                ? "रोज़ 1 छोटा टॉपिक (30–45 मिनट): नियम समझें → उदाहरण देखें → अपना वाक्य बनाएं। अगले दिन 5 मिनट दोहराकर नया टॉपिक शुरू करें।"
                : "One small topic per day (30–45 min): Understand the rule → Study examples → Build your own sentence. Next day, revise for 5 min before starting a new topic."}
            </p>
          </div>
        </div>
      </Card>

      {/* Level Priority Filter */}
      <Card className="p-4 sm:p-5 bg-card border border-border space-y-3">
        <div className="flex items-center gap-2 text-label text-foreground font-semibold">
          <HugeiconsIcon icon={Layers01Icon} size={18} className="text-primary" />
          <span>Focus by Goal / Level Priority</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {LEVEL_PRIORITIES.map((lvl) => {
            const isActive = selectedLevel === lvl.id;
            return (
              <Button
                key={lvl.id}
                type="button"
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel(lvl.id)}
              >
                {lvl.label}
              </Button>
            );
          })}
        </div>
        <p className={cn("text-meta text-muted-foreground", isBangla && "text-subtitle-bn")}>
          {activeLevelInfo.focusSummary[locale] || activeLevelInfo.focusSummary.en}
        </p>
      </Card>

      {/* Main Split Layout: Left = 8 Stages Roadmap, Right = 3-Step Topic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 8 Stages Accordion */}
        <div className="lg:col-span-5 space-y-3">
          {GRAMMAR_STAGES.map((stage) => {
            const stageTopics = GRAMMAR_TOPICS.filter((t) => t.stageNumber === stage.stageNumber);
            const stageDoneCount = stageTopics.filter((t) => completedIds.includes(t.id)).length;
            const isRecommended =
              selectedLevel === "all" || activeLevelInfo.recommendedStages.includes(stage.stageNumber);
            const isOpen = expandedStage === stage.stageNumber;

            return (
              <Card
                key={stage.stageNumber}
                className={cn(
                  "bg-card border border-border overflow-hidden transition-opacity",
                  !isRecommended && "opacity-60"
                )}
              >
                <button
                  type="button"
                  onClick={() => setExpandedStage(isOpen ? 0 : stage.stageNumber)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-label font-semibold text-foreground">{stage.title}</span>
                      {isRecommended && selectedLevel !== "all" && (
                        <Tag variant="brand" size="sm">
                          Priority
                        </Tag>
                      )}
                    </div>
                    <p className="text-chip text-muted-foreground truncate">{stage.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Pill variant="neutral" size="sm">
                      {stageDoneCount}/{stageTopics.length}
                    </Pill>
                    <HugeiconsIcon
                      icon={isOpen ? ArrowDown01Icon : ArrowRight01Icon}
                      size={18}
                      className="text-muted-foreground"
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-3 pb-3 space-y-1.5 border-t border-border pt-2.5">
                    {stageTopics.map((topic) => {
                      const isSelected = topic.id === activeTopic.id;
                      const isDone = completedIds.includes(topic.id);
                      const isLevelTopic =
                        selectedLevel === "all" || topic.levels.includes(selectedLevel);

                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => handleSelectTopic(topic)}
                          className={cn(
                            "w-full px-3 py-2.5 rounded-control flex items-center justify-between gap-2 text-left transition-colors cursor-pointer",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/60 text-foreground hover:bg-muted",
                            !isLevelTopic && !isSelected && "opacity-65"
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <HugeiconsIcon
                              icon={isDone ? CheckmarkCircle02Icon : BookOpen01Icon}
                              size={16}
                              className={cn(
                                "shrink-0",
                                isSelected
                                  ? "text-primary-foreground"
                                  : isDone
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              )}
                            />
                            <span className="text-label truncate">{topic.title}</span>
                          </div>
                          {selectedLevel !== "all" && topic.levels.includes(selectedLevel) && !isSelected && (
                            <Pill variant="brand" size="sm">
                              Key
                            </Pill>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Right: Active Topic 3-Step Learning Card */}
        <Card className="lg:col-span-7 p-5 sm:p-6 bg-card border border-border space-y-6">
          {/* Topic Title & Complete Toggle */}
          <div className="flex items-start justify-between gap-3 flex-wrap border-b border-border pb-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag variant="brand" size="sm">
                  Stage {activeTopic.stageNumber}
                </Tag>
                {activeTopic.levels.map((lvl) => (
                  <Pill key={lvl} variant="neutral" size="sm">
                    {lvl.toUpperCase()}
                  </Pill>
                ))}
              </div>
              <h2 className="text-card-title text-foreground font-semibold">{activeTopic.title}</h2>
              <p className="text-meta text-primary font-mono">{activeTopic.formula}</p>
            </div>

            <Button
              type="button"
              variant={completedIds.includes(activeTopic.id) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleTopicCompleted(activeTopic.id)}
              className="gap-1.5"
            >
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
              <span>{completedIds.includes(activeTopic.id) ? "Completed" : "Mark Complete"}</span>
            </Button>
          </div>

          {/* Step 1: Rule (in user's translate language) */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Pill variant="brand" size="sm">
                Step 1
              </Pill>
              <h3 className="text-label font-semibold text-foreground">
                {isBangla ? "নিয়ম বুঝুন (Rule)" : locale === "hi" ? "नियम समझें (Rule)" : "Understand the Rule"}
              </h3>
            </div>
            <div className="p-4 rounded-panel bg-muted" dir={isRtlLanguage(ruleLocale) ? "rtl" : "ltr"}>
              <p className={cn("text-body text-foreground leading-relaxed", ruleLocale === "bn" && "text-subtitle-bn")}>
                {displayedRule}
              </p>
            </div>
          </div>

          {/* Step 2: Examples (5-8 English sentences with audio) */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Pill variant="brand" size="sm">
                Step 2
              </Pill>
              <h3 className="text-label font-semibold text-foreground">
                Examples ({activeTopic.examples.length})
              </h3>
            </div>
            <div className="space-y-2">
              {activeTopic.examples.map((example, idx) => (
                <div
                  key={`${activeTopic.id}-ex-${idx}`}
                  className="p-3 rounded-panel bg-muted/60 flex items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="text-chip text-muted-foreground font-mono pt-0.5">
                      {idx + 1}.
                    </span>
                    <p className="text-body text-foreground">{example}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => speakText(example)}
                    aria-label={`Listen to example ${idx + 1}`}
                    className="shrink-0"
                  >
                    <HugeiconsIcon icon={VolumeHighIcon} size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Make Your Own Sentence */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <Pill variant="brand" size="sm">
                Step 3
              </Pill>
              <h3 className="text-label font-semibold text-foreground">
                Make Your Own Sentence
              </h3>
            </div>
            <p className="text-meta text-muted-foreground">{activeTopic.practicePrompt}</p>

            <form onSubmit={handleCheckSentence} className="flex flex-col sm:flex-row gap-2.5">
              <Input
                value={sentenceInput}
                onChange={(e) => setSentenceInput(e.target.value)}
                placeholder="Type your English sentence here..."
                className="flex-1"
                disabled={isChecking}
              />
              <Button
                type="submit"
                disabled={isChecking || sentenceInput.trim().length < 2}
                className="shrink-0"
              >
                {isChecking ? "Checking..." : "Check Sentence"}
              </Button>
            </form>

            {checkError && (
              <div className="p-3.5 rounded-panel bg-destructive/10 text-destructive text-meta">
                {checkError}
              </div>
            )}

            {checkResult && (
              <div
                className={cn(
                  "p-4 rounded-panel space-y-2",
                  checkResult.isCorrect ? "bg-muted" : "bg-muted"
                )}
                dir={isRtlLanguage(ruleLocale) ? "rtl" : "ltr"}
              >
                <div className="flex items-center gap-2">
                  <Tag variant={checkResult.isCorrect ? "success" : "warning"} size="sm">
                    {checkResult.isCorrect ? "Great Job" : "Needs Polish"}
                  </Tag>
                </div>
                <p className={cn("text-body text-foreground", ruleLocale === "bn" && "text-subtitle-bn")}>
                  {checkResult.feedback}
                </p>
                {checkResult.correctedSentence && (
                  <p className="text-meta text-primary font-semibold" dir="ltr">
                    Suggested: &ldquo;{checkResult.correctedSentence}&rdquo;
                  </p>
                )}
                {checkResult.tip && (
                  <p className={cn("text-meta text-muted-foreground", ruleLocale === "bn" && "text-subtitle-bn")}>
                    {checkResult.tip}
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
