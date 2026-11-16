import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const timestamp = new Date().toISOString();
  let dbStatus = "unknown";

  try {
    // Ping Supabase
    const { error } = await supabase.from("_non_existent_check_table").select("*").limit(1);
    // If it reaches supabase without a connection/network fail (even if table missing), connectivity is good
    if (!error || error.code === "PGRST204" || error.code === "42P01" || error.message?.includes("relation")) {
      dbStatus = "connected";
    } else {
      dbStatus = "reachable";
    }
  } catch (err: unknown) {
    dbStatus = "error: " + (err instanceof Error ? err.message : String(err));
  }

  return NextResponse.json({
    status: "ok",
    app: "English Conversation Partner",
    version: "0.1.0",
    database: dbStatus,
    timestamp,
  });
}

