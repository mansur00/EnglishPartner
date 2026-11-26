import { createClient } from "@/lib/supabase/server";

export type AppUserRole = "user" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: AppUserRole;
  is_active: boolean;
  created_at?: string;
}

/**
 * Resolves the currently authenticated Supabase user and their `public.profiles` row.
 * Returns null if unauthenticated.
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
      .select("id, email, full_name, role, is_active, created_at")
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
      };
    }

    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role === "admin" ? "admin" : "user",
      is_active: profile.is_active !== false,
      created_at: profile.created_at,
    };
  } catch {
    return null;
  }
}
