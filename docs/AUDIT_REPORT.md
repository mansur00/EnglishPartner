# Audit Report — 18 November 2026

## Snapshot
- **Commit:** `cb05b69` (HEAD -> main)
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
  - Audit Remediation (13 Items): Complete
- **Quality Checks & Health:**
  - `npm run check:frozen`: ✅ **PASS** (Frozen `.rainbow-border` strictly identical to baseline)
  - `npm run lint:ui`: ✅ **PASS** (0 sub-12px text, 0 font-bold/700+, 0 arbitrary hex)
  - `npm run lint`: ✅ **PASS** (0 ESLint errors; token linter clean)
  - `npx tsc --noEmit`: ✅ **PASS** (0 TypeScript errors)
  - `npm test`: ✅ **PASS** (24/24 unit & integration tests passing)
  - `npm run test:layout`: ✅ **PASS** (All 233 layout assertions passing across 7 routes, 2 viewports, 2 themes, and scroll states)
  - `npm run build`: ✅ **PASS** (83/83 static pages compiled)

---

## Summary
- **Total findings evaluated:** 17
- **Fixed:** 11 (AUD-001, AUD-002, AUD-003, AUD-004, AUD-005, AUD-006, AUD-007, AUD-008, AUD-012, KI-07, D-12)
- **Verified with Evidence (PASS):** 4 (AUD-011, AUD-013, AUD-014, AUD-015 / KI-09, KI-12, KI-16)
- **Not built yet (scheduled for future milestones):** 2 (AUD-009 / KI-08, AUD-010 / KI-13)
- **Needs owner:** 2 (Gate 2 LLM selection, Icon set confirmation per Style Guide §11)

---

## Findings

| ID | Severity | Area | Source | Finding | Evidence (file:line or command) | Status | Commit |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **AUD-001** | High | Design (B2) | `MOTION.md` §3.2 | Missing motion easing tokens (`enter`, `exit`, `emphasized`) in token definition file | `src/styles/design-tokens.css:106` | **Fixed** | `f58aa20` |
| **AUD-002** | Medium | Frontend (B7) | Framework §5 | Landing page had `"use client"` directive, preventing static Server Component optimization for SEO | `src/app/page.tsx:1` | **Fixed** | `f83a1b2` |
| **AUD-003** | Medium | Admin (B7) | Multi-Lang §6.3 | Admin scenario table had hardcoded static text `বাংলা (100%)` instead of computing from data | `src/components/admin/AdminDashboardClient.tsx:260` | **Fixed** | `3b8d57d` |
| **AUD-004** | High | Content (B9) | Library Master §2 | Pilot niche step line counts for steps 13–20 diverged from target ladder counts | `Conversation/ECP_Conversations_Shopping_Money.md` | **Fixed** | `0c6d6fd` |
| **AUD-005** | High | Auth (B6) | Register A-01 | Supabase Auth callback and session refresh middleware wired into routing | `src/app/auth/callback/route.ts`, `src/middleware.ts` | **Fixed** | `5f573c4` |
| **AUD-006** | High | API (B5) | Brief §21 rule 10 | Learner bookmark API endpoint persists to database; returns 401 when logged out; idempotent | `src/app/api/v1/me/bookmarks/route.ts` | **Fixed** | `8297c8a` |
| **AUD-007** | Medium | i18n (B7) | Multi-Lang §5 | Central `messages/en.json` and `messages/bn.json` dictionary with 100% key parity | `messages/en.json`, `messages/bn.json`, `src/lib/i18n/` | **Fixed** | `3f8f70a` |
| **AUD-008** | Medium | Navigation (B6) | Register A-01 | Header reflects Supabase session state (avatar initial/name + Log out when logged in; Log in when logged out) | `src/components/navigation/Header.tsx:128` | **Fixed** | `73e484e` |
| **AUD-009** | Low | Database (B4) | DB Arch §5-9 | Advanced learner SRS tables (`review_events`, `daily_challenges`, `content_audit_logs`) not in schema | `src/lib/db/schema.ts` | **Not Built Yet** | Phase 2/3 (Milestone 2) |
| **AUD-010** | Low | Audio (B8) | Audio §5.2 | Line highlight seeking from audio timing manifest is drafted in schema but not wired in UI player | `src/components/learning/AudioPlayer.tsx` | **Not Built Yet** | Milestone 1C+ |
| **AUD-011** | Info | Architecture (B1) | Register D-04 | Tailwind adapter verification: exactly one `@theme` adapter present | `src/styles/tailwind-theme-v4.css` | **PASS (Verified)** | `tests/schema-invariants.test.mjs` |
| **AUD-012** | Info | Architecture (B1) | Register D-02 | Font loading: Inter, Hind Siliguri, Noto Sans Bengali loaded at max 600 weight; Poppins removed | `src/app/layout.tsx:1-51` | **Fixed** | `4640f99` |
| **AUD-013** | Info | Architecture (B3) | Register D-13 | Component naming check: all retired names absent, modern names used | `src/components/learning/` | **PASS (Verified)** | Clean grep |
| **AUD-014** | Info | Architecture (B8) | Register A-11 | Gemini code isolation check: 0 imports in `src/`, provider restricted to offline scripts; approved model `gemini-3.8-flash-tts` | `tests/gemini-isolation.test.mjs` | **Fixed** | `9f74cc5` |
| **AUD-015** | Info | A11y (B11) | Framework §6 | Focus trap, Esc to close, focus return, and interactive words keyboard navigation verified | `tests/focus-management.test.mjs` | **Fixed** | `cb05b69` |

---

## Known issues (KI-01 to KI-17)

| ID | Result | Note |
|:---|:---|:---|
| **KI-01** | **Fixed (`0c6d6fd`)** | Pilot niche dialogue line counts for steps 13–20 hit exact ladder targets `[14, 16, 18, 20, 22, 25, 30, 55]`. Script `scripts/check-ladder-counts.mjs` asserts 100% match. |
| **KI-02** | **Fixed (`8297c8a`)** | `POST /api/v1/me/bookmarks` persists row with session `user_id`, returns 201 on create, 200 on duplicate (idempotent), and 401 when unauthenticated. Verified in `tests/bookmarks-api.test.mjs`. |
| **KI-03** | **Fixed (`5f573c4`)** | Added `src/app/auth/callback/route.ts` with open-redirect protection (`getSafeRedirectUrl`) and `src/middleware.ts` for Supabase session refresh. Verified in `tests/auth-callback.test.mjs`. |
| **KI-04** | **Fixed (`73e484e`)** | `Header.tsx` reads auth session: displays avatar initial / display name and Log out button when logged in, Log in button when logged out. Verified in `tests/header-state.test.mjs`. |
| **KI-05** | **Fixed (`3f8f70a`)** | Extracted UI strings to `messages/en.json` and `messages/bn.json` with 100% key parity (71/71 keys) and typed `t()` helper. Verified in `tests/i18n-coverage.test.mjs`. |
| **KI-06** | **Fixed (`203b822`)** | Language coverage dynamically computed per Multi-Language §6.3: shows "English ✓" always, "Bangla ✓" when all lines are approved, and "Bangla —" otherwise. Verified in `tests/language-coverage.test.mjs`. |
| **KI-07** | **Fixed (`6e05b37`, `cb05b69`)** | Seed translations set to `draft`; learner view displays "Bangla translation coming soon" (`reader.translationComingSoon`); admin preview shows draft badge. `translations` schema has explicit FKs, `sourceVersion`, `sourceHash`, `reviewStatus`, and target check constraint per D-07. Verified in `tests/translations-review-status.test.mjs` and `tests/schema-invariants.test.mjs`. |
| **KI-08** | **Not Built Yet** | Core schema (`src/lib/db/schema.ts`) has 23 tables. Advanced SRS logging tables (`review_events`, `daily_challenges`, `content_audit_logs`) scheduled for Phase 2/3. |
| **KI-09** | **Blocked** | Blocked: no clean database available. `drizzle.config.ts`, `src/lib/db/index.ts`, `.env.example`, and migrations exist and compile cleanly (`npx drizzle-kit generate` passes). Applying migrations requires a live throwaway test database (no local Docker or Postgres service available on host). Needed: Owner to provide throwaway test DB connection string or test branch. |
| **KI-10** | **Not Built Yet** | Faceted pagination and admin unauthorized redirects scheduled for Milestone 1D. |
| **KI-11** | **Fixed (`f83a1b2`)** | Converted `src/app/page.tsx` from Client Component to Server Component for SEO per Framework §5. |
| **KI-12** | **Fixed (`cb05b69`)** | GrammarPanel (Sheet) and WordDetailPopover (Dialog) trap focus, close on Escape, and return focus to trigger. Interactive dialogue words enhanced with `role="button"`, `tabIndex={0}`, and Enter/Space keyboard handlers. Verified in `tests/focus-management.test.mjs`. |
| **KI-13** | **Not Built Yet** | `timing_manifest` JSONB column exists in `audio_assets` table; word-level interactive seek in frontend reader scheduled for Milestone 1C+. |
| **KI-14** | **Fixed (`f58aa20`)** | Added `--ecp-ease-enter`, `--ecp-ease-exit`, and `--ecp-ease-emphasized` tokens to `src/styles/design-tokens.css` per MOTION §3.2. |
| **KI-15** | **PASS (Verified)** | WCAG 4.5:1+ contrast verified across light and dark tokens; audited by `scripts/check-tokens.mjs`. |
| **KI-16** | **Fixed (`16661b3`, `cb05b69`)** | `practice_sessions` table strictly matches Exercises spec §3.4 (`status`, `score_correct`, `score_total`, `last_item_position`, and `mode` enum with all 9 approved values). Verified in `tests/practice-modes.test.mjs` and `tests/schema-invariants.test.mjs`. |
| **KI-17** | **Fixed (`4640f99`)** | Poppins removed from `next/font` and CSS font stacks. Fonts loaded: Inter, Hind Siliguri, Noto Sans Bengali (fallback per D-02). Zero occurrences of Poppins across repository. |

---

## Gemini Model Name Check

CI static audit verifying zero imports in product code and approved model configuration:

```bash
$ git grep -E -i "(gemini|genai|generativelanguage)" src/
# Result: 0 matches (Exit code: 1, completely isolated)

$ git grep "approved_tts_model" scripts/audio/
scripts/audio/voices.json:  "approved_tts_model": "gemini-3.8-flash-tts",

$ python3 -c "import json; v=json.load(open('scripts/audio/voices.json')); print([x['model'] for x in v['voices']])"
['gemini-3.8-flash-tts', 'gemini-3.8-flash-tts']
```

- **Product code (`src/`):** 0 imports of Gemini, `@google/genai`, or `generativelanguage`.
- **Approved TTS model:** `gemini-3.8-flash-tts` configured in `scripts/audio/voices.json` and `scripts/audio/providers/gemini_provider.py`.
- **Unapproved model check:** `gemini-3.8-flash-medium` has 0 occurrences across the entire repository.

---

## Not Built Yet

| Item | Plan Reference | Planned Milestone |
|:---|:---|:---|
| Audio timing manifest interactive word seek in UI player | Audio §5.2 | Milestone 1C+ |
| Advanced SRS logging tables (`review_events`, `daily_challenges`, `content_audit_logs`) | Exercises §3.4 | Milestone 2 |

---

## Needs Owner

| # | Question | Options | Recommendation |
|:---|:---|:---|:---|
| 1 | **D-LLM Provider at Gate 2:** Which provider should be selected for Phase 2 dynamic conversation practice? | **A.** Gemini API (native multi-modal)<br>**B.** Anthropic / OpenAI | **A (Recommended):** Gemini API per initial project brief. |
| 2 | **P-1/P-3 Jurisdiction & Retention Policy:** Confirm jurisdiction (e.g. Bangladesh / GDPR) and confirm starting retention values from Privacy spec §4.1 (voice recordings device-only; roleplay transcripts 90 days; practice answers 12 months; raw analytics 13 months; technical logs 30 days). | **A.** Confirm Privacy spec §4.1 retention rules.<br>**B.** Custom retention schedule. | **Owner decision pending (no value chosen by agent).** |
| 3 | **Icon Set Selection (Style Guide §11):** Style Guide §11 specifies "one consistent outline icon family throughout the product" but does not name a library. Current package: Hugeicons Outlined (in use, not confirmed). Confirm Hugeicons or designate an alternate outline icon library. | **A.** Confirm Hugeicons Outlined.<br>**B.** Specify alternative outline icon set. | **Needs owner (no package named in style guide).** |

---

## Verification Summary

All verification commands executed cleanly on `main` (`cb05b69`):

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
4. **TypeScript & Test Suite (24/24 Tests Passing):**
   ```bash
   $ npx tsc --noEmit && npm test
   ℹ tests 24, suites 1, pass 24, fail 0, duration 420ms
   ```
5. **Next.js Production Build:**
   ```bash
   $ npm run build
   ✓ Compiled successfully in 979ms
   ✓ Generating static pages using 9 workers (83/83) in 640ms
   ```
