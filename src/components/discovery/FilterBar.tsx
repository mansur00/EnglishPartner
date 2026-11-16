"use client";

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
    <div className="sticky top-16 z-10 flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-card/95 backdrop-blur border border-border shadow-2xs">
      <div className="flex items-center gap-1.5 text-muted-foreground font-semibold uppercase tracking-wider text-[11px] mr-1">
        <HugeiconsIcon icon={FilterIcon} size={14} className="text-primary" />
        <span>Filters:</span>
      </div>

      {/* Level Filter */}
      <Select
        value={level}
        onValueChange={(val) => setLevel((val as string) || "all")}
      >
        <SelectTrigger className="w-[145px] h-8 text-xs bg-card border-border">
          <SelectValue placeholder="All Levels (CEFR)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels (CEFR)</SelectItem>
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
        <SelectTrigger className="w-[145px] h-8 text-xs bg-card border-border">
          <SelectValue placeholder="Any Length" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Length</SelectItem>
          <SelectItem value="short">Short (4-6 turns)</SelectItem>
          <SelectItem value="medium">Medium (7-10 turns)</SelectItem>
        </SelectContent>
      </Select>

      {/* Style Filter */}
      <Select
        value={style}
        onValueChange={(val) => setStyle((val as string) || "all")}
      >
        <SelectTrigger className="w-[155px] h-8 text-xs bg-card border-border">
          <SelectValue placeholder="Any Register" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any Style</SelectItem>
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
          className="btn-press h-8 text-xs gap-1 ml-auto"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={13} />
          <span>Reset Filters</span>
        </Button>
      )}
    </div>
  );
}
