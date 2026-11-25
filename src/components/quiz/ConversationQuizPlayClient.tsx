"use client";

import React, { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageContainer, CefrChip } from "@/components/shared";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { buildConversationQuizQuestions } from "@/lib/quiz/conversation-quiz";
import type { QuizQuestion } from "@/lib/quiz/types";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";
import { SEED_DIALOGUES } from "@/content/seed/dialogues";
import { buildProgressiveDialogueVersion } from "@/lib/content/dialogue-builder";
import {
  CONVERSATION_STYLES,
  getDefaultLengthTierForLevel,
  getLengthTierById,
  getLengthTiersForLevel,
  type CefrLevelCode,
  type ConversationStyle,
} from "@/lib/content/length-tiers";
import { useTranslations } from "@/lib/i18n";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

export function ConversationQuizPlayClient() {
  const searchParams = useSearchParams();
  const { locale } = useTranslations();

  const slugParam = searchParams.get("slug") || SEED_SCENARIOS[0].slug;
  const styleParam = searchParams.get("style") as ConversationStyle | null;
  const lengthParam = searchParams.get("length");

  const scenario = useMemo(
    () =>
      SEED_SCENARIOS.find((s) => s.slug === slugParam) ?? SEED_SCENARIOS[0],
    [slugParam]
  );

  const effectiveLevel = ((searchParams.get("level") as CefrLevelCode | null) ||
    scenario.level) as CefrLevelCode;
  const effectiveStyle: ConversationStyle =
    styleParam && CONVERSATION_STYLES.includes(styleParam)
      ? styleParam
      : scenario.communicationStyle || "neutral";

  const matchedTier = useMemo(() => {
    const byId = lengthParam ? getLengthTierById(lengthParam) : undefined;
    if (byId && byId.cefrLevel === effectiveLevel) return byId;
    const levelTiers = getLengthTiersForLevel(effectiveLevel);
    return (
      levelTiers.find((t) => t.id === lengthParam) ||
      getDefaultLengthTierForLevel(effectiveLevel)
    );
  }, [lengthParam, effectiveLevel]);

  const builtLines = useMemo(() => {
    const versions = SEED_DIALOGUES[scenario.slug] || [];
    const built = buildProgressiveDialogueVersion({
      slug: scenario.slug,
      title: scenario.title,
      level: effectiveLevel,
      lengthTierId: matchedTier.id,
      style: effectiveStyle,
      speakers: versions[0]?.speakers,
    });
    return built.lines;
  }, [scenario.slug, scenario.title, effectiveLevel, matchedTier.id, effectiveStyle]);

  const [seedOffset, setSeedOffset] = useState(0);
  const [aiQuestions, setAiQuestions] = useState<QuizQuestion[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const deterministicQuestions = useMemo(
    () =>
      buildConversationQuizQuestions({
        scenario,
        lines: builtLines,
        level: effectiveLevel,
        lengthTierId: matchedTier.id,
        style: effectiveStyle,
        seedOffset,
      }),
    [scenario, builtLines, effectiveLevel, matchedTier.id, effectiveStyle, seedOffset]
  );

  const mergedQuestions = useMemo(() => {
    if (aiQuestions.length === 0) return deterministicQuestions;
    const needed = deterministicQuestions.length;
    return [...aiQuestions, ...deterministicQuestions].slice(0, needed);
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
          level: effectiveLevel,
          style: effectiveStyle,
          dialogueLines: builtLines.map((l) => l.englishText),
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
  }, [seedOffset, scenario.title, effectiveLevel, effectiveStyle, builtLines]);

  return (
    <div className={cn("w-full transition-all", isSubmitted && "lg:pr-80 xl:pr-96")}>
      <PageContainer className="py-6 space-y-6 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link href={`/conversations/${scenario.slug}`}>
            <Button variant="ghost" size="sm" className="gap-1.5 cursor-pointer">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              <span>
                {locale === "bn" ? "কথোপকথনে ফিরুন" : "Back to Conversation"}
              </span>
            </Button>
          </Link>
          <Link href="/quiz">
            <Button variant="outline" size="sm" className="cursor-pointer">
              {locale === "bn" ? "সব কুইজ" : "All Quizzes"}
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <CefrChip level={effectiveLevel} label={effectiveLevel} />
          <Badge variant="outline" size="sm" className="capitalize">
            {effectiveStyle}
          </Badge>
          <Badge variant="neutral" size="sm">
            {matchedTier.labelEn}
          </Badge>
        </div>
      </div>

      <Card className="p-5 sm:p-6 bg-card border border-border space-y-1">
        <h1 className="text-page-title text-foreground">
          {locale === "bn" ? `${scenario.titleBn} — কুইজ` : `${scenario.title} — Quiz`}
        </h1>
        <p className="text-body text-muted-foreground">
          {locale === "bn"
            ? "নিচের সব প্রশ্নের উত্তর দিয়ে সাবমিট করুন। সাবমিট করার পর ডানপাশের সাইডবারে স্কোর এবং প্রতিটি প্রশ্নের সঠিক/ভুল উত্তর দেখাবে।"
            : "Answer all questions below and click Submit. Your score will appear in the right sidebar along with right/wrong feedback."}
        </p>
      </Card>

      <QuizRunner
        key={`${scenario.slug}-${effectiveLevel}-${matchedTier.id}-${effectiveStyle}-${seedOffset}`}
        kind="conversation"
        title={`${scenario.title} Quiz`}
        titleBn={`${scenario.titleBn} কুইজ`}
        questions={mergedQuestions}
        source={aiQuestions.length > 0 ? "ai" : "hybrid"}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        scenarioSlug={scenario.slug}
        level={effectiveLevel}
        lengthTierId={matchedTier.id}
        lengthTierLabel={matchedTier.labelEn}
        style={effectiveStyle}
        onSubmittedChange={setIsSubmitted}
      />
      </PageContainer>
    </div>
  );
}
