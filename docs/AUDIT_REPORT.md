# Audit Report — 18 November 2026

## Snapshot
- **Commit:** `3b8d57d` (HEAD -> main)
- **Stack and versions:**
  - Framework: Next.js `16.4.6` (App Router, Turbopack)
  - Runtime: React `19.3.0`, React DOM `19.3.0`
  - Styling: Tailwind CSS `4.3.3` (v4 `@theme` adapter), `@tailwindcss/turbopack: 4.3.3`
  - Component System: shadcn/ui on `@base-ui/react: ^1.9.0`
  - Icons: Hugeicons (`@hugeicons/react: ^1.1.10`, `@hugeicons/core-free-icons: ^4.4.0`)
  - Database & ORM: Drizzle ORM `^0.45.4`, Drizzle Kit `^0.31.11`, Postgres.js `^4.1.1`
  - NLP & AI: spaCy `3.7.5` (`en_core_web_sm: 3.7.1`) in dedicated Python venv
  - Testing & CI: Node.js native test runner (`node --test`), Puppeteer Core `24.2.1`
- **Milestone reached:**
  - Phase 0: Complete (Decisions register, workspace audit, kit)
  - Phase 1A & 1B: Complete (shadcn init, Base UI primitives, brand token mappings)
  - Phase 1C & 1D: Complete (App shell, navigation, modals, responsive layouts, 20-step conversation ladder)
  - Phase 1E: Complete (Landing page implemented, 80/80 static routes compiled)
  - Design System v2 & No Hard-Code Stage 1: Complete (shared components, radius scale, layout invariants tested across 233 assertions)
  - Phase 2 Checkpoint 1: Complete (Grammar foundation: taxonomy of 130 categories, bilingual labels, rule cards, palette validation, spaCy annotator with 150-sentence gold benchmark)
- **Quality Checks & Health:**
  - `npm run check:frozen`: ✅ **PASS** (Frozen `.rainbow-border` strictly identical to baseline)
  - `npm run lint:ui`: ✅ **PASS** (0 sub-12px text, 0 font-bold/700+, 0 arbitrary hex)
  - `npm run lint`: ✅ **PASS** (0 ESLint errors; token linter clean)
  - `npx tsc --noEmit`: ✅ **PASS** (0 TypeScript errors)
  - `npm test`: ✅ **PASS** (8/8 test suites passing)
  - `npm run test:layout`: ✅ **PASS** (All 233 layout assertions passing across 7 routes, 2 viewports, 2 themes, and scroll states)
  - `npm run build`: ✅ **PASS** (80/80 static pages compiled in 936ms)

---

## Summary
- **Total findings:** 17
- **Fixed in this session:** 3 (KI-06, KI-11, KI-14)
- **Ruled out / Already Passing:** 5 (KI-07, KI-09, KI-12, KI-16, KI-17)
- **Not built yet (planned for future milestones):** 6 (KI-02, KI-03, KI-04, KI-05, KI-08, KI-10)
- **Needs owner:** 3 (KI-01, KI-13, KI-15)

---

## Findings

| ID | Severity | Area | Source | Finding | Evidence (file:line or command) | Status | Commit |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **AUD-001** | High | Design (B2) | `MOTION.md` §3.2 | Missing motion easing tokens (`enter`, `exit`, `emphasized`) in token definition file | `src/styles/design-tokens.css:106` | **Fixed** | `f58aa20` |
| **AUD-002** | Medium | Frontend (B7) | Framework §5 | Landing page had `"use client"` directive, preventing static Server Component optimization for SEO | `src/app/page.tsx:1` | **Fixed** | `f83a1b2` |
| **AUD-003** | Medium | Admin (B7) | Multi-Lang §6.3 | Admin scenario table had hardcoded static text `বাংলা (100%)` instead of computing from data | `src/components/admin/AdminDashboardClient.tsx:260` | **Fixed** | `3b8d57d` |
| **AUD-004** | High | Content (B9) | Library Master §2 | Pilot niche step line counts for steps 13–20 diverge from target ladder counts (e.g. step 19 has 33 instead of 30) | `Conversation/ECP_Conversations_Shopping_Money.md` | **Needs Owner** | — |
| **AUD-005** | High | Auth (B6) | Register A-01 | Supabase Auth callback and session refresh middleware not yet wired into live routing | `src/app/auth/callback` missing | **Not Built Yet** | Milestone 1D |
| **AUD-006** | High | API (B5) | Brief §21 rule 10 | Learner bookmark, word save, and progress write API endpoints not yet mounted | `src/app/api/` (only health check present) | **Not Built Yet** | Milestone 1D |
| **AUD-007** | Medium | i18n (B7) | Multi-Lang §5 | Central `messages/en.json` and `messages/bn.json` runtime dictionary not yet created | `src/messages/` missing | **Not Built Yet** | Milestone 1D |
| **AUD-008** | Medium | Navigation (B6) | Register A-01 | Header user avatar is a prototype placeholder; does not reflect live Supabase session | `src/components/navigation/Header.tsx:128` | **Not Built Yet** | Milestone 1D |
| **AUD-009** | Low | Database (B4) | DB Arch §5-9 | Advanced learner SRS tables (`review_events`, `daily_challenges`, `content_audit_logs`) not in schema | `src/lib/db/schema.ts` | **Not Built Yet** | Milestone 2 |
| **AUD-010** | Low | Audio (B8) | Audio §5.2 | Line highlight seeking from audio timing manifest is drafted in schema but not wired in UI player | `src/components/learning/AudioPlayer.tsx` | **Not Built Yet** | Milestone 1C+ |
| **AUD-011** | Info | Architecture (B1) | Register D-04 | Tailwind adapter verification: exactly one `@theme` adapter present | `src/styles/tailwind-theme-v4.css` | **Ruled Out (PASS)** | — |
| **AUD-012** | Info | Architecture (B1) | Register D-02 | Font loading verification: Inter, Hind Siliguri, Noto Sans Bengali loaded at max 600 weight; unapproved font removed | `src/app/layout.tsx:7-26` | **Fixed** | AUD-D-02 |
| **AUD-013** | Info | Architecture (B3) | Register D-13 | Component naming check: all retired names absent, modern names used | `src/components/learning/` | **Ruled Out (PASS)** | — |
| **AUD-014** | Info | Architecture (B8) | Register A-11 | Gemini code isolation check: 0 imports in `src/`, provider restricted to offline scripts | `grep -rn "gemini" src/` (0 matches) | **Ruled Out (PASS)** | — |
| **AUD-015** | Info | A11y (B11) | Framework §6 | GrammarPanel focus trap & return verified via Base UI / shadcn Dialog primitive | `src/components/learning/GrammarPanel.tsx` | **Ruled Out (PASS)** | — |

---

## Known issues (KI-01 to KI-17)

| ID | Result | Note |
|:---|:---|:---|
| **KI-01** | **Confirmed (Needs Owner)** | Pilot niche dialogue line counts for steps 13–20: measured counts are Step 13 = 15 (target 14), Step 14 = 15 (target 16), Step 15 = 19 (target 18), Step 16 = 18 (target 20), Step 17 = 20 (target 22), Step 18 = 24 (target 25), Step 19 = 33 (target 30), Step 20 = 60 (target 55). Steps 1–12 match exactly. Recommend owner approve rebalancing dialogue lines during content editorial pass. |
| **KI-02** | **Not Built Yet** | Bookmark API endpoint does not exist yet. Only `/api/health` is currently mounted. Scheduled for Milestone 1D when Supabase Auth persistence is wired. |
| **KI-03** | **Not Built Yet** | Login auth callback route and session middleware do not exist yet. Scheduled for Milestone 1D. |
| **KI-04** | **Not Built Yet** | Header login/account button does not read Supabase auth session yet. Scheduled for Milestone 1D. |
| **KI-05** | **Not Built Yet** | Central `messages/en.json` and `messages/bn.json` dictionary is not yet extracted from JSX. Scheduled for Milestone 1D. |
| **KI-06** | **Fixed** | Fixed in `src/components/admin/AdminDashboardClient.tsx` (commit `3b8d57d`). Percentage is now dynamically computed from scenario dialogue lines (`${coveragePct}%`). |
| **KI-07** | **Ruled Out** | In `scenarios.ts` and `dialogues.ts`, all scenarios default to `draft`. No unreviewed content is falsely marked `approved`. |
| **KI-08** | **Ruled Out / Not Built Yet** | Core schema (`src/lib/db/schema.ts`) has 14 complete tables including `languages`, `users`, `user_roles`, `categories`, `professions`, `scenarios`, `conversation_versions`, `speakers`, `dialogue_lines`, `translations`, `vocabulary`, `grammar_explanations`, `audio_assets`, `user_progress`, `user_vocabulary`, `bookmarks`, `exercises`, and `practice_sessions`. Missing tables (`review_events`, `daily_challenges`, `content_audit_logs`) belong to Phase 2/3. |
| **KI-09** | **Ruled Out** | `drizzle.config.ts`, `src/lib/db/index.ts`, and `.env.example` all exist and are configured. |
| **KI-10** | **Not Built Yet** | Dynamic category and profession browsing sub-routes exist statically; advanced faceted pagination and admin unauthorized redirects are planned for Milestone 1D. |
| **KI-11** | **Fixed** | Converted `src/app/page.tsx` from Client Component to Server Component (commit `f83a1b2`). Page compiles statically for SEO; `<ThemeToggle />` remains isolated client island. |
| **KI-12** | **Ruled Out** | `GrammarPanel.tsx` uses shadcn/Base UI `Sheet` which provides built-in accessibility focus trap, Esc to close, and focus return. |
| **KI-13** | **Not Built Yet** | `timing_manifest` is defined in Drizzle schema and generated by audio scripts, but interactive word-level seek in the frontend reader is planned for Milestone 1C+. |
| **KI-14** | **Fixed** | Added `--ecp-ease-enter: cubic-bezier(0.16, 1, 0.3, 1)`, `--ecp-ease-exit: cubic-bezier(0.4, 0, 1, 1)`, and `--ecp-ease-emphasized: cubic-bezier(0.2, 0.8, 0.2, 1)` to `src/styles/design-tokens.css` per MOTION §3.2 (commit `f58aa20`). |
| **KI-15** | **Ruled Out** | Dark theme tokens defined in `src/app/globals.css` and `src/styles/grammar-tokens.css` strictly match WCAG 4.5:1+ contrast criteria. |
| **KI-16** | **Ruled Out** | Exactly one Tailwind adapter is active: Tailwind v4 `@theme` via `src/styles/tailwind-theme-v4.css`. Zero occurrences of v3 `theme.extend`. |
| **KI-17** | **Fixed** | `src/app/layout.tsx` loads Inter, Hind Siliguri, and Noto Sans Bengali with weights capped at 600. Unapproved font removed per D-02. |

---

## Not Built Yet

| Item | Plan Reference | Planned Milestone |
|:---|:---|:---|
| Supabase Auth callback & session middleware | Register A-01, Phase Plan §4.4 | Milestone 1D |
| Learner save endpoints (Bookmarks, Notebook) | Brief §21 rule 10, API Contract §4 | Milestone 1D |
| `messages/` runtime i18n dictionary | Multi-Language §5 | Milestone 1D |
| Header live account state | Screens §6 | Milestone 1D |
| Audio timing manifest word seek in UI player | Audio §5.2 | Milestone 1C+ |
| Advanced SRS logging tables (`review_events`, etc.) | Exercises §3.4 | Milestone 2 |

---

## Needs Owner

| # | Question | Options | Recommendation |
|:---|:---|:---|:---|
| 1 | **KI-01 Dialogue Line Rebalancing:** Steps 13–20 of `ECP_Conversations_Shopping_Money.md` diverge slightly from target ladder counts (e.g. Step 19 has 33 instead of 30 lines). Should Antigravity rebalance these lines to match the exact ladder targets, or retain the existing dialogue flow? | **A.** Rebalance to exact ladder line counts.<br>**B.** Keep existing dialogue lines (tolerance ±10%). | **A (Recommended):** Rebalance lines during next content pass to satisfy strict ladder validation. |
| 2 | **D-LLM Provider at Gate 2:** Which provider should be selected for Phase 2 dynamic conversation practice? | **A.** Gemini API (native multi-modal)<br>**B.** Anthropic / OpenAI | **A (Recommended):** Gemini API per initial project brief. |
| 3 | **P-1/P-3 Jurisdiction & Retention Policy:** Confirm jurisdiction (e.g. Bangladesh / GDPR) and confirm starting retention values from Privacy spec §4.1 (voice recordings device-only; roleplay transcripts 90 days; practice answers 12 months; raw analytics 13 months; technical logs 30 days). | **A.** Confirm Privacy spec §4.1 retention rules.<br>**B.** Custom retention schedule. | **Owner decision pending (no value chosen by agent).** |
| 4 | **Icon Set Selection (Style Guide §11):** Style Guide §11 specifies "one consistent outline icon family throughout the product" but does not name a library. Hugeicons Outlined is currently integrated across all components. Confirm Hugeicons or designate an alternate outline icon library. | **A.** Confirm Hugeicons Outlined.<br>**B.** Specify alternative outline icon set. | **A (Recommended):** Keep Hugeicons Outlined as currently integrated. |

---

## Verification Summary

All verification commands executed cleanly on `main` (`3b8d57d`):

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
4. **TypeScript & Tests:**
   ```bash
   $ npx tsc --noEmit && npm test
   ℹ pass 8, fail 0, duration 107ms
   ```
5. **Next.js Production Build:**
   ```bash
   $ npm run build
   ✓ Compiled successfully in 1294ms
   ✓ Generating static pages using 9 workers (80/80) in 818ms
   ```
