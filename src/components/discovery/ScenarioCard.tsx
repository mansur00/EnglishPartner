import Link from "next/link";
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
import { getCategoryTheme } from "@/lib/theme/category-theme";

interface ScenarioCardProps {
  scenario: ScenarioItem;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  const primaryCat = scenario.categories[0]?.slug || "social-daily";
  const theme = getCategoryTheme(primaryCat);

  const cefrStyles: Record<string, string> = {
    A1: "bg-emerald-500/10 text-emerald-800 border-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300",
    A2: "bg-sky-500/10 text-sky-800 border-sky-500/30 dark:bg-sky-400/15 dark:text-sky-300",
    B1: "bg-amber-500/10 text-amber-800 border-amber-500/30 dark:bg-amber-400/15 dark:text-amber-300",
    B2: "bg-orange-500/10 text-orange-800 border-orange-500/30 dark:bg-orange-400/15 dark:text-orange-300",
    C1: "bg-purple-500/10 text-purple-800 border-purple-500/30 dark:bg-purple-400/15 dark:text-purple-300",
  };

  const categoryEmoji: Record<string, string> = {
    "shopping-and-money": "🛍️",
    "travel-transport": "✈️",
    "health-medical": "🏥",
    "social-daily": "☕",
    "workplace-business": "💼",
  };

  const emoji = categoryEmoji[primaryCat] || "💬";

  return (
    <Card className="card-hover flex flex-col justify-between border-border bg-card p-5 md:p-6 shadow-xs group">
      <div className="space-y-3.5">
        {/* Header: Category Icon Tile + Tags */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${theme.iconBgLight} ${theme.iconBgDark}`}
              title={theme.name}
            >
              {emoji}
            </div>

            <div>
              <span className={`text-xs font-bold ${theme.textColorLight} ${theme.textColorDark}`}>
                {scenario.categories[0]?.name || "Conversation"}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${cefrStyles[scenario.level] || cefrStyles.A2}`}>
                  {scenario.level}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border">
                  EN + BN
                </span>
              </div>
            </div>
          </div>

          {scenario.profession && (
            <Badge variant="secondary" size="sm" className="gap-1 text-[11px] shrink-0">
              <HugeiconsIcon icon={Briefcase01Icon} size={11} />
              {scenario.profession.name}
            </Badge>
          )}
        </div>

        {/* Title & Bangla Subtitle */}
        <div>
          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {scenario.title}
          </h3>
          <p className="text-xs font-medium text-muted-foreground font-[var(--ecp-font-bangla)] mt-1 line-clamp-1">
            {scenario.titleBn}
          </p>
        </div>

        {/* Sample Line Preview or Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {scenario.description}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 font-medium">
            <HugeiconsIcon icon={Clock01Icon} size={13} className="text-primary" />
            {scenario.estimatedMinutes}m
          </span>
          <span className="flex items-center gap-1 font-medium">
            <HugeiconsIcon icon={BookOpen01Icon} size={13} className="text-primary" />
            {scenario.exchangesCount} turns
          </span>
        </div>

        <Link href={`/conversations/${scenario.slug}`}>
          <Button variant="secondary" size="sm" className="btn-press gap-1.5 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            <HugeiconsIcon icon={PlayCircleIcon} size={15} />
            <span>Practice</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}
