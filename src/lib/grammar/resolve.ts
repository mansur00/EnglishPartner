import type {
  LineAnnotation,
  RenderToken,
  GrammarLayerId,
  DetailLevel,
} from "./types";
import { getLabel } from "./taxonomy";

export interface ResolveOptions {
  activeLayers: Set<GrammarLayerId> | GrammarLayerId[];
  detailLevel: DetailLevel;
  showLabels: boolean;
  focusedKey?: string | null;
  minConfidence?: number;
  lang?: "en" | "bn";
}

export function resolveRenderTokens(
  annotation: LineAnnotation,
  options: ResolveOptions
): RenderToken[] {
  const {
    activeLayers,
    detailLevel,
    showLabels,
    focusedKey,
    minConfidence = 0.6,
    lang = "bn",
  } = options;

  const layerSet = new Set(activeLayers);
  const isPosActive = layerSet.has("pos");
  const isRoleActive = layerSet.has("role");
  const isTenseActive = layerSet.has("tense");
  const isPatternActive = layerSet.has("pattern");

  // Map token index -> verb group (if any)
  const verbGroupMap = new Map<
    number,
    {
      time: "past" | "present" | "future" | null;
      aspect: "simple" | "continuous" | "perfect" | "perfect-continuous" | null;
      edge: "start" | "mid" | "end" | "only";
      keys?: string[];
    }
  >();

  if (isTenseActive && annotation.groups) {
    for (const group of annotation.groups) {
      if (group.type === "verb-group" && group.tokens.length > 0) {
        const sorted = [...group.tokens].sort((a, b) => a - b);
        sorted.forEach((tokIdx, idx) => {
          let edge: "start" | "mid" | "end" | "only" = "only";
          if (sorted.length > 1) {
            if (idx === 0) edge = "start";
            else if (idx === sorted.length - 1) edge = "end";
            else edge = "mid";
          }
          verbGroupMap.set(tokIdx, {
            time: group.time ?? null,
            aspect: group.aspect ?? null,
            edge,
            keys: group.keys,
          });
        });
      }
    }
  }

  // Map token index -> pattern (if any)
  const patternMap = new Map<
    number,
    {
      family?: string;
      key?: string;
      edge: "start" | "mid" | "end" | "only";
    }
  >();

  if (isPatternActive && annotation.groups) {
    for (const group of annotation.groups) {
      if (group.type === "pattern" && group.tokens.length > 0) {
        const sorted = [...group.tokens].sort((a, b) => a - b);
        sorted.forEach((tokIdx, idx) => {
          let edge: "start" | "mid" | "end" | "only" = "only";
          if (sorted.length > 1) {
            if (idx === 0) edge = "start";
            else if (idx === sorted.length - 1) edge = "end";
            else edge = "mid";
          }
          patternMap.set(tokIdx, {
            family: group.family,
            key: group.key,
            edge,
          });
        });
      }
    }
  }

  return annotation.tokens.map((token) => {
    const isPunctuation = token.pos === "punctuation";
    const hasConfidence = token.confidence >= minConfidence;

    // Determine POS
    const pos = isPosActive && !isPunctuation ? token.pos : "unannotated";
    const sub = detailLevel === "advanced" && hasConfidence ? token.sub : null;

    // Determine Role
    const role = isRoleActive && !isPunctuation && hasConfidence ? token.role : null;

    // Determine Verb Group Tense
    const vg = isTenseActive ? verbGroupMap.get(token.i) : undefined;
    const tenseTime = vg?.time ?? null;
    const tenseAspect = vg?.aspect ?? null;

    // Determine Pattern
    const pat = isPatternActive ? patternMap.get(token.i) : undefined;
    const patternFamily = pat?.family ?? null;
    const patternKey = pat?.key ?? null;

    // Edge
    const edge = vg?.edge || pat?.edge || undefined;

    // Focus Matching
    let isFocused = false;
    if (focusedKey) {
      if (
        token.pos === focusedKey ||
        token.sub === focusedKey ||
        token.role === focusedKey ||
        tenseTime === focusedKey ||
        tenseAspect === focusedKey ||
        patternKey === focusedKey ||
        patternFamily === focusedKey ||
        (vg?.keys && vg.keys.includes(focusedKey))
      ) {
        isFocused = true;
      }
    }

    // Ruby Label (for Show labels non-color cue)
    let rubyLabel: string | null = null;
    if (showLabels && !isPunctuation) {
      if (isRoleActive && role) {
        const l = getLabel(role, lang);
        rubyLabel = l.short || l.name;
      } else if (isPosActive && pos !== "unannotated") {
        const l = getLabel(pos, lang);
        rubyLabel = l.short || l.name;
      }
    }

    return {
      ...token,
      pos,
      sub,
      role,
      edge,
      tenseTime,
      tenseAspect,
      patternFamily,
      patternKey,
      rubyLabel,
      isFocused,
    };
  });
}
