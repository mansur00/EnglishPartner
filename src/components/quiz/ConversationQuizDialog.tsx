"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { QuizRunner } from "./QuizRunner";
import { buildConversationQuizQuestions } from "@/lib/quiz/conversation-quiz";
import type { QuizQuestion } from "@/lib/quiz/types";
import type { ScenarioItem } from "@/content/seed/scenarios";
import type { DialogueLineItem } from "@/content/seed/dialogues";
import type { CefrLevelCode, ConversationStyle } from "@/lib/content/length-tiers";
import { useTranslations } from "@/lib/i18n";

interface ConversationQuizDialogProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: ScenarioItem;
  lines: DialogueLineItem[];
  level: CefrLevelCode;
  lengthTierId: string;
  lengthTierLabel: string;
  style: ConversationStyle;
}

export function ConversationQuizDialog({
  isOpen,
  onClose,
  scenario,
  lines,
  level,
  lengthTierId,
  lengthTierLabel,
  style,
}: ConversationQuizDialogProps) {
  const { locale } = useTranslations();
  const [seedOffset, setSeedOffset] = useState(0);
  const [aiQuestions, setAiQuestions] = useState<QuizQuestion[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const deterministicQuestions = useMemo(
    () =>
      buildConversationQuizQuestions({
        scenario,
        lines,
        level,
        lengthTierId,
        style,
        seedOffset,
      }),
    [scenario, lines, level, lengthTierId, style, seedOffset]
  );

  const mergedQuestions = useMemo(() => {
    if (aiQuestions.length === 0) return deterministicQuestions;
    const needed = deterministicQuestions.length;
    const combined = [...aiQuestions, ...deterministicQuestions];
    return combined.slice(0, needed);
  }, [aiQuestions, deterministicQuestions]);

  const handleRefresh = useCallback(async () => {
    const nextSeed = seedOffset + 1;
    setSeedOffset(nextSeed);
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/v1/ai/quiz/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioTitle: scenario.title,
          level,
          style,
          dialogueLines: lines.map((l) => l.englishText),
          seed: nextSeed,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.questions) && data.questions.length > 0) {
          setAiQuestions(data.questions);
        } else {
          setAiQuestions([]);
        }
      }
    } catch {
      setAiQuestions([]);
    } finally {
      setIsRefreshing(false);
    }
  }, [seedOffset, scenario.title, level, style, lines]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-card-title text-foreground">
            {locale === "bn" ? scenario.titleBn : scenario.title}
          </DialogTitle>
          <DialogDescription className="text-meta text-muted-foreground">
            {locale === "bn"
              ? `লেভেল ${level} • ${lengthTierLabel} • ${style} স্টাইল (${mergedQuestions.length}টি প্রশ্ন)`
              : `Level ${level} • ${lengthTierLabel} • ${style} style (${mergedQuestions.length} questions)`}
          </DialogDescription>
        </DialogHeader>

        <QuizRunner
          key={`${scenario.slug}-${level}-${lengthTierId}-${style}-${seedOffset}`}
          kind="conversation"
          title={`${scenario.title} Quiz`}
          titleBn={`${scenario.titleBn} কুইজ`}
          questions={mergedQuestions}
          source={aiQuestions.length > 0 ? "ai" : "hybrid"}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          scenarioSlug={scenario.slug}
          level={level}
          lengthTierId={lengthTierId}
          lengthTierLabel={lengthTierLabel}
          style={style}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
