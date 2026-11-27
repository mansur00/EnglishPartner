"use client";

import { useContext } from "react";
import { LocaleContext, type LocaleContextValue } from "./context.ts";
import { t as translate } from "./index.ts";
import type { SupportedLocale, TranslationLocale } from "./languages.ts";

export function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: "en",
      setLocale: () => {},
      translationLocale: "bn",
      setTranslationLocale: () => {},
      t: (key: string, overrideLocale?: SupportedLocale) => translate(key, overrideLocale || "en"),
    };
  }
  return ctx;
}

export function useLocale(): SupportedLocale {
  const ctx = useLocaleContext();
  return ctx.locale;
}

export function useTranslationLocale(): TranslationLocale {
  const ctx = useLocaleContext();
  return ctx.translationLocale;
}

export function useTranslations() {
  const ctx = useLocaleContext();
  return {
    locale: ctx.locale,
    setLocale: ctx.setLocale,
    translationLocale: ctx.translationLocale,
    setTranslationLocale: ctx.setTranslationLocale,
    t: ctx.t,
  };
}
