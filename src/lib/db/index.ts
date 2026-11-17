import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.ts";

const connectionString = process.env.DATABASE_URL || "";

// Disable prefetch as it is not supported for Transaction pooler (Supabase)
const client = connectionString ? postgres(connectionString, { prepare: false }) : null;

export const db = client ? drizzle(client, { schema }) : null;

