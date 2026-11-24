"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { LadderStepItem } from "@/content/seed/niche_shopping_money";
import { ConversationVersionData } from "@/content/seed/dialogues";
import { ConversationReader } from "./ConversationReader";
import { PracticeWorkspace } from "@/components/practice/PracticeWorkspace";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLocale } from "@/lib/i18n";

interface LadderStepContainerProps {
  step: LadderStepItem;
  ladderVersion: ConversationVersionData;
}

export function LadderStepContainer({ step, ladderVersion }: LadderStepContainerProps) {
  const locale = useLocale();
  return (
    <Tabs defaultValue="dialogue" className="space-y-6">
      {/* Primary Section Switcher */}
      <TabsList className="w-full sm:w-auto min-h-tap p-1 bg-muted/60 border border-border rounded-panel">
        <TabsTrigger
          value="dialogue"
          className="flex-1 sm:flex-initial gap-2 text-label rounded-control data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
        >
          <HugeiconsIcon icon={Book01Icon} size={16} />
          <span className="text-bangla">{locale === "bn" ? "সংলাপ ও অডিও পাঠ" : "Dialogue & Audio"}</span>
        </TabsTrigger>

        <TabsTrigger
          value="practice"
          className="flex-1 sm:flex-initial gap-2 text-label rounded-control data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
        >
          <HugeiconsIcon icon={SparklesIcon} size={16} />
          <span className="text-bangla">{locale === "bn" ? "অনুশীলন ও কুইজ" : "Practice & Quiz"}</span>
        </TabsTrigger>
      </TabsList>

      {/* Tab Panels */}
      <TabsContent value="dialogue" className="mt-0 focus-visible:outline-none">
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
      </TabsContent>

      <TabsContent value="practice" className="mt-0 focus-visible:outline-none">
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
      </TabsContent>
    </Tabs>
  );
}
