import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
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
    <PageContainer className="space-y-6">
      <div className="space-y-3">
        <Link href="/explore">
          <Button variant="ghost" size="sm" className="btn-back-nav text-label">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            Back to Explore
          </Button>
        </Link>

        {/* Hero Path Banner */}
        <Card variant="warm" className="p-6 space-y-3 border-border rounded-card">
          <div className="flex items-center gap-2">
            <Badge variant="brand" size="sm" className="gap-1 text-chip">
              <HugeiconsIcon icon={Briefcase01Icon} size={12} />
              Professional Career Track
            </Badge>
            <Badge variant="accent" size="sm" className="text-chip">5 Dialogue Modules</Badge>
          </div>

          <h1 className="text-page-title text-foreground">
            UI/UX Designer Professional Track
          </h1>

          <p className="text-body text-muted-foreground max-w-reading leading-relaxed">
            Master international client communication: kickoff discovery meetings, wireframe presentations, design critique defenses, scope changes, and frontend developer handoff terminology.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-chip text-primary">
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

      <div className="flex items-center justify-between text-chip text-muted-foreground border-b border-border pb-3">
        <span>Step-by-Step Learning Sequence</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {professionScenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>
    </PageContainer>
  );
}
