"use client";

import { useEffect, useState } from "react";
import type { WordDetails, WordDetailsRequest } from "./word-details-schema";

const STORAGE_KEY = "ecp_word_details_cache_v1";
const MAX_CACHED_WORDS = 100;
const memoryCache = new Map<string, WordDetails>();

function getCacheKey(req: WordDetailsRequest): string {
  return `${req.word.trim().toLowerCase()}::${(req.partOfSpeech || "").trim().toLowerCase()}`;
}

function readFromStorage(key: string): WordDetails | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, WordDetails>;
    return parsed[key] || null;
  } catch {
    return null;
  }
}

function writeToStorage(key: string, value: WordDetails): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: Record<string, WordDetails> = raw ? JSON.parse(raw) : {};
    const keys = Object.keys(parsed);
    if (keys.length >= MAX_CACHED_WORDS && !parsed[key]) {
      delete parsed[keys[0]];
    }
    parsed[key] = value;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore storage quota errors
  }
}

export function useWordDetails(
  request: WordDetailsRequest | null,
  enabled = true
): { details: WordDetails | null; isLoading: boolean } {
  const wordKey = request && enabled ? getCacheKey(request) : "";
  const [fetched, setFetched] = useState<{ key: string; data: WordDetails } | null>(null);
  const [loadingKey, setLoadingKey] = useState<string>("");

  const cachedSync =
    wordKey
      ? memoryCache.get(wordKey) || readFromStorage(wordKey)
      : null;

  useEffect(() => {
    if (!request || !enabled || !wordKey) return;
    if (memoryCache.has(wordKey) || readFromStorage(wordKey)) return;

    const controller = new AbortController();
    Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        setLoadingKey(wordKey);
      }
    });

    fetch("/api/v1/ai/word-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: WordDetails | null) => {
        if (controller.signal.aborted || !data) return;
        memoryCache.set(wordKey, data);
        writeToStorage(wordKey, data);
        setFetched({ key: wordKey, data });
      })
      .catch(() => {
        // ignore abort/network error
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingKey((prev) => (prev === wordKey ? "" : prev));
        }
      });

    return () => {
      controller.abort();
    };
  }, [wordKey, enabled, request]);

  const activeDetails = cachedSync || (fetched?.key === wordKey ? fetched.data : null);
  const isLoading = Boolean(wordKey && !activeDetails && loadingKey === wordKey);

  return { details: activeDetails, isLoading };
}
