/**
 * Deterministic In-Role Roleplay Engine (Milestone 2D)
 * Complies with ECP_AI_Prompt_Spec.md §3.5 (Schema R1) & §3.6 (Schema F1),
 * Brief §9, Brief §20, and AUD-A11 (zero Gemini in product code).
 */

import type {
  RoleplayTurnRequestInput,
  RoleplayTurnResponse,
  RoleplayCorrection,
  RoleplayFeedbackRequestInput,
  RoleplayFeedbackResponse,
  FocusArea,
} from "./roleplay-schema.ts";
import {
  RoleplayTurnRequestSchema,
  RoleplayTurnResponseSchema,
  RoleplayFeedbackRequestSchema,
  RoleplayFeedbackResponseSchema,
} from "./roleplay-schema.ts";

// Common ESL / Bengali-English mistakes for targeted single-correction rule
interface CorrectionRule {
  pattern: RegExp;
  extractOriginal: (text: string) => string | null;
  improved: string;
  reasonBn: string;
  area: "grammar" | "vocabulary" | "sentence_formation" | "naturalness";
}

const COMMON_CORRECTION_RULES: CorrectionRule[] = [
  {
    pattern: /\b(i am agree|i'm agree)\b/i,
    extractOriginal: (text) => {
      const m = text.match(/\b(i am agree|i'm agree)\b/i);
      return m ? m[0] : null;
    },
    improved: "I agree",
    reasonBn: "ইংরেজি 'agree' নিজেই একটি verb, তাই 'am' ব্যবহার করতে হয় না।",
    area: "grammar",
  },
  {
    pattern: /\bhow much price\b/i,
    extractOriginal: (text) => {
      const m = text.match(/\bhow much price\b/i);
      return m ? m[0] : null;
    },
    improved: "How much is it?",
    reasonBn: "দাম জানতে 'How much price' না বলে 'How much is it?' বা 'What is the price?' বলা বেশি স্বাভাবিক।",
    area: "naturalness",
  },
  {
    pattern: /\b(he don't|she don't|it don't)\b/i,
    extractOriginal: (text) => {
      const m = text.match(/\b(he don't|she don't|it don't)\b/i);
      return m ? m[0] : null;
    },
    improved: "doesn't",
    reasonBn: "Third person singular-এর সাথে 'doesn't' ব্যবহৃত হয়।",
    area: "grammar",
  },
  {
    pattern: /\bgive me discount\b/i,
    extractOriginal: (text) => {
      const m = text.match(/\bgive me discount\b/i);
      return m ? m[0] : null;
    },
    improved: "Could you offer a discount?",
    reasonBn: "সরাসরি 'give me discount' না বলে 'Could you offer a discount?' বললে অনুরোধটি মার্জিত শোনায়।",
    area: "naturalness",
  },
  {
    pattern: /\bi want buy\b/i,
    extractOriginal: (text) => {
      const m = text.match(/\bi want buy\b/i);
      return m ? m[0] : null;
    },
    improved: "I want to buy",
    reasonBn: "'want'-এর পর মূল verb বসাতে infinitive 'to' (want to buy) যুক্ত করতে হয়।",
    area: "sentence_formation",
  },
  {
    pattern: /\bno problem for me\b/i,
    extractOriginal: (text) => {
      const m = text.match(/\bno problem for me\b/i);
      return m ? m[0] : null;
    },
    improved: "That works for me",
    reasonBn: "সম্মতি জানাতে 'That works for me' বা 'No problem at all' অধিকতর প্রফেশনাল।",
    area: "naturalness",
  },
];

// In-character reply templates organized by scenario theme & topic
interface ScenarioDialogueRule {
  themeMatcher: RegExp;
  responses: {
    greeting: string;
    pricing: string;
    bargain: string;
    checkout: string;
    hesitation: string;
    fallback: string;
    hint: string;
  };
}

const SCENARIO_RULES: ScenarioDialogueRule[] = [
  {
    // Shopping & Money
    themeMatcher: /(shop|money|buy|store|price|bag|taka|discount|card|cash)/i,
    responses: {
      greeting: "Hello! Welcome to our store. Are you looking for anything specific today?",
      pricing: "That item is 800 taka. It is made of high quality cotton.",
      bargain: "Well, since you like it, I can offer a 10% discount if you take it now. Does that sound fair?",
      checkout: "Certainly! You can pay by cash or tap your card right here.",
      hesitation: "Take your time! Let me know if you would like to see a different color or size.",
      fallback: "That sounds good. Would you like me to wrap this up for you?",
      hint: "Try asking: 'Can you show me a different color?' or 'Can I pay by card?'",
    },
  },
  {
    // Food & Dining / Cafe
    themeMatcher: /(food|cafe|coffee|restaurant|order|menu|drink|eat|table)/i,
    responses: {
      greeting: "Hi there! Welcome to our cafe. Can I get you something hot to drink or to eat?",
      pricing: "A medium cappuccino is 250 taka, and our fresh pastry is 180 taka.",
      bargain: "We have a combo offer today: coffee and a croissant for 350 taka!",
      checkout: "Your total comes to 350 taka. Will that be cash or card today?",
      hesitation: "No rush at all! Our signature iced latte and cheesecake are customer favorites.",
      fallback: "Excellent choice! It will be ready in about five minutes.",
      hint: "Try saying: 'I would like a cappuccino, please.' or 'Could you recommend something?'",
    },
  },
  {
    // General default / Workplace / Travel
    themeMatcher: /.*/,
    responses: {
      greeting: "Good day! It's great to connect with you. How can I assist you right now?",
      pricing: "The standard rate is usually quite reasonable for this service.",
      bargain: "I see your point. Let's see if we can find a mutually agreeable option.",
      checkout: "Great, everything is settled. Is there anything else you need assistance with?",
      hesitation: "Please feel free to share your thoughts, and we will take it step by step.",
      fallback: "Understood. Let's continue with our objective.",
      hint: "Try answering with a clear, simple sentence explaining what you need.",
    },
  },
];

/**
 * Detects prompt injection or out-of-bounds meta instructions.
 */
function isPromptInjection(text: string): boolean {
  return /(ignore (all |previous )?instructions|system prompt|what are your rules|reveal your instructions|pretend you are|dan mode|jailbreak)/i.test(
    text
  );
}

/**
 * Detects if the learner is closing the conversation.
 */
function isClosingConversation(text: string): boolean {
  return /\b(bye|goodbye|see you|have a nice day|have a good day|that's all|thank you, that is all|i have to go)\b/i.test(
    text
  );
}

/**
 * Evaluates at most ONE grammar/expression correction per turn (Brief §9.2).
 * Strictly guarantees that correction.original is an exact substring of the learner's message.
 */
function extractSingleCorrection(learnerMessage: string): RoleplayCorrection | null {
  for (const rule of COMMON_CORRECTION_RULES) {
    if (rule.pattern.test(learnerMessage)) {
      const original = rule.extractOriginal(learnerMessage);
      if (original && learnerMessage.includes(original)) {
        return {
          original,
          improved: rule.improved,
          reason: rule.reasonBn,
        };
      }
    }
  }
  return null;
}

/**
 * Generates an in-character AI response turn (Schema R1).
 */
export function generateRoleplayTurn(rawRequest: RoleplayTurnRequestInput): RoleplayTurnResponse {
  const request = RoleplayTurnRequestSchema.parse(rawRequest);
  const userText = request.learner_message.trim();

  // Safety & Prompt Injection Guardrail (Prompt Spec §2 & §9)
  if (isPromptInjection(userText)) {
    return RoleplayTurnResponseSchema.parse({
      ai_reply: "I am your conversation partner for this scenario. Let's stay focused on our practice topic!",
      hint: "সিনারিও অনুযায়ী স্বাভাবিক ইংরেজি কথোপকথনে মনোযোগ দিন।",
      correction: null,
      turn_status: "off_scenario",
    });
  }

  // Check if learner is wrapping up
  if (isClosingConversation(userText)) {
    return RoleplayTurnResponseSchema.parse({
      ai_reply: "You're very welcome! It was a pleasure practicing with you. Have a wonderful day!",
      hint: null,
      correction: null,
      turn_status: "learner_finished",
    });
  }

  // Find matching scenario template
  const matchedRule =
    SCENARIO_RULES.find((r) => r.themeMatcher.test(request.scenario_title + " " + request.scenario_context)) ||
    SCENARIO_RULES[SCENARIO_RULES.length - 1];

  // At most ONE gentle correction per turn
  const correction = extractSingleCorrection(userText);

  // Pick contextual AI reply
  let aiReply = matchedRule.responses.fallback;
  let hintText: string | null = null;

  if (request.transcript.length === 0) {
    aiReply = matchedRule.responses.greeting;
  } else if (/(how much|cost|price|দাম|কত)/i.test(userText)) {
    aiReply = matchedRule.responses.pricing;
    hintText = "Try asking if there is a discount or offering your payment method.";
  } else if (/(discount|less|cheaper|কম|ছাড়)/i.test(userText)) {
    aiReply = matchedRule.responses.bargain;
    hintText = "You can accept the offer or ask how to pay.";
  } else if (/(card|cash|pay|payment|bill|টাকা|বাকি)/i.test(userText)) {
    aiReply = matchedRule.responses.checkout;
  } else if (/(help|i don't know|not sure|কি বলব|বুঝতে পারছি না)/i.test(userText)) {
    aiReply = matchedRule.responses.hesitation;
    hintText = matchedRule.responses.hint;
  } else {
    // Dynamic continuation based on user's words
    aiReply = `I understand. That sounds great. How would you like to proceed with that?`;
    hintText = matchedRule.responses.hint;
  }

  return RoleplayTurnResponseSchema.parse({
    ai_reply: aiReply,
    hint: hintText,
    correction,
    turn_status: "continue",
  });
}

/**
 * Generates structured feedback at the end of a roleplay session (Schema F1).
 * Strictly conforms to ECP_AI_Prompt_Spec.md §3.6.
 */
export function generateRoleplayFeedback(
  rawRequest: RoleplayFeedbackRequestInput
): RoleplayFeedbackResponse {
  const request = RoleplayFeedbackRequestSchema.parse(rawRequest);
  const learnerTurns = request.transcript.filter((t) => t.speaker === "learner");

  // Analyze learner turns for strengths and focus areas
  const strengths: string[] = [];
  const focusAreas: FocusArea[] = [];

  if (learnerTurns.length >= 3) {
    strengths.push("কথোপকথনে সক্রিয় অংশগ্রহণ বজায় রেখেছেন এবং নিজের বক্তব্য পরিষ্কারভাবে প্রকাশ করেছেন।");
  } else {
    strengths.push("কথোপকথনের সূচনা চমৎকারভাবে করেছেন।");
  }

  const hasPoliteWords = learnerTurns.some((t) =>
    /\b(please|could|thank you|would like|welcome)\b/i.test(t.text)
  );
  if (hasPoliteWords) {
    strengths.push("মার্জিত ও প্রফেশনাল শব্দভাণ্ডার (যেমন: please, could, thank you) সুন্দরভাবে প্রয়োগ করেছেন।");
  } else {
    strengths.push("পরিস্থিতি অনুযায়ী প্রাসঙ্গিক উত্তর দিয়েছেন।");
  }

  // Detect errors from transcript for rubric focus areas
  for (const turn of learnerTurns) {
    for (const rule of COMMON_CORRECTION_RULES) {
      if (rule.pattern.test(turn.text)) {
        const original = rule.extractOriginal(turn.text);
        if (original && focusAreas.length < 3) {
          const alreadyAdded = focusAreas.some((f) => f.example_from_learner === original);
          if (!alreadyAdded) {
            focusAreas.push({
              area: rule.area,
              example_from_learner: original,
              suggestion: rule.reasonBn,
              natural_alternative: rule.improved,
            });
          }
        }
      }
    }
  }

  // If no common errors were triggered, provide an aspirational naturalness suggestion
  if (focusAreas.length === 0) {
    focusAreas.push({
      area: "naturalness",
      example_from_learner: learnerTurns[0]?.text.slice(0, 20) || "Hello",
      suggestion: "বাক্যগুলোকে আরও বৈচিত্র্যময় করতে অতিরিক্ত বিস্তারিত তথ্য যোগ করার অভ্যাস করুন।",
      natural_alternative: "I would be glad to explore this further with you.",
    });
  }

  return RoleplayFeedbackResponseSchema.parse({
    summary: `আপনার "${request.scenario_title}" বিষয়ক রোলপ্লে সেশনটি অত্যন্ত ফলপ্রসূ হয়েছে। আপনি মূল প্রসঙ্গের সাথে সঙ্গতি রেখে কথোপকথনটি এগিয়ে নিয়েছেন।`,
    strengths: strengths.slice(0, 3),
    focus_areas: focusAreas.slice(0, 3),
    next_step: "একই দৃশ্যপটে অন্য চরিত্রে অভিনয় করে অথবা একটু ভিন্ন পরিস্থিতিতে কথা বলার নতুন বাক্য প্রয়োগ করে পুনরাবৃত্তি করুন।",
    limitations: "এটি একটি স্বয়ংক্রিয় শিক্ষামূলক মূল্যায়ন; মানুষের বাস্তব প্রতিক্রিয়ার সাথে সামান্য পার্থক্য থাকতে পারে।",
  });
}
