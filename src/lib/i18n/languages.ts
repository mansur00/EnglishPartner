/**
 * Multi-Language Registry & Global Searchable Language Catalog
 * Supports two-tier language architecture:
 * 1. System Language (App UI)
 * 2. Translation Language (Words, Sentences & Explanations)
 */

export type LanguageStatus = "available" | "beta" | "planned";
export type TextDirection = "ltr" | "rtl";

export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
  script: "Bengali" | "Latin" | "Devanagari" | "Arabic" | "CJK" | "Cyrillic" | "Other";
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

export const EXTRA_GLOBAL_LANGUAGES: LanguageMeta[] = [
  { code: "es", name: "Spanish", nativeName: "Español", script: "Latin", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "¡Hola!" },
  { code: "fr", name: "French", nativeName: "Français", script: "Latin", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "Bonjour !" },
  { code: "de", name: "German", nativeName: "Deutsch", script: "Latin", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "Hallo!" },
  { code: "pt", name: "Portuguese", nativeName: "Português", script: "Latin", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "Olá!" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", script: "Latin", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "Merhaba!" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", script: "Latin", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "Halo!" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", script: "Latin", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "Hai!" },
  { code: "ja", name: "Japanese", nativeName: "日本語", script: "CJK", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "こんにちは！" },
  { code: "ko", name: "Korean", nativeName: "한국어", script: "CJK", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "안녕하세요!" },
  { code: "zh", name: "Chinese", nativeName: "中文", script: "CJK", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "你好！" },
  { code: "ru", name: "Russian", nativeName: "Русский", script: "Cyrillic", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "Привет!" },
  { code: "it", name: "Italian", nativeName: "Italiano", script: "Latin", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "Ciao!" },
  { code: "th", name: "Thai", nativeName: "ไทย", script: "Other", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "สวัสดี!" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", script: "Latin", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "Xin chào!" },
  { code: "fa", name: "Persian", nativeName: "فارسی", script: "Arabic", direction: "rtl", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "سلام!" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", script: "Other", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "வணக்கம்!" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", script: "Other", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "నమస్కారం!" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", script: "Devanagari", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "नमस्कार!" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", script: "Other", direction: "ltr", status: "beta", fontFamily: "var(--font-sans)", sampleGreeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ!" },
];

export const GLOBAL_LANGUAGES: LanguageMeta[] = [
  ...Object.values(LANGUAGES_REGISTRY),
  ...EXTRA_GLOBAL_LANGUAGES,
];

export const SUPPORTED_LOCALES = ["en", "bn", "hi"] as const;
export type SupportedLocale = string;

export const TRANSLATION_LOCALES = ["bn", "hi", "none"] as const;
export type TranslationLocale = string;

export function isValidGlobalLanguage(code: string): boolean {
  return code === "none" || GLOBAL_LANGUAGES.some((l) => l.code === code);
}

export function getLanguageMeta(code: string): LanguageMeta | undefined {
  return GLOBAL_LANGUAGES.find((l) => l.code === code);
}

export function searchGlobalLanguages(query: string): LanguageMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return GLOBAL_LANGUAGES;
  return GLOBAL_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
  );
}

export function isRtlLanguage(code: string): boolean {
  return getLanguageMeta(code)?.direction === "rtl";
}

export function getAllLanguages(): LanguageMeta[] {
  return Object.values(LANGUAGES_REGISTRY);
}

export function getAvailableLanguages(): LanguageMeta[] {
  return Object.values(LANGUAGES_REGISTRY).filter((l) => l.status !== "planned");
}
