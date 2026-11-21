"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  PlayCircle02Icon,
  VolumeHighIcon,
  UserGroupIcon,
  ArrowRight01Icon,
  Sorting01Icon,
  SortByDown02Icon,
  Mic01Icon,
} from "@hugeicons/core-free-icons";
import { LadderDialogueLine, LadderSpeaker } from "@/content/seed/niche_shopping_money";
import {
  getExercisesForStep,
  ListeningQuizQuestion,
  CompleteLineExercise,
  SentenceBuilderExercise,
  DialogueOrderExercise,
  DialogueOrderTurn,
  ReadAloudExercise,
} from "@/content/seed/exercises";
import { ListeningQuizCard } from "./ListeningQuizCard";
import { HideSpeakerPractice } from "./HideSpeakerPractice";
import { CompleteLineCard } from "./CompleteLineCard";
import { SentenceBuilderCard } from "./SentenceBuilderCard";
import { DialogueOrderCard } from "./DialogueOrderCard";
import { ReadAloudCard } from "./ReadAloudCard";
import { shuffleDialogueTurns } from "@/lib/practice/dialogue-order";
import { Button } from "@/components/ui/button";

interface PracticeWorkspaceProps {
  stepSlug: string;
  stepNumber: number;
  lines: LadderDialogueLine[];
  speakers: LadderSpeaker[];
  nextStepSlug?: string;
  nextStepTitle?: string;
}

export function PracticeWorkspace({
  stepSlug,
  stepNumber,
  lines,
  speakers,
  nextStepSlug,
  nextStepTitle,
}: PracticeWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"quiz" | "builder" | "order" | "aloud" | "roleplay" | "blanks">("quiz");

  const exerciseData = getExercisesForStep(stepSlug);

  // Fallback listening quiz if not explicitly curated
  const fallbackQuizzes: ListeningQuizQuestion[] = lines.slice(0, 3).map((line, idx) => ({
    id: `${stepSlug}-auto-q${idx}`,
    stepSlug,
    question: `What did ${line.speakerName} say?`,
    questionBn: `${line.speakerName} কী বলেছিলেন?`,
    audioPrompt: line.englishText,
    options: [
      { id: "a", text: line.englishText, textBn: line.translationBn },
      { id: "b", text: `I do not need this right now.`, textBn: "আমার এখনই এটা দরকার নেই।" },
      { id: "c", text: `Can you show me another item?`, textBn: "আমাকে অন্য একটি জিনিস দেখাতে পারেন?" },
    ],
    correctOptionId: "a",
    explanationBn: `সঠিক উত্তর! ${line.speakerName} বলেছিলেন: "${line.englishText}"।`,
  }));

  const activeQuizzes = exerciseData?.listeningQuizzes || fallbackQuizzes;

  // Fallback complete line exercises
  const fallbackCompleteLines: CompleteLineExercise[] = lines.slice(0, 2).map((line, idx) => {
    const words = line.englishText.split(" ");
    const targetWord = words[Math.min(1, words.length - 1)].replace(/[^a-zA-Z]/g, "");
    const masked = line.englishText.replace(targetWord, "___");

    return {
      id: `${stepSlug}-auto-c${idx}`,
      stepSlug,
      maskedSentence: masked,
      fullSentence: line.englishText,
      translationBn: line.translationBn,
      blanks: [
        {
          blankIndex: 0,
          options: [targetWord, "something", "always", "where"],
          correctAnswer: targetWord,
        },
      ],
      explanationBn: `বাক্যটিতে "${targetWord}" বসলে সম্পূর্ণ অর্থ প্রকাশ পায়: "${line.englishText}"।`,
    };
  });

  const activeCompleteLines = exerciseData?.completeLines || fallbackCompleteLines;

  // Fallback sentence builder exercises from dialogue lines
  const fallbackSentenceBuilders: SentenceBuilderExercise[] = lines.slice(0, 3).map((line, idx) => {
    const words = line.englishText.trim().split(/\s+/);
    const chunks: string[] = [];

    if (words.length <= 4) {
      chunks.push(...words);
    } else {
      const chunkSize = Math.ceil(words.length / 3);
      for (let i = 0; i < words.length; i += chunkSize) {
        chunks.push(words.slice(i, i + chunkSize).join(" "));
      }
    }

    return {
      id: `${stepSlug}-auto-sb${idx}`,
      stepSlug,
      promptBn: line.translationBn,
      fullSentence: line.englishText,
      translationBn: line.translationBn,
      chunks,
      acceptedOrders: [chunks],
      explanationBn: `সঠিক বাক্য গঠন: "${line.englishText}"। অর্থ: "${line.translationBn}"।`,
    };
  });

  const activeSentenceBuilders = exerciseData?.sentenceBuilders || fallbackSentenceBuilders;

  // Fallback dialogue order exercise from dialogue lines
  const fallbackDialogueOrder: DialogueOrderExercise = (() => {
    const turns: DialogueOrderTurn[] = lines.slice(0, 4).map((line, idx) => ({
      id: `${stepSlug}-turn-${idx + 1}`,
      correctSequence: idx + 1,
      speakerName: line.speakerName,
      speakerRole: line.speakerRole,
      englishText: line.englishText,
      translationBn: line.translationBn,
    }));

    return {
      id: `${stepSlug}-auto-order`,
      stepSlug,
      title: "Arrange Conversation Turns",
      titleBn: "সংলাপটি সঠিক ক্রমানুসারে সাজান",
      shuffledTurns: shuffleDialogueTurns(turns),
    };
  })();

  const activeDialogueOrder = exerciseData?.dialogueOrder || fallbackDialogueOrder;

  // Fallback read aloud exercises from dialogue lines
  const fallbackReadAlouds: ReadAloudExercise[] = lines.slice(0, 3).map((line, idx) => ({
    id: `${stepSlug}-auto-ra${idx}`,
    stepSlug,
    speakerName: line.speakerName,
    speakerRole: line.speakerRole,
    targetSentence: line.englishText,
    translationBn: line.translationBn,
    explanationBn: `মডেল অডিও শুনে স্বাভাবিক গতিতে বাক্যটি উচ্চারণ করুন।`,
  }));

  const activeReadAlouds = exerciseData?.readAloudExercises || fallbackReadAlouds;

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-card border border-border rounded-panel shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab("quiz")}
          className={`flex items-center gap-2 px-4 py-2 rounded-control text-meta transition-all cursor-pointer ${
            activeTab === "quiz"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <HugeiconsIcon icon={VolumeHighIcon} size={16} />
          <span className="text-bangla">লিসেনিং কুইজ (Quiz)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("builder")}
          className={`flex items-center gap-2 px-4 py-2 rounded-control text-meta transition-all cursor-pointer ${
            activeTab === "builder"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <HugeiconsIcon icon={Sorting01Icon} size={16} />
          <span className="text-bangla">সেন্টেন্স বিল্ডার (Sentence Builder)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("order")}
          className={`flex items-center gap-2 px-4 py-2 rounded-control text-meta transition-all cursor-pointer ${
            activeTab === "order"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <HugeiconsIcon icon={SortByDown02Icon} size={16} />
          <span className="text-bangla">ডায়লগ ক্রমানুসার (Dialogue Order)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("aloud")}
          className={`flex items-center gap-2 px-4 py-2 rounded-control text-meta transition-all cursor-pointer ${
            activeTab === "aloud"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <HugeiconsIcon icon={Mic01Icon} size={16} />
          <span className="text-bangla">উচ্চারণ (Read Aloud)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("roleplay")}
          className={`flex items-center gap-2 px-4 py-2 rounded-control text-meta transition-all cursor-pointer ${
            activeTab === "roleplay"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <HugeiconsIcon icon={UserGroupIcon} size={16} />
          <span className="text-bangla">রোলপ্লে: নিজের ডায়লগ বলুন (Roleplay)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("blanks")}
          className={`flex items-center gap-2 px-4 py-2 rounded-control text-meta transition-all cursor-pointer ${
            activeTab === "blanks"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          }`}
        >
          <HugeiconsIcon icon={PlayCircle02Icon} size={16} />
          <span className="text-bangla">শূন্যস্থান পূরণ (Fill Blanks)</span>
        </button>
      </div>

      {/* Active Mode Component */}
      {activeTab === "quiz" && (
        <ListeningQuizCard questions={activeQuizzes} />
      )}

      {activeTab === "builder" && (
        <SentenceBuilderCard exercises={activeSentenceBuilders} />
      )}

      {activeTab === "order" && (
        <DialogueOrderCard exercise={activeDialogueOrder} />
      )}

      {activeTab === "aloud" && (
        <ReadAloudCard exercises={activeReadAlouds} />
      )}

      {activeTab === "roleplay" && (
        <HideSpeakerPractice lines={lines} speakers={speakers} />
      )}

      {activeTab === "blanks" && (
        <CompleteLineCard exercises={activeCompleteLines} />
      )}

      {/* Advance to Next Step Banner */}
      {nextStepSlug && (
        <div className="p-5 rounded-card bg-card border border-border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="size-control rounded-control bg-success-bg text-success flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={SparklesIcon} size={20} />
            </div>
            <div>
              <h4 className="text-label text-foreground text-bangla">
                ধাপ {stepNumber.toString().padStart(2, "0")} অনুশীলন শেষ?
              </h4>
              <p className="text-chip text-muted-foreground">
                পরবর্তী কথোপকথনে নতুন ব্যাকরণ ও আরও বাক্য শিখতে এগিয়ে যান
              </p>
            </div>
          </div>

          <Link href={`/conversations/${nextStepSlug}`}>
            <Button className="w-full sm:w-auto gap-2 text-bangla text-label rounded-control">
              <span>পরবর্তী ধাপে যান ({nextStepTitle || "Next Step"})</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
