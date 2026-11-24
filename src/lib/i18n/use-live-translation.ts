"use client";

import { useState, useEffect, useMemo } from "react";

const memoryCache = new Map<string, string>();

function getStorageCacheKey(lang: string) {
  return `ecp_live_trans_v1_${lang}`;
}

function readLocalCache(lang: string): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(getStorageCacheKey(lang));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {
    // Ignore storage errors
  }
  return {};
}

function writeLocalCache(lang: string, updates: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    const existing = readLocalCache(lang);
    const merged = { ...existing, ...updates };
    // Keep cache bounded to 500 entries per language
    const keys = Object.keys(merged);
    if (keys.length > 500) {
      const trimmed: Record<string, string> = {};
      for (const k of keys.slice(keys.length - 500)) {
        trimmed[k] = merged[k];
      }
      localStorage.setItem(getStorageCacheKey(lang), JSON.stringify(trimmed));
    } else {
      localStorage.setItem(getStorageCacheKey(lang), JSON.stringify(merged));
    }
  } catch {
    // Ignore storage errors
  }
}

export function useLiveTranslations(texts: string[], targetLang: string) {
  const [resolvedMap, setResolvedMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const textsKey = useMemo(() => texts.filter(Boolean).join("||"), [texts]);

  useEffect(() => {
    if (!targetLang || targetLang === "none" || targetLang === "en" || !textsKey) {
      setResolvedMap({});
      setIsLoading(false);
      return;
    }

    const cleanTexts = Array.from(new Set(texts.map((t) => t.trim()).filter(Boolean)));
    if (cleanTexts.length === 0) return;

    const localCache = readLocalCache(targetLang);
    const initial: Record<string, string> = {};
    const missing: string[] = [];

    for (const text of cleanTexts) {
      const memKey = `${targetLang}:${text}`;
      const fromMem = memoryCache.get(memKey);
      const fromLocal = localCache[text];
      if (fromMem) {
        initial[text] = fromMem;
      } else if (fromLocal) {
        memoryCache.set(memKey, fromLocal);
        initial[text] = fromLocal;
      } else {
        missing.push(text);
      }
    }

    if (Object.keys(initial).length > 0) {
      setResolvedMap((prev) => ({ ...prev, ...initial }));
    }

    if (missing.length === 0) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetch("/api/v1/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: missing, targetLang }),
    })
      .then((res) => (res.ok ? res.json() : { translations: {} }))
      .then((data) => {
        if (cancelled) return;
        const incoming: Record<string, string> = data?.translations || {};
        if (Object.keys(incoming).length > 0) {
          for (const [orig, tr] of Object.entries(incoming)) {
            memoryCache.set(`${targetLang}:${orig}`, tr);
          }
          writeLocalCache(targetLang, incoming);
          setResolvedMap((prev) => ({ ...prev, ...incoming }));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [textsKey, targetLang]); // eslint-disable-line react-hooks/exhaustive-deps

  return { translations: resolvedMap, isLoading };
}

export function useLiveTranslation(text: string | undefined, targetLang: string) {
  const arr = useMemo(() => (text ? [text] : []), [text]);
  const { translations, isLoading } = useLiveTranslations(arr, targetLang);
  const trimmed = text?.trim() || "";
  return {
    translatedText: trimmed ? translations[trimmed] || "" : "",
    isLoading,
  };
}
