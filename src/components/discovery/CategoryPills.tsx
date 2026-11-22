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
            className={cn("rounded-pill shrink-0", isSelected && "rainbow-border")}
          >
            <button
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={cn(
                "btn-press h-control-sm px-4 rounded-pill text-label whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5",
                isSelected
                  ? "bg-card text-foreground shadow-xs"
                  : "border border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
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
