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
  const [userDisabled, setUserDisabled] = useState<string[]>([]);
  const [items, setItems] = useState<FeatureFlagItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [fRes, meRes] = await Promise.all([
        fetch("/api/v1/features", { cache: "no-store" }),
        fetch("/api/v1/auth/me", { cache: "no-store" }),
      ]);
      if (fRes.ok) {
        const data = await fRes.json();
        if (data?.flags && typeof data.flags === "object") {
          setFlagsMap({ ...DEFAULT_FLAGS, ...data.flags });
        }
        if (Array.isArray(data?.items)) {
          setItems(data.items);
        }
      }
      if (meRes.ok) {
        const meData = await meRes.json();
        const disabled = meData?.user?.disabled_features;
        setUserDisabled(Array.isArray(disabled) ? disabled : []);
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
    (key: string) => flagsMap[key] !== false && !userDisabled.includes(key),
    [flagsMap, userDisabled]
  );

  return { flagsMap, userDisabled, items, loading, isEnabled, refresh };
}
