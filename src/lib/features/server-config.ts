import { createClient } from "@/lib/supabase/server";

let cachedAiLimit: { value: number; expiresAt: number } | null = null;

/**
 * Reads `ai_daily_limit` from `public.app_settings` with a 5-second cache
 * so Admin updates take effect immediately without hammering the DB.
 */
export async function getServerAiDailyLimit(): Promise<number> {
  const now = Date.now();
  if (cachedAiLimit && now < cachedAiLimit.expiresAt) {
    return cachedAiLimit.value;
  }

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "ai_daily_limit")
      .single();

    const parsed = typeof data?.value === "number" ? data.value : 50;
    const clamped = Math.max(1, Math.min(1000, parsed));
    cachedAiLimit = { value: clamped, expiresAt: now + 5000 };
    return clamped;
  } catch {
    return 50;
  }
}

export function invalidateServerAiLimitCache() {
  cachedAiLimit = null;
}
