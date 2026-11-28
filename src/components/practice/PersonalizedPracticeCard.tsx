"use client";

import React, { useMemo, useRef, useState } from "react";
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
  AiLockIcon,
} from "@hugeicons/core-free-icons";
import { useSessionAccess } from "@/components/auth/SessionIsolationProvider";
import { GuestLockedCard } from "@/components/auth/GuestLimitBanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { speakText } from "@/lib/audio/speech-engine";
import { useLiveTranslations, useTranslationLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  CHALLENGE_PHASES,
  buildChallengeDayPlan,
  getChallengeDayLesson,
  getFallbackChallengeFeedback,
  getFallbackChallengePrompt,
  type Challenge90State,
  type ChallengeDailyMinutes,
  type ChallengeFeedback,
  type ChallengeGoal,
  type ChallengeLevel,
  type ChallengePrompt,
  type ChallengeRoleplayReply,
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

const STEP_LABELS = [
  { num: 1, id: "vocab-context", en: "Vocabulary", bn: "১. শব্দ ব্যবহার" },
  { num: 2, id: "speaking-grammar", en: "Grammar", bn: "২. স্পোকেন গ্রামার" },
  { num: 3, id: "quick-response", en: "Quick Drill", bn: "৩. তাৎক্ষণিক উত্তর" },
  { num: 4, id: "core-speaking", en: "Speak & Coach", bn: "৪. মূল স্পিকিং" },
  { num: 5, id: "ai-roleplay", en: "Roleplay", bn: "৫. মিনি রোলপ্লে" },
] as const;

export function PersonalizedPracticeCard({
  locale,
  challengeState,
  onChallengeChange,
  onPracticeMinutesEarned,
}: PersonalizedPracticeCardProps) {
  const isBn = locale === "bn";
  const { isGuest } = useSessionAccess();
  const translationLocale = useTranslationLocale();
  const showTranslation = translationLocale !== "none";

  // Onboarding setup
  const [setupGoal, setSetupGoal] = useState<ChallengeGoal>(challengeState.goal);
  const [setupLevel, setSetupLevel] = useState<ChallengeLevel>(challengeState.level);
  const [setupMinutes, setSetupMinutes] = useState<ChallengeDailyMinutes>(
    challengeState.dailyMinutes
  );

  // Active Stepper (0..4) — shows ONE clean step at a time inside this card
  const [activeStep, setActiveStep] = useState(0);

  // Step 1–3 inline practice inputs
  const [vocabSentence, setVocabSentence] = useState("");
  const [grammarSentence, setGrammarSentence] = useState("");
  const [drillAnswers, setDrillAnswers] = useState<Record<number, string>>({});

  // Step 4: Core Speaking Prompt & 5-Step AI Feedback
  const [promptData, setPromptData] = useState<ChallengePrompt>(() =>
    getFallbackChallengePrompt(challengeState.currentDay)
  );
  const [promptLoading, setPromptLoading] = useState(false);
  const [learnerResponse, setLearnerResponse] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<ChallengeFeedback | null>(null);

  // Step 5: Mini AI Roleplay
  const dayLesson = useMemo(
    () => getChallengeDayLesson(challengeState.currentDay),
    [challengeState.currentDay]
  );
  const [roleplayHistory, setRoleplayHistory] = useState<
    { speaker: "ai" | "user"; text: string }[]
  >(() => [{ speaker: "ai", text: dayLesson.roleplay.openingLine }]);
  const [roleplayInput, setRoleplayInput] = useState("");
  const [roleplayLoading, setRoleplayLoading] = useState(false);
  const [roleplayTip, setRoleplayTip] = useState<string | null>(null);

  // Voice Mic (shared for Step 4 & Step 5)
  const [isRecording, setIsRecording] = useState(false);
  const [micNote, setMicNote] = useState<string | null>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const dayPlan = buildChallengeDayPlan(challengeState);
  const activeDayBlocksCompleted =
    challengeState.todayDayNumber === challengeState.currentDay
      ? challengeState.todayCompletedBlockIds
      : [];

  // Live translation strings across all 5 steps when Translate Language != "none"
  const textsToTranslate = useMemo(() => {
    if (!showTranslation) return [];
    const list = [
      dayPlan.dailyObjectiveEn,
      ...dayLesson.vocabItems.flatMap((v) => [v.meaningEn, v.exampleEn]),
      dayLesson.grammarPattern.explanationEn,
      ...dayLesson.grammarPattern.examples,
      ...dayLesson.quickDrills.flatMap((d) => [d.situationEn, d.sampleAnswer]),
      promptData.promptEn,
      promptData.starterPhrase,
      ...roleplayHistory.map((m) => m.text),
    ];
    if (feedback) {
      list.push(
        feedback.communicated,
        feedback.betterVersion,
        feedback.keyCorrection,
        feedback.speakAgainPrompt
      );
    }
    if (roleplayTip) list.push(roleplayTip);
    return list;
  }, [
    showTranslation,
    dayPlan.dailyObjectiveEn,
    dayLesson,
    promptData.promptEn,
    promptData.starterPhrase,
    roleplayHistory,
    feedback,
    roleplayTip,
  ]);

  const { translations: liveMap } = useLiveTranslations(
    textsToTranslate,
    showTranslation ? translationLocale : "none"
  );

  const markStepDone = (stepIdx: number) => {
    const stepId = STEP_LABELS[stepIdx]?.id;
    if (!stepId) return;
    const baseIds =
      challengeState.todayDayNumber === challengeState.currentDay
        ? challengeState.todayCompletedBlockIds
        : [];
    if (!baseIds.includes(stepId)) {
      onChallengeChange({
        ...challengeState,
        todayDayNumber: challengeState.currentDay,
        todayCompletedBlockIds: [...baseIds, stepId],
      });
    }
  };

  const goToNextStep = () => {
    markStepDone(activeStep);
    onPracticeMinutesEarned(3);
    if (activeStep < STEP_LABELS.length - 1) {
      setActiveStep((s) => s + 1);
    }
  };

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
    setActiveStep(0);
    setPromptData(getFallbackChallengePrompt(1));
    setFeedback(null);
    setLearnerResponse("");
    const firstLesson = getChallengeDayLesson(1);
    setRoleplayHistory([{ speaker: "ai", text: firstLesson.roleplay.openingLine }]);
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
      markStepDone(3);
      onPracticeMinutesEarned(5);
    }
  };

  const handleSendRoleplayTurn = async () => {
    const msg = roleplayInput.trim();
    if (!msg) return;
    const nextHistory = [...roleplayHistory, { speaker: "user" as const, text: msg }];
    setRoleplayHistory(nextHistory);
    setRoleplayInput("");
    setRoleplayLoading(true);
    try {
      const res = await fetch("/api/v1/ai/challenge-90", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "roleplay-turn",
          day: challengeState.currentDay,
          scenarioTitle: dayLesson.roleplay.titleEn,
          history: nextHistory,
          userMessage: msg,
          level: challengeState.level,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data: ChallengeRoleplayReply = await res.json();
      setRoleplayHistory([...nextHistory, { speaker: "ai", text: data.aiReply }]);
      setRoleplayTip(data.quickTipEn);
      speakText(data.aiReply, { rate: 0.94 });
    } catch {
      const fallbackReply = "That makes sense! What would you say next in this situation?";
      setRoleplayHistory([...nextHistory, { speaker: "ai", text: fallbackReply }]);
    } finally {
      setRoleplayLoading(false);
      markStepDone(4);
      onPracticeMinutesEarned(4);
    }
  };

  const startVoiceMic = (onTranscript: (text: string) => void) => {
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
          : "Voice recognition is unavailable here—please type your spoken response."
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
      onTranscript(transcript.trim());
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
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
    setActiveStep(0);
    setVocabSentence("");
    setGrammarSentence("");
    setDrillAnswers({});
    setPromptData(getFallbackChallengePrompt(nextDay));
    setFeedback(null);
    setLearnerResponse("");
    const nextLesson = getChallengeDayLesson(nextDay);
    setRoleplayHistory([{ speaker: "ai", text: nextLesson.roleplay.openingLine }]);
    setRoleplayTip(null);
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
                  ? "প্রতিদিন ১৫–৩০ মিনিট স্টেপ-বাই-স্টেপ এই কার্ডের ভেতরেই স্পিকিং প্র্যাকটিস করুন।"
                  : "Practice step-by-step for 15–30 min/day right inside this card—no page switching."}
              </p>
            </div>
          </div>
        </div>

        {/* Compact 3-Phase Roadmap Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {CHALLENGE_PHASES.map((p) => (
            <div
              key={p.phase}
              className="rounded-panel bg-muted/35 border border-border/60 px-3.5 py-2.5 flex items-center justify-between gap-2"
            >
              <span className="text-label text-foreground truncate">
                {isBn ? p.titleBn : p.titleEn}
              </span>
              <Badge variant="outline" size="sm" className="shrink-0">
                {p.dayRange}
              </Badge>
            </div>
          ))}
        </div>

        {/* Clean 3-Dropdown Setup Row + Start CTA */}
        <div className="rounded-panel bg-muted/25 border border-border/60 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Speaking Goal Dropdown */}
            <div className="space-y-1.5">
              <label className="text-chip text-foreground block">
                {isBn ? "১. আপনার মূল লক্ষ্য" : "1. Speaking Goal"}
              </label>
              <Select
                value={setupGoal}
                onValueChange={(val) => setSetupGoal((val ?? "everyday") as ChallengeGoal)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(() => {
                      const g = GOAL_OPTIONS.find((o) => o.id === setupGoal);
                      return g ? (isBn ? g.labelBn : g.labelEn) : "Everyday Fluency";
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {GOAL_OPTIONS.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {isBn ? g.labelBn : g.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Speaking Level Dropdown */}
            <div className="space-y-1.5">
              <label className="text-chip text-foreground block">
                {isBn ? "২. বর্তমান লেভেল" : "2. Speaking Level"}
              </label>
              <Select
                value={setupLevel}
                onValueChange={(val) => setSetupLevel((val ?? "beginner") as ChallengeLevel)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {(() => {
                      const l = LEVEL_OPTIONS.find((o) => o.id === setupLevel);
                      return l ? (isBn ? l.labelBn : l.labelEn) : "Beginner";
                    })()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {LEVEL_OPTIONS.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {isBn ? l.labelBn : l.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3. Daily Time Dropdown */}
            <div className="space-y-1.5">
              <label className="text-chip text-foreground block">
                {isBn ? "৩. দৈনিক সময়" : "3. Daily Time"}
              </label>
              <Select
                value={String(setupMinutes)}
                onValueChange={(val) =>
                  setSetupMinutes(Number(val ?? 20) as ChallengeDailyMinutes)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue>{setupMinutes} min/day</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {MINUTE_OPTIONS.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      {m} min/day
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60">
            <p className="text-chip text-muted-foreground">
              {isBn
                ? "৫টি স্টেপ (Vocabulary → Grammar → Drill → Speaking → Roleplay) এই কার্ডেই হবে।"
                : "All 5 daily steps run right inside this card—no page switching."}
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

  // ==================== STATE B: ENROLLED (CLEAN 5-STEP STEPPER) ====================
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
              {isBn ? "আজকের ১৫–৩০ মিনিটের স্পোকেন প্ল্যান" : "Today's Guided Spoken Plan"}
            </h2>
            <p className={cn("text-meta text-muted-foreground", translationLocale === "bn" && "text-bangla")}>
              {translationLocale === "bn"
                ? dayPlan.dailyObjectiveBn
                : showTranslation && liveMap[dayPlan.dailyObjectiveEn]
                  ? liveMap[dayPlan.dailyObjectiveEn]
                  : dayPlan.dailyObjectiveEn}
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
                ? `দিন ${challengeState.currentDay} সম্পন্ন`
                : `Complete Day ${challengeState.currentDay}`}
            </span>
          </Button>
        </div>

        {/* 90-Day Overall Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-chip text-muted-foreground">
            <span>
              {challengeState.completedDays.length} / 90 {isBn ? "দিন সম্পন্ন" : "days completed"}
            </span>
            <span className="font-mono">{completionPct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-pill bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.max(2, completionPct)}%` }}
            />
          </div>
        </div>

        {/* Clean 5-Step Stepper Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {STEP_LABELS.map((step, idx) => {
            const isActive = activeStep === idx;
            const isDone = activeDayBlocksCompleted.includes(step.id);
            const isStepLocked = isGuest && idx > 0;
            return (
              <Button
                key={step.id}
                type="button"
                size="xs"
                variant={isActive ? "default" : isDone ? "secondary" : "outline"}
                onClick={() => setActiveStep(idx)}
                className="gap-1.5"
              >
                {isStepLocked ? (
                  <HugeiconsIcon icon={AiLockIcon} size={13} />
                ) : isDone ? (
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} />
                ) : null}
                <span>{isBn ? step.bn : `${step.num}. ${step.en}`}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* ================= ACTIVE STEP CONTENT (ONLY 1 STEP VISIBLE) ================= */}
      {isGuest && activeStep > 0 && (
        <GuestLockedCard
          titleEn={`Step ${activeStep + 1} is Locked in Guest Mode`}
          titleBn={`ধাপ ${activeStep + 1} গেস্ট মোডে লক করা আছে`}
          nextPath="/daily-practice"
        />
      )}

      {/* STEP 1: VOCABULARY IN CONTEXT */}
      {activeStep === 0 && (
        <div className="rounded-panel bg-muted/30 border border-border/60 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <Badge variant="brand" size="sm">Step 1 of 5 · ~3 min</Badge>
              <h3 className="text-label text-foreground mt-1">
                {isBn ? "বাক্যে শব্দের ব্যবহার (Vocabulary in Context)" : "Vocabulary in Context"}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {dayLesson.vocabItems.map((item) => (
              <div
                key={item.phrase}
                className="rounded-card bg-card border border-border p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-label text-primary">{item.phrase}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => speakText(item.exampleEn, { rate: 0.92 })}
                  >
                    <HugeiconsIcon icon={VolumeHighIcon} size={14} />
                  </Button>
                </div>
                <p className="text-chip text-muted-foreground">
                  {showTranslation && liveMap[item.meaningEn]
                    ? liveMap[item.meaningEn]
                    : item.meaningEn}
                </p>
                <p className="text-meta text-foreground italic">&ldquo;{item.exampleEn}&rdquo;</p>
                {showTranslation && liveMap[item.exampleEn] && (
                  <p className="text-chip text-muted-foreground">{liveMap[item.exampleEn]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-chip text-foreground">
              {isBn
                ? "উপরের যেকোনো ১টি ফ্রেজ দিয়ে নিজের একটি বাক্য বলুন বা লিখুন:"
                : "Say or type 1 sentence using any phrase above:"}
            </p>
            <Input
              type="text"
              value={vocabSentence}
              onChange={(e) => setVocabSentence(e.target.value)}
              placeholder="e.g. I usually wake up early to get ready for work..."
            />
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="cta" size="sm" onClick={goToNextStep} className="gap-1.5">
              <span>{isBn ? "সম্পন্ন ও পরের ধাপ" : "Next: Spoken Grammar"}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: SPEAKING-FOCUSED GRAMMAR */}
      {!isGuest && activeStep === 1 && (
        <div className="rounded-panel bg-muted/30 border border-border/60 p-4 sm:p-5 space-y-4">
          <div>
            <Badge variant="info" size="sm">Step 2 of 5 · ~3 min</Badge>
            <h3 className="text-label text-foreground mt-1">
              {dayLesson.grammarPattern.titleEn}
            </h3>
            <p className="text-meta font-mono text-primary mt-1">
              {dayLesson.grammarPattern.formula}
            </p>
            <p className="text-meta text-muted-foreground mt-1">
              {showTranslation && liveMap[dayLesson.grammarPattern.explanationEn]
                ? liveMap[dayLesson.grammarPattern.explanationEn]
                : dayLesson.grammarPattern.explanationEn}
            </p>
          </div>

          <div className="space-y-2">
            {dayLesson.grammarPattern.examples.map((ex, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 rounded-control bg-card border border-border p-3"
              >
                <div>
                  <p className="text-body text-foreground">&ldquo;{ex}&rdquo;</p>
                  {showTranslation && liveMap[ex] && (
                    <p className="text-chip text-muted-foreground">{liveMap[ex]}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => speakText(ex, { rate: 0.92 })}
                >
                  <HugeiconsIcon icon={VolumeHighIcon} size={14} />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-chip text-foreground">
              {isBn
                ? "এই স্ট্রাকচার দিয়ে নিজে ১টি বাক্য তৈরি করে বলুন বা লিখুন:"
                : "Practice saying or typing your own sentence with this pattern:"}
            </p>
            <Input
              type="text"
              value={grammarSentence}
              onChange={(e) => setGrammarSentence(e.target.value)}
              placeholder="Write or speak your sentence here..."
            />
          </div>

          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" size="sm" onClick={() => setActiveStep(0)}>
              {isBn ? "আগের ধাপ" : "Back"}
            </Button>
            <Button type="button" variant="cta" size="sm" onClick={goToNextStep} className="gap-1.5">
              <span>{isBn ? "সম্পন্ন ও পরের ধাপ" : "Next: Quick Response Drill"}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: QUICK RESPONSE DRILL */}
      {!isGuest && activeStep === 2 && (
        <div className="rounded-panel bg-muted/30 border border-border/60 p-4 sm:p-5 space-y-4">
          <div>
            <Badge variant="warning" size="sm">Step 3 of 5 · ~4 min</Badge>
            <h3 className="text-label text-foreground mt-1">
              {isBn ? "তাৎক্ষণিক উত্তর অনুশীলন (Quick Response)" : "Quick Response Drill"}
            </h3>
          </div>

          <div className="space-y-3">
            {dayLesson.quickDrills.map((drill, idx) => (
              <div key={idx} className="rounded-card bg-card border border-border p-4 space-y-2.5">
                <p className="text-body text-foreground">{drill.situationEn}</p>
                {showTranslation && liveMap[drill.situationEn] && (
                  <p className="text-chip text-muted-foreground">{liveMap[drill.situationEn]}</p>
                )}
                <Input
                  type="text"
                  inputSize="sm"
                  value={drillAnswers[idx] ?? ""}
                  onChange={(e) =>
                    setDrillAnswers((prev) => ({ ...prev, [idx]: e.target.value }))
                  }
                  placeholder={isBn ? "আপনার উত্তর লিখুন বা মুখে বলুন..." : "Type or say your quick reply..."}
                />
                <div className="flex items-center justify-between gap-2 text-chip text-muted-foreground">
                  <span>
                    Sample: <span className="text-primary italic">&ldquo;{drill.sampleAnswer}&rdquo;</span>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => speakText(drill.sampleAnswer, { rate: 0.92 })}
                  >
                    <HugeiconsIcon icon={VolumeHighIcon} size={13} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" size="sm" onClick={() => setActiveStep(1)}>
              {isBn ? "আগের ধাপ" : "Back"}
            </Button>
            <Button type="button" variant="cta" size="sm" onClick={goToNextStep} className="gap-1.5">
              <span>{isBn ? "সম্পন্ন ও পরের ধাপ" : "Next: Core Speaking"}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: CORE SPEAKING PROMPT & 5-STEP AI FEEDBACK */}
      {!isGuest && activeStep === 3 && (
        <div className="rounded-panel bg-muted/30 border border-border/60 p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success" size="sm">Step 4 of 5 · Core Speaking</Badge>
              <span className="text-chip text-foreground">{promptData.topic}</span>
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
            <p className="text-lead text-foreground">{promptData.promptEn}</p>
            {showTranslation && (
              <p className={cn("text-meta text-muted-foreground", translationLocale === "bn" && "text-bangla")}>
                {translationLocale === "bn"
                  ? promptData.instructionBn
                  : liveMap[promptData.promptEn] ?? null}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-chip">
            <span className="text-muted-foreground">{isBn ? "শুরু করতে পারেন:" : "Starter:"}</span>
            <span className="px-2.5 py-1 rounded-control bg-card border border-border text-foreground italic">
              &ldquo;{promptData.starterPhrase}&rdquo;
            </span>
            {promptData.targetVocab.map((v) => (
              <Badge key={v} variant="brand" size="sm">{v}</Badge>
            ))}
          </div>

          <div className="space-y-2">
            <Textarea
              value={learnerResponse}
              onChange={(e) => setLearnerResponse(e.target.value)}
              rows={3}
              placeholder={
                isBn
                  ? "মাইক্রোফোন অন করে ইংরেজিতে বলুন, অথবা এখানে লিখুন..."
                  : "Tap Speak to record your voice, or type your spoken response here..."
              }
            />
            {micNote && <p className="text-chip text-muted-foreground">{micNote}</p>}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={() => startVoiceMic(setLearnerResponse)}
                className="gap-1.5"
              >
                <HugeiconsIcon icon={isRecording ? StopIcon : Mic01Icon} size={15} />
                <span>
                  {isRecording
                    ? isBn ? "রেকর্ডিং থামান" : "Stop Recording"
                    : isBn ? "ভয়েসে বলুন (Mic)" : "Speak (Mic)"}
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
                    ? isBn ? "বিশ্লেষণ চলছে..." : "Checking..."
                    : isBn ? "৫-ধাপের ফিডব্যাক নিন" : "Get 5-Step Feedback"}
                </span>
              </Button>
            </div>
          </div>

          {feedback && (
            <div className="rounded-panel bg-card border border-border p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-label text-foreground">
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
                  <span className="text-label">1. What you communicated: </span>
                  {showTranslation && liveMap[feedback.communicated]
                    ? liveMap[feedback.communicated]
                    : feedback.communicated}
                </p>

                <div className="rounded-control bg-status-success-bg/50 p-3 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-chip text-status-success-ink">
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
                  <p className="text-body text-foreground">
                    &ldquo;{feedback.betterVersion}&rdquo;
                  </p>
                  {showTranslation && liveMap[feedback.betterVersion] && (
                    <p className="text-chip text-muted-foreground">{liveMap[feedback.betterVersion]}</p>
                  )}
                </div>

                <p className={cn("text-muted-foreground", isBn && "text-bangla")}>
                  <span className="text-label text-foreground">3. Key correction: </span>
                  {showTranslation && liveMap[feedback.keyCorrection]
                    ? liveMap[feedback.keyCorrection]
                    : feedback.keyCorrection}
                </p>

                <p className="text-muted-foreground">
                  <span className="text-label text-foreground">4. Useful expression: </span>
                  <Badge variant="brand" size="sm">{feedback.usefulExpression}</Badge>
                </p>

                <p className="text-chip text-primary pt-2 border-t border-border/60">
                  5. Speak again:{" "}
                  {showTranslation && liveMap[feedback.speakAgainPrompt]
                    ? liveMap[feedback.speakAgainPrompt]
                    : feedback.speakAgainPrompt}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" size="sm" onClick={() => setActiveStep(2)}>
              {isBn ? "আগের ধাপ" : "Back"}
            </Button>
            <Button type="button" variant="cta" size="sm" onClick={goToNextStep} className="gap-1.5">
              <span>{isBn ? "পরের ধাপ: মিনি রোলপ্লে" : "Next: Mini AI Roleplay"}</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: MINI AI ROLEPLAY (INLINE) */}
      {!isGuest && activeStep === 4 && (
        <div className="rounded-panel bg-muted/30 border border-border/60 p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <Badge variant="brand" size="sm">Step 5 of 5 · ~8 min</Badge>
              <h3 className="text-label text-foreground mt-1">
                {dayLesson.roleplay.titleEn} ({dayLesson.roleplay.partnerRole})
              </h3>
            </div>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {roleplayHistory.map((m, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-card p-3 border text-meta space-y-1",
                  m.speaker === "ai"
                    ? "bg-card border-border mr-6"
                    : "bg-primary/10 border-primary/25 ml-6"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-chip text-muted-foreground">
                    {m.speaker === "ai" ? dayLesson.roleplay.partnerRole : isBn ? "আপনি" : "You"}
                  </span>
                  {m.speaker === "ai" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => speakText(m.text, { rate: 0.94 })}
                    >
                      <HugeiconsIcon icon={VolumeHighIcon} size={13} />
                    </Button>
                  )}
                </div>
                <p className="text-body text-foreground">{m.text}</p>
                {showTranslation && liveMap[m.text] && (
                  <p className="text-chip text-muted-foreground">{liveMap[m.text]}</p>
                )}
              </div>
            ))}
          </div>

          {roleplayTip && (
            <p className="text-chip text-primary bg-primary/10 rounded-control px-3 py-2">
              💡 {showTranslation && liveMap[roleplayTip] ? liveMap[roleplayTip] : roleplayTip}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 min-w-0">
              <Input
                type="text"
                value={roleplayInput}
                onChange={(e) => setRoleplayInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendRoleplayTurn();
                  }
                }}
                placeholder={isBn ? "রোলপ্লে-তে আপনার উত্তর বলুন বা লিখুন..." : "Speak or type your reply..."}
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={() => startVoiceMic(setRoleplayInput)}
                className="gap-1"
              >
                <HugeiconsIcon icon={isRecording ? StopIcon : Mic01Icon} size={14} />
                <span>{isRecording ? "Stop" : "Mic"}</span>
              </Button>
              <Button
                type="button"
                variant="cta"
                size="sm"
                disabled={roleplayLoading || roleplayInput.trim().length === 0}
                onClick={handleSendRoleplayTurn}
              >
                {roleplayLoading ? "..." : isBn ? "পাঠান" : "Send"}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <Button type="button" variant="outline" size="sm" onClick={() => setActiveStep(3)}>
              {isBn ? "আগের ধাপ" : "Back"}
            </Button>
            <Button type="button" variant="cta" size="sm" onClick={handleCompleteDay} className="gap-1.5">
              <HugeiconsIcon icon={Award01Icon} size={15} />
              <span>
                {isBn
                  ? `দিন ${challengeState.currentDay} শেষ করুন`
                  : `Finish Day ${challengeState.currentDay}`}
              </span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
