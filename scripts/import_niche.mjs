#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFilePath = "/Users/mdmansur/Desktop/apk/English learning/Conversation/ECP_Conversations_Shopping_Money.md";
const outputFilePath = path.join(__dirname, "../src/content/seed/niche_shopping_money.ts");

const rawMarkdown = fs.readFileSync(sourceFilePath, "utf-8");
const rawSteps = rawMarkdown.split(/### Step /).slice(1);

const stepBengaliTitles = [
  "নমস্কার, এটার দাম কত? (Hello, and How Much?)",
  "এটা না ওটা? সাইজ ও রঙের পছন্দ (This One or That One?)",
  "নগদ না কার্ডে পেমেন্ট? (Cash or Card?)",
  "ছোট সাইজ কি আছে? (Do You Have…?)",
  "কোনো ছাড় বা ডিসকাউন্ট আছে কি? (Is There a Discount?)",
  "এটা কি ফেরত নেওয়া যাবে? (Could I Return This?)",
  "গতকাল এটা কাজ করেনি (It Didn't Work Yesterday)",
  "টাকা ফেরত চান কেন? (Why Do You Want a Refund?)",
  "কম দামিটা নাকি ভালো মানেরটা? (The Cheaper or Better One?)",
  "আমি প্যাকেট করে দিচ্ছি (I'll Wrap It for You)",
  "আগে কখনো এমন সমস্যা হয়নি (I've Never Had This Problem)",
  "দুটো কিনলে বেশি সাশ্রয় (If You Buy Two, You'll Save More)",
  "আমি চল্লিশ মিনিট ধরে অপেক্ষা করছি (Waiting for Forty Minutes)",
  "আমি হলে এখনই রসিদ চাইতাম (Ask for a Receipt)",
  "ভুল সাইজের পণ্য এসেছে (Order Arrived in Wrong Size)",
  "মানসম্মত জিনিসের জন্য কেন বেশি খরচ করব (Pay More for Quality)",
  "আমাদের পণ্য ফেরত নীতিমালা (Our Return Policy)",
  "কার্ড ডিক্লাইন বা বাতিল হয়েছে (The Card Was Declined)",
  "তাকের শেষ পণ্যটি (The Last One on the Shelf)",
  "শেখ মুজিব রোডের দোকানটি (The Shop on Sheikh Mujib Road — Full Story)",
];

const speakerAvatarMap = {
  rafi: { nameBn: "রফি", roleBn: "দোকান সহকারী", avatarChar: "R", colorScheme: "brand" },
  nadia: { nameBn: "নাদিয়া", roleBn: "ক্রেতা", avatarChar: "N", colorScheme: "accent" },
  karim: { nameBn: "করিম", roleBn: "দোকান মালিক", avatarChar: "K", colorScheme: "brand" },
  mina: { nameBn: "মিনা", roleBn: "ক্রেতা", avatarChar: "M", colorScheme: "accent" },
};

function getCefrGroup(level) {
  if (level.startsWith("A1")) return "A1 Beginner";
  if (level.startsWith("A2")) return "A2 Elementary";
  if (level.startsWith("B1")) return "B1 Intermediate";
  if (level.startsWith("B2/C1") || level.startsWith("C1")) return "C1 Advanced Story";
  if (level.startsWith("B2")) return "B2 Upper-Intermediate";
  return "A1 Beginner";
}

const parsedSteps = rawSteps.map((raw, idx) => {
  const lines = raw.trim().split("\n");
  const headerMatch = lines[0].match(/^(\d+)\s*—\s*(.+)$/);
  const stepNum = parseInt(headerMatch ? headerMatch[1] : (idx + 1));
  const title = headerMatch ? headerMatch[2].trim() : `Step ${stepNum}`;
  const stepSlug = `shopping-money-step-${stepNum.toString().padStart(2, "0")}`;

  let niche = "Shopping & Money";
  let nicheSlug = "shopping-money";
  let linesCount = 0;
  let level = "A1";
  let focus = "";

  lines.forEach((l) => {
    if (l.startsWith("- Niche:")) {
      const m = l.match(/- Niche:\s*([^(]+)\(slug:\s*([^)]+)\)/);
      if (m) {
        niche = m[1].trim();
        nicheSlug = m[2].trim();
      }
    } else if (l.startsWith("- Lines:")) {
      const parts = l.split("·").map((p) => p.trim());
      const lMatch = parts[0].match(/Lines:\s*(\d+)/);
      if (lMatch) linesCount = parseInt(lMatch[1]);
      const lvlMatch = parts[1]?.match(/Level:\s*([A-Za-z0-9+/]+)/);
      if (lvlMatch) level = lvlMatch[1];
      const fMatch = parts[2]?.match(/Focus:\s*(.+)/);
      if (fMatch) focus = fMatch[1];
    }
  });

  // Extract distinct speakers
  const speakersInStep = [];
  const turnRegex = /\*\*([^(]+)\(([^)]+)\):\*\*\s*(.+)\n>\s*(.+)/g;
  let match;
  const turns = [];
  let seq = 1;

  while ((match = turnRegex.exec(raw)) !== null) {
    const rawName = match[1].trim();
    const rawRole = match[2].trim();
    const englishText = match[3].trim();
    const translationBn = match[4].trim();
    const speakerId = rawName.toLowerCase();

    if (!speakersInStep.some((s) => s.id === speakerId)) {
      const meta = speakerAvatarMap[speakerId] || {
        nameBn: rawName,
        roleBn: rawRole,
        avatarChar: rawName[0].toUpperCase(),
        colorScheme: "brand",
      };
      speakersInStep.push({
        id: speakerId,
        name: rawName,
        nameBn: meta.nameBn,
        role: rawRole,
        roleBn: meta.roleBn,
        avatarChar: meta.avatarChar,
        colorScheme: meta.colorScheme,
      });
    }

    turns.push({
      id: `${stepSlug}-t${seq}`,
      sequenceNumber: seq++,
      speakerId,
      speakerName: rawName,
      speakerRole: rawRole,
      englishText,
      translationBn,
    });
  }

  return {
    stepNumber: stepNum,
    stepSlug,
    title,
    titleBn: stepBengaliTitles[stepNum - 1] || title,
    nicheName: niche,
    nicheSlug,
    linesCount: turns.length || linesCount,
    level,
    cefrGroup: getCefrGroup(level),
    focus,
    speakers: speakersInStep,
    lines: turns,
  };
});

// Link prev and next step slugs
parsedSteps.forEach((step, idx) => {
  if (idx > 0) {
    step.prevStepSlug = parsedSteps[idx - 1].stepSlug;
  }
  if (idx < parsedSteps.length - 1) {
    step.nextStepSlug = parsedSteps[idx + 1].stepSlug;
  }
});

// Generate TypeScript module content
const tsContent = `// Auto-generated from ECP_Conversations_Shopping_Money.md
// Complies with 20-step conversation ladder model (ECP_Conversation_Library_Master.md §2)

export interface LadderSpeaker {
  id: string;
  name: string;
  nameBn: string;
  role: string;
  roleBn: string;
  avatarChar: string;
  colorScheme: "brand" | "accent";
}

export interface LadderDialogueLine {
  id: string;
  sequenceNumber: number;
  speakerId: string;
  speakerName: string;
  speakerRole: string;
  englishText: string;
  translationBn: string;
  wordHighlights?: string[];
  learningNote?: string;
  audioUrl?: {
    "en-US"?: string;
    "en-GB"?: string;
  };
}

export interface LadderStepItem {
  stepNumber: number;
  stepSlug: string;
  title: string;
  titleBn: string;
  nicheName: string;
  nicheSlug: string;
  linesCount: number;
  level: string;
  cefrGroup: string;
  focus: string;
  speakers: LadderSpeaker[];
  lines: LadderDialogueLine[];
  prevStepSlug?: string;
  nextStepSlug?: string;
}

export const NICHE_01_SHOPPING_MONEY = {
  nicheNumber: 1,
  name: "Shopping & Money",
  nameBn: "কেনাকাটা ও লেনদেন",
  slug: "shopping-money",
  description: "Learn practical English for shopping, asking prices, negotiating discounts, returns, payments, and speaking with shopkeepers.",
  descriptionBn: "দোকানে গিয়ে কথা বলা, পণ্যের দাম ও সাইজ জিজ্ঞেস করা, ছাড় চাওয়া, বিল পেমেন্ট এবং পণ্য ফেরত দেওয়ার বাস্তব কথোপকথন।",
  totalSteps: 20,
  levelRange: "A1 to B2/C1",
  speakers: [
    { id: "rafi", name: "Rafi", nameBn: "রফি", role: "Shop Assistant", roleBn: "দোকান সহকারী" },
    { id: "nadia", name: "Nadia", nameBn: "নাদিয়া", role: "Customer", roleBn: "ক্রেতা" },
    { id: "karim", name: "Karim", nameBn: "করিম", role: "Shop Owner", roleBn: "দোকান মালিক" },
    { id: "mina", name: "Mina", nameBn: "মিনা", role: "Customer", roleBn: "ক্রেতা" },
  ],
};

export const SHOPPING_MONEY_LADDER_STEPS: LadderStepItem[] = ${JSON.stringify(parsedSteps, null, 2)};

export function getShoppingMoneyStep(stepNumber: number): LadderStepItem | undefined {
  return SHOPPING_MONEY_LADDER_STEPS.find((s) => s.stepNumber === stepNumber);
}

export function getShoppingMoneyStepBySlug(slug: string): LadderStepItem | undefined {
  return SHOPPING_MONEY_LADDER_STEPS.find((s) => s.stepSlug === slug);
}
`;

fs.writeFileSync(outputFilePath, tsContent, "utf-8");
console.log(`Successfully generated ${outputFilePath} with ${parsedSteps.length} ladder steps.`);
