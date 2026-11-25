"use client";

import { t, useLocale } from "@/lib/i18n";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getLengthTiersForLevel, getLengthTierById } from "@/lib/content/length-tiers";

interface FilterBarProps {
  level: string;
  setLevel: (lvl: string) => void;
  lengthType: string;
  setLengthType: (len: string) => void;
  style: string;
  setStyle: (st: string) => void;
  onReset: () => void;
  isFiltered: boolean;
  embedded?: boolean;
}

export function FilterBar({
  level,
  setLevel,
  lengthType,
  setLengthType,
  style,
  setStyle,
  onReset,
  isFiltered,
  embedded = false,
}: FilterBarProps) {
  const locale = useLocale();
  const visibleTiers = getLengthTiersForLevel(level);

  const handleLevelChange = (val: string | null) => {
    const nextLevel = val || "all";
    setLevel(nextLevel);
    if (lengthType !== "all") {
      const curTier = getLengthTierById(lengthType);
      if (nextLevel !== "all" && curTier && curTier.cefrLevel !== nextLevel) {
        setLengthType("all");
      }
    }
  };

  return (
    <div
      className={
        embedded
          ? "flex flex-wrap items-center gap-3"
          : "sticky top-header z-10 flex flex-wrap items-center gap-3 p-4 rounded-card bg-card/95 backdrop-blur shadow-xs border-0"
      }
    >
      <div className="flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-label mr-1">
        <HugeiconsIcon icon={FilterIcon} size={16} className="text-primary" />
        <span>{t("discovery.filters", locale)}</span>
      </div>

      {/* Level Filter (A1 - C2) */}
      <Select value={level} onValueChange={handleLevelChange}>
        <SelectTrigger className="w-52 h-control-md text-label border border-input bg-transparent">
          <SelectValue>
            {(val) => {
              if (!val || val === "all") return t("discovery.allLevels", locale);
              const map: Record<string, string> = {
                A1: t("discovery.beginner", locale),
                A2: t("discovery.elementary", locale),
                B1: t("discovery.intermediate", locale),
                B2: t("discovery.upperIntermediate", locale),
                C1: locale === "bn" ? "C1 • উন্নত" : "C1 • Advanced",
                C2: locale === "bn" ? "C2 • দক্ষ" : "C2 • Mastery",
              };
              return map[val as string] || val;
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("discovery.allLevels", locale)}</SelectItem>
          <SelectItem value="A1">{t("discovery.beginner", locale)}</SelectItem>
          <SelectItem value="A2">{t("discovery.elementary", locale)}</SelectItem>
          <SelectItem value="B1">{t("discovery.intermediate", locale)}</SelectItem>
          <SelectItem value="B2">{t("discovery.upperIntermediate", locale)}</SelectItem>
          <SelectItem value="C1">{locale === "bn" ? "C1 • উন্নত" : "C1 • Advanced"}</SelectItem>
          <SelectItem value="C2">{locale === "bn" ? "C2 • দক্ষ" : "C2 • Mastery"}</SelectItem>
        </SelectContent>
      </Select>

      {/* Length Filter: 4 tiers per selected CEFR level (24 total) */}
      <Select
        value={lengthType}
        onValueChange={(val) => setLengthType((val as string) || "all")}
      >
        <SelectTrigger className="w-52 h-control-md text-label border border-input bg-transparent">
          <SelectValue>
            {(val) => {
              if (!val || val === "all") return t("discovery.anyLength", locale);
              const tier = getLengthTierById(String(val));
              if (!tier) return val;
              const label = locale === "bn" ? tier.labelBn : tier.labelEn;
              return `${tier.cefrLevel} • ${label}`;
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-72 overflow-y-auto">
          <SelectItem value="all">{t("discovery.anyLength", locale)}</SelectItem>
          {visibleTiers.map((tier) => {
            const label = locale === "bn" ? tier.labelBn : tier.labelEn;
            return (
              <SelectItem key={tier.id} value={tier.id}>
                {level === "all" ? `${tier.cefrLevel} • ${label}` : label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {/* Style Filter */}
      <Select
        value={style}
        onValueChange={(val) => setStyle((val as string) || "all")}
      >
        <SelectTrigger className="w-48 h-control-md text-label border border-input bg-transparent">
          <SelectValue>
            {(val) => {
              if (!val || val === "all") return t("discovery.anyStyle", locale);
              const map: Record<string, string> = {
                casual: t("discovery.casual", locale),
                neutral: t("discovery.neutral", locale),
                formal: t("discovery.formal", locale),
              };
              return map[val as string] || val;
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("discovery.anyStyle", locale)}</SelectItem>
          <SelectItem value="casual">{t("discovery.casual", locale)}</SelectItem>
          <SelectItem value="neutral">{t("discovery.neutral", locale)}</SelectItem>
          <SelectItem value="formal">{t("discovery.formal", locale)}</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset Filter Button */}
      {isFiltered && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onReset}
          className="btn-press h-control-md text-label gap-1.5 ml-auto px-4 rounded-control"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
          <span>{t("discovery.resetFilters", locale)}</span>
        </Button>
      )}
    </div>
  );
}
