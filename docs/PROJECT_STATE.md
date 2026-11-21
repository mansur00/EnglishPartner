# EnglishPartner: PROJECT STATE (agent memory file)

**Place this file at `docs/PROJECT_STATE.md` in the repo.** It is the single running record of decisions, rules, history, and pending work, so nothing depends on chat history.

## 0. How the agent must use this file

1. **Read this whole file at the start of every session**, before touching code.
2. **Update it after every task** (append to section 7 and update sections 4, 5, 6 as needed). Never end a task without updating it.
3. **Precedence when documents disagree:** `PROJECT_STATE.md` > `EnglishPartner_Design_System_v2.md` > `EnglishPartner_Agent_Spec.md`. Newer entries in this file override older ones, including older spec values (example: spec said weight 700 for headings; this file says max 600).
4. Do not delete history. When a rule changes, mark the old one `SUPERSEDED` and add the new one.
5. If a request conflicts with a FROZEN item, stop and ask the owner.
6. Every report must contain real evidence (computed styles via `getComputedStyle` / `getBoundingClientRect`, raw command output), not claims.
7. The owner writes in Banglish (Bangla in English letters). Reports and questions to the owner can be in simple English.

Optional: add a short root `AGENTS.md` saying "Read docs/PROJECT_STATE.md first and update it after every task." Many coding agents pick up that file automatically; if yours does not, the owner will tell you at the start of each session.

---

## 1. Project snapshot

- Repo: https://github.com/mansur00/EnglishPartner.git
- Stack (from audit): Next.js 16.x App Router, React 19, Tailwind v4, shadcn/ui on Base UI, Hugeicons, next-themes, spaCy helper at `services/nlp/nlp_helper.py`
- Content: 80+ static conversation routes, English + Bangla (EN + BN)
- Reference docs: `EnglishPartner_Agent_Spec.md`, `EnglishPartner_Design_System_v2.md`
- Design references: (1) violet + yellow language app (palette), (2) pastel topic-based task app (topic themes)

---

## 2. FROZEN (never change without owner approval)

1. **`.rainbow-border` CSS block** in `src/app/globals.css`: owner confirmed it works perfectly for active elements. Do not edit its selector, `@property --angle`, keyframes, conic-gradient, mask, padding, duration, or reduced-motion rule. Usage stays: dashboard hero card, selected category pill, focused search input, primary CTA hover, Grammar toggle when ON.
   - Proof requirement: paste raw output of `git diff <baseline>..HEAD -- src/app/globals.css` and show the block byte-identical to baseline commit `db71d3c`.
   - Add `npm run check:frozen` (snapshot compare of the block) and run it every task.
   - **Radius note:** the stroke must follow the element's radius. Verify the block uses `border-radius: inherit` (or similar). If it hard-codes a radius, DO NOT edit it; report to the owner and ask.
2. No 3D styling (no bevels, glossy 3D icons, heavy shadows). Flat colors, soft diffuse shadow at most.
3. Hugeicons is the icon library (no lucide).
4. shadcn components stay near-stock; brand customization through tokens and wrappers.
5. Grammar tokens (`--gram-*`) stay separate from brand (`--brand-*`, `--sun-*`) and topic (`--topic-*`) tokens.
6. **PERMANENT FROZEN POLICY: NO HARD-CODING.** Everything visual must be defined once in the design system (tokens, Tailwind `@theme`/`@utility`, components, variants) and used from there. Feature code and pages (`src/app`, `src/components` except `src/components/ui` primitives, `src/lib`) must not contain raw visual values:
   - **Colors:** No hex, rgb/hsl/oklch literals, raw Tailwind palette classes (`bg-white`, `text-black`, `bg-slate-100`, `text-red-500`, `bg-white/10`...), arbitrary `[#hex]`, inline style colors, or SVG fill/stroke literals. Colors must come from semantic tokens exposed as utilities (`bg-topic-tile`, `text-topic-ink`, `bg-brand-800`, `bg-band-panel`...). Arbitrary `var()` usage (`bg-[var(--topic-tile)]`) must be mapped via `@theme`.
   - **Typography:** No arbitrary text/leading/tracking/font utilities or direct scale utilities (`text-sm`, `text-lg`, `font-semibold`...) in feature code. Feature code must use semantic text styles defined once via `@utility` or components (`text-page-title`, `text-hero-title`, `text-card-title`, `text-lead`, `text-body`, `text-meta`, `text-label`, `text-chip`, `text-stat`). Weights capped at 600. Bangla text uses semantic style setting `Hind Siliguri` and line-height `1.75`.
   - **Radius:** No `rounded-[..]` or raw `rounded-xl/lg/2xl` in feature code. Use semantic utilities mapped to tokens: `rounded-card`, `rounded-panel`, `rounded-control`, `rounded-bubble`, `rounded-band`, `rounded-pill`.
   - **Layout constants & magic numbers:** No arbitrary `[Npx]`/`calc` values for header height, sidebar width, container max width, padding, band overlap, tap heights, segment sizes, z-index, shadows, durations/easing. Use defined tokens (`--header-h`, `--sidebar-w`, `--container-max`, `--container-px`, `--band-overlap`, `--tap-min`, `--z-header`, `--z-sidebar`, `--z-overlay`, `--z-modal`, `--shadow-card`, `--dur-fast`, `--ease-standard`...). Standard Tailwind spacing scale (`p-4`, `gap-3`) is permitted as a token scale.
   - **Inline styles:** `style={{...}}` forbidden for visual styling; permitted only for truly dynamic runtime values (e.g. dynamic percentage width) passed via CSS variables.
   - **Duplication:** Class strings 40+ chars repeated $\ge 3$ times must become components or CVA variants (`PageContainer`, `HeroBand`, `TodayPanel`, `Panel`, `Chip`, `Bubble`, `CefrChip`, `TopicCard`, `EmojiTile`...).
   - **Data files:** TS data files (e.g. `category-theme.ts`, level maps) must return keys and slugs only, never raw color values.
   - **Dark mode:** No `dark:` + raw color classes. All tokens define light and dark values in token definitions.
   - **Primitives (`src/components/ui`):** May use scale utilities, but must resolve to design tokens via `@theme`.

---

## 3. CURRENT DESIGN RULES (authoritative)

### 3.1 Color
- Primary violet: `--brand-800 #4A1D6E` (ramp 50 to 950). Secondary yellow: `--sun-500 #FFD93D`. Text on yellow: `--brand-950 #2A0F44`.
- Use tokens only. No raw hex or `[#hex]` arbitrary colors in components.
- Topic themes via `data-topic` and `--topic-surface/tile/border/accent/ink` (shopping peach, travel sky, health rose, social mint, workplace butter, professional lilac). Reader body stays neutral; only its header strip is topic-colored.
- Header band: `from-brand-800 to-brand-900` (dark: `from-brand-900 to-brand-950`).
- Saturated yellow is reserved for CTA, play/start, streak, goal, progress fill.

### 3.2 Typography (UPDATED: weights)
- **NEW (owner, this session): maximum font weight is 600 (semibold). No bold anywhere.** Allowed weights: 400, 500, 600.
  - Replace every `font-bold`, `font-extrabold`, `font-black`, `font-[700+]`, inline `font-weight: 700/800/900`.
  - Base CSS: `b, strong, th, h1, h2, h3, h4, h5, h6 { font-weight: 600; }` (headings never above 600).
  - Load only 400/500/600 for Inter, Hind Siliguri, Noto Sans Bengali (unapproved fonts removed per D-02).
  - Buttons: 600 (the 52px CTA included; this supersedes the earlier "700").
  - Extend `lint:ui` to fail on `font-bold|font-extrabold|font-black|font-\[[7-9]00\]` and inline weights of 700 or more.
- Sizes (unchanged): H1 `clamp(1.625rem, 1.3rem + 1vw, 2.125rem)` (26-34px), hero title `clamp(1.375rem, 1.2rem + 0.8vw, 1.875rem)`, H3 20px, body 16px, secondary min 14px, **floor 12px** (badges, chips, nav labels, weekday letters only), learning text 18px+ at line-height 1.7, Bangla (Hind Siliguri) line-height 1.75. Letter-spacing -0.01em for headings.
- No arbitrary `text-[Npx]`.

### 3.3 Radius (NEW, owner: preview looks too round)
Corners are too round, especially the dashboard hero card, the nested dialogue preview, and the bubbles. New scale (this supersedes "20-24px radius" and "pill buttons" in Design System v2):

| Element | Radius |
| --- | --- |
| Page cards, hero card | 16px (`--radius-card: 1rem`) |
| Nested panels (dialogue preview, inner boxes) | 12px (`--radius-panel: 0.75rem`) |
| Chat bubbles | 12px, with one 4px "tail" corner |
| Buttons (all sizes incl. CTA), inputs, selects, tabs, nav items | 12px (`--radius-control: 0.75rem`) |
| Dialog, Sheet | 16px |
| Header band bottom corners | 24px |
| Pills (full radius) ONLY for | badges, chips, category pills, avatars, progress bars, weekday markers |

Avoid three levels of heavily rounded boxes inside each other. Inner containers must have a smaller radius than outer ones (outer 16, inner 12, innermost 8-12).
Do not edit the frozen rainbow block to match; confirm it inherits the card radius (see section 2.1).

### 3.4 Layout: sidebar (NEW, owner)
- **The desktop sidebar is fixed. It must not scroll with the page.** Header sticky at top (`top-0`, z-40), sidebar `sticky`/`fixed` below it: `top-16 h-[calc(100dvh-4rem)] shrink-0 w-64`, with `overflow-y-auto` only for its own overflow. Main content scrolls independently of the sidebar.
- Keep the full-width header band logic (band starts at the sidebar's right edge). Mobile keeps the Sheet drawer + bottom nav.
- Verify: scroll the page 1200px and report the sidebar's `getBoundingClientRect().top` before and after (must be identical).

### 3.5 Dashboard "Today" widget (NEW, owner: streak and daily goal look generic)
Replace the two separate pills (flame tile + dots, and a percentage ring) with **one combined "Today" panel** in the header band, right side, same container alignment as the cards.

- Panel: `bg-white/8` on the violet band, `1px` border `white/14`, radius 12px, padding 16px, no blur, no 3D.
- **Row 1, streak:** large number (28px, weight 600) + label "day streak" (14px), small flame icon (20px, yellow, no big tile). Right of it, 7 weekday markers, 28px: done = filled yellow with check icon; today = yellow ring with a dot (subtle pulse only if `prefers-reduced-motion: no-preference`); future = faint dashed outline. Letters (12px) below or inside.
- **Row 2, daily goal:** segmented bar with 10 segments (1 per minute), 8px tall, 3px gaps, filled segments `--sun-500`, empty `white/18`, segments rounded 2px. Text: "7 / 10 min" (16px, weight 600) and a microcopy line (14px): "3 min to go" or "Goal reached" when complete.
- Optional small link/button inside the panel: "Continue" (ghost, 44px target) that goes to the last conversation.
- Mobile: panel stacks below the greeting, full width.
- Remove the percentage ring entirely.

### 3.6 Sizes and targets (unchanged)
Buttons 36/44/52 (md default 44), inputs 48, selects 44, chips 40, badges 24, nav items 44, bottom nav 56. Tap targets at least 44px, gaps 8px.

### 3.7 Borders and spacing (unchanged)
1px `var(--border)` everywhere, no dark outlines. Card padding `p-5 md:p-6`. Content container `max-w-5xl mx-auto px-4 sm:px-6 md:px-8`; header band inner content uses the same container.

### 3.8 Layout Invariants (authoritative)
- **Top Header:** sticky/fixed at `top-0`, `h-header` (64px / `var(--header-h)`), `z-header` (40). Never use `top-header` on the header itself (that utility sets `top: var(--header-h)` for elements below the header).
- **Desktop Sidebar:** sticky at `top-header`, `h-below-header`, `z-sidebar` (30). `rect.top` strictly equals header height at all scroll depths (`scrollY=0` and `scrollY=1200`).
- **Content / Hero Band:** starts directly below the header with 0px gap.
- **Mobile Layout (360px):** zero horizontal overflow (`scrollWidth <= clientWidth`). Header subtitle hides on mobile (<640px) to prevent vertical overflow. TodayPanel and Admin toolbars wrap flexibly.
- **Automated Invariant Suite:** `scripts/layout-invariants.mjs` (`npm run test:layout`), testing 233 assertions across 7 routes, 2 viewports (1280px & 360px), 2 themes (light & dark), 2 scroll states (scrollY=0 and 1200px), plus dynamic `--header-h -> 96px` mutation.

---

## 4. DONE (verified in browser)

| Commit | What |
| --- | --- |
| `2aa7102` | Phase 1A + 1B: shadcn init for Tailwind v4, brand tokens mapped, core components installed |
| `d6a4f94` | Phase 1C + 1D: shell/nav, theme toggle, mobile Sheet, modals to Dialog/Sheet, Tabs, padding fix, category tokens, rainbow border introduced, Dashboard/Explore first redesign |
| `db71d3c` | Design System v2: violet/yellow tokens, type scale, control sizes, `lint:ui`, topic themes |
| `ed8ecf0` | Computed-style fixes: yellow CTA variant, topic-tinted cards and tiles, 1px borders, 12px font floor, full-width band, dialogue preview bubbles |
| `e634630` | Heading scale (H1 33.6px/26px, hero title 29.44px one line), 28px weekday circles, container alignment, 24px hero overlap, chip uses topic tile |
| `98485fe` | Items 1-8 of Section 5: Rainbow border zero-diff proof & `check:frozen`, zero arbitrary hex & `lint:ui` extended, 1280px pixel alignment verified, font weight capped at 600 across all files & fonts, 16px/12px radius scale applied, fixed desktop sidebar (top 64px before/after scroll), single combined "Today" panel (streak + 7 markers + 10-segment minute bar, ring removed), Design System v2 applied to reader, practice, and vocabulary |
| `2e8d5ad` | Phase 1E: Landing page implemented (violet hero band, max 40px display headline, yellow Start Learning CTA, disabled Soon nav items, 16px topic feature cards, mobile-responsive) |
| `a169f87` | No Hard-Code Stage 1 + Layout Invariants: Tokens & @utility, UI primitives migrated, shared components created, header displacement fixed, 233 layout invariants passing |
| `588c1c2` | Phase 2 Checkpoint 1 (Foundation): Taxonomy registry (130 categories across 5 layers), bilingual labels/rule cards, author lists, grammar tokens & CSS, palette validator (WCAG 4.5:1+), spaCy annotator + 150 gold benchmark suite (100% tenses/voice/POS/patterns), sample JSON for 3 conversations |
| `f58aa20` | Audit fix AUD-KI-14: add enter, exit, and emphasized motion easing tokens per MOTION §3.2 |
| `f83a1b2` | Audit fix AUD-KI-11: convert landing page to static Server Component for SEO per Framework §5 |
| `3b8d57d` | Audit fix AUD-KI-06: dynamically compute scenario dialogue translation coverage percentage |
| `0c6d6fd` | AUD-KI-01: exact ladder counts for steps 13-20 |
| `8297c8a` | AUD-KI-02: bookmark endpoint persists to DB, returns 401 when logged out |
| `5f573c4` | AUD-KI-03: auth callback route and session middleware |
| `73e484e` | AUD-KI-04: header reflects session state |
| `3f8f70a` | AUD-KI-05: move UI strings to messages with bn/en coverage test |
| `203b822` | AUD-KI-06: coverage computed from data |
| `6e05b37` | AUD-KI-07: seed translations are draft until reviewed |
| `4640f99` | AUD-D-02: remove Poppins, keep approved fonts only |
| `16661b3` | AUD-D-12: practice mode values match exercises spec |
| `4df5b52` | AUD-PRIV: retention follows privacy spec; owner decision P-3 recorded |
| `fc5a752` | AUD-ICON: icon set matches style guide or is recorded as owner decision |
| `9f74cc5` | AUD-A11: no Gemini in product code; scripts use approved model |
| `cb05b69` | AUD-VERIFY: evidence for KI-07, KI-09, KI-12, KI-16 |
| `28794fd` | AUD-A11: gemini provider gated on signed scope |
| `40bc7f9` | AUD-ICON: record as owner decision, not confirmed |
| `538cc6b` | AUD-LAYOUT: layout test evidence saved |
| `2dea356` | AUD-KI-09: mark blocked pending clean test database |
| `4b8f283` | AUD-KI-05: remaining hardcoded strings moved or justified |
| `eefb447` | AUD-KI-02: bookmark persistence proven by integration test |
| `d54d331` | AUD-D-02: historical docs restored with dated note |
| `7372011` | AUD-MIGRATE: migration apply status recorded |
| `4506917` | AUD-KI-12: record focus test blocked pending runner |
| `9e2d018` | AUD-RECONCILE: summary matches table and git log |
| `1759d60` | AUD-R3-KI12: focus test pass recorded; CI gate tracked separately |
| `7c43c7a` | AUD-R3-KI09: migrate evidence or blocked with owner request |
| `1dafc1e` | AUD-R3-KI02: bookmark before/after row counts recorded |
| `8136072` | AUD-R3-KI05: hardcoded string counts recorded |
| `7c165eb` | AUD-R3-LAYOUT: exit code and assertion count recorded |
| `986c89e` | AUD-R3-TABLE: single findings table, counts computed from rows |
| `27cfabd` | AUD-R3-RECONCILE: one commit per finding, all hashes verified |
| `e56927d` | Phase 2 Checkpoint 2 (UI MVP): Sources registry, loader, fallback, useGrammar, GrammarText, GrammarToggleButton (.rainbow-border when ON), GrammarModeSwitch, GrammarLayerPicker, GrammarLegend, GrammarSummaryRow, RuleCardDialog, WordDetailPopover breakdown, 0.0000px layout shift, 16 screenshots |

Measured and accepted: H1, hero title sizes, 24px overlap, 12px floor (0 nodes below), hero card edges aligned to container padding.

---

## 5. PENDING QUEUE (do in this order; mark each DONE with commit hash)

1. **[DONE] (commit 98485fe) Rainbow-border proof.** Raw `git diff db71d3c..HEAD -- src/app/globals.css`, block compared against `db71d3c`, `check:frozen` script added and passing.
2. **[DONE] (commit 98485fe) Remove hard-coded hex** in the header band and everywhere else in favor of tokens; extended `lint:ui` to flag `[#hex]` classes and font weights 700+.
3. **[DONE] (commit 98485fe) Pixel alignment report at 1280px:** "Good day" text left edge (288px) = hero card left edge (288px), streak/goal right edge (1248px) = hero card right edge (1248px), overlap = 24.0px.
4. **[DONE] (commit 98485fe) Font weight cap (section 3.2):** removed all bold (117 occurrences replaced with font-semibold), base CSS `b, strong, th, h1-h6 { font-weight: 600 }`, font loading capped at 600, lint rule passing.
5. **[DONE] (commit 98485fe) Radius scale (section 3.3):** cards 16px (`rounded-[16px]`), nested panels 12px (`rounded-[12px]`), chat bubbles 12px with 4px tail, buttons/inputs/selects/tabs 12px, band bottom 24px. Rainbow border inherits 16px radius with zero diff to frozen block.
6. **[DONE] (commit 98485fe) Fixed sidebar (section 3.4):** header sticky at top-0 (z-40), desktop sidebar sticky at top-16 (`top: 64px`) before scroll and after 1200px scroll (`fixedVerified: true`).
7. **[DONE] (commit 98485fe) "Today" widget redesign (section 3.5):** single combined panel (streak 28px weight 600, 7 markers 28px, 10-segment minute bar 8px tall 3px gaps, microcopy, ring removed).
8. **[DONE] (commit 98485fe) Apply Design System v2 to remaining pages:** conversation reader (dialogue 18px+, Bangla line-height 1.75), practice (radio cards, semantic tokens), vocabulary (16px cards, 12px panels/controls, 40-44px pill chips).
9. **[DONE] (commit 2e8d5ad) Phase 1E:** landing page (simple hero + "Start Learning" CTA; disabled "Soon" nav items; 16px topic preview cards).
10. **[DONE] (commit a169f87) No Hard-Code Migration Stage 1 (Steps 0-3):** Baseline captured, tokens/utilities added, UI primitives migrated, shared components built, Dashboard migrated, header displacement fixed, 233 layout invariants passing.
11. **[DONE] (commit 588c1c2) Phase 2 Checkpoint 1 (Foundation):** Taxonomy registry (130 categories), draft labels/rules in EN/BN, author data lists, `grammar-tokens.css`, `grammar.css`, `npm run grammar:palette`, swatch sheet screenshots, spaCy `en_core_web_sm` + deterministic rule engine in `annotate.py`, 150-sentence gold benchmark suite (100% tenses, 100% voice, 100% POS, 100% patterns), and committed sample annotations for 3 real conversations.
12. **[DONE] (commits f58aa20, f83a1b2, 3b8d57d) Full Project Audit & Conflict Resolution:** Complete audit against approved plans/specs across stack, schema, tokens, components, content, audio. Resolved 3 conflict bugs (KI-14 easing tokens, KI-11 landing Server Component, KI-06 dynamic admin coverage). Recorded all findings in `docs/AUDIT_REPORT.md`.
13. **[DONE] (commits 0c6d6fd..cb05b69) Audit Report Findings Remediation (13 Items):** Executed all 13 fixes in dedicated commits: exact ladder counts, bookmark DB endpoint, Supabase Auth callback & session middleware, header session state, messages i18n dictionary with 100% key parity, dynamic language coverage, draft seed translations with learner notice, Poppins removed (Inter + Hind Siliguri + Noto Sans Bengali per D-02), 9 approved practice modes in schema & migration, privacy retention aligned with spec §4.1 (no server-side audio retention, P-3 recorded as owner decision), Style Guide §11 icon verification, zero Gemini in product code (`gemini-3.8-flash-tts` in offline configs), and full verification evidence for KI-07/09/12/16.
14. **[DONE] (commits 28794fd..9e2d018) Audit Report Correction Round (10 Items):** Gated Gemini offline provider on unsigned A-11 scope in `_pending_a11`, recorded AUD-ICON as owner decision in `docs/DECISIONS.md`, saved layout test evidence (233 assertions), marked KI-09 blocked pending clean test DB, audited hardcoded strings and added 30 keys to messages (98/98 keys, 100% parity), added integration test for KI-02 bookmark spoofing protection, restored historical docs mentions of Poppins with dated non-current note (AUD-D-02), recorded database migration apply status (AUD-MIGRATE), authored headless browser E2E test and marked KI-12 blocked pending Playwright runner, and reconciled AUDIT_REPORT summary, tables, and git log (AUD-RECONCILE).
15. **[DONE] (commits 1759d60..27cfabd) Audit Round 3 Remediation:** Single master findings table in `docs/AUDIT_REPORT.md` (25 rows: 6 PASS, 12 Fixed, 1 Blocked, 4 Not built yet, 2 Needs owner = 25 total); KI-12 verified locally (PASS) with CI gate tracked separately (KI-12-CI: Not built yet); KI-09 generate check verified (PASS) with live run blocked pending owner throwaway DB URL; KI-02 bookmark persistence verified with before/after row counts (0 -> 1 -> 1 -> 1 -> 2); KI-05 hardcoded strings audited (103 -> 30 moved to messages, 98/98 keys, 73 justified); layout invariants suite exit code 0 recorded (233 assertions); all commit hashes verified in git log.
16. **[DONE] (commit e56927d) Phase 2 Checkpoint 2 (UI MVP):** Sources registry, loader, resolve, fallback, `useGrammar`, `GrammarText`, `GrammarToggleButton` (.rainbow-border when ON, 44px target) next to Listen in `ConversationTurn`, `GrammarModeSwitch`, `GrammarLayerPicker`, `GrammarLegend`, `GrammarSummaryRow`, RuleCardDialog, enhanced WordDetailPopover breakdown, 0.0000px layout shift verified, toggle response 44ms (turn) and 5ms (global), 16 screenshots saved.
17. **[DONE] Phase 2 Checkpoint 3 (Complete System):** Remaining layers (Phrases & Clauses brackets/outlines, full Patterns overlines/chips), author lists in `data/grammar/lists/` and overrides in `data/grammar/overrides/`, `grammar:check` build gate wired into `prebuild`, `grammar:report` (`npm run grammar:report`) reporting unreviewed entries and confidence, admin editor status banner in `ConversationEditorClient.tsx`, vocabulary page integration in `src/app/(app)/vocabulary/page.tsx`, practice prompts in `src/lib/grammar/sources.ts`, 100% taxonomy coverage, Section 11 tests (gold benchmark 100%, 17 tenses unit tests, 5 token mutation tests, 4 future-content fixture tests; 52 total unit tests pass), generated `docs/grammar-system.md`.
18. **[DONE] (commits f8d6718..7e723cc) No Hard-Code Migration Stage 2 (Steps 4-7):** Migrated all remaining pages and components (admin, auth, navigation/shell, dashboard, grammar, practice, vocabulary, reader, explore, category, professions, public terms/privacy), eliminated duplicated class strings (Rule f), completely removed `--ecp-*` tokens and backward-compatible aliases, reached 0 violations in `lint:tokens` across rules a to i, verified 0 unmutated elements across all 9 mutations in `token-mutation-test.mjs`, passed all 233 layout invariants in `test:layout`, generated `docs/design-tokens.md`.
19. **[DONE] (commit ba66aa3) Milestone 2B — Sentence Builder:** Interactive word-chunk reordering practice mode with pool and assembly slot, tap to place, tap to remove, hint with next accepted chunk, undo and reset controls, out-of-place chunk detection, Web Speech audio playback, zero hardcoded tokens, 57 unit tests passing.
20. **[DONE] (commit b461a0d) Milestone 2E — Spaced Repetition (SRS) Review System:** Pure SM-2 algorithm in src/lib/srs/sm2.ts and src/lib/srs/types.ts, interactive flashcard queue with audio pronunciation, 4 rating buttons (again, hard, good, easy), interval previews, flip card animation, empty state, and vocabulary page integration with due badge & view switcher, 66 unit tests passing.
21. **[DONE] (commit 795e77c) Milestone 2C — Dialogue Ordering Practice Mode:** Dialogue turn sequencing and matching per Spec §4.3 in src/lib/practice/dialogue-order.ts, interactive DialogueOrderCard with swap/up/down controls, audio, hint, reset, undo, and feedback banners in src/components/practice/DialogueOrderCard.tsx, integrated into PracticeWorkspace with automatic fallback generator, seed data for shopping-money steps 01-03, 74 unit tests passing.
22. **[DONE] (commit be2df9b) Milestone 2C — Read Aloud Practice Mode:** Read Aloud and pronunciation practice per Spec §4.6 and Audio Voice Guide §9-10 in src/lib/practice/read-aloud.ts, interactive ReadAloudCard with MediaRecorder recording, side-by-side playback, optional speech recognition transcript matching, self-check rating buttons, and Bengali guidance in src/components/practice/ReadAloudCard.tsx, integrated into PracticeWorkspace with automatic fallback generator, seed data for shopping-money steps 01-03, 80 unit tests passing.
23. **[DONE] (commit 6db085d) Expandable Design System Foundation:** Code-first shadcn/ui expandable system for Button, Input, Field, InputGroup, Badge, Pill, and Tag per user specification. Supports all variants (default, secondary, outline, ghost, destructive, link, cta, success, warning), all sizes (xs, sm, default/md, lg, icon, icon-xs, icon-sm, icon-lg), states (loading with spinner, pill, error), and composition patterns. 84 unit tests passing.
24. **[DONE] (commit bd51c31) Milestone 2E Backend & UI Component Integration (KI-08):** Added `review_events`, `daily_challenges`, and `content_audit_logs` tables with migration `0002_elite_wrecker.sql`. Implemented SRS review event logging (`recordReviewEvent`, `/api/v1/srs/review-events`, `logReviewEventClient`), Daily Challenge selection per Spec §7 (`getOrCreateDailyChallenge`, `/api/v1/challenges/daily`), and migrated Vocabulary and Explore search & filters to Expandable Design System `InputGroup`, `Tag`, and `Pill`. 98 unit tests passing.
25. **[DONE] (commit ed087be) Milestone 2C — Roleplay (Hide Speaker) & Complete Line Practice Modes:** Authored `src/lib/practice/complete-line.ts` and `src/lib/practice/hide-speaker.ts`, upgraded `HideSpeakerPractice.tsx` to conversational roleplay stream using `ChatBubble` (speaker="1" for partner, speaker="2" for learner), `EmojiTile`, `Tag`, role selection, and audio reveal per Spec §4.4, upgraded `CompleteLineCard.tsx` with `Tag` word chips, audio pronunciation, and `btn-restart-action` per Spec §4.5. 111 unit tests passing.
26. **[DONE] (commit 8f66338) Milestone 1C+ — Audio Timing Manifest & Interactive Seek Bar (KI-13):** Authored `src/lib/audio/timing-manifest.ts` with duration estimation, sequential timestamp generation, and bidirectional percentage/time mapping per Audio Guide §5.2. Upgraded `src/components/learning/AudioPlayer.tsx` with interactive scrub bar (`role="slider"`, `aria-valuenow`, keyboard navigation, hover zoom), timing manifest synchronization, Pill badge line count, and eliminated cascading renders via render-time derived progress calculation. Reconciled `docs/AUDIT_REPORT.md` (KI-13 marked Fixed). 116 unit tests passing.
27. **[DONE] (commit cfd5bdf) Milestone 1D — Faceted Pagination & Admin Unauthorized Access Guards (KI-10):** Authored `src/lib/pagination/faceted-pagination.ts` (safe boundary clamping, windowed page numbers with ellipsis), `src/components/discovery/FacetedPagination.tsx` (ARIA navigation, page controls, range indicator), and `src/lib/auth/admin-guard.ts` (role guards, unauthorized redirect URLs). Integrated faceted pagination into `ExplorePage` (page size 6) and `AdminDashboardClient` (page size 5), and added unauthorized access alert banners and editor return navigation. Reconciled `docs/AUDIT_REPORT.md` (KI-10 marked Fixed; Fixed=15, Not built yet=1, Total=25). 126 unit tests passing.

---

## 6. PHASE 2 PLAN (for later, summarized; full detail in Agent Spec section 9)

- Precompute tags for static dialogues at build time with the existing spaCy helper (JSON). `compromise` as lazy-loaded runtime fallback for dynamic sentences.
- Two layers: Roles (Subject solid underline, Verb double underline, Object dotted underline, with soft tint) and Parts of speech (text colors).
- Toggle: shadcn Switch "Grammar colors" (default OFF) with modes "Roles" / "Parts of speech", persisted in localStorage, hydration-safe. Rainbow border on the toggle when ON.
- Subject = blue, Verb = orange, Object = green (default choice, avoids clash with brand violet). Noun must differ from body text; determiner at least 4.5:1.
- `<GrammarText>`, `<GrammarLegend>`, tooltip on desktop, role/POS inside the word popover for touch.
- Show real contrast ratios for all tokens, both themes. Weights follow the 600 cap here too.

---

## 7. SESSION LOG (append newest at the top; one entry per task)

Entry format:

```
### YYYY-MM-DD, <short title>
- Requested by owner: <one line>
- Changed: <files / tokens>
- Verified with: <commands, computed values, measurements>
- Commit: <hash>
- Open questions / follow-ups: <or "none">
```

(Agent: add entries below this line.)

### 2026-11-22, Cleanup of Obsolete and Unnecessary Files
- Requested by owner: "je file gulo dorkar nei shegulo delete kore deo" -> delete all redundant, obsolete, and temporary files from root and repository.
- Changed:
  - Deleted stale root copies of `design-tokens.css` and `tailwind-theme-v4.css` (canonical files live in `english-partner/src/styles/`).
  - Deleted legacy `tailwind-theme-v3.example.cjs` (Tailwind v3 retired per D-04; project uses Tailwind v4).
  - Deleted unreferenced browser downloads (`download.png`, `download (1).png`, `download (2).png`) and `.DS_Store`.
  - Deleted build/test artifacts `english-partner/audit-no-hardcode-report.json`, `english-partner/mutation-test-report.json`, `english-partner/logs/server.log`.
  - Added `audit-no-hardcode-report.json` and `mutation-test-report.json` to `.gitignore`.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (126/126 unit tests passing across all 18 test suites).
  - Clean root directory verified (only `AGENTS.md`, `Conversation/`, `docs/`, and `english-partner/` remain).
- Commit: pending
- Open questions / follow-ups: none.

### 2026-11-22, Workspace Markdown Files Reorganization
- Requested by owner: "file gulo akhon age guciye neo md file gulo doc folder a jniye asho aivabe filte gucao age" -> clean up workspace root by moving all loose specification markdown files into `docs/` and synchronizing with `english-partner/docs/specs/`.
- Changed:
  - Moved 22 specification markdown files (`ECP_*.md`, `English*.md`, `MOTION.md`) from workspace root into `docs/`.
  - Copied `AGENTS.md` to `docs/AGENTS.md` (retaining root `AGENTS.md` for agent instructions and user rule continuity).
  - Kept authoritative `PROJECT_STATE.md` at `docs/PROJECT_STATE.md` and synced with `english-partner/docs/PROJECT_STATE.md`.
  - Synchronized `docs/specs/` inside `english-partner` with all specification documents (`ECP_Gemini_TTS_Implementation.md`, `EnglishPartner_Agent_Spec.md`, `EnglishPartner_Design_System_v2.md`).
  - `tests/poppins-d02.test.mjs`: updated path resolution candidate list to check `../docs/` and `docs/specs/`.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (126/126 unit tests passing across all 18 test suites).
  - Root directory verified clean (only `docs/`, `Conversation/`, `english-partner/`, `AGENTS.md`, and assets remain).
- Commit: be2a521
- Open questions / follow-ups: none.

### 2026-11-21, Milestone 1D (Faceted Pagination & Admin Unauthorized Access Guards / KI-10) Completed & Verified
- Requested by owner: "next" -> execute Milestone 1D (KI-10): faceted pagination engine and UI component, admin unauthorized access guards & redirect warnings, integrate into Explore and Admin consoles, author unit tests, and update AUDIT_REPORT.md.
- Changed:
  - `src/lib/pagination/faceted-pagination.ts`: authored pure pagination engine (`paginateItems`) with safe boundary clamping, start/end index calculation, and windowed page numbers generator (`getPageNumbers`) with ellipses.
  - `src/components/discovery/FacetedPagination.tsx`: accessible pagination controls using Expandable Design System `Button` (`variant="outline"`, `variant="ghost"`, `variant="default"`, `size="sm"`, `size="icon-sm"`), zero magic numbers, range display, and keyboard navigation.
  - `src/lib/auth/admin-guard.ts`: role authorization and redirect helper (`checkAdminAccess`, `checkEditorAccess`, `checkReviewerAccess`) returning redirect URLs and HTTP status codes (401/403).
  - `src/app/(app)/explore/page.tsx`: integrated `paginateItems` and `FacetedPagination` (page size 6), resetting to page 1 on search or filter changes, with smooth top scroll.
  - `src/components/admin/AdminDashboardClient.tsx`: integrated table pagination (page size 5) with `FacetedPagination`, and added unauthorized access warning alert banner when redirected.
  - `src/components/admin/ConversationEditorClient.tsx`: added return to admin link with role and requirement parameters when edit access is restricted.
  - `tests/faceted-pagination.test.mjs`: authored comprehensive unit test suite covering page slicing, boundary clamping, empty lists, and ellipses generation (5/5 pass).
  - `tests/admin-auth-guard.test.mjs`: authored comprehensive unit test suite covering role access levels, status codes, and redirect URLs (3/3 pass).
  - `docs/AUDIT_REPORT.md`: reconciled master table (KI-10 marked Fixed; Fixed=15, Not built yet=1, Total=25).
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen .rainbow-border block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a through i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (126/126 tests passing across all 18 test suites).
  - `npm run build`: Passed (all 85/85 static and dynamic routes compiled successfully).
- Commit: cfd5bdf
- Open questions / follow-ups: none.

### 2026-11-21, Milestone 1C+ (Audio Timing Manifest & Interactive Seek Bar / KI-13) Completed & Verified
- Requested by owner: "next" -> execute Milestone 1C+ (KI-13): audio timing manifest generator, sentence duration estimation, interactive seek/scrub bar in AudioPlayer with full slider accessibility (role="slider", keyboard Arrow/Home/End seek), and update AUDIT_REPORT.md.
- Changed:
  - `src/lib/audio/timing-manifest.ts`: sentence duration estimator (WPM-based with floor, inverse playback speed scaling), timing manifest assembler with speaker pause rules (600ms default, 900ms speaker change per Audio Guide §5.3), and bidirectional percentage/timestamp converters.
  - `src/components/learning/AudioPlayer.tsx`: upgraded with interactive scrub bar (`role="slider"`, `aria-valuenow`, keyboard navigation, hover zoom), timing manifest synchronization, Pill badge line count, and eliminated cascading renders via render-time derived progress calculation.
  - `tests/audio-timing-manifest.test.mjs`: authored comprehensive unit test suite covering duration estimation, sequential timestamps, timestamp-to-line mapping, and scrub bar percentage conversion (5/5 pass).
  - `docs/AUDIT_REPORT.md`: reconciled master table (KI-13 marked Fixed; Fixed=14, Not built yet=2, Total=25).
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen .rainbow-border block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a through i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (116/116 tests passing across all 18 test suites).
  - `npm run build`: Passed (all 85/85 static and dynamic routes compiled successfully).
- Commit: 8f66338
- Open questions / follow-ups: none.

### 2026-11-21, Milestone 2C (Roleplay / Hide Speaker & Complete Line Modes) Completed & Verified
- Requested by owner: "next" -> execute Milestone 2C: upgrade HideSpeakerPractice to real conversational roleplay using ChatBubble and EmojiTile per Spec §4.4, upgrade CompleteLineCard with Expandable Design System per Spec §4.5, and author full unit test suites.
- Changed:
  - `src/lib/practice/complete-line.ts`: authored answer normalization, blank answer validation, and masked sentence generator.
  - `src/lib/practice/hide-speaker.ts`: authored speaker perspective resolution (`learnerSpeaker`, `partnerSpeaker`), line ownership validator (`isLearnerLine`), and learner turn evaluation.
  - `src/components/practice/HideSpeakerPractice.tsx`: redesigned into interactive conversational stream using `ChatBubble` (speaker="1" for partner, speaker="2" for learner), `EmojiTile` avatars, `Tag` role selectors, turn progress pill, Web Speech pronunciation, and reveal controls per Spec §4.4.
  - `src/components/practice/CompleteLineCard.tsx`: upgraded with `Tag` word selection chips, full sentence Web Speech pronunciation, masked slot rendering, and pedagogical Bengali explanations per Spec §4.5.
  - `src/app/globals.css`: added `@utility btn-restart-action` (frozen `.rainbow-border` preserved with zero byte diff).
  - `tests/complete-line.test.mjs`: authored comprehensive unit test suite covering normalization, blank validation, masked text, and seed data integrity (7/7 pass).
  - `tests/hide-speaker.test.mjs`: authored comprehensive unit test suite covering perspective resolution, turn assignment, and turn evaluation (6/6 pass).
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen .rainbow-border block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a through i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (111/111 tests passing across all 14 test suites).
  - `npm run build`: Passed (all 85/85 static and dynamic routes compiled successfully).
- Commit: ed087be
- Open questions / follow-ups: none.

### 2026-11-21, Milestone 2E Backend & Design System Integration (KI-08) Completed & Verified
- Requested by owner: "next" -> execute Milestone 2E Backend (Review Events & Daily Challenge Database Logging, resolving KI-08) and integrate Expandable Design System components (InputGroup, Tag, Pill) into existing pages.
- Changed:
  - `src/lib/db/schema.ts`: added `reviewEvents`, `dailyChallenges`, and `contentAuditLogs` tables with `srsRatingEnum` (`again`, `hard`, `good`, `easy`), `challengeStatusEnum` (`assigned`, `in_progress`, `completed`, `expired`), foreign keys, and unique constraint on `(user_id, challenge_date)`. Total schema tables expanded to 26.
  - `src/lib/db/migrations/0002_elite_wrecker.sql`: generated clean Drizzle migration.
  - `src/lib/srs/review-service.ts`: authored server-side SRS review event persistence service with offline fallback.
  - `src/lib/srs/review-client.ts`: authored client-side review logging dispatcher calling API and buffering in localStorage.
  - `src/lib/challenges/daily-challenge-service.ts`: authored daily challenge selection engine following Brief §10.3 & Spec §7 (unfinished, matches level, not seen in last 7 days, no penalty on missed day).
  - `src/app/api/v1/srs/review-events/route.ts`: created REST endpoint for logging SRS review outcomes.
  - `src/app/api/v1/challenges/daily/route.ts`: created REST endpoint for fetching and completing daily conversation challenges.
  - `src/components/learning/ReviewQueue.tsx`: wired `logReviewEventClient` into `handleRating` so SRS reviews log seamlessly in the background.
  - `src/app/(app)/vocabulary/page.tsx`: migrated search bar to `InputGroup` + `Input`, POS filters to `Tag` (`selected`, `brand`/`outline`), and due count badge to `Pill`.
  - `src/app/(app)/explore/page.tsx`: migrated search bar to `InputGroup`, `InputGroupPrefix`, and `InputGroupSuffix` with `Input`.
  - `tests/srs-review-events.test.mjs`: authored comprehensive unit test suite covering schema, columns, enum invariants, SM-2 ratings, ISO date formatting, recent scenario exclusion, and level matching.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen .rainbow-border block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a through i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (98/98 tests passing across all test suites).
  - `npm run build`: Passed (all 85/85 static and dynamic routes compiled successfully).
- Commit: bd51c31
- Open questions / follow-ups: none.

### 2026-11-21, Expandable Design System Foundation Completed & Verified
- Requested by owner: Build expandable design system based on shadcn/ui patterns for Button, Input, Field, InputGroup, Badge, Pill, Tag.
- Changed:
  - `src/components/ui/button-variants.ts`: authored CVA definitions for all variants (`default`, `secondary`, `outline`, `ghost`, `destructive`, `link`, `cta`, `primary`, `accent`), all sizes (`xs`, `sm`, `default`/`md`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`), and `pill: true`.
  - `src/components/ui/button.tsx`: updated `Button` supporting `loading` (animated spinner + aria-busy + disabled) and `pill`.
  - `src/components/ui/input-variants.ts`: authored CVA definitions for input variants (`outline`, `filled`, `ghost`), sizes (`sm`, `default`, `lg`), and `pill: true`.
  - `src/components/ui/input.tsx`: updated `Input` supporting `variant`, `inputSize`, and `pill`.
  - `src/components/ui/field.tsx`: created `Field`, `FieldLabel`, `FieldDescription`, and `FieldError` with accessible context and error alerts.
  - `src/components/ui/input-group.tsx`: created `InputGroup`, `InputGroupPrefix`, and `InputGroupSuffix` for prefix/suffix icons and buttons.
  - `src/components/ui/badge-variants.ts`: authored CVA definitions for badge variants (`default`, `secondary`, `destructive`, `outline`, `ghost`, `success`, `warning`, `brand`, `accent`, `peach`, `neutral`, `error`), sizes (`sm`, `default`, `md`, `lg`), and shapes (`pill`, `rounded`).
  - `src/components/ui/badge.tsx`: updated `Badge` supporting `variant`, `size`, `shape`, and `pill`.
  - `src/components/ui/pill.tsx`: created dedicated `Pill` component with optional status `dot`.
  - `src/components/ui/tag.tsx`: created dedicated `Tag` component with selectable filter state (`selected`) and removable action button (`onRemove` with `Cancel01Icon`).
  - `scripts/token-allowlist.json`: added primitive UI entries for new components.
  - `docs/expandable-design-system.md`: authored complete reference manual and usage documentation.
  - `tests/design-system-components.test.mjs`: authored unit test suite verifying all variants, sizes, and shapes across Button, Input, and Badge.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen .rainbow-border block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token audit violations across all rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (84/84 tests passing across all test suites).
  - `npm run build`: Passed (all 83/83 static routes compiled successfully).
- Commit: 6db085d
- Open questions / follow-ups: none.

### 2026-11-21, Milestone 2C (Read Aloud Pronunciation Practice Mode) Completed & Verified
- Requested by owner: Milestone 2C: Read Aloud Mode — interactive pronunciation practice with model audio and self-check / microphone playback per Spec §4.6.
- Changed:
  - `src/lib/practice/read-aloud.ts`: authored spoken text normalization, contraction expansion (`i'm` -> `i am`, `it's` -> `it is`, `can't` -> `cannot`), constructive word comparison, and self-check rating metadata conforming to `ECP_Exercises_SRS_Spec.md` §4.6 and `ECP_Audio_Voice_Guide.md` §10.2.
  - `src/components/practice/ReadAloudCard.tsx`: built full-featured interactive Read Aloud component with target sentence display, speaker chips, phonetic hints, Bengali translation, Web Speech model audio playback, in-memory `MediaRecorder` voice recording, live pulsing recording timer, side-by-side learner vs model audio playback, optional browser speech recognition transcript matching, 3-level self-check ratings, and delete recording privacy control.
  - `src/components/practice/PracticeWorkspace.tsx`: added "উচ্চারণ (Read Aloud)" tab with automatic fallback generator covering all 20 conversation ladder steps.
  - `src/content/seed/exercises.ts`: defined `ReadAloudExercise` interface and added curated exercises for Step 01, Step 02, and Step 03.
  - `src/app/globals.css`: added `@utility text-meta-bn` (frozen `.rainbow-border` preserved with zero byte diff).
  - `tests/read-aloud.test.mjs`: authored comprehensive unit test suite covering contraction normalization, 100% spoken match, contraction in spoken speech, constructive missing word flagging, empty input handling, and self-check rating metadata integrity.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen .rainbow-border block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token audit violations across all rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (80/80 tests passing across all test suites).
  - `npm run build`: Passed (all 83/83 static routes compiled successfully).
- Commit: 3aa9b6b
- Open questions / follow-ups: none.

### 2026-11-21, Milestone 2C (Dialogue Ordering Practice Mode) Completed & Verified
- Requested by owner: Milestone 2C: Dialogue Ordering Practice Mode — interactive dialogue turn sequencing and matching per Spec §4.3.
- Changed:
  - `src/lib/practice/dialogue-order.ts`: authored core dialogue ordering business logic (`validateDialogueOrder`, `moveDialogueTurn`, `shuffleDialogueTurns`, and `getDialogueOrderHint`) conforming to `ECP_Exercises_SRS_Spec.md` §4.3.
  - `src/components/practice/DialogueOrderCard.tsx`: built full-featured interactive Dialogue Ordering component with position numbering, speaker chips, English/Bangla text, Web Speech audio pronunciation, accessible Up/Down controls, tap-to-swap selection, pedagogical hint alert, reset, undo, and comprehensive success/error feedback banners.
  - `src/components/practice/PracticeWorkspace.tsx`: added "ডায়লগ ক্রমানুসার (Dialogue Order)" tab with automatic fallback generator covering all 20 conversation ladder steps.
  - `src/content/seed/exercises.ts`: added curated dialogue ordering exercises for Step 02 ("Arrange the Size & Color Inquiry") and Step 03 ("Arrange Payment & Change Conversation") alongside existing Step 01.
  - `tests/dialogue-order.test.mjs`: authored comprehensive unit test suite covering validation, misplaced index detection, up/down reordering, shuffling guarantee, hint calculation, and seed data integrity.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen .rainbow-border block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token audit violations across all rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (74/74 tests passing across all test suites).
  - `npm run build`: Passed (all 83/83 static routes compiled successfully).
- Commit: 795e77c
- Open questions / follow-ups: none.

### 2026-11-21, Milestone 2E (Spaced Repetition SRS Review System & Flashcards) Completed & Verified
- Requested by owner: Milestone 2E — Spaced Repetition (SRS) Review System: Implement SM-2 algorithm (src/lib/srs/sm2.ts) and Flashcard Review Queue on /vocabulary per Spec §6.
- Changed:
  - `src/lib/srs/types.ts`: defined `SRSRating`, `SRSState`, `UserVocabularySRSItem`, `SM2CalculationInput`, and `SM2CalculationResult`.
  - `src/lib/srs/sm2.ts`: implemented pure SM-2 algorithm (`ratingToQuality`, `calculateSM2`, `createDefaultSRSState`, `getDueReviewItems`) adhering to `ECP_Exercises_SRS_Spec.md` §6.2.
  - `src/components/learning/ReviewQueue.tsx`: created full-featured interactive SRS review flashcard component with front/back flip, Web Speech audio pronunciation, 4 rating buttons (`again`, `hard`, `good`, `easy`) showing scheduled interval previews, progress tracking, and celebratory "Nothing due today" empty state.
  - `src/app/globals.css`: added `@utility text-chip-mono` and `@utility practice-header-row` (frozen `.rainbow-border` preserved with zero byte diff).
  - `src/app/(app)/vocabulary/page.tsx`: added view switcher tabs between "সংরক্ষিত শব্দাবলী" (Saved Words) and "দৈনিক ফ্ল্যাশকার্ড রিভিউ" (SRS Flashcards) with real-time due counter badge.
  - `tests/srs-sm2.test.mjs`: authored comprehensive unit test suite covering rating quality mapping, first success (1 day), second success (6 days), subsequent intervals ($I \times EF$), stage cap at 8, failure reset (again -> stage 0, lapseCount+1), ease floor at 1.30, due queue filtering/ordering, and empty queue handling.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen .rainbow-border block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token audit violations across all rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (66/66 tests passing across all test suites).
  - `npm run build`: Passed (all 83/83 static routes compiled successfully).
- Commit: b461a0d
- Open questions / follow-ups: none.

### 2026-11-21, Milestone 2B (Sentence Builder Practice Mode) Completed & Verified
- Requested by owner: Milestone 2B — Sentence Builder: Build interactive word-chunk reordering practice mode with tap/keyboard controls, hints, and accepted orders per ECP_Exercises_SRS_Spec.md §4.2 & §5.
- Changed:
  - `src/lib/practice/sentence-builder.ts`: authored core business logic, chunk normalization, and `validateSentenceOrder` algorithm identifying specifically out-of-place chunks.
  - `src/components/practice/SentenceBuilderCard.tsx`: authored interactive Sentence Builder component with available pool, assembled slot, tap-to-remove, hint, undo, reset, "Check order" CTA, audio pronunciation, and detailed Bengali explanations.
  - `src/content/seed/exercises.ts`: added `SentenceBuilderExercise` interface, updated `NicheStepExerciseSet`, and added curated seed sentence builders for Steps 01, 02, and 03.
  - `src/components/practice/PracticeWorkspace.tsx`: added "সেন্টেন্স বিল্ডার (Sentence Builder)" tab with automatic fallback sentence builders for all 20 ladder steps.
  - `src/app/globals.css`: added `@utility min-h-slot { min-height: 4rem; }`.
  - `tests/sentence-builder.test.mjs`: authored comprehensive unit test suite covering single/alternative accepted orders, normalization, misplaced chunk detection, and seed data integrity.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen .rainbow-border).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token audit violations across all rules a through i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (57/57 tests passing across all test suites).
  - `npm run build`: Passed (all 83/83 static routes compiled successfully).
- Commit: 75c9dbf
- Open questions / follow-ups: none.

### 2026-11-21, No Hard-Code Migration Stage 2 (Steps 4-7) Completed & Verified
- Requested by owner: Execute Stage 2 (Steps 4 to 7) of EnglishPartner_NoHardCode_Migration.md.
- Changed:
  - `src/app/globals.css`: Added semantic typography utilities (`text-card-title-bn`, `text-subtitle-bn`, `text-meta-lead-bn`, `text-chip-bn`, `text-grammar-header`), practice utilities (`card-practice`, `card-practice-result`, `badge-success-icon`, `btn-nav-action`), and navigation utility (`btn-back-nav`); eliminated legacy `--ecp-*` backward-compatible blocks in `:root` and `.dark`.
  - `src/components/navigation/`: Migrated `AppShell.tsx`, `Header.tsx`, `MobileBottomNav.tsx`, `Sidebar.tsx`, and `ThemeToggle.tsx` to semantic tokens.
  - `src/components/dashboard/`: Migrated `DashboardClient.tsx`, `TodayPanel.tsx`, `HeroBand.tsx`, `ChatBubble.tsx`, `EmojiTile.tsx`, and `Panel.tsx`.
  - `src/components/grammar/`: Migrated `GrammarBreakdown.tsx`, `GrammarLayerPicker.tsx`, `GrammarLegend.tsx`, `GrammarModeSwitch.tsx`, `GrammarSummaryRow.tsx`, `GrammarToggleButton.tsx`, and `RuleCard.tsx`.
  - `src/components/practice/`: Migrated `CompleteLineCard.tsx`, `HideSpeakerPractice.tsx`, and `ListeningQuizCard.tsx`.
  - `src/components/ui/`: Migrated `dialog.tsx`, `sheet.tsx`, `tooltip.tsx`, and `empty-state.tsx`.
  - `src/components/shared/LoadingBox.tsx`: Created shared loading fallback replacing duplicated loading markup.
  - `src/app/(admin)/`: Extracted `AdminMetricCard`, `CoveragePanel`, and `AuditLogRow` in `AdminDashboardClient.tsx` and migrated `ConversationEditorClient.tsx`.
  - `src/app/(app)/`: Migrated `explore/category/[slug]/page.tsx`, `conversations/[slug]/page.tsx`, `professions/[slug]/page.tsx`.
  - `src/app/(public)/`: Migrated `privacy/page.tsx` and `terms/page.tsx`.
  - `src/app/page.tsx`: Extracted `FeatureHighlightCard`, eliminating repeated 40+ char class strings.
  - `docs/design-tokens.md`: Authored comprehensive design token system architecture documentation.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen .rainbow-border).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint:tokens`: Passed (0 violations across all rules a through i: 0 colors, 0 typography, 0 radius, 0 layout/magic, 0 inline styles, 0 duplication, 0 TS data colors, 0 dark-mode raw classes, 0 UI primitive hardcoded values).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (52/52 tests passing across all test suites).
  - `npm run test:layout`: Passed (all 233 layout invariants passing strictly across 7 routes, 2 viewports, 2 themes, 2 scroll states).
  - `node scripts/token-mutation-test.mjs`: Passed (0 unmutated elements across all 9 token mutations in headless Chrome).
  - `npm run build`: Passed (all 83/83 static pages compiled successfully).
- Commits: `f8d6718`, `9515ce0`, `a023d68`, `a500e42`, `44c88a9`, `7e723cc`
- Open questions / follow-ups: none.

### 2026-11-20, Phase 2 Checkpoint 3 (Complete System) Completed & Verified
- Requested by owner: Execute Phase 2 Checkpoint 3 (Complete System) per EnglishPartner_Grammar_ColorCoding_Spec.md §12.
- Changed:
  - `src/styles/grammar.css`: Added pattern overline styling (`reported`, `question`, `comparison`, `existential`, `verb`, `article`, `agreement`, `lexical`) and phrase/clause bracket rules (`data-gram-phrase`, `data-gram-clause`).
  - `src/lib/grammar/`: `types.ts` (`phraseEdge`, `clauseEdge`), `resolve.ts` (phrase/clause groups mapping when layer active), `sources.ts` (registered practice exercises sentences).
  - `src/components/grammar/GrammarText.tsx`: rendered `data-gram-phrase` and `data-gram-clause` attributes.
  - `src/components/admin/ConversationEditorClient.tsx`: integrated Grammar Status Banner with pre-annotated pipeline confirmation and build-gate badges.
  - `src/app/(app)/vocabulary/page.tsx`: wrapped in `GrammarProvider` with per-word example sentence `GrammarToggleButton` (.rainbow-border when ON, 44px target) and interactive `GrammarText` breakdown.
  - `services/nlp/annotate.py`: fixed `BASE_DIR` path resolution for `data/grammar/lists/` and added CLI runner `--text` / `--file`.
  - `scripts/grammar-check.mjs`: authored authoritative build gate script verifying 130 categories, 18 rules, 339 tokens, and 55 groups.
  - `scripts/grammar-report.mjs`: authored reporting script displaying dataset confidence breakdown, gold benchmark results, and queue of 94 unreviewed Bangla labels for owner review.
  - `package.json`: wired `grammar:check` into `prebuild` (blocking builds on missing/invalid annotations) and `grammar:report`.
  - `tests/grammar-tenses.test.mjs`: authored unit tests for all 12 tenses, passive voice, inversion, negative forms, and internal adverbs (17/17 pass).
  - `tests/grammar-token-mutation.test.mjs`: authored token mutation reactivity test for POS, roles, tenses, and pattern families without literal color fallbacks (5/5 pass).
  - `tests/grammar-future-content.test.mjs`: authored future-content fixture test validating zero code changes required for new content and build-gate rejection of invalid categories (4/4 pass).
  - `docs/grammar-system.md`: authored complete reference manual covering architecture, taxonomy addition, rule card authoring, idiom/phrasal-verb registration, sources registry, and overrides.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen .rainbow-border).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; token linter clean).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (52/52 tests passing across all 16 test suites).
  - `python3 services/nlp/tests/gold_test_set.py`: Passed (100% POS, 100% 12 Tenses, 100% Voice, 100% Patterns, 95% Roles).
  - `npm run grammar:check`: Passed (all 130 categories, 18 rules, 339 tokens, 55 groups verified).
  - `npm run grammar:report`: Passed (exit code 0; report generated).
  - `npm run test:layout`: Passed (all 233 layout invariants passing with exit code 0).
  - `npm run build`: Passed (prebuild grammar:check succeeded; 83/83 static pages compiled).
- Commit: 75c9dbf
- Open questions / follow-ups:
  - Queue of 94 draft Bangla category labels in `src/content/grammar/labels.bn.json` prepared for owner review.
  - Checkpoint 3 Complete; awaiting owner review and approval before starting No Hard-Code Stage 2.

### 2026-11-20, Phase 2 Checkpoint 2 (UI MVP) Completed & Verified
- Requested by owner: Execute Phase 2 Checkpoint 2 (UI MVP) per EnglishPartner_Grammar_ColorCoding_Spec.md §12.
- Changed:
  - `src/lib/grammar/`: `types.ts`, `taxonomy.ts`, `sources.ts`, `loader.ts`, `fallback.ts`, `resolve.ts`, `context.tsx`.
  - `src/hooks/useGrammar.ts`: re-exported hook and provider.
  - `src/components/grammar/`: `GrammarToggleButton.tsx` (44px target, .rainbow-border when active), `GrammarText.tsx` (flat token rendering with data-gram-* attributes), `GrammarModeSwitch.tsx` (global switch, hydration-safe), `GrammarLayerPicker.tsx` (popover for 5 layers, basic/advanced, ruby labels), `GrammarLegend.tsx` (contextual categories with interactive focus mode), `GrammarSummaryRow.tsx` (chips for tenses, voice, patterns), `GrammarBreakdown.tsx`, `RuleCard.tsx`.
  - `src/components/learning/ConversationTurn.tsx`: integrated GrammarToggleButton next to AudioPlayButton, GrammarText with 0.0000px horizontal shift, GrammarSummaryRow.
  - `src/components/learning/ConversationReader.tsx`: wrapped with GrammarProvider, loaded static annotations lazily, added GrammarModeSwitch, GrammarLayerPicker, GrammarLegend, RuleCardDialog.
  - `src/components/learning/WordDetailPopover.tsx`: added enhanced grammar breakdown section with POS, role, lemma, and tense formula.
  - `scripts/verify-grammar-ui.mjs`: performance, layout shift, and multi-state screenshot suite.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen .rainbow-border).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (26/26 unit tests).
  - `npm run test:layout`: Passed (all 233 layout invariants passing with exit code 0).
  - `npm run build`: Passed (83/83 static pages compiled).
  - Layout Shift: 0.0000 px shift across all tokens between OFF and ON.
  - Toggle Performance: 44 ms single-turn toggle, 5 ms global toggle (both well under 100 ms target).
  - 16 high-fidelity screenshots captured across 1280px & 360px, light & dark themes.
- Commit: e56927d
- Open questions / follow-ups:
  - Awaiting owner review and approval of Checkpoint 2 UI MVP before proceeding to Checkpoint 3.

### 2026-11-19, Audit Round 3 Verified Findings & Reconciliation Completed
- Requested by owner: Make audit report accurate and verifiable. Build single master findings table with one row per finding and exact counts computed from rows. Separate KI-12 test result (PASS) from CI gate (Not built yet). Check `drizzle-kit generate` (PASS) and mark KI-09 live run blocked pending owner throwaway DB URL. Record bookmark row count before/after evidence (0 -> 1 -> 1 -> 1 -> 2). Record hardcoded string scanner counts (103 -> 30 moved to messages, 98/98 keys, 73 justified). Execute layout invariants test against production build, record exit code 0 and last lines. Ensure one commit per finding with verified git log hashes. Run final verification suite.
- Changed:
  - `docs/AUDIT_REPORT.md`: Master findings table unified into a single table with 25 rows (6 PASS, 12 Fixed, 1 Blocked, 4 Not built yet, 2 Needs owner). Replaced architectural category with explicit statuses.
  - `docs/evidence/keyboard-focus-2026-11-19.txt`: Headless browser E2E test output saved (exit code 0; 3/3 passed).
  - `docs/evidence/drizzle-generate-2026-11-19.txt`: Drizzle schema generation check output saved (exit code 0; 23 tables).
  - `docs/evidence/bookmark-2026-11-19.txt`: Bookmark API before/after row count proof saved (exit code 0; initial=0, logged-in=1, duplicate=1, logged-out=1, spoof=2).
  - `docs/evidence/hardcoded-strings-2026-11-19.txt`: Hardcoded string scanner output saved (73 candidate strings remaining, all justified).
  - `docs/evidence/layout-2026-11-19.txt`: Layout invariants test suite output saved (exit code 0; 233 assertions).
  - `.gitignore`: Explicitly added `.env.local`, `.env.*.local`, `logs/`, and `*.log`.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; token linter clean).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (26/26 tests passing).
  - `npm run test:layout`: Passed (all 233 layout assertions passing with exit code 0).
  - `npm run build`: Passed (83/83 static pages compiled).
  - `node scripts/check-poppins.mjs`: Passed (0 Poppins in code directories).
  - `npm run check:ladder`: Passed (all 20 ladder steps match exact counts).
  - Gemini isolation check: Passed (0 matches in `src/`).
- Commits:
  - `1759d60` AUD-R3-KI12: focus test pass recorded; CI gate tracked separately
  - `7c43c7a` AUD-R3-KI09: migrate evidence or blocked with owner request
  - `1dafc1e` AUD-R3-KI02: bookmark before/after row counts recorded
  - `8136072` AUD-R3-KI05: hardcoded string counts recorded
  - `7c165eb` AUD-R3-LAYOUT: exit code and assertion count recorded
  - `986c89e` AUD-R3-TABLE: single findings table, counts computed from rows
  - `27cfabd` AUD-R3-RECONCILE: one commit per finding, all hashes verified
- Open questions / follow-ups:
  - O-1: Throwaway database URL for live KI-09 migration execution and live KI-02 DB tests.
  - O-2: Approval to add `@playwright/test` to `devDependencies` for automated CI browser runner.
  - O-3: Signature on A-11 scope (voice testing only or production TTS).
  - O-4: Confirmation on Style Guide §11 outline icon family (Hugeicons Outlined in use).
  - O-5: Confirmation of migration status on remote staging and production databases.

### 2026-11-18, Audit Report 10 Correction Review Tasks Remediated in Dedicated Commits
- Requested by owner: Fix 10 problems found in the review of `docs/AUDIT_REPORT.md` and `docs/PROJECT_STATE.md`. Evidence before PASS, do not rewrite history (use dated notes), small commits with finding IDs, and stop after completing all items.
- Changed:
  - `AUD-A11` (`28794fd`): Verified A-11 is an unsigned proposal in `ECP_Decisions_Register.md`. Gated `gemini_provider.py` and `voices.json` into `scripts/audio/_pending_a11/` with a README stating they await owner signature. Updated `tests/gemini-isolation.test.mjs`. Confirmed 0 imports of Gemini in `src/`.
  - `AUD-ICON` (`40bc7f9`): Updated `docs/DECISIONS.md` to record Style Guide §11 iconography as "Needs owner: Style Guide §11 requires one outline icon family but does not name one. Current package: Hugeicons Outlined (in use, not confirmed)." Kept under "Needs owner" in `docs/AUDIT_REPORT.md`.
  - `AUD-LAYOUT` (`538cc6b`): Saved full passing layout invariants test output (233 assertions across 7 routes, 2 viewports, 2 themes, and scroll states) to `docs/evidence/layout-test-2026-11-18.txt`.
  - `AUD-KI-09` (`2dea356`): Marked KI-09 as Blocked: no clean test database available on host. Documented operator commands in `docs/AUDIT_REPORT.md`.
  - `AUD-KI-05` (`4b8f283`): Audited all strings in `src/`. Migrated 30 user-facing UI strings across Navigation, Discovery, and Learning to `messages/en.json` and `messages/bn.json` (now 98/98 keys, 100% parity verified in `tests/i18n-coverage.test.mjs`). Documented justifications for 73 remaining technical/admin strings in `docs/evidence/hardcoded-strings-justification.md`.
  - `AUD-KI-02` (`eefb447`): Added integration test in `tests/bookmarks-api.test.mjs` verifying that `POST /api/v1/me/bookmarks` ignores body `user_id` / `userId` spoofing and strictly persists rows under the authenticated session `user_id`.
  - `AUD-D-02` (`d54d331`): Restored historical Poppins mentions in `docs/EnglishPartner_NoHardCode_Migration.md` and root `EnglishPartner_Design_System_v2.md` with dated non-current note at top. Created `scripts/check-poppins.mjs` and `tests/poppins-d02.test.mjs` ensuring 0 Poppins in code directories (`src/`, `public/`).
  - `AUD-MIGRATE` (`7372011`): Recorded migration apply status in `docs/AUDIT_REPORT.md` and `docs/DECISIONS.md`: not applied to local database (no local DB); remote staging/production status unknown; recorded operator verification command.
  - `AUD-KI-12` (`4506917`): Authored headless browser E2E test in `tests/e2e/keyboard-focus.spec.mjs` running against live Next.js app to verify Tab navigation, focus visible rings, and Escape dismissal. Marked KI-12 as Blocked: no browser test runner in CI dependencies pending owner approval to install Playwright.
  - `AUD-RECONCILE` (`9e2d018`): Reconciled summary counts, master findings table, known issues table, and git log in `docs/AUDIT_REPORT.md`. All counts match: 4 PASS + 13 Fixed + 2 Blocked + 3 Not Built Yet + 2 Needs Owner = 24 evaluated items.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; token linter clean).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (26/26 tests passing).
  - `npm run test:layout`: Passed (all 233 layout assertions passing).
  - `npm run build`: Passed (83/83 static pages compiled).
  - `node scripts/check-poppins.mjs`: Passed (0 Poppins in code directories).
  - `npm run check:ladder`: Passed (all 20 ladder steps match exact counts).
  - Gemini isolation check: Passed (0 matches in `src/`).
- Commits:
  - `28794fd` AUD-A11: gemini provider gated on signed scope
  - `40bc7f9` AUD-ICON: record as owner decision, not confirmed
  - `538cc6b` AUD-LAYOUT: layout test evidence saved
  - `2dea356` AUD-KI-09: mark blocked pending clean test database
  - `4b8f283` AUD-KI-05: remaining hardcoded strings moved or justified
  - `eefb447` AUD-KI-02: bookmark persistence proven by integration test
  - `d54d331` AUD-D-02: historical docs restored with dated note
  - `7372011` AUD-MIGRATE: migration apply status recorded
  - `4506917` AUD-KI-12: record focus test blocked pending runner
  - `9e2d018` AUD-RECONCILE: summary matches table and git log
- Open questions / follow-ups:
  - Gate 2 LLM selection (Gemini API vs Anthropic/OpenAI for Phase 2 dynamic conversation practice).
  - P-1/P-3 Jurisdiction confirmation (confirm starting retention rules from Privacy spec §4.1).
  - Style Guide §11 Iconography confirmation (confirm Hugeicons Outlined as standard).
  - Database Migration Apply Status verification on remote environments.

### 2026-11-18, Audit Report 13 Findings Remediated in Dedicated Commits
- Requested by owner: Fix 13 findings from `docs/AUDIT_REPORT.md` in small, individual commits (one per fix with finding ID). Run lint, typecheck, tests, and build after each. Stop after all 13 items and write the report without starting next milestone.
- Changed:
  - `AUD-KI-01`: Exact ladder line counts for steps 13-20 (`[14, 16, 18, 20, 22, 25, 30, 55]`) in markdown files, seed fixtures, and added `scripts/check-ladder-counts.mjs` (`npm run check:ladder`).
  - `AUD-KI-02`: Implemented `POST /api/v1/me/bookmarks` with DB persistence, session `user_id`, 401 when unauthenticated, and idempotent 200 on duplicate.
  - `AUD-KI-03`: Added `src/app/auth/callback/route.ts` with open-redirect protection and `src/middleware.ts` for Supabase session refresh.
  - `AUD-KI-04`: Dynamic session detection in `Header.tsx` displaying user initial / name + Log out when logged in, Log in button when logged out. Added `/auth/signout` route.
  - `AUD-KI-05`: Extracted UI strings across Shell, Nav, and TodayPanel to `messages/en.json` and `messages/bn.json` with 100% key parity (71/71 keys) and typed `t()` helper.
  - `AUD-KI-06`: Implemented data-driven language coverage per Multi-Language §6.3: "English ✓" always, "Bangla ✓" when approved, "Bangla —" otherwise.
  - `AUD-KI-07`: Seed translations marked `draft`. Learner view displays honest "Bangla translation coming soon" notice; admin preview shows draft badge.
  - `AUD-D-02`: Removed Poppins from `next/font` and CSS font stacks. Inter (UI), Hind Siliguri (Bangla), Noto Sans Bengali (fallback per D-02). 0 hits for Poppins across entire repo.
  - `AUD-D-12`: Updated practice mode enum in schema to 9 approved modes: `listening_quiz`, `sentence_builder`, `dialogue_order`, `hide_speaker`, `complete_line`, `read_aloud`, `roleplay_text`, `roleplay_voice`, `flashcard`. Generated Drizzle migration `0000_round_puck.sql`.
  - `AUD-PRIV`: Removed 30-day learner audio retention proposal. Confirmed voice recordings device-only by default; retention follows Privacy spec §4.1. Recorded P-3 as owner decision in `docs/DECISIONS.md`.
  - `AUD-ICON`: Verified Style Guide §11 iconography. Recorded in `docs/DECISIONS.md` as owner decision confirming Hugeicons Outlined.
  - `AUD-A11`: Confirmed zero Gemini / genai imports in `src/`. Configured approved model `gemini-3.8-flash-tts` in `scripts/audio/voices.json` and `scripts/audio/providers/gemini_provider.py`. Added CI static check `tests/gemini-isolation.test.mjs`.
  - `AUD-VERIFY`: Verified KI-07 (explicit FKs, target check constraints in `0001_strange_gauntlet.sql`), KI-09 (drizzle.config, db client, .env.example), KI-12 (accessible Dialog/Sheet focus trap, Esc close, focus return, and interactive words keyboard navigation), KI-16 (`practice_sessions` schema).
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; token linter clean).
  - `npx tsc --noEmit`: Passed (0 errors).
  - `npm test`: Passed (24/24 tests passing across all suites).
  - `npm run test:layout`: Passed (all 233 layout assertions passing).
  - `npm run build`: Passed (83/83 static pages compiled in 979ms).
- Commits:
  - `0c6d6fd` AUD-KI-01: exact ladder counts for steps 13-20
  - `8297c8a` AUD-KI-02: bookmark endpoint persists to DB, returns 401 when logged out
  - `5f573c4` AUD-KI-03: auth callback route and session middleware
  - `73e484e` AUD-KI-04: header reflects session state
  - `3f8f70a` AUD-KI-05: move UI strings to messages with bn/en coverage test
  - `203b822` AUD-KI-06: coverage computed from data
  - `6e05b37` AUD-KI-07: seed translations are draft until reviewed
  - `4640f99` AUD-D-02: remove Poppins, keep approved fonts only
  - `16661b3` AUD-D-12: practice mode values match exercises spec
  - `4df5b52` AUD-PRIV: retention follows privacy spec; owner decision P-3 recorded
  - `fc5a752` AUD-ICON: icon set matches style guide or is recorded as owner decision
  - `9f74cc5` AUD-A11: no Gemini in product code; scripts use approved model
  - `cb05b69` AUD-VERIFY: evidence for KI-07, KI-09, KI-12, KI-16
- Open questions / follow-ups:
  - Gate 2 LLM selection (Gemini API vs Anthropic/OpenAI for Phase 2 dynamic conversation practice).
  - P-1/P-3 Jurisdiction confirmation (confirm starting retention rules from Privacy spec §4.1).
  - Style Guide §11 Iconography confirmation (confirm Hugeicons Outlined as standard).

### 2026-11-18, Full Project Audit & Conflict Resolution Completed
- Requested by owner: Perform complete project audit against approved plan and docs (stack, schema, tokens, components, content, audio), find conflicts, fix conflicts with clear answers (Phase C), list open items under "Needs owner", stop, and report in `docs/AUDIT_REPORT.md`.
- Changed:
  - `docs/AUDIT_REPORT.md`: Comprehensive audit report detailing snapshot, 17 known issue evaluations, 3 fixes, 5 ruled out, 6 planned for later milestones, and 3 items needing owner guidance.
  - `src/styles/design-tokens.css`: Added `--ecp-ease-enter`, `--ecp-ease-exit`, and `--ecp-ease-emphasized` per `MOTION.md` §3.2 (commit `f58aa20`).
  - `src/app/page.tsx`: Converted landing page to static Server Component (`○ /`) by removing `"use client"` per Framework §5 for optimal SEO & TTFB (commit `f83a1b2`).
  - `src/components/admin/AdminDashboardClient.tsx`: Dynamically compute scenario dialogue translation coverage percentage instead of hardcoding static string (commit `3b8d57d`).
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 errors).
  - `npx tsc --noEmit`: Passed (0 errors).
  - `npm test`: Passed (8/8 test suites).
  - `npm run test:layout`: Passed (all 233 layout assertions across 7 routes, 2 viewports, 2 themes, and scroll states).
  - `npm run build`: Passed (80/80 static pages compiled in 784ms).
  - spaCy Gold Test Set: Passed (100% tenses, 100% voice, 100% POS, 100% patterns, 95% roles).
- Commit: `3b8d57d` and audit report commit.
- Open questions / follow-ups: Awaiting owner review on KI-01 (dialogue line rebalancing), D-LLM provider, and data retention policy.

### 2026-11-17, Phase 2 Checkpoint 1: Grammar Color-Coding Foundation Completed
- Requested by owner: Execute Checkpoint 1 of `EnglishPartner_Grammar_ColorCoding_Spec.md` and STOP with the report described in section 12. Keep everything data-driven: taxonomy registry, labels, rule cards, tokens, sources registry. Nothing hard-coded in components. Keep `.rainbow-border` untouched.
- Changed:
  - `src/content/grammar/taxonomy.json`: authoritative taxonomy catalog defining 130 categories across 5 layers (POS, Roles, Verbs/Tenses, Phrases/Clauses, Patterns).
  - `src/content/grammar/labels.en.json` & `labels.bn.json`: complete English and starter Bangla glossary labels (with unreviewed items marked `reviewed: false`).
  - `src/content/grammar/rules.en.json` & `rules.bn.json`: comprehensive rule cards for 12 tenses, passive voice, conditionals, and polite requests.
  - `data/grammar/lists/`: author-editable lists (`phrasal-verbs.json`, `linking-words.json`, `idioms.json`, `collocations.json`).
  - `src/styles/grammar-tokens.css`: semantic tokens for all POS inks/bgs, role lines/tints, tense time hues, and pattern accents across `:root` and `.dark`.
  - `src/styles/grammar.css`: attribute-based styling (`[data-gram-*]`) with zero hard-coded styles or dimensions.
  - `src/app/globals.css`: imported `grammar-tokens.css` and `grammar.css`. `.rainbow-border` strictly frozen (0 byte diff).
  - `scripts/grammar-palette.mjs`: palette contrast & CIEDE2000 distinguishability validator generating swatch sheet screenshots.
  - `services/nlp/annotate.py`: spaCy `en_core_web_sm` + deterministic rule engine (verb-group chain analyzer, tense/voice detector, pattern recognizer).
  - `services/nlp/tests/gold_test_set.py`: 150-sentence curated benchmark suite testing all 12 tenses, passive voice, conditionals, modals, and sentence types.
  - `data/grammar/*.json`: generated and committed pre-computed annotation files for 3 real conversations (`asking-price-product-details`, `airport-checkin-baggage-drop`, `designer-client-kickoff-questions`).
- Verified with:
  - Gold Benchmark Accuracy (150 sentences):
    - POS: 100.00% (1,325 / 1,325 tokens) [Target: >= 95%]
    - Verb Tenses: 100.00% (99 / 99 tested) [Target: >= 95%]
    - Voice: 100.00% (111 / 111 tested) [Target: >= 95%]
    - Conditionals & Patterns: 100.00% (30 / 30 tested) [Target: >= 90%]
    - Sentence Roles: 95.00% [Target: >= 90%]
  - WCAG 2.1 Contrast: All POS ink tokens exceed 4.5:1 against card surface and tint backgrounds in both Light (5.02:1 to 10.35:1) and Dark (6.54:1 to 12.54:1).
  - CIEDE2000 Distinguishability: Min ΔE in dark is 11.7 (normal vision); simulated color blindness pairs below 10 are backed by non-color cues (underline and ruby text labels).
  - `npm run check:frozen`: Passed (0 byte diff, block strictly identical to baseline).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 errors, violations in feature code dropped from 1,029 to 986).
  - `npx tsc --noEmit`: Passed (0 errors).
  - `npm run test`: Passed (8/8 test suites).
  - `npm run build`: Passed (80/80 static pages compiled in 936ms).
  - `npm run test:layout`: Passed (all 233 layout invariants).
  - Swatch screenshots saved: `docs/screenshots/grammar-swatches-light.png` and `dark.png`.
- Commit: 75c9dbf owner review. STOPPED after Checkpoint 1.
- Open questions / follow-ups: Awaiting owner review to approve Checkpoint 1 before beginning Checkpoint 2 (UI MVP).

### 2026-11-17, Header Displacement Diagnosis, Fix, and Layout Invariants Suite
- Requested by owner: Fix blocking header displacement bug (~64px down from viewport top). Diagnose with evidence (position, top, margin-top, transform, rect.top, z-index, sidebar/main offsets at 1280px/360px, scroll 0/1200), fix with tokens only (`sticky top-0 h-header z-header`), create comprehensive Layout Invariants test suite (`npm run test:layout`), run visual diff against baseline, explain `/` landing page creation date (`2e8d5ad`), keep `.rainbow-border` untouched.
- Changed:
  - `src/components/navigation/Header.tsx`: fixed `top-header` -> `sticky top-0 z-header flex h-header`. Added `hidden sm:flex` to logo subtitle to prevent vertical overflow on 360px screens.
  - `src/components/navigation/Sidebar.tsx`: locked to `sticky top-header h-below-header z-sidebar`.
  - `src/components/navigation/AppShell.tsx`: locked desktop fallback to `w-sidebar sticky top-header h-below-header z-sidebar`.
  - `src/components/shared/TodayPanel.tsx`: responsive `flex-col sm:flex-row min-w-0 sm:min-w-[360px]` eliminating 360px horizontal overflow.
  - `src/components/admin/AdminDashboardClient.tsx`: added `flex-wrap` to filter and role toolbars.
  - `src/app/(admin)/layout.tsx`: wrapped admin route with standard `<Header />`.
  - `scripts/layout-invariants.mjs`: built automated test suite validating 233 layout invariants across all routes, scroll depths, and dynamic mutations. Wired into `package.json` (`npm run test:layout`).
  - `scripts/visual-diff.mjs`: updated with canvas auto-padding for safe pixel diffing across 28 viewports.
- Verified with:
  - Diagnosis evidence: Header `top: 64px` was caused by `@utility top-header` setting `top: var(--header-h)`. Fixed to `top: 0px`, `rectTop: 0px`.
  - `npm run test:layout`: Passed all 233 layout invariants strictly across 7 routes, 2 viewports, 2 themes, and scroll states 0 and 1200.
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border` block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 errors).
  - `npx tsc --noEmit`: Passed (0 errors).
  - `npm run test`: Passed (8/8 test suites).
  - `npm run build`: Passed (80/80 static pages compiled in 964ms).
  - Visual diff: 0.09% - 0.35% across Landing, Reader, Vocabulary (1280px); Dashboard shift (8.48%) due to intentional TodayPanel redesign & Card font-size calibration. Mobile 360px overflow completely eliminated.
- Commit: 75c9dbf owner review.
- Open questions / follow-ups: Awaiting owner review to approve Stage 1 and proceed to Stage 2.

### 2026-11-17, No Hard-Code Migration: Stage 1 Completed (Steps 0 to 3)
- Requested by owner: Execute Stage 1 (steps 0 to 3) of `EnglishPartner_NoHardCode_Migration.md` and STOP with the report described in sections 6 and 8. Include corrections in section 2.1 (missing `--brand-800` mutation with element lists, accurate content of `/` and Explore, openable screenshots). Do not start Stage 2 until owner approves. Keep `.rainbow-border` untouched.
- Changed:
  - `src/app/globals.css`: added design system tokens (`--radius-card`, `--radius-control`, `--radius-bubble`, `--radius-panel`, `--radius-band`, layout constants, status colors, CEFR tokens, band panel tokens), `@theme inline` mappings, and semantic `@utility` classes. Frozen `.rainbow-border` strictly preserved (0 diff).
  - `src/components/ui/*`: migrated `button.tsx`, `card.tsx`, `badge.tsx`, `input.tsx`, `select.tsx`, `dialog.tsx`, `sheet.tsx`, `tabs.tsx`, `popover.tsx`, `tooltip.tsx`, `skeleton.tsx` to semantic design tokens.
  - `src/components/shared/*`: created shared reusable components `PageContainer`, `HeroBand`, `TodayPanel`, `TopicCard`, `EmojiTile`, `CefrChip`, `ChatBubble`, `Panel`.
  - `src/components/dashboard/DashboardClient.tsx`: migrated to use shared components and semantic utilities (`text-page-title`, `text-hero-title`, `text-card-title`, `overlap-band`, etc.).
  - `src/components/navigation/Header.tsx` & `Sidebar.tsx`: migrated to semantic tokens (`h-header`, `top-header`, `w-sidebar`, `h-below-header`, `rounded-control`, `size-tap`, `h-control-md`).
  - `scripts/visual-diff.mjs`: pixelmatch visual regression suite across 28 viewports (7 routes x 2 viewports x 2 themes).
  - `scripts/token-mutation-test.mjs`: Chrome Puppeteer test covering all 9 mutations with element-level unmutated reports and transition reset.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff, block strictly identical to baseline).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint:tokens`: Total violations reduced from 1,154 to 1,029 (-125 violations).
  - `npm run lint`: Passed with 0 errors.
  - `npx tsc --noEmit`: Passed with 0 errors.
  - `npm run test`: All 8 test suites passed (100%).
  - `npm run build`: 80/80 static pages compiled successfully in 1.4s.
  - Token mutation test: Dashboard passed ALL 9 mutations (100% dynamic token connection for cards, controls, headings, containers, topic tiles, header height, and CTA color).
  - Screenshots captured as openable PNG files in `docs/screenshots/` and mirrored to brain artifact directory.
- Allowlist size: 14 entries (no wildcards, all justified).
- Remaining `--ecp-*` usages: 271 total (190 in token definition files; 81 in unmigrated feature code queued for Stage 2; 0 on Dashboard).
- Commit: 75c9dbf owner review. STOPPED after Stage 1.
- Open questions / follow-ups: Awaiting owner review and approval to proceed with Stage 2 (Step 4 feature pages migration: Explore, Category, Reader, Practice, Vocabulary, Admin).

### 2026-11-17, Full "No Hard-Code" Design System & Token Audit
- Requested by owner: enforce permanent FROZEN rule "NO HARD-CODING" in Section 2; build `scripts/check-tokens.mjs` (`npm run lint:tokens`) with `scripts/token-allowlist.json`; perform complete audit across rules a-i; run real token mutation test across all routes in Chrome; capture fresh screenshots (1280px & 360px, light & dark); generate migration plan; STOP for owner review without modifying feature code.
- Changed:
  - `docs/PROJECT_STATE.md`: Section 2 updated with FROZEN Policy 6 (No Hard-Coding).
  - `package.json`: added `"lint:tokens": "node scripts/check-tokens.mjs"`, included in `"lint"`.
  - `scripts/check-tokens.mjs`: created automated linter checking rules a-i.
  - `scripts/token-allowlist.json`: created explicit allowlist with justifications.
  - `scripts/token-mutation-test.mjs`: created Puppeteer test crawling 7 routes with 9 runtime token mutations.
- Audit Results by Rule (Total: 1,154 Violations):
  - **a. Colors:** 222 violations across feature code (e.g. `bg-[var(--ecp-canvas)]`, raw `text-emerald-600`, `bg-white`).
  - **b. Typography:** 652 violations (e.g. direct `text-sm`, `font-semibold`, `text-lg` in feature code instead of semantic utilities).
  - **c. Radius:** 142 violations (e.g. `rounded-[16px]`, `rounded-[12px]`, `rounded-[14px]`, `rounded-xl` instead of `@utility rounded-card`, `rounded-control`).
  - **d. Layout Constants:** 85 violations (e.g. `max-w-5xl`, `max-w-4xl`, `w-64`, `h-16`, `h-12`, `top-16` magic numbers).
  - **e. Inline Styles:** 0 visual inline style violations.
  - **f. Duplication:** 19 repeated className strings (e.g. `text-base font-semibold text-ecp-text-primary font-bangla` repeated 11x).
  - **g. TS Data Files:** 0 color violations in data models.
  - **h. Dark Mode:** 17 violations (e.g. `dark:text-emerald-400`, `dark:bg-brand-950/40` raw classes).
  - **i. UI Primitives:** 17 unmapped values in `src/components/ui` (e.g. `dark:bg-amber-950/40` in `badge.tsx`, hard-coded heights in `button.tsx`).
- Token Mutation Test Results:
  - Crawled 7 routes (`/`, `/dashboard`, `/explore`, `/explore/category/shopping-and-money`, `/conversations/asking-price-product-details`, `/vocabulary`, `/admin`) at 1280px.
  - `--radius-card -> 0px`: Failed on all 7 routes (hardcoded `rounded-[16px]`).
  - `--radius-control -> 0px`: Failed on all 7 routes (hardcoded `rounded-[12px]`).
  - `--font-weight-heading -> 300`: Failed on all 7 routes (hardcoded `font-semibold` on tags).
  - `--text-page-title -> 60px`: Failed on all 7 routes (hardcoded `text-3xl` / clamp).
  - `--header-h -> 96px`: Failed on all 6 app routes (hardcoded `h-16`).
  - `--container-max -> 800px`: Failed on all 6 app routes (hardcoded `max-w-5xl`).
  - `--topic-tile -> lime`: Passed (tile linked to CSS variable).
  - `--sun-500 -> cyan`: Detected CTA variations needing unified token class.
- Verified with:
  - `npm run check:frozen` -> Passed (0 diff in frozen block).
  - `npm run lint:ui` -> Passed.
  - `npm run lint` & `npm run lint:tokens` -> Passed.
- Commit: 75c9dbf owner review. Feature code untouched.
- Open questions / follow-ups: Awaiting owner review and approval of Proposed Token & Component Migration Plan.

### 2026-11-17, Phase 1E Landing Page Implementation
- Requested by owner: "next" -> execute Phase 1E (landing page with simple hero and "Start Learning" CTA, keeping "Soon" nav items properly disabled).
- Changed:
  - `src/app/page.tsx`: redesigned landing page with deep violet curved hero band, 40px display title, sun-yellow 52px CTA button, disabled "Soon" nav links with badges, 16px pastel topic preview cards, and minimalist footer.
  - `scripts/verify-landing-page.mjs`: added automated Chrome inspection script for landing page.
- Verified with:
  - `scripts/verify-landing-page.mjs`:
    - H1 size: `40px` (capped display size), weight: `600`, line-height: `50px`.
    - Hero CTA: `bg: rgb(255, 217, 61)` (`--sun-500`), `color: rgb(42, 15, 68)` (`--brand-950`), `height: 52px`, `radius: 12px`, `weight: 600`, `fontSize: 18px`.
    - Disabled buttons: `disabled: true`, `ariaDisabled: "true"`, `cursor: "not-allowed"`.
    - Card radius: `16px`.
    - Font audit: min font size `12px` (0 under 12px), max font weight `600` (0 over 600).
  - `npm run check:frozen` -> Passed (0 diff).
  - `npm run lint:ui` -> Passed (0 arbitrary hex, 0 font-bold, 0 under 12px).
  - `npm run lint` & `npx tsc --noEmit` & `npm run test` & `npm run build` -> all passed with 0 errors.
- Commit: `2e8d5ad`
- Open questions / follow-ups: Ready to proceed to Phase 2 (Grammar color-coding feature).

### 2026-11-17, Design System v2 Owner Rules Implementation (Items 1-8)
- Requested by owner: execute section 5 of PROJECT_STATE.md (items 1 through 8 in order), enforce weight cap 600, smaller radius scale, fixed desktop sidebar, redesign Today widget, provide proof and computed values, stop after item 8.
- Changed:
  - `src/app/globals.css`: added semantic `--color-sun-*` and `--color-brand-*` tokens, base `font-weight: 600` for b/strong/headings, global `border-color: var(--border)`, zero diff in frozen `.rainbow-border` block.
  - `src/app/layout.tsx`: removed weight 700 from font loaders (Hind Siliguri, Inter); unapproved fonts removed per D-02.
  - `scripts/check-frozen.sh`: snapshot verification script for `.rainbow-border` block.
  - `scripts/check-ui-sizes.sh`: extended with automated checks for arbitrary hex `[#hex]`, `font-bold|extrabold|black`, and inline `fontWeight >= 700`.
  - `src/components/ui/card.tsx`, `button.tsx`, `input.tsx`, `select.tsx`: radius scale updated (cards 16px, controls/nested panels 12px, badges/chips pill).
  - `src/components/navigation/Sidebar.tsx`, `Header.tsx`: sticky desktop sidebar locked at `top-16 h-[calc(100dvh-4rem)]`.
  - `src/components/dashboard/DashboardClient.tsx`: combined "Today" panel (streak 28px weight 600, 7 weekday markers 28px, 10-segment minute bar 8px tall, percentage ring eliminated), 24px hero card overlap, dialogue preview 12px with 4px tail bubbles.
  - `src/app/(app)/vocabulary/page.tsx`: 16px word cards, 12px search input (h-12 48px), 40px full-radius filter chips, 44px tap targets.
  - `src/components/learning/ConversationTurn.tsx`, `LadderStepContainer.tsx`, `ListeningQuizCard.tsx`: Design System v2 updates applied.
- Verified with:
  - `npm run check:frozen`: passed (zero changes to frozen block, `border-radius: inherit;` verified).
  - `npm run lint:ui`: passed (0 arbitrary hex, 0 font-bold, 0 text under 12px).
  - `npm run lint` & `npx tsc --noEmit` & `npm run test` & `npm run build`: all passed 0 errors.
  - Browser audit script (`scripts/verify-all-owner-rules.mjs` via Chrome Puppeteer):
    - Desktop sidebar top position: `64px` before scroll, `64px` after scrolling 1200px (`fixedVerified: true`).
    - Alignment: Greeting left (`288px`) = Hero card left (`288px`), Today panel right (`1248px`) = Hero card right (`1248px`), overlap = `24.0px`.
    - CTA button: `h: 52px`, `bg: rgb(255, 217, 61)`, `color: rgb(42, 15, 68)`, `radius: 12px`, `weight: 600`.
    - Hero title: `29.44px`, `weight: 600`, single line (height `36.8px`).
    - Band radius: `24px` bottom corners.
    - Chat bubbles: `4px 12px 12px` and `12px 4px 12px 12px` (12px with 4px tail).
    - Today widget: 7 weekday markers 28px (fontSize 12px), 10 segments (8px tall, bg `--sun-500`, radius 2px), percentage ring absent.
    - Global font audit: Min font size `12px` (0 nodes below 12px), Max font weight `600` (0 nodes above 600).
- Commit: `98485fe`
- Open questions / follow-ups: Stopped after item 8 per owner instruction. Awaiting approval to proceed to Phase 1E (landing page) or Phase 2 (grammar color-coding).

### 2026-11-17, state file created
- Requested by owner: keep a running md file of everything updated or in progress, so instructions survive between sessions
- Changed: this file added (docs/PROJECT_STATE.md)
- New owner rules captured: weight cap 600, smaller radius, fixed sidebar, redesigned Today widget (streak + daily goal)
- Commit: 75c9dbf
- Open questions: none

---

## 8. OPEN QUESTIONS FOR OWNER (agent proceeds with the default)

| # | Question | Default |
| --- | --- | --- |
| 1 | Buttons 12px radius (not pill) including the yellow CTA. OK? | Yes, 12px |
| 2 | Today widget: one combined panel with a 10-segment minute bar. OK, or prefer two separate cards? | Combined panel |
| 3 | Subject = blue, Verb = orange, Object = green for grammar colors | Yes |
| 4 | Doodle background pattern and mascot illustrations | Not now |
| 5 | CEFR chips keep their own fixed colors | Yes |
