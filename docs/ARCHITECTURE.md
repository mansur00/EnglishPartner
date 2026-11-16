# English Conversation Partner — Architecture Overview

**Status:** Phase 0 Baseline  
**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Supabase (PostgreSQL & Auth), Vercel.

---

## 1. System Context & Data Flow

```
                      ┌──────────────────────────────────────────────┐
                      │                 Browser Client                │
                      │  Next.js Server & Client Components          │
                      │  Tailwind v4 (@theme) + Tokens (--ecp-*)     │
                      │  Accessible Radix primitives                 │
                      └──────────────────────┬───────────────────────┘
                                             │ HTTPS
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │              Next.js 16 App Server           │
                      │  App Router Server Actions & Route Handlers   │
                      │  Supabase Auth verification                  │
                      │  Zod request / boundary validation           │
                      └──────────────┬───────────────────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│  Supabase Postgres  │   │  Supabase Storage   │   │  NLP Service        │
│  Relational Content │   │  Static Pre-gen     │   │  (Python + spaCy)   │
│  Translations & SRS │   │  Audio Assets (CDN) │   │  Lemma, POS, Align  │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

---

## 2. Directory Structure (Contract)

```
english-partner/
├── docs/                      # Architectural, decision & governance docs
├── public/                    # Static assets & brand icons
├── src/
│   ├── app/                   # App router: (public), (app), (admin), api/
│   ├── components/
│   │   ├── ui/                # Base primitives (Button, Card, Badge, Drawer)
│   │   ├── learning/          # ConversationReader, ConversationTurn, etc.
│   │   ├── navigation/        # Header, Sidebar, BottomNav
│   │   └── practice/          # Quiz, sentence builder, roleplay
│   ├── lib/
│   │   ├── db/                # Drizzle schema, Supabase client
│   │   ├── auth/              # Server-side auth helpers
│   │   └── tokens/            # Design token mappings
│   └── styles/
│       ├── design-tokens.css  # Canonical CSS custom properties
│       └── tailwind-theme-v4.css
├── .env.example
└── package.json
```
