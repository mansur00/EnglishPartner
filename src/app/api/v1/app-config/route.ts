import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/lib/auth/session";

export interface AppConfigPayload {
  ai_daily_limit: number;
  guest_preview_enabled: boolean;
  guest_preview_percent: number;
  system_notice_enabled: boolean;
  system_notice: string;
}

const DEFAULT_CONFIG: AppConfigPayload = {
  ai_daily_limit: 50,
  guest_preview_enabled: true,
  guest_preview_percent: 5,
  system_notice_enabled: false,
  system_notice: "",
};

const UpdateAppConfigSchema = z.object({
  ai_daily_limit: z.number().int().min(1).max(1000).optional(),
  guest_preview_enabled: z.boolean().optional(),
  guest_preview_percent: z.number().int().min(1).max(100).optional(),
  system_notice_enabled: z.boolean().optional(),
  system_notice: z.string().max(400).optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("app_settings")
      .select("key, value");

    if (error || !data) {
      return Response.json({ config: DEFAULT_CONFIG }, { status: 200 });
    }

    const config: AppConfigPayload = { ...DEFAULT_CONFIG };
    for (const row of data) {
      if (row.key === "ai_daily_limit" && typeof row.value === "number") {
        config.ai_daily_limit = row.value;
      } else if (row.key === "guest_preview_enabled" && typeof row.value === "boolean") {
        config.guest_preview_enabled = row.value;
      } else if (row.key === "guest_preview_percent" && typeof row.value === "number") {
        config.guest_preview_percent = row.value;
      } else if (row.key === "system_notice_enabled" && typeof row.value === "boolean") {
        config.system_notice_enabled = row.value;
      } else if (row.key === "system_notice" && typeof row.value === "string") {
        config.system_notice = row.value;
      }
    }

    return Response.json({ config }, { status: 200 });
  } catch {
    return Response.json({ config: DEFAULT_CONFIG }, { status: 200 });
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
  const parsed = UpdateAppConfigSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "INVALID_REQUEST", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const entries = Object.entries(parsed.data).filter(([, v]) => v !== undefined);

  for (const [key, value] of entries) {
    const { error } = await supabase
      .from("app_settings")
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  return GET();
}
