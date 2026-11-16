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
    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-1 no-scrollbar scroll-smooth">
      {CATEGORIES_LIST.map((cat) => {
        const isSelected = selectedCategory === cat.slug;
        return (
          <div
            key={cat.id}
            className={cn("rounded-full shrink-0", isSelected && "rainbow-border")}
          >
            <button
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={cn(
                "btn-press px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer border",
                isSelected
                  ? "bg-primary text-primary-foreground border-transparent shadow-xs"
                  : "bg-card text-muted-foreground border-border hover:border-border hover:text-foreground hover:bg-muted/50"
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
