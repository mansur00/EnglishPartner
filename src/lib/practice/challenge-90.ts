import { z } from "zod";
import { callStructuredLlm } from "@/lib/ai/llm-client";

export const CHALLENGE_90_STORAGE_KEY = "ecp_spoken_challenge_90_v1";

export type ChallengeGoal = "everyday" | "workplace" | "travel" | "confidence";
export type ChallengeLevel = "beginner" | "intermediate" | "upper";
export type ChallengeDailyMinutes = 15 | 20 | 30;
export type QualitativeRating = "Needs practice" | "Getting better" | "Strong";

export interface ChallengePhaseInfo {
  phase: 1 | 2 | 3;
  dayRange: string;
  titleEn: string;
  titleBn: string;
  goalEn: string;
  goalBn: string;
  targetSpeakSeconds: string;
}

export const CHALLENGE_PHASES: ChallengePhaseInfo[] = [
  {
    phase: 1,
    dayRange: "Days 1–30",
    titleEn: "Phase 1: Start Speaking",
    titleBn: "ধাপ ১: কথা বলা শুরু (দিন ১–৩০)",
    goalEn: "Build the daily habit of producing simple, clear spoken English sentences.",
    goalBn: "জড়তা কাটিয়ে প্রতিদিন সহজ ও স্পষ্ট ইংরেজিতে কথা বলার অভ্যাস গড়ে তুলুন।",
    targetSpeakSeconds: "30–60 sec",
  },
  {
    phase: 2,
    dayRange: "Days 31–60",
    titleEn: "Phase 2: Speak Naturally",
    titleBn: "ধাপ ২: সাবলীলভাবে কথা বলা (দিন ৩১–৬০)",
    goalEn: "Build longer responses, ask follow-up questions, and handle real-life situations.",
    goalBn: "বড় বাক্যে উত্তর দেওয়া, পাল্টা প্রশ্ন করা এবং বাস্তব পরিস্থিতি সামলানো শিখুন।",
    targetSpeakSeconds: "1–2 min",
  },
  {
    phase: 3,
    dayRange: "Days 61–90",
    titleEn: "Phase 3: Speak Confidently",
    titleBn: "ধাপ ৩: আত্মবিশ্বাসের সাথে কথা বলা (দিন ৬১–৯০)",
    goalEn: "Handle spontaneous topics, express opinions clearly, and recover smoothly.",
    goalBn: "তাৎক্ষণিক বিষয়ে মতামত দেওয়া, যুক্তি বোঝানো ও আত্মবিশ্বাসের সাথে কথা বলা।",
    targetSpeakSeconds: "2–3 min",
  },
];

export interface ChallengeHistoryEntry {
  day: number;
  topic: string;
  rating: QualitativeRating;
  completedAt: string;
}

export interface Challenge90State {
  enrolled: boolean;
  currentDay: number;
  goal: ChallengeGoal;
  level: ChallengeLevel;
  dailyMinutes: ChallengeDailyMinutes;
  completedDays: number[];
  todayDayNumber: number;
  todayCompletedBlockIds: string[];
  history: ChallengeHistoryEntry[];
}

export const DEFAULT_CHALLENGE_90_STATE: Challenge90State = {
  enrolled: false,
  currentDay: 1,
  goal: "everyday",
  level: "beginner",
  dailyMinutes: 20,
  completedDays: [],
  todayDayNumber: 1,
  todayCompletedBlockIds: [],
  history: [],
};

export interface ChallengePlanBlock {
  id: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  durationMin: number;
  required: boolean;
  href: string;
  moduleLabel: string;
}

export function getPhaseForDay(day: number): ChallengePhaseInfo {
  if (day <= 30) return CHALLENGE_PHASES[0];
  if (day <= 60) return CHALLENGE_PHASES[1];
  return CHALLENGE_PHASES[2];
}

/**
 * Builds an adaptive, speaking-first daily plan for the current challenge day
 * reusing existing app modules (Vocabulary, Grammar Path, What Should I Say, AI Roleplay).
 */
export function buildChallengeDayPlan(state: Challenge90State): {
  phase: ChallengePhaseInfo;
  dailyObjectiveEn: string;
  dailyObjectiveBn: string;
  blocks: ChallengePlanBlock[];
} {
  const phase = getPhaseForDay(state.currentDay);
  const scale = state.dailyMinutes === 15 ? 0.75 : state.dailyMinutes === 30 ? 1.25 : 1;

  const objectiveByPhase = {
    1: {
      en: "Speak in clear simple sentences about everyday routines and requests.",
      bn: "দৈনন্দিন কাজ ও সাধারণ অনুরোধ নিয়ে সহজ ও স্পষ্ট বাক্যে কথা বলুন।",
    },
    2: {
      en: "Explain reasons, connect ideas, and ask natural follow-up questions.",
      bn: "কারণ ব্যাখ্যা করা, আইডিয়া যুক্ত করা এবং স্বাভাবিক পাল্টা প্রশ্ন করা অনুশীলন করুন।",
    },
    3: {
      en: "Respond spontaneously with clear examples and natural conversational flow.",
      bn: "প্রস্তুতি ছাড়াই উদাহরণসহ সাবলীল ও আত্মবিশ্বাসী উত্তর দিন।",
    },
  }[phase.phase];

  const blocks: ChallengePlanBlock[] = [
    {
      id: "vocab-context",
      titleEn: "Vocabulary in Context",
      titleBn: "বাক্যে শব্দের ব্যবহার (Speaking)",
      descEn: "Pick 2–3 saved phrases and say a sentence aloud with each.",
      descBn: "সেভ করা ২–৩টি শব্দ নিয়ে মুখস্থ না করে মুখে বাক্য তৈরি করুন।",
      durationMin: Math.max(3, Math.round(4 * scale)),
      required: false,
      href: "/vocabulary",
      moduleLabel: "Vocabulary",
    },
    {
      id: "speaking-grammar",
      titleEn: "Speaking-Focused Grammar",
      titleBn: "কথা বলার প্রয়োজনীয় গ্রামার",
      descEn: "Practice one spoken sentence pattern without written drills.",
      descBn: "লিখিত অনুশীলন নয়, কথা বলার একটি সহজ গঠন ঝালাই করুন।",
      durationMin: Math.max(3, Math.round(4 * scale)),
      required: false,
      href: state.currentDay <= 30 ? "/grammar-path/stage-2-core-engine" : "/grammar-path",
      moduleLabel: "Grammar Path",
    },
    {
      id: "quick-response",
      titleEn: "Quick Response Drill (What Should I Say?)",
      titleBn: "তাৎক্ষণিক উত্তর অনুশীলন",
      descEn: "Turn your Bangla/English thought into natural spoken English and say it aloud.",
      descBn: "মনের কথাটি স্বাভাবিক ইংরেজিতে রূপান্তর করে জোরে উচ্চারণ করুন।",
      durationMin: Math.max(3, Math.round(4 * scale)),
      required: true,
      href: "/what-should-i-say",
      moduleLabel: "What Should I Say?",
    },
    {
      id: "core-speaking",
      titleEn: "Today's Core Speaking Prompt & 5-Step Feedback",
      titleBn: "আজকের মূল স্পিকিং প্র্যাকটিস ও ফিডব্যাক",
      descEn: "Speak or type your answer above and retry using the AI coach feedback.",
      descBn: "উপরের স্পিকিং বক্সে উত্তর দিন এবং AI ফিডব্যাক দেখে আবার বলুন।",
      durationMin: Math.max(4, Math.round(5 * scale)),
      required: true,
      href: "#challenge-90",
      moduleLabel: "Inline Coach",
    },
    {
      id: "ai-roleplay",
      titleEn: "AI Partner Real-Life Roleplay",
      titleBn: "AI পার্টনারের সাথে বাস্তব কথোপকথন",
      descEn: "Have a multi-turn spoken conversation in a realistic scenario.",
      descBn: "বাস্তব পরিস্থিতিতে AI-এর সাথে কয়েক ধাপ কথা বলুন।",
      durationMin: Math.max(6, Math.round(9 * scale)),
      required: true,
      href: "/roleplay",
      moduleLabel: "AI Partner",
    },
  ];

  return {
    phase,
    dailyObjectiveEn: objectiveByPhase.en,
    dailyObjectiveBn: objectiveByPhase.bn,
    blocks,
  };
}

// ---------- AI Prompt & 5-Step Feedback Schemas ----------

export const ChallengePromptSchema = z.object({
  topic: z.string().min(1),
  promptEn: z.string().min(1),
  instructionBn: z.string().min(1),
  starterPhrase: z.string().min(1),
  targetVocab: z.array(z.string().min(1)).min(2).max(4),
  followUpQuestion: z.string().min(1),
  isFallback: z.boolean().optional(),
});

export type ChallengePrompt = z.infer<typeof ChallengePromptSchema>;

export const ChallengeFeedbackSchema = z.object({
  rating: z.enum(["Needs practice", "Getting better", "Strong"]).catch("Getting better"),
  communicated: z.string().min(1),
  betterVersion: z.string().min(1),
  keyCorrection: z.string().min(1),
  usefulExpression: z.string().min(1),
  speakAgainPrompt: z.string().min(1),
  isFallback: z.boolean().optional(),
});

export type ChallengeFeedback = z.infer<typeof ChallengeFeedbackSchema>;

export const ChallengeRoleplayReplySchema = z.object({
  aiReply: z.string().min(1),
  quickTipEn: z.string().min(1),
  isFallback: z.boolean().optional(),
});

export type ChallengeRoleplayReply = z.infer<typeof ChallengeRoleplayReplySchema>;

export const Challenge90RequestSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("generate-prompt"),
    day: z.number().int().min(1).max(90),
    goal: z.enum(["everyday", "workplace", "travel", "confidence"]),
    level: z.enum(["beginner", "intermediate", "upper"]),
    locale: z.enum(["bn", "en"]).default("bn"),
  }),
  z.object({
    action: z.literal("evaluate-response"),
    day: z.number().int().min(1).max(90),
    promptEn: z.string().trim().min(3).max(500),
    learnerResponse: z.string().trim().min(2).max(1500),
    level: z.enum(["beginner", "intermediate", "upper"]),
    locale: z.enum(["bn", "en"]).default("bn"),
  }),
  z.object({
    action: z.literal("roleplay-turn"),
    day: z.number().int().min(1).max(90),
    scenarioTitle: z.string().min(1),
    history: z
      .array(
        z.object({
          speaker: z.enum(["ai", "user"]),
          text: z.string(),
        })
      )
      .max(12),
    userMessage: z.string().trim().min(1).max(1000),
    level: z.enum(["beginner", "intermediate", "upper"]),
  }),
]);

export type Challenge90Request = z.infer<typeof Challenge90RequestSchema>;

export interface ChallengeDayLesson {
  vocabItems: { phrase: string; meaningEn: string; exampleEn: string }[];
  grammarPattern: {
    titleEn: string;
    formula: string;
    explanationEn: string;
    examples: string[];
  };
  quickDrills: {
    situationEn: string;
    sampleAnswer: string;
  }[];
  roleplay: {
    titleEn: string;
    partnerRole: string;
    openingLine: string;
  };
}

const PHASE_DAY_LESSONS: Record<1 | 2 | 3, ChallengeDayLesson[]> = {
  1: [
    {
      vocabItems: [
        {
          phrase: "wake up",
          meaningEn: "stop sleeping and open your eyes",
          exampleEn: "I usually wake up at 7 AM on weekdays.",
        },
        {
          phrase: "get ready",
          meaningEn: "prepare yourself to go out or start work",
          exampleEn: "It takes me twenty minutes to get ready for work.",
        },
        {
          phrase: "grab a bite",
          meaningEn: "eat something quick",
          exampleEn: "Let's grab a quick bite before the meeting starts.",
        },
      ],
      grammarPattern: {
        titleEn: "Present Simple for Daily Habits",
        formula: "Usually / Every day + Subject + Verb (base/s)",
        explanationEn: "Use Present Simple to talk naturally about things you do regularly.",
        examples: [
          "Usually, I drink a cup of tea before checking my phone.",
          "She takes the bus to the office every morning.",
        ],
      },
      quickDrills: [
        {
          situationEn: "Someone asks: 'What time do you usually start your day?'",
          sampleAnswer: "I usually start my day around 7:30 AM with a quick breakfast.",
        },
        {
          situationEn: "Ask a friend politely if they want to get coffee together.",
          sampleAnswer: "Hey, would you like to grab a coffee before class?",
        },
      ],
      roleplay: {
        titleEn: "Morning Catch-Up at a Café",
        partnerRole: "Friendly coworker",
        openingLine: "Good morning! You look fresh today. What time did you wake up?",
      },
    },
    {
      vocabItems: [
        {
          phrase: "could I have",
          meaningEn: "a polite way to order or ask for something",
          exampleEn: "Hi, could I have an iced coffee, please?",
        },
        {
          phrase: "for here or to go",
          meaningEn: "eating inside the shop or taking it away",
          exampleEn: "I'd like it to go, please, since I'm in a hurry.",
        },
        {
          phrase: "keep the change",
          meaningEn: "let the server keep the extra small money",
          exampleEn: "Here is 500 taka—please keep the change.",
        },
      ],
      grammarPattern: {
        titleEn: "Polite Requests with 'Could I...' / 'Would you mind...'",
        formula: "Could I + verb ... please?",
        explanationEn: "Use 'Could I' instead of 'Give me' so your spoken English sounds warm and polite.",
        examples: [
          "Could I get a glass of water, please?",
          "Could you speak a little more slowly, please?",
        ],
      },
      quickDrills: [
        {
          situationEn: "You are at a restaurant and want the bill.",
          sampleAnswer: "Excuse me, could we have the bill whenever you're ready?",
        },
        {
          situationEn: "Ask a shopkeeper if they have a smaller size.",
          sampleAnswer: "Excuse me, do you have this shirt in a medium size?",
        },
      ],
      roleplay: {
        titleEn: "Ordering at a Coffee Shop",
        partnerRole: "Café Barista",
        openingLine: "Welcome in! What can I get started for you today?",
      },
    },
  ],
  2: [
    {
      vocabItems: [
        {
          phrase: "looking forward to",
          meaningEn: "feeling excited about something in the future",
          exampleEn: "I'm really looking forward to the weekend trip.",
        },
        {
          phrase: "catch up with",
          meaningEn: "meet and talk about recent news",
          exampleEn: "I'm planning to catch up with an old friend on Friday.",
        },
        {
          phrase: "depends on",
          meaningEn: "decided by another situation",
          exampleEn: "We might go out, but it depends on the weather.",
        },
      ],
      grammarPattern: {
        titleEn: "Talking About Future Plans ('planning to' / 'going to')",
        formula: "I'm planning to + verb ... because ...",
        explanationEn: "Add 'because...' right after your plan to sound natural and complete.",
        examples: [
          "I'm planning to visit my family this Friday because we haven't met in weeks.",
          "I'm going to start a new book tonight.",
        ],
      },
      quickDrills: [
        {
          situationEn: "A friend asks: 'Any fun plans for the weekend?'",
          sampleAnswer: "I'm planning to relax at home and catch up with some friends.",
        },
        {
          situationEn: "Invite someone and give a reason.",
          sampleAnswer: "Would you like to join us for dinner? We're trying a new place.",
        },
      ],
      roleplay: {
        titleEn: "Making Weekend Plans",
        partnerRole: "Close friend",
        openingLine: "Hey! It's almost the weekend. Are you doing anything fun?",
      },
    },
  ],
  3: [
    {
      vocabItems: [
        {
          phrase: "to be honest",
          meaningEn: "used to share your real opinion politely",
          exampleEn: "To be honest, I work much better early in the morning.",
        },
        {
          phrase: "for instance",
          meaningEn: "for example (natural in conversation)",
          exampleEn: "For instance, when I start early, I finish my tasks by noon.",
        },
        {
          phrase: "get back to you",
          meaningEn: "reply later after checking details",
          exampleEn: "Let me double-check that and get back to you this afternoon.",
        },
      ],
      grammarPattern: {
        titleEn: "Giving Opinions with Clear Reasons",
        formula: "Personally, I prefer X because... / First of all...",
        explanationEn: "Structure spoken opinions into 2 quick points so listeners follow easily.",
        examples: [
          "Personally, I prefer remote work because it saves two hours of traffic.",
          "On the other hand, meeting in person is great for brainstorming.",
        ],
      },
      quickDrills: [
        {
          situationEn: "A client asks a question you don't know the exact answer to yet.",
          sampleAnswer: "That's a great question—let me double-check and get back to you today.",
        },
        {
          situationEn: "Share your view on morning vs. night study/work.",
          sampleAnswer: "Personally, I prefer mornings because my mind feels much fresher.",
        },
      ],
      roleplay: {
        titleEn: "Quick Team Sync at Work",
        partnerRole: "Team Lead",
        openingLine: "Thanks for joining! How is the project going, and do you need any support?",
      },
    },
  ],
};

export function getChallengeDayLesson(day: number): ChallengeDayLesson {
  const phase = getPhaseForDay(day).phase;
  const list = PHASE_DAY_LESSONS[phase];
  return list[(day - 1) % list.length];
}

const FALLBACK_PROMPTS_BY_PHASE: Record<1 | 2 | 3, ChallengePrompt[]> = {
  1: [
    {
      topic: "Daily Morning Routine",
      promptEn: "Tell me what you usually do in the morning before work or study.",
      instructionBn: "সকালে ঘুম থেকে উঠে কাজ বা পড়াশোনার আগে আপনি কী কী করেন তা ৩–৪টি সহজ ইংরেজি বাক্যে বলুন।",
      starterPhrase: "Usually, I wake up around... and then I...",
      targetVocab: ["wake up", "get ready", "usually"],
      followUpQuestion: "What is the first thing you do when you get home in the evening?",
      isFallback: true,
    },
    {
      topic: "Ordering Food or Coffee",
      promptEn: "Imagine you are at a café. Order a drink and ask one polite question about the menu.",
      instructionBn: "একটি ক্যাফেতে খাবার বা কফি অর্ডার করছেন—এভাবে ভদ্রভাবে অর্ডার দিন ও মেনু নিয়ে একটি প্রশ্ন করুন।",
      starterPhrase: "Hi, could I please have... Also, does it come with...?",
      targetVocab: ["could I have", "for here", "recommendation"],
      followUpQuestion: "How would you ask for the bill politely?",
      isFallback: true,
    },
  ],
  2: [
    {
      topic: "Explaining a Weekend Plan",
      promptEn: "What are your plans for this weekend, and why are you looking forward to it?",
      instructionBn: "এই উইকএন্ডে আপনার পরিকল্পনা কী এবং কেন আপনি এটি নিয়ে আগ্রহী—কারণসহ ১–২ মিনিট বলুন।",
      starterPhrase: "This weekend, I'm planning to... because...",
      targetVocab: ["looking forward to", "planning to", "relax"],
      followUpQuestion: "Who are you going with, and what if the weather changes?",
      isFallback: true,
    },
    {
      topic: "Solving a Everyday Problem",
      promptEn: "Describe a small problem you had recently (like a late delivery or missed bus) and how you handled it.",
      instructionBn: "সম্প্রতি হওয়া কোনো ছোট সমস্যা (যেমন দেরিতে ডেলিভারি বা বাস মিস করা) কীভাবে সমাধান করেছেন তা বলুন।",
      starterPhrase: "A few days ago, I had a small issue with... So I decided to...",
      targetVocab: ["had an issue", "decided to", "in the end"],
      followUpQuestion: "What would you do differently next time?",
      isFallback: true,
    },
  ],
  3: [
    {
      topic: "Sharing an Opinion Clearly",
      promptEn: "Do you prefer working or studying in the morning or late at night? Give two clear reasons.",
      instructionBn: "সকালে নাকি রাতে কাজ/পড়াশোনা করতে আপনার ভালো লাগে? দুটি স্পষ্ট কারণ ও উদাহরণসহ বলুন।",
      starterPhrase: "Personally, I prefer... for two main reasons. First of all...",
      targetVocab: ["personally", "for instance", "on the other hand"],
      followUpQuestion: "How do you stay focused when you feel tired?",
      isFallback: true,
    },
    {
      topic: "Handling an Unexpected Question",
      promptEn: "If a colleague or client asks you something you don't know yet, how do you reply professionally?",
      instructionBn: "কোনো সহকর্মী বা ক্লায়েন্ট এমন কিছু জিজ্ঞাসা করলে যা আপনি এখনো জানেন না, কীভাবে পেশাদারভাবে উত্তর দেবেন?",
      starterPhrase: "That's a great question. I don't have the exact details right now, but I'll...",
      targetVocab: ["get back to you", "double-check", "as soon as possible"],
      followUpQuestion: "Can you rephrase that in a slightly more casual way for a friend?",
      isFallback: true,
    },
  ],
};

export function getFallbackChallengePrompt(day: number): ChallengePrompt {
  const phase = getPhaseForDay(day).phase;
  const list = FALLBACK_PROMPTS_BY_PHASE[phase];
  return list[(day - 1) % list.length];
}

export function getFallbackChallengeFeedback(
  learnerResponse: string,
  locale: "bn" | "en"
): ChallengeFeedback {
  const trimmed = learnerResponse.trim();
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  const rating: QualitativeRating =
    wordCount >= 18 ? "Strong" : wordCount >= 8 ? "Getting better" : "Needs practice";

  return {
    rating,
    communicated:
      locale === "bn"
        ? "আপনি আপনার মূল বক্তব্যটি স্পষ্টভাবে প্রকাশ করার চেষ্টা করেছেন—এটি খুব ভালো শুরু!"
        : "You clearly shared your main idea—great effort speaking directly!",
    betterVersion:
      wordCount < 6
        ? `${trimmed}. I usually do this every day because it helps me stay organized.`
        : trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
    keyCorrection:
      locale === "bn"
        ? "বাক্যটি আরও স্বাভাবিক করতে একটি সময় বা কারণ যোগ করুন (যেমন: 'usually', 'because...')।"
        : "Try adding one detail about time or reason (e.g., 'usually', 'because...') to sound more natural.",
    usefulExpression: "To be honest, I usually...",
    speakAgainPrompt: "Now say your improved version aloud one more time!",
    isFallback: true,
  };
}

export async function runChallengeSpeakingActionAsync(
  req: Challenge90Request
): Promise<ChallengePrompt | ChallengeFeedback | ChallengeRoleplayReply> {
  if (req.action === "roleplay-turn") {
    const historyText = req.history
      .slice(-6)
      .map((m) => `${m.speaker === "ai" ? "Partner" : "Learner"}: ${m.text}`)
      .join("\n");

    const res = await callStructuredLlm({
      taskName: "roleplayTurn",
      systemPrompt: `You are a friendly English conversation partner in a short everyday roleplay: "${req.scenarioTitle}".
Learner level: ${req.level}.
Reply naturally in 1–2 short spoken sentences and ask a simple follow-up question to keep the conversation going.
Also provide one short helpful tip (quickTipEn) if needed.
Return JSON matching the schema strictly.`,
      userPrompt: `Conversation so far:\n${historyText}\nLearner just said: "${req.userMessage}"`,
      schema: ChallengeRoleplayReplySchema,
      temperature: 0.6,
      maxTokens: 300,
    });

    if (res.success && res.data) {
      return { ...res.data, isFallback: false };
    }
    return {
      aiReply: "That sounds great! Tell me a little more—what do you usually do next?",
      quickTipEn: "Great response! Try adding one extra detail to keep the conversation flowing.",
      isFallback: true,
    };
  }

  if (req.action === "generate-prompt") {
    const phase = getPhaseForDay(req.day);
    const systemPrompt = `You are a practical spoken-English coach for Bangladeshi learners.
Generate a realistic everyday speaking prompt for Day ${req.day} of 90 (${phase.titleEn}).
Learner goal: ${req.goal}. Level: ${req.level}.
STRICT RULES:
- Practical everyday or workplace spoken English ONLY.
- NO IELTS/TOEFL prompts, NO academic essays, NO spelling drills.
- Keep instructions short and encouraging.
Return JSON matching the schema strictly.`;

    const res = await callStructuredLlm({
      taskName: "grammarCheck",
      systemPrompt,
      userPrompt: `Create today's speaking prompt for Day ${req.day} (locale=${req.locale}).`,
      schema: ChallengePromptSchema,
      temperature: 0.6,
      maxTokens: 600,
    });

    if (res.success && res.data) {
      return { ...res.data, isFallback: false };
    }
    return getFallbackChallengePrompt(req.day);
  }

  // action === "evaluate-response"
  const systemPrompt = `You are a supportive spoken-English coach.
Evaluate the learner's spoken/typed response to the prompt: "${req.promptEn}".
Learner level: ${req.level}. Output language for explanations: ${req.locale === "bn" ? "Bangla (with English examples)" : "Simple English"}.
Follow the 5-step feedback structure strictly:
1. rating: "Needs practice" | "Getting better" | "Strong" (never invent numeric pronunciation scores from text)
2. communicated: Briefly acknowledge what the learner meant.
3. betterVersion: A natural, contemporary spoken English version of their response.
4. keyCorrection: Explain ONLY the 1–2 most useful improvements with simple examples (do not overwhelm).
5. usefulExpression: One reusable everyday phrase they can use again.
6. speakAgainPrompt: A short encouraging prompt asking them to say it again or answer a quick follow-up.
Return JSON matching the schema strictly.`;

  const res = await callStructuredLlm({
    taskName: "grammarCheck",
    systemPrompt,
    userPrompt: `Learner response: "${req.learnerResponse}"`,
    schema: ChallengeFeedbackSchema,
    temperature: 0.4,
    maxTokens: 700,
  });

  if (res.success && res.data) {
    return { ...res.data, isFallback: false };
  }
  return getFallbackChallengeFeedback(req.learnerResponse, req.locale);
}
