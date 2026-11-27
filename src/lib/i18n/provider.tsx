"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  type SupportedLocale,
  type TranslationLocale,
  isValidGlobalLanguage,
  isRtlLanguage,
} from "./languages.ts";
import { t as translate } from "./index.ts";
import { LocaleContext } from "./context.ts";

export function LocaleProvider({
  children,
  initialLocale = "en",
  initialTranslationLocale = "bn",
}: {
  children: React.ReactNode;
  initialLocale?: SupportedLocale;
  initialTranslationLocale?: TranslationLocale;
}) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    if (isValidGlobalLanguage(initialLocale) && initialLocale !== "none") {
      return initialLocale;
    }
    return "en";
  });

  const [translationLocale, setTranslationLocaleState] = useState<TranslationLocale>(() => {
    if (isValidGlobalLanguage(initialTranslationLocale)) {
      return initialTranslationLocale;
    }
    return "bn";
  });

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    if (!isValidGlobalLanguage(newLocale) || newLocale === "none") return;
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

  const setTranslationLocale = useCallback((newTrans: TranslationLocale) => {
    if (!isValidGlobalLanguage(newTrans)) return;
    setTranslationLocaleState(newTrans);

    try {
      localStorage.setItem("ecp_translation_locale", newTrans);
      localStorage.setItem("ecp_bilingual_mode", (newTrans !== "none").toString());
      document.cookie = `ecp_translation_locale=${newTrans}; path=/; max-age=31536000; SameSite=Lax`;
      window.dispatchEvent(new CustomEvent("ecp_translation_locale_change", { detail: newTrans }));
    } catch {
      // LocalStorage / document unavailable
    }
  }, []);

  useEffect(() => {
    // Defer localStorage hydration to a macrotask so all <Suspense> boundaries
    // finish hydrating with the server's initialLocale before switching.
    const hydrateTimer = setTimeout(() => {
      try {
        const savedLocale = localStorage.getItem("ecp_user_locale") as SupportedLocale | null;
        if (savedLocale && isValidGlobalLanguage(savedLocale) && savedLocale !== "none" && savedLocale !== locale) {
          setLocaleState(savedLocale);
          document.cookie = `ecp_user_locale=${savedLocale}; path=/; max-age=31536000; SameSite=Lax`;
          document.documentElement.lang = savedLocale;
          document.documentElement.dir = isRtlLanguage(savedLocale) ? "rtl" : "ltr";
        }

        const savedTrans = localStorage.getItem("ecp_translation_locale") as TranslationLocale | null;
        if (savedTrans && isValidGlobalLanguage(savedTrans) && savedTrans !== translationLocale) {
          setTranslationLocaleState(savedTrans);
          document.cookie = `ecp_translation_locale=${savedTrans}; path=/; max-age=31536000; SameSite=Lax`;
        }
      } catch {
        // LocalStorage unavailable
      }
    }, 0);

    const handleLocaleChange = (e: Event) => {
      const customEvent = e as CustomEvent<SupportedLocale>;
      if (
        customEvent.detail &&
        isValidGlobalLanguage(customEvent.detail) &&
        customEvent.detail !== "none"
      ) {
        setLocaleState(customEvent.detail);
      }
    };

    const handleTransChange = (e: Event) => {
      const customEvent = e as CustomEvent<TranslationLocale>;
      if (
        customEvent.detail &&
        isValidGlobalLanguage(customEvent.detail)
      ) {
        setTranslationLocaleState(customEvent.detail);
      }
    };

    window.addEventListener("ecp_locale_change", handleLocaleChange);
    window.addEventListener("ecp_translation_locale_change", handleTransChange);
    return () => {
      clearTimeout(hydrateTimer);
      window.removeEventListener("ecp_locale_change", handleLocaleChange);
      window.removeEventListener("ecp_translation_locale_change", handleTransChange);
    };
  }, [locale, translationLocale]);

  const t = useCallback(
    (key: string, overrideLocale?: SupportedLocale) => translate(key, overrideLocale || locale),
    [locale]
  );

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale,
        translationLocale,
        setTranslationLocale,
        t,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}
