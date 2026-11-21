/**
 * Intent Resolution Engine for "What Should I Say?" (Milestone 2C)
 * Complies with Brief §10.1, ECP_AI_Prompt_Spec.md §3.4, and ECP_API_Contract.md §4.7.
 * Zero Gemini/LLM dependency in product code (AUD-A11 compliant).
 */

import type {
  SayItOption,
  SayItRequest,
  SayItResponse,
} from "./say-it-schema.ts";
import {
  SayItRequestSchema,
  SayItResponseSchema,
} from "./say-it-schema.ts";

interface IntentRule {
  id: string;
  match: RegExp;
  understoodEn: string;
  understoodBn: string;
  options: {
    polite: { english: string; translation: string; placeholders?: string[] };
    neutral?: { english: string; translation: string; placeholders?: string[] };
    casual: { english: string; translation: string; placeholders?: string[] };
  };
  usefulPhrases: { phrase: string; meaning: string }[];
}

const INTENT_RULES: IntentRule[] = [
  // 1. DEADLINE EXTENSION (Brief §10.1 canonical example)
  {
    id: "deadline-extension",
    match: /(deadline|more days|extra time|extend|finish the task|late submission|সময় লাগবে|দেরি হবে|সময় বাড়ানো|দুই দিন|2 days)/i,
    understoodEn: "You want to request extra time or a deadline extension for a task.",
    understoodBn: "আপনি একটি কাজের জন্য অতিরিক্ত সময় বা ডেডলাইন বাড়ানোর অনুরোধ করতে চান।",
    options: {
      polite: {
        english: "Could I please request a brief extension until [date]? I want to ensure the final deliverable meets our quality standards.",
        translation: "আমি কি [date] পর্যন্ত সামান্য অতিরিক্ত সময় পেতে পারি? আমি নিশ্চিত করতে চাই যে কাজটি সর্বোচ্চ মানসম্পন্ন হবে।",
        placeholders: ["[date]"],
      },
      neutral: {
        english: "I might need a few more days to wrap this up properly. Would it be possible to submit it by [date]?",
        translation: "কাজটি সঠিকভাবে শেষ করতে আমার আরও কয়েক দিন লাগতে পারে। আমি কি [date]-এর মধ্যে জমা দিতে পারি?",
        placeholders: ["[date]"],
      },
      casual: {
        english: "Hey, I'm running a bit behind on this. Can I get another [number of days] to finish it up?",
        translation: "শুনুন, এটার কাজ একটু পিছিয়ে পড়েছে। আমি কি শেষ করার জন্য আরও [number of days] পেতে পারি?",
        placeholders: ["[number of days]"],
      },
    },
    usefulPhrases: [
      { phrase: "request an extension", meaning: "সময় বাড়ানোর অনুরোধ করা" },
      { phrase: "run behind schedule", meaning: "নির্ধারিত সময়ের চেয়ে পিছিয়ে পড়া" },
      { phrase: "wrap this up", meaning: "কাজটি সম্পন্ন বা গুটিয়ে আনা" },
    ],
  },

  // 2. DISCOUNT & PRICE NEGOTIATION
  {
    id: "discount-negotiation",
    match: /(discount|cheaper|lower price|reduce|best price|কম রাখা|ছাড়|দাম কমানো|কমে দেওয়া)/i,
    understoodEn: "You want to politely ask if a discount or better price is available.",
    understoodBn: "আপনি কোনো পণ্যের ওপর ছাড় বা দাম কমানোর সুযোগ আছে কি না তা জানতে চান।",
    options: {
      polite: {
        english: "Is there any flexibility on the price, or perhaps a special offer available today?",
        translation: "দামটিতে কি কিছুটা ছাড় দেওয়ার সুযোগ আছে, অথবা আজ কি কোনো বিশেষ অফার চলছে?",
      },
      neutral: {
        english: "Could you offer a small discount if I purchase this right now?",
        translation: "আমি যদি এখনই এটি ক্রয় করি, তবে কি কিছুটা ছাড় দেওয়া সম্ভব?",
      },
      casual: {
        english: "Is this your best price, or can you do a little better?",
        translation: "এটাই কি আপনার শেষ দাম, নাকি আরেকটু কমিয়ে রাখা যাবে?",
      },
    },
    usefulPhrases: [
      { phrase: "flexibility on the price", meaning: "দামে ছাড় দেওয়ার অবকাশ" },
      { phrase: "best price", meaning: "সর্বনিম্ন বা শেষ দাম" },
      { phrase: "special promotion", meaning: "বিশেষ অফার বা ছাড়" },
    ],
  },

  // 3. RUNNING LATE / APOLOGIZING FOR DELAY
  {
    id: "running-late",
    match: /(running late|stuck in traffic|delayed|late for meeting|reach late|দেরি হচ্ছে|দেরিতে আসব|ট্রাফিকে আটকেছি)/i,
    understoodEn: "You want to inform someone that you are running late and provide an estimated arrival time.",
    understoodBn: "আপনি জানাতে চান যে আপনার কিছুটা দেরি হচ্ছে এবং সম্ভাব্য পৌঁছানোর সময় উল্লেখ করতে চান।",
    options: {
      polite: {
        english: "My apologies, but I am running approximately [number] minutes late due to unexpected delays. I will be there as soon as possible.",
        translation: "দুঃখ প্রকাশ করছি, অনাকাঙ্ক্ষিত দেরির কারণে আমার প্রায় [number] মিনিট দেরি হচ্ছে। আমি যত দ্রুত সম্ভব পৌঁছে যাচ্ছি।",
        placeholders: ["[number]"],
      },
      neutral: {
        english: "I am stuck in traffic right now, so I will likely arrive around [time]. Thank you for your patience.",
        translation: "আমি এই মুহূর্তে ট্রাফিকে আটকে আছি, তাই সম্ভবত [time]-এর দিকে পৌঁছাব। আপনার ধৈর্যের জন্য ধন্যবাদ।",
        placeholders: ["[time]"],
      },
      casual: {
        english: "Hey, running about [number] minutes behind! Be there shortly, so sorry!",
        translation: "শুনুন, আমার প্রায় [number] মিনিট দেরি হচ্ছে! খুব শীঘ্রই চলে আসছি, সত্যিই দুঃখিত!",
        placeholders: ["[number]"],
      },
    },
    usefulPhrases: [
      { phrase: "running late / running behind", meaning: "দেরি হওয়া" },
      { phrase: "stuck in traffic", meaning: "যানজটে আটকা পড়া" },
      { phrase: "thank you for your patience", meaning: "আপনার ধৈর্যের জন্য ধন্যবাদ" },
    ],
  },

  // 4. RESCHEDULING A MEETING
  {
    id: "reschedule-meeting",
    match: /(reschedule|postpone|change time|another time|move the meeting|অন্য সময়|মিটিং পেছানো|দিন পরিবর্তন)/i,
    understoodEn: "You want to request rescheduling an existing appointment or meeting to another date.",
    understoodBn: "আপনি কোনো পূর্বনির্ধারিত মিটিং বা অ্যাপয়েন্টমেন্ট অন্য তারিখে বা সময়ে স্থানান্তরের অনুরোধ করতে চান।",
    options: {
      polite: {
        english: "Due to an unavoidable scheduling conflict, would it be possible to reschedule our meeting to [new date/time]?",
        translation: "একটি অনিবার্য ব্যস্ততার কারণে, আমাদের মিটিংটি কি [new date/time]-এ পুনর্নির্ধারণ করা সম্ভব?",
        placeholders: ["[new date/time]"],
      },
      neutral: {
        english: "Something urgent came up on my end. Could we push our discussion to [new date/time] instead?",
        translation: "আমার একটি জরুরি কাজ এসে পড়েছে। আমরা কি আমাদের আলোচনাটি [new date/time]-এ পিছিয়ে দিতে পারি?",
        placeholders: ["[new date/time]"],
      },
      casual: {
        english: "Can we move our chat to another time? How does [day/time] work for you?",
        translation: "আমরা কি আমাদের কথাবার্তা অন্য সময়ে সরিয়ে নিতে পারি? আপনার জন্য [day/time] কেমন হয়?",
        placeholders: ["[day/time]"],
      },
    },
    usefulPhrases: [
      { phrase: "scheduling conflict", meaning: "সময়ের অমিল বা সংঘাত" },
      { phrase: "push back / move", meaning: "পিছিয়ে দেওয়া" },
      { phrase: "how does ... work for you?", meaning: "... সময়টি আপনার সুবিধাজনক কি?" },
    ],
  },

  // 5. ASKING FOR REPETITION / CLARIFICATION
  {
    id: "ask-repeat-clarify",
    match: /(repeat|speak slower|didn't understand|pardon|come again|বুঝতে পারিনি|আরেকবার বলুন|ধীরে বলুন)/i,
    understoodEn: "You want the speaker to repeat what they said or speak a little more slowly.",
    understoodBn: "আপনি বক্তাকে কথাটি আরেকবার বলতে বা কিছুটা ধীরে কথা বলতে অনুরোধ করতে চান।",
    options: {
      polite: {
        english: "Could you please repeat that last point a little more slowly? I want to make sure I followed correctly.",
        translation: "আপনি কি শেষের কথাটি আরেকটু ধীরে повтоর করতে পারেন? আমি নিশ্চিত হতে চাই যে ঠিকমতো বুঝতে পেরেছি।",
      },
      neutral: {
        english: "Sorry, I didn't quite catch that. Could you say that once more, please?",
        translation: "দুঃখিত, আমি কথাটি পুরোপুরি ধরতে পারিনি। অনুগ্রহ করে আরেকবার বলবেন কি?",
      },
      casual: {
        english: "Say that again? It was a bit too fast for me!",
        translation: "আরেকবার বলবেন? আমার জন্য একটু বেশি দ্রুত হয়ে গিয়েছিল!",
      },
    },
    usefulPhrases: [
      { phrase: "didn't quite catch that", meaning: "কথাটি পুরোপুরি শুনতে বা বুঝতে পারিনি" },
      { phrase: "speak a bit slower", meaning: "একটু ধীরে কথা বলা" },
      { phrase: "follow along", meaning: "কথা বা বিষয়বস্তু বুঝে এগিয়ে চলা" },
    ],
  },

  // 6. ORDERING FOOD & DIETARY PREFERENCES
  {
    id: "food-dietary",
    match: /(order food|vegetarian|spicy|without onion|menu|বিল|খাবার অর্ডার|ঝাল ছাড়া|নিরামিষ)/i,
    understoodEn: "You want to place an order or specify a dietary preference at a restaurant.",
    understoodBn: "আপনি রেস্তোরাঁয় খাবার অর্ডার করতে বা খাবারের নির্দিষ্ট পছন্দের কথা জানাতে চান।",
    options: {
      polite: {
        english: "I would like to order [item], please. Could you also ensure that it is prepared without [ingredient]?",
        translation: "আমি [item] অর্ডার করতে চাই। এটি কি [ingredient] ছাড়া তৈরি করা সম্ভব?",
        placeholders: ["[item]", "[ingredient]"],
      },
      neutral: {
        english: "Could I get the [item], please? Also, could you make it mild and not too spicy?",
        translation: "আমি কি [item] পেতে পারি? এবং এটি যেন খুব বেশি ঝাল না হয় তা খেয়াল রাখবেন?",
        placeholders: ["[item]"],
      },
      casual: {
        english: "I'll go with the [item], please. Can you go easy on the spice?",
        translation: "আমি [item] নিচ্ছি। ঝালটা একটু কম দেওয়া যাবে কি?",
        placeholders: ["[item]"],
      },
    },
    usefulPhrases: [
      { phrase: "go easy on...", meaning: "কোনো উপাদান কম পরিমাণে দেওয়া" },
      { phrase: "dietary restrictions", meaning: "খাবারের বিধিনিষেধ বা পরহেজ" },
      { phrase: "I would like to order...", meaning: "আমি ... অর্ডার করতে চাই" },
    ],
  },
];

/**
 * Resolves a learner's raw intent into natural English expressions.
 * Strictly adheres to Schema S1 and prevents invented commitments.
 */
export function resolveSayItIntent(rawRequest: SayItRequest): SayItResponse {
  const request = SayItRequestSchema.parse(rawRequest);
  const trimmed = request.intent.trim();

  // If intent is blank or too short to have clear semantic meaning
  if (trimmed.length < 3) {
    return {
      understood_intent: "The provided message is too brief to identify a specific conversation goal.",
      options: [],
      useful_phrases: [],
      clarifying_question: "Could you describe in a few words who you want to talk to and what your goal is?",
    };
  }

  // Find matching rule
  const matchedRule = INTENT_RULES.find((rule) => rule.match.test(trimmed));

  if (matchedRule) {
    const rawOptions: SayItOption[] = [
      {
        tone: "polite_professional",
        english: matchedRule.options.polite.english,
        translation: matchedRule.options.polite.translation,
        placeholders: matchedRule.options.polite.placeholders || [],
      },
    ];

    if (matchedRule.options.neutral) {
      rawOptions.push({
        tone: "neutral",
        english: matchedRule.options.neutral.english,
        translation: matchedRule.options.neutral.translation,
        placeholders: matchedRule.options.neutral.placeholders || [],
      });
    }

    rawOptions.push({
      tone: "casual",
      english: matchedRule.options.casual.english,
      translation: matchedRule.options.casual.translation,
      placeholders: matchedRule.options.casual.placeholders || [],
    });

    return SayItResponseSchema.parse({
      understood_intent: matchedRule.understoodBn,
      options: rawOptions,
      useful_phrases: matchedRule.usefulPhrases.slice(0, 5),
      clarifying_question: null,
    });
  }

  // General fallback for unindexed intents preserving user's words with zero invented commitments
  return SayItResponseSchema.parse({
    understood_intent: `আপনি যে বিষয়টি প্রকাশ করতে চান: "${trimmed}"`,
    options: [
      {
        tone: "polite_professional",
        english: `Excuse me, I would like to communicate regarding [topic]. Could you please assist me?`,
        translation: "মাফ করবেন, আমি [topic] বিষয়ে কথা বলতে চাই। আপনি কি আমাকে সাহায্য করবেন?",
        placeholders: ["[topic]"],
      },
      {
        tone: "neutral",
        english: `I wanted to mention that [state intent clearly]. Could we discuss this?`,
        translation: "আমি জানাতে চেয়েছিলাম যে [state intent clearly]। আমরা কি এ নিয়ে কথা বলতে পারি?",
        placeholders: ["[state intent clearly]"],
      },
      {
        tone: "casual",
        english: `Just wanted to check with you about [topic] whenever you have a moment!`,
        translation: "আপনার সময় হলে [topic] নিয়ে একটু কথা বলতে চেয়েছিলাম!",
        placeholders: ["[topic]"],
      },
    ],
    useful_phrases: [
      { phrase: "I would like to discuss...", meaning: "আমি ... আলোচনা করতে চাই" },
      { phrase: "whenever you have a moment", meaning: "যখন আপনার একটু সময় হবে" },
    ],
    clarifying_question: null,
  });
}
