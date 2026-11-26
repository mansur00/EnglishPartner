"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ScenarioCard } from "@/components/discovery/ScenarioCard";
import { FilterBar } from "@/components/discovery/FilterBar";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupPrefix,
  InputGroupSuffix,
} from "@/components/ui/input-group";
import { LocaleTitle } from "@/components/shared";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Search01Icon,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [lengthType, setLengthType] = useState("all");
  const [style, setStyle] = useState("all");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return scenarios.filter((item) => {
      if (q) {
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.titleBn.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.descriptionBn.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      if (level !== "all" && item.level !== level) return false;
      if (lengthType !== "all") {
        const tier = getLengthTierById(lengthType);
        if (tier && item.level !== tier.cefrLevel) return false;
      }
      return true;
    });
  }, [scenarios, searchQuery, level, lengthType]);

  const isFiltered =
    searchQuery.trim() !== "" ||
    level !== "all" ||
    lengthType !== "all" ||
    style !== "all";

  const handleReset = () => {
    setSearchQuery("");
    setLevel("all");
    setLengthType("all");
    setStyle("all");
  };

  const sidebarContent = (
    <>
      {/* Search Input */}
      <div className="space-y-2">
        <p className="text-chip uppercase tracking-wider text-muted-foreground">
          {locale === "bn" ? "অনুসন্ধান" : "Search"}
        </p>
        <InputGroup className="bg-muted/30">
          <InputGroupPrefix>
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              className="text-muted-foreground"
            />
          </InputGroupPrefix>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("discovery.searchPlaceholder", locale)}
            variant="ghost"
            inputSize="default"
            className="w-full pl-11 pr-11 text-body h-control-lg"
          />
          {searchQuery && (
            <InputGroupSuffix>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="p-1.5 rounded-control text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </InputGroupSuffix>
          )}
        </InputGroup>
      </div>

      {/* Track Details & Competencies */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <p className="text-chip uppercase tracking-wider text-muted-foreground">
          {locale === "bn" ? "ট্র্যাক বিবরণ" : "Track Details"}
        </p>

        <LocaleTitle
          as="p"
          titleEn={profession.description || profession.descriptionBn}
          titleBn={profession.descriptionBn}
          className="text-meta text-muted-foreground leading-relaxed"
        />

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
      <div className="pt-3 border-t border-border/60">
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
        {/* Explore-Style Header Card */}
        <Card className="p-5 sm:p-6 bg-card border border-border shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <Link
                href="/professions"
                className="inline-flex items-center gap-1.5 text-meta text-muted-foreground hover:text-foreground transition-colors mb-2"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                <LocaleTitle
                  as="span"
                  titleEn="All Career Tracks"
                  titleBn="সব প্রফেশনাল পাথ"
                />
              </Link>
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
                className="text-meta text-muted-foreground mt-1"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              <Badge variant="accent" size="sm" className="text-chip">
                {profession.targetCefr}
              </Badge>
              <Badge variant="outline" size="sm" className="font-mono">
                {filtered.length} {locale === "bn" ? "টি দৃশ্যপট" : `scenario${filtered.length !== 1 ? "s" : ""}`}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Mobile/Tablet Search, Details & Filters Fallback */}
        <Card className="lg:hidden p-4 sm:p-5 bg-card border border-border space-y-4 shadow-xs">
          {sidebarContent}
        </Card>

        {/* Scenarios Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                ? "এই ফিল্টারের জন্য কোনো দৃশ্যপট নেই। ফিল্টার রিসেট করুন।"
                : "No scenarios match your current search or filter."
            }
            action={
              <Button variant="outline" size="md" onClick={handleReset} className="btn-press rounded-control">
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
