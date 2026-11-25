/**
 * Saved Vocabulary Categories Store
 * ---------------------------------------------------------------------------
 * Allows learners to organize saved words into custom Magic-style category
 * decks while keeping `ecp_saved_vocabulary` synced for SRS & stats.
 */

export interface SavedVocabCategory {
  id: string;
  name: string;
  emoji: string;
  lemmas: string[];
  createdAt: string;
}

export const SAVED_CATEGORIES_STORAGE_KEY = "ecp_saved_vocab_categories";
export const SAVED_VOCAB_STORAGE_KEY = "ecp_saved_vocabulary";

export const DEFAULT_CATEGORY_EMOJIS = ["⭐", "💬", "💼", "✈️", "🎯", "📚", "💡", "🔥"];

export const DEFAULT_SAVED_CATEGORIES: SavedVocabCategory[] = [
  {
    id: "cat-favorites",
    name: "Favorites",
    emoji: "⭐",
    lemmas: ["excuse", "cost", "jacket", "certainly", "discount", "passport", "wireframes"],
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

export function loadSavedCategories(fallbackLemmas: string[] = []): SavedVocabCategory[] {
  if (typeof window === "undefined") {
    return DEFAULT_SAVED_CATEGORIES;
  }
  try {
    const raw = localStorage.getItem(SAVED_CATEGORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore parse errors
  }

  // Seed default Favorites category from existing saved lemmas
  const initialLemmas =
    fallbackLemmas.length > 0 ? fallbackLemmas : DEFAULT_SAVED_CATEGORIES[0].lemmas;
  return [
    {
      ...DEFAULT_SAVED_CATEGORIES[0],
      lemmas: Array.from(new Set(initialLemmas)),
    },
  ];
}

export function persistSavedCategories(categories: SavedVocabCategory[]): string[] {
  const allUniqueLemmas = Array.from(
    new Set(categories.flatMap((c) => c.lemmas.map((l) => l.toLowerCase())))
  );
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SAVED_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      localStorage.setItem(SAVED_VOCAB_STORAGE_KEY, JSON.stringify(allUniqueLemmas));
    } catch {
      // Ignore storage errors
    }
  }
  return allUniqueLemmas;
}

export function createCategoryInList(
  categories: SavedVocabCategory[],
  name: string,
  emoji: string
): { categories: SavedVocabCategory[]; created: SavedVocabCategory } {
  const trimmed = name.trim();
  const created: SavedVocabCategory = {
    id: `cat-${Date.now()}`,
    name: trimmed || "My Words",
    emoji: emoji || "⭐",
    lemmas: [],
    createdAt: new Date().toISOString(),
  };
  return {
    categories: [...categories, created],
    created,
  };
}

export function addLemmaToCategory(
  categories: SavedVocabCategory[],
  lemma: string,
  categoryId: string
): SavedVocabCategory[] {
  const clean = lemma.toLowerCase().trim();
  return categories.map((cat) => {
    if (cat.id !== categoryId) return cat;
    if (cat.lemmas.includes(clean)) return cat;
    return { ...cat, lemmas: [...cat.lemmas, clean] };
  });
}

export function removeLemmaFromCategory(
  categories: SavedVocabCategory[],
  lemma: string,
  categoryId: string
): SavedVocabCategory[] {
  const clean = lemma.toLowerCase().trim();
  return categories.map((cat) => {
    if (cat.id !== categoryId) return cat;
    return { ...cat, lemmas: cat.lemmas.filter((l) => l !== clean) };
  });
}

export function removeLemmaEverywhere(
  categories: SavedVocabCategory[],
  lemma: string
): SavedVocabCategory[] {
  const clean = lemma.toLowerCase().trim();
  return categories.map((cat) => ({
    ...cat,
    lemmas: cat.lemmas.filter((l) => l !== clean),
  }));
}
