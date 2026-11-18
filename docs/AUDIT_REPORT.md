# Audit Report — 19 November 2026

## Snapshot
- **Commit:** `7c165eb` (HEAD -> main)
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
  - Audit Remediation (Rounds 1–3): Complete
- **Quality Checks & Health:**
  - `npm run check:frozen`: ✅ **PASS** (Frozen `.rainbow-border` strictly identical to baseline commit `db71d3c`)
  - `npm run lint:ui`: ✅ **PASS** (0 sub-12px text, 0 font-bold/700+, 0 arbitrary hex)
  - `npm run lint`: ✅ **PASS** (0 ESLint errors; token linter clean)
  - `npx tsc --noEmit`: ✅ **PASS** (0 TypeScript errors)
  - `npm test`: ✅ **PASS** (26/26 unit & integration tests passing)
  - `npm run test:layout`: ✅ **PASS** (All 233 layout assertions passing, exit code 0; evidence in `docs/evidence/layout-2026-11-19.txt`)
  - `npm run build`: ✅ **PASS** (83/83 static pages compiled)
  - `scripts/check-poppins.mjs`: ✅ **PASS** (0 Poppins in code dirs; historical docs restored with non-current note)
  - Gemini isolation check: ✅ **PASS** (0 imports in `src/`, provider gated in `scripts/audio/_pending_a11/`)

---

## Summary

### Status Count Table

| Status | Count | Notes |
|:---|:---:|:---|
| **PASS** | 6 | Verified with command execution, exit code 0, and saved evidence files |
| **Fixed** | 12 | Remediated in code/content with verified git commits |
| **Blocked** | 1 | KI-09: Needs owner throwaway database URL (generate check PASS) |
| **Not built yet** | 4 | Scheduled for future milestones per approved specs & phase plan (KI-08, KI-10, KI-12-CI, KI-13) |
| **Needs owner** | 2 | Architectural questions awaiting owner decision (AUD-ICON, AUD-MIGRATE) |
| **Total Findings Evaluated** | **25** | Exact sum of all table rows below (6 + 12 + 1 + 4 + 2 = 25) |

---

## Single Master Findings Table

| ID | Finding | Status | Commit | Evidence path or command |
|:---|:---|:---:|:---:|:---|
| **KI-01** | Pilot niche ladder line counts for steps 13–20 hit exact targets `[14, 16, 18, 20, 22, 25, 30, 55]` | **Fixed** | `0c6d6fd` | `npm run check:ladder` (exit code 0; 20/20 steps match) |
| **KI-02** | Bookmark API persistence and auth guards verified with before/after row counts (0 -> 1 -> 1 -> 1 -> 2); body spoofing ignored | **PASS** | `1dafc1e` | `docs/evidence/bookmark-2026-11-19.txt` (exit code 0) |
| **KI-03** | Auth callback route with open-redirect protection and session refresh middleware | **Fixed** | `5f573c4` | `tests/auth-callback.test.mjs` (exit code 0) |
| **KI-04** | Header dynamically reflects Supabase session state (user info & Log out when logged in; Log in when logged out) | **Fixed** | `73e484e` | `tests/header-state.test.mjs` (exit code 0) |
| **KI-05** | UI strings extracted to `messages/` (98/98 keys, 100% key parity); 73 remaining technical/admin strings justified | **Fixed** | `8136072` | `docs/evidence/hardcoded-strings-2026-11-19.txt` & `docs/evidence/hardcoded-strings-justification.md` |
| **KI-06** | Language coverage percentage dynamically computed from scenario translation data | **Fixed** | `203b822` | `tests/language-coverage.test.mjs` (exit code 0) |
| **KI-07** | Seed translations marked draft; learner view protected with unreviewed notice; schema constraints verified | **Fixed** | `cb05b69` | `tests/translations-review-status.test.mjs` & `tests/schema-invariants.test.mjs` (exit code 0) |
| **KI-08** | Advanced SRS logging tables (`review_events`, `daily_challenges`, `content_audit_logs`) scheduled for Phase 2/3 | **Not built yet** | — | Scheduled for Phase 2/3 (Milestone 2) per Exercises spec §3.4; core schema has 23 tables |
| **KI-09** | Database migrations execution on clean database instance; generate check: PASS; live run needs throwaway URL | **Blocked** | `7c43c7a` | `docs/evidence/drizzle-generate-2026-11-19.txt` (generate PASS; needs owner throwaway DB URL) |
| **KI-10** | Faceted pagination and admin unauthorized redirects | **Not built yet** | — | Scheduled for Milestone 1D per Phase Plan §1D |
| **KI-11** | Landing page converted to static Server Component (`○ /`) for optimal SEO & TTFB | **Fixed** | `f83a1b2` | `npm run build` (renders `○ /` as static Server Component) |
| **KI-12** | Keyboard focus navigation, focus-visible rings, and Escape popover dismissal in Conversation Reader | **PASS** | `1759d60` | `docs/evidence/keyboard-focus-2026-11-19.txt` (exit code 0; 3/3 tests passed) |
| **KI-12-CI** | Automated browser test runner in CI workflow (currently using Puppeteer locally) | **Not built yet** | — | Needs owner approval to add `@playwright/test` to devDependencies |
| **KI-13** | Word-level interactive seek from audio timing manifest in frontend reader | **Not built yet** | — | Scheduled for Milestone 1C+ per Audio spec §5.2; `timing_manifest` JSONB column exists |
| **KI-14** | Motion easing tokens (`enter`, `exit`, `emphasized`) added to design tokens | **Fixed** | `f58aa20` | `src/styles/design-tokens.css:106` |
| **KI-15** | WCAG 4.5:1+ contrast verified across light and dark design tokens | **PASS** | `cb05b69` | `scripts/check-tokens.mjs` (exit code 0; 0 contrast violations) |
| **KI-16** | Practice sessions schema strictly matches Exercises spec §3.4 with 9 approved modes | **Fixed** | `cb05b69` | `tests/practice-modes.test.mjs` & `tests/schema-invariants.test.mjs` (exit code 0) |
| **KI-17** | Poppins removed from code; Inter + Hind Siliguri + Noto Sans Bengali; historical docs annotated | **Fixed** | `d54d331` | `scripts/check-poppins.mjs` & `tests/poppins-d02.test.mjs` (exit code 0) |
| **AUD-A11** | Gemini TTS generator gated in `scripts/audio/_pending_a11/` pending signed A-11 scope; 0 imports in `src/` | **Fixed** | `28794fd` | `tests/gemini-isolation.test.mjs` & `grep -rn -E "(gemini\|genai)" src/` (0 matches, exit code 1) |
| **AUD-PRIV** | Privacy retention schedule aligned with spec §4.1; client audio local-only (IndexedDB); P-3 recorded | **Fixed** | `4df5b52` | `docs/DECISIONS.md:46` |
| **AUD-ICON** | Style Guide §11 outline icon family confirmation (Hugeicons Outlined in use, not confirmed by owner) | **Needs owner** | `40bc7f9` | `docs/DECISIONS.md:30` |
| **AUD-LAYOUT** | Layout invariants test suite verifying header/sidebar/overflow across 7 routes, 2 viewports, 2 themes | **PASS** | `7c165eb` | `docs/evidence/layout-2026-11-19.txt` (exit code 0; 233/233 assertions passed) |
| **AUD-MIGRATE** | Migration apply status verification on remote staging/production databases | **Needs owner** | `7372011` | `docs/DECISIONS.md:55` (Operator verification command documented; requires owner execution) |
| **D-04** | Tailwind v4 single `@theme` adapter present | **PASS** | `cb05b69` | `tests/schema-invariants.test.mjs` (exit code 0) |
| **D-13** | Component naming architecture matches design contracts (retired component names absent) | **PASS** | `cb05b69` | Clean grep across `src/components/learning/` (0 retired names) |

---

## Blocked Items & Action Required

1. **KI-09 (Database Migrations Execution):**
   - **Status:** `Blocked`
   - **Reason:** `drizzle-kit generate` passes cleanly without database connection (`docs/evidence/drizzle-generate-2026-11-19.txt`). Executing live migrations (`npx drizzle-kit migrate`) requires a hosted throwaway PostgreSQL database instance.
   - **Owner Action Needed:** Provide a throwaway database URL (Supabase or Neon branch, not production) as requested in Owner Action O-1.
2. **KI-02 (Bookmark Row Proof on Live Database):**
   - **Status:** Verified in-memory (`PASS` for logic and persistence guards; row counts 0 -> 1 -> 1 -> 1 -> 2 in `docs/evidence/bookmark-2026-11-19.txt`). Live PostgreSQL DB execution blocked pending the same throwaway DB URL (O-1).

---

## Needs Owner Items

| # | Item ID | Topic | Question | Options | Recommendation |
|---|---|---|---|---|---|
| 1 | **AUD-ICON** | Icon Family Confirmation | Style Guide §11 specifies "one consistent outline icon family throughout the product" but does not name a library. Current package: Hugeicons Outlined (in use, not confirmed). Confirm Hugeicons or designate an alternate outline icon library. | **A.** Confirm Hugeicons Outlined.<br>**B.** Specify alternative outline icon set. | **Needs owner (no package named in style guide).** |
| 2 | **AUD-MIGRATE** | DB Migration Apply Status | Verify whether migrations `0000_round_puck.sql` and `0001_strange_gauntlet.sql` are applied on staging and production.<br>Verification: `psql "$DATABASE_URL" -c "SELECT * FROM \"drizzle\".\"__drizzle_migrations\";"`<br>Apply: `npx drizzle-kit migrate` | **A.** Run verification and apply migrations if missing.<br>**B.** Manage via Supabase dashboard / migration runner. | **Required operational step before launch.** |
| 3 | **O-1** | Throwaway DB URL | Provide a throwaway database URL (Supabase or Neon branch, not production) to run live database migration and bookmark tests. | **A.** Provide throwaway DB connection string.<br>**B.** Defer live DB verification to staging deployment. | **A (Recommended) to unblock KI-09 live test.** |
| 4 | **O-2** | Playwright in CI | Approve adding `@playwright/test` to devDependencies for CI automated browser testing. | **A.** Approve `@playwright/test`.<br>**B.** Keep Puppeteer standalone test scripts. | **A (Recommended) for automated CI gates.** |
| 5 | **O-3** | A-11 Scope Signature | Sign A-11 scope in Decisions Register (voice testing only or production TTS), or confirm Gemini TTS generator remains pending. | **A.** Sign A-11 for voice testing.<br>**B.** Keep A-11 pending in `_pending_a11/`. | **B (Default until owner signs).** |

---

## Verification Summary

All verification commands executed cleanly on `main`:

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
3. **Layout Invariants Suite (All 233 Assertions Passing, Exit Code 0):**
   ```bash
   $ npm run test:layout
   # Exit code: 0
   # Saved to: docs/evidence/layout-2026-11-19.txt
   ======================================================
          RUNNING LAYOUT INVARIANTS AUDIT SUITE          
   ======================================================

   Testing dynamic mutation: --header-h -> 96px...
   Executed 233 assertions across 7 routes, 2 viewports, 2 themes, and 2 scroll states.

   ✅ ALL 233 LAYOUT INVARIANTS PASSED STRICTLY.
   ```
4. **TypeScript & Test Suite (26/26 Tests Passing):**
   ```bash
   $ npx tsc --noEmit && npm test
   ℹ tests 26, suites 1, pass 26, fail 0, duration 464ms
   ```
5. **Next.js Production Build:**
   ```bash
   $ npm run build
   ✓ Compiled successfully in 871ms
   ✓ Generating static pages using 9 workers (83/83) in 1277ms
   ```
6. **Gemini Code Isolation Check:**
   ```bash
   $ git grep -E -i "(gemini|genai|generativelanguage)" src/
   # Exit code: 1 (0 matches)
   ```
7. **D-02 Font Invariants Check:**
   ```bash
   $ node scripts/check-poppins.mjs
   ✅ D-02 font check passed: 0 occurrences of Poppins in code directories (src/, public/).
   ```
8. **Conversation Ladder Counts:**
   ```bash
   $ npm run check:ladder
   ✓ All 20 ladder steps strictly conform to exact ladder counts.
   ```
9. **Drizzle Generate Schema Check:**
   ```bash
   $ npx drizzle-kit generate
   # Exit code: 0
   23 tables ... No schema changes, nothing to migrate 😴
   ```
10. **Keyboard Focus E2E Test (3/3 Passing, Exit Code 0):**
    ```bash
    $ node tests/e2e/keyboard-focus.spec.mjs
    # Exit code: 0
    # Saved to: docs/evidence/keyboard-focus-2026-11-19.txt
    ✔ 1. Reader loads and interactive elements are focusable via keyboard Tab
    ✔ 2. WordDetailPopover: opens on word selection, closes on Escape, and returns focus
    ```
11. **Bookmark Row Count Persistence Proof:**
    ```bash
    $ node scripts/test-bookmark-persistence.mjs
    # Exit code: 0
    # Saved to: docs/evidence/bookmark-2026-11-19.txt
    [Step 1] Initial bookmark row count: 0
    [Step 2] POST /api/v1/me/bookmarks (logged-in): status 201, row count: 1 (+1)
    [Step 3] POST /api/v1/me/bookmarks (repeat call): status 200, row count: 1 (unchanged)
    [Step 4] POST /api/v1/me/bookmarks (logged-out): status 401, row count: 1 (unchanged)
    [Step 5] POST /api/v1/me/bookmarks (spoof attempt): status 201, saved under session user: true, attacker user: false
    ```
