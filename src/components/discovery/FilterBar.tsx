"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon, Cancel01Icon } from "@hugeicons/core-free-icons";

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
    <div className="flex flex-wrap items-center gap-3 p-3.5 bg-[var(--ecp-surface)] border border-[var(--ecp-border)] rounded-xl text-xs">
      <div className="flex items-center gap-1.5 text-[var(--ecp-text-muted)] font-semibold uppercase tracking-wider text-[11px] mr-1">
        <HugeiconsIcon icon={FilterIcon} size={14} />
        <span>Filters:</span>
      </div>

      {/* Level Filter */}
      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className="h-8 px-2.5 rounded-lg border border-[var(--ecp-border)] bg-[var(--ecp-surface)] text-[var(--ecp-text-primary)] font-medium focus:outline-none focus:ring-1 focus:ring-[var(--ecp-brand-800)] cursor-pointer"
      >
        <option value="all">All Levels (CEFR)</option>
        <option value="A1">A1 • Beginner</option>
        <option value="A2">A2 • Elementary</option>
        <option value="B1">B1 • Intermediate</option>
        <option value="B2">B2 • Upper Intermediate</option>
      </select>

      {/* Length Filter */}
      <select
        value={lengthType}
        onChange={(e) => setLengthType(e.target.value)}
        className="h-8 px-2.5 rounded-lg border border-[var(--ecp-border)] bg-[var(--ecp-surface)] text-[var(--ecp-text-primary)] font-medium focus:outline-none focus:ring-1 focus:ring-[var(--ecp-brand-800)] cursor-pointer"
      >
        <option value="all">Any Length</option>
        <option value="short">Short (4-6 turns)</option>
        <option value="medium">Medium (7-10 turns)</option>
      </select>

      {/* Style Filter */}
      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="h-8 px-2.5 rounded-lg border border-[var(--ecp-border)] bg-[var(--ecp-surface)] text-[var(--ecp-text-primary)] font-medium focus:outline-none focus:ring-1 focus:ring-[var(--ecp-brand-800)] cursor-pointer"
      >
        <option value="all">Any Style</option>
        <option value="casual">Casual / Friendly</option>
        <option value="neutral">Neutral Everyday</option>
        <option value="formal">Formal / Professional</option>
      </select>

      {/* Reset Filter Button */}
      {isFiltered && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[var(--ecp-error)] bg-[var(--ecp-error-surface)] rounded-md hover:opacity-90 transition-opacity ml-auto cursor-pointer"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={12} />
          Reset Filters
        </button>
      )}
    </div>
  );
}
