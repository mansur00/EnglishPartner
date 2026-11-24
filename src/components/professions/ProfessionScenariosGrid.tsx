"use client";

import { useState, useMemo } from "react";
import { ScenarioCard } from "@/components/discovery/ScenarioCard";
import { FilterBar } from "@/components/discovery/FilterBar";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { SearchXIcon } from "@hugeicons/core-free-icons";
import { getLengthTierById } from "@/lib/content/length-tiers";
import { useLocale, t } from "@/lib/i18n";
import type { ScenarioItem } from "@/content/seed/scenarios";

export function ProfessionScenariosGrid({ scenarios }: { scenarios: ScenarioItem[] }) {
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

  return (
    <div className="space-y-5">
      <FilterBar
        level={level}
        setLevel={setLevel}
        lengthType={lengthType}
        setLengthType={setLengthType}
        style={style}
        setStyle={setStyle}
        onReset={handleReset}
        isFiltered={isFiltered}
      />

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
  );
}
