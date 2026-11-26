"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/lib/auth/session";
import type { AppConfigPayload } from "@/app/api/v1/app-config/route";

const UI_PREFERENCE_KEYS = new Set([
  "ecp_user_locale",
  "ecp_translation_locale",
  "ecp_audio_accent",
  "ecp_audio_gender",
  "ecp_audio_tone",
  "ecp_audio_speed",
  "ecp_audio_auto_play",
  "ecp_audio_preferred_voice_uri",
  "ecp_active_uid",
]);

const DEFAULT_CONFIG: AppConfigPayload = {
  ai_daily_limit: 50,
  guest_preview_enabled: true,
  guest_preview_percent: 5,
  system_notice_enabled: false,
  system_notice: "",
};

interface SessionAccessContextValue {
  user: UserProfile | null;
  isGuest: boolean;
  ready: boolean;
  config: AppConfigPayload;
  getGuestLimit: (total: number, minItems?: number) => number;
}

const SessionAccessContext = createContext<SessionAccessContextValue>({
  user: null,
  isGuest: true,
  ready: false,
  config: DEFAULT_CONFIG,
  getGuestLimit: (total, minItems = 1) =>
    Math.max(minItems, Math.ceil(total * 0.05)),
});

export function useSessionAccess() {
  return useContext(SessionAccessContext);
}

export function notifyAppConfigUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ecp-app-config-updated"));
  }
}

function isProgressKey(key: string): boolean {
  return (
    key.startsWith("ecp_") &&
    !key.startsWith("ecp_u_") &&
    !UI_PREFERENCE_KEYS.has(key)
  );
}

function collectProgressSnapshot(): Record<string, string> {
  const snapshot: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && isProgressKey(key)) {
      const val = localStorage.getItem(key);
      if (val !== null) snapshot[key] = val;
    }
  }
  return snapshot;
}

function clearProgressKeys() {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && isProgressKey(key)) keys.push(key);
  }
  keys.forEach((k) => localStorage.removeItem(k));
}

function applyProgressSnapshot(snapshot: Record<string, unknown>) {
  clearProgressKeys();
  for (const [k, v] of Object.entries(snapshot)) {
    if (isProgressKey(k) && typeof v === "string") {
      localStorage.setItem(k, v);
    }
  }
}

// Install synchronous Guest no-cache guard on browser load before child effects read localStorage
let guestGuardInstalled = false;
function ensureGuestNoCacheGuard() {
  if (typeof window === "undefined" || guestGuardInstalled) return;
  guestGuardInstalled = true;

  const origSetItem = window.localStorage.setItem.bind(window.localStorage);
  window.localStorage.setItem = function (key: string, value: string) {
    // Block persisting any progress/session cache when in Guest mode (no active logged-in uid)
    if (isProgressKey(key) && !window.localStorage.getItem("ecp_active_uid")) {
      return;
    }
    return origSetItem(key, value);
  };

  if (!window.localStorage.getItem("ecp_active_uid")) {
    clearProgressKeys();
    try {
      window.sessionStorage.clear();
    } catch {
      // Ignore sessionStorage errors
    }
  }
}

export function SessionIsolationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  ensureGuestNoCacheGuard();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [config, setConfig] = useState<AppConfigPayload>(DEFAULT_CONFIG);

  const loadConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/app-config", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.config) setConfig(data.config);
    } catch {
      // Fallback to default config
    }
  }, []);

  const syncSession = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/auth/me", { cache: "no-store" });
      const data = res.ok ? await res.json() : { user: null };
      const profile: UserProfile | null = data?.user ?? null;
      const prevUid = localStorage.getItem("ecp_active_uid");

      if (!profile) {
        // Guest rule: no session persistence across reloads
        if (prevUid) {
          localStorage.setItem(
            `ecp_u_${prevUid}`,
            JSON.stringify(collectProgressSnapshot())
          );
          localStorage.removeItem("ecp_active_uid");
        }
        clearProgressKeys();
        setUser(null);
      } else if (profile.is_active === false) {
        // Force sign out if Admin disabled this account
        const supabase = createBrowserSupabaseClient();
        await supabase.auth.signOut();
        localStorage.removeItem("ecp_active_uid");
        clearProgressKeys();
        setUser(null);
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login?disabled=1";
        }
      } else {
        // Logged-in user: isolate progress per user_id + hydrate from Supabase
        if (prevUid && prevUid !== profile.id) {
          localStorage.setItem(
            `ecp_u_${prevUid}`,
            JSON.stringify(collectProgressSnapshot())
          );
        }

        if (prevUid !== profile.id) {
          localStorage.setItem("ecp_active_uid", profile.id);
          clearProgressKeys();
          let hydrated: Record<string, unknown> | null = null;
          try {
            const pRes = await fetch("/api/v1/user/progress", { cache: "no-store" });
            if (pRes.ok) {
              const pData = await pRes.json();
              if (pData?.progress && Object.keys(pData.progress).length > 0) {
                hydrated = pData.progress;
              }
            }
          } catch {
            // Fallback to local user cache
          }
          if (!hydrated) {
            const localUserRaw = localStorage.getItem(`ecp_u_${profile.id}`);
            if (localUserRaw) {
              hydrated = JSON.parse(localUserRaw);
            }
          }
          if (hydrated) {
            applyProgressSnapshot(hydrated);
          }
        }
        setUser(profile);
      }
    } catch {
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadConfig();
      void syncSession();
    });

    const supabase = createBrowserSupabaseClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void syncSession();
    });

    const onConfigUpdated = () => void loadConfig();
    window.addEventListener("ecp-app-config-updated", onConfigUpdated);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("ecp-app-config-updated", onConfigUpdated);
    };
  }, [loadConfig, syncSession]);

  // Persist logged-in user's progress OR wipe guest progress on unload
  useEffect(() => {
    const flushState = () => {
      if (!user) {
        clearProgressKeys();
        return;
      }
      const snap = collectProgressSnapshot();
      localStorage.setItem(`ecp_u_${user.id}`, JSON.stringify(snap));
      fetch("/api/v1/user/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: snap }),
        keepalive: true,
      }).catch(() => {});
    };

    const interval = user ? setInterval(flushState, 15000) : null;
    window.addEventListener("pagehide", flushState);
    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener("pagehide", flushState);
    };
  }, [user]);

  const getGuestLimit = useCallback(
    (total: number, minItems = 1) => {
      if (user) return total;
      if (!config.guest_preview_enabled) return 0;
      return Math.max(minItems, Math.ceil((total * config.guest_preview_percent) / 100));
    },
    [user, config.guest_preview_enabled, config.guest_preview_percent]
  );

  return (
    <SessionAccessContext.Provider
      value={{
        user,
        isGuest: !user,
        ready,
        config,
        getGuestLimit,
      }}
    >
      {config.system_notice_enabled && config.system_notice.trim().length > 0 && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 text-center text-chip text-foreground flex items-center justify-center gap-2">
          <HugeiconsIcon icon={InformationCircleIcon} size={15} className="text-primary shrink-0" />
          <span>{config.system_notice}</span>
          {!user && (
            <Link href="/auth/login" className="text-primary font-semibold hover:underline ml-1">
              Log in
            </Link>
          )}
        </div>
      )}
      {children}
    </SessionAccessContext.Provider>
  );
}
