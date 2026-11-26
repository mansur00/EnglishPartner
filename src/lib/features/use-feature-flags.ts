"use client";

import { useState, useEffect, useCallback } from "react";

export interface FeatureFlagItem {
  key: string;
  label: string;
  label_bn: string;
  description: string;
  enabled: boolean;
}

const DEFAULT_FLAGS: Record<string, boolean> = {
  ai_partner: true,
  spell_master: true,
  challenge_90: true,
  grammar_checker: true,
  quiz: true,
};

export function notifyFeatureFlagsUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ecp-feature-flags-updated"));
  }
}

export function useFeatureFlags() {
  const [flagsMap, setFlagsMap] = useState<Record<string, boolean>>(DEFAULT_FLAGS);
  const [items, setItems] = useState<FeatureFlagItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/features", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.flags && typeof data.flags === "object") {
        setFlagsMap({ ...DEFAULT_FLAGS, ...data.flags });
      }
      if (Array.isArray(data?.items)) {
        setItems(data.items);
      }
    } catch {
      // Keep default flags on network error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void refresh();
    });
    const onUpdated = () => {
      void refresh();
    };
    window.addEventListener("ecp-feature-flags-updated", onUpdated);
    return () => window.removeEventListener("ecp-feature-flags-updated", onUpdated);
  }, [refresh]);

  const isEnabled = useCallback(
    (key: string) => flagsMap[key] !== false,
    [flagsMap]
  );

  return { flagsMap, items, loading, isEnabled, refresh };
}
