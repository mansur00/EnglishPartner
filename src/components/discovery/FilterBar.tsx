"use client";

import { t } from "@/lib/i18n";
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

interface FilterBarProps {
  level: string;
  setLevel: (lvl: string) => void;
  lengthType: string;
  setLengthType: (len: string) => void;
  style: string;
  setStyle: (st: string) => void;
  onReset: () => void;
  isFiltered: boolean;
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
}: FilterBarProps) {
  return (
    <div className="sticky top-header z-10 flex flex-wrap items-center gap-3 p-3.5 rounded-card bg-card/95 backdrop-blur border border-border shadow-2xs">
      <div className="flex items-center gap-2 text-muted-foreground uppercase tracking-wider text-label mr-1">
        <HugeiconsIcon icon={FilterIcon} size={16} className="text-primary" />
        <span>{t("discovery.filters")}</span>
      </div>

      {/* Level Filter */}
      <Select
        value={level}
        onValueChange={(val) => setLevel((val as string) || "all")}
      >
        <SelectTrigger className="w-40 h-control-md text-label bg-card border-border">
          <SelectValue placeholder={t("discovery.allLevels")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("discovery.allLevels")}</SelectItem>
          <SelectItem value="A1">A1 • Beginner</SelectItem>
          <SelectItem value="A2">A2 • Elementary</SelectItem>
          <SelectItem value="B1">B1 • Intermediate</SelectItem>
          <SelectItem value="B2">B2 • Upper Intermediate</SelectItem>
        </SelectContent>
      </Select>

      {/* Length Filter */}
      <Select
        value={lengthType}
        onValueChange={(val) => setLengthType((val as string) || "all")}
      >
        <SelectTrigger className="w-40 h-control-md text-label bg-card border-border">
          <SelectValue placeholder={t("discovery.anyLength")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("discovery.anyLength")}</SelectItem>
          <SelectItem value="short">{t("discovery.shortLength")}</SelectItem>
          <SelectItem value="medium">{t("discovery.mediumLength")}</SelectItem>
        </SelectContent>
      </Select>

      {/* Style Filter */}
      <Select
        value={style}
        onValueChange={(val) => setStyle((val as string) || "all")}
      >
        <SelectTrigger className="w-44 h-control-md text-label bg-card border-border">
          <SelectValue placeholder={t("discovery.anyStyle")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("discovery.anyStyle")}</SelectItem>
          <SelectItem value="casual">Casual / Friendly</SelectItem>
          <SelectItem value="neutral">Neutral Everyday</SelectItem>
          <SelectItem value="formal">Formal / Professional</SelectItem>
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
          <span>{t("discovery.resetFilters")}</span>
        </Button>
      )}
    </div>
  );
}
