import Link from "next/link";
import { notFound } from "next/navigation";
import { ScenarioCard } from "@/components/discovery/ScenarioCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Briefcase01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";

interface ProfessionPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [
    { slug: "ui-ux-designer" },
    { slug: "designer" },
  ];
}

export default async function ProfessionDetailPage({ params }: ProfessionPageProps) {
  const { slug } = await params;

  // Currently UI/UX Designer path is our initial approved path
  const isDesigner = slug === "ui-ux-designer" || slug === "designer";
  if (!isDesigner) {
    notFound();
  }

  const professionScenarios = SEED_SCENARIOS.filter(
    (item) => item.profession?.slug === "ui-ux-designer"
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="space-y-3">
        <Link href="/explore">
          <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-xs">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            Back to Explore
          </Button>
        </Link>

        {/* Hero Path Banner */}
        <Card variant="warm" className="p-6 space-y-3 border-[var(--ecp-accent-400)]/40">
          <div className="flex items-center gap-2">
            <Badge variant="brand" className="gap-1">
              <HugeiconsIcon icon={Briefcase01Icon} size={12} />
              Professional Career Track
            </Badge>
            <Badge variant="accent">5 Dialogue Modules</Badge>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-[var(--ecp-brand-950)]">
            UI/UX Designer Professional Track
          </h1>

          <p className="text-sm text-[var(--ecp-text-secondary)] max-w-2xl leading-relaxed">
            Master international client communication: kickoff discovery meetings, wireframe presentations, design critique defenses, scope changes, and frontend developer handoff terminology.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-[var(--ecp-brand-800)] font-medium">
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} /> Client Kickoffs
            </span>
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} /> Design Critiques
            </span>
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} /> Scope Defense
            </span>
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} /> Developer Handoff
            </span>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-[var(--ecp-text-muted)] border-b border-[var(--ecp-border)] pb-3">
        <span>Step-by-Step Learning Sequence</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {professionScenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>
    </div>
  );
}
