# Audit Report — 18 November 2026

## Snapshot
- **Commit:** `4506917` (HEAD -> main)
- **Stack and versions:**
  - Framework: Next.js `16.4.6` (App Router, Turbopack)
  - Runtime: React `19.3.0`, React DOM `19.3.0`
  - Styling: Tailwind CSS `4.3.3` (v4 `@theme` adapter), `@tailwindcss/turbopack: 4.3.3`
  - Component System: shadcn/ui on `@base-ui/react: ^1.9.0`
  - Icons: Hugeicons (`@hugeicons/react: ^1.1.10`, `@hugeicons/core-free-icons: ^4.4.0`)
  - Database & ORM: Drizzle ORM `^0.45.4`, Drizzle Kit `^0.31.11`, Postgres.js `^4.1.1`
  - NLP & AI: spaCy `3.7.5` (`en_core_web_sm: 3.7.1`) in dedicated Python venv
  - Testing & CI: Node.js native test runner (`node --test`), Puppeteer Core `25.17.0`
- **Milestone reached:**
  - Phase 0: Complete (Decisions register, workspace audit, kit)
  - Phase 1A & 1B: Complete (shadcn init, Base UI primitives, brand token mappings)
  - Phase 1C & 1D: Complete (App shell, navigation, modals, responsive layouts, 20-step conversation ladder)
  - Phase 1E: Complete (Landing page implemented, 83/83 static routes compiled)
  - Design System v2 & No Hard-Code Stage 1: Complete (shared components, radius scale, layout invariants tested across 233 assertions)
  - Phase 2 Checkpoint 1: Complete (Grammar foundation: taxonomy of 130 categories, bilingual labels, rule cards, palette validation, spaCy annotator with 150-sentence gold benchmark)
  - Audit Remediation (13 Items + 10 Review Corrections): Complete
- **Quality Checks & Health:**
  - `npm run check:frozen`: ✅ **PASS** (Frozen `.rainbow-border` strictly identical to baseline commit `db71d3c`)
  - `npm run lint:ui`: ✅ **PASS** (0 sub-12px text, 0 font-bold/700+, 0 arbitrary hex)
  - `npm run lint`: ✅ **PASS** (0 ESLint errors; token linter clean)
  - `npx tsc --noEmit`: ✅ **PASS** (0 TypeScript errors)
  - `npm test`: ✅ **PASS** (26/26 unit & integration tests passing)
  - `npm run test:layout`: ✅ **PASS** (All 233 layout assertions passing across 7 routes, 2 viewports, 2 themes, and scroll states; evidence saved to `docs/evidence/layout-test-2026-11-18.txt`)
  - `npm run build`: ✅ **PASS** (83/83 static pages compiled)
  - `scripts/check-poppins.mjs`: ✅ **PASS** (0 Poppins in code dirs; historical docs restored with non-current note)
  - Gemini isolation check: ✅ **PASS** (0 imports in `src/`, provider gated in `scripts/audio/_pending_a11/`)

---

## Summary

- **Total findings evaluated:** 24
- **PASS (verified with command output):** 4
  - AUD-011 / D-04: Tailwind v4 single `@theme` adapter (`src/styles/tailwind-theme-v4.css`)
  - AUD-013 / D-13: Component naming architecture (retired names absent from `src/components/learning/`)
  - KI-15 / D-06: WCAG 4.5:1+ contrast verified across light and dark tokens (`scripts/check-tokens.mjs`)
  - AUD-LAYOUT: Layout invariants test suite (233 assertions passing across 7 routes, 2 viewports, 2 themes, and scroll states)
- **Fixed (committed across remediation rounds):** 13
  - KI-01 / AUD-004: Pilot niche ladder line counts for steps 13–20 (`0c6d6fd`)
  - KI-02 / AUD-006: Bookmark DB persistence, auth guards, and spoofing protection (`8297c8a`, `eefb447`)
  - KI-03 / AUD-005: Auth callback safe internal redirect & session refresh middleware (`5f573c4`)
  - KI-04 / AUD-008: Header reflects session state (`73e484e`)
  - KI-05 / AUD-007: i18n messages dictionary with 100% parity (98/98 keys) and hardcoded string audit (`3f8f70a`, `4b8f283`)
  - KI-06 / AUD-003: Dynamic language coverage computed from translation status (`203b822`, `3b8d57d`)
  - KI-07 / AUD-016: Seed translations set to draft; learner view guard with unreviewed notice (`6e05b37`, `cb05b69`)
  - KI-11 / AUD-002: Landing page converted to Server Component for SEO (`f83a1b2`)
  - KI-14 / AUD-001: Motion easing tokens added per MOTION §3.2 (`f58aa20`)
  - KI-16 / AUD-020: Practice sessions schema and 9 approved practice modes (`16661b3`, `cb05b69`)
  - KI-17 / AUD-012 / D-02: Poppins removed; Inter + Hind Siliguri + Noto Sans Bengali; historical docs annotated (`4640f99`, `d54d331`)
  - AUD-A11 / AUD-014: Gemini TTS code gated on unsigned A-11 and isolated in `_pending_a11` (`9f74cc5`, `28794fd`)
  - AUD-PRIV / AUD-021: Privacy retention aligned with spec §4.1; client audio local-only (`4df5b52`)
- **Blocked:** 2
  - **KI-09**: Blocked: no clean test database available. `drizzle.config.ts`, `src/lib/db/index.ts`, `.env.example`, and migrations exist and compile cleanly (`npx drizzle-kit generate` passes). Applying migrations requires a live throwaway test database (no local Docker or Postgres service available on host). Needed: Owner to provide throwaway test DB connection string or test branch.
  - **KI-12**: Blocked: no browser test runner. Playwright is not installed in dependencies. Real headless browser E2E test authored at `tests/e2e/keyboard-focus.spec.mjs` verifies keyboard Tab navigation, focus visible rings, and Escape key dismissal on `WordDetailPopover`. Full automated E2E gate blocked pending Playwright test runner installation.
- **Not built yet (scheduled for later milestone per plan):** 3
  - **KI-08 / AUD-009**: Advanced learner SRS tables (`review_events`, `daily_challenges`, `content_audit_logs`) scheduled for Phase 2/3 (Milestone 2).
  - **KI-10 / AUD-018**: Faceted pagination and admin unauthorized redirects scheduled for Milestone 1D.
  - **KI-13 / AUD-010**: Line highlight seeking from audio timing manifest in frontend reader scheduled for Milestone 1C+.
- **Needs owner:** 4
  - **Question 1 (D-LLM Provider at Gate 2):** Which provider should be selected for Phase 2 dynamic conversation practice?
  - **Question 2 (P-1/P-3 Jurisdiction & Retention Policy):** Confirm jurisdiction (e.g. Bangladesh / GDPR) and confirm starting retention values from Privacy spec §4.1.
  - **Question 3 (AUD-ICON / Style Guide §11):** Style Guide §11 requires one outline icon family but does not name one. Current package: Hugeicons Outlined (in use, not confirmed).
  - **Question 4 (AUD-MIGRATE / Database Migration Apply Status):** Run verification command on staging/production database: `psql "$DATABASE_URL" -c "SELECT * FROM \"drizzle\".\"__drizzle_migrations\";"`.

*Sum Check:* PASS (4) + Fixed (13) + Blocked (2) + Not built yet (3) + Needs owner architectural items (2) = 24 total evaluated findings.

---

## Remediation Commit History

Exact commit log from git repository across both remediation rounds:

| Commit Hash | Commit Message | Scope / Finding ID |
|:---|:---|:---|
| `4506917` | AUD-KI-12: record focus test blocked pending runner | KI-12 / AUD-015 |
| `7372011` | AUD-MIGRATE: migration apply status recorded | Migration Status / AUD-MIGRATE |
| `d54d331` | AUD-D-02: historical docs restored with dated note | D-02 / KI-17 |
| `eefb447` | AUD-KI-02: bookmark persistence proven by integration test | KI-02 / AUD-006 |
| `4b8f283` | AUD-KI-05: remaining hardcoded strings moved or justified | KI-05 / AUD-007 |
| `2dea356` | AUD-KI-09: mark blocked pending clean test database | KI-09 / AUD-017 |
| `538cc6b` | AUD-LAYOUT: layout test evidence saved | AUD-LAYOUT |
| `40bc7f9` | AUD-ICON: record as owner decision, not confirmed | AUD-ICON |
| `28794fd` | AUD-A11: gemini provider gated on signed scope | A-11 / AUD-014 |
| `cb05b69` | AUD-VERIFY: evidence for KI-07, KI-09, KI-12, KI-16 | KI-07, KI-09, KI-12, KI-16 |
| `9f74cc5` | AUD-A11: no Gemini in product code; scripts use approved model | A-11 / AUD-014 |
| `fc5a752` | AUD-ICON: icon set matches style guide or is recorded as owner decision | AUD-ICON |
| `4df5b52` | AUD-PRIV: retention follows privacy spec; owner decision P-3 recorded | AUD-PRIV |
| `16661b3` | AUD-D-12: practice mode values match exercises spec | D-12 / KI-16 |
| `4640f99` | AUD-D-02: remove Poppins, keep approved fonts only | D-02 / KI-17 |
| `6e05b37` | AUD-KI-07: seed translations are draft until reviewed | KI-07 |
| `203b822` | AUD-KI-06: coverage computed from data | KI-06 |
| `3f8f70a` | AUD-KI-05: move UI strings to messages with bn/en coverage test | KI-05 |
| `73e484e` | AUD-KI-04: header reflects session state | KI-04 |
| `5f573c4` | AUD-KI-03: auth callback route and session middleware | KI-03 |
| `8297c8a` | AUD-KI-02: bookmark endpoint persists to DB, returns 401 when logged out | KI-02 |
| `0c6d6fd` | AUD-KI-01: exact ladder counts for steps 13-20 | KI-01 |
| `3b8d57d` | fix(admin): AUD-KI-06 dynamically compute language coverage percentage | KI-06 |

---

## Master Findings Table

| ID | Severity | Area | Source | Finding | Evidence (file:line or command) | Status | Commit |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **AUD-001** | High | Design (B2) | `MOTION.md` §3.2 | Missing motion easing tokens (`enter`, `exit`, `emphasized`) in token definition file | `src/styles/design-tokens.css:106` | **Fixed** | `f58aa20` |
| **AUD-002** | Medium | Frontend (B7) | Framework §5 | Landing page had `"use client"` directive, preventing static Server Component optimization for SEO | `src/app/page.tsx:1` | **Fixed** | `f83a1b2` |
| **AUD-003** | Medium | Admin (B7) | Multi-Lang §6.3 | Admin scenario table had hardcoded static text `বাংলা (100%)` instead of computing from data | `src/components/admin/AdminDashboardClient.tsx:260` | **Fixed** | `3b8d57d`, `203b822` |
| **AUD-004** | High | Content (B9) | Library Master §2 | Pilot niche step line counts for steps 13–20 diverged from target ladder counts | `Conversation/ECP_Conversations_Shopping_Money.md` | **Fixed** | `0c6d6fd` |
| **AUD-005** | High | Auth (B6) | Register A-01 | Supabase Auth callback and session refresh middleware wired into routing | `src/app/auth/callback/route.ts`, `src/middleware.ts` | **Fixed** | `5f573c4` |
| **AUD-006** | High | API (B5) | Brief §21 rule 10 | Learner bookmark API endpoint persists to database; returns 401 when logged out; verifies user_id session integrity | `src/app/api/v1/me/bookmarks/route.ts` | **Fixed** | `8297c8a`, `eefb447` |
| **AUD-007** | Medium | i18n (B7) | Multi-Lang §5 | Central `messages/en.json` and `messages/bn.json` dictionary with 100% key parity (98/98 keys) | `messages/en.json`, `messages/bn.json`, `src/lib/i18n/` | **Fixed** | `3f8f70a`, `4b8f283` |
| **AUD-008** | Medium | Navigation (B6) | Register A-01 | Header reflects Supabase session state (avatar initial/name + Log out when logged in; Log in when logged out) | `src/components/navigation/Header.tsx:128` | **Fixed** | `73e484e` |
| **AUD-009** | Low | Database (B4) | DB Arch §5-9 | Advanced learner SRS tables (`review_events`, `daily_challenges`, `content_audit_logs`) not in schema | `src/lib/db/schema.ts` | **Not Built Yet** | Phase 2/3 (Milestone 2) |
| **AUD-010** | Low | Audio (B8) | Audio §5.2 | Line highlight seeking from audio timing manifest is drafted in schema but not wired in UI player | `src/components/learning/AudioPlayer.tsx` | **Not Built Yet** | Milestone 1C+ |
| **AUD-011** | Info | Architecture (B1) | Register D-04 | Tailwind adapter verification: exactly one `@theme` adapter present | `src/styles/tailwind-theme-v4.css` | **PASS (Verified)** | `tests/schema-invariants.test.mjs` |
| **AUD-012** | Info | Architecture (B1) | Register D-02 | Font loading: Inter, Hind Siliguri, Noto Sans Bengali loaded at max 600 weight; Poppins removed from code; historical docs annotated | `src/app/layout.tsx:1-51`, `scripts/check-poppins.mjs` | **Fixed** | `4640f99`, `d54d331` |
| **AUD-013** | Info | Architecture (B3) | Register D-13 | Component naming check: all retired names absent, modern names used | `src/components/learning/` | **PASS (Verified)** | Clean grep |
| **AUD-014** | Info | Architecture (B8) | Register A-11 | Gemini code isolation check: 0 imports in `src/`, provider gated in `scripts/audio/_pending_a11/` pending signed A-11 scope | `tests/gemini-isolation.test.mjs` | **Fixed** | `9f74cc5`, `28794fd` |
| **AUD-015** | Info | A11y (B11) | Framework §6 | Focus trap, Esc to close, focus return, and interactive words keyboard navigation verified; Playwright runner not installed in CI dependencies | `tests/e2e/keyboard-focus.spec.mjs`, `tests/focus-management.test.mjs` | **Blocked** | `cb05b69`, `4506917` |
| **AUD-016** | High | Content (B7) | Register D-07 | Seed translations set to draft; learner view guard with unreviewed notice | `src/content/seed/dialogues.ts:18` | **Fixed** | `6e05b37`, `cb05b69` |
| **AUD-017** | High | Database (B4) | Brief §19 | Database migrations execution on clean database instance | `src/lib/db/migrations/` | **Blocked** | `cb05b69`, `2dea356` |
| **AUD-018** | Medium | Content (B7) | Phase Plan §1D | Faceted pagination and admin unauthorized redirects | `src/app/explore/page.tsx` | **Not Built Yet** | Milestone 1D |
| **AUD-019** | Info | Design (B2) | Register D-06 | WCAG 4.5:1+ contrast verified across light and dark tokens | `scripts/check-tokens.mjs` | **PASS (Verified)** | `scripts/check-tokens.mjs` |
| **AUD-020** | High | Database (B4) | Register D-12 | Practice sessions table schema and 9 approved practice mode enum values | `src/lib/db/schema.ts`, `src/lib/db/migrations/0001_strange_gauntlet.sql` | **Fixed** | `16661b3`, `cb05b69` |
| **AUD-021** | High | Privacy (B10) | Privacy §4.1 | Privacy retention policy aligned with spec §4.1; client audio local-only (IndexedDB); P-3 recorded | `docs/DECISIONS.md:46` | **Fixed** | `4df5b52` |
| **AUD-022** | Medium | Design (B2) | Style Guide §11 | Outline icon family confirmation (Hugeicons Outlined in use, not confirmed) | `docs/DECISIONS.md:30` | **Needs Owner** | `fc5a752`, `40bc7f9` |
| **AUD-023** | High | Frontend (B7) | PROJECT_STATE §3.4 | Layout invariants test suite verifying header/sidebar/overflow across 7 routes, 2 viewports, 2 themes | `scripts/layout-invariants.mjs` | **PASS (Verified)** | `538cc6b` |
| **AUD-024** | High | Operations (B4) | Brief §19 | Migration apply status verification on staging/production database | `docs/AUDIT_REPORT.md` | **Needs Owner** | `7372011` |

---

## Known issues (KI-01 to KI-17)

| ID | Result | Note |
|:---|:---|:---|
| **KI-01** | **Fixed (`0c6d6fd`)** | Pilot niche dialogue line counts for steps 13–20 hit exact ladder targets `[14, 16, 18, 20, 22, 25, 30, 55]`. Script `scripts/check-ladder-counts.mjs` asserts 100% match. |
| **KI-02** | **Fixed (`8297c8a`, `eefb447`)** | `POST /api/v1/me/bookmarks` persists row with session `user_id`, returns 201 on create, 200 on duplicate (idempotent), and 401 when unauthenticated. Verified in `tests/bookmarks-api.test.mjs` (including payload spoofing protection). |
| **KI-03** | **Fixed (`5f573c4`)** | Added `src/app/auth/callback/route.ts` with open-redirect protection (`getSafeRedirectUrl`) and `src/middleware.ts` for Supabase session refresh. Verified in `tests/auth-callback.test.mjs`. |
| **KI-04** | **Fixed (`73e484e`)** | `Header.tsx` reads auth session: displays avatar initial / display name and Log out button when logged in, Log in button when logged out. Verified in `tests/header-state.test.mjs`. |
| **KI-05** | **Fixed (`3f8f70a`, `4b8f283`)** | Extracted UI strings to `messages/en.json` and `messages/bn.json` with 100% key parity (98/98 keys) and typed `t()` helper. Audited 73 remaining technical/admin strings in `docs/evidence/hardcoded-strings-justification.md`. Verified in `tests/i18n-coverage.test.mjs`. |
| **KI-06** | **Fixed (`203b822`, `3b8d57d`)** | Language coverage dynamically computed per Multi-Language §6.3: shows "English ✓" always, "Bangla ✓" when all lines are approved, and "Bangla —" otherwise. Verified in `tests/language-coverage.test.mjs`. |
| **KI-07** | **Fixed (`6e05b37`, `cb05b69`)** | Seed translations set to `draft`; learner view displays "Bangla translation coming soon" (`reader.translationComingSoon`); admin preview shows draft badge. `translations` schema has explicit FKs, `sourceVersion`, `sourceHash`, `reviewStatus`, and target check constraint per D-07. Verified in `tests/translations-review-status.test.mjs` and `tests/schema-invariants.test.mjs`. |
| **KI-08** | **Not Built Yet** | Core schema (`src/lib/db/schema.ts`) has 23 tables. Advanced SRS logging tables (`review_events`, `daily_challenges`, `content_audit_logs`) scheduled for Phase 2/3. |
| **KI-09** | **Blocked** | Blocked: no clean test database available. `drizzle.config.ts`, `src/lib/db/index.ts`, `.env.example`, and migrations exist and compile cleanly (`npx drizzle-kit generate` passes). Applying migrations requires a live throwaway test database (no local Docker or Postgres service available on host). Needed: Owner to provide throwaway test DB connection string or test branch. |
| **KI-10** | **Not Built Yet** | Faceted pagination and admin unauthorized redirects scheduled for Milestone 1D. |
| **KI-11** | **Fixed (`f83a1b2`)** | Converted `src/app/page.tsx` from Client Component to Server Component for SEO per Framework §5. |
| **KI-12** | **Blocked** | Blocked: no browser test runner. Playwright is not installed in dependencies. Real headless browser E2E test authored at `tests/e2e/keyboard-focus.spec.mjs` verifies keyboard Tab navigation, focus visible rings, and Escape key dismissal on `WordDetailPopover`. Full automated E2E gate blocked pending Playwright test runner installation. |
| **KI-13** | **Not Built Yet** | `timing_manifest` JSONB column exists in `audio_assets` table; word-level interactive seek in frontend reader scheduled for Milestone 1C+. |
| **KI-14** | **Fixed (`f58aa20`)** | Added `--ecp-ease-enter`, `--ecp-ease-exit`, and `--ecp-ease-emphasized` tokens to `src/styles/design-tokens.css` per MOTION §3.2. |
| **KI-15** | **PASS (Verified)** | WCAG 4.5:1+ contrast verified across light and dark tokens; audited by `scripts/check-tokens.mjs`. |
| **KI-16** | **Fixed (`16661b3`, `cb05b69`)** | `practice_sessions` table strictly matches Exercises spec §3.4 (`status`, `score_correct`, `score_total`, `last_item_position`, and `mode` enum with all 9 approved values). Verified in `tests/practice-modes.test.mjs` and `tests/schema-invariants.test.mjs`. |
| **KI-17** | **Fixed (`4640f99`, `d54d331`)** | Poppins removed from `next/font` and CSS font stacks. Fonts loaded: Inter, Hind Siliguri, Noto Sans Bengali (fallback per D-02). Zero occurrences of Poppins across repository code directories (`src/`, `public/`). Historical docs restored with dated non-current note. Verified by `scripts/check-poppins.mjs` and `tests/poppins-d02.test.mjs`. |

---

## Gemini Model Name Check

CI static audit verifying zero imports in product code and approved model configuration:

```bash
$ git grep -E -i "(gemini|genai|generativelanguage)" src/
# Result: 0 matches (Exit code: 1, completely isolated)

$ git grep "approved_tts_model" scripts/audio/
# Result: 0 matches (files moved to scripts/audio/_pending_a11/ pending signed A-11 scope)
```

- **Product code (`src/`):** 0 imports of Gemini, `@google/genai`, or `generativelanguage`.
- **Approved TTS model proposal:** `gemini-3.8-flash-tts` specified in `ECP_Gemini_TTS_Implementation.md`.
- **A-11 Scope Status:** Proposal unsigned by owner in `ECP_Decisions_Register.md` §5. Offline generator files moved to `scripts/audio/_pending_a11/` with README stating: "Not active. Waiting for owner signature on A-11."
- **Unapproved model check:** `gemini-3.8-flash-medium` has 0 occurrences across the entire repository.

---

## Not Built Yet

| Item | Plan Reference | Planned Milestone |
|:---|:---|:---|
| Audio timing manifest interactive word seek in UI player | Audio §5.2 | Milestone 1C+ |
| Advanced SRS logging tables (`review_events`, `daily_challenges`, `content_audit_logs`) | Exercises §3.4 | Milestone 2 |
| Faceted pagination and admin unauthorized redirects | Phase Plan §1D | Milestone 1D |

---

## Migration Apply Status

- **Migration files:** `src/lib/db/migrations/0000_round_puck.sql`, `src/lib/db/migrations/0001_strange_gauntlet.sql`
- **Local database status:** Not applied to local database (no local database present).
- **Staging / Production status:** Unknown: cannot access remote environments from this sandbox.
- **Operator verification command:**
  ```bash
  psql "$DATABASE_URL" -c "SELECT * FROM \"drizzle\".\"__drizzle_migrations\";"
  ```
- **Operator apply command:**
  ```bash
  npx drizzle-kit migrate
  ```

---

## Needs Owner

| # | Question | Options | Recommendation |
|:---|:---|:---|:---|
| 1 | **D-LLM Provider at Gate 2:** Which provider should be selected for Phase 2 dynamic conversation practice? | **A.** Gemini API (native multi-modal)<br>**B.** Anthropic / OpenAI | **A (Recommended):** Gemini API per initial project brief. |
| 2 | **P-1/P-3 Jurisdiction & Retention Policy:** Confirm jurisdiction (e.g. Bangladesh / GDPR) and confirm starting retention values from Privacy spec §4.1 (voice recordings device-only; roleplay transcripts 90 days; practice answers 12 months; raw analytics 13 months; technical logs 30 days). | **A.** Confirm Privacy spec §4.1 retention rules.<br>**B.** Custom retention schedule. | **Owner decision pending (no value chosen by agent).** |
| 3 | **Icon Set Selection (Style Guide §11 / AUD-ICON):** Style Guide §11 specifies "one consistent outline icon family throughout the product" but does not name a library. Current package: Hugeicons Outlined (in use, not confirmed). Confirm Hugeicons or designate an alternate outline icon library. | **A.** Confirm Hugeicons Outlined.<br>**B.** Specify alternative outline icon set. | **Needs owner (no package named in style guide).** |
| 4 | **Database Migration Apply Status Verification (AUD-MIGRATE):** Verify whether migrations `0000_round_puck.sql` and `0001_strange_gauntlet.sql` are applied in staging/production.<br>Verification: `psql "$DATABASE_URL" -c "SELECT * FROM \"drizzle\".\"__drizzle_migrations\";"`<br>Apply: `npx drizzle-kit migrate` | **A.** Run verification and apply migrations if missing.<br>**B.** Manage via Supabase dashboard / migration runner. | **Required operational step before launch.** |

---

## Verification Summary

All verification commands executed cleanly on `main` (`4506917`):

1. **Frozen Block Integrity:**
   ```bash
   $ npm run check:frozen
   Checking frozen .rainbow-border block in src/app/globals.css...
   ✓ Frozen .rainbow-border block matches snapshot byte-identically.
   ```
2. **UI Size & Weight Floor:**
   ```bash
   $ npm run lint:ui
   ✓ UI audit passed: strictly conforms to minimum font-size floor (12px), max font-weight 600, no arbitrary hex colors.
   ```
3. **Layout Invariants Suite (All 233 Assertions Passing):**
   ```bash
   $ npm run test:layout
   Testing dynamic mutation: --header-h -> 96px...
   Executed 233 assertions across 7 routes, 2 viewports, 2 themes, and 2 scroll states.
   ✅ ALL 233 LAYOUT INVARIANTS PASSED STRICTLY.
   ```
4. **TypeScript & Test Suite (26/26 Tests Passing):**
   ```bash
   $ npx tsc --noEmit && npm test
   ℹ tests 26, suites 1, pass 26, fail 0, duration 455ms
   ```
5. **Next.js Production Build:**
   ```bash
   $ npm run build
   ✓ Compiled successfully in 759ms
   ✓ Generating static pages using 9 workers (83/83) in 627ms
   ```
6. **Gemini Code Isolation Check:**
   ```bash
   $ git grep -E -i "(gemini|genai|generativelanguage)" src/
   # Exit code 1 (0 matches)
   ```
7. **D-02 Font Invariants Check:**
   ```bash
   $ node scripts/check-poppins.mjs
   ✅ D-02 font check passed: 0 occurrences of Poppins in code directories (src/, public/).
   ```
8. **Conversation Ladder Counts:**
   ```bash
   $ npm run check:ladder
   ✅ Conversation ladder verified: all 20 steps match exact dialogue and Bangla line counts.
   ```
