import { getCurrentUserProfile } from "@/lib/auth/session";

export async function GET() {
  const profile = await getCurrentUserProfile();
  return Response.json({ user: profile }, { status: 200 });
}
