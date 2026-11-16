"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { LadderStepItem } from "@/content/seed/niche_shopping_money";
import { ConversationVersionData } from "@/content/seed/dialogues";
import { ConversationReader } from "./ConversationReader";
import { PracticeWorkspace } from "@/components/practice/PracticeWorkspace";

interface LadderStepContainerProps {
  step: LadderStepItem;
  ladderVersion: ConversationVersionData;
}

export function LadderStepContainer({ step, ladderVersion }: LadderStepContainerProps) {
  const [activeTab, setActiveTab] = useState<"dialogue" | "practice">("dialogue");

  return (
    <div className="space-y-6">
      {/* Primary Section Switcher */}
      <div className="flex items-center gap-2 border-b border-ecp-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("dialogue")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "dialogue"
              ? "bg-ecp-violet text-white shadow-xs"
              : "text-ecp-text-secondary hover:text-ecp-text-primary hover:bg-ecp-bg-canvas"
          }`}
        >
          <HugeiconsIcon icon={Book01Icon} size={16} />
          <span className="font-bangla">সংলাপ ও অডিও পাঠ (Dialogue)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("practice")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "practice"
              ? "bg-ecp-violet text-white shadow-xs"
              : "text-ecp-text-secondary hover:text-ecp-text-primary hover:bg-ecp-bg-canvas"
          }`}
        >
          <HugeiconsIcon icon={SparklesIcon} size={16} />
          <span className="font-bangla">অনুশীলন ও কুইজ (Practice & Quiz)</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "dialogue" ? (
        <ConversationReader
          versions={[ladderVersion]}
          scenarioTitleEn={step.title}
          scenarioTitleBn={step.titleBn}
          scenarioSlug={step.stepSlug}
          stepNumber={step.stepNumber}
          totalSteps={20}
          stepFocus={step.focus}
          prevStepSlug={step.prevStepSlug}
          nextStepSlug={step.nextStepSlug}
          nextStepTitle={
            step.nextStepSlug
              ? `ধাপ ${(step.stepNumber + 1).toString().padStart(2, "0")}`
              : undefined
          }
        />
      ) : (
        <PracticeWorkspace
          stepSlug={step.stepSlug}
          stepNumber={step.stepNumber}
          lines={step.lines}
          speakers={step.speakers}
          nextStepSlug={step.nextStepSlug}
          nextStepTitle={
            step.nextStepSlug
              ? `ধাপ ${(step.stepNumber + 1).toString().padStart(2, "0")}`
              : undefined
          }
        />
      )}
    </div>
  );
}
