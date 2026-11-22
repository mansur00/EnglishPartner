/**
 * Multi-Language Registry & Strategy Framework (Milestone 4B)
 * Complies with ECP_Phase_Plan.md §7.1 (Track 4B) and
 * ECP_Multi_Language_Strategy.md §3 & §13.3.
 */

export type LanguageStatus = "available" | "beta" | "planned";
export type TextDirection = "ltr" | "rtl";

export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  script: "Bengali" | "Latin" | "Devanagari" | "Arabic";
  direction: TextDirection;
  status: LanguageStatus;
  fontFamily: string;
  sampleGreeting: string;
}

export const LANGUAGES_REGISTRY: Record<string, LanguageMeta> = {
  bn: {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    script: "Bengali",
    direction: "ltr",
    status: "available",
    fontFamily: "var(--font-bangla)",
    sampleGreeting: "নমস্কার / আসসালামু আলাইকুম",
  },
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    script: "Latin",
    direction: "ltr",
    status: "available",
    fontFamily: "var(--font-sans)",
    sampleGreeting: "Hello, good day!",
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    script: "Devanagari",
    direction: "ltr",
    status: "beta",
    fontFamily: "var(--font-sans)",
    sampleGreeting: "नमस्ते!",
  },
  ur: {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    script: "Arabic",
    direction: "rtl",
    status: "planned",
    fontFamily: "var(--font-sans)",
    sampleGreeting: "السلام علیکم!",
  },
  ar: {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    script: "Arabic",
    direction: "rtl",
    status: "planned",
    fontFamily: "var(--font-sans)",
    sampleGreeting: "مرحباً!",
  },
};

export const SUPPORTED_LOCALES = ["en", "bn", "hi"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function getLanguageMeta(code: string): LanguageMeta | undefined {
  return LANGUAGES_REGISTRY[code];
}

export function isRtlLanguage(code: string): boolean {
  return LANGUAGES_REGISTRY[code]?.direction === "rtl";
}

export function getAllLanguages(): LanguageMeta[] {
  return Object.values(LANGUAGES_REGISTRY);
}

export function getAvailableLanguages(): LanguageMeta[] {
  return Object.values(LANGUAGES_REGISTRY).filter((l) => l.status !== "planned");
}
