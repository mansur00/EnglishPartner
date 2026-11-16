"use client";

import { cn } from "@/lib/utils";
import { CATEGORIES_LIST } from "@/content/seed/scenarios";

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export function CategoryPills({
  selectedCategory,
  onSelectCategory,
}: CategoryPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
      {CATEGORIES_LIST.map((cat) => {
        const isSelected = selectedCategory === cat.slug;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.slug)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer border",
              isSelected
                ? "bg-[var(--ecp-brand-800)] text-white border-[var(--ecp-brand-800)] shadow-sm"
                : "bg-[var(--ecp-surface)] text-[var(--ecp-text-secondary)] border-[var(--ecp-border)] hover:border-[var(--ecp-brand-700)]/40 hover:text-[var(--ecp-text-primary)]"
            )}
          >
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
