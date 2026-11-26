import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/auth/session";

const UpdateUserSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["user", "admin"]).optional(),
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
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_active, last_active_at, disabled_features, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ users: data ?? [] }, { status: 200 });
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
      { error: "INVALID_REQUEST", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { userId, role, is_active, disabled_features } = parsed.data;
  if (userId === current.id && (role === "user" || is_active === false)) {
    return Response.json(
      { error: "Cannot demote or disable your own admin account." },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (role !== undefined) updates.role = role;
  if (is_active !== undefined) updates.is_active = is_active;
  if (disabled_features !== undefined) updates.disabled_features = disabled_features;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("id, email, full_name, role, is_active, last_active_at, disabled_features, created_at")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ user: data }, { status: 200 });
}
