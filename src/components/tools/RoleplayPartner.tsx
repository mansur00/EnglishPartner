"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  CpuIcon,
  Add01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupSuffix } from "@/components/ui/input-group";
import { Tag } from "@/components/ui/tag";
import { Pill } from "@/components/ui/pill";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ChatBubble } from "@/components/shared/ChatBubble";
import { LocaleTitle } from "@/components/shared";
import {
  generateRoleplayTurn,
  generateRoleplayFeedback,
} from "@/lib/ai/roleplay";
import { useTranslations } from "@/lib/i18n";
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

export const FREESTYLE_SCENARIO: RoleplayScenario = {
  id: "freestyle",
  title: "Freestyle Conversation",
  titleBn: "উন্মুক্ত কথোপকথন",
  context: "Friendly English tutor & conversation partner. Talk freely about any topic, daily life, hobbies, work, philosophy, or ask any questions like ChatGPT.",
  contextBn: "উন্মুক্ত আড্ডা: যেকোনো বিষয়ে কথা বলুন, গল্প করুন বা যেকোনো ইংরেজি প্রশ্ন জিজ্ঞেস করুন।",
  aiRole: "AI Conversation Partner",
  aiRoleBn: "এআই বন্ধু ও শিক্ষক",
  learnerRole: "Learner",
  learnerRoleBn: "শিক্ষার্থী",
  level: "Any",
  quickPrompts: [
    "How is your day going so far?",
    "Can we talk about my daily routine?",
    "What is an effective way to improve English fluency?",
    "Could you check if this sentence sounds natural?",
  ],
};

const PRESET_SCENARIOS: RoleplayScenario[] = [
  {
    id: "shopping-store",
    title: "Buying at the Store",
    titleBn: "দোকানে কেনাকাটা ও দরদাম",
    context: "You are at a clothing store inquiring about prices, sizes, and discounts.",
    contextBn: "পোশাকের দোকানে ব্যাগ ও পোশাকের দাম ও সাইজ জানতে চাওয়া।",
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
    contextBn: "ক্যাফেতে কফি ও নাস্তা অর্ডার করা এবং দাম জানা।",
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
    id: "taxi-directions",
    title: "Taking a Taxi & Directions",
    titleBn: "ট্যাক্সি নেওয়া ও পথ চেনা",
    context: "You are taking a taxi, giving your destination, and asking about route and fare.",
    contextBn: "ট্যাক্সি ডেকে গন্তব্য জানানো এবং ভাড়া ও পথ সম্পর্কে কথা বলা।",
    aiRole: "Taxi Driver",
    aiRoleBn: "ট্যাক্সি ড্রাইভার",
    learnerRole: "Passenger",
    learnerRoleBn: "যাত্রী",
    level: "A1",
    quickPrompts: [
      "Could you take me to the airport, please?",
      "How long will it take to get there?",
      "Can we take a faster route?",
      "How much is the total fare?",
    ],
  },
  {
    id: "hotel-checkin",
    title: "Hotel Check-in & Inquiry",
    titleBn: "হোটেল রুম বুকিং ও চেক-ইন",
    context: "You are checking into a hotel, confirming your reservation, and asking about amenities.",
    contextBn: "হোটেল রিসেপশনে বুকিং নিশ্চিত করা এবং ওয়াইফাই ও ব্রেকফাস্ট সম্পর্কে জানা।",
    aiRole: "Hotel Receptionist",
    aiRoleBn: "হোটেল রিসেপশনিস্ট",
    learnerRole: "Guest",
    learnerRoleBn: "অতিথি",
    level: "A2",
    quickPrompts: [
      "I have a reservation under my name.",
      "What time is breakfast served?",
      "Could I have the Wi-Fi password?",
      "Is room service available?",
    ],
  },
  {
    id: "restaurant-dining",
    title: "Dining Out at a Restaurant",
    titleBn: "রেস্তোরাঁয় খাবার অর্ডার ও বিল পরিশোধ",
    context: "You are dining at a restaurant, ordering courses, and requesting the bill.",
    contextBn: "রেস্তোরাঁয় টেবিল চেয়ে বসা, মেন্যু থেকে পছন্দের খাবার বাছাই ও বিল চাওয়া।",
    aiRole: "Restaurant Server",
    aiRoleBn: "ওয়েটার",
    learnerRole: "Diner",
    learnerRoleBn: "ভোজনরসিক",
    level: "A2",
    quickPrompts: [
      "A table for two, please.",
      "What is today's chef special?",
      "Could we get the bill, please?",
      "Everything tasted delicious!",
    ],
  },
  {
    id: "airport-travel",
    title: "Airport Check-in & Baggage",
    titleBn: "এয়ারপোর্ট চেক-ইন ও বোর্ডিং",
    context: "You are at the airline counter checking bags, selecting seats, and confirming gate details.",
    contextBn: "এয়ারপোর্টে লাগেজ ড্রপ করা, সিট নেওয়া এবং বোর্ডিং গেট সম্পর্কে জানা।",
    aiRole: "Airline Counter Agent",
    aiRoleBn: "এয়ারলাইন অফিসার",
    learnerRole: "Passenger",
    learnerRoleBn: "বিমানযাত্রী",
    level: "A2",
    quickPrompts: [
      "Here is my passport and ticket.",
      "Could I have a window seat?",
      "Where is boarding gate 12?",
      "Is this carry-on bag within the limit?",
    ],
  },
  {
    id: "doctor-visit",
    title: "Visiting the Doctor / Clinic",
    titleBn: "ডাক্তারের কাছে শারীরিক সমস্যা বলা",
    context: "You are explaining mild symptoms (fever, headache, fatigue) to a clinic doctor.",
    contextBn: "ক্লিনিকে ডাক্তারের কাছে লক্ষণ (মাথাব্যথা, জ্বর) বলে ব্যবস্থাপত্র নেওয়া।",
    aiRole: "Doctor",
    aiRoleBn: "চিকিৎসক",
    learnerRole: "Patient",
    learnerRoleBn: "রোগী",
    level: "B1",
    quickPrompts: [
      "I have had a headache and sore throat since yesterday.",
      "How many times a day should I take this medicine?",
      "Are there any side effects I should know about?",
      "Thank you for the advice, doctor.",
    ],
  },
  {
    id: "job-interview",
    title: "Job Interview Practice",
    titleBn: "চাকরির ইন্টারভিউ প্রস্তুতি",
    context: "You are meeting the hiring manager for a junior role.",
    contextBn: "আপনি চাকরির ইন্টারভিউতে নিয়োগ কর্মকর্তার সাথে কথা বলছেন।",
    aiRole: "Hiring Manager",
    aiRoleBn: "নিয়োগ কর্মকর্তা",
    learnerRole: "Applicant",
    learnerRoleBn: "চাকরিপ্রার্থী",
    level: "B1",
    quickPrompts: [
      "Good morning, thank you for having me.",
      "I have two years of relevant experience.",
      "Could you tell me more about the team culture?",
      "I look forward to hearing from you.",
    ],
  },
  {
    id: "office-meeting",
    title: "Workplace Meeting & Updates",
    titleBn: "অফিস মিটিং ও কাজের আপডেট",
    context: "You are giving a status update on a weekly project during a team standup.",
    contextBn: "টিম মিটিংয়ে কাজের অগ্রগতি জানানো এবং সময়সূচি নিয়ে মতামত প্রকাশ করা।",
    aiRole: "Team Lead",
    aiRoleBn: "টিম লিডার",
    learnerRole: "Team Member",
    learnerRoleBn: "সহকর্মী",
    level: "B1",
    quickPrompts: [
      "Everything is progressing on schedule.",
      "I completed the draft yesterday.",
      "Could we reschedule the review to tomorrow morning?",
      "I will send over the summary email shortly.",
    ],
  },
  {
    id: "product-return",
    title: "Returning a Damaged Product",
    titleBn: "ত্রুটিপূর্ণ পণ্য ফেরত বা বদল",
    context: "You are explaining a product defect politely to customer support and requesting an exchange or refund.",
    contextBn: "কেনা পণ্যে ত্রুটি থাকায় কাস্টমার সাপোর্টে কথা বলে বদল বা রিফান্ড চাওয়া।",
    aiRole: "Customer Support Rep",
    aiRoleBn: "কাস্টমার সাপোর্ট",
    learnerRole: "Customer",
    learnerRoleBn: "ক্রেতা",
    level: "B2",
    quickPrompts: [
      "I would like to return this item as it is defective.",
      "I have the purchase receipt with me.",
      "Can I exchange it for a new one or get a refund?",
      "Thank you for your assistance.",
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
  const { locale, t } = useTranslations();
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario>(FREESTYLE_SCENARIO);
  const [customScenarios, setCustomScenarios] = useState<RoleplayScenario[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    context: "",
    aiRole: "",
    learnerRole: "",
    level: "A2",
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const initialTurn = generateRoleplayTurn({
      scenario_id: FREESTYLE_SCENARIO.id,
      scenario_title: FREESTYLE_SCENARIO.title,
      scenario_context: FREESTYLE_SCENARIO.context,
      ai_role: FREESTYLE_SCENARIO.aiRole,
      learner_role: FREESTYLE_SCENARIO.learnerRole,
      level: FREESTYLE_SCENARIO.level,
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
  const [isLoading, setIsLoading] = useState(false);
  const [providerInfo, setProviderInfo] = useState<{ isLive: boolean; statusText: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load custom scenarios from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ecp_custom_roleplay_scenarios");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          queueMicrotask(() => {
            setCustomScenarios(parsed);
          });
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  useEffect(() => {
    fetch("/api/v1/ai/status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setProviderInfo({ isLive: data.isLive, statusText: data.statusText });
        }
      })
      .catch(() => {});
  }, []);
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

  const handleSaveCustomTopic = () => {
    const title = createForm.title.trim();
    if (!title) return;

    const context = createForm.context.trim() || `Practicing conversation about ${title}`;
    const aiRole = createForm.aiRole.trim() || "Conversation Partner";
    const learnerRole = createForm.learnerRole.trim() || "Learner";
    const level = createForm.level || "A2";

    const newScenario: RoleplayScenario = {
      id: `custom-${Date.now()}`,
      title,
      titleBn: title,
      context,
      contextBn: context,
      aiRole,
      aiRoleBn: aiRole,
      learnerRole,
      learnerRoleBn: learnerRole,
      level,
      quickPrompts: [
        `Let's start discussing ${title}.`,
        "Could you explain more about this?",
        "What do you think is the best approach?",
        "How can I say this naturally?",
      ],
    };

    const nextList = [newScenario, ...customScenarios];
    setCustomScenarios(nextList);
    try {
      localStorage.setItem("ecp_custom_roleplay_scenarios", JSON.stringify(nextList));
    } catch {
      // Ignore storage errors
    }

    setIsCreateOpen(false);
    setCreateForm({
      title: "",
      context: "",
      aiRole: "",
      learnerRole: "",
      level: "A2",
    });

    startSession(newScenario);
  };

  const handleDeleteCustomScenario = (id: string) => {
    const nextList = customScenarios.filter((sc) => sc.id !== id);
    setCustomScenarios(nextList);
    try {
      localStorage.setItem("ecp_custom_roleplay_scenarios", JSON.stringify(nextList));
    } catch {
      // Ignore storage errors
    }
    if (selectedScenario.id === id) {
      startSession(FREESTYLE_SCENARIO);
    }
  };

  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputMessage).trim();
    if (!text || isLoading || feedback) return;

    setInputMessage("");

    // Build transcript for AI turn
    const transcript: TranscriptTurn[] = messages.map((m) => ({
      speaker: m.speaker,
      text: m.text,
    }));

    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/ai/roleplay/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario_id: selectedScenario.id,
          scenario_title: selectedScenario.title,
          scenario_context: selectedScenario.context,
          learning_objective: "Natural conversational dialogue practice",
          ai_role: selectedScenario.aiRole,
          learner_role: selectedScenario.learnerRole,
          level: selectedScenario.level,
          style: "casual",
          transcript,
          learner_message: text,
          explanation_language: "bn",
        }),
      });

      let response: RoleplayTurnResponse;
      if (res.ok) {
        response = await res.json();
      } else {
        response = generateRoleplayTurn({
          scenario_id: selectedScenario.id,
          scenario_title: selectedScenario.title,
          scenario_context: selectedScenario.context,
          ai_role: selectedScenario.aiRole,
          learner_role: selectedScenario.learnerRole,
          level: selectedScenario.level,
          transcript,
          learner_message: text,
        });
      }

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
    } catch {
      // Local fallback
      const fallback = generateRoleplayTurn({
        scenario_id: selectedScenario.id,
        scenario_title: selectedScenario.title,
        scenario_context: selectedScenario.context,
        ai_role: selectedScenario.aiRole,
        learner_role: selectedScenario.learnerRole,
        level: selectedScenario.level,
        transcript,
        learner_message: text,
      });

      setMessages((prev) => [
        ...prev,
        { speaker: "learner", text, correction: fallback.correction },
        { speaker: "ai", text: fallback.ai_reply, hint: fallback.hint },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    stopAudio();
    if (messages.length === 0) return;

    const transcript: TranscriptTurn[] = messages.map((m) => ({
      speaker: m.speaker,
      text: m.text,
    }));

    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/ai/roleplay/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario_title: selectedScenario.title,
          level: selectedScenario.level,
          transcript,
          learner_language: "bn",
        }),
      });

      if (res.ok) {
        const fb: RoleplayFeedbackResponse = await res.json();
        setFeedback(fb);
      } else {
        const fallbackFb = generateRoleplayFeedback({
          scenario_title: selectedScenario.title,
          level: selectedScenario.level,
          learner_language: "bn",
          transcript,
        });
        setFeedback(fallbackFb);
      }
    } catch {
      const fallbackFb = generateRoleplayFeedback({
        scenario_title: selectedScenario.title,
        level: selectedScenario.level,
        learner_language: "bn",
        transcript,
      });
      setFeedback(fallbackFb);
    } finally {
      setIsLoading(false);
    }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Tag variant="brand" size="sm">
              Milestones 2D &amp; 3B
            </Tag>
            <Pill variant="neutral" size="sm">
              AI Partner (Voice &amp; Text Roleplay)
            </Pill>
            {providerInfo && (
              <Pill
                variant={providerInfo.isLive ? "brand" : "neutral"}
                size="sm"
                className="gap-1 font-mono text-chip"
                title={providerInfo.statusText}
              >
                <HugeiconsIcon icon={CpuIcon} size={12} />
                <span>{providerInfo.statusText}</span>
              </Pill>
            )}
          </div>
          <LocaleTitle
            as="h1"
            titleEn="AI Voice & Text Conversation Partner"
            titleBn="এআই ভয়েস ও টেক্সট কথোপকথন পার্টনার"
            className="text-page-title text-foreground"
          />
          <p className="text-meta-bn text-muted-foreground">
            {locale === "bn"
              ? "বাস্তব পরিস্থিতিতে এআই সহযোগীর সাথে মুখে বা লিখে ইংরেজি অনুশীলন করুন এবং তাৎক্ষণিক ফিডব্যাক পান।"
              : "Practice conversational English through voice or text roleplay with your AI partner in real-world scenarios."}
          </p>
        </div>

        {/* Action button in header */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          className="rounded-control text-chip gap-1.5 cursor-pointer shrink-0"
        >
          <HugeiconsIcon icon={Add01Icon} size={14} />
          <span>{locale === "bn" ? "+ নতুন টপিক" : "+ Create Topic"}</span>
        </Button>
      </div>

      {/* Topic Selection Bar */}
      <div className="space-y-2.5 p-3.5 rounded-panel bg-card border border-border shadow-2xs">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-label text-foreground font-sans">
              {locale === "bn" ? "কথোপকথনের টপিক ও মোড:" : "Conversation Topics & Mode:"}
            </span>
            <span className="text-chip text-muted-foreground">
              ({1 + PRESET_SCENARIOS.length + customScenarios.length} {locale === "bn" ? "টি অপশন" : "options"})
            </span>
          </div>
          {selectedScenario.id === "freestyle" ? (
            <span className="text-chip-bn text-primary flex items-center gap-1 font-sans">
              <HugeiconsIcon icon={SparklesIcon} size={13} />
              {locale === "bn"
                ? "উন্মুক্ত আড্ডা মোড: যেকোনো প্রশ্ন বা গল্প করতে পারেন"
                : "Freestyle Mode: Ask any questions or chat freely"}
            </span>
          ) : (
            <span className="text-chip-bn text-muted-foreground font-sans">
              {locale === "bn"
                ? "টপিক মোড: নির্ধারিত বিষয়ে ফোকাসড প্র্যাকটিস ও সাজেশন"
                : "Topic Mode: Focused practice and targeted suggestions"}
            </span>
          )}
        </div>

        {/* Scenario Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar flex-wrap">
          {/* 1. Freestyle Pill (Primary / Default) */}
          <button
            type="button"
            onClick={() => startSession(FREESTYLE_SCENARIO)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-chip transition-all cursor-pointer whitespace-nowrap",
              selectedScenario.id === "freestyle"
                ? "bg-primary text-primary-foreground font-sans shadow-xs ring-2 ring-primary/20"
                : "bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
            )}
          >
            <HugeiconsIcon
              icon={SparklesIcon}
              size={14}
              className={selectedScenario.id === "freestyle" ? "text-primary-foreground" : "text-primary"}
            />
            <span>
              {locale === "bn" ? "✨ উন্মুক্ত আড্ডা" : "✨ Freestyle Talking"}
            </span>
          </button>

          <span className="text-muted-foreground/40 text-chip hidden sm:inline">|</span>

          {/* 2. 10 Curated Presets */}
          {PRESET_SCENARIOS.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            const scTitle = locale === "bn" ? sc.titleBn : sc.title;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => startSession(sc)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-chip transition-all cursor-pointer whitespace-nowrap",
                  isSelected
                    ? "bg-primary text-primary-foreground font-sans shadow-xs"
                    : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border"
                )}
              >
                <span>{scTitle}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-pill text-chip leading-tight uppercase font-mono",
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {sc.level}
                </span>
              </button>
            );
          })}

          {/* 3. Custom Scenarios */}
          {customScenarios.map((sc) => {
            const isSelected = selectedScenario.id === sc.id;
            return (
              <div
                key={sc.id}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-chip transition-all whitespace-nowrap",
                  isSelected
                    ? "bg-primary text-primary-foreground font-sans shadow-xs"
                    : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-border"
                )}
              >
                <button
                  type="button"
                  onClick={() => startSession(sc)}
                  className="cursor-pointer flex items-center gap-1.5"
                >
                  <span>{sc.title}</span>
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-pill text-chip leading-tight uppercase font-mono",
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    Custom
                  </span>
                </button>
                <button
                  type="button"
                  title={locale === "bn" ? "মুছে ফেলুন" : "Delete"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCustomScenario(sc.id);
                  }}
                  className={cn(
                    "p-0.5 rounded-full hover:bg-destructive/20 hover:text-destructive cursor-pointer transition-colors ml-0.5",
                    isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Voice Mode & Speed Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-panel bg-muted/40">
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
            <span className={locale === "bn" ? "text-bangla" : ""}>
              {voiceMode ? t("roleplay.voiceModeOn") : t("roleplay.voiceModeOff")}
            </span>
          </Button>

          <span className={cn("text-chip text-muted-foreground", locale === "bn" && "text-bangla")}>
            {voiceMode ? t("roleplay.voiceAutoSpeak") : t("roleplay.voiceTextOnly")}
          </span>
        </div>

        {/* Voice Speed Controls */}
        {voiceMode && (
          <div className="flex items-center gap-1.5">
            <span className="text-chip text-muted-foreground">{t("roleplay.speedLabel")}</span>
            {(["slow", "clear", "normal"] as VoiceSpeedSetting[]).map((spd) => {
              const isCur = voiceSpeed === spd;
              const spdLabel = spd === "slow"
                ? t("roleplay.speedSlow")
                : spd === "clear"
                ? t("roleplay.speedClear")
                : t("roleplay.speedNormal");
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
      <Card className="p-4 bg-muted/40 rounded-panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-pill bg-primary/10 text-primary">
            <HugeiconsIcon
              icon={selectedScenario.id === "freestyle" ? SparklesIcon : BotIcon}
              size={20}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-label text-foreground font-sans">
                {locale === "bn" ? selectedScenario.titleBn : selectedScenario.title}
              </span>
              <Tag variant="outline" size="sm">
                {selectedScenario.id === "freestyle"
                  ? locale === "bn"
                    ? "ওপেন চ্যাট"
                    : "Open Chat"
                  : `Level ${selectedScenario.level}`}
              </Tag>
            </div>
            <p className="text-meta text-muted-foreground mt-0.5">
              {locale === "bn" ? (
                <>
                  {t("roleplay.you")}: <strong className="text-foreground">{selectedScenario.learnerRoleBn}</strong> | {t("roleplay.partner")}:{" "}
                  <strong className="text-foreground">{selectedScenario.aiRoleBn}</strong> ({selectedScenario.contextBn})
                </>
              ) : (
                <>
                  {t("roleplay.you")}: <strong className="text-foreground">{selectedScenario.learnerRole}</strong> | {t("roleplay.partner")}:{" "}
                  <strong className="text-foreground">{selectedScenario.aiRole}</strong> ({selectedScenario.context})
                </>
              )}
            </p>
          </div>
        </div>

        {!feedback && messages.length > 2 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleEndSession}
            disabled={isLoading}
            className="rounded-control text-chip text-destructive hover:bg-destructive/10 border-destructive/30"
          >
            <span>{locale === "bn" ? "সেশন সমাপ্তি ও ফিডব্যাক" : "End Session & Get Feedback"}</span>
          </Button>
        )}
      </Card>

      {/* Main Conversation Stream */}
      <Card className="p-4 sm:p-6 bg-card rounded-card space-y-4 min-h-96 flex flex-col justify-between shadow-xs">
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
                  <div className="mt-1 p-2.5 rounded-panel bg-warning-bg text-meta text-bangla max-w-sm space-y-1 animate-in fade-in">
                    <div className="flex items-center gap-1.5 text-label text-foreground">
                      <HugeiconsIcon icon={SparklesIcon} size={14} className="text-warning shrink-0" />
                      <span>{locale === "bn" ? "সহজ পরামর্শ:" : "Friendly Tip:"}</span>
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
          <div className="flex items-center justify-between p-2.5 rounded-panel bg-primary/10 text-primary text-chip animate-in fade-in">
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
              <span className={locale === "bn" ? "text-bangla" : ""}>{t("roleplay.stop")}</span>
            </Button>
          </div>
        )}

        {/* Inline Mic Access Error Banner */}
        {micError && (
          <div className="flex items-center justify-between p-3 rounded-panel bg-destructive/10 text-destructive text-chip animate-in fade-in">
            <p className={locale === "bn" ? "text-bangla" : ""}>{micError}</p>
            <button
              type="button"
              onClick={() => setMicError(null)}
              className="text-chip text-destructive hover:underline cursor-pointer ml-2"
            >
              {t("roleplay.close")}
            </button>
          </div>
        )}

        {/* Inline Hint Banner */}
        {activeHint && !feedback && (
          <div className="p-3 rounded-panel bg-primary/10 flex items-center justify-between gap-2 text-chip animate-in fade-in">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={HelpCircleIcon} size={15} className="text-primary shrink-0" />
              <span className={cn("text-foreground", locale === "bn" && "text-bangla")}>{activeHint}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveHint(null)}
              className="text-muted-foreground hover:text-foreground text-chip cursor-pointer"
            >
              {t("roleplay.close")}
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
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-pill bg-muted/60 hover:bg-muted text-chip text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Session Turn Limit Notice per ECP_API_Contract §4.7 */}
            {messages.filter((m) => m.speaker === "learner").length >= 20 && (
              <div className="p-2.5 rounded-control bg-primary/10 text-chip text-primary flex items-center justify-between gap-2">
                <span>{t("roleplay.sessionLimitReached")}</span>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleEndSession}
                  disabled={isLoading}
                  loading={isLoading}
                  className="rounded-control text-chip shrink-0"
                >
                  Feedback
                </Button>
              </div>
            )}

            {/* Input Form with Voice Speech Integration */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <InputGroup className="flex-1 bg-card">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    messages.filter((m) => m.speaker === "learner").length >= 20
                      ? (locale === "bn" ? "সেশনের সীমা পূর্ণ হয়েছে..." : "Session turn limit reached...")
                      : isListening
                      ? (locale === "bn" ? "শুনছি... ইংরেজিতে বলুন..." : "Listening... Speak in English...")
                      : isLoading
                      ? (locale === "bn" ? "এআই ভাবছে..." : "AI is thinking...")
                      : (locale === "bn" ? "আপনার উত্তর লিখুন বা মুখে বলতে মাইকে চাপুন..." : "Type your response or tap mic to speak...")
                  }
                  disabled={isLoading || messages.filter((m) => m.speaker === "learner").length >= 20}
                  variant="ghost"
                  className="rounded-control text-label pr-24"
                />
                <InputGroupSuffix>
                  <Button
                    type="button"
                    variant={isListening ? "destructive" : "ghost"}
                    size="sm"
                    onClick={toggleSpeechRecognition}
                    disabled={isLoading || messages.filter((m) => m.speaker === "learner").length >= 20}
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
                    disabled={
                      !inputMessage.trim() ||
                      isLoading ||
                      messages.filter((m) => m.speaker === "learner").length >= 20
                    }
                    loading={isLoading}
                    className="rounded-control text-chip gap-1"
                  >
                    <HugeiconsIcon icon={SentIcon} size={14} />
                    <span>{locale === "bn" ? "পাঠান" : "Send"}</span>
                  </Button>
                </InputGroupSuffix>
              </InputGroup>
            </form>
          </div>
        ) : null}
      </Card>

      {/* Session Feedback Summary Modal/Card (Schema F1) */}
      {feedback && (
        <Card className="p-6 bg-card rounded-card space-y-5 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-border flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-pill bg-success-bg text-success">
                <HugeiconsIcon icon={Award01Icon} size={20} />
              </div>
              <div>
                <h3 className="text-card-title text-foreground">
                  {locale === "bn" ? "সেশন পর্যালোচনা" : "Session Feedback Summary"}
                </h3>
                <p className="text-meta-bn text-muted-foreground">
                  {locale === "bn" ? "আপনার কথোপকথনের মূল্যায়ন ও পরামর্শ" : "Evaluation and tips based on your conversation"}
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
          <div className="p-4 rounded-panel bg-muted/40 text-meta text-bangla leading-relaxed text-foreground">
            {feedback.summary}
          </div>

          {/* Session Dialogue Audio Replay (Milestone 3B) */}
          <div className="space-y-2 p-3.5 rounded-panel bg-muted/20">
            <FeedbackSectionHeader>
              {locale === "bn" ? "কথোপকথন অডিও রিভিশন" : "Dialogue Replay"}
            </FeedbackSectionHeader>
            <div className="space-y-1.5">
              {messages.map((turn, tIdx) => (
                <div
                  key={tIdx}
                  className="flex items-center justify-between p-2 rounded-control bg-card text-chip"
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
              {locale === "bn" ? "আপনার সবল দিকসমূহ" : "Strengths"}
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
                {locale === "bn" ? "উন্নয়নের জায়গা" : "Focus Areas"}
              </FeedbackSectionHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feedback.focus_areas.map((fa, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-3.5 rounded-panel bg-card space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <Tag variant="secondary" size="sm">
                        {fa.area}
                      </Tag>
                    </div>
                    <p className="text-chip text-muted-foreground font-sans">
                      {t("roleplay.learnerSentence")} &quot;<span className="text-foreground">{fa.example_from_learner}</span>&quot;
                    </p>
                    <p className={cn("text-chip text-muted-foreground", locale === "bn" && "text-bangla")}>
                      {t("roleplay.suggestion")} {fa.suggestion}
                    </p>
                    <p className="text-chip font-sans text-primary border-t border-border/50 pt-1">
                      {t("roleplay.alternative")} &quot;{fa.natural_alternative}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Step */}
          <div className="p-3.5 rounded-panel bg-primary/10 space-y-1 text-meta">
            <div className="flex items-center gap-1.5 text-label text-foreground">
              <HugeiconsIcon icon={Target01Icon} size={16} />
              <span>{locale === "bn" ? "পরবর্তী পদক্ষেপ:" : "Next Step:"}</span>
            </div>
            <p className={cn("text-foreground", locale === "bn" && "text-bangla")}>{feedback.next_step}</p>
          </div>

          {/* Limitations Disclaimer */}
          <p className={cn("text-chip text-muted-foreground border-t border-border pt-2 italic", locale === "bn" && "text-bangla")}>
            {feedback.limitations}
          </p>
        </Card>
      )}

      {/* Create Custom Topic Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("roleplay.createTopicTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("roleplay.createTopicDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Field>
              <FieldLabel htmlFor="custom-topic-title">
                {t("roleplay.topicTitleLabel")}
              </FieldLabel>
              <Input
                id="custom-topic-title"
                placeholder={t("roleplay.topicTitlePlaceholder")}
                value={createForm.title}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="custom-topic-context">
                {t("roleplay.contextLabel")}
              </FieldLabel>
              <Input
                id="custom-topic-context"
                placeholder={t("roleplay.contextPlaceholder")}
                value={createForm.context}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, context: e.target.value }))
                }
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="custom-ai-role">
                  {t("roleplay.aiRoleLabel")}
                </FieldLabel>
                <Input
                  id="custom-ai-role"
                  placeholder={t("roleplay.aiRolePlaceholder")}
                  value={createForm.aiRole}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, aiRole: e.target.value }))
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="custom-learner-role">
                  {t("roleplay.learnerRoleLabel")}
                </FieldLabel>
                <Input
                  id="custom-learner-role"
                  placeholder={t("roleplay.learnerRolePlaceholder")}
                  value={createForm.learnerRole}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, learnerRole: e.target.value }))
                  }
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>
                {t("roleplay.cefrLevelLabel")}
              </FieldLabel>
              <div className="flex items-center gap-2">
                {(["A1", "A2", "B1", "B2", "C1"] as const).map((lvl) => {
                  const isCur = createForm.level === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCreateForm((prev) => ({ ...prev, level: lvl }))}
                      className={cn(
                        "px-3 py-1 rounded-control text-chip font-mono cursor-pointer transition-colors",
                        isCur
                          ? "bg-primary text-primary-foreground font-sans shadow-xs"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateOpen(false)}
              className="rounded-control text-chip"
            >
              {t("roleplay.cancel")}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveCustomTopic}
              disabled={!createForm.title.trim()}
              className="rounded-control text-chip"
            >
              {t("roleplay.startTopic")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
