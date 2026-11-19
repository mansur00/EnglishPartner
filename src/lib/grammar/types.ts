/**
 * Grammar System Type Definitions (Phase 2)
 * Strictly typed structures for taxonomy, annotations, tokens, layers, and UI render models.
 */

export type GrammarLayerId = "pos" | "role" | "tense" | "phrase" | "pattern";

export type DetailLevel = "basic" | "advanced";

export interface TaxonomyCategory {
  id: string;
  layer: GrammarLayerId;
  name: string;
  basic: boolean;
  subtypes?: string[];
  description?: string;
  formula?: string;
  example?: string;
}

export interface TaxonomyRegistry {
  version: number;
  layers: Record<
    GrammarLayerId,
    {
      id: GrammarLayerId;
      name: string;
      channel: string;
      order: number;
    }
  >;
  categories: Record<string, TaxonomyCategory>;
}

export interface GrammarToken {
  i: number;
  text: string;
  start: number;
  end: number;
  lemma: string;
  pos: string;
  sub?: string | null;
  tag?: string;
  dep?: string;
  role?: string | null;
  head?: number;
  confidence: number;
  feats?: Record<string, string>;
}

export interface GrammarGroup {
  id: string;
  type: "verb-group" | "pattern" | "phrase" | "clause";
  tokens: number[];
  keys?: string[];
  key?: string;
  family?: string;
  time?: "past" | "present" | "future" | null;
  aspect?: "simple" | "continuous" | "perfect" | "perfect-continuous" | null;
  voice?: "voice-active" | "voice-passive" | string | null;
  confidence: number;
}

export interface GrammarSentence {
  function?: "declarative" | "interrogative" | "imperative" | "exclamatory" | string;
  structure?: "simple" | "compound" | "complex" | "compound-complex" | string;
}

export interface LineAnnotation {
  lineId: string;
  text: string;
  textHash: string;
  override?: boolean;
  tokens: GrammarToken[];
  groups?: GrammarGroup[];
  sentence?: GrammarSentence;
}

export interface ConversationAnnotation {
  taxonomyVersion: number;
  taggerVersion: string;
  sourceId: string;
  lines: LineAnnotation[];
}

export interface RenderToken extends GrammarToken {
  edge?: "start" | "mid" | "end" | "only";
  tenseTime?: "past" | "present" | "future" | null;
  tenseAspect?: "simple" | "continuous" | "perfect" | "perfect-continuous" | null;
  patternFamily?: string | null;
  patternKey?: string | null;
  phraseEdge?: "start" | "end" | "both";
  clauseEdge?: "start" | "end" | "both";
  rubyLabel?: string | null;
  isFocused?: boolean;
}

export interface GrammarLabel {
  name: string;
  description: string;
  layer: string;
  level: string;
  short?: string;
  gloss?: string;
  reviewed?: boolean;
}

export interface GrammarRuleExample {
  text: string;
  note: string;
}

export interface GrammarRuleCard {
  key: string;
  title: string;
  formula: string;
  explanation: string;
  usage: string[];
  examples: GrammarRuleExample[];
  commonMistakes: string[];
  related: string[];
  reviewed?: boolean;
}

export interface GrammarSourceSentence {
  id: string;
  text: string;
  lang: "en" | "bn";
}

export interface GrammarSourceDefinition {
  id: string;
  title: string;
  listSentences: (param?: string) => Promise<GrammarSourceSentence[]> | GrammarSourceSentence[];
}
