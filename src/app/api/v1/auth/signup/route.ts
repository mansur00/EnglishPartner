import crypto from "node:crypto";
import { z } from "zod";
import postgres from "postgres";

const SignupSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(6).max(128),
  fullName: z.string().trim().max(120).optional(),
});

/**
 * POST /api/v1/auth/signup
 * Creates an immediately confirmed Supabase Auth user via DATABASE_URL
 * so no confirmation email is sent and users can sign in right away.
 */
export async function POST(req: Request) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return Response.json(
      { error: "DATABASE_URL is not configured on the server." },
      { status: 500 }
    );
  }

  const body = await req.json();
  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Please enter a valid email and a password of at least 6 characters." },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase();
  const password = parsed.data.password;
  const fullName = parsed.data.fullName?.trim() || email.split("@")[0];

  const sql = postgres(databaseUrl, { ssl: "require" });
  try {
    const existing = await sql`SELECT id FROM auth.users WHERE email = ${email}`;
    if (existing.length > 0) {
      return Response.json(
        { error: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    const userId = crypto.randomUUID();
    await sql`
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token, recovery_token,
        email_change_token_new, email_change, email_change_token_current,
        phone_change, phone_change_token, reauthentication_token,
        is_super_admin, is_sso_user
      ) VALUES (
        ${"00000000-0000-0000-0000-000000000000"},
        ${userId},
        ${"authenticated"},
        ${"authenticated"},
        ${email},
        extensions.crypt(${password}, extensions.gen_salt(${"bf"})),
        now(),
        ${sql.json({ provider: "email", providers: ["email"] })},
        ${sql.json({ full_name: fullName })},
        now(), now(), ${""}, ${""}, ${""}, ${""}, ${""}, ${""}, ${""}, ${""},
        false, false
      )
    `;

    await sql.unsafe(
      `INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
      ) VALUES (
        $1, $2,
        jsonb_build_object('sub', $2::text, 'email', $3::text, 'email_verified', true, 'phone_verified', false),
        'email', $2::text, now(), now(), now()
      )`,
      [crypto.randomUUID(), userId, email]
    );

    await sql`
      INSERT INTO public.profiles (id, email, full_name, role, is_active)
      VALUES (${userId}, ${email}, ${fullName}, ${"user"}, true)
      ON CONFLICT (id) DO UPDATE SET full_name = ${fullName}
    `;

    return Response.json({ ok: true, userId }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Signup failed" },
      { status: 500 }
    );
  } finally {
    await sql.end();
  }
}
