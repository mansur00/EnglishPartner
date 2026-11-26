"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ScenarioCard } from "@/components/discovery/ScenarioCard";
import { FilterBar } from "@/components/discovery/FilterBar";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LocaleTitle } from "@/components/shared";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Briefcase01Icon,
  CheckmarkCircle02Icon,
  SearchXIcon,
} from "@hugeicons/core-free-icons";
import { getLengthTierById } from "@/lib/content/length-tiers";
import { useLocale, t } from "@/lib/i18n";
import type { ScenarioItem } from "@/content/seed/scenarios";
import type { ProfessionMeta } from "@/lib/professions/registry";

interface ProfessionScenariosGridProps {
  profession: ProfessionMeta;
  scenarios: ScenarioItem[];
}

export function ProfessionScenariosGrid({
  profession,
  scenarios,
}: ProfessionScenariosGridProps) {
  const locale = useLocale();
  const [level, setLevel] = useState("all");
  const [lengthType, setLengthType] = useState("all");
  const [style, setStyle] = useState("all");

  const filtered = useMemo(() => {
    return scenarios.filter((item) => {
      if (level !== "all" && item.level !== level) return false;
      if (lengthType !== "all") {
        const tier = getLengthTierById(lengthType);
        if (tier && item.level !== tier.cefrLevel) return false;
      }
      return true;
    });
  }, [scenarios, level, lengthType]);

  const isFiltered = level !== "all" || lengthType !== "all" || style !== "all";

  const handleReset = () => {
    setLevel("all");
    setLengthType("all");
    setStyle("all");
  };

  const sidebarContent = (
    <>
      {/* Track Details & Competencies */}
      <div className="space-y-3">
        <p className="text-chip uppercase tracking-wider text-muted-foreground">
          {locale === "bn" ? "ট্র্যাক বিবরণ" : "Track Details"}
        </p>

        <div className="p-3.5 rounded-panel bg-muted/50 space-y-2.5">
          <LocaleTitle
            as="p"
            titleEn={profession.tagline}
            titleBn={profession.taglineBn}
            className="text-label font-semibold text-primary"
          />
          <LocaleTitle
            as="p"
            titleEn={profession.description || profession.descriptionBn}
            titleBn={profession.descriptionBn}
            className="text-meta text-muted-foreground leading-relaxed"
          />
        </div>

        <div className="space-y-2 pt-1">
          <p className="text-chip uppercase tracking-wider text-muted-foreground">
            {t("professions.competenciesLabel", locale)}
          </p>
          <ul className="space-y-1.5">
            {profession.competenciesBn.map((compBn, idx) => {
              const compEn = profession.competenciesEn?.[idx] || compBn;
              return (
                <li key={idx} className="flex items-start gap-2 text-meta text-foreground">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={16}
                    className="text-primary shrink-0 mt-0.5"
                  />
                  <LocaleTitle as="span" titleEn={compEn} titleBn={compBn} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Filters */}
      <div className="pt-4 border-t border-border/60">
        <FilterBar
          level={level}
          setLevel={setLevel}
          lengthType={lengthType}
          setLengthType={setLengthType}
          style={style}
          setStyle={setStyle}
          onReset={handleReset}
          isFiltered={isFiltered}
          embedded
          sidebar
        />
      </div>
    </>
  );

  return (
    <div className="w-full lg:pr-80 xl:pr-96">
      {/* ================= MIDDLE CONTENT AREA ================= */}
      <div className="w-full px-4 sm:px-6 lg:px-9 py-6 pb-16 space-y-6">
        <div className="space-y-3">
          <Link href="/professions">
            <Button variant="ghost" size="sm" className="btn-back-nav text-label">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              <LocaleTitle
                as="span"
                titleEn="All Career Tracks"
                titleBn="সব প্রফেশনাল পাথ"
              />
            </Button>
          </Link>

          {/* Compact Header Card */}
          <Card className="p-5 sm:p-6 bg-card border border-border rounded-card space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between gap-2 flex-wrap">
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
              <Badge variant="outline" size="sm" className="font-mono">
                {filtered.length} {locale === "bn" ? "টি দৃশ্যপট" : "Scenarios"}
              </Badge>
            </div>

            <LocaleTitle
              as="h1"
              titleEn={profession.name}
              titleBn={profession.nameBn}
              className="text-page-title text-foreground"
            />
          </Card>
        </div>

        {/* Mobile/Tablet Details & Filters Fallback */}
        <Card className="lg:hidden p-4 sm:p-5 bg-card border border-border space-y-4">
          {sidebarContent}
        </Card>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                selectedLengthTierId={lengthType !== "all" ? lengthType : undefined}
                selectedStyle={style !== "all" ? style : undefined}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<HugeiconsIcon icon={SearchXIcon} size={28} />}
            title={t("discovery.noConversationsFound", locale)}
            description={
              locale === "bn"
                ? "এই লেভেলের জন্য কোনো দৃশ্যপট নেই। ফিল্টার রিসেট করুন।"
                : "No scenarios match this level filter in this career track."
            }
            action={
              <Button variant="outline" size="sm" onClick={handleReset}>
                {t("discovery.resetFilters", locale)}
              </Button>
            }
          />
        )}
      </div>

      {/* ================= FIXED RIGHT SIDEBAR ================= */}
      <aside className="hidden lg:flex flex-col fixed right-0 top-header h-below-header w-80 xl:w-96 border-l border-border bg-card z-sidebar overflow-y-auto p-4 space-y-5">
        {sidebarContent}
      </aside>
    </div>
  );
}
