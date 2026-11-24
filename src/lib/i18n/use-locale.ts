"use client";

import { useContext } from "react";
import { LocaleContext, type LocaleContextValue } from "./context.ts";
import { t as translate } from "./index.ts";
import type { SupportedLocale } from "./languages.ts";

export function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: "bn",
      setLocale: () => {},
      t: (key: string) => translate(key, "bn"),
    };
  }
  return ctx;
}

export function useLocale(): SupportedLocale {
  const ctx = useLocaleContext();
  return ctx.locale;
}

export function useTranslations() {
  const ctx = useLocaleContext();
  return {
    locale: ctx.locale,
    setLocale: ctx.setLocale,
    t: ctx.t,
  };
}
