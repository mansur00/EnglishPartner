import Link from "next/link";
import { notFound } from "next/navigation";
import { ScenarioCard } from "@/components/discovery/ScenarioCard";
import { Button } from "@/components/ui/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { SEED_SCENARIOS, CATEGORIES_LIST } from "@/content/seed/scenarios";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CATEGORIES_LIST.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES_LIST.find((c) => c.slug === slug);

  if (!category && slug !== "all") {
    notFound();
  }

  const categoryScenarios = SEED_SCENARIOS.filter((item) =>
    slug === "all" ? true : item.categories.some((c) => c.slug === slug)
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="space-y-3">
        <Link href="/explore">
          <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-xs">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            Back to All Topics
          </Button>
        </Link>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--ecp-brand-950)]">
            {category?.name || "Category"}
          </h1>
          <p className="text-sm text-[var(--ecp-text-secondary)] font-[var(--ecp-font-bangla)] mt-1">
            {category?.nameBn} — বাস্তব কথোপকথন চর্চা করুন
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-[var(--ecp-text-muted)] border-b border-[var(--ecp-border)] pb-3">
        <span>{categoryScenarios.length} Scenarios Available</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoryScenarios.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>
    </div>
  );
}
