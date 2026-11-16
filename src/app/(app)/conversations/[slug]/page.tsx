import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  PlayCircleIcon,
  Clock01Icon,
  BookOpen01Icon,
  CheckmarkCircle02Icon,
  Bookmark02Icon,
} from "@hugeicons/core-free-icons";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";

interface ScenarioDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SEED_SCENARIOS.map((scenario) => ({
    slug: scenario.slug,
  }));
}

export default async function ScenarioDetailPage({ params }: ScenarioDetailPageProps) {
  const { slug } = await params;
  const scenario = SEED_SCENARIOS.find((s) => s.slug === slug);

  if (!scenario) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Breadcrumb */}
      <div>
        <Link href="/explore">
          <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-xs">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            Back to Explore
          </Button>
        </Link>
      </div>

      {/* Scenario Hero Header */}
      <Card className="space-y-4 p-6 md:p-8 bg-[var(--ecp-surface)] border-[var(--ecp-border)]">
        <div className="flex flex-wrap items-center gap-2">
          {scenario.categories.map((cat) => (
            <Badge key={cat.id} variant="neutral">
              {cat.name}
            </Badge>
          ))}
          <Badge variant="brand">{scenario.level} • CEFR</Badge>
          <Badge variant="accent" className="capitalize">
            {scenario.communicationStyle} Style
          </Badge>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--ecp-brand-950)]">
            {scenario.title}
          </h1>
          <p className="text-base text-[var(--ecp-text-secondary)] font-[var(--ecp-font-bangla)] mt-1">
            {scenario.titleBn}
          </p>
        </div>

        <p className="text-sm text-[var(--ecp-text-secondary)] leading-relaxed max-w-2xl">
          {scenario.description}
        </p>

        {/* Quick Meta Stats */}
        <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-[var(--ecp-text-muted)] border-t border-[var(--ecp-border)]/60">
          <span className="flex items-center gap-1.5 font-medium">
            <HugeiconsIcon icon={Clock01Icon} size={15} />
            Estimated: {scenario.estimatedMinutes} minutes
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <HugeiconsIcon icon={BookOpen01Icon} size={15} />
            Length: {scenario.exchangesCount} dialogue turns ({scenario.lengthType})
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[var(--ecp-brand-800)] font-semibold">
            Supported Languages: English + বাংলা
          </span>
        </div>
      </Card>

      {/* Situation Context & Objective */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="warm" className="p-5 space-y-2">
          <h3 className="text-sm font-bold text-[var(--ecp-brand-900)]">
            Situation Context (পরিস্থিতি)
          </h3>
          <p className="text-xs text-[var(--ecp-text-secondary)] leading-relaxed">
            {scenario.context}
          </p>
        </Card>

        <Card variant="muted" className="p-5 space-y-2">
          <h3 className="text-sm font-bold text-[var(--ecp-brand-900)]">
            Learning Objective (শিখন উদ্দেশ্য)
          </h3>
          <p className="text-xs text-[var(--ecp-text-secondary)] leading-relaxed flex items-start gap-2">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-[var(--ecp-success)] shrink-0 mt-0.5" />
            <span>{scenario.learningObjective}</span>
          </p>
        </Card>
      </div>

      {/* Action CTA Bar */}
      <div className="flex items-center justify-between p-4 bg-[var(--ecp-surface)] border border-[var(--ecp-border)] rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <HugeiconsIcon icon={Bookmark02Icon} size={14} />
            Bookmark Scenario
          </Button>
        </div>

        <Link href={`/?scenario=${scenario.slug}`}>
          <Button variant="primary" size="md" className="gap-2 shadow-sm">
            <HugeiconsIcon icon={PlayCircleIcon} size={18} />
            <span>Start Practice Loop</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
