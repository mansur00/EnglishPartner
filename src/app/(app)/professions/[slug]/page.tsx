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
import { LocaleTitle } from "@/components/shared";
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
            <LocaleTitle
              as="span"
              titleEn="All Career Tracks"
              titleBn="সব প্রফেশনাল পাথ"
              className="text-bangla"
            />
          </Button>
        </Link>

        {/* Hero Path Banner */}
        <Card variant="warm" className="p-6 space-y-3 border-border rounded-card">
          <div className="flex items-center gap-2">
            <Badge variant="brand" size="sm" className="gap-1 text-chip">
              <HugeiconsIcon icon={Briefcase01Icon} size={12} />
              <LocaleTitle
                as="span"
                titleEn="Professional Career Track"
                titleBn="পেশাগত ক্যারিয়ার ট্র্যাক"
              />
            </Badge>
            <Badge variant="accent" size="sm" className="text-chip">
              {profession.targetCefr}
            </Badge>
          </div>

          <LocaleTitle
            as="h1"
            titleEn={profession.name}
            titleBn={profession.nameBn}
            className="text-page-title text-foreground"
          />

          <LocaleTitle
            as="p"
            titleEn={profession.tagline}
            titleBn={profession.taglineBn}
            className="text-chip text-primary font-mono"
          />

          <LocaleTitle
            as="p"
            titleEn={profession.description || profession.descriptionBn}
            titleBn={profession.descriptionBn}
            className="text-body text-muted-foreground max-w-reading leading-relaxed"
          />

          <div className="flex flex-wrap gap-4 pt-2 text-chip text-primary">
            {profession.competenciesBn.map((compBn, idx) => {
              const compEn = profession.competenciesEn?.[idx] || compBn;
              return (
                <span key={idx} className="flex items-center gap-1.5">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} />
                  <LocaleTitle
                    as="span"
                    titleEn={compEn}
                    titleBn={compBn}
                    className="text-chip"
                  />
                </span>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-between text-chip text-muted-foreground border-b border-border pb-3">
        <LocaleTitle
          as="span"
          titleEn={`Step-by-Step Learning Sequence (${professionScenarios.length} Scenarios)`}
          titleBn={`ধাপে ধাপে শেখার দৃশ্যপট (${professionScenarios.length}টি দৃশ্যপট)`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {professionScenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>
    </PageContainer>
  );
}
