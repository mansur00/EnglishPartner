"use client";

import { createContext } from "react";
import type { SupportedLocale } from "./languages.ts";

export interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (newLocale: SupportedLocale) => void;
  t: (key: string) => string;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);
