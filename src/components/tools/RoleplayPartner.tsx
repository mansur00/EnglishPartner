"use client";

import React, { useState, useTransition, useRef, useEffect, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BotIcon,
  UserIcon,
  VolumeHighIcon,
  VolumeMute01Icon,
  SentIcon,
  SparklesIcon,
  ArrowReloadHorizontalIcon,
  HelpCircleIcon,
  CheckmarkCircle01Icon,
  StopIcon,
  Award01Icon,
  Target01Icon,
  Mic01Icon,
} from "@hugeicons/core-free-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupSuffix } from "@/components/ui/input-group";
import { Tag } from "@/components/ui/tag";
import { Pill } from "@/components/ui/pill";
import { ChatBubble } from "@/components/shared/ChatBubble";
import {
  generateRoleplayTurn,
  generateRoleplayFeedback,
} from "@/lib/ai/roleplay";
import {
  getVoiceSpeedRate,
  cleanSpokenTranscript,
  formatVoiceStatusCue,
  type VoiceSpeedSetting,
} from "@/lib/ai/roleplay-voice";
import type {
  RoleplayTurnResponse,
  RoleplayFeedbackResponse,
  TranscriptTurn,
} from "@/lib/ai/roleplay-schema";
import { cn } from "@/lib/utils";

interface RoleplayScenario {
  id: string;
  title: string;
  titleBn: string;
  context: string;
  contextBn: string;
  aiRole: string;
  aiRoleBn: string;
  learnerRole: string;
  learnerRoleBn: string;
  level: string;
  quickPrompts: string[];
}

const SCENARIOS: RoleplayScenario[] = [
  {
    id: "shopping-store",
    title: "Buying at the Store",
    titleBn: "দোকানে কেনাকাটা ও দরদাম",
    context: "You are at a clothing store looking at bags and shirts.",
    contextBn: "আপনি একটি পোশাকের দোকানে ব্যাগ ও শার্ট দেখছেন।",
    aiRole: "Shopkeeper",
    aiRoleBn: "দোকানদার",
    learnerRole: "Customer",
    learnerRoleBn: "ক্রেতা",
    level: "A1",
    quickPrompts: [
      "How much is this bag?",
      "Can you give me a discount?",
      "Can I pay by card?",
      "Do you have a blue one?",
    ],
  },
  {
    id: "cafe-order",
    title: "Ordering at a Cafe",
    titleBn: "ক্যাফেতে কফি ও খাবার অর্ডার",
    context: "You are at a cafe ordering a drink and a light snack.",
    contextBn: "আপনি একটি ক্যাফেতে কফি ও নাস্তা অর্ডার করছেন।",
    aiRole: "Barista",
    aiRoleBn: "ক্যাফে সহকারী",
    learnerRole: "Customer",
    learnerRoleBn: "গ্রাহক",
    level: "A1",
    quickPrompts: [
      "I would like a medium cappuccino, please.",
      "What snacks do you recommend?",
      "How much is the total?",
      "Keep the change, thank you!",
    ],
  },
  {
    id: "job-interview",
    title: "Job Interview Practice",
    titleBn: "চাকরির ইন্টারভিউ প্রস্তুতি",
    context: "You are meeting the hiring manager for a junior role.",
    contextBn: "আপনি চাকরির ইন্টারভিউতে নিয়োগ কর্মকর্তার সাথে কথা বলছেন।",
    aiRole: "Interviewer",
    aiRoleBn: "ইন্টারভিউয়ার",
    learnerRole: "Applicant",
    learnerRoleBn: "চাকরিপ্রার্থী",
    level: "A2",
    quickPrompts: [
      "Good morning, thank you for having me.",
      "I have two years of relevant experience.",
      "Could you tell me more about the team?",
      "I look forward to hearing from you.",
    ],
  },
];

interface ChatMessage {
  speaker: "ai" | "learner";
  text: string;
  correction?: {
    original: string;
    improved: string;
    reason: string;
  } | null;
  hint?: string | null;
}

function FeedbackSectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-meta text-muted-foreground uppercase tracking-wider block font-sans">
      {children}
    </span>
  );
}

export function RoleplayPartner() {
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario>(SCENARIOS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initialTurn = generateRoleplayTurn({
      scenario_id: SCENARIOS[0].id,
      scenario_title: SCENARIOS[0].title,
      scenario_context: SCENARIOS[0].context,
      ai_role: SCENARIOS[0].aiRole,
      learner_role: SCENARIOS[0].learnerRole,
      level: SCENARIOS[0].level,
      transcript: [],
      learner_message: "Hello",
    });
    return [
      {
        speaker: "ai",
        text: initialTurn.ai_reply,
        hint: initialTurn.hint,
      },
    ];
  });
  const [inputMessage, setInputMessage] = useState("");
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState<VoiceSpeedSetting>("clear");
  const [micError, setMicError] = useState<string | null>(null);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<RoleplayFeedbackResponse | null>(null);
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Play audio helper with configurable speed
  const playAudio = useCallback(
    (text: string, index?: number, onFinish?: () => void) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = getVoiceSpeedRate(voiceSpeed);

      if (index !== undefined) {
        setPlayingIndex(index);
      }
      setIsAiSpeaking(true);

      utterance.onend = () => {
        setIsAiSpeaking(false);
        if (index !== undefined) setPlayingIndex(null);
        if (onFinish) onFinish();
      };

      utterance.onerror = () => {
        setIsAiSpeaking(false);
        if (index !== undefined) setPlayingIndex(null);
      };

      window.speechSynthesis.speak(utterance);
    },
    [voiceSpeed]
  );

  const stopAudio = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setPlayingIndex(null);
      setIsAiSpeaking(false);
    }
  }, []);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initialize greeting turn on scenario change
  const startSession = useCallback(
    (scenario: RoleplayScenario) => {
      stopAudio();
      setSelectedScenario(scenario);
      setFeedback(null);
      setActiveHint(null);
      setMicError(null);

      const initialTurn = generateRoleplayTurn({
        scenario_id: scenario.id,
        scenario_title: scenario.title,
        scenario_context: scenario.context,
        ai_role: scenario.aiRole,
        learner_role: scenario.learnerRole,
        level: scenario.level,
        transcript: [],
        learner_message: "Hello",
      });

      setMessages([
        {
          speaker: "ai",
          text: initialTurn.ai_reply,
          hint: initialTurn.hint,
        },
      ]);

      if (voiceMode) {
        playAudio(initialTurn.ai_reply, 0);
      }
    },
    [playAudio, stopAudio, voiceMode]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? inputMessage).trim();
    if (!text || isPending || feedback) return;

    setInputMessage("");

    // Build transcript for AI turn
    const transcript: TranscriptTurn[] = messages.map((m) => ({
      speaker: m.speaker,
      text: m.text,
    }));

    startTransition(() => {
      const response: RoleplayTurnResponse = generateRoleplayTurn({
        scenario_id: selectedScenario.id,
        scenario_title: selectedScenario.title,
        scenario_context: selectedScenario.context,
        ai_role: selectedScenario.aiRole,
        learner_role: selectedScenario.learnerRole,
        level: selectedScenario.level,
        transcript,
        learner_message: text,
      });

      const nextAiIndex = messages.length + 1;

      setMessages((prev) => [
        ...prev,
        {
          speaker: "learner",
          text,
          correction: response.correction,
        },
        {
          speaker: "ai",
          text: response.ai_reply,
          hint: response.hint,
        },
      ]);

      if (voiceMode) {
        playAudio(response.ai_reply, nextAiIndex);
      }

      if (response.hint) {
        setActiveHint(response.hint);
      }

      if (response.turn_status === "learner_finished") {
        handleEndSession();
      }
    });
  };

  const handleEndSession = () => {
    stopAudio();
    if (messages.length === 0) return;

    const transcript: TranscriptTurn[] = messages.map((m) => ({
      speaker: m.speaker,
      text: m.text,
    }));

    startTransition(() => {
      const fb = generateRoleplayFeedback({
        scenario_title: selectedScenario.title,
        level: selectedScenario.level,
        learner_language: "bn",
        transcript,
      });
      setFeedback(fb);
    });
  };

  const toggleSpeechRecognition = () => {
    setMicError(null);

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError("আপনার ব্রাউজারে স্পিচ রিকগনিশন সমর্থন করে না। আপনি লিখে উত্তর দিতে পারেন।");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawTranscript = Array.from(event.results).map((r: any) => r[0].transcript).join("");
        const cleaned = cleanSpokenTranscript(rawTranscript);
        setInputMessage(cleaned);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setMicError("মাইক্রোফোন অ্যাক্সেস পাওয়া যায়নি বা কোনো শব্দ শোনা যায়নি। আপনি লিখে পাঠাতে পারেন।");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setMicError("মাইক্রোফোন সংযোগ ব্যর্থ হয়েছে। অনুগ্রহ করে ব্রাউজার পারমিশন চেক করুন।");
    }
  };

  const voiceCue = formatVoiceStatusCue(
    isAiSpeaking ? "ai_speaking" : isListening ? "learner_listening" : "awaiting_input",
    selectedScenario.aiRole
  );

  return (
    <div className="space-y-6 max-w-container mx-auto">
      {/* Header & Scenario Selection */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Tag variant="brand" size="sm">
              Milestones 2D &amp; 3B
            </Tag>
            <Pill variant="neutral" size="sm">
              AI Partner (Voice &amp; Text Roleplay)
            </Pill>
          </div>
          <h1 className="text-page-title text-foreground">
            AI Voice &amp; Text Conversation Partner
          </h1>
          <p className="text-meta-bn text-muted-foreground">
            বাস্তব পরিস্থিতিতে এআই সহযোগীর সাথে মুখে বা লিখে ইংরেজি অনুশীলন করুন এবং তাৎক্ষণিক ফিডব্যাক পান।
          </p>
        </div>

        {/* Scenario Select Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {SCENARIOS.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            return (
              <Button
                key={sc.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => startSession(sc)}
                className="rounded-control text-chip"
              >
                <span>{sc.title}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Voice Mode & Speed Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-panel bg-muted/40 border border-border">
        {/* Voice Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={voiceMode ? "default" : "outline"}
            size="sm"
            onClick={() => {
              const next = !voiceMode;
              setVoiceMode(next);
              if (!next) stopAudio();
            }}
            className="rounded-control text-chip gap-1.5 cursor-pointer"
          >
            <HugeiconsIcon icon={voiceMode ? VolumeHighIcon : VolumeMute01Icon} size={15} />
            <span className="text-bangla">
              {voiceMode ? "ভয়েস মোড: চালু" : "ভয়েস মোড: বন্ধ"}
            </span>
          </Button>

          <span className="text-chip-bn text-muted-foreground">
            {voiceMode ? "পার্টনার প্রতিটি কথা স্বয়ংক্রিয়ভাবে বলবে" : "শুধুমাত্র টেক্সট দেখা যাবে"}
          </span>
        </div>

        {/* Voice Speed Controls */}
        {voiceMode && (
          <div className="flex items-center gap-1.5">
            <span className="text-chip text-muted-foreground">গতি:</span>
            {(["slow", "clear", "normal"] as VoiceSpeedSetting[]).map((spd) => {
              const isCur = voiceSpeed === spd;
              const spdLabel = spd === "slow" ? "ধীরে (0.75x)" : spd === "clear" ? "স্পষ্ট (0.88x)" : "স্বাভাবিক (1.0x)";
              return (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setVoiceSpeed(spd)}
                  className={cn(
                    "px-2 py-0.5 rounded-pill text-chip transition-colors cursor-pointer",
                    isCur
                      ? "bg-primary text-primary-foreground font-mono"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {spdLabel}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Roleplay Context Card */}
      <Card className="p-4 bg-muted/30 border border-border rounded-panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-pill bg-primary/10 text-primary">
            <HugeiconsIcon icon={BotIcon} size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-label text-foreground font-sans">
                {selectedScenario.title}
              </span>
              <Tag variant="outline" size="sm">
                Level {selectedScenario.level}
              </Tag>
            </div>
            <p className="text-meta-bn text-muted-foreground mt-0.5">
              আপনি: <strong className="text-foreground">{selectedScenario.learnerRoleBn}</strong> | পার্টনার:{" "}
              <strong className="text-foreground">{selectedScenario.aiRoleBn}</strong> ({selectedScenario.contextBn})
            </p>
          </div>
        </div>

        {!feedback && messages.length > 2 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleEndSession}
            disabled={isPending}
            className="rounded-control text-chip text-destructive hover:bg-destructive/10 border-destructive/30"
          >
            <span>সেশন শেষ করুন (Get Feedback)</span>
          </Button>
        )}
      </Card>

      {/* Main Conversation Stream */}
      <Card className="p-4 sm:p-6 bg-card border border-border rounded-card space-y-4 min-h-96 flex flex-col justify-between shadow-xs">
        <div className="space-y-4 overflow-y-auto max-h-96 pr-1">
          {messages.map((msg, idx) => {
            const isAi = msg.speaker === "ai";
            const isPlaying = playingIndex === idx;

            return (
              <div
                key={idx}
                className={cn(
                  "flex flex-col gap-1.5 animate-in fade-in",
                  isAi ? "items-start" : "items-end"
                )}
              >
                {/* Speaker Header */}
                <div className="flex items-center gap-1.5 px-1">
                  <HugeiconsIcon
                    icon={isAi ? BotIcon : UserIcon}
                    size={13}
                    className="text-muted-foreground"
                  />
                  <span className="text-chip text-muted-foreground">
                    {isAi ? selectedScenario.aiRole : "You"}
                  </span>
                </div>

                {/* Message Bubble */}
                <div className="flex items-center gap-2 group">
                  <ChatBubble speaker={isAi ? "1" : "2"}>
                    <p className="leading-relaxed select-text">{msg.text}</p>
                  </ChatBubble>

                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => (isPlaying ? stopAudio() : playAudio(msg.text, idx))}
                    aria-label="Listen to turn"
                    className="rounded-pill p-1.5 text-muted-foreground hover:text-primary transition-colors opacity-80 group-hover:opacity-100"
                  >
                    <HugeiconsIcon
                      icon={isPlaying ? StopIcon : VolumeHighIcon}
                      size={15}
                      className={cn(isPlaying && "text-primary")}
                    />
                  </Button>
                </div>

                {/* Inline Gentle Correction (Brief §9.2) */}
                {msg.correction && (
                  <div className="mt-1 p-2.5 rounded-panel bg-warning-bg border border-warning/30 text-meta text-bangla max-w-sm space-y-1 animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-label text-foreground">
                      <HugeiconsIcon icon={SparklesIcon} size={14} className="text-warning shrink-0" />
                      <span>জেন্টল কারেকশন (Friendly Tip):</span>
                    </div>
                    <p className="text-foreground">
                      &quot;<span className="line-through text-muted-foreground">{msg.correction.original}</span>&quot;{" "}
                      এর জায়গায় &quot;<strong className="text-primary font-sans">{msg.correction.improved}</strong>&quot; বললে আরও স্বাভাবিক শোনায়।
                    </p>
                    <p className="text-chip text-muted-foreground">{msg.correction.reason}</p>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Live Audio & Speaking Status Indicator */}
        {isAiSpeaking && (
          <div className="flex items-center justify-between p-2.5 rounded-panel bg-primary/10 border border-primary/20 text-primary text-chip animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-pill bg-primary animate-ping" />
              <span className="text-bangla">{voiceCue.labelBn}</span>
            </div>
            <Button
              size="xs"
              variant="ghost"
              onClick={stopAudio}
              className="rounded-control text-chip text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <HugeiconsIcon icon={StopIcon} size={13} />
              <span className="text-bangla">থামান (Stop)</span>
            </Button>
          </div>
        )}

        {/* Inline Mic Access Error Banner */}
        {micError && (
          <div className="flex items-center justify-between p-3 rounded-panel bg-destructive/10 border border-destructive/20 text-destructive text-chip animate-in fade-in">
            <p className="text-bangla">{micError}</p>
            <button
              type="button"
              onClick={() => setMicError(null)}
              className="text-chip text-destructive hover:underline cursor-pointer ml-2"
            >
              বন্ধ করুন
            </button>
          </div>
        )}

        {/* Inline Hint Banner */}
        {activeHint && !feedback && (
          <div className="p-3 rounded-panel bg-primary/5 border border-primary/20 flex items-center justify-between gap-2 text-chip text-bangla animate-in fade-in">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={HelpCircleIcon} size={15} className="text-primary shrink-0" />
              <span className="text-foreground">{activeHint}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveHint(null)}
              className="text-muted-foreground hover:text-foreground text-chip cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        )}

        {/* Input Bar & Suggestions */}
        {!feedback ? (
          <div className="space-y-3 pt-3 border-t border-border">
            {/* Quick Prompts */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-chip text-muted-foreground">Try saying:</span>
              {selectedScenario.quickPrompts.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isPending}
                  className="px-2.5 py-1 rounded-pill bg-muted/60 hover:bg-muted text-chip text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form with Voice Speech Integration */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <InputGroup className="flex-1">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    isListening
                      ? "Listening... Speak in English..."
                      : "Type your response or tap mic to speak..."
                  }
                  disabled={isPending}
                  className="rounded-control text-label"
                />
                <InputGroupSuffix>
                  <Button
                    type="button"
                    variant={isListening ? "destructive" : "ghost"}
                    size="sm"
                    onClick={toggleSpeechRecognition}
                    disabled={isPending}
                    title={isListening ? "Stop listening" : "Speak your message"}
                    className={cn(
                      "rounded-control text-chip px-2",
                      isListening && "animate-pulse"
                    )}
                  >
                    <HugeiconsIcon icon={isListening ? StopIcon : Mic01Icon} size={15} />
                  </Button>

                  <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    disabled={!inputMessage.trim() || isPending}
                    className="rounded-control text-chip gap-1"
                  >
                    <HugeiconsIcon icon={SentIcon} size={14} />
                    <span>Send</span>
                  </Button>
                </InputGroupSuffix>
              </InputGroup>
            </form>
          </div>
        ) : null}
      </Card>

      {/* Session Feedback Summary Modal/Card (Schema F1) */}
      {feedback && (
        <Card className="p-6 bg-card border border-border rounded-card space-y-5 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-border flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-pill bg-success-bg text-success">
                <HugeiconsIcon icon={Award01Icon} size={20} />
              </div>
              <div>
                <h3 className="text-card-title text-foreground">
                  Session Feedback Summary (সেশন পর্যালোচনা)
                </h3>
                <p className="text-meta-bn text-muted-foreground">
                  Schema F1 অনুযায়ী আপনার পারফরম্যান্স মূল্যায়ন
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => startSession(selectedScenario)}
              className="rounded-control text-bangla gap-1.5"
            >
              <HugeiconsIcon icon={ArrowReloadHorizontalIcon} size={14} />
              <span>পুনরায় শুরু করুন</span>
            </Button>
          </div>

          {/* Bengali Summary */}
          <div className="p-4 rounded-panel bg-muted/40 border border-border text-meta text-bangla leading-relaxed text-foreground">
            {feedback.summary}
          </div>

          {/* Session Dialogue Audio Replay (Milestone 3B) */}
          <div className="space-y-2 p-3.5 rounded-panel bg-muted/20 border border-border">
            <FeedbackSectionHeader>
              Dialogue Replay (কথোপকথন অডিও রিভিশন)
            </FeedbackSectionHeader>
            <div className="space-y-1.5">
              {messages.map((turn, tIdx) => (
                <div
                  key={tIdx}
                  className="flex items-center justify-between p-2 rounded-control bg-card border border-border text-chip"
                >
                  <span className="text-foreground">
                    <strong className="text-primary font-mono mr-1">
                      {turn.speaker === "ai" ? selectedScenario.aiRole : "You"}:
                    </strong>
                    {turn.text}
                  </span>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => playAudio(turn.text, tIdx)}
                    className="rounded-pill p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <HugeiconsIcon icon={VolumeHighIcon} size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div className="space-y-2">
            <FeedbackSectionHeader>
              Strengths (আপনার সবল দিকসমূহ)
            </FeedbackSectionHeader>
            <div className="space-y-1.5">
              {feedback.strengths.map((str, sIdx) => (
                <div key={sIdx} className="flex items-start gap-2 text-meta text-bangla text-foreground">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} className="text-success shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Focus Areas */}
          {feedback.focus_areas && feedback.focus_areas.length > 0 && (
            <div className="space-y-2.5">
              <FeedbackSectionHeader>
                Focus Areas (উন্নয়নের জায়গা)
              </FeedbackSectionHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feedback.focus_areas.map((fa, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3.5 rounded-panel border border-border bg-card space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <Tag variant="secondary" size="sm">
                        {fa.area}
                      </Tag>
                    </div>
                    <p className="text-chip text-muted-foreground font-sans">
                      আপনার বাক্য: &quot;<span className="text-foreground">{fa.example_from_learner}</span>&quot;
                    </p>
                    <p className="text-chip text-bangla text-muted-foreground">
                      পরামর্শ: {fa.suggestion}
                    </p>
                    <p className="text-chip font-sans text-primary border-t border-border/50 pt-1">
                      বিকল্প: &quot;{fa.natural_alternative}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Step */}
          <div className="p-3.5 rounded-panel bg-primary/5 border border-primary/20 space-y-1 text-meta text-bangla">
            <div className="flex items-center gap-1.5 text-label text-foreground">
              <HugeiconsIcon icon={Target01Icon} size={16} />
              <span>পরবর্তী পদক্ষেপ (Next Step):</span>
            </div>
            <p className="text-foreground">{feedback.next_step}</p>
          </div>

          {/* Limitations Disclaimer */}
          <p className="text-chip text-muted-foreground text-bangla border-t border-border pt-2 italic">
            {feedback.limitations}
          </p>
        </Card>
      )}
    </div>
  );
}
