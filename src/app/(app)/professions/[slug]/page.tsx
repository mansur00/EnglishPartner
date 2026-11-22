import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/shared/PageContainer";
import { ScenarioCard } from "@/components/discovery/ScenarioCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Briefcase01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { SEED_SCENARIOS } from "@/content/seed/scenarios";
import {
  ALL_PROFESSIONS,
  getProfessionBySlug,
} from "@/lib/professions/registry";

interface ProfessionPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [
    ...ALL_PROFESSIONS.map((p) => ({ slug: p.slug })),
    { slug: "designer" },
  ];
}

export default async function ProfessionDetailPage({ params }: ProfessionPageProps) {
  const { slug } = await params;

  const profession = getProfessionBySlug(slug);
  if (!profession) {
    notFound();
  }

  const professionScenarios = SEED_SCENARIOS.filter(
    (item) => item.profession?.slug === profession.slug
  );

  return (
    <PageContainer className="space-y-6">
      <div className="space-y-3">
        <Link href="/professions">
          <Button variant="ghost" size="sm" className="btn-back-nav text-label">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            <span className="text-bangla">সব প্রফেশনাল পাথ (All Career Tracks)</span>
          </Button>
        </Link>

        {/* Hero Path Banner */}
        <Card variant="warm" className="p-6 space-y-3 border-border rounded-card">
          <div className="flex items-center gap-2">
            <Badge variant="brand" size="sm" className="gap-1 text-chip">
              <HugeiconsIcon icon={Briefcase01Icon} size={12} />
              Professional Career Track
            </Badge>
            <Badge variant="accent" size="sm" className="text-chip">
              {profession.targetCefr}
            </Badge>
          </div>

          <h1 className="text-page-title text-foreground">
            {profession.name} — {profession.nameBn}
          </h1>

          <p className="text-chip text-primary font-mono">
            {profession.tagline}
          </p>

          <p className="text-body text-muted-foreground max-w-reading leading-relaxed">
            {profession.descriptionBn}
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-chip text-primary">
            {profession.competenciesBn.map((comp, idx) => (
              <span key={idx} className="flex items-center gap-1.5 text-chip-bn">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} />
                <span>{comp}</span>
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between text-chip text-muted-foreground border-b border-border pb-3">
        <span>Step-by-Step Learning Sequence ({professionScenarios.length} Scenarios)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {professionScenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>
    </PageContainer>
  );
}
