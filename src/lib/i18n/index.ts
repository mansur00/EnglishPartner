import enMessages from "../../../messages/en.json" with { type: "json" };
import bnMessages from "../../../messages/bn.json" with { type: "json" };
import hiMessages from "../../../messages/hi.json" with { type: "json" };
import {
  isRtlLanguage,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from "./languages.ts";

export type Locale = SupportedLocale;

type MessageTree = {
  [key: string]: string | MessageTree;
};

const dictionaries: Record<Locale, MessageTree> = {
  en: enMessages as MessageTree,
  bn: bnMessages as MessageTree,
  hi: hiMessages as MessageTree,
};

function resolvePath(obj: MessageTree, path: string): string | undefined {
  const parts = path.split(".");
  let current: MessageTree | string | undefined = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, MessageTree | string>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}

/**
 * Meaning-based message lookup with fallback to English and key.
 */
export function t(key: string, locale: Locale = "en"): string {
  const dict = dictionaries[locale] || dictionaries.en;
  const translated = resolvePath(dict, key);
  if (translated) return translated;

  // Fallback to English
  if (locale !== "en") {
    const enFallback = resolvePath(dictionaries.en, key);
    if (enFallback) return enFallback;
  }

  return key;
}

export function getDictionary(locale: Locale = "en") {
  return dictionaries[locale] || dictionaries.en;
}

export function isRtlLocale(locale: string): boolean {
  return isRtlLanguage(locale);
}

export { SUPPORTED_LOCALES };
