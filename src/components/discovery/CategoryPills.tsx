"use client";

import { cn } from "@/lib/utils";
import { CATEGORIES_LIST } from "@/content/seed/scenarios";
import { getCategoryTheme } from "@/lib/theme/category-theme";

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export function CategoryPills({
  selectedCategory,
  onSelectCategory,
}: CategoryPillsProps) {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
      {CATEGORIES_LIST.map((cat) => {
        const isSelected = selectedCategory === cat.slug;
        const theme = getCategoryTheme(cat.slug);
        return (
          <div
            key={cat.id}
            data-topic={theme.topic}
            className={cn("rounded-full shrink-0", isSelected && "rainbow-border")}
          >
            <button
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={cn(
                "btn-press h-10 px-4 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer border flex items-center gap-1.5",
                isSelected
                  ? "bg-[var(--topic-tile)] text-[var(--topic-ink)] border-transparent shadow-xs font-semibold"
                  : "bg-[var(--topic-surface)] text-[var(--topic-ink)] border-[var(--topic-border)] hover:bg-[var(--topic-tile)]"
              )}
            >
              <span>{cat.name}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
