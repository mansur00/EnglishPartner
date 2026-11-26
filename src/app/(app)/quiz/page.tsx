"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { PageContainer, CefrChip } from "@/components/shared";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";
import {
  CONVERSATION_STYLES,
  getDefaultLengthTierForLevel,
  getLengthTiersForLevel,
  type CefrLevelCode,
  type ConversationStyle,
} from "@/lib/content/length-tiers";
import { getQuestionCountForLevel } from "@/lib/quiz/types";
import { useTranslations } from "@/lib/i18n";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  PlayCircleIcon,
  SparklesIcon,
  ArrowDown01Icon,
  AiLockIcon,
} from "@hugeicons/core-free-icons";
import { useSessionAccess } from "@/components/auth/SessionIsolationProvider";
import { GuestLimitBanner } from "@/components/auth/GuestLimitBanner";
import { FeatureDisabledCard } from "@/components/auth/FeatureDisabledCard";
import { useFeatureFlags } from "@/lib/features/use-feature-flags";

const ALL_LEVELS: ("ALL" | CefrLevelCode)[] = [
  "ALL",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

const LENGTH_KEYS = ["short", "medium", "long", "story"] as const;

export default function QuizHubPage() {
  const { locale } = useTranslations();
  const { isGuest, config, getGuestLimit } = useSessionAccess();
  const { isEnabled } = useFeatureFlags();
  const [selectedLevel, setSelectedLevel] = useState<"ALL" | CefrLevelCode>("ALL");
  const [selectedStyle, setSelectedStyle] = useState<ConversationStyle>("neutral");
  const [selectedLengthIdx, setSelectedLengthIdx] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");

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

  if (!isEnabled("quiz")) {
    return (
      <PageContainer className="py-6">
        <FeatureDisabledCard featureName={locale === "bn" ? "কুইজ (Quiz)" : "Quiz"} />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-6 space-y-6 pb-16">
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

        {/* Single-Line Filter Bar: Search + Level + Style + Length Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 pt-3 border-t border-border items-center">
          <div className="md:col-span-5 relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                locale === "bn"
                  ? "কথোপকথন কুইজ খুঁজুন..."
                  : "Search conversation quizzes..."
              }
              className="pl-9 h-11"
            />
          </div>

          <div className="md:col-span-3 relative">
            <select
              aria-label={locale === "bn" ? "লেভেল নির্বাচন করুন" : "Filter by CEFR level"}
              value={selectedLevel}
              onChange={(e) =>
                setSelectedLevel(e.target.value as "ALL" | CefrLevelCode)
              }
              className="w-full h-11 appearance-none rounded-control border border-border bg-background pl-3.5 pr-9 text-label text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {ALL_LEVELS.map((lvl) => {
                const qCount = lvl === "ALL" ? null : getQuestionCountForLevel(lvl);
                return (
                  <option key={lvl} value={lvl}>
                    {lvl === "ALL"
                      ? locale === "bn"
                        ? "সব লেভেল (A1–C2)"
                        : "Level: All (A1–C2)"
                      : `${lvl} (${qCount} ${locale === "bn" ? "প্রশ্ন" : "Q"})`}
                  </option>
                );
              })}
            </select>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>

          <div className="md:col-span-2 relative">
            <select
              aria-label={locale === "bn" ? "স্টাইল নির্বাচন করুন" : "Select conversation style"}
              value={selectedStyle}
              onChange={(e) =>
                setSelectedStyle(e.target.value as ConversationStyle)
              }
              className="w-full h-11 appearance-none rounded-control border border-border bg-background pl-3.5 pr-9 text-label text-foreground capitalize cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CONVERSATION_STYLES.map((st) => (
                <option key={st} value={st} className="capitalize">
                  {locale === "bn" ? `স্টাইল: ${st}` : `Style: ${st}`}
                </option>
              ))}
            </select>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>

          <div className="md:col-span-2 relative">
            <select
              aria-label={locale === "bn" ? "দৈর্ঘ্য নির্বাচন করুন" : "Select conversation length"}
              value={selectedLengthIdx}
              onChange={(e) => setSelectedLengthIdx(Number(e.target.value))}
              className="w-full h-11 appearance-none rounded-control border border-border bg-background pl-3.5 pr-9 text-label text-foreground capitalize cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {LENGTH_KEYS.map((len, idx) => (
                <option key={len} value={idx} className="capitalize">
                  {locale === "bn" ? `দৈর্ঘ্য: ${len}` : `Length: ${len}`}
                </option>
              ))}
            </select>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        </div>
      </Card>

      {/* Quiz Grid */}
      {isGuest && (
        <GuestLimitBanner
          previewPercent={config.guest_preview_percent}
          featureName={locale === "bn" ? "কুইজ (Quiz)" : "Practice Quizzes"}
          nextPath="/quiz"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredScenarios.map((sc, idx) => {
          const guestUnlockedCount = getGuestLimit(filteredScenarios.length, 2);
          const isLocked = isGuest && idx >= guestUnlockedCount;
          const qCount = getQuestionCountForLevel(sc.level);
          const tiers = getLengthTiersForLevel(sc.level);
          const tier = tiers[selectedLengthIdx] || getDefaultLengthTierForLevel(sc.level);
          const playHref = `/quiz/play?slug=${encodeURIComponent(sc.slug)}&level=${sc.level}&length=${encodeURIComponent(tier.id)}&style=${selectedStyle}`;

          return (
            <Card
              key={sc.id}
              className={cn(
                "p-5 bg-card border border-border flex flex-col justify-between gap-4",
                isLocked && "opacity-70"
              )}
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
                  {selectedStyle} • {LENGTH_KEYS[selectedLengthIdx]}
                </span>
                {isLocked ? (
                  <Link href="/auth/login?next=/quiz">
                    <Button size="sm" variant="outline" className="gap-1.5 cursor-pointer">
                      <HugeiconsIcon icon={AiLockIcon} size={14} />
                      <span>{locale === "bn" ? "লকড · লগইন" : "Locked · Log in"}</span>
                    </Button>
                  </Link>
                ) : (
                  <Link href={playHref}>
                    <Button
                      size="sm"
                      variant="cta"
                      className="gap-1.5 cursor-pointer"
                    >
                      <HugeiconsIcon icon={PlayCircleIcon} size={15} />
                      <span>{locale === "bn" ? "কুইজ শুরু" : "Start Quiz"}</span>
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
}
