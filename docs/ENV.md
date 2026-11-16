# Environment Variables Specification

> **Security Rule:** Never commit real secrets or `.env.local` to Git. This document records only variable names, purpose, and required environments.

| Variable Name | Environment | Purpose | Required? |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Supabase anonymous public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Admin access for backend operations | Only for admin/seeding |
| `DATABASE_URL` | Server only | Direct Postgres connection for Drizzle ORM | Yes |
| `NEXT_PUBLIC_APP_URL` | Client & Server | Base URL of deployed application (e.g. `http://localhost:3000`) | Yes |

