import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProfessionScenariosGrid } from "@/components/professions/ProfessionScenariosGrid";
import { Skeleton } from "@/components/ui/skeleton";
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

async function ProfessionContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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

function ProfessionLoadingFallback() {
  return (
    <div className="w-full lg:pr-80 xl:pr-96">
      <div className="w-full px-4 sm:px-6 lg:px-9 py-6 pb-16 space-y-6">
        <Skeleton className="h-32 w-full rounded-card" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full rounded-card" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfessionDetailPage({ params }: ProfessionPageProps) {
  return (
    <Suspense fallback={<ProfessionLoadingFallback />}>
      <ProfessionContent params={params} />
    </Suspense>
  );
}
