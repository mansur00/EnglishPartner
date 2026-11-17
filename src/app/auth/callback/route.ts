import { createClient } from "../../../lib/supabase/server.ts";

/**
 * Validates that a redirect target is strictly an internal, safe relative path.
 * Protects against open redirect attacks (e.g. //evil.com, https://evil.com).
 */
export function getSafeRedirectUrl(target: string | null | undefined, defaultPath = "/dashboard"): string {
  if (!target || typeof target !== "string") {
    return defaultPath;
  }

  const trimmed = target.trim();

  // Reject empty string
  if (trimmed.length === 0) return defaultPath;

  // Must begin with single slash, not protocol-relative (//) or backslash (\)
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return defaultPath;
  }

  // Reject URLs with embedded scheme/protocol
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return defaultPath;
  }

  // Reject control characters
  if (/[\r\n\t]/.test(trimmed)) {
    return defaultPath;
  }

  return trimmed;
}

/**
 * GET /auth/callback
 * Exchanges auth code for session in Supabase SSR pattern and redirects safely.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const rawNext = requestUrl.searchParams.get("next");
  const safeNext = getSafeRedirectUrl(rawNext, "/dashboard");

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return Response.redirect(new URL(safeNext, requestUrl.origin), 303);
      }
    } catch {
      // Session exchange failed
    }
  }

  // Return to home page with error state if code exchange failed or was absent
  return Response.redirect(new URL("/?auth_error=true", requestUrl.origin), 303);
}
