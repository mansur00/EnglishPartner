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
import type { ScenarioItem } from "@/content/seed/scenarios";
import { SEED_DIALOGUES } from "@/content/seed/dialogues";
import { getCategoryTheme } from "@/lib/theme/category-theme";
import { formatLanguageCoverageLine } from "@/lib/content/language-coverage";
import { EmojiTile, CefrChip, type CefrLevel } from "@/components/shared";

interface ScenarioCardProps {
  scenario: ScenarioItem;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  const primaryCat = scenario.categories[0]?.slug || "social-daily";
  const theme = getCategoryTheme(primaryCat);
  const scenarioLines = SEED_DIALOGUES[scenario.slug]?.[0]?.lines;
  const coverageLine = formatLanguageCoverageLine(scenario.languages, scenarioLines);

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
                {scenario.categories[0]?.name || "Conversation"}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <CefrChip level={(scenario.level as CefrLevel) || "A2"} />
                <span className="text-chip bg-muted text-muted-foreground px-2 py-0.5 rounded-pill border border-border">
                  {coverageLine}
                </span>
              </div>
            </div>
          </div>

          {scenario.profession && (
            <Badge variant="secondary" size="md" className="gap-1.5 shrink-0">
              <HugeiconsIcon icon={Briefcase01Icon} size={14} />
              {scenario.profession.name}
            </Badge>
          )}
        </div>

        {/* Title & Bangla Subtitle */}
        <div>
          <h3 className="text-card-title text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {scenario.title}
          </h3>
          <p className="text-meta text-muted-foreground text-bangla mt-1 line-clamp-1">
            {scenario.titleBn}
          </p>
        </div>

        {/* Sample Line Preview or Description */}
        <p className="text-body text-muted-foreground leading-relaxed line-clamp-2">
          {scenario.description}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 mt-5 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4 text-meta text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={Clock01Icon} size={15} className="text-primary" />
            {scenario.estimatedMinutes}m
          </span>
          <span className="flex items-center gap-1.5">
            <HugeiconsIcon icon={BookOpen01Icon} size={15} className="text-primary" />
            {scenario.exchangesCount} turns
          </span>
        </div>

        <Link href={`/conversations/${scenario.slug}`}>
          <Button variant="secondary" size="md" className="btn-press gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all rounded-control">
            <HugeiconsIcon icon={PlayCircleIcon} size={18} />
            <span>{t("learning.practice")}</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}
