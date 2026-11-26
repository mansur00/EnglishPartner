import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/auth/session";

const UpdateFeatureSchema = z.object({
  key: z.string().min(1),
  enabled: z.boolean(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("feature_flags")
      .select("key, label, label_bn, description, enabled")
      .order("key", { ascending: true });

    if (error || !data) {
      return Response.json({ flags: {}, items: [] }, { status: 200 });
    }

    const flags: Record<string, boolean> = {};
    for (const row of data) {
      flags[row.key] = row.enabled;
    }

    return Response.json({ flags, items: data }, { status: 200 });
  } catch {
    return Response.json({ flags: {}, items: [] }, { status: 200 });
  }
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
  const parsed = UpdateFeatureSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "INVALID_REQUEST", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("feature_flags")
    .update({
      enabled: parsed.data.enabled,
      updated_at: new Date().toISOString(),
    })
    .eq("key", parsed.data.key)
    .select("key, label, label_bn, description, enabled")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ item: data }, { status: 200 });
}
