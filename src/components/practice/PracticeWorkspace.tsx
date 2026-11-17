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
} from "@hugeicons/core-free-icons";
import { LadderDialogueLine, LadderSpeaker } from "@/content/seed/niche_shopping_money";
import { getExercisesForStep, ListeningQuizQuestion, CompleteLineExercise } from "@/content/seed/exercises";
import { ListeningQuizCard } from "./ListeningQuizCard";
import { HideSpeakerPractice } from "./HideSpeakerPractice";
import { CompleteLineCard } from "./CompleteLineCard";
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
  const [activeTab, setActiveTab] = useState<"quiz" | "roleplay" | "blanks">("quiz");

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

  return (
    <div className="space-y-6">
      {/* Mode Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-ecp-border rounded-2xl shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab("quiz")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "quiz"
              ? "bg-ecp-violet text-white shadow-xs"
              : "text-ecp-text-secondary hover:text-ecp-text-primary hover:bg-ecp-bg-canvas"
          }`}
        >
          <HugeiconsIcon icon={VolumeHighIcon} size={16} />
          <span className="font-bangla">লিসেনিং কুইজ (Quiz)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("roleplay")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "roleplay"
              ? "bg-ecp-violet text-white shadow-xs"
              : "text-ecp-text-secondary hover:text-ecp-text-primary hover:bg-ecp-bg-canvas"
          }`}
        >
          <HugeiconsIcon icon={UserGroupIcon} size={16} />
          <span className="font-bangla">রোলপ্লে: নিজের ডায়লগ বলুন (Roleplay)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("blanks")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "blanks"
              ? "bg-ecp-violet text-white shadow-xs"
              : "text-ecp-text-secondary hover:text-ecp-text-primary hover:bg-ecp-bg-canvas"
          }`}
        >
          <HugeiconsIcon icon={PlayCircle02Icon} size={16} />
          <span className="font-bangla">শূন্যস্থান পূরণ (Fill Blanks)</span>
        </button>
      </div>

      {/* Active Mode Component */}
      {activeTab === "quiz" && (
        <ListeningQuizCard questions={activeQuizzes} />
      )}

      {activeTab === "roleplay" && (
        <HideSpeakerPractice lines={lines} speakers={speakers} />
      )}

      {activeTab === "blanks" && (
        <CompleteLineCard exercises={activeCompleteLines} />
      )}

      {/* Advance to Next Step Banner */}
      {nextStepSlug && (
        <div className="p-5 rounded-2xl bg-white border border-ecp-border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={SparklesIcon} size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-ecp-text-primary font-bangla">
                ধাপ {stepNumber.toString().padStart(2, "0")} অনুশীলন শেষ?
              </h4>
              <p className="text-xs text-ecp-text-muted">
                পরবর্তী কথোপকথনে নতুন ব্যাকরণ ও আরও বাক্য শিখতে এগিয়ে যান
              </p>
            </div>
          </div>

          <Link href={`/conversations/${nextStepSlug}`}>
            <Button className="w-full sm:w-auto gap-2 font-bangla text-xs">
              <span>পরবর্তী ধাপে যান ({nextStepTitle || "Next Step"})</span>
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
