"use client";

import { useState, useEffect } from "react";
import { type SupportedLocale, SUPPORTED_LOCALES } from "./languages.ts";
import { t } from "./index.ts";

export function useLocale(): SupportedLocale {
  const [locale, setLocale] = useState<SupportedLocale>("bn");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ecp_user_locale") as SupportedLocale | null;
      if (saved && (SUPPORTED_LOCALES as readonly string[]).includes(saved)) {
        queueMicrotask(() => {
          setLocale(saved);
        });
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
        setLocale(customEvent.detail);
      }
    };

    window.addEventListener("ecp_locale_change", handleLocaleChange);
    return () => {
      window.removeEventListener("ecp_locale_change", handleLocaleChange);
    };
  }, []);

  return locale;
}

export function useTranslations() {
  const locale = useLocale();
  return {
    locale,
    t: (key: string) => t(key, locale),
  };
}
