"use client";

import React, { useMemo, useState } from "react";
import { PageContainer, CefrChip } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SEED_SCENARIOS, type ScenarioItem } from "@/content/seed/scenarios";
import { SEED_DIALOGUES } from "@/content/seed/dialogues";
import { buildProgressiveDialogueVersion } from "@/lib/content/dialogue-builder";
import {
  CONVERSATION_STYLES,
  getDefaultLengthTierForLevel,
  getLengthTiersForLevel,
  type CefrLevelCode,
  type ConversationStyle,
} from "@/lib/content/length-tiers";
import { getQuestionCountForLevel } from "@/lib/quiz/types";
import { ConversationQuizDialog } from "@/components/quiz/ConversationQuizDialog";
import { useTranslations } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  PlayCircleIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

const ALL_LEVELS: ("ALL" | CefrLevelCode)[] = [
  "ALL",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

export default function QuizHubPage() {
  const { locale } = useTranslations();
  const [selectedLevel, setSelectedLevel] = useState<"ALL" | CefrLevelCode>("ALL");
  const [selectedStyle, setSelectedStyle] = useState<ConversationStyle>("neutral");
  const [selectedLengthIdx, setSelectedLengthIdx] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeScenario, setActiveScenario] = useState<ScenarioItem | null>(null);

  const filteredScenarios = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SEED_SCENARIOS.filter((sc) => {
      if (selectedLevel !== "ALL" && sc.level !== selectedLevel) return false;
      if (!q) return true;
      return (
        sc.title.toLowerCase().includes(q) ||
        sc.titleBn.toLowerCase().includes(q) ||
        sc.description.toLowerCase().includes(q)
      );
    });
  }, [selectedLevel, searchQuery]);

  const activeQuizPayload = useMemo(() => {
    if (!activeScenario) return null;
    const versions = SEED_DIALOGUES[activeScenario.slug] || [];
    const tiers = getLengthTiersForLevel(activeScenario.level);
    const matchedTier =
      tiers[selectedLengthIdx] ||
      getDefaultLengthTierForLevel(activeScenario.level);
    const baseVersion = versions[0];
    const builtVersion = buildProgressiveDialogueVersion({
      slug: activeScenario.slug,
      title: activeScenario.title,
      level: activeScenario.level,
      lengthTierId: matchedTier.id,
      style: selectedStyle,
      speakers: baseVersion?.speakers,
    });
    return {
      scenario: activeScenario,
      lines: builtVersion.lines,
      level: activeScenario.level,
      lengthTierId: matchedTier.id,
      lengthTierLabel: matchedTier.labelEn,
      style: selectedStyle,
    };
  }, [activeScenario, selectedLengthIdx, selectedStyle]);

  return (
    <PageContainer className="py-6 sm:py-8 space-y-6">
      {/* Header & Filters Card */}
      <Card className="p-5 sm:p-6 bg-card border border-border space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="brand" size="sm" className="gap-1">
                <HugeiconsIcon icon={SparklesIcon} size={13} />
                <span>
                  {locale === "bn"
                    ? "কথোপকথন ভিত্তিক কুইজ"
                    : "Conversation Practice Quizzes"}
                </span>
              </Badge>
              <Badge variant="outline" size="sm" className="font-mono">
                {filteredScenarios.length}{" "}
                {locale === "bn" ? "টি কুইজ" : "Quizzes"}
              </Badge>
            </div>
            <h1 className="text-page-title text-foreground">
              {locale === "bn"
                ? "কুইজ প্র্যাকটিস হাব (A1–C2)"
                : "Conversation Quiz Practice (A1–C2)"}
            </h1>
            <p className="text-body text-muted-foreground">
              {locale === "bn"
                ? "প্রতিটি কথোপকথনের লেভেল, দৈর্ঘ্য এবং স্টাইল অনুযায়ী ১০–৩০টি প্রশ্নের কুইজ অনুশীলন করুন।"
                : "Practice 10–30 question quizzes tailored to every conversation's CEFR level, length tier, and style."}
            </p>
          </div>
        </div>

        {/* Search + Style + Length Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2 border-t border-border">
          <div className="lg:col-span-5 relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                locale === "bn"
                  ? "কথোপকথন কুইজ খুঁজুন..."
                  : "Search conversation quizzes..."
              }
              className="pl-9"
            />
          </div>

          <div className="lg:col-span-4 flex flex-wrap items-center gap-1.5">
            <span className="text-chip text-muted-foreground mr-1">
              {locale === "bn" ? "স্টাইল:" : "Style:"}
            </span>
            {CONVERSATION_STYLES.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStyle(st)}
                className={cn(
                  "px-3 py-1.5 rounded-control text-chip capitalize transition-colors cursor-pointer",
                  selectedStyle === st
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="lg:col-span-3 flex flex-wrap items-center gap-1.5">
            <span className="text-chip text-muted-foreground mr-1">
              {locale === "bn" ? "দৈর্ঘ্য:" : "Length:"}
            </span>
            {(["short", "medium", "long", "story"] as const).map((len, idx) => (
              <button
                key={len}
                type="button"
                onClick={() => setSelectedLengthIdx(idx)}
                className={cn(
                  "px-2.5 py-1.5 rounded-control text-chip capitalize transition-colors cursor-pointer",
                  selectedLengthIdx === idx
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {len}
              </button>
            ))}
          </div>
        </div>

        {/* CEFR Level Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {ALL_LEVELS.map((lvl) => {
            const isSelected = selectedLevel === lvl;
            const qCount = lvl === "ALL" ? null : getQuestionCountForLevel(lvl);
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={cn(
                  "px-3 py-1.5 rounded-pill text-chip transition-colors cursor-pointer flex items-center gap-1.5",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{lvl === "ALL" ? (locale === "bn" ? "সব লেভেল" : "All Levels") : lvl}</span>
                {qCount !== null && (
                  <span className="opacity-80 font-mono">({qCount}Q)</span>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredScenarios.map((sc) => {
          const qCount = getQuestionCountForLevel(sc.level);
          return (
            <Card
              key={sc.id}
              className="p-5 bg-card border border-border flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <CefrChip level={sc.level} label={sc.level} />
                  <Badge variant="outline" size="sm" className="font-mono">
                    {qCount} {locale === "bn" ? "প্রশ্ন" : "Questions"}
                  </Badge>
                </div>

                <h2 className="text-card-title text-foreground leading-snug">
                  {locale === "bn" ? sc.titleBn : sc.title}
                </h2>
                <p className="text-meta text-muted-foreground line-clamp-2">
                  {locale === "bn" ? sc.descriptionBn : sc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                <span className="text-chip text-muted-foreground capitalize">
                  {selectedStyle} • {(["short", "medium", "long", "story"] as const)[selectedLengthIdx]}
                </span>
                <Button
                  size="sm"
                  variant="cta"
                  onClick={() => setActiveScenario(sc)}
                  className="gap-1.5 cursor-pointer"
                >
                  <HugeiconsIcon icon={PlayCircleIcon} size={15} />
                  <span>{locale === "bn" ? "কুইজ শুরু" : "Start Quiz"}</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {activeQuizPayload && (
        <ConversationQuizDialog
          isOpen={Boolean(activeQuizPayload)}
          onClose={() => setActiveScenario(null)}
          scenario={activeQuizPayload.scenario}
          lines={activeQuizPayload.lines}
          level={activeQuizPayload.level}
          lengthTierId={activeQuizPayload.lengthTierId}
          lengthTierLabel={activeQuizPayload.lengthTierLabel}
          style={activeQuizPayload.style}
        />
      )}
    </PageContainer>
  );
}
