# Implementation Log

This log tracks every completed milestone and its test, accessibility, and architectural validation.

---

## Phase 0 — Discovery & Setup
**Status:** Completed (Gate 0 Passed)
- All initial audit tasks, canonical docs, tokens adapter, Supabase health checks, and CI configuration deployed and pushed.

---

## Phase 1 — Milestone 1A: Foundation
**Date:** 16 November 2026  
**Status:** Completed (Gate 1A Ready for Owner Review)

### Completed Tasks
- [x] **Fonts Setup:** `Inter` (UI/Latin) and `Hind_Siliguri` (Bangla) integrated via `next/font/google` in `src/app/layout.tsx`.
- [x] **App Shell:**
  - Header with branding, language picker stub, and user action (`src/components/navigation/Header.tsx`).
  - Desktop Sidebar with primary navigation (Dashboard, Explore active; future modules marked 'Soon' honestly) (`src/components/navigation/Sidebar.tsx`).
  - Mobile Bottom Navigation with 4 primary targets (`src/components/navigation/MobileBottomNav.tsx`).
  - Unified responsive layout wrapper (`src/components/navigation/AppShell.tsx`).
- [x] **Route Groups:**
  - Public / Demo page at `/`
  - Learner App Shell at `/(app)` (`/dashboard`, `/explore`)
  - Admin Area Guard at `/(admin)` (`/admin` returns 403 unauthorized state)
- [x] **Base UI Primitives:** `Button`, `Badge`, `Card`, `Skeleton`, `EmptyState` (`src/components/ui/`).
- [x] **Database Schema:** Full Drizzle ORM schema for all 18 relational models (`src/lib/db/schema.ts`, `drizzle.config.ts`, `src/lib/db/index.ts`).
- [x] **Verification:** `npm run lint` and `npm run build` passed with zero errors. All changes committed and pushed to GitHub.

---

## Phase 1 — Milestone 1B: Discovery
**Date:** 16 November 2026  
**Status:** Completed (Gate 1B Passed)

### Completed Tasks
- [x] **Seed Data Library (`src/content/seed/scenarios.ts`):**
  - 12 Daily Life scenarios across Shopping, Travel, Health, and Social categories.
  - 5 Professional UI/UX Designer career scenarios with step-by-step career path order.
  - Bilingual metadata & search indexes (English + বাংলা).
  - Multi-category mapping on shared records without duplicating content (Brief §3.3).
- [x] **Discovery UI Components:**
  - `ScenarioCard.tsx`: CEFR Level (A1-B2), turns count, duration, Hugeicons, and language badges.
  - `CategoryPills.tsx`: Horizontal scrollable category pill selector.
  - `FilterBar.tsx`: Dynamic CEFR level, turns length, communication style, and clear filters action.
- [x] **Search & Dynamic Routing:**
  - Realtime bilingual search on `/explore`: "airport" and "এয়ারপোর্ট" both locate the same scenario.
  - Category detail routing at `/explore/category/[slug]`.
  - Professional path track at `/professions/[slug]`.
  - Scenario details at `/conversations/[slug]` with `generateStaticParams` for pre-rendered performance.
  - Friendly `EmptyState` when queries return zero results.
- [x] **Verification:** `npm run lint` and `npm run build` passed with zero errors (37 pre-rendered static routes). All code committed and pushed to GitHub.

---

## Next: Milestone 1C — Learning Page and Audio Pipeline
- Conversation reader with sequential ConversationTurn rows
- Translation reveal/hide per line and 'Show All'
- Piper TTS sentence audio integration and AudioPlayButton states
- Full conversation AudioPlayer with playback speeds (0.75x to 2x)
