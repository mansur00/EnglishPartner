import { notFound } from "next/navigation";
import { ProfessionScenariosGrid } from "@/components/professions/ProfessionScenariosGrid";
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
    <ProfessionScenariosGrid
      profession={profession}
      scenarios={professionScenarios}
    />
  );
}
