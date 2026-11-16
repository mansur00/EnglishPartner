/**
 * Topic and category theme mappings for EnglishPartner Design System v2.
 * Connects category slugs to data-topic values and friendly visual metadata.
 */

export interface CategoryTheme {
  name: string;
  slug: string;
  topic: "shopping" | "travel" | "health" | "social" | "workplace" | "professional";
  emoji: string;
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  "shopping-and-money": {
    name: "Shopping & Money",
    slug: "shopping-and-money",
    topic: "shopping",
    emoji: "🛍️",
  },
  "travel-transport": {
    name: "Travel & Transport",
    slug: "travel-transport",
    topic: "travel",
    emoji: "✈️",
  },
  "health-medical": {
    name: "Health & Medical",
    slug: "health-medical",
    topic: "health",
    emoji: "🏥",
  },
  "social-daily": {
    name: "Daily & Social Life",
    slug: "social-daily",
    topic: "social",
    emoji: "☕",
  },
  "workplace-business": {
    name: "Workplace & Office",
    slug: "workplace-business",
    topic: "workplace",
    emoji: "💼",
  },
  professional: {
    name: "Professional Tracks",
    slug: "professional",
    topic: "professional",
    emoji: "🎓",
  },
};

const DEFAULT_THEME: CategoryTheme = CATEGORY_THEMES["social-daily"];

export function getCategoryTheme(categorySlug?: string): CategoryTheme {
  if (!categorySlug) return DEFAULT_THEME;
  const normalized = categorySlug.toLowerCase().trim();
  return CATEGORY_THEMES[normalized] || DEFAULT_THEME;
}
