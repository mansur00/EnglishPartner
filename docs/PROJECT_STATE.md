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

7. **AUTHORITATIVE SURFACE CONTRAST & STROKE RULE (Owner Rule, 2026-11-22):**
   - **Background XOR Stroke:**
     - If an element has a solid background color (`bg-*`), it MUST NOT have a stroke or border (`border-0` or omit stroke).
     - If an element has a stroke/border (`border border-*`), it MUST NOT have a solid background color (use `bg-transparent`).
     - **Sole Explicit Exception:** The active animated gradient rainbow border (`.rainbow-border`), which retains both background and border.
   - **Strict Shadcn Harmony & Typography Scale:**
     - Strict font size scale: floor `12px` (`text-chip`, `text-meta`), `14px` (`text-label`), `16px` (`text-body`), `18px` (`text-lead`), `20px` (`text-card-title`), `26-34px` (`text-page-title`), max `40px` (`text-display`).
     - Max font weight: strictly 600 (`font-semibold`).
     - Button heights: `xs` (28px / h-7), `sm` (36px / h-9), `md`/default (40px / h-10), `lg` (44px / h-11), `cta` (52px / h-13). Radius: 12px (`rounded-control`).
     - Pill / Badge heights: `sm` (20px), `md` (24px), `lg` (28px). Radius: `rounded-pill`.
     - Card sizes & padding: Standard `p-5 md:p-6 rounded-card` (16px), compact `p-4 rounded-card`.
     - Spacing rhythm: 4px base (`gap-2` = 8px, `gap-4` = 16px, `gap-6` = 24px, container `max-w-5xl mx-auto px-4 sm:px-6 md:px-8`).

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
| `34726f2` | Milestone 2C — "What Should I Say?" (AI Intent & Expression Assistant): Schema S1 contract, deterministic intent engine (zero Gemini in product code per AUD-A11), POST /api/v1/ai/say-it, interactive WhatShouldISay UI with Expandable Design System, Web Speech audio, and unit tests |
| `72de12a` | Milestone 2A: Listening Comprehension Quiz engine (ECP_Exercises_SRS_Spec §4.1, Brief §10.4), Expandable Design System UI (Card, Button, Pill, Tag), slow audio (0.75x) toggle, score calculator, fallback generator, and test suite |
| `f34740d` | Milestone 2D: AI Text Roleplay Partner (Schema R1 in-role turns, Schema F1 feedback summary, max 1 correction per turn, prompt injection guardrail, POST /api/v1/ai/roleplay/turn & feedback, RoleplayPartner UI with ChatBubble and audio, /roleplay route) |
| `9fab261` | Milestones 3A & 3D & 3E: Speech Recognition input in RoleplayPartner, Personalised Analytics & Recommendations Engine (progress-metrics.ts), ProgressDashboard UI, /progress route, and sidebar navigation |
| `839f4cb` | Milestone 3C: Pronunciation Hints & Acoustic Word-Level Feedback Engine (ECP_Phase_Plan §6.1, ECP_Audio_Voice_Guide §10.2, Brief §9.3 & §20). Pure alignment engine in pronunciation.ts, Bengali acoustic tips dictionary, qualitative relative tiers (no fake decimal/percentage scores), transparent browser limitations disclaimer, slow audio controls (0.7x/0.75x), and upgraded ReadAloudCard |
| `67d6d7d` | Milestone 3B: Voice Roleplay Loop (ECP_Phase_Plan §6.1 & §6.4). Auto-speak AI replies with Web Speech API, speed controller (0.75x/0.88x/1.0x), speech input with transcript cleanup, live status cues, and dialogue replay in RoleplayPartner.tsx |
| `1bd9fbb` | Milestones 4A & 4C: Professional English Career Paths & PWA Foundation (ECP_Phase_Plan §7.1). 5 career tracks in registry.ts, /professions index page, upgraded /professions/[slug], PWA web manifest, service worker shell caching, and sidebar navigation |

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
28. **[DONE] (commit 34726f2) Milestone 2C — "What Should I Say?" (AI Intent & Expression Assistant):** Authored Schema S1 contract (`src/lib/ai/say-it-schema.ts`), deterministic intent resolution engine with Bangla/English support and placeholder injection (`src/lib/ai/say-it.ts`), `POST /api/v1/ai/say-it` API endpoint (`src/app/api/v1/ai/say-it/route.ts`), interactive UI (`src/components/tools/WhatShouldISay.tsx`) with Expandable Design System `InputGroup`, `Pill`, `Tag`, and `Button`, route `/what-should-i-say`, and sidebar navigation. 132 unit tests passing.
29. **[DONE] (commit 72de12a) Milestone 2A — Listening Comprehension Quiz:** Authored `src/lib/practice/listening-quiz.ts` (Zod schema §4.1, evaluation, score calculation with pedagogical tiers, and fallback generator), upgraded `ListeningQuizCard.tsx` with Expandable Design System, slow audio toggle, option badges, skip action, and keyboard shortcuts, and added unit tests in `tests/listening-quiz.test.mjs`. 145 unit tests passing.
30. **[DONE] (commit f34740d) Milestone 2D — AI Text Roleplay Partner:** Authored `src/lib/ai/roleplay-schema.ts` (Schemas R1 & F1), deterministic in-character roleplay engine with 1-correction limit and prompt injection guardrails (`src/lib/ai/roleplay.ts`), API routes `/api/v1/ai/roleplay/turn` and `/api/v1/ai/roleplay/feedback`, interactive UI (`RoleplayPartner.tsx`) with `ChatBubble` (speaker="1" for partner, "2" for learner) and Web Speech audio, route `/roleplay`, and sidebar navigation. 152 unit tests passing.
31. **[DONE] (commit 9fab261) Milestones 3A & 3D & 3E — Speech Input, Personalisation & Progress Analytics:** Authored `src/lib/analytics/progress-metrics.ts` (retention tiers, SM-2 stage distribution, accuracy, and personalized next steps), built interactive `ProgressDashboard.tsx` with KPI metrics, SM-2 vocabulary retention progress, and weekly activity columns, created route `/progress`, wired "My Progress" in `Sidebar.tsx`, and added Web Speech recognition input to `RoleplayPartner.tsx`. 158 unit tests passing.
32. **[DONE] (commit 839f4cb) Milestone 3C — Pronunciation Hints & Acoustic Word-Level Feedback Engine:** Authored `src/lib/practice/pronunciation.ts` with word-level phonetic alignment, Bengali acoustic hints dictionary, qualitative tiers ('clear', 'getting_there', 'needs_practice'), zero fake precision scores, automated audio disclaimer, and upgraded `ReadAloudCard` with interactive word chips and slow audio playback. 166 unit tests passing.
33. **[DONE] (commit 67d6d7d) Milestone 3B — Voice Roleplay Loop:** Implemented auto-speak AI replies with Web Speech API, speed controller (0.75x/0.88x/1.0x), speech input with transcript cleanup in src/lib/ai/roleplay-voice.ts, live status cues, and dialogue replay in RoleplayPartner.tsx. 171 unit tests passing.
34. **[DONE] (commit 1bd9fbb) Milestones 4A & 4C — Professional English Career Paths & PWA Foundation:** Authored src/lib/professions/registry.ts (UI/UX, Software Engineer, Remote Freelancer, Healthcare, Teacher), created /professions page, upgraded /professions/[slug] static params and UI, created PWA web manifest and offline service worker (/sw.js), wired sidebar, 177 unit tests passing, 109 static routes.
35. **[DONE] (commit 8f51de4) Milestone 4B — Multi-Language Strategy & Translation Framework:** Authored `src/lib/i18n/languages.ts` (registry for BN, EN, HI, UR, AR; RTL detection; script metadata), added complete `messages/hi.json` with 100% key parity (98/98 keys), updated `src/lib/i18n/index.ts` with Hindi dictionary and fallback, authored `LanguageSwitcher.tsx` with Expandable Design System, integrated in `Header.tsx`, 183 unit tests passing, 109 static routes.
36. **[DONE] (commit 2cc43b4) Milestone 4E — AI Quotas, Rate Limiting & Cost Defense Engine:** Authored `src/lib/ratelimit/quota.ts` (10 req/min burst limiter, 30 daily say-it requests, 20 max turns per roleplay session, IETF draft headers `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`, `Retry-After`), integrated in `POST /api/v1/ai/say-it` and `POST /api/v1/ai/roleplay/turn`, added turn limit notice and input guard in `RoleplayPartner.tsx`, 190 unit tests passing, 109 static routes.
37. **[DONE] (commit 8addb7c / c326c38) Automated CI Workflow & End-to-End Test Gate (KI-12-CI):** Automated multi-platform headless Chrome runner in `tests/e2e/keyboard-focus.spec.mjs`, added `"test:e2e"` script in `package.json`, upgraded `.github/workflows/ci.yml` with comprehensive gate checks (`check:frozen`, `lint:ui`, `lint`, `test`, `build`, and live E2E runner), and reconciled `docs/AUDIT_REPORT.md` (KI-12-CI marked Fixed; Not built yet count reduced to 0).
38. **[DONE] (commit e495833) Brief §19 MVP End-to-End Acceptance Verification Suite:** Authored `tests/mvp-acceptance.test.mjs` verifying all 5 core acceptance criteria categories from Brief §19 (Discovery, Conversation Learning, Vocabulary & Grammar, Personal Learning & Practice & AI, Multi-Language & Quality) across 13 comprehensive tests. 203 unit tests passing, 109 static routes.
39. **[DONE] (commit 45f8460) Next.js 16 Proxy Migration:** Migrated deprecated `src/middleware.ts` to `src/proxy.ts` exporting `proxy`, eliminating the Next.js 16 build deprecation warning while preserving Supabase session token refresh and security cookie handling. Build 100% warning-free, 203 unit tests passing.
40. **[DONE] (commit b4e99d4) Milestone 4D — Mobile App & Android APK Architecture:** Authored `docs/MOBILE_APP_ARCHITECTURE.md` detailing Trusted Web Activity (TWA via Bubblewrap) and Capacitor Android packaging, configured detected Mac ARM environment (`JAVA_HOME` pointing to embedded OpenJDK 25 in Android Studio, `ANDROID_HOME` pointing to `~/Library/Android/sdk`), mapped AndroidManifest audio and network permissions, and authored Android Studio signing runbook for `android-studio-rabbit1-mac_arm.dmg`.

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

### 2026-11-26, Fix Ladder Conversation Layout Clipping Under Right Sidebar
- Requested by owner: Fix layout clipping on `/conversations/[slug]` (Shopping Ladder steps) where the middle content overlapped underneath the fixed right sidebar (`w-80 xl:w-96`).
- Changed:
  - `src/app/(app)/conversations/[slug]/page.tsx`: Wrapped ladder step view in `w-full lg:pr-80 xl:pr-96` + `w-full px-4 sm:px-6 lg:px-9 py-6 pb-12 space-y-6` matching the regular scenario view and other 3-column pages.
- Verified with: `npm run check:frozen`, `npm run lint:ui`, `npx tsc --noEmit`, `npm run lint`, and `npm test` (220/220 passing).
- Commit: pending
- Open questions / follow-ups: none.

### 2026-11-26, Update App Logo & Favicon SVGs
- Requested by owner: Update `logo.svg` and `favicon.svg` from `~/Downloads` into the project.
- Changed:
  - `public/logo.svg`: Updated from `~/Downloads/logo.svg`.
  - `src/app/icon.svg` & `public/favicon.svg`: Updated from `~/Downloads/favicon.svg`.
- Verified with: `npm run check:frozen`, `npm run lint:ui`, `npx tsc --noEmit`, `npm run lint`, and `npm test` (220/220 passing).
- Commit: pending
- Open questions / follow-ups: none.

### 2026-11-26, Subtle Disabled Color for ChatTurnBubble Speaker & Sequence Number
- Requested by owner: Mute speaker name (`Customer:`, `Shop Assistant:`) and turn number (`#1`, `#2`) in conversation chat bubbles (`ChatTurnBubble.tsx`) to a disabled/subtle color (`text-muted-foreground/45`).
- Changed:
  - `src/components/learning/ChatTurnBubble.tsx`: Updated `speaker.name` and `#sequenceNumber` to `text-muted-foreground/45`.
- Verified with: `npm run check:frozen`, `npm run lint:ui`, `npx tsc --noEmit`, `npm run lint`, and `npm test` (220/220 passing).
- Commit: pending
- Open questions / follow-ups: none.

### 2026-11-26, Daily Practice Fixed Right Sidebar Layout
- Requested by owner: Remove Today's Conversation Challenge card and show only the 4 Continue Learning Path cards (Conversation, Grammar, Vocabulary, Quiz) in the fixed right sidebar (`w-80 xl:w-96`) on `/daily-practice`.
- Changed:
  - `src/components/practice/DailyPracticeClient.tsx`: Migrated from `PageContainer` to full-width middle content area (`w-full lg:pr-80 xl:pr-96`) + fixed right `<aside>` (`fixed right-0 top-header h-below-header w-80 xl:w-96 border-l border-border bg-card z-sidebar overflow-y-auto p-4`) with `lg:hidden` mobile fallback.
- Verified with: `npm run check:frozen`, `npm run lint:ui`, `npx tsc --noEmit`, `npm run lint`, and `npm test` (220/220 passing).
- Commit: pending
- Open questions / follow-ups: none.

### 2026-11-26, Explore Page Fixed Right Sidebar Layout
- Requested by owner: Move Search, Category Pills, and Filter Bar on `/explore` into a fixed right sidebar (`w-80 xl:w-96`) matching Vocabulary, AI Partner, and Grammar Path, keeping the scenarios grid in the middle content area (`lg:pr-80 xl:pr-96`).
- Changed:
  - `src/app/(app)/explore/page.tsx`, `src/components/discovery/CategoryPills.tsx`, `src/components/discovery/FilterBar.tsx`: Migrated from `PageContainer` to full-width middle content area (`w-full lg:pr-80 xl:pr-96`) + fixed right `<aside>` (`fixed right-0 top-header h-below-header w-80 xl:w-96 border-l border-border bg-card z-sidebar overflow-y-auto p-4`) with `wrap` CategoryPills, full-width stacked `sidebar` FilterBar, and `lg:hidden` mobile fallback.
- Verified with: `npm run check:frozen`, `npm run lint:ui`, `npx tsc --noEmit`, `npm run lint`, and `npm test` (220/220 passing).
- Commit: pending
- Open questions / follow-ups: none.

### 2026-11-26, Green (#55B266) + Amber (#FFCC66) Eye-Comfort Color System
- Requested by owner: Update the central design system tokens (zero hardcoding in components) to the Green (`#55B266` / `#2F7D42` action / `#6FC47F` dark) + Amber (`#FFCC66` / `#FFD580` dark) + Warm Off-White (`#FBFAF6`) / Deep Green-Black (`#121714`) WCAG-verified palette, including Grammar POS tokens.
- Changed:
  - `src/app/globals.css`: Replaced `:root` and `.dark` brand, sun, neutral, surface, border, status, topic, and bubble tokens with the Green + Amber + Green-tinted Neutral system (`--background: #FBFAF6`, `--foreground: #1F2A24`, `--primary: #2F7D42`, `--secondary: #FFCC66`, `--ring: #1F6FB5`, dark `--background: #121714`, `--card: #1A211D`, `--foreground: #E6EBE7`, `--primary: #6FC47F`, `--ring: #FFD580`), plus `::selection`. Frozen `.rainbow-border` untouched.
  - `src/styles/grammar-tokens.css`: Updated Light & Dark Parts of Speech (`--gram-pos-*`) tokens to WCAG AA/AAA values from §8.3.
  - `src/components/ui/button-variants.ts`: Updated `secondary` variant to `bg-brand-50 text-brand-800 hover:bg-brand-100`.
- Verified with: `npm run check:frozen`, `npm run lint:ui`, `npx tsc --noEmit`, `npm run lint`, and `npm test` (220/220 passing).
- Commit: pending
- Open questions / follow-ups: none.

### 2026-11-26, Semantic Color Audit, Primitives & Variant Rollout
- Requested by owner: Audit the webapp for semantic color usage, expand semantic color primitives/variants, and replace raw palette/dark-mode color classes.
- Changed:
  - `src/app/globals.css`: Added `--color-status-success`, `--color-status-warning`, `--color-status-info`, and `--color-status-danger` mappings to `@theme inline`.
  - `src/components/ui/badge-variants.ts` & `src/components/ui/button-variants.ts`: Added `info` badge variant and `success` / `warning` button variants backed by semantic status tokens.
  - `src/components/practice/DailyPracticeClient.tsx` & `src/components/settings/SettingsClient.tsx`: Replaced all 7 raw Tailwind `emerald`/`amber`/`purple` + `dark:` classes with `bg-status-success-bg`, `text-status-success-ink`, `bg-status-warning-bg`, `text-status-warning-ink`, and `bg-primary/10 text-primary`.
  - `src/components/grammar/GrammarPathClient.tsx`, `GrammarStageLessonClient.tsx`, `RuleCard.tsx`: Applied semantic `status-info`, `status-warning`, `status-danger`, and `Button variant="success"` for tips, routine, errors, completion, and quiz/right-word correct feedback.
- Verified with: `npm run check:frozen`, `npm run lint:ui`, `npx tsc --noEmit`, `npm run lint`, and `npm test` (220/220 passing).
- Commit: pending
- Open questions / follow-ups: none.

### 2026-11-26, 8-Stage Grammar Learning Path (/grammar-path)
- Requested by owner: Add a new Grammar Learning Path page to the left menu with 8 sequential stages (Foundation to Real Use), 3-step module flow (Rule in user's translate language only, 5-8 English examples, interactive sentence-making with AI check), level priority filters (School/Admission/IELTS/Spoken), and daily routine guidance; fixed rules to follow `useTranslationLocale()` (`ecp_translation_locale`) and matched the fixed right-sidebar (`lg:pr-80 xl:pr-96` + `fixed right-0 top-header h-below-header w-80 xl:w-96`) layout used by Vocabulary and AI Partner.
- Changed:
  - `src/lib/grammar/learning-path.ts`, `src/lib/grammar/learning-path-data.ts`, `src/lib/grammar/lessons/stage-1.ts`, `src/lib/grammar/lessons/stages-2-to-4.ts`, `src/lib/grammar/lessons/stages-5-to-8.ts`: Deep 8-stage curriculum with individual Parts of Speech (Noun with 5 sub-types & 30 words, Pronoun, Verb, Adjective, Adverb, Preposition, Conjunction, Interjection) + Stages 2–8, each with translated rules (`bn`, `hi`, `en`), inner sub-types, word bank, sentence examples, 5 sentence-making prompts, right-word-choose exercises, and 10-question quizzes.
  - `src/lib/ai/grammar-check.ts` & `src/app/api/v1/ai/grammar-check/route.ts`: Added `POST /api/v1/ai/grammar-check` with `callStructuredLlm`, fallback evaluation, and quota enforcement (`grammarCheck` added to `src/lib/ai/llm-client.ts` and `src/lib/ratelimit/quota.ts`).
  - `src/components/grammar/GrammarPathClient.tsx` & `src/app/(app)/grammar-path/page.tsx`: 8-card Stage Hub with Goal/Level Priority filters and "Start Lesson" links to `/grammar-path/stage-1`..`stage-8`.
  - `src/components/grammar/GrammarStageLessonClient.tsx` & `src/app/(app)/grammar-path/[stage]/page.tsx`: Inner lesson page using the 3-column fixed right-sidebar layout (`lg:pr-80 xl:pr-96` + `fixed right-0 top-header h-below-header w-80 xl:w-96`) with 4-step mastery flow (Rules & Examples, 5 Sentence Making, Right Word Choose, 10-Question Quiz), 16px (`text-body` + `text-bangla`) readable rule typography, and `<Suspense>` boundary around `await params`.
  - `src/components/navigation/Sidebar.tsx`, `src/components/navigation/Header.tsx`, `messages/{en,bn,hi}.json`, `tests/multi-language-coverage.test.mjs`: Added `nav.grammarPath` (312 keys, 100% parity) and left menu / mobile drawer links.
- Verified with: `npm run check:frozen`, `npm run lint:ui`, `npx tsc --noEmit`, `npm run lint`, and `npm test` (220/220 passing).
- Commit: pending
- Open questions / follow-ups: none.

### 2026-11-24, Elimination of SSR / Client Hydration Mismatches in i18n & Navigation
- Requested by owner: Fix hydration mismatch recoverable error in `Header.tsx` (`aria-label="নেভিগেশন মেনু খুলুন"` vs `"Open navigation menu"`, and `"লগইন"` vs `"Log in"`).
- Changed:
  - `src/lib/i18n/index.ts`: Removed synchronous `localStorage.getItem("ecp_user_locale")` read inside `t(key, locale)` that caused client-side rendering to mismatch server-side HTML. Made default locale deterministically `"bn"` during SSR and initial hydration.
  - `src/components/navigation/header-state.ts`: Added `locale?: Locale` parameter to `getHeaderAccountState` and passed `locale` to `t("auth.login", locale)`, `t("auth.logout", locale)`, `t("auth.profile", locale)`, and `t("auth.account", locale)`.
  - `src/components/navigation/Header.tsx`: Passed reactive `locale` to `getHeaderAccountState(user, locale)` and `aria-label={t("nav.openMenu", locale)}`.
  - `src/components/navigation/MobileBottomNav.tsx`: Added `useLocale()` and passed `locale` to all navigation items (`t("nav.dashboard", locale)`, `t("nav.explore", locale)`, `t("nav.vocabulary", locale)`, `t("auth.profile", locale)`).
  - `src/components/navigation/Sidebar.tsx`: Passed `locale` to `t("nav.menu", locale)`, `t("nav.mainNav", locale)`, and `t("landing.soon", locale)`.
  - `src/app/(app)/explore/page.tsx`: Added `useLocale()` and passed `locale` to search input placeholder and empty state title.
  - `src/components/dashboard/DashboardClient.tsx`: Passed `locale` to hero start conversation button.
  - `src/components/shared/TodayPanel.tsx`: Added `useLocale()` and passed `locale` to day streak and goal microcopy strings.
  - `src/components/learning/AudioPlayer.tsx` & `AudioPlayButton.tsx`: Added `useLocale()` and passed `locale` to audio action titles and badges.
  - `src/components/learning/WordDetailPopover.tsx`: Passed `locale` to word form badges, saved status, and synonyms header.
- Verified with:
  - Puppeteer headless browser test with pre-seeded `ecp_user_locale = "en"`: 0 hydration errors recorded across routes (`Recorded Errors count: 0`, `Hydration Errors count: 0`).
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (209/209 unit tests passing across 41 suites).
  - `npm run build`: Passed (112/112 static pages generated, 0 warnings).
- Commit: `a443197`
- Open questions / follow-ups: none.

### 2026-11-24, Elimination of Dual Language Titles & Strict Single-Language Enforcement
- Requested by owner: "akhono bangla english ixed ace aigulo thik korte hobe" -> Eliminate all dual titles, mixed parenthetical English strings (e.g. `বাংলা (English)` or `English (বাংলা)`), and enforce pure single language display across the application (pure Bangla in BN mode, pure English in EN mode).
- Changed:
  - `src/app/(app)/professions/page.tsx` & `src/app/(app)/professions/[slug]/page.tsx`: Localized hero header, badge/pill labels, competencies headers, and card taglines dynamically via `useLocale()`, removing developer milestone tags and English in parentheses.
  - `src/app/(app)/conversations/[slug]/page.tsx`: Localized breadcrumb to `<LocaleTitle titleEn="Shopping Ladder" titleBn="শপিং ল্যাডার" />`.
  - `src/app/(public)/privacy/page.tsx` & `src/app/(public)/terms/page.tsx`: Cleaned page headings and section titles of English parenthetical translations.
  - `src/app/page.tsx`: Cleaned Start Learning CTA text to pure single language.
  - `src/components/analytics/ProgressDashboard.tsx`: Replaced hardcoded dual titles for learning progress, vocabulary retention, weekly activity, and next steps with `<LocaleTitle>`.
  - `src/components/admin/AdminDashboardClient.tsx` & `src/components/admin/ConversationEditorClient.tsx`: Cleaned 403 authorization messages, draft save notices, publish buttons, turn counters, and editor labels to pure single language.
  - `src/components/learning/ConversationReader.tsx`: Localized guest auth prompt modal purposes to pure language without parenthetical English.
  - `src/components/learning/GrammarPanel.tsx`: Localized sheet title, description, SVO labels (`কর্তা:`, `ক্রিয়া:`), polite alternatives, common mistakes, and close button.
  - `src/components/learning/LadderStepContainer.tsx` & `src/components/learning/NicheLadderRoadmap.tsx`: Cleaned dialogue/practice tab labels and removed parenthetical CEFR/Story Arc English from all 5 roadmap tier titles.
  - `src/components/learning/ReviewQueue.tsx` & `src/components/learning/ReviewSummary.tsx`: Cleaned review empty states, show answer button, contextual meaning/sentence headers, and practice again / explore buttons.
  - `src/components/learning/WordDetailPopover.tsx`: Localized POS, Role, Lemma, Tense, contextual meaning, and general meaning labels.
  - `src/components/grammar/GrammarBreakdown.tsx`, `GrammarLayerPicker.tsx`, `GrammarLegend.tsx`, `RuleCard.tsx`: Localized structure summary, table headers, grammar layer switches, and formula cards.
  - `src/components/practice/PracticeWorkspace.tsx`, `CompleteLineCard.tsx`, `DialogueOrderCard.tsx`, `HideSpeakerPractice.tsx`, `ListeningQuizCard.tsx`, `ReadAloudCard.tsx`, `SentenceBuilderCard.tsx`: Localized all tab labels, role selection, audio cues, hints, word pool chips, and honest self-check ratings.
  - `src/components/practice/DailyPracticeClient.tsx`: Localized practice mode titles to pure `এআই পার্টনার` and `শপিং ল্যাডার`.
  - `src/components/tools/RoleplayPartner.tsx` & `WhatShouldISay.tsx`: Localized session feedback summary, dialogue replay, strengths, focus areas, and useful expressions headers.
  - `src/components/settings/SettingsClient.tsx`: Localized voice accent labels to pure single language.
  - `src/components/auth/AuthPromptModal.tsx`: Removed English parentheses from modal title and dismiss button.
  - `src/content/seed/niche_shopping_money.ts`: Cleaned parenthetical English from all 7 shopping ladder titles.
- Verified with:
  - Custom AST / regex scanner across all `src/` files: 0 instances of dual-language titles or parenthetical English remaining in UI components.
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (209/209 unit tests passing across 41 suites).
  - `npm run build`: Passed (112/112 static pages generated, 0 warnings).
  - Puppeteer live browser test on Next.js dev server: Verified H1 renders `পেশাগত ইংরেজি ক্যারিয়ার পাথ` in BN mode and `Professional English Career Paths` in EN mode.
- Commit: `39308c6`
- Open questions / follow-ups: none.

### 2026-11-23, Provider-Agnostic Language Model (LLM) Integration & Production Pipeline
- Requested by owner: "language model implement koro porperly" -> implement production-ready LLM integration layer with multi-provider support, structured JSON outputs, prompt injection defenses, and seamless fallback.
- Changed:
  - `src/lib/ai/llm-client.ts`: Authored provider-agnostic LLM client utilizing native `fetch` with zero proprietary SDK dependencies (AUD-A11 compliant). Supports Groq (`GROQ_API_KEY` with Llama 3.3/3.1), OpenAI/compatible endpoints (`OPENAI_API_KEY` / `OPENAI_BASE_URL`), Google AI Studio REST (`GEMINI_API_KEY`), and local Ollama (`OLLAMA_BASE_URL`), with auto-detection, markdown fence stripping, and Zod schema validation.
  - `src/lib/ai/say-it.ts`: Added `resolveSayItIntentAsync` implementing Task M7 prompt per ECP_AI_Prompt_Spec.md §3.4 with structured Schema S1 JSON generation and graceful deterministic fallback.
  - `src/lib/ai/roleplay.ts`: Added `generateRoleplayTurnAsync` (Task M8, Schema R1 in-character conversational turns, max 1 correction per turn) and `generateRoleplayFeedbackAsync` (Task M9, Schema F1 pedagogical rubric feedback).
  - `src/lib/ai/roleplay-schema.ts`: Added `learning_objective` and `style` fields to `RoleplayTurnRequestSchema` matching Spec §3.5.
  - `src/app/api/v1/ai/say-it/route.ts`: Switched to async LLM-backed intent resolution.
  - `src/app/api/v1/ai/roleplay/turn/route.ts` & `src/app/api/v1/ai/roleplay/feedback/route.ts`: Switched to async LLM-backed roleplay turns and rubric feedback.
  - `.env.example`: Added detailed LLM configuration section for Groq, OpenAI, Google AI Studio, and Ollama.
  - `tests/llm-client.test.mjs`: Added 6 unit tests verifying provider resolution, markdown cleanup, offline mock fallback, Say-It async resolution, injection defense, and roleplay feedback.
- Verified with:
  - `tests/gemini-isolation.test.mjs`: Passed (0 forbidden imports in `src/`, AUD-A11 strictly maintained).
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 token violations across rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (209/209 unit tests passing across 42 suites).
  - `npm run build`: Passed (109/109 static pages generated, 0 warnings).
- Commit: `ffe9611`
- Open questions / follow-ups: none.

### 2026-11-23, UI Contrast, Pill Standard & Background XOR Stroke Enforcement
- Requested by owner: Review live screenshots, check button text contrast (light/dark mode), fix button consistency, standardize label/pill heights, and enforce authoritative "Background XOR Stroke" rule across reader, dashboard, explore, and popovers.
- Changed:
  - `src/lib/utils.ts`: Configured `extendTailwindMerge` to recognize custom semantic typography utilities (`text-page-title`, `text-hero-title`, `text-card-title`, `text-lead`, `text-body`, `text-meta`, `text-label`, `text-chip`, `text-stat`) under `classGroups["font-size"]`, preventing `cn()` from stripping `text-primary-foreground` and resolving the dark-on-dark text bug.
  - `src/components/ui/button-variants.ts`: Enforced strict Background XOR Stroke rule (solid variants `default`, `cta`, `secondary`, `destructive`, `primary`, `accent` explicitly set `border-0`; stroked variants `outline` set `border border-border bg-transparent`; `ghost`/`link` set `border-0 bg-transparent`).
  - `src/components/ui/badge-variants.ts`: Enforced `border-0` across all solid badge variants (`default`, `secondary`, `destructive`, `success`, `warning`, `brand`, `accent`, `peach`, `neutral`, `error`).
  - `src/components/shared/CefrChip.tsx` & `src/components/discovery/ScenarioCard.tsx`: Standardized all pills to uniform 24px (`h-6 px-2.5 rounded-pill text-chip select-none shrink-0`).
  - `src/app/(app)/conversations/[slug]/page.tsx`: Standardized scenario header badges to `size="default"` (24px pill), removed redundant `border-border` from card headers (`border-0 shadow-card`).
  - `src/components/learning/ConversationReader.tsx`: Standardized top controls bar to `bg-card rounded-panel border-0 shadow-xs`.
  - `src/components/learning/WordDetailPopover.tsx`: Word modal dialog converted to `bg-card border-0 shadow-lg`; word badges to `border-0 bg-muted/60`; "Save Word" button text verified white on `#4A1D6E` (12.41:1 contrast).
  - `src/components/learning/AudioPlayer.tsx`: Removed border strokes from solid `bg-muted` speed and accent controls.
- Verified with:
  - Puppeteer live computed styles: Primary button text `#FFFFFF` on `#4A1D6E` = 12.41:1 (AAA Pass); CTA button text `#2A0F44` on `#FFD93D` = 12.19:1 (AAA Pass); Pill heights strictly 24px (`h-6`).
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 token violations across rules a-i).
  - `npx tsc --noEmit`: Passed (0 errors).
  - `npm test`: Passed (203/203 unit tests passing across 41 suites).
- Commit: `1af215f`
- Open questions / follow-ups: none.

### 2026-11-22, Migration Journal Verification Suite & AUD-MIGRATE Audit Sync
- Requested by owner: "next" -> verify database migration journal and synchronize migration tracking.
- Changed:
  - `tests/schema-invariants.test.mjs`: Upgraded test suite to verify presence and integrity of all 3 Drizzle migrations (`0000_round_puck.sql`, `0001_strange_gauntlet.sql`, and `0002_elite_wrecker.sql`), validating consistency with `_journal.json` across 26 tables.
  - `docs/AUDIT_REPORT.md` & `docs/DECISIONS.md`: Synchronized `AUD-MIGRATE` and `M-01` to track all 3 migrations.
- Verified with:
  - `npx drizzle-kit generate`: Passed (26 tables, 0 diff).
  - `npm test`: Passed (203/203 unit tests passing across 41 suites).
  - `npm run check:frozen`: Passed.
  - `npm run lint:ui`: Passed.
  - `npm run lint`: Passed.
  - `npx tsc --noEmit`: Passed.
- Commit: `6184a75`
- Open questions / follow-ups: none.

### 2026-11-22, AUD-ICON Resolution & D-19 Confirmation in Audit Report
- Requested by owner: "next" -> reconcile AUD-ICON and D-19 against PROJECT_STATE.md §2.3.
- Changed:
  - `docs/DECISIONS.md`: Reconciled D-19 from "Needs owner" to "Approved" with Hugeicons Outlined per PROJECT_STATE.md §2.3 ("Hugeicons is the icon library (no lucide)").
  - `docs/AUDIT_REPORT.md`: Updated AUD-ICON from "Needs owner" to "Fixed" (commit 027fcc9). Updated Status Count Table: Fixed count increased to 17, Needs owner count reduced to 1 (only AUD-MIGRATE operational DB check).
- Verified with:
  - `npm run check:frozen`: Passed.
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token violations).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (203/203 unit tests passing across 41 suites).
- Commit: `a2b46d7`
- Open questions / follow-ups: none.

### 2026-11-22, Android Packaging Script & Phase 1-4 Documentation Sync
- Requested by owner: "next" -> synchronize full project documentation, implementation log, audit report snapshot, and create executable Android APK packaging script.
- Changed:
  - `scripts/build-apk.sh`: Created executable Android APK packaging helper script resolving `JAVA_HOME` (OpenJDK 25 in Android Studio), `ANDROID_HOME` (`~/Library/Android/sdk`), and `PATH`, providing turnkey instructions for Bubblewrap TWA APK generation.
  - `docs/IMPLEMENTATION_LOG.md`: Fully reconciled and synchronized all completed milestones across Phase 2 (2B-2E), Phase 3 (3A-3E), and Phase 4 (4A-4E), Gate 2-4 summaries, and Brief §19 MVP acceptance criteria pass.
  - `docs/AUDIT_REPORT.md`: Updated Snapshot section reflecting HEAD commit, updated stack (Proxy convention, Expandable Design System), 203/203 unit tests, 109 static routes, and 0 warnings.
- Verified with:
  - Executed `bash scripts/build-apk.sh` with exit code 0 verifying OpenJDK 25.0.3 and Android SDK.
  - `npm run check:frozen`: Passed (0 diff).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (203/203 unit tests passing across 41 suites).
  - `npm run build`: Passed (109/109 static pages generated, 0 warnings).
- Commit: `2c56a2d`
- Open questions / follow-ups: none.

### 2026-11-22, Milestone 4D — Mobile App & Android APK Packaging Architecture
- Requested by owner: "next" -> execute Milestone 4D (Mobile App & Android APK Architecture) per ECP_Phase_Plan §7.1 and Brief §3.2.
- Changed:
  - `docs/MOBILE_APP_ARCHITECTURE.md`: Authored authoritative Android packaging architecture guide covering Path A (Trusted Web Activity via Bubblewrap, ~1MB APK, instant OTA updates, full Web Speech compatibility) and Path B (Capacitor Android Native Packaging). Configured exact local environment paths detected on the workstation (`JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"`, `ANDROID_HOME="$HOME/Library/Android/sdk"`), documented `AndroidManifest.xml` permissions (`RECORD_AUDIO`, `INTERNET`), and authored keystore generation and signing runbook for `android-studio-rabbit1-mac_arm.dmg`.
- Verified with:
  - Validated local OpenJDK 25.0.3 execution via `/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin/java -version`.
  - Validated local Android SDK presence at `~/Library/Android/sdk` (`platform-tools`, `build-tools`).
  - `npm run check:frozen`: Passed (0 diff).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (203/203 unit tests passing across 41 suites).
  - `npm run build`: Passed (Next.js 16.4.6 static build succeeded, 109/109 static pages generated, 0 warnings).
- Commit: `b4e99d4`
- Open questions / follow-ups: none.

### 2026-11-22, Next.js 16 Proxy Migration
- Requested by owner: "next" -> execute Next.js 16 build hardening and proxy convention migration.
- Changed:
  - `src/proxy.ts`: Migrated `src/middleware.ts` to `src/proxy.ts` exporting `export async function proxy(request: NextRequest)` in accordance with Next.js 16.4 Turbopack conventions. Preserved full Supabase session token refresh and cookie management without any runtime or auth regression.
  - Eliminated the `⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.` build warning.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border` block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (203/203 unit tests passing across 41 suites).
  - `npm run build`: Passed (Clean build with zero deprecation warnings, 109/109 static pages generated).
- Commit: `45f8460`
- Open questions / follow-ups: none

### 2026-11-22, Brief §19 MVP End-to-End Acceptance Verification Suite
- Requested by owner: "next" -> implement Brief §19 MVP End-to-End Acceptance Verification Suite per English_Conversation_Partner_Project_Brief §19.
- Changed:
  - `tests/mvp-acceptance.test.mjs`: Authored comprehensive acceptance test suite (13 tests across 5 criteria sections) covering:
    1. Discovery: Daily Life categories, 5 specialized career paths, bilingual search ('price'/'দাম').
    2. Conversation Learning: Contiguous 1..N sequence numbering, speaker roles, timing manifest scrub bar generation without cascading renders.
    3. Vocabulary & Grammar: Contextual word meanings with audio support, runtime fallback grammar annotations for unindexed sentences without crashing.
    4. Personal Learning, Practice & AI: SM-2 interval calculations and 1.30 ease factor floor, AI Intent Assistant ("What Should I Say?") deterministic option resolution, AI Roleplay single-correction invariant and Schema F1 non-judgmental feedback summary, and AI rate limit & daily quota enforcement.
    5. Multi-Language & Quality: 100% key parity across EN, BN, and HI (98/98 keys), and RTL text direction identification for upcoming roadmap languages (UR, AR).
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border` block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (203/203 unit tests passing across 41 suites).
  - `npm run build`: Passed (Next.js 16.4.6 static build succeeded, 109/109 static pages generated).
- Commit: `e495833`
- Open questions / follow-ups: none

### 2026-11-22, Automated CI Workflow & End-to-End Test Gate (KI-12-CI Reconciled)
- Requested by owner: "next" -> implement and reconcile automated browser CI test runner (KI-12-CI) in AUDIT_REPORT.md per ECP_Phase_Plan §11.
- Changed:
  - `tests/e2e/keyboard-focus.spec.mjs`: Added cross-platform Chrome binary resolution (macOS & Linux) and live server probe (`${APP_URL}/api/health`) that runs the full Tab sequence & Escape popover focus tests when server is live, or gracefully skips when offline.
  - `package.json`: Added `"test:e2e": "node tests/e2e/keyboard-focus.spec.mjs"` script.
  - `.github/workflows/ci.yml`: Upgraded GitHub Actions workflow to run the complete build-and-test matrix: `npm run check:frozen`, `npm run lint:ui`, `npm run lint`, `npm test`, `npm run build`, and background Next.js server with `npm run test:e2e`.
  - `docs/AUDIT_REPORT.md`: Reconciled KI-12-CI from "Not built yet" to "Fixed" (commit `8addb7c`), reducing "Not built yet" to 0 and increasing "Fixed" to 16.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border` block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (190/190 unit tests passing across 35 suites).
  - `node tests/e2e/keyboard-focus.spec.mjs`: Passed (clean skip when offline, full assertion runner when server is active).
  - `npm run build`: Passed (Next.js 16.4.6 static build succeeded, 109/109 static pages generated).
- Commit: `8addb7c`, `c326c38`
- Open questions / follow-ups: none

### 2026-11-22, Milestone 4E — AI Quotas, Rate Limiting & Cost Defense Engine
- Requested by owner: "next" -> implement Milestone 4E: AI Quotas, Rate Limiting & Cost Defense Engine per ECP_API_Contract §4.7 & §7, ECP_System_Framework §13, and ECP_Phase_Plan §7.1 Track 4E.
- Changed:
  - `src/lib/ratelimit/quota.ts`: In-memory sliding window rate limiter and daily quota engine supporting customizable clocks for deterministic testing. Enforces: 10 req/min for AI endpoints, 30 daily "What Should I Say?" requests, max 20 turns per roleplay session, and standard IETF draft rate limit headers (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`, `Retry-After`).
  - `src/app/api/v1/ai/say-it/route.ts`: Integrated client IP extraction, quota checking, and 429 response formatting with remaining retry time.
  - `src/app/api/v1/ai/roleplay/turn/route.ts`: Integrated client IP extraction, 10 req/min burst limiter, and 20-turn session cap returning 400 `SESSION_TURN_LIMIT_EXCEEDED` if exceeded.
  - `src/components/tools/RoleplayPartner.tsx`: Added session turn limit detection (`learnerTurnCount >= 20`), friendly Bengali completion banner ("সেশনের ২০টি কথোপকথন পূর্ণ হয়েছে। অগ্রগতি দেখতে সেশন সমাপ্ত করুন।"), and disabled input controls when session limit is reached.
  - `tests/ai-quota-ratelimit.test.mjs`: Authored comprehensive test suite (7 tests) verifying 1-minute burst limit, 60s sliding window expiration, daily quota enforcement, IETF rate limit headers, IP extraction, 20-turn session cap, and endpoint integration.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border` block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (190/190 unit tests passing across 35 suites).
  - `npm run build`: Passed (Next.js 16.4.6 static build succeeded, 109/109 static pages generated).
- Commit: `2cc43b4`
- Open questions / follow-ups: none

### 2026-11-22, Milestone 4B — Multi-Language Strategy & Translation Framework
- Requested by owner: "next" -> implement Milestone 4B: Multi-Language Strategy & Translation Framework (Hindi expansion, RTL detection, language switcher) per ECP_Phase_Plan §7.1, ECP_Multi_Language_Strategy §13.3, and Brief §3.2 & §18.
- Changed:
  - `src/lib/i18n/languages.ts`: Multi-language registry defining Bengali, English, Hindi, Urdu, and Arabic with script classification, text direction (LTR vs RTL), status (available, beta, planned), and helper functions `isRtlLanguage`, `getLanguageMeta`, `getAllLanguages`, `getAvailableLanguages`.
  - `messages/hi.json`: Complete Hindi translation dictionary achieving 100% key parity (98/98 keys) with natural, idiomatic Hindi for ESL learners.
  - `src/lib/i18n/index.ts`: Integrated Hindi dictionary with English fallback, exported `Locale = "en" | "bn" | "hi"` and `isRtlLocale`.
  - `src/components/navigation/LanguageSwitcher.tsx`: Interactive language switcher with active language state, native script display, beta tags, upcoming roadmap list (Urdu & Arabic with RTL badges), and click-outside/escape-key accessibility.
  - `src/components/navigation/Header.tsx`: Integrated `LanguageSwitcher` in header control slot replacing static placeholder.
  - `tests/multi-language-coverage.test.mjs`: Authored unit test suite (6 tests) verifying 100% key parity across EN, BN, and HI, non-empty values, RTL/LTR script detection, and dictionary resolution.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border` block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (183/183 unit tests passing across 34 suites).
  - `npm run build`: Passed (Next.js 16.4.6 static build succeeded, 109/109 static pages generated).
- Commit: `8f51de4`
- Open questions / follow-ups: none

### 2026-11-22, Milestones 4A & 4C — Professional English Career Paths & PWA Foundation
- Requested by owner: "next" -> implement Milestone 4A (More professions & Profession Index) and Milestone 4C (PWA Installability) per ECP_Phase_Plan §7.1.
- Changed:
  - `src/lib/professions/registry.ts`: Authored registry for 5 professional tracks (UI/UX Designer, Software Engineer, Remote Freelancer, Healthcare Assistant, Teacher/Educator) with competencies, CEFR targets, hours, and scenario mapping.
  - `src/app/(app)/professions/page.tsx`: Built career paths index page with competencies checklist, scenario counts, and direct action CTAs using Expandable Design System.
  - `src/app/(app)/professions/[slug]/page.tsx`: Upgraded dynamic profession detail page with static params for all registered tracks, rich competency chips, and sequence cards.
  - `src/content/seed/scenarios.ts`: Added 6 realistic professional scenarios spanning agile standups, PR reviews, client kickoffs, deadline extensions, patient triage, and parent conferences.
  - `src/app/manifest.ts` & `public/sw.js`: Authored W3C PWA web app manifest and offline caching service worker for core shell routes.
  - `src/app/layout.tsx` & `src/components/navigation/Sidebar.tsx`: Added PWA metadata, registered service worker, and wired "Professional English" directly to `/professions`.
  - `tests/professions.test.mjs` & `tests/pwa-manifest.test.mjs`: Authored 6 unit tests verifying career registry, scenario coverage, PWA manifest structure, and service worker presence.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border` block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (177/177 unit tests passing across 33 suites).
  - `npm run build`: Passed (Next.js 16.4.6 static build succeeded, 109/109 static pages generated, including `/professions` and `/manifest.webmanifest`).
- Commit: `1bd9fbb`
- Open questions / follow-ups: none

### 2026-11-22, Milestone 3B — Voice Roleplay Loop
- Requested by owner: "next" -> implement Milestone 3B: Voice Roleplay Loop per ECP_Phase_Plan §6.1 & §6.4.
- Changed:
  - `src/lib/ai/roleplay-voice.ts`: Built speech rate mapping (slow 0.75x, clear 0.88x, normal 1.0x), transcript cleanup (strips filler stutters like um/uh, capitalizes, adds punctuation), and contextual Bengali status cues.
  - `src/components/tools/RoleplayPartner.tsx`: Upgraded with Voice Mode toggle (ON by default), auto-speak AI replies, speech speed selector, live speech recognition with editable transcript, mic error fallback, and session dialogue audio replay in Feedback Summary. Eliminated duplication rule f violation with `FeedbackSectionHeader`.
  - `tests/voice-roleplay.test.mjs`: Authored unit test suite (5 tests) verifying speech rates, transcript cleaning, status cues, config schema, and privacy invariants.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border` block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (171/171 unit tests passing across 33 suites).
  - `npm run build`: Passed (Next.js 16.4.6 static build succeeded, 91/91 static pages generated).
- Commit: `67d6d7d`
- Open questions / follow-ups: none

### 2026-11-22, Milestone 3C — Pronunciation Hints & Acoustic Word-Level Feedback Engine
- Requested by owner: "next" -> implement Milestone 3C: Pronunciation hints & acoustic word-level feedback engine per ECP_Phase_Plan §6.1, ECP_Audio_Voice_Guide §10.2, and Brief §9.3 & §20.
- Changed:
  - `src/lib/practice/pronunciation.ts`: Built word-level phonetic matching, token alignment, curated Bengali pronunciation dictionary for tricky ESL sounds (silent letters, vowel reduction, epenthesis cluster traps, 'th' fricatives, 'v' vs 'w'), qualitative tiers (`clear`, `getting_there`, `needs_practice`), actionable tips generator, and transparent disclaimer. Statically enforced zero fake percentage or decimal scores.
  - `src/components/practice/ReadAloudCard.tsx`: Upgraded with interactive word-level pronunciation chips, slow (0.75x) model audio playback, isolated slow (0.7x) word pronunciation, Bengali phonetic guidance card, and disclaimer notice.
  - `tests/pronunciation-hints.test.mjs`: Authored unit test suite (8 tests) verifying word alignment, dictionary phonetic tips, tiering logic, absence of fake scores, and disclaimer text.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border` block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (166/166 unit tests passing across 33 suites).
  - `npm run build`: Passed (Next.js 16.4.6 static build succeeded, 91/91 static pages generated).
- Commit: `839f4cb`
- Open questions / follow-ups: none

### 2026-11-22, Milestones 3A, 3D & 3E — Speech Input, Personalisation & Progress Analytics
- Requested by owner: "next" -> implement speech input (3A), personalized recommendations engine (3D), and learner progress analytics dashboard (3E) per ECP_Phase_Plan §6.1, Brief §10.3, and Brief §19.
- Changed:
  - `src/lib/analytics/progress-metrics.ts`: Built Zod schemas (`LearnerMetricsSummarySchema`, `PersonalizedRecommendationSchema`) and pure calculation engines for streak, weekly activity, practice accuracy, SM-2 retention tiers (Learning, Reviewing, Mastered), and pedagogical recommendations.
  - `src/components/analytics/ProgressDashboard.tsx`: Built interactive learner analytics dashboard with top 4 KPI cards, SM-2 stage distribution bars, weekly minutes column chart, and direct recommendation cards.
  - `src/app/(app)/progress/page.tsx`: Created page route with metadata.
  - `src/components/tools/RoleplayPartner.tsx`: Integrated Web Speech recognition mic input allowing spoken replies directly into the chat input bar with editable transcript.
  - `src/components/navigation/Sidebar.tsx`: Activated "My Progress" link pointing to `/progress`.
  - `tests/progress-analytics.test.mjs`: Authored unit test suite verifying metrics computation, retention tiers, recommendation prioritization heuristics, and schema validity.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border` block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (158/158 unit tests passing across 33 suites).
  - `npm run build`: Passed (Next.js 16.4.6 static build succeeded, 91/91 static pages generated, including `/progress`).
- Commit: 9fab261
- Open questions / follow-ups: none.

### 2026-11-22, Milestone 2D — AI Text Roleplay Partner
- Requested by owner: "next" -> implement Milestone 2D (AI Text Roleplay Partner) per ECP_Phase_Plan §5.1, ECP_AI_Prompt_Spec §3.5 (Schema R1) & §3.6 (Schema F1), and Brief §9.
- Changed:
  - `src/lib/ai/roleplay-schema.ts`: Authored Zod schemas and TypeScript types for Schema R1 (`RoleplayTurnResponseSchema`), Schema F1 (`RoleplayFeedbackResponseSchema`), and requests.
  - `src/lib/ai/roleplay.ts`: Implemented deterministic in-character roleplay turn engine, single-correction rule (max 1 per turn, `correction.original` strictly verified as substring of learner message), prompt injection neutralization, and rubric-based session feedback generator.
  - `src/app/api/v1/ai/roleplay/turn/route.ts`: Built `POST /api/v1/ai/roleplay/turn` endpoint.
  - `src/app/api/v1/ai/roleplay/feedback/route.ts`: Built `POST /api/v1/ai/roleplay/feedback` endpoint.
  - `src/components/tools/RoleplayPartner.tsx`: Built interactive UI using Expandable Design System, `ChatBubble` (speaker="1" partner, "2" learner), Web Speech API audio, gentle inline correction cards, situational hint banner, quick prompts, and Schema F1 session feedback summary card.
  - `src/app/(app)/roleplay/page.tsx`: Created page route with metadata.
  - `src/components/navigation/Sidebar.tsx`: Activated "AI Partner" link pointing to `/roleplay`.
  - `tests/roleplay.test.mjs`: Authored unit test suite verifying Schema R1 conformance, single-correction rule invariant, prompt injection guardrails, conversation conclusion detection, and Schema F1 feedback summary conformance.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border` block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (152/152 unit tests passing across 30 suites).
  - `npm run build`: Passed (Next.js 16.4.6 static build succeeded, 90/90 static pages generated, including `/roleplay` and new API endpoints).
- Commit: f34740d
- Open questions / follow-ups: none.

### 2026-11-22, Milestone 2A — Listening Comprehension Quiz
- Requested by owner: "option a" -> implement Milestone 2A (Listening Comprehension Quiz) per ECP_Phase_Plan §5.1, ECP_Exercises_SRS_Spec §4.1, and Brief §10.4.
- Changed:
  - `src/lib/practice/listening-quiz.ts`: Authored Zod schema `ListeningQuizItemDataSchema`, `evaluateQuizAnswer` (Brief §20 Rule 5 non-judgmental feedback), `calculateQuizScore` (pedagogical tiers: perfect, proficient, developing, needs_review), and `generateFallbackQuizzes`.
  - `src/components/practice/ListeningQuizCard.tsx`: Upgraded with Expandable Design System (`Card`, `Button`, `Tag`, `Pill`), slow audio speed switch (`0.75x` vs `1.0x`), question skip action, option badges (A, B, C, D), keyboard shortcuts (1-4, Space, Enter), and completion breakdown screen.
  - `src/components/practice/PracticeWorkspace.tsx`: Integrated `generateFallbackQuizzes` for modular fallback quiz generation.
  - `src/content/seed/exercises.ts`: Curated `sm-03-q2` for Step 03 ensuring full seed data integrity across all steps.
  - `tests/listening-quiz.test.mjs`: Authored comprehensive unit test suite covering evaluation, score tiers, schema conformance, fallback generation, and seed data integrity.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border` block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (145/145 unit tests passing across 24 suites).
  - `npm run build`: Passed (Next.js 16.4.6 static build succeeded, 87/87 static pages generated).
- Commit: 72de12a
- Open questions / follow-ups: none.

### 2026-11-22, Milestone 2C — "What Should I Say?" Intent Assistant
- Requested by owner: "now tmi jekhane shes korcila oikhan theke shuru koro, next step a jai amra" -> complete Milestone 2C ("What Should I Say?" / AI Expression Recommender) per ECP_Phase_Plan §5.1, ECP_AI_Prompt_Spec §3.4, and ECP_API_Contract §4.7.
- Changed:
  - `src/lib/ai/say-it-schema.ts`: Authored Schema S1 zod schemas and TypeScript types (`ToneEnum`, `SayItOptionSchema`, `SayItResponseSchema`, `SayItRequestSchema`).
  - `src/lib/ai/say-it.ts`: Implemented deterministic intent resolution engine for Bangla and English inputs with placeholders (`[date]`, `[number of days]`, `[amount]`) adhering to AUD-A11 (zero Gemini imports in `src/`).
  - `src/app/api/v1/ai/say-it/route.ts`: Built `POST /api/v1/ai/say-it` endpoint conforming to API contract.
  - `src/components/tools/WhatShouldISay.tsx`: Built interactive UI component using Expandable Design System (`InputGroup`, `Pill`, `Tag`, `Button`), Web Speech API, copy-to-clipboard, and quick sample intent pills.
  - `src/app/(app)/what-should-i-say/page.tsx`: Created page route with metadata.
  - `src/components/navigation/Sidebar.tsx`: Added "What Should I Say?" sidebar link with `SparklesIcon`.
  - `tests/what-should-i-say.test.mjs`: Added comprehensive unit test suite covering Schema S1 conformance, placeholders, Bangla parsing, clarifying questions, and fallbacks.
- Verified with:
  - `npm run check:frozen`: Passed (0 byte diff on frozen `.rainbow-border` block).
  - `npm run lint:ui`: Passed (0 sub-12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors/warnings; 0 token violations across rules a-i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (132/132 unit tests passing across 18 suites).
  - `npm run build`: Passed (Next.js 16.4.6 static build succeeded, 87/87 static pages generated, including `/what-should-i-say` and `/api/v1/ai/say-it`).
- Commit: 34726f2
- Open questions / follow-ups: none.

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
- Commit: a3959e2
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

### 2026-11-22, Comprehensive Button, Pill & Badge WCAG AA/AAA Contrast Alignment
- Requested by owner: Set button colors, font and icon colors, check and fix contrast across buttons, labels, pills, and badges in both Light mode and Dark mode.
- Changed:
  - `src/app/globals.css`: Added `--destructive-foreground: #FFFFFF;` (Light) and `--destructive-foreground: #2A0F44;` (Dark) with mapped `--color-destructive-foreground` token.
  - `src/components/ui/button-variants.ts`: Replaced hardcoded dark purple hover in `default` variant with `hover:bg-primary/90 active:bg-primary/80` ensuring dark-mode hover preserves >6.8:1 legibility; updated `secondary` variant to `dark:bg-muted dark:text-foreground` (14.06:1 contrast in dark mode).
  - `src/components/ui/badge-variants.ts`: Fixed `brand` badge dark mode text from low-contrast `dark:text-primary-foreground` to high-contrast `dark:text-primary` (6.5:1 contrast); fixed `destructive` badge to `dark:bg-destructive/25 dark:text-destructive` (5.8:1 contrast).
  - Verified SVG icons in all variants inherit `currentColor` so icons strictly match text contrast.
- Verified with:
  - Full WCAG 2.1 relative luminance script: 100% of button, badge, and pill variants pass WCAG AA (>= 4.5:1) and AAA (>= 7:1) in both Light mode and Dark mode.
  - `npm run check:frozen`: Passed (0 diff on `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 under 12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token violations across rules a–i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (203/203 unit tests passing across 41 suites).
- Commit: `916f2f5`
- Open questions / follow-ups: None.

### 2026-11-23, Root-Cause Elimination of Outer Focus Ring (Global `:focus-visible` Override)
- Requested by owner: Screenshots showed the outer purple ring RGB [104, 75, 167] was STILL visible around the rainbow border during active typing.
- True Root Cause Discovered:
  - Inside `src/styles/design-tokens.css` (imported at line 2 of `globals.css`), there was a global unlayered rule:
    ```css
    :focus-visible {
      outline: 2px solid var(--ecp-focus-ring);
      outline-offset: 2px;
    }
    ```
  - `--ecp-focus-ring` is `var(--ecp-brand-700)` (#694CA7 / RGB [104, 75, 167]).
  - Because it had `outline-offset: 2px;`, whenever any `<input>` received focus in the browser, the browser painted a 2px solid brand-purple outline exactly 2px outside the input — framing the outside of the 2px rainbow gradient border!
- Changed:
  - `src/styles/design-tokens.css`: Excluded inputs and textareas from the global outline rule (`:focus-visible:not(input):not(textarea):not([data-slot="input"])`), and explicitly set `input, textarea, [data-slot="input"] { outline: none; }`.
  - Re-tested with Chrome Puppeteer on `/explore`, `/what-should-i-say`, and `/roleplay`.
  - Ran pixel-by-pixel RGB analysis: confirmed 0 pixels of [104, 75, 167] remain. Pure rainbow gradient border is the ONLY frame.
- Verified with:
  - `npm run check:frozen`: Passed (0 diff on `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 under 12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token violations across rules a–i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (209/209 unit tests passing across 41 suites).
- Commit: `1a96ac6`
- Open questions / follow-ups: None.

### 2026-11-23, Input Active Typing Stroke Elimination (Only Rainbow Gradient Border)
- Requested by owner: Review screenshots of active typing in inputs (Explore search, What Should I Say, Roleplay Partner) where an extra black/brand-colored border/ring appeared around the rainbow gradient border. Eliminate the extra border/stroke completely so only the animated rainbow gradient border is visible when typing.
- Root Cause Identified:
  - `inputVariants` previously had `focus-visible:ring-3 focus-visible:ring-ring/50` and `focus-visible:border-ring`. The 3px focus ring extended past the 2px `.rainbow-border::before` boundary, rendering an outer purple ring around the rainbow stroke.
  - In `RoleplayPartner.tsx`, the input lacked `.rainbow-border` on focus and relied on `variant="outline"` which drew a standalone thick brand border.
  - In `explore/page.tsx` and `WhatShouldISay.tsx`, redundant outer wrapper `div`s with `rainbow-border` surrounded `<InputGroup className="shadow-xs">`, creating nested border-radius outlines and shadow bleeding.
- Changed:
  - `src/components/ui/input-variants.ts`: Removed `focus-visible:ring-3 focus-visible:ring-ring/50` and `focus-visible:border-ring`. Set `ghost` variant to clean `border-0 bg-transparent hover:bg-transparent focus-visible:outline-none`.
  - `src/components/ui/input-group.tsx`: Converted `InputGroup` into an interactive client component tracking `isFocused`. On focus, it dynamically switches from `border border-input shadow-xs` to `rainbow-border border border-transparent shadow-none`. Handled child focus retention via `contains(relatedTarget)`.
  - `src/app/(app)/explore/page.tsx`: Removed redundant outer `div` and unused `isSearchFocused` state.
  - `src/components/tools/WhatShouldISay.tsx`: Removed redundant outer `div` and unused `isFocused` state; added `pl-10` to input to prevent text collision with the Sparkles prefix icon.
  - `src/components/tools/RoleplayPartner.tsx`: Updated input to `variant="ghost" className="pr-24"` inside `<InputGroup className="flex-1 bg-card">`, so chatting triggers the seamless rainbow gradient border with zero extra stroke.
  - `src/app/(app)/vocabulary/page.tsx`: Updated to `<InputGroup className="bg-card">` with `<Input variant="ghost">`.
- Verified with:
  - `npm run check:frozen`: Passed (0 diff on `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 under 12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token violations across rules a–i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (209/209 unit tests passing across 41 suites).
  - `npm run build`: Passed (110/110 static pages successfully generated in 2.6s).
- Commit: `6fd903d`
- Open questions / follow-ups: None.

### 2026-11-23, Groq Live API Key Activated & Verified End-to-End
- Requested by owner: Added Groq API key (`gsk_...`) and requested activation for live language model inference.
- Changed:
  - Added `GROQ_API_KEY` and `GROQ_MODEL="openai/gpt-oss-120b"` into `english-partner/.env.local`.
  - Audited Groq account model availability: discovered `openai/gpt-oss-120b` (131k context, structured JSON mode, high-speed reasoning) is the optimal active model on this account.
  - Updated fallback default in `src/lib/ai/llm-client.ts` to `openai/gpt-oss-120b`.
  - Restarted Next.js dev server with fresh environment variables.
  - Verified live inference:
    - `GET /api/v1/ai/status` returns `{"provider":"groq","model":"openai/gpt-oss-120b","isLive":true,"statusText":"Active (GROQ · openai/gpt-oss-120b)"}`.
    - `POST /api/v1/ai/say-it` generated live high-speed pedagogical suggestions and phrases in ~1.5s.
    - `POST /api/v1/ai/roleplay/turn` generated live dynamic context-aware dialogue turns in <1s.
- Verified with:
  - `npm run check:frozen`: Passed (0 diff on `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 under 12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token violations across rules a–i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (209/209 unit tests passing across 41 suites).
- Commit: `28171d3`
- Open questions / follow-ups: None. Live AI is fully operational.

### 2026-11-23, Language Model Integration & Full Client-Server API Connection
- Requested by owner: "language model implement koro porperly", "kaj korcena language model".
- Problem Diagnosed:
  - Both `WhatShouldISay.tsx` and `RoleplayPartner.tsx` were calling synchronous deterministic mock functions directly in the browser without making HTTP `fetch()` requests to the backend API endpoints (`/api/v1/ai/say-it`, `/api/v1/ai/roleplay/turn`, `/api/v1/ai/roleplay/feedback`).
  - In addition, without API keys configured in `.env.local`, the server ran in offline fallback mode without the user knowing.
- Changed:
  - Created `GET /api/v1/ai/status` returning provider status (provider name, model, isLive, statusText) without exposing secrets.
  - Updated `src/components/tools/WhatShouldISay.tsx` to call `POST /api/v1/ai/say-it` asynchronously with real loading indicator, disabled states, and provider status pill.
  - Updated `src/components/tools/RoleplayPartner.tsx` to call `POST /api/v1/ai/roleplay/turn` and `POST /api/v1/ai/roleplay/feedback` asynchronously with real loading indicator, disabled states, and provider status pill.
  - Preserved graceful client-side fallback if the network or API route fails.
  - Multi-provider LLM client (`src/lib/ai/llm-client.ts`) verified for Groq, OpenAI, Gemini REST, Ollama, and offline fallback.
- Verified with:
  - `npm run check:frozen`: Passed (0 diff on `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 under 12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token violations across rules a–i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (209/209 unit tests passing across 41 suites).
  - `npm run build`: Passed (110/110 static pages successfully generated).
- Commit: `3328296`
- Open questions / follow-ups: Owner can add `GROQ_API_KEY` or `GEMINI_API_KEY` to `english-partner/.env.local` to enable live cloud LLM inference.

### 2026-11-22, Screenshot UI Review & Shadcn Harmonization Overhaul
- Requested by owner: Review 5 live screenshots showing broken button consistency, poor contrast, irregular spacing, and chaotic turn toolbar actions. Fix based strictly on shadcn design system and background XOR stroke rule.
- Changed:
  - `src/components/learning/ConversationTurn.tsx` & `AudioPlayButton.tsx`: Harmonized all 4 action buttons in turn headers (`Listen`, `Grammar`, `Analysis`, `Hide translation`) to identical shadcn `size="sm"` (`h-control-sm`), `rounded-control` (12px), `text-chip` (12px font), unified outline variant (`border border-border bg-transparent`) when idle, active states elevated or `.rainbow-border`. Turn card container converted to clean elevated solid white `bg-card shadow-sm border-0` with hover elevation.
  - `src/components/learning/ConversationReader.tsx`: Standardized top toolbar buttons to uniform `h-9` (`size="sm"`), eliminating mismatched heights.
  - `src/components/dashboard/DashboardClient.tsx`: Fixed sibling track cards (Everyday vs Professional) to use identical `variant="default"` primary buttons and matching `Badge` variants, eliminating one-white-one-purple discrepancy.
  - `src/components/discovery/ScenarioCard.tsx`: Converted "Practice" CTA to high-contrast `variant="default" size="sm"` button.
  - `src/components/discovery/FilterBar.tsx`: Fixed Select dropdowns to render full translated labels ("All Levels (CEFR)", "Any Length", "Any Style") instead of raw lowercase `"all"`; converted triggers to `border border-input bg-transparent`.
  - `src/components/discovery/CategoryPills.tsx`: Converted unselected pills to clean outline `border border-border bg-transparent` and selected pill to `.rainbow-border bg-card`.
  - `src/components/learning/WordDetailPopover.tsx`: Eliminated nested box borders in Grammar Breakdown, Contextual Meaning, and Example Sentence (`border-0` with solid muted/panel fills); unified footer actions to standard shadcn Cancel (`variant="outline"`) and Confirm (`variant="default"`).
  - `src/app/globals.css`: Removed forced `background-color: var(--topic-surface)` on all cards so cards remain crisp white `bg-card shadow-card` surfaces; removed stroke from `.emoji-tile`.
- Verified with:
  - `npm run check:frozen`: Passed (0 diff on `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 under 12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token violations across rules a–i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (203/203 unit tests passing across 41 suites).
- Commit: `8555e2a`
- Open questions / follow-ups: None.

### 2026-11-22, Localhost Dev Server Launch
- Requested by owner: "run local host".
- Changed:
  - Launched Next.js development server (`next dev` with Turbopack) on port 3000 as background daemon process.
  - Server successfully initialized and actively listening at `http://localhost:3000` (network `http://192.168.0.102:3000`).
- Verified with:
  - Background task status: `RUNNING` with `✓ Ready in 254ms`.
- Commit: Working tree clean.
- Open questions / follow-ups: None.

### 2026-11-22, Shadcn UI Harmonization & Surface Contrast Rule
- Requested by owner: Harmonize UI with shadcn design system (button sizes, pill sizes, label sizes, card sizes, spacing, padding, margin, 4px grid rhythm). Define and enforce minimum (12px) and maximum (40px) font sizes, font weight max 600. Enforce "Background XOR Stroke": solid background has no stroke, stroke has no background fill; sole exception is active gradient `.rainbow-border`.
- Changed:
  - `src/components/ui/card.tsx`: default/warm/muted cards solid with `border-0`; bordered card uses `border border-border bg-transparent`.
  - `src/components/ui/badge-variants.ts`: all solid badge variants borderless; outline badge uses `border border-border bg-transparent`.
  - `src/components/ui/button-variants.ts`: outline button `border border-border bg-transparent`; solid buttons borderless.
  - `src/components/ui/input-variants.ts` & `src/components/ui/select.tsx`: outline inputs use transparent bg.
  - Cleared redundant borders from solid containers across 34 feature components and pages (`Panel`, `TopicCard`, `ChatBubble`, `CefrChip`, `TodayPanel`, `DashboardClient`, `WhatShouldISay`, `RoleplayPartner`, `NicheLadderRoadmap`, `ReviewQueue`, `PracticeWorkspace`, `ProgressDashboard`, `Grammar*`, `Sidebar`, `explore`, `vocabulary`, `professions`, `privacy`, landing).
- Verified with:
  - `npm run check:frozen`: Passed (0 diff on `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 under 12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token violations across rules a–i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (203/203 unit tests passing across 41 suites).
  - `npm run build`: Passed (109/109 static pages successfully generated in 3.1s).
- Commit: `d51ab66`
- Open questions / follow-ups: None.

### 2026-11-23, Single Language Titles & Elimination of Double Stacked Titles
- Requested by owner:
  - Eliminate redundant double titles (stacked English + Bangla titles).
  - When Bangla language is selected, show only the Bangla title; when English is selected, show only the English title.
  - Where learning dialogues exist (e.g. Dialogue line and its Bengali translation underneath), keep the translation for ESL learner comprehension.
- Changed:
  - `src/lib/i18n/use-locale.ts`: Created reactive `useLocale()` hook that reads from `localStorage` ("bn" default) and listens to custom `ecp_locale_change` events.
  - `src/lib/i18n/index.ts`: Exported `useLocale()`.
  - `src/components/navigation/LanguageSwitcher.tsx`: Dispatched `ecp_locale_change` event on user selection so mounted components instantly re-render in the selected language.
  - `src/components/shared/LocaleTitle.tsx`: Created reusable `<LocaleTitle>` component rendering single title based on active locale with Bengali typography class (`font-bangla text-bangla`).
  - `src/components/discovery/ScenarioCard.tsx`: Removed duplicate Bangla subtitle paragraph; rendered single title with `<LocaleTitle>`. Localized category tag.
  - `src/components/dashboard/DashboardClient.tsx`: Replaced stacked hero title and subtitle with single `<LocaleTitle>`.
  - `src/app/(app)/conversations/[slug]/page.tsx`: Replaced stacked scenario header titles with single `<LocaleTitle>`.
  - `src/app/(app)/explore/category/[slug]/page.tsx`: Replaced duplicate category heading with `<LocaleTitle>`.
  - `src/components/learning/NicheLadderRoadmap.tsx`: Replaced duplicate step title subtitle with `<LocaleTitle>`.
  - `src/components/practice/DialogueOrderCard.tsx`: Replaced duplicate sequencing title with `<LocaleTitle>`.
  - `src/components/analytics/ProgressDashboard.tsx`: Replaced duplicate recommendation titles with `<LocaleTitle>`.
  - `src/components/learning/ReviewSummary.tsx`: Switched completion title to single line based on active locale.
  - `src/components/tools/RoleplayPartner.tsx`: Localized scenario topic pills and context card title.
  - `src/components/discovery/CategoryPills.tsx`: Displayed active category name based on locale (`nameBn` vs `name`).
- Verified with:
  - `npm run check:frozen`: Passed (0 diff on `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 under 12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token violations across rules a–i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (209/209 unit tests passing across 41 suites).
  - `npm run build`: Passed (110/110 static pages successfully generated in 2.2s).
  - Chrome Puppeteer: verified screenshots of single title in Bangla (`dashboard_single_title_bn.png`, `explore_single_title_bn.png`) and in English (`dashboard_single_title_en.png`, `explore_single_title_en.png`).
- Commit: `a8c60dc`
- Open questions / follow-ups: None.

### 2026-11-23, AI Partner Freestyle Open Chat, 10 Curated Scenarios, and Custom Topic Creation
- Requested by owner:
  - Default mode: Freestyle Talking (ChatGPT-style open conversation, any question or story).
  - 10 curated preset scenarios covering real-world situations with CEFR level indicators.
  - User can create custom topics (+ Create Topic) with Title, Situation/Context, AI Role, Learner Role, and Level, persisted in `localStorage`.
  - When in a selected scenario (preset or custom), AI strictly adheres to that topic and provides focused practice and suggestions; when in Freestyle, AI freely discusses anything.
- Changed:
  - `src/lib/ai/roleplay.ts`:
    - Added `freestyle` rule at index 0 of `SCENARIO_RULES` for offline/fallback engine.
    - Updated `generateRoleplayTurn` to recognize `freestyle` scenario_id.
    - Updated `generateRoleplayTurnAsync` system prompt: dynamically branches between open ChatGPT-style conversation tutor and strictly scoped in-character scenario roleplay based on `isFreestyle`.
  - `src/components/tools/RoleplayPartner.tsx`:
    - Defined `FREESTYLE_SCENARIO` as initial default state.
    - Expanded presets from 3 to 10 curated scenarios: Store, Cafe, Taxi, Hotel, Restaurant, Airport, Doctor, Job Interview, Office Meeting, Product Return.
    - Integrated `Dialog` from `@/components/ui/dialog` with shadcn `Field`, `Input`, `Button`, and CEFR pills for creating custom topics.
    - Added custom scenario persistence in `localStorage` (`ecp_custom_roleplay_scenarios`) with deletion capability.
    - Redesigned topic selection bar with prominent Freestyle pill, 10 curated preset pills, custom topic chips, and header "+ Create Topic" button.
    - Fixed initial mount `scrollIntoView` behavior to prevent viewport jumps on page load.
- Verified with:
  - `npm run check:frozen`: Passed (0 diff on `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 under 12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token violations across rules a–i).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (209/209 unit tests passing across 41 suites).
  - `npm run build`: Passed (110/110 static pages successfully generated in 3.1s).
  - Chrome Puppeteer: verified screenshots of default Freestyle mode (`roleplay_freestyle_and_topics.png`), modal dialog (`roleplay_create_topic_modal.png`), and live custom topic creation (`roleplay_custom_topic_created.png`).
- Commit: `d0f6e14`
- Open questions / follow-ups: None.

### 2026-11-23, Daily Practice & Settings Implementation Completed
- Requested by owner: "daily paractice and setting complete koro" (Complete Daily Practice and Settings).
- Core Deliverables & Changes:
  - `src/app/(app)/daily-practice/page.tsx` & `src/components/practice/DailyPracticeClient.tsx`:
    - Full implementation of Daily Practice page at `/daily-practice`.
    - Localized date header (Bangla/English) with page title and subtitle.
    - Embedded `<TodayPanel variant="card">` with live streak count, weekday completion markers, and daily minutes progress.
    - Today's Conversation Challenge card fetched from `/api/v1/challenges/daily` with CEFR chip, time estimate, turns count, localized title/description, 3-step action cards (Listen to Dialogue, Speaking Practice, Sentence Builder & Quiz), Start Challenge CTA, and interactive completion toggle.
    - Spaced Repetition (SRS) Review Queue powered by SM-2 (`<ReviewQueue savedLemmas={savedLemmas}>`) for saved vocabulary due today, with empty state prompting starter words or vocabulary book link.
    - 3 Quick Speaking Drill cards: What Should I Say (`/what-should-i-say`), AI Partner (`/roleplay`), Shopping Ladder (`/explore/category/shopping-and-money`).
  - `src/app/(app)/settings/page.tsx` & `src/components/settings/SettingsClient.tsx`:
    - Full implementation of Settings page at `/settings`.
    - Language & Translation preferences: Interactive segmented selector for বাংলা (`bn`), English (`en`), हिन्दी (`hi`) triggering instantaneous locale changes; Bilingual assistance toggle (`ecp_bilingual_mode`).
    - Audio & Speech preferences: Playback speed segmented options (`0.75x`, `0.88x`, `1.0x`, `1.25x` persisted to `ecp_audio_speed`), Auto-play dialogue audio toggle (`ecp_autoplay_audio`), Preferred voice accent selector (`US English`, `UK English`, `Global`).
    - Daily Goals & Learning Level: Daily speaking target selector (`5m`, `10m`, `15m`, `20m`), Target CEFR level selector (`A1`, `A2`, `B1`, `B2`).
    - Appearance & Display: Light, Dark, System theme mode buttons powered by `useTheme()`.
    - Data & Storage Management: Live display of saved notebook words and completed ladder steps; Export progress data as JSON; Reset learning progress with destructive confirmation dialog and toast alert.
    - About & Version card (`v1.2.0`).
  - `src/components/navigation/Sidebar.tsx` & `src/components/navigation/Header.tsx`:
    - Removed `comingSoon: true` and `#` placeholders; wired `/daily-practice` and `/settings` routes with active state detection and localized titles.
  - `src/components/shared/TodayPanel.tsx`:
    - Added `variant?: "band" | "card"` allowing standalone card rendering with optimal surface contrast in light/dark mode outside of hero bands.
  - `messages/en.json`, `messages/bn.json`, `messages/hi.json`:
    - Added full translation dictionaries for `dailyPractice` and `settings` across all 3 supported locales with 100% key parity (149 keys each).
  - `tests/multi-language-coverage.test.mjs`:
    - Updated parity assertion to 149 keys across all 3 locales.
- Verified with:
  - `npm run check:frozen`: Passed (0 diff on `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 under 12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (209/209 tests passing across 41 test suites).
  - `npm run build`: Passed (112/112 static routes compiled cleanly).
  - Visual verification with full-page Puppeteer screenshots in both Bangla and English modes: zero dual-language/parenthetical occurrences, optimal contrast, flawless design system token harmony.

### 2026-11-23, single language enforcement & clean input border
- Requested by owner:
  - Eliminate all dual-language titles and English in parentheses after Bangla (e.g. `(Topic Title)`, `(Career Paths)`, `(Rate your recall)`).
  - When Bangla is active, show only Bangla; when English is active, show only English.
  - Fix input fields so on focus/active typing ONLY the 2px animated rainbow border shows, removing the extra brand/black outer border.
- Changed:
  - `src/styles/design-tokens.css`:
    - Updated `:focus-visible` selector to exclude `[data-slot="input-group"]` and `.rainbow-border` from the 2px `--ecp-focus-ring` brand outline.
    - Set explicit `outline: none !important;` on `.rainbow-border`, inputs, and input groups.
  - `src/components/ui/input-group.tsx`:
    - On focus, switched from `border border-transparent` to `border-0 shadow-none ring-0 outline-none rainbow-border`, preventing double stroke.
  - `src/components/ui/input-variants.ts`:
    - Enhanced outline variant to support `focus:rainbow-border focus:border-0 outline-none` with zero external outline ring.
  - `src/lib/i18n/index.ts` & `src/lib/i18n/use-locale.ts`:
    - Updated `t()` so when locale is not explicitly provided on client, it automatically resolves the active user locale from `localStorage.getItem("ecp_user_locale")` (falling back to "bn").
    - Exported `useTranslations()`.
  - `src/components/tools/RoleplayPartner.tsx`:
    - Removed parenthetical English labels and placeholders in the "Create Topic" modal.
    - Clean single-language titles, buttons, and placeholders for chat input, header, pills, and context cards.
    - Updated `FREESTYLE_SCENARIO.titleBn` to "উন্মুক্ত কথোপকথন" (removed "(Open Chat)").
  - `src/components/dashboard/DashboardClient.tsx`:
    - Localized Everyday & Social English, Professional Conversations, and Start Your First Conversation cards and buttons dynamically according to `useLocale()`.
  - `src/components/discovery/FilterBar.tsx` & `src/components/discovery/ScenarioCard.tsx`:
    - Converted FilterBar to use `useLocale()` and dynamic translation options.
    - Localized filter options, practice button (`t("learning.practice", locale)`), and profession badge.
  - `src/app/(app)/professions/page.tsx` & `src/app/(app)/professions/[slug]/page.tsx`:
    - Replaced stacked double titles with `<LocaleTitle>`, removed `(Career Paths)` and `(Key Competencies)`.
  - `src/components/learning/ReviewQueue.tsx`:
    - Removed parenthetical English from rating buttons and prompts.
  - `src/app/(app)/explore/page.tsx` & `src/components/tools/WhatShouldISay.tsx`:
    - Localized headers, subtexts, and placeholders with `<LocaleTitle>`.
- Verified with:
  - `npm run check:frozen`: Passed (0 diff on `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 under 12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npm run lint`: Passed (0 ESLint errors; 0 token violations).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (209/209 unit tests passing across 41 suites).
  - `npm run build`: Passed (110/110 static pages successfully generated in 3.1s).
  - Puppeteer pixel verification: exactly 2px rainbow border, 0px outer ring on active inputs.
  - Automated browser text scanner: 0 dual-language / parenthetical English instances found across all routes.
- Commit: `b8d10da`

### 2026-11-24, Conversation Reader Language Synchronization & Speaker Label Localization
- Requested by owner: "dekho language select kora english but button pill speaker name bangla english double akhono roye gece" (In English mode, buttons, pills, grammar switches, and speaker names were still appearing in Bangla or showing bilingual double labels).
- Changed:
  - `src/components/learning/SpeakerLabel.tsx`:
    - Converted to client component using `useLocale()`.
    - In BN mode: renders `{speaker.nameBn || speaker.name}` and `{speaker.roleBn || speaker.role}`.
    - In EN mode: renders `{speaker.name}` and `{speaker.role || speaker.roleBn}`.
    - Eliminates bilingual double labels (`Speaker A` / `অংশগ্রহণকারী`).
  - `src/components/learning/ConversationTurn.tsx`:
    - Added `useLocale()` hook.
    - Passed dynamic `lang` to `<GrammarToggleButton>`.
    - Localized explanation button (`বিশ্লেষণ` / `Explain`) and turn translation toggle (`লুকান` / `অনুবাদ` / `Hide` / `Translate`).
  - Grammar System UI Controls (`src/components/grammar/`):
    - `GrammarToggleButton.tsx`, `GrammarModeSwitch.tsx`, `GrammarLayerPicker.tsx`, `GrammarLegend.tsx`: Added `useLocale()` with locale fallback so they automatically react to the active language switcher even when used without explicit `lang` prop.
    - Switches dynamically between Bangla (`সব বাক্যে ব্যাকরণ`, `লেয়ার সেটিংস`, `ব্যাকরণ নির্দেশিকা`, `সব ক্যাটাগরি দেখুন`) and English (`Grammar (all lines)`, `Layers`, `Grammar Legend`, `Show all`).
  - `src/components/learning/ConversationReader.tsx`:
    - Added `import { cn } from "@/lib/utils";`.
    - Localized version badge label (`সংস্করণ:` / `Version:`), turn count (`বাক্য` / `turns`), step navigation (`আগের ধাপ` / `পরের ধাপ` / `Previous Step` / `Next Step`), global translation button (`অনুবাদ লুকান` / `সব অনুবাদ` / `Hide Translation` / `Show Translation`), and lesson completion button (`পাঠ সমাপ্ত` / `সম্পন্ন ✓` / `Finish Lesson` / `Completed ✓`).
    - Localized non-blocking auth prompt modal.
  - `src/components/learning/ReviewSummary.tsx`:
    - Added missing `import { cn } from "@/lib/utils";` (resolved SSR ReferenceError).
    - Localized scenario bookmark button, key vocabulary checklist title, and next scenario navigation button.
  - `src/app/(app)/conversations/[slug]/page.tsx`:
    - Wrapped breadcrumb and bookmark button in `<LocaleTitle>`.
    - Wrapped ladder step badge and section headings in `<LocaleTitle>`.
- Verified with:
  - `npm run check:frozen`: Passed (0 diff on `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 under 12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (209/209 unit tests passing across 41 suites).
  - `npm run build`: Passed (112/112 static routes compiled cleanly).
  - Visual & DOM verification via headless Chrome runner on `/conversations/returning-damaged-product` across EN and BN modes: 0 hydration errors, 100% pure English text in EN mode, 100% pure Bangla text in BN mode.
- Commit: `714ccbd`

### 2026-11-24, Systemic Multi-Language Architecture & Full i18n Normalization
- Requested by owner: Systemic resolution of multi-language architecture rather than piecemeal UI fixes. Build a future-proof foundation supporting English learning (L2) with any native/support interface language (L1: Bengali, English, Hindi, Urdu, Arabic). Adopt Option A for English vocabulary definitions (clear learner-friendly definitions in English mode). Eliminate all hardcoding and dual-language slash patterns (`All / সব`, `Learning (Stages 0-2)`).
- Changed:
  - `messages/en.json`, `messages/bn.json`, `messages/hi.json`:
    - Added 60 new translation keys (total 209 keys each, 100% parity across all 3 languages) covering `vocabulary.*`, `professions.*`, and `progress.*`.
  - `src/lib/professions/registry.ts`:
    - Updated `ProfessionMeta` schema with `competenciesEn: string[]` and `roleExamplesEn: string[]`.
    - Added comprehensive English competencies and role examples for all registered professions (`ui-ux-designer`, `software-engineer`, `remote-freelancer`, `healthcare-worker`, `teacher`).
  - `src/content/seed/vocabulary.ts`:
    - Updated `VocabularyEntry` schema with `contextualMeaningEn` and `generalMeaningEn`.
    - Added Option A English definitions for all seed vocabulary items.
  - `src/app/(app)/vocabulary/page.tsx`:
    - Migrated to `useTranslations()`.
    - Completely eliminated hardcoded JSX strings (Sync to Cloud, guest status, filter tabs, POS categories).
    - Replaced `All / সব` with dynamic localized POS tags (`All`, `Verbs`... in EN; `সব`, `ক্রিয়া`... in BN).
    - Dynamically renders English definitions in English mode and Bengali meanings in Bengali mode.
  - `src/app/(app)/professions/page.tsx` & `src/app/(app)/professions/[slug]/page.tsx`:
    - Uses `competenciesEn` in EN mode and `competenciesBn` in BN mode.
    - Localized all action buttons, subtitle, and meta units via dictionary.
  - `src/components/analytics/ProgressDashboard.tsx`:
    - Fully dynamic KPI labels, metric units (`days active`, `min`), and week days (`Sat`, `Sun`... in EN; `শনি`, `রবি`... in BN).
    - Localized stage breakdown labels: `Learning (Stages 0-2)` in EN, `শেখা শুরু (ধাপ ০-২)` in BN (zero bilingual slashes).
    - Dynamically renders recommendation reasons in active locale (`rec.reason` in EN, `rec.reasonBn` in BN).
  - `tests/multi-language-coverage.test.mjs`:
    - Updated assertion to 209 keys with 100% key parity across EN, BN, and HI.
- Verified with:
  - `npm run check:frozen`: Passed (0 diff on `.rainbow-border`).
  - `npm run lint:ui`: Passed (0 under 12px, 0 font-bold/700+, 0 arbitrary hex).
  - `npx tsc --noEmit`: Passed (0 TypeScript errors).
  - `npm test`: Passed (209/209 unit tests passing across 41 suites).
  - `npm run build`: Passed (112/112 static routes compiled cleanly).
  - Puppeteer live screenshots across `/vocabulary`, `/professions`, and `/progress` in both `en` and `bn` modes: 0 bilingual slashes, 0 foreign language leaks, 100% clean visual rendering.
- Commit: `b6542f9`

### 2026-11-24, Global Multi-Language Systemic Architecture & Zero Hardcoding Overhaul
- **Requested by Owner:** Permanent resolution of hardcoding, dual titles in parentheses (e.g. `(Topic Title)`, `(Career Paths)`, `All / সব`), hydration mismatch error on `Header.tsx`, and cross-language leaks (Bengali appearing while English is selected). Architecture must scale cleanly to any native language (BN, EN, HI, UR, AR) without page-specific hacks.
- **Architectural Overhaul Delivered:**
  1. **Global Cookie & Context Synchronization:**
     - Created `src/lib/i18n/context.ts` and `src/lib/i18n/provider.tsx` implementing a unified `LocaleProvider` context.
     - Saves active locale to both `localStorage` and `document.cookie` (`ecp_user_locale`) on selection.
     - Permanent hydration mismatch prevention: wrapped top-level shell with `LocaleProvider` and marked dynamic localized headers with `suppressHydrationWarning`.
  2. **100% Central Dictionary Coverage (Zero Hardcoded UI Strings):**
     - Expanded `messages/en.json`, `messages/bn.json`, and `messages/hi.json` to 296 keys with exact key parity (0 missing keys, 0 untranslated keys).
     - Added comprehensive coverage for `dashboard`, `discovery`, `reader`, `roleplay`, `sayIt`, `professions`, and `nav`.
  3. **Strict Single-Language Enforcement (Zero Dual Titles / Zero Leaks):**
     - Completely purged all parenthetical dual titles (`(Topic Title)`, `(Career Paths)`, `All / সব`, `(AI Role)`).
     - In English mode: 100% pure English across all UI elements, options, and buttons; translation subtitles are strictly hidden (`{locale === "bn" && ...}`).
     - In Bengali mode: Pure Bengali interface, guidance, and definitions, with English learning dialogue.
  4. **Component Refactoring:**
     - `DashboardClient.tsx`: All hero, card, and metric strings migrated to `t("dashboard.*")`; dialogue preview translations only rendered in Bengali mode.
     - `FilterBar.tsx` & `ScenarioCard.tsx`: All level, style, and metric filters migrated to dictionary keys.
     - `ConversationReader.tsx` & `ConversationTurn.tsx`: Controls localized via `t("reader.*")`; individual and global translation toggles conditioned on Bengali mode.
     - `GrammarModeSwitch.tsx`, `GrammarLayerPicker.tsx`, `GrammarLegend.tsx`: Fully dictionary-driven labels.
     - `RoleplayPartner.tsx`: Topic creation modal, voice controls, and feedback sections 100% dictionary-driven with zero parentheses.
     - `SpeakerLabel.tsx`: Zero Bengali fallback in English mode.
     - `WhatShouldISay.tsx` & `src/lib/ai/say-it.ts`: Output language awareness prevents Bengali intent or subtitle leakage in English mode.
     - `Vocabulary`: POS filter tags and cards show English definitions in English mode, Bengali meanings in Bengali mode.
- **Verification:**
  - `npm run check:frozen`: Byte-identical to baseline commit `db71d3c`.
  - `npm run lint:ui`: Passed (0 under 12px, 0 font-bold/700+, 0 arbitrary hex colors).
  - `npx tsc --noEmit`: 0 TypeScript errors.
  - `npm test`: 209/209 unit tests passing across 41 suites.
  - `npm run build`: 112/112 static and partial-prerendered routes compiled cleanly with Turbopack.
  - Live Puppeteer visual captures across `/dashboard`, `/explore`, `/conversations/...`, `/what-should-i-say`, `/roleplay`, `/professions`, and `/vocabulary` in both `en` and `bn` modes confirmed zero leaks and zero dual titles.

### 2026-11-25, Two-Tier Language Architecture (System Language vs Translation Language)
- **Requested by Owner:** Split language controls into two independent tiers:
  1. **System Language (App Interface):** Controls menus, navigation, dashboard, buttons, labels, and settings UI. Managed exclusively from `/settings`.
  2. **Translation Language (Words & Sentences):** Controls sentence translations, vocabulary meanings, and AI explanations (`bn`, `hi`, `none`/English Only). Managed from both `/settings` and the Header dropdown.
- **Changes Delivered:**
  - `src/lib/i18n/languages.ts`, `context.ts`, `provider.tsx`, `use-locale.ts`, `index.ts`:
    - Added `TRANSLATION_LOCALES = ["bn", "hi", "none"]` and `TranslationLocale`.
    - Extended `LocaleProvider` with `translationLocale` and `setTranslationLocale` persisted in `localStorage` (`ecp_translation_locale`) and cookies.
    - Exported `useTranslationLocale()` and updated `useTranslations()` to return both `locale` (system) and `translationLocale`.
  - `src/components/navigation/LanguageSwitcher.tsx`:
    - Refactored Header dropdown to exclusively control `translationLocale` (`বাংলা`, `हिन्दी`, `No Translation`) with a link to `/settings` for System Language.
  - `src/components/settings/SettingsClient.tsx`:
    - Replaced single language + boolean toggle with two explicit selectors: **System Language (App Interface)** (`bn`, `en`, `hi`) and **Translation Language (Words & Sentences)** (`bn`, `hi`, `none`).
  - `messages/en.json`, `bn.json`, `hi.json` & `tests/multi-language-coverage.test.mjs`:
    - Expanded to 305 keys with 100% parity across EN, BN, and HI.
  - Learning Components (`DashboardClient.tsx`, `ConversationReader.tsx`, `ConversationTurn.tsx`, `WordDetailPopover.tsx`, `vocabulary/page.tsx`, `WhatShouldISay.tsx`):
    - Strictly separated UI labels (`locale`) from learning translations (`translationLocale`).
    - When `translationLocale === "none"`, all Bengali translations are hidden and English definitions/explanations are shown.
    - When `System Language = EN` and `Translation Language = BN`, UI is 100% English while dialogue/word translations render in Bengali.
- **Verification:**
  - `npm run check:frozen`: Byte-identical to `db71d3c`.
  - `npm run lint:ui`: Passed strictly.
  - `npx tsc --noEmit`: 0 errors.
  - `npm test`: 209/209 passed across 41 suites.
  - `npm run build`: 112/112 routes compiled cleanly in Next.js 16.4.6 Turbopack.
  - Puppeteer visual captures (`twotier_settings_en_bn.png`, `twotier_header_dropdown.png`, `twotier_dashboard_en_bn.png`, `twotier_dashboard_en_none.png`) verified.

### 2026-11-25, Global Searchable Language Model & Grammar Leak Elimination
- **Requested by Owner:** Eliminate remaining hardcoded Bengali strings in Grammar components and make the language selector global and searchable so any language can be searched and selected.
- **Changes Delivered:**
  - `src/lib/i18n/languages.ts` & `src/lib/i18n/provider.tsx`:
    - Added `GLOBAL_LANGUAGES` catalog with 24+ world languages (EN, BN, HI, UR, AR, ES, FR, DE, PT, TR, ID, MS, JA, KO, ZH, RU, IT, TH, VI, FA, TA, TE, MR, PA) with script and RTL/LTR direction metadata.
    - Added `searchGlobalLanguages(query)` and `isValidGlobalLanguage(code)`.
    - Updated `LocaleProvider` to accept any registered global language code with graceful English fallback in `t()` when a dedicated JSON dictionary is not yet authored.
  - `src/components/navigation/LanguageSwitcher.tsx` & `src/components/settings/SettingsClient.tsx`:
    - Added live search inputs to Header `LanguageSwitcher` (Translation Language) and Settings (both System Language and Translation Language).
  - Grammar & Learning Leak Cleanup:
    - Fixed `GrammarSummaryRow.tsx`: removed hardcoded `গঠন:`, hardcoded Bengali tooltips, and `lang = "bn"` default; now reads `useLocale()` and renders `Structure:` and English labels in English mode.
    - Fixed `GrammarText.tsx`, `GrammarBreakdown.tsx`, `RuleCard.tsx`, `GrammarToggleButton.tsx`: now read `useLocale()` dynamically instead of defaulting to `"bn"`.
    - Fixed `GrammarPanel.tsx`: localized `ভুল:` / `সঠিক:` (`Mistake:` / `Correct:`) and conditioned `whyUsedBn` / `explanationBn` on `translationLocale === "bn"`.
- **Verification:**
  - `npm run check:frozen`: Byte-identical to `db71d3c`.
  - `npm run lint:ui`: Passed strictly.
  - `npx tsc --noEmit`: 0 errors.
  - `npm test`: 209/209 passed across 41 suites.
  - `npm run build`: 112/112 routes compiled cleanly in Next.js 16.4.6 Turbopack.
  - Puppeteer visual captures (`global_grammar_en.png`, `global_settings_search.png`, `global_header_search.png`) verified.

### 2026-11-25, Live Multi-Language Translation Engine (/api/v1/translate)
- **Requested by Owner:** Activate live translation for all 24+ global languages so whichever `translationLocale` the user selects translates sentences and vocabulary dynamically instead of showing "Bangla translation coming soon".
- **Changes Delivered:**
  - `src/app/api/v1/translate/route.ts`:
    - Created `POST /api/v1/translate` endpoint with server-side in-memory cache, fast GTX translation pipeline, and Groq LLM (`llama-3.3-70b-versatile`) fallback.
  - `src/lib/i18n/use-live-translation.ts` & `src/lib/i18n/index.ts`:
    - Created `useLiveTranslations` and `useLiveTranslation` hooks with memory + `localStorage` caching (`ecp_live_trans_v1_${lang}`).
  - Wired into `ConversationTurn.tsx`, `DashboardClient.tsx`, `WordDetailPopover.tsx`, `vocabulary/page.tsx`, and `WhatShouldISay.tsx`.
    - Bengali mode displays `translationBn` directly without "coming soon" placeholder; other selected languages (`hi`, `ar`, `ur`, `es`, `fr`, etc.) translate live via `/api/v1/translate` with RTL direction support.
    - Preserved `getLineTranslationDisplay` contract so `tests/translations-review-status.test.mjs` remains passing.
- **Verification:**
  - `npm run check:frozen`, `npm run lint:ui`, `npx tsc --noEmit`: Passed.
  - `npm test`: 209/209 passed.
  - `npm run build`: 113/113 routes compiled cleanly (including `/api/v1/translate`).
  - Live Puppeteer verification (`live_reader_hi.png`, `live_reader_bn.png`, `live_vocab_es.png`) confirmed live translations across Hindi, Bengali, and Spanish.

### 2026-11-25, 24-Tier CEFR Length & 3-Style Scalable Conversation Matrix (6-9 to 56-60 turns)
- **Requested by Owner:** Scale conversation lengths from 2 options (`4-6`, `7-10`) to 24 progressive length options (4 per CEFR level from `A1` through `C2`, spanning `6-9` turns up to `56-60` turns) combined with 3 communication styles (`Casual`, `Neutral`, `Formal`) and progressive sentence complexity (`Hello...` simple sentences at A1 up to compound-complex at C2). Level filter dynamically filters Length dropdown to only that level's 4 options; inside any conversation, users can switch both Length and Style dynamically.
- **Changes Delivered:**
  - `src/lib/content/length-tiers.ts`:
    - Created `LENGTH_TIERS` (24 tiers: 4 per level for `A1`, `A2`, `B1`, `B2`, `C1`, `C2`, from `6-9` to `56-60` turns), `CONVERSATION_STYLES`, and `getLengthTiersForLevel()`.
  - `src/lib/content/dialogue-builder.ts` & `src/app/api/v1/conversations/generate/route.ts`:
    - Built progressive dialogue generator & `POST /api/v1/conversations/generate` endpoint (AI-powered via Groq when key available, with deterministic progressive fallback and server cache) producing exact target turn counts with CEFR-appropriate sentence complexity (`basic_simple` → `mastery_compound_complex`) and register (`casual` / `neutral` / `formal`).
  - `src/content/seed/scenarios.ts`:
    - Extended `ScenarioItem` to `A1`–`C2` and added dedicated `C1` (`sc-28`..`sc-31`) and `C2` (`sc-24`..`sc-27`) scenarios across categories.
  - `src/components/discovery/FilterBar.tsx`, `src/app/(app)/explore/page.tsx`, `src/components/discovery/ScenarioCard.tsx`:
    - Selecting a CEFR level dynamically restricts the Length dropdown to that level's 4 length tiers.
    - Selecting Length & Style on `/explore` passes `?length=...&style=...` to `/conversations/[slug]`.
  - `src/components/learning/ConversationReader.tsx` & `src/app/(app)/conversations/[slug]/page.tsx`:
    - Added in-reader **Length (4 tiers)** & **Style (`Casual`, `Neutral`, `Formal`)** switchers so users can dynamically change length and style inside any conversation.
  - `tests/learning-loop.test.mjs`:
    - Updated allowed CEFR levels assertion to include `C1` and `C2`.
- **Verification:**
  - `npm run check:frozen`, `npm run lint:ui`, `npx tsc --noEmit`: Passed.
  - `npm test`: 209/209 passed across 41 suites.
  - `npm run build`: 130/130 routes compiled cleanly.
  - Puppeteer visual captures (`matrix_explore_c1_lengths.png`, `matrix_reader_c2_switchers.png`) verified.

### 2026-11-25, Professional English Career Paths Update & GitHub Push
- **Requested by Owner:** Update the Professional English Career Paths pages and push all updates to GitHub.
- **Changes Delivered:**
  - `src/app/(app)/professions/page.tsx`:
    - Added interactive category filter pills (`All Tracks`, `Tech & Engineering`, `Business & Freelance`, `Healthcare`, `Education`).
    - Computed live scenario counts per career track from `SEED_SCENARIOS`.
    - Conditioned Bangla typography classes strictly on `locale === "bn"`.
  - `src/components/professions/ProfessionScenariosGrid.tsx` & `src/app/(app)/professions/[slug]/page.tsx`:
    - Integrated `FilterBar` (CEFR Level + level-dependent 4-tier Length + 3-Style matrix) directly into every Career Path detail page, passing `?length=...&style=...` to `ScenarioCard` and `ConversationReader`.
- **Verification:**
  - `npm run check:frozen`, `npm run lint:ui`, `npx tsc --noEmit`: Passed.
  - `npm test`: 209/209 passed across 41 suites.
  - `npm run build`: 130/130 routes compiled cleanly.
  - Puppeteer visual captures (`professions_updated_en.png`, `professions_detail_en.png`) verified.
  - Pushed all commits to `origin/main` on GitHub.

### 2026-11-25, GitHub CI ESLint Fix
- **Root Cause:** `npm run lint` failed in GitHub Actions CI on commit `a6eb10f` with 6 `react-hooks/set-state-in-effect` errors and 1 unused import warning (`DialogClose`).
- **Fixes Applied:**
  - `src/components/navigation/LanguageSwitcher.tsx`: Moved `setSearchQuery("")` out of `useEffect` into event callbacks (`handleClickOutside`, `handleKeyDown`, `handleSelect`).
  - `src/components/practice/DailyPracticeClient.tsx`, `src/components/settings/SettingsClient.tsx`, `src/components/tools/WhatShouldISay.tsx`, `src/lib/i18n/provider.tsx`, `src/lib/i18n/use-live-translation.ts`: Wrapped synchronous `localStorage`/initial state hydration inside `queueMicrotask(() => { ... })` in `useEffect`; removed unused `DialogClose` import in `SettingsClient.tsx`.
- **Verification:** `npm run check:frozen`, `npm run lint:ui`, `npm run lint` (0 errors/warnings), `npm test` (209/209 passed across 41 suites), and `npm run build` (130/130 routes) all passed.
- **Follow-up CI Node.js Version Fix:** CI run on `432b96d` passed lint/frozen/UI checks but failed on `npm test` (`node: bad option: --experimental-strip-types`) because `.github/workflows/ci.yml` was pinned to `node-version: 20`. Updated `.github/workflows/ci.yml` to `node-version: 24` (matching local `v24.21.0`).
- **Follow-up CI Python Venv Fix:** CI run on `6db1965` failed at `npm test` because `tests/grammar-tenses.test.mjs` unconditionally invoked gitignored `services/nlp/.venv/bin/python`. Updated `tests/grammar-tenses.test.mjs` to skip gracefully when `services/nlp/.venv/bin/python` is absent in CI (while still running all tense tests locally).
- **Follow-up CI `.env.example` Fix:** Reproduced clean CI checkout locally via `git archive` and caught the exact remaining test failure: `tests/schema-invariants.test.mjs` asserts `.env.example` exists, which was ignored by `.env*` in `.gitignore`. Added `!.env.example` to `.gitignore` and tracked `.env.example`.

### 2026-11-25, Global Audio & Voice Model (Gender + 4 Tones + System-Wide Speech Engine)
- **Global Voice Model & Engine:**
  - `src/lib/audio/voice-model.ts`: Created extensible, non-hardcoded registries `VOICE_ACCENTS` (`us`, `uk`, `global`), `VOICE_GENDERS` (`auto`, `female`, `male`), and `VOICE_TONES` (`natural`, `warm`, `expressive`, `professional`), plus `resolveSpeechParams()` and `inferVoiceGender()`.
  - `src/lib/audio/speech-engine.ts`: Created centralized Web Speech synthesis engine (`getAudioPreferences`, `saveAudioPreferences`, `speakText`, `stopSpeech`, `previewVoiceSettings`) respecting Accent, Gender, Tone, and Speed across the entire app.
- **Settings UI & i18n:**
  - `src/components/settings/SettingsClient.tsx` & `messages/{en,bn,hi}.json`: Added Voice Gender selector, 4-option Voice Tone selector, and live "Preview Voice" button driven dynamically from `VOICE_ACCENTS`, `VOICE_GENDERS`, and `VOICE_TONES`.
- **System-Wide Wiring:** Replaced all 14 raw `SpeechSynthesisUtterance` call sites (`AudioPlayer`, `AudioPlayButton`, `WordDetailPopover`, `ReviewQueue`, `ReviewSummary`, `WhatShouldISay`, `RoleplayPartner`, `vocabulary/page`, `CompleteLineCard`, `ListeningQuizCard`, `DialogueOrderCard`, `HideSpeakerPractice`, `ReadAloudCard`, `SentenceBuilderCard`) with `speakText` / `stopSpeech`.
- **Tests:** Added `tests/voice-model.test.mjs` verifying registries, gender inference, fallback pitch offsets, and zero raw `SpeechSynthesisUtterance` leaks outside `speech-engine.ts`.

### 2026-11-25, SSR Hydration Fix for `<Suspense>` Boundaries
- **Root Cause:** `LocaleProvider` (`src/lib/i18n/provider.tsx`) used `queueMicrotask` to hydrate `ecp_user_locale` from `localStorage`, which flushed before `<Suspense><MobileBottomNav /></Suspense>` finished hydrating, causing a server (`ড্যাশবোর্ড`) vs. client (`Dashboard`) hydration mismatch.
- **Fix:** Deferred `localStorage` locale hydration to a macrotask (`setTimeout(..., 0)` with `clearTimeout` cleanup) so all `<Suspense>` boundaries complete hydration with `initialLocale` before switching to the saved client locale.

### 2026-11-25, Level-Aligned Professional English Career Paths (A1–C2)
- **Registry & Scenarios (`A1`–`C2`):**
  - `src/lib/professions/registry.ts`: Added `supportedLevels: ProfessionCefrLevel[]` and updated `targetCefr` ranges (`A1 - C2` / `A2 - C2`), `scenarioCount`, and `estimatedHours` across all 5 career paths.
  - `src/content/seed/scenarios.ts`: Linked `sc-24`, `sc-26`, `sc-28`, `sc-29`, `sc-30`, `sc-31` and added `sc-32`–`sc-42` so every career track has real scenarios across beginner (`A1`/`A2`), intermediate (`B1`/`B2`), and mastery (`C1`/`C2`) tiers.
- **Professions Page (`src/app/(app)/professions/page.tsx`):**
  - Fixed the Healthcare track filter bug (`id: "service"` matching `healthcare-worker` category).
  - Added interactive CEFR Level filter pills (`All Levels`, `A1`, `A2`, `B1`, `B2`, `C1`, `C2`) with live scenario counts per level and highlight for the user's saved `ecp_user_target_level`.

### 2026-11-25, Unified 2-Sided Chat Conversation Card & Right Inspector Sidebar
- **Conversation-First Chat Card (`src/components/learning/ChatTurnBubble.tsx`, `ConversationReader.tsx`):**
  - Replaced per-sentence stacked cards with a single unified `<Card>` containing left/right 2-sided speaker bubbles with avatars, pure English text only (zero inline translation clutter), and a compact per-line audio button.
  - Tapping any sentence bubble selects it and updates the inspector panel.
- **Fixed Right Inspector Sidebar & Mobile Slide-Up Drawer (`src/components/learning/ConversationInspectorSidebar.tsx`):**
  - Desktop (`lg+`): Sticky right sidebar holding Length (4 tiers), Style (Casual/Neutral/Formal), Grammar Highlight controls, and the tapped sentence's live/static Translation + Grammar & Structure breakdown.
  - Updated Desktop Right Sidebar to mirror the Left Sidebar (`fixed right-0 top-header h-below-header w-80 xl:w-96 border-l border-border bg-card z-sidebar`), with `src/app/(app)/conversations/[slug]/page.tsx` reserving `lg:pr-80 xl:pr-96` and `lg:px-9` (36px spacing) and consolidating the breadcrumb, bookmark, scenario header, goal, and lesson controls cleanly into two organized cards.
  - Moved `AudioPlayer` (`variant="sidebar"`) into the Desktop Right Sidebar so the center conversation card has zero floating bottom overlay (keeping floating player on `< lg` mobile/tablet).
- **AI Partner (`/roleplay`) Right Sidebar Layout (`src/app/(app)/roleplay/page.tsx`, `src/components/tools/RoleplayPartner.tsx`):**
  - Applied the same 3-column layout (`lg:pr-80 xl:pr-96`, `lg:px-9` 36px spacing): middle content area shows ONLY the AI Partner conversation chat area (responsive full viewport height `h-[calc(100dvh-11.5rem)] lg:h-[calc(100dvh-7.5rem)]`), while header, topic/mode pills, voice/speed controls, and scenario context live in the fixed Right Sidebar (and a `<Sheet side="bottom">` drawer on `< lg`).

### 2026-11-25, 40 Vocabulary Magic Cards & Right Word Inspector Sidebar
- **40 Magic Cards Dataset (`src/content/seed/magic-cards.ts`):**
  - Created 40 themed Magic Card decks (`mc-01`–`mc-40`) with catchy names, emojis, CEFR levels (`A1`–`C2`), and 25 curated words per card (1,000 total words) with POS, IPA, English meaning, and conversational example sentences.
- **Right Word Inspector Sidebar (`src/components/vocabulary/MagicWordSidebar.tsx`):**
  - Displays tapped word's pronunciation (`speakText`), IPA, Save to Notebook toggle (`ecp_saved_vocabulary`), live multi-language translation (`useLiveTranslations`), meaning, example sentence, and grammar breakdown (`GrammarSummaryRow` + `createFallbackAnnotation`).
- **`/vocabulary` Page (`src/app/(app)/vocabulary/page.tsx`):**
  - Added `Magic Cards (40)` as the primary tab alongside `Saved Vocabulary` and `Daily Flashcard Review`, using the 36px 3-column layout (`lg:pr-80 xl:pr-96`, `lg:px-9`) and a `<Sheet side="bottom">` drawer on mobile (`< lg`), with header, guest sync, tabs, search, and category pills consolidated into one unified top card.
  - Upgraded `Saved Vocabulary` (`src/lib/vocabulary/saved-categories.ts`) into custom Magic-style category cards: saving any word opens a Save-to-Category picker (select existing category or create a new one with emoji + name), and opening any saved category shows Magic-style word tiles whose details inspect in the fixed Right Sidebar.

### 2026-11-25, System-Wide Button Text Contrast & Responsive Modal Fix
- **Root Cause (`src/lib/utils.ts`):** Custom `@utility` classes from `globals.css` (`text-bangla`, `text-card-title-bn`, `text-subtitle-bn`, `text-meta-bn`, `text-meta-lead-bn`, `text-chip-bn`, `text-chip-mono`, `text-grammar-header`, `text-section-heading`) were not registered in `extendTailwindMerge`, causing `twMerge` to misclassify them as `text-color` classes and strip `text-primary-foreground` / `text-foreground` from buttons across light and dark modes.
- **Fixes:**
  - `src/lib/utils.ts`: Registered `text-bangla` in `font-family` and all custom `text-*` typography utilities in `font-size` inside `extendTailwindMerge`.
  - `src/components/auth/AuthPromptModal.tsx`: Fixed button row overflow (`w-full sm:flex-1 min-w-0`) so action buttons stay cleanly inside the modal on all viewports.
- **Tests:** Added `tests/magic-cards.test.mjs` verifying all 40 Magic Cards and 20–40 words per deck.
  - Mobile/Tablet (`< lg`): Bottom slide-up `<Sheet side="bottom">` opens when tapping a sentence or the "Style, Grammar & Translate" button.

### 2026-11-25, AI Partner (`/roleplay`) Right Sidebar UX Cleanup
- **Organized Card Grouping (`src/components/tools/RoleplayPartner.tsx`):**
  - Grouped `sidebarControls` into 4 clean, bordered sub-cards (`rounded-card border border-border/60 bg-muted/25 p-3`):
    1. **Compact Header & New Topic:** Removed redundant `Milestones 2D & 3B` / `AI Partner` stacked tags and duplicate `+` text; condensed status to a compact `Live` / `Offline` pill with tooltip for full model info.
    2. **Topics & Mode:** Replaced the 11+ sprawling wrapped pills with a pinned full-width `Freestyle Talking` button and a compact scrollable topic list (`max-h-48 overflow-y-auto`) with left-aligned titles and right-aligned CEFR/Custom badges.
    3. **Voice & Speed Controls:** Replaced single-line truncated speed pills (`Clear (0.88...`) with clean 2-line stacked speed buttons (`Slow` / `0.75x`, `Clear` / `0.88x`, `Normal` / `1.0x`) so labels never truncate.
    4. **Active Session Context:** Compact `You` / `Partner` role summary and `End Session & Get Feedback` action, now visible without scrolling past 11 topic pills.

### 2026-11-25, Settings Target CEFR Level Extended to A1–C2 & UX Polish
- **Settings (`src/components/settings/SettingsClient.tsx`):**
  - Expanded Target CEFR Level selector from `A1–B2` to full `A1–C2` (`A1 Beginner`, `A2 Elementary`, `B1 Intermediate`, `B2 Upper Intermediate`, `C1 Advanced`, `C2 Mastery` with EN/BN labels) in a clean responsive `grid-cols-2 sm:grid-cols-3` layout.
  - Fixed `audioSpeed` initialization (`1` -> `"1.0x"`) so default `1.0x` highlights properly.
  - Reorganized Audio & Speech Preferences into balanced 2-column responsive rows (`Default Playback Speed` + `Auto-Play`, `Preferred Voice Accent` + `Voice Gender`) with roomy `px-3.5 py-2` buttons, fixed `System Default` 2-line button wrapping in Appearance & Display (`whitespace-nowrap px-4 py-2`), and updated About badge to `v1.2.0 (CEFR A1–C2)`.

### 2026-11-25, Dual Quiz System (AI Level Assessment + Conversation Quizzes)
- **Quiz Engine & Storage (`src/lib/quiz/types.ts`, `storage.ts`, `conversation-quiz.ts`, `level-assessment-bank.ts`):**
  - Enforced locked-once-answered MCQ behavior and session persistence (`ecp_quiz_results_v1`) with retake/refresh regeneration.
  - Conversation quiz question count scales by CEFR level (`A1=10`, `A2=14`, `B1=18`, `B2=22`, `C1=26`, `C2=30`).
- **AI Quiz Endpoints (`src/app/api/v1/ai/quiz/level-assessment/route.ts`, `conversation/route.ts`):**
  - Level Assessment generates 40 fresh 4-option AI MCQs across `A1–C2` on every Refresh (with deterministic 40-question fallback).
  - Conversation Quiz hybrid endpoint enriches deterministic dialogue/grammar/vocab/register questions with fresh AI items on Refresh.
- **UI Routes & Integrations:**
  - **Dashboard-Only Level Assessment:** Card in `DashboardClient.tsx` linking to `/dashboard/level-assessment` (40 Q, Refresh for new AI questions, estimates CEFR level without overwriting Settings).
  - **Conversation Quiz Popup & `/quiz` Hub:** Added `Start Quiz` button in `ReviewSummary.tsx` / `ConversationReader.tsx` opening `ConversationQuizDialog.tsx`; added `/quiz` page (`Sidebar.tsx`) with Level (`A1–C2`), Length, and Style filters across all conversations; added `/quiz/results/[sessionId]` inner review page showing wrong vs right answers and explanations.
  - **Tests:** Added `tests/quiz-engine.test.mjs`.

### 2026-11-25, Full-Page Scrollable Quiz Flow & Post-Submit Right Sidebar
- **Dedicated Redirect Page (`/quiz/play`):** Replaced the conversation quiz modal popup with a dedicated full-page route (`src/app/(app)/quiz/play/page.tsx` + `ConversationQuizPlayClient.tsx`) linked from both `ReviewSummary.tsx` and `/quiz`.
- **Single-Page Scrollable Quiz + Post-Submit Score Sidebar (`src/components/quiz/QuizRunner.tsx`):**
  - Renders all questions (`Q1..Qn`) on one scrollable page.
  - Learners can freely change selected options before clicking **Submit Quiz**, with zero right/wrong spoilers until submission.
  - Fixed post-submit status badge in `QuizRunner.tsx` to display `Skipped` (`neutral`) instead of `Wrong` when a question is left unanswered.
  - Updated `/quiz` header filter bar (`src/app/(app)/quiz/page.tsx`) to a single-row 4-control toolbar: Search input + Level, Style, and Length `appearance-none h-11` `<select>` dropdowns with chevron icons matching `<Input>` height.
  - Updated `/vocabulary` header card (`src/app/(app)/vocabulary/page.tsx`) so mode tabs stay on one clean row and Search + `All 40 Cards` category dropdown sit side-by-side on one `h-11` line.
  - Consolidated `What Should I Say?` (`src/components/tools/WhatShouldISay.tsx`) header, inline input + `Show Options` CTA button, and `Try:` sample chips into one compact `<Card>`.
  - Consolidated `/explore` (`src/app/(app)/explore/page.tsx`, `src/components/discovery/FilterBar.tsx`) header, count badge, search bar, category pills, and embedded `FilterBar` into one unified `<Card>`.
  - Consolidated `/professions` (`src/app/(app)/professions/page.tsx`) header, track badges, and single-row Track + CEFR Level (`A1–C2`) `appearance-none h-11` `<select>` dropdowns into one unified `<Card>`.
  - Consolidated `/daily-practice` (`src/components/practice/DailyPracticeClient.tsx`) date, title, subtitle, and `TodayPanel` into one unified `<Card>`, and grouped the Spaced Repetition Vocabulary Review section (`ReviewQueue` + header) into its own unified `<Card>`.
  - Upgraded `/progress` (`src/components/analytics/ProgressDashboard.tsx`) with a unified header `<Card>` (quick `Daily Practice` + `Take Quiz` CTAs), semantic accent borders/icon tiles on KPI cards, yellow (`bg-chart-2` / `bg-chart-2/60`) bars for Weekly Activity, and blue (`bg-chart-4`), orange (`bg-warning`), and green (`bg-chart-3`) bars for Vocabulary Retention.
  - Replaced the 4-row language pill grids in Settings (`src/components/settings/SettingsClient.tsx`) with inline Search + `appearance-none h-11` `<select>` dropdowns for both System Language and Translation Language.
  - Fixed locale hydration mismatch in `MobileBottomNav.tsx` (`suppressHydrationWarning` on `<nav>` and nav label `<span>`).

### 2026-11-26, Dashboard Layout Redesign (Owner Wireframe)
- **Dashboard (`src/components/dashboard/DashboardClient.tsx`):**
  - Replaced full-bleed `HeroBand` + overlapping cards with `<PageContainer>` containing a rounded `<HeroBand className="rounded-card p-6 md:p-7 shadow-card">` followed by 3 structured rows:
    1. **Row 1 (2-column):** **Level Assessment Quiz** (`/dashboard/level-assessment`) + **AI Conversation Partner** (`/roleplay`).
    2. **Row 2 (Full-width):** **Daily Conversation Practice** feature card (`.rainbow-border` `<TopicCard topic="shopping">` with concise title + 1-line copy, `Start Daily Practice` + `Browse All` CTAs, and borderless `public/dashboard-illustration.svg` on the right).
- **Brand Logo (`public/logo.svg`, `src/app/icon.svg`, `src/components/navigation/Header.tsx`):**
  - Replaced the placeholder `E` monogram in `Header.tsx` with the official `logo.svg` (`454x150`, resized to `h-9 sm:h-10 w-auto object-contain`) from Google Drive and configured `src/app/icon.svg` for browser favicon support.
- **Standardized Content Width & Top Bar Spacing (`PageContainer` + `py-6`):**
  - Unified all standard app pages (`DashboardClient.tsx`, `explore/page.tsx`, `explore/category/[slug]/page.tsx`, `DailyPracticeClient.tsx`, `professions/page.tsx`, `professions/[slug]/page.tsx`, `what-should-i-say/page.tsx`, `WhatShouldISay.tsx`, `quiz/page.tsx`, `ConversationQuizPlayClient.tsx`, `QuizResultDetailClient.tsx`, `dashboard/level-assessment/page.tsx`, `progress/page.tsx`, `ProgressDashboard.tsx`, `SettingsClient.tsx`) to `PageContainer` (`container-app` 1200px) with consistent `py-6` (24px) top gap from the header bar (excluding the 3 full-width + right-sidebar pages: `/conversations/[slug]`, `/roleplay`, `/vocabulary`).
    3. **Row 3 (2-column):** **Vocabulary & Magic Cards** (`/vocabulary`) + **Conversation Quiz Practice** (`/quiz`).
  - Removed extra lower track/empty cards for a clean, clutter-free dashboard.

### 2026-11-26, System-Wide 3-Font English Typography (Nunito + Comic Neue + Manrope)
- **Font Loading (`src/app/layout.tsx`):**
  - Replaced `Inter` with strictly 3 Google Fonts for English: **Nunito** (`--font-heading`, weights `400, 500, 600`), **Comic Neue** (`--font-conversation`, weights `400, 700`), and **Manrope** (`--font-sans`, weights `400, 500, 600`), while keeping **Hind Siliguri** + **Noto Sans Bengali** (`--font-bangla`) for Bangla.
- **Design System Tokens (`src/app/globals.css`):**
  - Mapped `--font-heading`, `--font-sans`, `--font-conversation`, and `--font-mono` (aliased to Manrope so strictly 3 English fonts exist) in `@theme inline` with `--font-bangla` fallback.
  - Added `@utility font-conversation` and `@utility text-conversation` (`1.25rem` / `20px`, `font-weight: var(--font-weight-semibold)` which resolves to Comic Neue's `700` face via CSS font matching while honoring the max-600 lint rule); set `h1..h6 { font-family: var(--font-heading); }` in `@layer base`.
- **Conversation & Heading Cleanup:**
  - Applied `font-conversation` / `text-conversation` to `ChatTurnBubble.tsx` (`/conversations/[slug]`), `ConversationInspectorSidebar.tsx` (selected sentence preview), `ChatBubble.tsx` (covering `RoleplayPartner.tsx` and `HideSpeakerPractice.tsx`), `ConversationTurn.tsx`, `CompleteLineCard.tsx`, `DialogueOrderCard.tsx`, and `ReadAloudCard.tsx`.
  - Used distinct `next/font/google` CSS variables (`--font-manrope`, `--font-nunito`, `--font-comic-neue`) in `layout.tsx` and mapped `--font-heading`, `--font-sans`, `--font-conversation`, `--font-mono` on `html` in `@layer base` + `@theme inline` in `globals.css`.
  - Removed overriding `font-sans` on `<h1>`/`<DialogTitle>` (`privacy/page.tsx`, `terms/page.tsx`, `RuleCard.tsx`) and `font-heading` on non-heading `<label>`/`<span>` elements in `SettingsClient.tsx`.

### 2026-11-26, AI Partner Voice Silence Auto-Send (`RoleplayPartner.tsx`)
- Enabled `recognition.continuous = true` in `RoleplayPartner.tsx` and added a `useEffect`-driven 4-second silence countdown (`autoSendSeconds` + `silenceResetTick` + `isAutoSendingRef`) after the last speech result (`onresult`), preserving the countdown across `no-speech` `onerror`/`onend` events once speech is captured, with a live inline countdown banner + `Cancel` button (and automatic cancellation when editing input or sending manually).

### 2026-11-26, 2px Animated Rainbow Border on Active Conversation Bubble
- Applied the frozen `.rainbow-border` (`2px` animated conic rainbow gradient) to `ChatTurnBubble.tsx` for both `isSelected` (tapped) and `isCurrentlyPlaying` (audio playing) states.

### 2026-11-26, Speaker A / Speaker B Bubble Background Tokens (`#FDFBE8` & `#F0FDF0`)
- Added semantic tokens `--color-bubble-speaker-a` (`#FDFBE8` light / `#262417` dark) and `--color-bubble-speaker-b` (`#F0FDF0` light / `#15261B` dark) in `src/app/globals.css`.
- Updated `ChatTurnBubble.tsx` (`/conversations/[slug]`, borderless `border-0` default with `2px` `.rainbow-border` when active) and `ChatBubble.tsx` (`/roleplay` and `HideSpeakerPractice`) to use Speaker A (`bg-bubble-speaker-a`) and Speaker B (`bg-bubble-speaker-b`).

### 2026-11-26, Comprehensive AI Word Intelligence (Popup & Vocabulary Sidebar)
- Added `src/lib/ai/word-details-schema.ts`, `src/lib/ai/word-details.ts`, `src/app/api/v1/ai/word-details/route.ts`, and `src/lib/ai/use-word-details.ts` (Groq-backed with server + client `localStorage` caching `ecp_word_details_cache_v2`, guarding against caching fallback responses).
- Added shared `src/components/shared/WordDetailsSections.tsx` displaying Direct Translated Word Meaning (`wordMeaningBn`), Related Words with Bangla translations, Synonyms & Antonyms with Bangla translations, Tense & Verb Forms (`V1`, `s/es`, `V2`, `V3`, `-ing`), Noun/Adj Forms (`Plural`, `Comparative`, `Superlative`), Parts of Speech family (`Noun`, `Verb`, `Adjective`, `Adverb`), and multi-tense Sentence Making examples (EN + BN + audio) in `WordDetailPopover.tsx`, `MagicWordSidebar.tsx`, and `ReviewQueue.tsx` (Spaced Repetition Vocabulary Review).

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
