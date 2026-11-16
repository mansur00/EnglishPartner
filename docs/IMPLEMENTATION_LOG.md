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

## Phase 1 — Milestone 1D: Learning Tools and Personal Data
**Date:** 16 November 2026  
**Status:** Completed (Gate 1D Ready for Owner Review)

### Completed Tasks
- [x] **Vocabulary Seed & Grammar Data (`src/content/seed/vocabulary.ts`):**
  - Rich vocabulary items with IPA, Part-of-Speech, contextual Bengali gloss, general Bengali meaning, example sentence, word forms (past, past participle, plural), and synonyms.
  - Sentence-level grammar entries with SVO structure breakdown (Subject, Verb, Object/Complement, Tense Name, Tense Pattern, Why Used in Bengali), polite natural alternatives, and common learner mistakes with corrections.
- [x] **WordDetailPopover (`src/components/learning/WordDetailPopover.tsx`):**
  - Interactive modal displaying IPA, POS badge, contextual & general Bengali meanings, example sentence, word forms, synonyms, and pronunciation audio button via Web Speech API.
  - Word saving toggle with bookmark state and non-blocking auth prompt (A-01).
- [x] **GrammarPanel (`src/components/learning/GrammarPanel.tsx`):**
  - Accessible slide-over drawer displaying SVO structure, tense pattern, why used in Bengali, polite alternatives, and common learner mistakes with clear explanations.
  - Keyboard accessible (`Escape` listener, smooth close).
- [x] **ReviewSummary (`src/components/learning/ReviewSummary.tsx`):**
  - Post-conversation review card celebrating completion, showing key vocabulary practiced, quick audio pronunciation & bookmarking, restart action, and next scenario navigation.
- [x] **AuthPromptModal (`src/components/auth/AuthPromptModal.tsx`):**
  - Non-blocking inline modal implementing Decision A-01: informs guest learners to log in for cloud sync without clearing page position or scroll state.
- [x] **Personal Vocabulary Notebook (`/vocabulary`):**
  - `/vocabulary` page with search, Part-of-Speech filters, audio playback, saved word management, and cloud sync trigger.
- [x] **Offline NLP Helper (`services/nlp/nlp_helper.py`):**
  - Python tool for tokenization, lemmatization, POS tagging, and content vocabulary candidate extraction.
- [x] **Verification:** `npm run lint` and `npm run build` passed with zero errors and zero warnings across 38 pre-rendered static routes. All Hugeicons strictly match the outlined style guideline.

---

## Phase 1 — Milestone 1E: Admin, Content Validation & Release (Phase 1 Exit)
**Date:** 17 November 2026  
**Status:** Completed (Gate 1E Ready for Owner Review & Sign-Off)

### Completed Tasks
- [x] **Role-Based Access Control System (`src/lib/auth/roles.ts`):**
  - Complies with Decision D-11 and Brief §14.
  - Implements 5 hierarchical roles: `learner`, `translator`, `editor`, `reviewer`, `admin`.
  - Server and client-side guards: unauthorised users receive 403 Forbidden screens.
- [x] **Admin Console & Dashboard (`/admin`, `AdminDashboardClient.tsx`):**
  - Content metrics: total scenarios (17), dialogue turns count, translation coverage (100%), and offline audio asset status.
  - Interactive scenario list with status tabs (All, Published, In Review, Draft, Archived).
  - Language coverage matrix report (scenarios × Bengali translations × audio accents).
  - Chronological audit log tracking content changes.
  - Role test switcher allowing live switching between Learner (403), Translator, Editor, Reviewer, and Admin.
- [x] **Conversation & Dialogue Turn Editor (`/admin/conversations/[slug]/edit`):**
  - Interactive turns editor: add turns, reorder sequence numbers with up/down controls, delete turns.
  - Speaker selector mapped to valid conversation speakers.
  - English dialogue textarea, Bengali translation textarea, and learning notes input.
- [x] **Pre-Publish Integrity Guard (`src/lib/content/validator.ts`):**
  - Enforces DB §5.1 & Brief §14.3 constraints: checks required fields, sequence continuity, speaker references, translation completeness, and audio links.
  - Real-time pre-publish checklist banner alerting editors before publishing.
- [x] **SEO & Discoverability Infrastructure:**
  - Dynamic `sitemap.ts` generating URLs for all static pages and conversation scenarios.
  - `robots.ts` configured with crawler permissions and disallowing admin routes.
- [x] **Security Hardening (`next.config.ts`):**
  - Strict security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: origin-when-cross-origin`, and `Permissions-Policy`.
- [x] **Learner Privacy & Terms Pages:**
  - Transparent `/privacy` policy page emphasizing no creepy tracking and guest local storage.
  - Educational `/terms` of service page.
- [x] **Automated Test Suite (`tests/learning-loop.test.mjs`):**
  - Integrated via `npm test` using Node.js native test runner.
  - 6 comprehensive tests covering:
    1. Seed Scenarios Data Integrity
    2. Bilingual Discovery & Search Matching
    3. Dialogue Turns & Sequence Continuity
    4. RBAC Security Guards
    5. Pre-Publish Validation Guard Checks
    6. Vocabulary & Contextual Meaning Mapping
- [x] **Verification:** `npm test`, `npm run lint`, and `npm run build` passed with 100% success across all **60 static pre-rendered routes**.

---

## 🛑 Gate 1 (Phase 1 Exit) Summary & Verification:
- **Milestone 1A (Foundation):** Responsive App Shell (desktop sidebar, mobile bottom nav), Design Tokens, Drizzle DB schema (18 tables), Bengali Typography.
- **Milestone 1B (Discovery):** 17 Scenarios (12 Daily Life + 5 UI/UX Designer path), Bilingual Real-Time Search, Filter Bar, Category & Profession Routing.
- **Milestone 1C (Learning Page & Audio):** Conversation Reader, Audio Player, Piper TTS offline pipeline, accent switching (en-US / en-GB), zero autoplay rule enforced.
- **Milestone 1D (Learning Tools):** Interactive Word Detail Popover, SVO Grammar Slide-over Panel, Review Summary, My Vocabulary Notebook, Non-blocking Auth Prompt (A-01).
- **Milestone 1E (Admin & Release):** RBAC (5 roles), Admin Console, Dialogue Editor with Pre-Publish Guard, Security Headers, Privacy & Terms, Automated Test Suite.
- **Icon Consistency:** 100% Hugeicons Outlined (`@hugeicons/react` + `@hugeicons/core-free-icons`).

---

## Next: Phase 2 — Active Learning
- **Milestone 2A:** Listening & Recall (Listening comprehension quizzes, "Hide one speaker" mode, "Complete missing lines" mode).
- **Milestone 2B:** Sentence Builder (Shuffled words puzzle → grammatically correct conversational English sentence).
- **Milestone 2C:** "What Should I Say?" Interactive Intent Prompt (Intent in English/Bangla/Banglish → natural English responses).
