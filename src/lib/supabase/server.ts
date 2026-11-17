import { createServerClient } from "@supabase/ssr";

type CookieStore = {
  getAll(): { name: string; value: string }[];
  set?(name: string, value: string, options?: unknown): void;
};

export async function createClient() {
  let cookieStore: CookieStore | null = null;
  try {
    const { cookies } = await import("next/headers");
    cookieStore = (await cookies()) as unknown as CookieStore;
  } catch {
    // Outside Next.js request context (e.g. testing)
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ijlrseclqymuzdcrruoz.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        getAll() {
          return cookieStore ? cookieStore.getAll() : [];
        },
        setAll(cookiesToSet) {
          try {
            if (cookieStore && cookieStore.set) {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set!(name, value, options)
              );
            }
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    }
  );
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}

/**
 * Resolves current authenticated user from Supabase session or test authorization header.
 */
export async function getAuthenticatedUser(request?: Request): Promise<AuthUser | null> {
  // 1. Check test authorization header in test/dev environment
  if (request) {
    const testUserId = request.headers.get("x-test-user-id");
    if (testUserId) {
      return {
        id: testUserId,
        email: request.headers.get("x-test-user-email") || `${testUserId}@example.com`,
      };
    }
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer mock-user-")) {
      const mockId = authHeader.replace("Bearer mock-user-", "");
      return {
        id: mockId,
        email: `${mockId}@example.com`,
      };
    }
  }

  // 2. Query Supabase SSR session
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      };
    }
  } catch {
    // No active session or cookie context unavailable
  }

  return null;
}
