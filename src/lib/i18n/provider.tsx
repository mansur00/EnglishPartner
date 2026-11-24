"use client";

import React, { useState, useEffect, useCallback } from "react";
import { type SupportedLocale, SUPPORTED_LOCALES, isRtlLanguage } from "./languages.ts";
import { t as translate } from "./index.ts";
import { LocaleContext } from "./context.ts";

export function LocaleProvider({
  children,
  initialLocale = "bn",
}: {
  children: React.ReactNode;
  initialLocale?: SupportedLocale;
}) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    if ((SUPPORTED_LOCALES as readonly string[]).includes(initialLocale)) {
      return initialLocale;
    }
    return "bn";
  });

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    if (!(SUPPORTED_LOCALES as readonly string[]).includes(newLocale)) return;
    setLocaleState(newLocale);

    try {
      localStorage.setItem("ecp_user_locale", newLocale);
      document.cookie = `ecp_user_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = newLocale;
      document.documentElement.dir = isRtlLanguage(newLocale) ? "rtl" : "ltr";
      window.dispatchEvent(new CustomEvent("ecp_locale_change", { detail: newLocale }));
    } catch {
      // LocalStorage / document unavailable
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ecp_user_locale") as SupportedLocale | null;
      if (saved && (SUPPORTED_LOCALES as readonly string[]).includes(saved) && saved !== locale) {
        setLocaleState(saved);
        document.cookie = `ecp_user_locale=${saved}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = saved;
        document.documentElement.dir = isRtlLanguage(saved) ? "rtl" : "ltr";
      }
    } catch {
      // LocalStorage unavailable
    }

    const handleLocaleChange = (e: Event) => {
      const customEvent = e as CustomEvent<SupportedLocale>;
      if (
        customEvent.detail &&
        (SUPPORTED_LOCALES as readonly string[]).includes(customEvent.detail)
      ) {
        setLocaleState(customEvent.detail);
      }
    };

    window.addEventListener("ecp_locale_change", handleLocaleChange);
    return () => {
      window.removeEventListener("ecp_locale_change", handleLocaleChange);
    };
  }, [locale]);

  const t = useCallback((key: string) => translate(key, locale), [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
