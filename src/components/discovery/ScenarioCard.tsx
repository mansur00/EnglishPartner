"use client";

import Link from "next/link";
import { t } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlayCircleIcon,
  BookOpen01Icon,
  Clock01Icon,
  Briefcase01Icon,
} from "@hugeicons/core-free-icons";
import { CATEGORIES_LIST, type ScenarioItem } from "@/content/seed/scenarios";
import { SEED_DIALOGUES } from "@/content/seed/dialogues";
import { getCategoryTheme } from "@/lib/theme/category-theme";
import { formatLanguageCoverageLine } from "@/lib/content/language-coverage";
import { EmojiTile, CefrChip, type CefrLevel, LocaleTitle } from "@/components/shared";
import { useLocale } from "@/lib/i18n";
import { ALL_PROFESSIONS } from "@/lib/professions/registry";
import { getLengthTierById, getDefaultLengthTierForLevel } from "@/lib/content/length-tiers";

interface ScenarioCardProps {
  scenario: ScenarioItem;
  selectedLengthTierId?: string;
  selectedStyle?: string;
}

export function ScenarioCard({ scenario, selectedLengthTierId, selectedStyle }: ScenarioCardProps) {
  const locale = useLocale();
  const activeTier =
    (selectedLengthTierId ? getLengthTierById(selectedLengthTierId) : undefined) ||
    getDefaultLengthTierForLevel(scenario.level);
  const activeStyle = selectedStyle || scenario.communicationStyle || "neutral";
  const displayMinutes = Math.max(3, Math.round(activeTier.targetTurns * 0.45));
  const detailHref = `/conversations/${scenario.slug}?length=${activeTier.id}&style=${activeStyle}`;
  const primaryCat = scenario.categories[0]?.slug || "social-daily";
  const theme = getCategoryTheme(primaryCat);
  const scenarioLines = SEED_DIALOGUES[scenario.slug]?.[0]?.lines;
  const coverageLine = formatLanguageCoverageLine(scenario.languages, scenarioLines);

  const catItem = CATEGORIES_LIST.find((c) => c.slug === primaryCat);
  const categoryName =
    locale === "bn"
      ? catItem?.nameBn || scenario.categories[0]?.name
      : scenario.categories[0]?.name || "Conversation";

  const description =
    locale === "bn"
      ? scenario.descriptionBn || scenario.description
      : scenario.description;

  return (
    <Card
      data-topic={theme.topic}
      className="card-hover flex flex-col justify-between p-6 md:p-7 shadow-xs group rounded-card"
    >
      <div className="space-y-4">
        {/* Header: Category Icon Tile + Tags */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <EmojiTile emoji={theme.emoji} title={theme.name} />

            <div>
              <span className="text-label text-topic-ink block">
                {categoryName}
              </span>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <CefrChip level={(scenario.level as CefrLevel) || "A2"} />
                <span className="text-chip bg-muted text-muted-foreground h-6 px-2.5 rounded-pill inline-flex items-center justify-center">
                  {coverageLine}
                </span>
              </div>
            </div>
          </div>

          {scenario.profession && (
            <Badge variant="secondary" size="md" className="gap-1.5 shrink-0">
              <HugeiconsIcon icon={Briefcase01Icon} size={14} />
              {locale === "bn"
                ? ALL_PROFESSIONS.find((p) => p.slug === scenario.profession?.slug)?.nameBn || scenario.profession.name
                : scenario.profession.name}
            </Badge>
          )}
        </div>

        {/* Single Title according to active language */}
        <div>
          <LocaleTitle
            as="h3"
            titleEn={scenario.title}
            titleBn={scenario.titleBn}
            className="text-card-title text-foreground group-hover:text-primary transition-colors line-clamp-1"
          />
        </div>

        {/* Description in active language */}
        <p className="text-body text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 mt-5 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4 text-meta text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={Clock01Icon} size={15} className="text-primary" />
            {displayMinutes} {t("dashboard.minutesUnit", locale)}
          </span>
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={BookOpen01Icon} size={15} className="text-primary" />
            {locale === "bn" ? activeTier.labelBn : activeTier.labelEn}
          </span>
        </div>

        <Link href={detailHref}>
          <Button variant="default" size="sm" className="btn-press gap-2 rounded-control">
            <HugeiconsIcon icon={PlayCircleIcon} size={16} />
            <span>{t("learning.practice", locale)}</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}
