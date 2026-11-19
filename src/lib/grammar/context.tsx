"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { GrammarLayerId, DetailLevel } from "./types";

interface GrammarContextValue {
  isGlobalOn: boolean;
  activeLayers: GrammarLayerId[];
  detailLevel: DetailLevel;
  showLabels: boolean;
  focusedKey: string | null;
  toggleGlobal: () => void;
  toggleLine: (lineId: string) => void;
  isLineActive: (lineId: string) => boolean;
  toggleLayer: (layer: GrammarLayerId) => void;
  setDetailLevel: (level: DetailLevel) => void;
  setShowLabels: (show: boolean) => void;
  setFocusedKey: (key: string | null) => void;
  clearFocus: () => void;
  resetAll: () => void;
}

const STORAGE_KEY = "ep_grammar_global_on";

const GrammarContext = createContext<GrammarContextValue | null>(null);

export function GrammarProvider({ children }: { children: React.ReactNode }) {
  const [isGlobalOn, setIsGlobalOn] = useState(false);
  const [activeLayers, setActiveLayers] = useState<GrammarLayerId[]>(["pos"]);
  const [detailLevel, setDetailLevel] = useState<DetailLevel>("basic");
  const [showLabels, setShowLabels] = useState(false);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);

  // Per-line overrides: map lineId -> boolean
  const [lineOverrides, setLineOverrides] = useState<Map<string, boolean>>(
    new Map()
  );

  // Hydration-safe initial state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        queueMicrotask(() => {
          setIsGlobalOn(stored === "true");
        });
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const toggleGlobal = useCallback(() => {
    setIsGlobalOn((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
    // Clear per-turn overrides when global switch is toggled
    setLineOverrides(new Map());
  }, []);

  const toggleLine = useCallback((lineId: string) => {
    setLineOverrides((prev) => {
      const next = new Map(prev);
      const current = prev.has(lineId) ? prev.get(lineId)! : false;
      next.set(lineId, !current);
      return next;
    });
  }, []);

  const isLineActive = useCallback(
    (lineId: string): boolean => {
      if (lineOverrides.has(lineId)) {
        return lineOverrides.get(lineId)!;
      }
      return isGlobalOn;
    },
    [isGlobalOn, lineOverrides]
  );

  const toggleLayer = useCallback((layer: GrammarLayerId) => {
    setActiveLayers((prev) => {
      if (prev.includes(layer)) {
        // Keep at least one layer active
        if (prev.length === 1) return prev;
        return prev.filter((l) => l !== layer);
      }
      return [...prev, layer];
    });
  }, []);

  const clearFocus = useCallback(() => {
    setFocusedKey(null);
  }, []);

  const resetAll = useCallback(() => {
    setIsGlobalOn(false);
    setActiveLayers(["pos"]);
    setDetailLevel("basic");
    setShowLabels(false);
    setFocusedKey(null);
    setLineOverrides(new Map());
    try {
      localStorage.setItem(STORAGE_KEY, "false");
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      isGlobalOn,
      activeLayers,
      detailLevel,
      showLabels,
      focusedKey,
      toggleGlobal,
      toggleLine,
      isLineActive,
      toggleLayer,
      setDetailLevel,
      setShowLabels,
      setFocusedKey,
      clearFocus,
      resetAll,
    }),
    [
      isGlobalOn,
      activeLayers,
      detailLevel,
      showLabels,
      focusedKey,
      toggleGlobal,
      toggleLine,
      isLineActive,
      toggleLayer,
      clearFocus,
      resetAll,
    ]
  );

  return (
    <GrammarContext.Provider value={value}>{children}</GrammarContext.Provider>
  );
}

export function useGrammar(): GrammarContextValue {
  const ctx = useContext(GrammarContext);
  if (!ctx) {
    // Graceful fallback for components used outside Provider
    return {
      isGlobalOn: false,
      activeLayers: ["pos"],
      detailLevel: "basic",
      showLabels: false,
      focusedKey: null,
      toggleGlobal: () => {},
      toggleLine: () => {},
      isLineActive: () => false,
      toggleLayer: () => {},
      setDetailLevel: () => {},
      setShowLabels: () => {},
      setFocusedKey: () => {},
      clearFocus: () => {},
      resetAll: () => {},
    };
  }
  return ctx;
}
