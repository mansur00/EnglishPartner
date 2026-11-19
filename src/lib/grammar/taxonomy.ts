import taxonomyData from "@/content/grammar/taxonomy.json";
import labelsEn from "@/content/grammar/labels.en.json";
import labelsBn from "@/content/grammar/labels.bn.json";
import rulesEn from "@/content/grammar/rules.en.json";
import rulesBn from "@/content/grammar/rules.bn.json";
import type {
  TaxonomyRegistry,
  TaxonomyCategory,
  GrammarLabel,
  GrammarRuleCard,
  GrammarLayerId,
  DetailLevel,
} from "./types";

const registry = taxonomyData as unknown as TaxonomyRegistry;
const typedLabelsEn = labelsEn as unknown as Record<string, GrammarLabel>;
const typedLabelsBn = labelsBn as unknown as Record<string, GrammarLabel>;
const typedRulesEn = rulesEn as unknown as Record<string, GrammarRuleCard>;
const typedRulesBn = rulesBn as unknown as Record<string, GrammarRuleCard>;

export function getTaxonomy(): TaxonomyRegistry {
  return registry;
}

export function getCategory(key: string): TaxonomyCategory | undefined {
  return registry.categories[key];
}

export function getLabel(key: string, lang: "en" | "bn" = "bn"): GrammarLabel {
  const dict = lang === "bn" ? typedLabelsBn : typedLabelsEn;
  if (dict[key]) return dict[key];
  if (typedLabelsEn[key]) return typedLabelsEn[key];
  return {
    name: key,
    description: key,
    layer: "pos",
    level: "basic",
    short: key.slice(0, 4).toUpperCase(),
    gloss: key,
  };
}

export function getRuleCard(key: string, lang: "en" | "bn" = "bn"): GrammarRuleCard | undefined {
  const dict = lang === "bn" ? typedRulesBn : typedRulesEn;
  return dict[key] || typedRulesEn[key];
}

export function getCategoriesForLayer(layer: GrammarLayerId, level: DetailLevel = "basic"): TaxonomyCategory[] {
  const categories = Object.values(registry.categories).filter((cat) => cat.layer === layer);
  if (level === "basic") {
    return categories.filter((cat) => cat.basic);
  }
  return categories;
}
