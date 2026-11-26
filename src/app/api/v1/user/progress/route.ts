import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/auth/session";

const ProgressBodySchema = z.object({
  progress: z.record(z.string(), z.unknown()),
});

export async function GET() {
  const current = await getCurrentUserProfile();
  if (!current) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_app_state")
    .select("state, updated_at")
    .eq("user_id", current.id)
    .single();

  if (error && error.code !== "PGRST116") {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(
    { progress: (data?.state as Record<string, unknown>) ?? {} },
    { status: 200 }
  );
}

export async function PUT(req: Request) {
  const current = await getCurrentUserProfile();
  if (!current) {
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = ProgressBodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("user_app_state")
    .upsert(
      {
        user_id: current.id,
        state: parsed.data.progress,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 200 });
}
