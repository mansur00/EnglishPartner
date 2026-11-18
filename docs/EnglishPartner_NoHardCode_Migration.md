# EnglishPartner: No Hard-Code Policy and Token Migration

> Note (18 Nov 2026): Poppins was removed from the project per D-02. The lines below are the historical record and are not current.

Detailed specification for making the whole UI driven by a single design system. Companion to `docs/PROJECT_STATE.md` (which wins if the two ever disagree), `EnglishPartner_Design_System_v2.md`, and `EnglishPartner_Agent_Spec.md`.

Owner rule (permanent): **nothing visual is hard-coded anywhere.** Colors, font sizes, font weights, radius, layout sizes, shadows, motion, and z-index are defined once in the design system (tokens, Tailwind `@theme` / `@utility`, components, variants) and used from there. Changing one definition must change every place that uses it.

---

## 0. How to use this document

1. Read `docs/PROJECT_STATE.md` first, then this file.
2. This file is executed in **two stages**. Stage 1 ends with a STOP and a report. Stage 2 starts only after the owner approves.
3. Update `docs/PROJECT_STATE.md` after every task (done list, pending queue, session log).
4. Evidence only: raw command output, computed styles, measured numbers, screenshots as files. No claims without proof.
5. Frozen items stay frozen (section 9).

---

## 1. The policy

### 1.1 Scope
- **Feature code (strict):** `src/app/**`, `src/components/**` (except `src/components/ui/**`), `src/lib/**`.
- **UI primitives (`src/components/ui/**`, shadcn):** may use Tailwind scale utilities (`text-sm`, `h-9`) only if the scale resolves through our tokens (via `@theme`). No raw colors, no arbitrary values, no hard-coded literals.
- **Token definition files only** may contain raw values: `src/styles/design-tokens.css` and the `:root`, `.dark`, `[data-topic]` blocks in `src/app/globals.css`.

### 1.2 Violations (feature code)

| Rule | What counts as a violation |
| --- | --- |
| **a. Colors** | Any hex (3/4/6/8 digit), `rgb()`/`rgba()`/`hsl()`/`oklch()` literals, Tailwind palette colors (`bg-white`, `text-black`, `bg-slate-100`, `text-emerald-600`), opacity on raw colors (`bg-white/10`), arbitrary colors (`bg-[#fff]`), `bg-[var(--x)]` style arbitrary token use, SVG `fill`/`stroke` literals, inline style colors |
| **b. Typography** | Arbitrary `text-[..]`, `leading-[..]`, `tracking-[..]`, `font-[..]`, inline `fontFamily`/`fontSize`/`fontWeight`, and direct scale utilities (`text-sm`, `text-lg`, `text-2xl`, `font-medium`, `font-semibold`) in feature code. Use semantic text styles only |
| **c. Radius** | `rounded-[..]` and raw `rounded-md/lg/xl/2xl/3xl` in feature code. Use semantic radius utilities only |
| **d. Layout constants** | Arbitrary `[Npx]` / `calc()` values and magic numbers for header height, sidebar width, container width/padding, band overlap, tap target sizes, marker/tile/segment sizes, z-index, shadows, durations, easing |
| **e. Inline styles** | `style={{...}}` with visual properties. Allowed only for truly dynamic values (for example a progress width) passed as a CSS variable |
| **f. Duplication** | The same className string (40+ characters) repeated 3 or more times; repeated container/band/panel/chip/bubble/CEFR/topic patterns. Must become a component or a `cva` variant |
| **g. TS data files** | Data files (`category-theme.ts`, CEFR maps, scenarios) must return keys and slugs only, never color or size values |
| **h. Dark mode** | No `dark:` prefix combined with raw color classes. Every token has light and dark values in one place |
| **i. UI primitives** | Primitives with unmapped or hard-coded values (for example `dark:bg-amber-950/40` in `badge.tsx`, `h-13 px-8` in `button.tsx`) |

### 1.3 Allowed
- The normal Tailwind spacing scale (`p-4`, `gap-3`, `mt-6`) because it is itself a token scale (`--spacing`). Layout *constants* (header, sidebar, container, overlap, tap target) are NOT allowed as spacing-scale numbers; they need named tokens.
- `currentColor` for icons/SVG.
- Dynamic runtime values passed through a CSS variable.
- The FROZEN `.rainbow-border` block (explicitly exempted by marker comment, never edited).

---

## 2. Audit results (baseline, from the agent's own audit)

Total: **1,154** hard-coded instances in feature code.

| Rule | Count | Main files |
| --- | ---: | --- |
| a. Colors | 222 | admin edit page, `conversations/[slug]/page.tsx`, `vocabulary/page.tsx`, `DashboardClient.tsx` |
| b. Typography | 652 | `conversations/[slug]/page.tsx`, category page, `DashboardClient.tsx`, admin |
| c. Radius | 142 | `explore/page.tsx`, `vocabulary/page.tsx`, `page.tsx`, `AdminDashboardClient.tsx` |
| d. Layout constants | 85 | `Header.tsx`, `Sidebar.tsx`, `explore/page.tsx`, reader page |
| e. Inline styles | 0 | none (only runtime CSS-variable bindings) |
| f. Duplication | 19 | `ScenarioCard.tsx`, `CategoryPills.tsx`, `ConversationTurn.tsx`, `AdminDashboardClient.tsx` |
| g. TS data files | 0 | none |
| h. Dark mode raw colors | 17 | `ScenarioCard.tsx`, `GrammarPanel.tsx`, `vocabulary/page.tsx` |
| i. UI primitives | 17 | `badge.tsx`, `button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx` |

Mutation test baseline (token overridden at runtime, then check if every element that should change did change):

| Token mutated | Result before migration |
| --- | --- |
| `--radius-card` to 0 | Failed on all routes |
| `--radius-control` to 0 | Failed on all routes |
| `--font-weight-heading` to 300 | Failed on all routes |
| `--text-page-title` size to 60px | Failed on all routes |
| `--header-h` to 96px | Failed on all app routes |
| `--container-max` to 800px | Failed on all app routes |
| `--topic-tile` to lime | Passed (this is the model of correct behavior) |
| `--sun-500` to cyan | Failed on 2 routes |
| `--brand-800` to hotpink | **Not run (must be added)** |

### 2.1 Corrections the agent must make to its audit report
1. Add the missing `--brand-800 -> hotpink` mutation to every run. Report per mutation the **actual list of elements that did not change** (selector or text snippet, route, file hint), not just a summary.
2. The route list claimed `/` has a Hero, Feature cards, and Footer, and that Explore has a "Filter drawer". Phase 1E (landing page) is not done, and `/` was a developer test page. State exactly what `/` and Explore currently render and correct the audit where it was wrong.
3. Screenshots must be files the owner can open (copy to `docs/screenshots/`, git-ignored), not only absolute local paths.

---

## 3. Target architecture

### 3.1 Single source of truth
- Every token is defined **once** in `:root` / `.dark` (or `[data-topic]`). Utilities use `var(--token)` with **no fallback literals** (no `var(--radius-card, 16px)`). A fallback is a second copy of the value.
- All color tokens are exposed to Tailwind through `@theme inline` so utilities exist (`bg-topic-tile`, `text-topic-ink`, `bg-cefr-a1`, `bg-band-panel`). Arbitrary `bg-[var(--x)]` is removed.
- Legacy `--ecp-*` tokens and classes (`text-ecp-text-primary`, `bg-[var(--ecp-canvas)]`) are migrated away. Aliases may exist only inside the token file until usage is zero, then they are deleted. Track the remaining count in `PROJECT_STATE.md`.

### 3.2 Token catalog

#### Radius
| Token | Value | Utility |
| --- | --- | --- |
| `--radius-card` | `1rem` | `rounded-card` |
| `--radius-panel` | `0.75rem` | `rounded-panel` |
| `--radius-control` | `0.75rem` | `rounded-control` |
| `--radius-bubble` | `0.75rem` | `rounded-bubble` |
| `--radius-bubble-tail` | `0.25rem` | `rounded-bubble-tail-tl`, `rounded-bubble-tail-tr` |
| `--radius-band` | `1.5rem` | `rounded-band` (bottom corners) |
| `--radius-pill` | `9999px` | `rounded-pill` |

#### Typography (family, weight)
| Token | Value |
| --- | --- |
| `--font-heading` | Poppins |
| `--font-body` | Inter |
| `--font-bangla` | Hind Siliguri |
| `--font-weight-regular` | 400 |
| `--font-weight-medium` | 500 |
| `--font-weight-semibold` | 600 (**maximum allowed**) |
| `--font-weight-heading` | `var(--font-weight-semibold)` |

#### Semantic text styles (`@utility`, each bakes in size, line-height, weight, tracking, family)
| Utility | Size | Line height | Weight | Notes |
| --- | --- | --- | --- | --- |
| `text-page-title` | `clamp(1.625rem, 1.3rem + 1vw, 2.125rem)` | 1.2 | heading | tracking -0.01em, Poppins |
| `text-hero-title` | `clamp(1.375rem, 1.2rem + 0.8vw, 1.875rem)` | 1.25 | heading | tracking -0.01em |
| `text-card-title` | 1.25rem | 1.35 | heading | |
| `text-lead` | 1.125rem | 1.7 | **400** | learning content (dialogue). 500 only for a separate emphasis utility |
| `text-body` | 1rem | 1.6 | 400 | |
| `text-meta` | 0.875rem | 1.5 | 500 | descriptions, meta rows |
| `text-label` | 0.875rem | 1.4 | 600 | buttons, form labels |
| `text-chip` | 0.75rem | 1.3 | 600 | **12px floor**, badges/chips/nav labels only |
| `text-stat` | 1.75rem | 1 | heading | streak number (28px) |
| `text-bangla` | inherits size | 1.75 | inherits | sets `--font-bangla` |

Weights are referenced through the weight tokens, so changing `--font-weight-heading` changes every heading.

#### Layout and sizing
| Token | Value | Utility |
| --- | --- | --- |
| `--header-h` | 4rem | `h-header`, `top-header` |
| `--sidebar-w` | 16rem | `w-sidebar` |
| `--container-max` | 64rem | `container-app` |
| `--container-px` | 1rem (sm 1.5rem, md 2rem via media queries in `:root`) | part of `container-app` |
| `--band-overlap` | 1.5rem | `overlap-band` |
| `--tap-min` | 2.75rem | `min-h-tap`, `min-w-tap`, `size-tap` |
| `--control-h-sm` / `-md` / `-lg` | 2.25 / 2.75 / 3.25rem | `h-control-sm|md|lg` |
| `--input-h` / `--select-h` | 3rem / 2.75rem | `h-input`, `h-select` |
| `--marker-size` | 1.75rem | `size-marker` |
| `--tile-size` | 3rem | `size-tile` |
| `--segment-h` | 0.5rem | `h-segment` |

#### Elevation, motion, layers
| Token | Notes |
| --- | --- |
| `--shadow-card` | single soft diffuse shadow (no 3D), light and dark values |
| `--dur-fast` / `--dur-base` | 150ms / 200ms, utilities `duration-fast`, `duration-base` |
| `--ease-standard` | one easing curve, utility `ease-standard` |
| `--z-sidebar` / `--z-header` / `--z-overlay` / `--z-modal` / `--z-toast` | 30 / 40 / 50 / 60 / 70, utilities `z-sidebar` etc. |

#### Color tokens (light and dark values, all in the token file)
- Brand: `--brand-50 ... --brand-950`, `--sun-100 ... --sun-700` (existing).
- shadcn mapping: `--background`, `--foreground`, `--card`, `--primary`, `--secondary`, `--accent`, `--muted`, `--muted-foreground`, `--border`, `--ring` (existing).
- Topic: `--topic-surface/tile/border/accent/ink` per `[data-topic]` (existing).
- **Status (new):** `--success`, `--warning`, `--info`, `--danger`, each with `-bg` and `-ink`, light and dark. Replaces `text-emerald-600`, `dark:bg-amber-950/40` and similar.
- **CEFR (new):** `--cefr-a1 ... --cefr-c2`, each with `-bg`, `-ink`, `-border`, light and dark. Starting light values (agent derives dark and verifies 4.5:1 for text):

| Level | bg | ink | border |
| --- | --- | --- | --- |
| A1 | `#E3F6EA` | `#14663F` | `#B5E4C8` |
| A2 | `#E2EEFF` | `#1D4E96` | `#BCD6F8` |
| B1 | `#FFF1CC` | `#7A5200` | `#F3D98A` |
| B2 | `#FFE4D0` | `#8A3D06` | `#F5C29C` |
| C1 | `#EEE2FB` | `#4A1D6E` | `#D3BCF0` |
| C2 | `#FFE0E8` | `#9A2546` | `#F7B9C9` |

- **Band panel (new):** `--band-panel-bg`, `--band-panel-border`, `--band-panel-ink`, `--band-segment-empty` for the Today panel on the violet band (replaces `bg-white/10`, `border-white/15`, `bg-white/20`).
- Grammar tokens `--gram-*` stay separate and arrive in Phase 2.

#### Example definitions (Tailwind v4)
```css
/* tokens: ONE place, no fallbacks elsewhere */
:root {
  --radius-card: 1rem;
  --radius-control: 0.75rem;
  --header-h: 4rem;
  --container-max: 64rem;
  --container-px: 1rem;
  --font-weight-heading: 600;
}
@media (min-width: 640px)  { :root { --container-px: 1.5rem; } }
@media (min-width: 768px)  { :root { --container-px: 2rem; } }

@theme inline {
  --color-topic-tile: var(--topic-tile);
  --color-topic-ink: var(--topic-ink);
  --color-cefr-a1-bg: var(--cefr-a1-bg);
  --color-band-panel: var(--band-panel-bg);
}

@utility rounded-card    { border-radius: var(--radius-card); }
@utility rounded-control { border-radius: var(--radius-control); }
@utility h-header        { height: var(--header-h); }
@utility container-app   { max-width: var(--container-max); margin-inline: auto; padding-inline: var(--container-px); }
@utility text-page-title {
  font-family: var(--font-heading);
  font-size: clamp(1.625rem, 1.3rem + 1vw, 2.125rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  font-weight: var(--font-weight-heading);
}
```

### 3.3 Shared components (cva variants where needed)
| Component | Replaces |
| --- | --- |
| `PageContainer` | the repeated `max-w-5xl mx-auto px-4 sm:px-6 md:px-8` |
| `HeroBand` | the violet curved band (gradient `from-brand-800 to-brand-900`, `rounded-band`, overlap handled by `overlap-band`) |
| `TodayPanel` | streak number + 7 markers + 10-segment minute bar (uses band-panel tokens and `size-marker`, `h-segment`) |
| `TopicCard` | scenario/topic cards with `data-topic` applied automatically |
| `EmojiTile` | icon/emoji box (`size-tile`, `rounded-control`, topic tile/border/ink) |
| `CefrChip level="A1..C2"` | CEFR chips (tokens, `text-chip`, `rounded-pill`) |
| `ChatBubble speaker="1\|2"` | dialogue bubbles (`rounded-bubble` plus tail corner) |
| `Panel` | nested panels (`rounded-panel`, token border and background) |
| `Heading` / `Text` (optional) | enforce semantic text styles |

TS helpers (`category-theme.ts`, CEFR map) return **keys/slugs/emoji only**. Colors live in CSS.

---

## 4. Migration cookbook (before to after)

| Before | After |
| --- | --- |
| `<h1 className="text-3xl font-semibold ...">` | `text-page-title` |
| hero card title | `text-hero-title` |
| card titles (`text-xl font-semibold`) | `text-card-title` |
| dialogue lines, learning text | `text-lead` (+ `text-bangla` for Bangla) |
| paragraphs | `text-body` |
| descriptions, meta rows (`text-sm text-muted-foreground`) | `text-meta text-muted-foreground` |
| buttons/labels | `text-label` |
| badges/chips (`text-xs`) | `text-chip` |
| streak number | `text-stat` |
| `bg-white` | `bg-card` |
| `text-black` | `text-foreground` |
| `bg-[var(--ecp-canvas)]` | `bg-background` |
| `text-ecp-text-primary` | `text-foreground` |
| `text-emerald-600` + `dark:text-emerald-400` | `text-success` (token handles dark) |
| `bg-white/10`, `border-white/15` (Today panel) | `bg-band-panel`, `border-band-panel-border` |
| `bg-[var(--topic-tile)] text-[var(--topic-ink)]` | `bg-topic-tile text-topic-ink` |
| `rounded-[16px]`, `rounded-2xl` on cards | `rounded-card` |
| `rounded-[12px]`, `rounded-xl` on controls and panels | `rounded-control` / `rounded-panel` |
| `rounded-[12px] rounded-tl-[4px]` (bubble) | `<ChatBubble>` |
| `rounded-full` on chips, avatars, markers | `rounded-pill` |
| `max-w-5xl mx-auto px-*` | `<PageContainer>` / `container-app` |
| `h-16`, `top-16` | `h-header`, `top-header` |
| `w-64` | `w-sidebar` |
| `h-[calc(100dvh-4rem)]` | `h-[calc(100dvh-var(--header-h))]` wrapped in one utility (`h-below-header`) |
| `-mt-6` for band overlap | `overlap-band` |
| `w-11 h-11` | `size-tap` or `size-control` as appropriate |
| `w-7 h-7` | `size-marker` |
| `w-12 h-12` | `size-tile` |
| `h-13 px-7` in `button.tsx` | `h-control-lg` and token padding |

---

## 5. Tooling

### 5.1 `scripts/check-tokens.mjs` (`npm run lint:tokens`, chained into `npm run lint`)
- Implements rules a to i from section 1.2. Scans `.css`, `.tsx`, `.ts`, `.mdx` under the scopes in 1.1.
- Output: count per rule, and `file:line` for every violation. Non-zero exit if any violation remains outside the allowlist.
- **Explicitly exempts the FROZEN `.rainbow-border` block** by marker comment. It never edits it.
- Duplication check: finds className strings of 40+ characters repeated 3+ times.
- `scripts/token-allowlist.json`: no wildcard entries; every entry has a written reason; the total allowlist size is printed in every run; the script fails if the size grows without owner approval.
- Existing guards stay green: `npm run check:frozen`, `npm run lint:ui`, `npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run build`.

### 5.2 Token mutation test (`scripts/token-mutation-test.mjs`)
Run in headless Chrome by injecting overrides (for example `page.addStyleTag`). One mutation at a time, across all routes and states below, at 1280px, light and dark. Revert after each run (the working tree diff must be empty).

| # | Mutation | Expectation |
| --- | --- | --- |
| 1 | `--brand-800` to hotpink | every violet surface/control changes |
| 2 | `--sun-500` to cyan | every yellow CTA/highlight changes |
| 3 | `--radius-card` to 0px | every card/hero changes |
| 4 | `--radius-control` to 0px | every button, input, select, tab changes |
| 5 | `--font-weight-heading` to 300 | every heading changes |
| 6 | `--text-page-title` size to 60px | every H1 changes |
| 7 | `--header-h` to 96px | header, sidebar offset, sticky positions change |
| 8 | `--container-max` to 800px | every page container changes |
| 9 | `--topic-tile` (one topic) to lime | every tile/chip for that topic changes (already passes) |

Report, per mutation and per route, the **list of elements that did not change** (selector or text, route, file hint). Final goal: zero unchanged elements.

### 5.3 Visual regression (`scripts/visual-diff.mjs`)
- Baseline captured **before any change** into `docs/screenshots/baseline/`.
- Capture set: `/`, `/dashboard`, `/explore`, a category page, a conversation page (reader and practice steps), `/vocabulary`, admin pages, and overlays (Dialog, Sheet, word popover, auth modal); light and dark; 1280px and 360px; include hover, focus, and active states for key controls.
- Compare with pixelmatch (or equivalent): report changed regions and percentage. Also snapshot computed styles (card, button, input, H1, hero title, chips, bubbles, sidebar, header) as JSON and diff them.
- After every migration step: run `visual-diff` and explain every difference. Intended differences (for example the Today panel redesign) must be named; anything else is a regression to fix.

---

## 6. Stages

### Stage 1 (then STOP and report)

**Step 0: baseline.** Capture baseline screenshots and computed-style JSON. Add `visual-diff.mjs`. Apply the audit report corrections from section 2.1.

**Step 1: tokens and utilities.** Add all tokens (3.2), `@theme inline` color mapping, and `@utility` definitions to the token file. No fallbacks. No visual change allowed. Run `visual-diff`: must be about 0.

**Step 2: UI primitives.** Migrate `button`, `card`, `badge`, `input`, `select`, `dialog`, `sheet`, `tabs`, `popover`, `tooltip`, `switch`, `skeleton`, `sonner` to semantic utilities and tokens (remove `h-13` literal, `dark:bg-amber-950/40`, raw radius). Run `visual-diff`, explain every difference.

**Step 3: shared components + Dashboard.** Build `PageContainer`, `HeroBand`, `TodayPanel`, `TopicCard`, `EmojiTile`, `CefrChip`, `ChatBubble`, `Panel`. Use them on the Dashboard. Run `visual-diff` and `lint:tokens`.

**Stage 1 report must include:**
- `lint:tokens` counts per rule, before and after
- `visual-diff` results
- All 9 mutations, with element lists, for the routes migrated so far
- Allowlist size
- `--ecp-*` remaining usage count
- Updated `docs/PROJECT_STATE.md`
- Screenshots as openable files

### Stage 2 (only after owner approval)
- **Step 4:** migrate all remaining feature code page by page: explore, category, reader, practice, vocabulary, admin, modals. One commit per group, `visual-diff` after each.
- **Step 5:** remove all `--ecp-*` usage, then delete the aliases.
- **Step 6:** `lint:tokens` at zero for rules a to i, mutation test with zero unchanged elements, allowlist minimal.
- **Step 7:** generate `docs/design-tokens.md` (token to utility to where used) and update `docs/PROJECT_STATE.md`.

---

## 7. Acceptance criteria (the migration is done when)

- [ ] `npm run lint:tokens` reports 0 violations for rules a to i; allowlist minimal, each entry justified
- [ ] Mutation test: all 9 mutations show 0 unchanged elements on all routes, light and dark
- [ ] `visual-diff`: only intended differences remain, each explained
- [ ] No `--ecp-*` tokens or classes remain
- [ ] No fallback literals in `var(--x, literal)`
- [ ] No `rounded-[..]`, `text-[..]`, `bg-[#..]`, `[Npx]` layout constants in feature code
- [ ] Max font weight 600, min font 12px (`lint:ui` green)
- [ ] `.rainbow-border` unchanged (`check:frozen` green, raw diff pasted)
- [ ] `tsc`, `lint`, `lint:ui`, `lint:tokens`, `check:frozen`, `test`, `build` all green (80+ routes)
- [ ] `docs/design-tokens.md` generated; `docs/PROJECT_STATE.md` updated

---

## 8. Report format (every task)

1. What changed (files, tokens, components)
2. Commands run with raw output (not summaries)
3. Numbers: violation counts before and after, mutation results, visual-diff percentages
4. Screenshots as files in `docs/screenshots/`
5. Open questions
6. `PROJECT_STATE.md` session log entry added

---

## 9. Frozen and standing rules

- `.rainbow-border` block: never edit, must follow card radius via `border-radius: inherit` (verified earlier), `check:frozen` stays green.
- Max font weight 600, no bold anywhere. Min font size 12px (chips, badges, nav labels only), secondary text at least 14px.
- Radius scale: card 16, panel/control/bubble 12, band 24, pill only for chips/badges/avatars/progress/markers.
- Fixed desktop sidebar; Today panel design as specified in `PROJECT_STATE.md`.
- No 3D styling. Hugeicons only. shadcn components near-stock, customized through tokens.
- Do not start Phase 1E (landing page) or Phase 2 (grammar color-coding) until the owner approves.

---

## 10. Message to the agent (copy-paste)

```
Read docs/PROJECT_STATE.md, then EnglishPartner_NoHardCode_Migration.md fully.
Execute Stage 1 (steps 0 to 3) and STOP with the report described in section 6
and section 8. Include the corrections in section 2.1 (the missing --brand-800
mutation with per-element lists, the real contents of / and Explore, screenshots
as openable files). Do not start Stage 2 until I approve. Update
docs/PROJECT_STATE.md after every task. Keep .rainbow-border untouched.
```

