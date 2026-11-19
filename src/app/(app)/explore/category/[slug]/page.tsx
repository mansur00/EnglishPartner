import Link from "next/link";
import { notFound } from "next/navigation";
import { ScenarioCard } from "@/components/discovery/ScenarioCard";
import { NicheLadderRoadmap } from "@/components/learning/NicheLadderRoadmap";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { PageContainer } from "@/components/shared";
import { SEED_SCENARIOS, CATEGORIES_LIST } from "@/content/seed/scenarios";
import {
  NICHE_01_SHOPPING_MONEY,
  SHOPPING_MONEY_LADDER_STEPS,
} from "@/content/seed/niche_shopping_money";

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

  // If this is the Shopping category, render the 20-Step Conversation Ladder Roadmap!
  const isShoppingCategory = slug === "shopping-and-money" || slug === "shopping-money";

  return (
    <PageContainer className="space-y-6 pb-16">
      <div className="space-y-3">
        <Link href="/explore">
          <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-label rounded-control">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            Back to All Topics
          </Button>
        </Link>
      </div>

      {isShoppingCategory ? (
        <div className="space-y-10">
          {/* Niche 01: 20-Step Progressive Learning Ladder Roadmap */}
          <NicheLadderRoadmap
            steps={SHOPPING_MONEY_LADDER_STEPS}
            nicheTitle={NICHE_01_SHOPPING_MONEY.name}
            nicheTitleBn={NICHE_01_SHOPPING_MONEY.nameBn}
            description={NICHE_01_SHOPPING_MONEY.description}
            descriptionBn={NICHE_01_SHOPPING_MONEY.descriptionBn}
          />

          {/* Additional standalone scenarios in this category */}
          {categoryScenarios.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-card-title text-foreground text-bangla">
                অন্যান্য প্রাসঙ্গিক দৃশ্যপট (Additional Practice Scenarios)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryScenarios.map((scenario) => (
                  <ScenarioCard key={scenario.id} scenario={scenario} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h1 className="text-page-title text-foreground">
              {category?.name || "Category"}
            </h1>
            <p className="text-meta text-muted-foreground text-bangla mt-1">
              {category?.nameBn} — বাস্তব কথোপকথন চর্চা করুন
            </p>
          </div>

          <div className="flex items-center justify-between text-chip text-muted-foreground border-b border-border pb-3">
            <span>{categoryScenarios.length} Scenarios Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryScenarios.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
