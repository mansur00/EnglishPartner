import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const SessionHeartbeatSchema = z.object({
  sessionKey: z.string().min(6).max(120),
  deviceLabel: z.string().max(160).optional(),
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = SessionHeartbeatSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "INVALID_SESSION_KEY" }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const staleCutoffIso = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    // Mark stale sessions (>30m since last heartbeat) as inactive
    await supabase
      .from("user_sessions")
      .update({ is_active: false, ended_at: nowIso })
      .eq("user_id", user.id)
      .eq("is_active", true)
      .lt("last_seen_at", staleCutoffIso)
      .neq("session_key", parsed.data.sessionKey);

    // Upsert current session heartbeat
    const { error } = await supabase.from("user_sessions").upsert(
      {
        user_id: user.id,
        session_key: parsed.data.sessionKey,
        last_seen_at: nowIso,
        ended_at: null,
        is_active: true,
        device_label: parsed.data.deviceLabel || "Web Browser",
      },
      { onConflict: "user_id,session_key" }
    );

    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 200 });
    }

    return Response.json({ ok: true }, { status: 200 });
  } catch {
    return Response.json({ ok: false }, { status: 200 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ ok: true }, { status: 200 });
    }

    const { searchParams } = new URL(req.url);
    const sessionKey = searchParams.get("sessionKey");
    if (!sessionKey) {
      return Response.json({ ok: false }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    await supabase
      .from("user_sessions")
      .update({ is_active: false, ended_at: nowIso })
      .eq("user_id", user.id)
      .eq("session_key", sessionKey);

    return Response.json({ ok: true }, { status: 200 });
  } catch {
    return Response.json({ ok: false }, { status: 200 });
  }
}
