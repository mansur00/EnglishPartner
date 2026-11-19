import type { ConversationAnnotation, LineAnnotation } from "./types";
import { createFallbackAnnotation } from "./fallback";

// Registry of known static annotations in data/grammar/
const ANNOTATION_IMPORTERS: Record<string, () => Promise<{ default: unknown }>> = {
  "asking-price-product-details": () =>
    import("../../../data/grammar/asking-price-product-details.json"),
  "airport-checkin-baggage-drop": () =>
    import("../../../data/grammar/airport-checkin-baggage-drop.json"),
  "designer-client-kickoff-questions": () =>
    import("../../../data/grammar/designer-client-kickoff-questions.json"),
};

// In-memory cache for loaded annotations
const annotationCache = new Map<string, ConversationAnnotation>();

export async function loadConversationAnnotation(
  slug: string
): Promise<ConversationAnnotation | null> {
  if (annotationCache.has(slug)) {
    return annotationCache.get(slug)!;
  }

  const importer = ANNOTATION_IMPORTERS[slug];
  if (!importer) {
    return null;
  }

  try {
    const mod = await importer();
    const data = (mod.default ?? mod) as ConversationAnnotation;
    annotationCache.set(slug, data);
    return data;
  } catch (err) {
    console.warn(`[grammar/loader] Failed to load annotation for ${slug}:`, err);
    return null;
  }
}

export function getCachedConversationAnnotation(
  slug: string
): ConversationAnnotation | null {
  return annotationCache.get(slug) || null;
}

export function getLineAnnotation(
  slug: string,
  lineId: string,
  lineText: string
): LineAnnotation {
  const conv = annotationCache.get(slug);
  if (conv) {
    const line = conv.lines.find(
      (l) => l.lineId === lineId || l.text.trim() === lineText.trim()
    );
    if (line) return line;
  }

  // Fallback if not yet loaded or missing from dataset
  return createFallbackAnnotation(lineId, lineText);
}
