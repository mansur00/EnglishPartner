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

## Phase 1 — Milestone 1C: Learning Page & Audio Pipeline
**Date:** 16 November 2026  
**Status:** Completed (Gate 1C Ready for Owner Review)

### Completed Tasks
- [x] **Conversation Reader & Turns:**
  - `SpeakerLabel.tsx`: Distinct speaker roles, Bengali role labels, and avatar schemes.
  - `ConversationTurn.tsx`: Ordered sequence display, English sentence with interactive word chips, sentence audio player, and local Bangla translation reveal/hide.
  - `ConversationReader.tsx`: Supports Short / Medium conversation versions, global "Show/Hide All Translations", and synchronized active line highlighting.
- [x] **Sentence & Full Conversation Audio:**
  - `AudioPlayButton.tsx`: Supports idle, playing, paused, and honest "Audio unavailable" states.
  - `AudioPlayer.tsx`: Sticky full conversation player with Play/Pause, Replay, Playback speeds (0.75x, 1x, 1.25x, 1.5x), American (en-US) vs British (en-GB) accent toggles, and live progress bar.
  - Strict adherence to no-autoplay on page load rule (Brief §8.3).
- [x] **Audio Pipeline Scripts (`scripts/audio/`):**
  - `check_asset.py`: File validation and corruption checker.
  - `generate_line.py`: Offline sentence generation CLI using Piper TTS.
  - `assemble_full.py`: Concatenator and `timing_manifest.json` builder with 600ms natural conversational pause spacing (Audio Guide §13).
- [x] **Interactive Page (`/conversations/[slug]`):**
  - Updated scenario detail into the core learning workspace.
- [x] **Verification:** `npm run lint` and `npm run build` passed with zero errors and zero warnings across all 37 static routes. All changes committed and pushed to GitHub.

---

## Next: Milestone 1D — Learning Tools and Personal Data
- Word-level Vocabulary Popover (IPA, part of speech, contextual definition in current sentence)
- Contextual Grammar Drawer (Sentence grammar breakdown first, progressive details on demand)
- Bookmarks and My Vocabulary notebook persistence (A-01/A-02 authenticated guardrails)
- Completed conversation progress tracking
