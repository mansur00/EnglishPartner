import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/auth/session";

const UpdateUserSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["user", "moderator", "admin"]).optional(),
  is_active: z.boolean().optional(),
  disabled_features: z.array(z.string()).optional(),
});

export async function GET() {
  const current = await getCurrentUserProfile();
  if (!current) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  if (current.role !== "admin" || !current.is_active) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active, last_active_at, disabled_features, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Aggregate session counts per user if user_sessions table exists
  const sessionCounts = new Map<string, { total: number; active: number }>();
  const { data: sessionsData } = await supabase
    .from("user_sessions")
    .select("user_id, is_active, last_seen_at");

  const activeThreshold = Date.now() - 30 * 60 * 1000;
  if (Array.isArray(sessionsData)) {
    for (const row of sessionsData) {
      const uid = row.user_id as string;
      const cur = sessionCounts.get(uid) ?? { total: 0, active: 0 };
      cur.total += 1;
      const isFresh =
        Boolean(row.is_active) &&
        Boolean(row.last_seen_at) &&
        new Date(row.last_seen_at as string).getTime() >= activeThreshold;
      if (isFresh) cur.active += 1;
      sessionCounts.set(uid, cur);
    }
  }

  const users = (profiles ?? []).map((u) => {
    const counts = sessionCounts.get(u.id as string) ?? { total: 0, active: 0 };
    return {
      ...u,
      session_count: counts.total,
      active_session_count: counts.active,
    };
  });

  return Response.json({ users }, { status: 200 });
}

export async function PATCH(req: Request) {
  const current = await getCurrentUserProfile();
  if (!current) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  if (current.role !== "admin" || !current.is_active) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = UpdateUserSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "INVALID_PAYLOAD", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { userId, role, is_active, disabled_features } = parsed.data;
  const updateFields: Record<string, unknown> = {};
  if (role !== undefined) updateFields.role = role;
  if (is_active !== undefined) updateFields.is_active = is_active;
  if (disabled_features !== undefined) updateFields.disabled_features = disabled_features;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(updateFields)
    .eq("id", userId)
    .select("id, email, full_name, role, is_active, last_active_at, disabled_features, created_at")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ user: data }, { status: 200 });
}

export async function DELETE(req: Request) {
  const current = await getCurrentUserProfile();
  if (!current) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  if (current.role !== "admin" || !current.is_active) {
    return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return Response.json({ error: "MISSING_USER_ID" }, { status: 400 });
  }
  if (userId === current.id) {
    return Response.json({ error: "CANNOT_DELETE_SELF" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").delete().eq("id", userId);
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ deletedUserId: userId }, { status: 200 });
}
