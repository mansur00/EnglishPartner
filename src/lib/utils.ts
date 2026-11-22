import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-page-title",
        "text-hero-title",
        "text-card-title",
        "text-lead",
        "text-body",
        "text-meta",
        "text-label",
        "text-chip",
        "text-stat",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
