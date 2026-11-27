import { createClient } from "@/lib/supabase/server";

export type AppUserRole = "user" | "moderator" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: AppUserRole;
  is_active: boolean;
  last_active_at?: string | null;
  disabled_features?: string[];
  created_at?: string;
  session_count?: number;
  active_session_count?: number;
}

/**
 * Resolves the currently authenticated Supabase user and their `public.profiles` row.
 * Also refreshes `last_active_at` if stale (> 5 min).
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, is_active, last_active_at, disabled_features, created_at")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return {
        id: user.id,
        email: user.email ?? "",
        full_name:
          (user.user_metadata?.full_name as string | undefined) ??
          user.email?.split("@")[0] ??
          "Learner",
        role: "user",
        is_active: true,
        disabled_features: [],
      };
    }

    // Heartbeat: update last_active_at if > 5 minutes old
    const lastMs = profile.last_active_at ? new Date(profile.last_active_at).getTime() : 0;
    if (Date.now() - lastMs > 5 * 60 * 1000) {
      const nowIso = new Date().toISOString();
      await supabase
        .from("profiles")
        .update({ last_active_at: nowIso })
        .eq("id", user.id);
      profile.last_active_at = nowIso;
    }

    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role === "admin" ? "admin" : "user",
      is_active: profile.is_active !== false,
      last_active_at: profile.last_active_at,
      disabled_features: Array.isArray(profile.disabled_features)
        ? profile.disabled_features.filter((x): x is string => typeof x === "string")
        : [],
      created_at: profile.created_at,
    };
  } catch {
    return null;
  }
}
