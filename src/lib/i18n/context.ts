"use client";

import { createContext } from "react";
import type { SupportedLocale, TranslationLocale } from "./languages.ts";

export interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (newLocale: SupportedLocale) => void;
  translationLocale: TranslationLocale;
  setTranslationLocale: (newTrans: TranslationLocale) => void;
  t: (key: string, overrideLocale?: SupportedLocale) => string;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);
