/**
 * Per-category color and visual theme definitions.
 * Provides consistent category colors for icons, tags, hover borders, and top accents.
 */

export interface CategoryTheme {
  name: string;
  slug: string;
  colorVar: string;
  bgTintVar: string;
  borderVar: string;
  dotColor: string;
  iconBgLight: string;
  iconBgDark: string;
  textColorLight: string;
  textColorDark: string;
}

export const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  "shopping-and-money": {
    name: "Shopping & Money",
    slug: "shopping-and-money",
    colorVar: "var(--cat-shopping)",
    bgTintVar: "var(--cat-shopping-bg)",
    borderVar: "var(--cat-shopping-border)",
    dotColor: "#D97706",
    iconBgLight: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    iconBgDark: "dark:bg-amber-400/15 dark:text-amber-300 dark:border-amber-400/30",
    textColorLight: "text-amber-800",
    textColorDark: "dark:text-amber-300",
  },
  "travel-transport": {
    name: "Travel & Transport",
    slug: "travel-transport",
    colorVar: "var(--cat-travel)",
    bgTintVar: "var(--cat-travel-bg)",
    borderVar: "var(--cat-travel-border)",
    dotColor: "#0284C7",
    iconBgLight: "bg-sky-500/10 text-sky-700 border-sky-500/20",
    iconBgDark: "dark:bg-sky-400/15 dark:text-sky-300 dark:border-sky-400/30",
    textColorLight: "text-sky-800",
    textColorDark: "dark:text-sky-300",
  },
  "health-medical": {
    name: "Health & Medical",
    slug: "health-medical",
    colorVar: "var(--cat-health)",
    bgTintVar: "var(--cat-health-bg)",
    borderVar: "var(--cat-health-border)",
    dotColor: "#E11D48",
    iconBgLight: "bg-rose-500/10 text-rose-700 border-rose-500/20",
    iconBgDark: "dark:bg-rose-400/15 dark:text-rose-300 dark:border-rose-400/30",
    textColorLight: "text-rose-800",
    textColorDark: "dark:text-rose-300",
  },
  "social-daily": {
    name: "Daily & Social Life",
    slug: "social-daily",
    colorVar: "var(--cat-social)",
    bgTintVar: "var(--cat-social-bg)",
    borderVar: "var(--cat-social-border)",
    dotColor: "#7C3AED",
    iconBgLight: "bg-violet-500/10 text-violet-700 border-violet-500/20",
    iconBgDark: "dark:bg-violet-400/15 dark:text-violet-300 dark:border-violet-400/30",
    textColorLight: "text-violet-800",
    textColorDark: "dark:text-violet-300",
  },
  "workplace-business": {
    name: "Workplace & Office",
    slug: "workplace-business",
    colorVar: "var(--cat-workplace)",
    bgTintVar: "var(--cat-workplace-bg)",
    borderVar: "var(--cat-workplace-border)",
    dotColor: "#059669",
    iconBgLight: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    iconBgDark: "dark:bg-emerald-400/15 dark:text-emerald-300 dark:border-emerald-400/30",
    textColorLight: "text-emerald-800",
    textColorDark: "dark:text-emerald-300",
  },
  professional: {
    name: "Professional Tracks",
    slug: "professional",
    colorVar: "var(--cat-pro)",
    bgTintVar: "var(--cat-pro-bg)",
    borderVar: "var(--cat-pro-border)",
    dotColor: "#4F46E5",
    iconBgLight: "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
    iconBgDark: "dark:bg-indigo-400/15 dark:text-indigo-300 dark:border-indigo-400/30",
    textColorLight: "text-indigo-800",
    textColorDark: "dark:text-indigo-300",
  },
};

const DEFAULT_THEME: CategoryTheme = CATEGORY_THEMES["social-daily"];

export function getCategoryTheme(categorySlug?: string): CategoryTheme {
  if (!categorySlug) return DEFAULT_THEME;
  const normalized = categorySlug.toLowerCase().trim();
  return CATEGORY_THEMES[normalized] || DEFAULT_THEME;
}
