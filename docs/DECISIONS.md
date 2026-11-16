# Project Decisions Log (Architecture Decision Records)

**Last Updated:** 16 November 2026  
**Status:** Canonical source of truth for all confirmed architecture, product, and design choices.

---

## 1. Master Decisions Register (D-01 to D-18)

| ID | Topic | Decision | Status | Date |
|---|---|---|---|---|
| **D-01** | Colour Palette | Purple brand (`#563B91`), warm yellow accent (`#F2C96D`), peach support (`#F3A58F`). Neutral canvas (`#F7F7F8`). | Approved | 2026-11-16 |
| **D-02** | Typography | Inter for UI & English dialogue; Hind Siliguri (primary) + Noto Sans Bengali (fallback) for Bangla. | Approved | 2026-11-16 |
| **D-03** | Token Naming | `--ecp-*` prefix in `design-tokens.css`. No raw hex codes inside components. | Approved | 2026-11-16 |
| **D-04** | Tailwind Adapter | Tailwind v4 detected (`4.3.3`). Use `tailwind-theme-v4.css` (`@theme`). Never load v3 adapter. | Confirmed via Audit | 2026-11-16 |
| **D-05** | Motion Durations | Token set: 150ms (fast), 200ms (normal), 280ms (slow). 4 standard easings. Respect `prefers-reduced-motion`. | Approved | 2026-11-16 |
| **D-06** | Colour Contrast | `--ecp-text-muted` set to `#777580` for WCAG 4.5:1 compliance. `--ecp-border-input` set to `#E2E0E8`. | Approved | 2026-11-16 |
| **D-07** | Translations Model | Explicit nullable FKs (`scenario_id`, `dialogue_line_id`) + `source_version` & `source_hash` for stale detection. | Approved | 2026-11-16 |
| **D-08** | Audio Asset Model | Explicit FKs, BCP 47 accents (`en-US`, `en-GB`), status enum (`processing`, `ready`, `failed`, `stale`, `archived`), `timing_manifest` JSONB. | Approved | 2026-11-16 |
| **D-09** | Grammar Language | Add `language_code` to `grammar_explanations`. | Approved | 2026-11-16 |
| **D-10** | Users Preferences | Fields: `ui_locale`, `primary_translation`, `secondary_translation`, `preferred_accent` (`en-US`/`en-GB`), `learning_level`, `learning_goal`. | Approved | 2026-11-16 |
| **D-11** | User Roles | Core roles: `admin`, `editor`, `reviewer`, `learner` + `translator` scoped by `language_code`. | Approved | 2026-11-16 |
| **D-12** | Practice Sessions | Single `practice_sessions` table with `mode`. AI roleplay child tables (`roleplay_messages`, `roleplay_feedback`). | Approved | 2026-11-16 |
| **D-13** | Component Names | Follow Component Library contracts: `ConversationTurn`, `ConversationReader`, `AudioPlayButton`, `AudioPlayer`, `VocabularyHighlight`, `WordDetailPopover`, `GrammarPanel`. | Approved | 2026-11-16 |
| **D-14** | Phase 0 Design Task | Validate existing style guide & tokens; generate token adapter; no redesign needed. | Approved | 2026-11-16 |
| **D-15** | Phase Numbering | Use Phase Plan numbering (Phase 0 Discovery, Phase 1 Core, Phase 2 Active, Phase 3 Voice, Phase 4 Expansion). | Approved | 2026-11-16 |
| **D-16** | Search Scope | Phase 1B uses Postgres full-text (`english` config + Bangla translation titles). Trigram & embeddings deferred to Phase 2+. | Approved | 2026-11-16 |
| **D-17** | Motion Libraries | No Rive in MVP (free-only rule). Native CSS + Motion for React. GSAP only with licence check. | Approved | 2026-11-16 |
| **D-18** | Platform Stack | Next.js 16 + TypeScript + Tailwind v4 + Supabase Postgres + Supabase Auth + Vercel. | Confirmed via Audit | 2026-11-16 |

---

## 2. Post-Review Amendments

### A-01 — Authentication Timing & Guardrails
- **Public access:** Browsing, searching, and listening to published dialogues require no login.
- **Saved data:** Saving bookmarks, vocabulary notebooks, and tracking progress require authentication.
- **Inline prompt:** Unauthenticated save attempts show a clear `"Log in to save"` inline prompt (not a silent failure, no redirect, preserves learner position).
- **Methods:** Magic link and Google OAuth via Supabase Auth.

### A-02 — Guest Mode Scope
- **Phase 1:** No guest local-storage progress or complex account-merge workflows.
- **Reconsideration:** Re-evaluated after Gate 1E based on learner metrics.

---

## 3. Free-Tier Cost & Services Limits (Task 0.12)

| Service | Plan / Tier | Verified Limits | Checked Date | Notes |
|---|---|---|---|---|
| **Vercel** | Hobby (Free) | 100 GB bandwidth, unlimited deployments | 2026-11-16 | Sufficient for MVP web application |
| **Supabase** | Free Tier | 500 MB database, 1 GB storage, 50,000 monthly active users | 2026-11-16 | Database, Auth & Audio static bucket |
| **GitHub** | Free | 2,000 CI minutes/month, unlimited public/private repos | 2026-11-16 | Used for CI workflows & source code |
| **Piper TTS** | Open Source (MIT) | 100% Free, runs offline / batch on CPU | 2026-11-16 | Pre-generates English sentence audio |
| **spaCy** | Open Source (MIT) | 100% Free | 2026-11-16 | Python NLP helper service |
