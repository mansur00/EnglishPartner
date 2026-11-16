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

interface ScenarioCardProps {
  scenario: ScenarioItem;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  const levelBadgeVariants: Record<string, "brand" | "accent" | "peach" | "neutral" | "success" | "warning"> = {
    A1: "accent",
    A2: "brand",
    B1: "peach",
    B2: "warning",
    C1: "success",
  };

  return (
    <Card className="flex flex-col justify-between hover:border-[var(--ecp-brand-800)]/40 hover:shadow-md transition-all duration-200 group bg-[var(--ecp-surface)]">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {scenario.categories.map((cat) => (
              <Badge key={cat.id} variant="neutral" size="sm">
                {cat.name}
              </Badge>
            ))}
            {scenario.profession && (
              <Badge variant="brand" size="sm" className="gap-1">
                <HugeiconsIcon icon={Briefcase01Icon} size={12} />
                {scenario.profession.name}
              </Badge>
            )}
          </div>

          <Badge variant={levelBadgeVariants[scenario.level] || "neutral"} size="sm">
            {scenario.level}
          </Badge>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-[var(--ecp-brand-950)] group-hover:text-[var(--ecp-brand-800)] transition-colors line-clamp-1">
            {scenario.title}
          </h3>
          <p className="text-xs text-[var(--ecp-text-secondary)] font-[var(--ecp-font-bangla)] mt-0.5 line-clamp-1">
            {scenario.titleBn}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-[var(--ecp-text-secondary)] leading-relaxed line-clamp-2">
          {scenario.description}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-4 mt-4 border-t border-[var(--ecp-border)] flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-[var(--ecp-text-muted)]">
          <span className="flex items-center gap-1">
            <HugeiconsIcon icon={Clock01Icon} size={13} />
            {scenario.estimatedMinutes}m
          </span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon icon={BookOpen01Icon} size={13} />
            {scenario.exchangesCount} turns
          </span>
          <span className="text-[10px] uppercase font-bold text-[var(--ecp-brand-800)] bg-[var(--ecp-brand-100)] px-1.5 py-0.5 rounded">
            EN + BN
          </span>
        </div>

        <Link href={`/conversations/${scenario.slug}`}>
          <Button variant="secondary" size="sm" className="gap-1.5 shadow-none group-hover:bg-[var(--ecp-brand-800)] group-hover:text-white transition-all">
            <HugeiconsIcon icon={PlayCircleIcon} size={16} />
            <span>Practice</span>
          </Button>
        </Link>
      </div>
    </Card>
  );
}
