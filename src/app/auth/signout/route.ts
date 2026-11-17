import { createClient } from "../../../lib/supabase/server.ts";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Session signout
  }
  return Response.redirect(new URL("/", requestUrl.origin), 303);
}

export async function GET(request: Request) {
  return POST(request);
}
