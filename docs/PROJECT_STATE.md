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
  - Load only 400/500/600 for Poppins, Inter, Hind Siliguri (drop 700 from `next/font` config).
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
10. **[PENDING] Phase 2:** grammar color-coding (see section 6).

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
  - `src/app/layout.tsx`: removed weight 700 from font loaders (Poppins, Hind Siliguri).
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
- Commit: pending
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
