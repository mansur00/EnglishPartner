"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  RefreshIcon,
  CheckmarkCircle02Icon,
  VolumeHighIcon,
  ArrowRight01Icon,
  Mic01Icon,
  StopIcon,
  Award01Icon,
} from "@hugeicons/core-free-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { speakText } from "@/lib/audio/speech-engine";
import { useLiveTranslations, useTranslationLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  CHALLENGE_PHASES,
  buildChallengeDayPlan,
  getFallbackChallengeFeedback,
  getFallbackChallengePrompt,
  type Challenge90State,
  type ChallengeDailyMinutes,
  type ChallengeFeedback,
  type ChallengeGoal,
  type ChallengeLevel,
  type ChallengePrompt,
} from "@/lib/practice/challenge-90";

interface PersonalizedPracticeCardProps {
  locale: "en" | "bn";
  challengeState: Challenge90State;
  onChallengeChange: (next: Challenge90State) => void;
  onPracticeMinutesEarned: (minutes: number) => void;
}

const GOAL_OPTIONS: { id: ChallengeGoal; labelEn: string; labelBn: string }[] = [
  { id: "everyday", labelEn: "Everyday Fluency", labelBn: "দৈনন্দিন কথা বলা" },
  { id: "workplace", labelEn: "Workplace & Career", labelBn: "অফিস ও ক্যারিয়ার" },
  { id: "travel", labelEn: "Travel & Social", labelBn: "ভ্রমণ ও সামাজিক" },
  { id: "confidence", labelEn: "Confidence & Flow", labelBn: "জড়তা কাটানো" },
];

const LEVEL_OPTIONS: { id: ChallengeLevel; labelEn: string; labelBn: string }[] = [
  { id: "beginner", labelEn: "Beginner", labelBn: "শুরু (Beginner)" },
  { id: "intermediate", labelEn: "Intermediate", labelBn: "মাঝারি (Intermediate)" },
  { id: "upper", labelEn: "Upper", labelBn: "উন্নত (Upper)" },
];

const MINUTE_OPTIONS: ChallengeDailyMinutes[] = [15, 20, 30];

export function PersonalizedPracticeCard({
  locale,
  challengeState,
  onChallengeChange,
  onPracticeMinutesEarned,
}: PersonalizedPracticeCardProps) {
  const isBn = locale === "bn";
  const translationLocale = useTranslationLocale();
  const showTranslation = translationLocale !== "none";

  // Onboarding setup state (used when !challengeState.enrolled)
  const [setupGoal, setSetupGoal] = useState<ChallengeGoal>(challengeState.goal);
  const [setupLevel, setSetupLevel] = useState<ChallengeLevel>(challengeState.level);
  const [setupMinutes, setSetupMinutes] = useState<ChallengeDailyMinutes>(
    challengeState.dailyMinutes
  );

  // Active Day Speaking Prompt & 5-Step Feedback State
  const [promptData, setPromptData] = useState<ChallengePrompt>(() =>
    getFallbackChallengePrompt(challengeState.currentDay)
  );
  const [promptLoading, setPromptLoading] = useState(false);
  const [learnerResponse, setLearnerResponse] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<ChallengeFeedback | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [micNote, setMicNote] = useState<string | null>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const dayPlan = buildChallengeDayPlan(challengeState);
  const activeDayBlocksCompleted =
    challengeState.todayDayNumber === challengeState.currentDay
      ? challengeState.todayCompletedBlockIds
      : [];

  const textsToTranslate = React.useMemo(() => {
    if (!showTranslation) return [];
    const list = [
      promptData.promptEn,
      promptData.starterPhrase,
      ...dayPlan.blocks.map((b) => b.descEn),
    ];
    if (feedback) {
      list.push(
        feedback.communicated,
        feedback.betterVersion,
        feedback.keyCorrection,
        feedback.speakAgainPrompt
      );
    }
    return list;
  }, [showTranslation, promptData.promptEn, promptData.starterPhrase, dayPlan.blocks, feedback]);

  const { translations: liveMap } = useLiveTranslations(
    textsToTranslate,
    showTranslation ? translationLocale : "none"
  );

  const handleEnroll = () => {
    const next: Challenge90State = {
      ...challengeState,
      enrolled: true,
      currentDay: 1,
      goal: setupGoal,
      level: setupLevel,
      dailyMinutes: setupMinutes,
      todayDayNumber: 1,
      todayCompletedBlockIds: [],
    };
    onChallengeChange(next);
    setPromptData(getFallbackChallengePrompt(1));
    setFeedback(null);
    setLearnerResponse("");
  };

  const handleToggleBlock = (blockId: string) => {
    const baseIds =
      challengeState.todayDayNumber === challengeState.currentDay
        ? challengeState.todayCompletedBlockIds
        : [];
    const exists = baseIds.includes(blockId);
    const updatedIds = exists
      ? baseIds.filter((id) => id !== blockId)
      : [...baseIds, blockId];
    onChallengeChange({
      ...challengeState,
      todayDayNumber: challengeState.currentDay,
      todayCompletedBlockIds: updatedIds,
    });
  };

  const handleGeneratePrompt = async () => {
    setPromptLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/v1/ai/challenge-90", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-prompt",
          day: challengeState.currentDay,
          goal: challengeState.goal,
          level: challengeState.level,
          locale,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data: ChallengePrompt = await res.json();
      setPromptData(data);
    } catch {
      setPromptData(getFallbackChallengePrompt(challengeState.currentDay));
    } finally {
      setPromptLoading(false);
    }
  };

  const handleEvaluateResponse = async () => {
    if (learnerResponse.trim().length < 2) return;
    setEvaluating(true);
    try {
      const res = await fetch("/api/v1/ai/challenge-90", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate-response",
          day: challengeState.currentDay,
          promptEn: promptData.promptEn,
          learnerResponse: learnerResponse.trim(),
          level: challengeState.level,
          locale,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data: ChallengeFeedback = await res.json();
      setFeedback(data);
    } catch {
      setFeedback(getFallbackChallengeFeedback(learnerResponse, locale));
    } finally {
      setEvaluating(false);
      // Mark core-speaking block completed automatically
      if (!activeDayBlocksCompleted.includes("core-speaking")) {
        handleToggleBlock("core-speaking");
      }
      onPracticeMinutesEarned(5);
    }
  };

  const handleToggleMic = () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const win = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        continuous: boolean;
        onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
        start: () => void;
        stop: () => void;
      };
      webkitSpeechRecognition?: new () => {
        lang: string;
        interimResults: boolean;
        continuous: boolean;
        onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
        onerror: (() => void) | null;
        onend: (() => void) | null;
        start: () => void;
        stop: () => void;
      };
    };

    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicNote(
        isBn
          ? "এই ব্রাউজারে ভয়েস রেকর্ডিং সাপোর্ট নেই—নিচে টাইপ করে উত্তর দিন।"
          : "Voice recognition is unavailable in this browser—type your spoken answer below."
      );
      return;
    }

    setMicNote(null);
    const recognition = new SpeechRec();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0]?.transcript ?? "";
        transcript += " ";
      }
      setLearnerResponse(transcript.trim());
    };
    recognition.onerror = () => {
      setIsRecording(false);
    };
    recognition.onend = () => {
      setIsRecording(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const handleCompleteDay = () => {
    const day = challengeState.currentDay;
    const completedDays = challengeState.completedDays.includes(day)
      ? challengeState.completedDays
      : [...challengeState.completedDays, day];
    const nextDay = Math.min(90, day + 1);
    const entry = {
      day,
      topic: promptData.topic,
      rating: feedback?.rating ?? ("Getting better" as const),
      completedAt: new Date().toISOString(),
    };
    onChallengeChange({
      ...challengeState,
      completedDays,
      currentDay: nextDay,
      todayDayNumber: nextDay,
      todayCompletedBlockIds: [],
      history: [entry, ...challengeState.history].slice(0, 30),
    });
    setPromptData(getFallbackChallengePrompt(nextDay));
    setFeedback(null);
    setLearnerResponse("");
    onPracticeMinutesEarned(5);
  };

  // ==================== STATE A: NOT ENROLLED ====================
  if (!challengeState.enrolled) {
    return (
      <Card
        id="challenge-90"
        className="p-5 sm:p-6 bg-card border border-border space-y-5 shadow-xs"
      >
        <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-control bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={SparklesIcon} size={18} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-card-title text-foreground">
                  {isBn
                    ? "৯০-দিনের পার্সোনালাইজড স্পোকেন ইংলিশ চ্যালেঞ্জ"
                    : "90-Day Personalized Spoken English Challenge"}
                </h2>
                <Badge variant="brand" size="sm">
                  Speaking-First
                </Badge>
              </div>
              <p className="text-meta text-muted-foreground">
                {isBn
                  ? "প্রতিদিন ২০–৩০ মিনিট বাস্তব ইংরেজি বলার অভ্যাস গড়ুন—আপনার পারফরম্যান্স অনুযায়ী প্ল্যান বদলাবে।"
                  : "Build a daily spoken-English habit in 20–30 min/day with an adaptive AI speaking plan."}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Phases Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CHALLENGE_PHASES.map((p) => (
            <div
              key={p.phase}
              className="rounded-panel bg-muted/35 border border-border/60 p-3.5 space-y-1.5"
            >
              <Badge variant="outline" size="sm">
                {p.dayRange}
              </Badge>
              <h3 className="text-label font-semibold text-foreground">
                {isBn ? p.titleBn : p.titleEn}
              </h3>
              <p className={cn("text-chip text-muted-foreground", isBn && "text-bangla")}>
                {isBn ? p.goalBn : p.goalEn}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Personalization Setup */}
        <div className="rounded-panel bg-muted/25 border border-border/60 p-4 space-y-4">
          <div className="space-y-1.5">
            <p className="text-chip font-semibold text-foreground">
              {isBn ? "১. আপনার মূল লক্ষ্য বেছে নিন:" : "1. Choose your spoken-English goal:"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {GOAL_OPTIONS.map((g) => (
                <Button
                  key={g.id}
                  type="button"
                  size="xs"
                  variant={setupGoal === g.id ? "default" : "outline"}
                  onClick={() => setSetupGoal(g.id)}
                >
                  {isBn ? g.labelBn : g.labelEn}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-chip font-semibold text-foreground">
                {isBn ? "২. বর্তমান স্পিকিং লেভেল:" : "2. Current speaking level:"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {LEVEL_OPTIONS.map((l) => (
                  <Button
                    key={l.id}
                    type="button"
                    size="xs"
                    variant={setupLevel === l.id ? "default" : "outline"}
                    onClick={() => setSetupLevel(l.id)}
                  >
                    {isBn ? l.labelBn : l.labelEn}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-chip font-semibold text-foreground">
                {isBn ? "৩. দৈনিক সময়:" : "3. Daily commitment:"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MINUTE_OPTIONS.map((m) => (
                  <Button
                    key={m}
                    type="button"
                    size="xs"
                    variant={setupMinutes === m ? "default" : "outline"}
                    onClick={() => setSetupMinutes(m)}
                  >
                    {m} min/day
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
            <p className="text-chip text-muted-foreground">
              {isBn
                ? "কোনো পরীক্ষা বা মুখস্থ পড়া নয়—শুধু বাস্তব কথোপকথন ও স্পিকিং প্র্যাকটিস।"
                : "No academic exams or long essays—focused 100% on practical spoken English."}
            </p>
            <Button
              type="button"
              variant="cta"
              size="md"
              onClick={handleEnroll}
              className="gap-2 shrink-0"
            >
              <HugeiconsIcon icon={SparklesIcon} size={16} />
              <span>{isBn ? "৯০-দিনের চ্যালেঞ্জ শুরু করুন" : "Start 90-Day Challenge"}</span>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // ==================== STATE B: ENROLLED ====================
  const completionPct = Math.round((challengeState.completedDays.length / 90) * 100);

  return (
    <Card
      id="challenge-90"
      className="p-5 sm:p-6 bg-card border border-border space-y-5 shadow-xs"
    >
      {/* Top Challenge Header */}
      <div className="space-y-3 pb-3 border-b border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" size="sm" className="font-mono">
                Day {challengeState.currentDay} of 90
              </Badge>
              <Badge variant="info" size="sm">
                {isBn ? dayPlan.phase.titleBn : dayPlan.phase.titleEn}
              </Badge>
              <Badge variant="outline" size="sm">
                {challengeState.dailyMinutes} min/day
              </Badge>
            </div>
            <h2 className="font-heading text-card-title text-foreground">
              {isBn
                ? "৯০-দিনের স্পোকেন ইংলিশ চ্যালেঞ্জ"
                : "90-Day Spoken English Challenge"}
            </h2>
            <p className={cn("text-meta text-muted-foreground", isBn && "text-bangla")}>
              {isBn ? dayPlan.dailyObjectiveBn : dayPlan.dailyObjectiveEn}
            </p>
          </div>

          <Button
            type="button"
            variant="cta"
            size="sm"
            onClick={handleCompleteDay}
            className="gap-1.5 shrink-0"
          >
            <HugeiconsIcon icon={Award01Icon} size={15} />
            <span>
              {isBn
                ? `দিন ${challengeState.currentDay} সম্পন্ন করুন`
                : `Complete Day ${challengeState.currentDay}`}
            </span>
          </Button>
        </div>

        {/* 90-Day Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-chip text-muted-foreground">
            <span>
              {challengeState.completedDays.length} / 90{" "}
              {isBn ? "দিন সম্পন্ন" : "days completed"}
            </span>
            <span className="font-mono">{completionPct}%</span>
          </div>
          <div className="h-2 w-full rounded-pill bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.max(2, completionPct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Inline AI Speaking Prompt & 5-Step Feedback */}
      <div className="rounded-panel bg-muted/30 border border-border/60 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" size="sm">
              {isBn ? "আজকের স্পিকিং প্রম্পট" : "Today's Speaking Prompt"}
            </Badge>
            <span className="text-chip font-semibold text-foreground">{promptData.topic}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => speakText(promptData.promptEn, { rate: 0.92 })}
              className="gap-1"
            >
              <HugeiconsIcon icon={VolumeHighIcon} size={14} />
              <span>{isBn ? "শুনুন" : "Listen"}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              disabled={promptLoading}
              onClick={handleGeneratePrompt}
              className="gap-1"
            >
              <HugeiconsIcon
                icon={promptLoading ? RefreshIcon : SparklesIcon}
                size={13}
                className={cn(promptLoading && "animate-spin")}
              />
              <span>{isBn ? "নতুন প্রম্পট" : "New Prompt"}</span>
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-lead font-semibold text-foreground">{promptData.promptEn}</p>
          {showTranslation && (
            <p className={cn("text-meta text-muted-foreground", translationLocale === "bn" && "text-bangla")}>
              {translationLocale === "bn"
                ? promptData.instructionBn
                : liveMap[promptData.promptEn] ?? (isBn ? promptData.instructionBn : null)}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-chip">
          <span className="text-muted-foreground">
            {isBn ? "শুরু করতে পারেন:" : "Starter:"}
          </span>
          <span className="px-2.5 py-1 rounded-control bg-card border border-border text-foreground italic">
            &ldquo;{promptData.starterPhrase}&rdquo;
          </span>
          {showTranslation && liveMap[promptData.starterPhrase] && (
            <span className="text-muted-foreground">
              ({liveMap[promptData.starterPhrase]})
            </span>
          )}
          {promptData.targetVocab.map((v) => (
            <Badge key={v} variant="brand" size="sm">
              {v}
            </Badge>
          ))}
        </div>

        {/* Voice Mic + Spoken Transcript Input */}
        <div className="space-y-2">
          <textarea
            value={learnerResponse}
            onChange={(e) => setLearnerResponse(e.target.value)}
            rows={3}
            placeholder={
              isBn
                ? "মাইক্রোফোন অন করে ইংরেজিতে বলুন, অথবা এখানে লিখুন..."
                : "Tap Speak to record your voice, or type your spoken response here..."
            }
            className="w-full rounded-control border border-input bg-card px-3.5 py-2.5 text-body text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring"
          />
          {micNote && <p className="text-chip text-muted-foreground">{micNote}</p>}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              type="button"
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={handleToggleMic}
              className="gap-1.5"
            >
              <HugeiconsIcon icon={isRecording ? StopIcon : Mic01Icon} size={15} />
              <span>
                {isRecording
                  ? isBn
                    ? "রেকর্ডিং থামান"
                    : "Stop Recording"
                  : isBn
                    ? "ভয়েসে বলুন (Mic)"
                    : "Speak (Mic)"}
              </span>
            </Button>

            <Button
              type="button"
              variant="cta"
              size="sm"
              disabled={evaluating || learnerResponse.trim().length < 2}
              onClick={handleEvaluateResponse}
              className="gap-1.5"
            >
              <HugeiconsIcon
                icon={evaluating ? RefreshIcon : SparklesIcon}
                size={15}
                className={cn(evaluating && "animate-spin")}
              />
              <span>
                {evaluating
                  ? isBn
                    ? "বিশ্লেষণ চলছে..."
                    : "Checking..."
                  : isBn
                    ? "৫-ধাপের স্পিকিং ফিডব্যাক নিন"
                    : "Get 5-Step Speaking Feedback"}
              </span>
            </Button>
          </div>
        </div>

        {/* 5-Step Speaking Feedback */}
        {feedback && (
          <div className="rounded-panel bg-card border border-border p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-label font-semibold text-foreground">
                {isBn ? "AI স্পিকিং ফিডব্যাক" : "AI Speaking Feedback"}
              </span>
              <Badge
                variant={
                  feedback.rating === "Strong"
                    ? "success"
                    : feedback.rating === "Getting better"
                      ? "warning"
                      : "error"
                }
                size="sm"
              >
                {feedback.rating}
              </Badge>
            </div>

            <div className="space-y-2 text-meta">
              <p className={cn("text-foreground", isBn && "text-bangla")}>
                <span className="font-semibold">1. What you communicated: </span>
                {showTranslation && liveMap[feedback.communicated]
                  ? liveMap[feedback.communicated]
                  : feedback.communicated}
              </p>

              <div className="rounded-control bg-status-success-bg/50 p-3 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-chip font-semibold text-status-success-ink">
                    2. Natural Version
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => speakText(feedback.betterVersion, { rate: 0.9 })}
                    className="gap-1"
                  >
                    <HugeiconsIcon icon={VolumeHighIcon} size={13} />
                    <span>{isBn ? "শুনুন" : "Listen"}</span>
                  </Button>
                </div>
                <p className="text-body text-foreground font-semibold">
                  &ldquo;{feedback.betterVersion}&rdquo;
                </p>
                {showTranslation && liveMap[feedback.betterVersion] && (
                  <p className="text-chip text-muted-foreground">
                    {liveMap[feedback.betterVersion]}
                  </p>
                )}
              </div>

              <p className={cn("text-muted-foreground", isBn && "text-bangla")}>
                <span className="font-semibold text-foreground">3. Key correction: </span>
                {showTranslation && liveMap[feedback.keyCorrection]
                  ? liveMap[feedback.keyCorrection]
                  : feedback.keyCorrection}
              </p>

              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">4. Useful expression: </span>
                <Badge variant="brand" size="sm">
                  {feedback.usefulExpression}
                </Badge>
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
                <p className="text-chip text-primary font-semibold">
                  5. Speak again:{" "}
                  {showTranslation && liveMap[feedback.speakAgainPrompt]
                    ? liveMap[feedback.speakAgainPrompt]
                    : feedback.speakAgainPrompt}
                </p>
                <Button
                  type="button"
                  size="xs"
                  variant="outline"
                  onClick={() => {
                    setFeedback(null);
                    setLearnerResponse("");
                  }}
                >
                  {isBn ? "আবার চেষ্টা করুন" : "Try Again"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Today's Adaptive Speaking-First Plan (Reusing Existing Modules) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-label font-semibold text-foreground">
            {isBn ? "আজকের স্পিকিং-ফার্স্ট প্ল্যান" : "Today's Speaking-First Plan"}
          </h3>
          <span className="text-chip text-muted-foreground">
            {activeDayBlocksCompleted.length}/{dayPlan.blocks.length}{" "}
            {isBn ? "সম্পন্ন" : "done"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {dayPlan.blocks.map((block) => {
            const done = activeDayBlocksCompleted.includes(block.id);
            return (
              <div
                key={block.id}
                className={cn(
                  "rounded-panel border p-3.5 flex items-start justify-between gap-3 transition-colors",
                  done ? "bg-status-success-bg/35 border-status-success-ink/30" : "bg-card border-border"
                )}
              >
                <button
                  type="button"
                  onClick={() => handleToggleBlock(block.id)}
                  className="flex items-start gap-2.5 text-left min-w-0 flex-1 cursor-pointer"
                >
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={18}
                    className={cn(
                      "mt-0.5 shrink-0",
                      done ? "text-status-success-ink" : "text-muted-foreground"
                    )}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-meta font-semibold text-foreground">
                        {isBn ? block.titleBn : block.titleEn}
                      </span>
                      {block.required && (
                        <Badge variant="outline" size="sm">
                          {isBn ? "মূল" : "Core"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-chip text-muted-foreground mt-0.5">
                      {showTranslation && translationLocale !== "bn" && liveMap[block.descEn]
                        ? liveMap[block.descEn]
                        : isBn
                          ? block.descBn
                          : block.descEn}{" "}
                      · ~{block.durationMin} min
                    </p>
                  </div>
                </button>

                {block.href !== "#challenge-90" && (
                  <Link
                    href={block.href}
                    className="inline-flex items-center gap-1 text-chip font-semibold text-primary hover:underline shrink-0 pt-0.5"
                  >
                    <span>{block.moduleLabel}</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
