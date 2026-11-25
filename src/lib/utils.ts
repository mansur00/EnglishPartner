import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-page-title",
        "text-hero-title",
        "text-section-heading",
        "text-card-title",
        "text-card-title-bn",
        "text-subtitle-bn",
        "text-lead",
        "text-body",
        "text-meta",
        "text-meta-bn",
        "text-meta-lead-bn",
        "text-label",
        "text-chip",
        "text-chip-bn",
        "text-chip-mono",
        "text-grammar-header",
        "text-stat",
      ],
      "font-family": ["text-bangla"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
