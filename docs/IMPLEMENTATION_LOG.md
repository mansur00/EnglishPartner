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

## Phase 2 — Milestone 2A: Listening & Recall (Active Learning)
**Date:** 17 November 2026  
**Status:** Completed (Milestone 2A Passed)

### Completed Tasks
- [x] **Database Schema Expansion (`src/lib/db/schema.ts`):**
  - Added Phase 2 practice tables per `ECP_Exercises_SRS_Spec.md` §3: `exercises`, `exercise_items`, `practice_sessions`, and SM-2 fields on `user_vocabulary`.
- [x] **Exercise Content Data Layer (`src/content/seed/exercises.ts`):**
  - Curated exercises for 20-step conversation ladder:
    - Multiple-choice listening comprehension questions with audio cues, answer keys, and Bengali pedagogical explanations.
    - Missing word / complete line exercises with masked text and target options.
    - Dialogue turn ordering exercises.
- [x] **Interactive Practice Components (`src/components/practice/`):**
  - `ListeningQuizCard.tsx`: Instant feedback upon selection, positive encouragement, and Bengali explanations.
  - `HideSpeakerPractice.tsx`: Roleplay dialogue simulator where the learner chooses a role, partner's turns are spoken, and learner's turns are hidden for active recall with "Reveal & Listen" self-check.
  - `CompleteLineCard.tsx`: Interactive fill-the-blanks with word chips.
  - `PracticeWorkspace.tsx`: Multi-tab workspace with automatic fallback generation for any conversation line and quick Next Step advancement banner.
- [x] **Learning Container Integration (`LadderStepContainer.tsx`):**
  - Added primary section switcher on conversation steps: "📖 সংলাপ ও অডিও পাঠ (Dialogue)" and "🎯 অনুশীলন ও কুইজ (Practice & Quiz)".
- [x] **Automated Test Suite (`tests/learning-loop.test.mjs`):**
  - Added Test #8 verifying exercise integrity, option validation, and blank checking. 8/8 tests pass.
- [x] **Build & Route Verification:**
  - `npm test`, `npm run lint`, and `npm run build` compiled with 100% success across all **80 static pre-rendered routes**.

---

## Phase 2 — Milestone 2B: Sentence Builder (Interactive Word Ordering)
**Date:** 21 November 2026  
**Status:** Completed (Milestone 2B Passed)

### Completed Tasks
- [x] **Sentence Builder Engine (`src/lib/practice/sentence-builder.ts`):**
  - Shuffled token ordering with multiple accepted word order solutions.
  - Normalization algorithm stripping punctuation and comparing token sets.
  - Keyboard accessibility (arrow navigation, Enter/Space selection).
- [x] **Interactive UI (`SentenceBuilderCard.tsx`):**
  - Tappable/clickable word chips using Expandable Design System `Tag` and `Button`.
  - Immediate grammar role tinting and encouraging feedback.
- [x] **Verification:** Unit tests passing in `tests/sentence-builder.test.mjs`.

---

## Phase 2 — Milestone 2C: Conversational Roleplay & AI Expression Assistant
**Date:** 21–22 November 2026  
**Status:** Completed (Milestone 2C Passed)

### Completed Tasks
- [x] **Hide Speaker Roleplay Simulation (`src/lib/practice/hide-speaker.ts`, `HideSpeakerPractice.tsx`):**
  - Upgraded to full conversation stream using `ChatBubble` (speaker="1" for partner, speaker="2" for learner).
  - Role selection, hidden learner turns, and Web Speech audio playback.
- [x] **Complete Line Practice (`src/lib/practice/complete-line.ts`, `CompleteLineCard.tsx`):**
  - Upgraded with `Tag` word chips, audio pronunciation, and `btn-restart-action`.
- [x] **"What Should I Say?" AI Expression Assistant (`src/lib/ai/say-it.ts`, `WhatShouldISay.tsx`, `/what-should-i-say`):**
  - Schema S1 deterministic intent resolution engine for Bangla and English inputs.
  - Interactive UI with `InputGroup`, `Pill`, `Tag`, and `Button`.
  - Sidebar link wired with `SparklesIcon`.
- [x] **Verification:** Unit tests passing in `tests/practice-modes.test.mjs` and `tests/what-should-i-say.test.mjs`.

---

## Phase 2 — Milestone 2D: AI Text Roleplay Partner
**Date:** 22 November 2026  
**Status:** Completed (Milestone 2D Passed)

### Completed Tasks
- [x] **Deterministic Roleplay Engine (`src/lib/ai/roleplay.ts`, `src/lib/ai/roleplay-schema.ts`):**
  - Implemented Schemas R1 and F1 with strict 1-correction limit per turn.
  - Prompt injection guardrails and persona adherence.
- [x] **Interactive Partner UI (`RoleplayPartner.tsx`, `/roleplay`):**
  - Real-time conversational stream using `ChatBubble`.
  - Concluding turn evaluation and Schema F1 session feedback summary.
- [x] **Verification:** Unit tests passing in `tests/roleplay.test.mjs`.

---

## Phase 2 — Milestone 2E: Spaced Repetition (SRS) & Daily Challenges
**Date:** 21 November 2026  
**Status:** Completed (Milestone 2E Passed)

### Completed Tasks
- [x] **SuperMemo-2 (SM-2) Spaced Repetition Algorithm (`src/lib/srs/sm2.ts`):**
  - Ease factor adjustments, interval calculations (1, 6, I*EF days), and retention grade boundaries (0–5).
- [x] **Flashcard Practice Mode (`FlashcardReview.tsx`):**
  - 3D-free flat flip cards with Bengali contextual clues and rating buttons (Again, Hard, Good, Easy).
- [x] **Daily Challenge Engine (`src/lib/challenges/daily.ts`):**
  - Level-matched daily scenario and vocabulary challenge generation.
- [x] **Review Event Logging (`recordReviewEvent`, `/api/v1/srs/review-events`):**
  - Database persistence in `review_events` table.
- [x] **Verification:** Unit tests passing in `tests/srs-sm2.test.mjs` and `tests/daily-challenges.test.mjs`.

---

## 🛑 Gate 2 (Phase 2 Exit) Summary & Verification:
- All 6 active practice modes operational: Listening Comprehension, Sentence Builder, Hide Speaker Roleplay, Complete Line, AI Roleplay Partner, and SRS Flashcard Review.
- Zero external AI API runtime costs (deterministic intent and roleplay engines compliant with AUD-A11).
- 152/152 unit tests passing across 30 suites.

---

## Phase 3 — Voice & Personalisation
**Date:** 22 November 2026  
**Status:** Completed (Gate 3 Passed)

### Completed Tasks
- [x] **Milestone 3A: Speech Recognition Input:**
  - Integrated browser Web Speech Recognition API with real-time mic permission handling.
- [x] **Milestone 3B: Spoken Voice Roleplay Loop (`src/lib/ai/roleplay-voice.ts`):**
  - Auto-speak AI replies with Web Speech Synthesis, speed controller (0.75x/0.88x/1.0x), transcript cleanup, live status cues, and dialogue replay.
- [x] **Milestone 3C: Pronunciation Hints & Acoustic Word Feedback (`src/lib/practice/pronunciation.ts`, `ReadAloudCard.tsx`):**
  - Word-level phonetic alignment and Bengali acoustic hints dictionary for ESL traps.
  - Qualitative tiers (`clear`, `getting_there`, `needs_practice`), zero fake percentage scores, and slow audio model comparison.
- [x] **Milestone 3D & 3E: Personalisation & Progress Analytics (`src/lib/analytics/progress-metrics.ts`, `ProgressDashboard.tsx`, `/progress`):**
  - Retention tiers, SM-2 memory distribution, accuracy metrics, and weekly activity chart.
- [x] **Privacy & Invariants:**
  - Audio recording permissions requested strictly on user tap; zero audio retained on server per Privacy Spec §4.1.
- [x] **Verification:** Unit tests passing in `tests/voice-roleplay.test.mjs`, `tests/pronunciation.test.mjs`, and `tests/progress-metrics.test.mjs`. (171 unit tests passing).

---

## 🛑 Gate 3 (Phase 3 Exit) Summary & Verification:
- Voice roleplay loop operational with text fallback.
- Pronunciation guidance adheres strictly to qualitative pedagogical tiers with no fake metrics.
- Privacy review passed (zero audio retention).

---

## Phase 4 — Expansion & Release Hardening
**Date:** 22 November 2026  
**Status:** Completed (Gate 4 Passed)

### Completed Tasks
- [x] **Milestone 4A: Professional English Career Paths (`src/lib/professions/registry.ts`, `/professions`, `/professions/[slug]`):**
  - 5 career tracks (UI/UX Designer, Software Engineer, Remote Freelancer, Healthcare Assistant, Teacher/Educator) with 6 realistic professional scenarios.
- [x] **Milestone 4B: Multi-Language Strategy & Translation Framework (`src/lib/i18n/languages.ts`, `messages/hi.json`, `LanguageSwitcher.tsx`):**
  - Complete Hindi translation dictionary (98/98 keys, 100% parity), RTL script detection, and language switcher in header.
- [x] **Milestone 4C: Installable Web App (PWA & Offline Service Worker) (`src/app/manifest.ts`, `public/sw.js`):**
  - W3C Web App Manifest and offline caching service worker for core application routes.
- [x] **Milestone 4D: Mobile App & Android APK Architecture (`docs/MOBILE_APP_ARCHITECTURE.md`, `scripts/build-apk.sh`):**
  - Automated APK packaging script with detected workstation environment (Java 25 + Android SDK), Trusted Web Activity (TWA) runbook, and Android Studio signing guide.
- [x] **Milestone 4E: AI Quotas, Rate Limiting & Cost Defense Engine (`src/lib/ratelimit/quota.ts`):**
  - In-memory sliding window rate limiter (10 req/min burst limiter, 30 daily say-it quota, 20 max turns per roleplay session, standard IETF draft rate limit headers).
- [x] **Automated CI Workflow & End-to-End Test Gate (`tests/e2e/keyboard-focus.spec.mjs`, `.github/workflows/ci.yml`):**
  - Automated headless Chrome E2E test runner; reconciled KI-12-CI in `docs/AUDIT_REPORT.md` (Not built yet count drops to 0).
- [x] **Brief §19 MVP End-to-End Acceptance Verification Suite (`tests/mvp-acceptance.test.mjs`):**
  - 13 comprehensive tests asserting all 5 acceptance categories from Brief §19.
- [x] **Next.js 16 Proxy Migration (`src/proxy.ts`):**
  - Migrated deprecated middleware to proxy convention, eliminating build deprecation warnings.
- [x] **Verification:**
  - `check:frozen`: Passed.
  - `lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `lint`: Passed (0 ESLint errors/warnings; 0 token violations).
  - `test`: Passed (203/203 unit tests passing across 41 suites).
  - `build`: Passed (109/109 static pages generated, 0 warnings).

---

## 🛑 Gate 4 (Phase 4 Exit) & MVP Release Readiness Summary:
- **Total Test Suites:** 41 suites, 203 passing tests.
- **Pre-rendered Static Routes:** 109 pages compiled with 0 errors and 0 warnings.
- **Audit Findings:** 16 Fixed, 6 PASS, 0 Not built yet.
- **Design System Invariants:** 0 arbitrary hex, max font weight 600, min font-size floor 12px, rainbow border byte-identical.
- **Release Status:** Production MVP Release Ready.
