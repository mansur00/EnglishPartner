import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/auth/session";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const current = await getCurrentUserProfile();
  if (!current) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  if (current.role !== "admin" || !current.is_active) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const { id } = await context.params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_sessions")
    .select("id, user_id, session_key, started_at, last_seen_at, ended_at, is_active, device_label")
    .eq("user_id", id)
    .order("started_at", { ascending: false })
    .limit(50);

  if (error) {
    return Response.json({ sessions: [], error: error.message }, { status: 200 });
  }

  const activeThreshold = Date.now() - 30 * 60 * 1000;
  const sessions = (data ?? []).map((s) => {
    const isFresh =
      Boolean(s.is_active) &&
      Boolean(s.last_seen_at) &&
      new Date(s.last_seen_at as string).getTime() >= activeThreshold;
    return {
      ...s,
      is_active: isFresh,
    };
  });

  return Response.json({ sessions }, { status: 200 });
}
