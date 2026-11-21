# EnglishPartner — Agent Spec

Redesign the UI on the shadcn/ui design system, add a toggleable Grammar Color-Coding feature, and make the UI colorful and engaging.

Primary references:
- shadcn/ui repo: https://github.com/shadcn-ui/ui
- shadcn/ui docs: https://ui.shadcn.com (single source of truth for components, theming, CLI)
- Project repo: https://github.com/mansur00/EnglishPartner.git

---

## 0. How to work

1. Work in small, reviewable commits, one per phase or sub-phase.
2. After every sub-phase run `npx tsc --noEmit`, `npm run lint`, `npm run build`, `npm run test`. Report results as a table.
3. Never break existing functionality. All static conversation routes (80+) must still pre-render.
4. If something is ambiguous, ask before assuming.
5. After each sub-phase, stop and report: what changed, files touched, how to verify visually. Wait for approval where this spec says "STOP".
6. Do not claim things you have not verified (e.g. contrast compliance, bundle size). Compute or measure them and show the numbers.
7. Keep stock shadcn components as close to stock as possible. Put brand customization in CSS variables/tokens and in wrapper components, not by rewriting shadcn files. Show the diff for any stock file you edit.

---

## 1. Project facts (from Phase 0 audit)

| Area | State |
| --- | --- |
| Framework | Next.js 16.x (App Router, Turbopack), React 19, async `params` |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`), brand tokens `--ecp-*` in `src/styles/design-tokens.css` |
| Icons | Hugeicons (`@hugeicons/react`, `@hugeicons/core-free-icons`). `components.json` uses `"iconLibrary": "hugeicons"`. Keep Hugeicons. |
| Theme | Was light-only; dark mode tokens now being added |
| State | Local state + `localStorage` (`ecp_saved_vocabulary`, `ecp_completed_steps`) |
| Layout | `AppShell` with sticky `Header`, desktop `Sidebar`, `MobileBottomNav`; route groups `/(app)`, `/(admin)`, `/(public)` |
| NLP | Python helper at `services/nlp/nlp_helper.py` (spaCy) |
| Dialogues | 80+ static conversation paths, English + Bangla (EN + BN) |

Known UX problems found in the audit:
- Sidebar: 5 of 8 links are "Soon" placeholders; no mobile sheet/drawer for full menu; header controls lack `aria-expanded` / `aria-haspopup`; no theme toggle.
- Root page `/` is a developer test harness ("Phase 0 Setup Verified"), not a learner landing page.
- Custom modals (`AuthPromptModal`, `GrammarPanel`, `WordDetailPopover`) lack focus trapping, proper ARIA wiring, and animations. `WordDetailPopover` is a blocking full-screen modal even for single-word lookups.
- Explore: raw `<input>` and native `<select>` elements; no skeleton loading; filter chips not keyboard accessible.
- Practice: ad-hoc buttons instead of `RadioGroup`/`Card` selection states; status banners use hard-coded colors instead of `Alert`.
- Hard-coded light hex values in badges and borders.

---

## 2. Status

| Step | Status |
| --- | --- |
| Phase 0 audit | Done, approved with changes (see section 3) |
| Phase 1A shadcn init + token mapping | Done (commit `2aa7102`) |
| Phase 1B core shadcn components installed | Done (commit `2aa7102`) |
| Review fixes (section 4) | TODO |
| Padding bug + visual identity (sections 5, 6, 7) | TODO |
| Phase 1C shell/navigation, 1D modals | TODO |
| Phase 1E landing page | TODO (after 1C/1D report) |
| Phase 2 grammar color-coding | TODO |

---

## 3. Decisions already made

1. **Grammar tagging approach (Option C primary).** Pre-compute tags for all static dialogue lines at build time using the existing spaCy helper and store them as JSON. Use `compromise` only as a runtime fallback for dynamic or user-typed sentences. Verify and report `compromise`'s real bundle size; do not claim dependency parsing it does not have.
2. **Icons:** keep Hugeicons (shadcn CLI supports it via `iconLibrary`). Do not migrate to lucide.
3. **Brand tokens:** `--ecp-*` tokens are mapped onto shadcn tokens, not discarded.
4. **Word click:** existing `WordDetailPopover` stays the primary place to show grammar role and POS (touch devices have no hover). The tooltip is a desktop-only extra.
5. **Hydration safety:** render with grammar OFF on the server and first client render; apply the `localStorage` value after mount.
6. **Toggle modes:** the Grammar feature has an on/off Switch plus two modes, "Roles" and "Parts of speech" (see section 9).
7. **Landing page:** simple hero + "Start Learning" CTA first; "Soon" nav items become properly disabled, not removed.
8. **Phase 1 is split:** 1A+1B first (done), then 1C+1D, then stop before 1E.

---

## 4. Review fixes to do NOW (before continuing)

### 4.1 Git filename casing
Files were renamed from `Button.tsx` to `button.tsx`. On case-insensitive filesystems (macOS APFS) Git may not register case-only renames, which breaks Linux CI/Vercel.
- Run `git ls-files src/components/ui` and show the output. All filenames must be lowercase in the index.
- If not, fix with `git mv` (two-step rename if needed) and commit.

### 4.2 Stock shadcn diff
- Show `git diff` for changes made to stock files (`button`, `badge`, `card`, others).
- Keep them near-stock. Explain every deviation.
- List where old custom variants (e.g. `variant="warm"`) were mapped.

### 4.3 Icon library consistency
- Grep `src/` for any `lucide-react` imports (shadcn `dialog`, `sheet`, `dropdown-menu`, `sonner`, `select` often ship with lucide icons).
- Convert them to Hugeicons. Remove `lucide-react` from `package.json` if unused.

### 4.4 Visual check
- Run `npm run dev` and verify Dashboard, Explore, Conversation reader, Vocabulary visually in light and dark mode. Passing tests only cover data logic, not visuals.

---

## 5. Padding bug (high priority)

Observed on Dashboard and Explore: content inside cards touches the card border (badges, titles, buttons, tags, level chips, footers).

Probable cause: the shadcn `Card` has no inner padding by itself (padding lives in `CardHeader`, `CardContent`, `CardFooter`), while the old custom `Card` had padding built in. Existing usages were not updated.

Tasks:
- Confirm the cause. Audit every `Card` usage in the app.
- Fix consistently using `CardHeader`/`CardContent`/`CardFooter`, or a single standard padding scale (e.g. `p-5` / `px-5 py-4`). Pick one convention and document it in a short `docs/ui-conventions.md`.
- Fix the oversized gap between title and description in category cards, and the buttons that sit flush against card edges.
- Hero card: the right side is mostly empty with only a CTA; rebalance (see section 7.1).
- Borders: use thin 1px, low-contrast `--border`. No thick gray double-border look.

Acceptance: no text, badge, button, or chip touches a card edge at any breakpoint (check 360px, 768px, 1280px).

---

## 6. Visual identity (colorful, not 3D)

Goal: the app is for language practice, so it must feel alive and keep users engaged. Colorful and playful, but with clear hierarchy. **No 3D effects** (no heavy drop shadows, bevels, skeuomorphism).

### 6.1 Per-category color system
Define CSS variables with light and dark values, for example:
`--cat-shopping` (amber), `--cat-travel` (sky), `--cat-health` (rose), `--cat-social` (violet), `--cat-workplace` (emerald), `--cat-pro` (indigo).

Use them for: icon tile background, category tag tint, card hover border color, and a thin top accent line. Add a helper (e.g. `getCategoryTheme(slug)`) so cards pick their colors from one place.

Keep these tokens visually and semantically separate from the grammar tokens (`--gram-*`) so the two systems do not clash.

### 6.2 Backgrounds
- Replace the flat gray page background with a very subtle soft gradient (works in dark mode).
- Cards stay clean (surface color), color comes from accents.

### 6.3 Rainbow animated gradient border (use sparingly)
Implement a reusable `.rainbow-border` utility or `<RainbowBorder>` wrapper:
- Pure CSS: `conic-gradient` with animated `--angle` via `@property`, 2px padding, mask with `mask-composite: exclude` so only the stroke shows, ~4s linear infinite.
- Fallback for browsers without `@property` support: static multi-color gradient border.
- Disabled under `prefers-reduced-motion: reduce` (static gradient).
- Works in both themes.

Use ONLY on "active or special" elements:
1. Dashboard hero card (Daily Recommendation)
2. Selected category pill on Explore
3. Search input when focused
4. Primary CTA button on hover
5. Grammar toggle when ON

Do NOT put it on every card; if everything is special, nothing is.

### 6.4 Micro-interactions
- Button press: slight scale-down.
- Card hover: `translateY(-2px)` plus border color change (flat lift, not 3D).
- Staggered fade-in for card lists.
- Optional: one small confetti/sparkle on conversation completion (once, short, reduced-motion safe).
- All transitions 150-250ms, ease-out.

---

## 7. Page redesigns

### 7.1 Dashboard (`/(app)/dashboard`)
- **Hero card (Daily Recommendation):** fill the empty right side with a mini dialogue preview (2-3 chat bubbles from the recommended conversation). Rainbow border here. Keep "Start Conversation" CTA prominent.
- **Streak:** flame icon plus a 7-day dot row, with today highlighted. Replace the plain "Day 1 Streak" badge.
- **Daily goal:** show "10 mins/day" as a small progress ring.
- **Everyday / Professional cards:** category-colored icon tile, tighter spacing, button inside proper padding, visible hover state.
- **"Your Progress & Saved Material" empty state:** actionable card (illustration or emoji + "Start your first conversation" button), not plain text.
- **When progress exists:** add a "Continue where you left off" card.
- Mobile: full-width touch targets for buttons.

### 7.2 Explore (`/(app)/explore`, category pages)
- Replace the native `<select>` filters with shadcn `Select` (CEFR level, length, style). Filter bar sticky.
- Category pills: shadcn `ToggleGroup` or accessible button group; selected pill gets rainbow border.
- Search: shadcn `Input` with clear button, visible focus ring, rainbow border on focus.
- Conversation cards: larger icon/emoji tile in category color; colored CEFR chips (A1 green, A2 blue, B1 amber, B2 orange, C1 purple, C2 rose, or similar, all with accessible contrast); one short sample-line preview; clearly styled Bangla subtitle; "EN + BN" chip; hover lift.
- States: Skeleton grid while filtering, empty-result state with a "clear filters" action, "Showing N conversations" kept.

### 7.3 Conversation reader (`/(app)/conversations/[slug]`)
- Keep the UI color noise LOW here (neutral surfaces) so grammar colors stand out when enabled.
- `LadderStepContainer`: replace raw tab buttons with shadcn `Tabs` (keyboard arrows).
- `GrammarPanel` becomes a shadcn `Sheet` (right side).
- `WordDetailPopover` becomes shadcn `Popover` on desktop and a bottom `Sheet`/`Drawer` on mobile.
- `AuthPromptModal` becomes shadcn `Dialog` with proper title/description.

### 7.4 Practice (`src/components/practice/*`)
- Option selection with shadcn `RadioGroup` inside selectable `Card`s.
- Feedback banners with shadcn `Alert` using semantic tokens (success/destructive), not hard-coded `bg-emerald-50` / `bg-rose-50`.

### 7.5 Vocabulary (`/(app)/vocabulary`)
- Consistent card heights and padding; keyboard-accessible POS filter chips (`ToggleGroup`); empty state.

### 7.6 Shell and navigation (Phase 1C)
- `Header`: shadcn `Button`/`DropdownMenu`, `aria-expanded`/`aria-haspopup` on language toggle and avatar menu, theme toggle (`next-themes`), Grammar toggle slot, Skeleton for avatar loading.
- `Sidebar`: clear active state, consistent padding, "Soon" items rendered as properly disabled (`aria-disabled`, muted, tooltip "Coming soon").
- Mobile: add a `Sheet` drawer (hamburger) exposing the full menu in addition to `MobileBottomNav`.

### 7.7 Landing page `/` (Phase 1E, after approval)
- Simple hero with headline, one-line value statement, "Start Learning" CTA linking to `/explore` or `/dashboard`.
- Short feature row (3 items) and a sample dialogue preview. Content placeholders are fine; user will provide final copy.

---

## 8. Phase 1C and 1D scope (do next)

- **1C:** Shell and Navigation (7.6).
- **1D:** Modal migration (`AuthPromptModal` to `Dialog`, `GrammarPanel` to `Sheet`, `WordDetailPopover` to `Popover`/`Sheet`).
- Include sections 4, 5, 6, 7.1, 7.2 as agreed order: fixes first, then padding, then identity tokens, then pages.
- **STOP and report before 1E.**

---

## 9. Phase 2: Grammar Color-Coding with toggle

### 9.1 Goal
Learners can see each word in a sentence colored by grammatical role, so sentence structure becomes visible. A toggle turns it on/off.

### 9.2 Classification
Word-level POS: Noun, Pronoun, Verb, Adjective, Adverb, Preposition, Conjunction, Article/Determiner, Other (punctuation untagged).
Phrase-level roles: Subject, Verb (predicate), Object.

Pipeline:
1. **Build time:** script runs the spaCy helper over all static dialogue lines and writes tagged JSON (tokens with `text`, `pos`, `role`, `lemma`, `tense` if available). Commit the JSON or generate in the build step. Document how to regenerate.
2. **Runtime fallback:** `compromise` for dynamic sentences. Lazy-load it (dynamic import) so it does not affect the main bundle. Report measured gzipped size.
3. Module `src/lib/grammar/tagger.ts`: `tagSentence(text): GrammarToken[]`, where `GrammarToken = { text; pos; role?; isPunctuation?; detail? }`. UI depends only on this shape.
4. Cache per sentence (`Map` or small LRU) so toggling never re-runs analysis.
5. Edge cases: contractions (don't, I'm, we'll), punctuation, multi-word verbs/phrasal verbs, empty text, very long text (memoize), non-English text (Bangla) is skipped entirely.

### 9.3 Dual-layer visual encoding
- **Layer 1, Roles (phrase level):** soft background tint plus underline style, so color is not the only cue:
  - Subject: indigo tint + solid 2px underline
  - Verb: amber tint + double 2px underline
  - Object: emerald tint + dotted 2px underline
- **Layer 2, Parts of speech (word level):** text color per POS plus a label in the tooltip/popover.

### 9.4 Palette requirements
Tokens (light and dark): `--gram-subject`, `--gram-verb`, `--gram-object`, `--gram-noun`, `--gram-pronoun`, `--gram-adjective`, `--gram-adverb`, `--gram-preposition`, `--gram-conjunction`, `--gram-determiner`.

Proposed starting values (adjust as noted):

| Token | Light | Dark |
| --- | --- | --- |
| subject (tint) | `rgba(86,59,145,0.12)` | `rgba(155,122,232,0.22)` |
| verb (tint) | `rgba(242,201,109,0.25)` | `rgba(247,217,142,0.25)` |
| object (tint) | `rgba(39,132,93,0.15)` | `rgba(74,222,128,0.20)` |
| pronoun | `#1D4ED8` | `#60A5FA` |
| adjective | `#0F766E` | `#2DD4BF` |
| adverb | `#C2410C` | `#FB923C` |
| preposition | `#6D28D9` | `#A78BFA` |
| conjunction | `#92400E` | `#FBBF24` |
| noun | **CHANGE** | **CHANGE** |
| determiner | **CHANGE** | **CHANGE** |

Required changes:
- **Noun** must be visually distinct from default body text in both themes (the proposed `#1E293B` / `#F1F5F9` is basically body text). Choose a new hue not used by another POS.
- **Determiner** gray must reach 4.5:1 against the page background; consider lighter weight or italic as an extra cue.
- **Compute real WCAG contrast ratios** (script or tool) for every token in both themes, including text color on top of role tint backgrounds. Show a table of ratios. Fix any below 4.5:1. Do not simply claim AA compliance.
- Palette must remain distinguishable for common color-blindness types; role cues rely on underline style, not color alone.

### 9.5 Toggle and modes
- shadcn `Switch` labelled "Grammar colors" in a visible place (header/toolbar and reader toolbar). Default OFF.
- Two modes selectable when ON: **Roles** (Subject/Verb/Object only) and **Parts of speech** (word colors only). Optionally "Both" if it stays readable on long sentences; otherwise keep two.
- State via React context + hook `useGrammarColors` returning `{ enabled, mode, setEnabled, setMode }`.
- Persist in `localStorage` (`ecp_grammar_colors_enabled`, `ecp_grammar_colors_mode`). Hydration-safe (see section 3.5).
- Toggle ON gets a rainbow border (section 6.3).
- When OFF: text renders as plain text with zero extra wrapper spans.

### 9.6 Components
- `<GrammarText text lang? />` reusable everywhere sentences are shown (dialogue turns, practice cards, vocabulary examples).
- `<GrammarLegend />` in a shadcn `Popover`, placed beside the switch, explaining each color, underline style, and role.
- Word tooltip (desktop): e.g. `Subject • Noun, singular`, `Verb • Past tense`, using shadcn `Tooltip` (also on keyboard focus).
- `WordDetailPopover` (touch and desktop): show Role badge (`[Subject]`/`[Verb]`/`[Object]`) and POS line.

### 9.7 Accessibility
- Screen readers read the sentence normally (decorative indicators `aria-hidden`).
- Switch and mode controls keyboard accessible.
- Respect `prefers-reduced-motion` for any animation.

### 9.8 Performance
- Memoize `GrammarText`; avoid re-render of whole dialogue when toggling a single control (context selectors or memo).
- Lazy-load the fallback tagger.

---

## 10. Verification checklist (every phase)

- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes, 80+ static routes
- [ ] `npm run test` passes
- [ ] `git ls-files src/components/ui` all lowercase
- [ ] Visual check in light and dark mode at 360px, 768px, 1280px
- [ ] No card content touches borders
- [ ] Keyboard-only navigation works on all new controls (focus rings visible)
- [ ] Reduced-motion: rainbow border and animations are static/disabled
- [ ] Contrast table provided for all tokens (Phase 2)
- [ ] No hydration warnings in the console
- [ ] Changed-file list and short summary provided

---

## 11. Out of scope for now

- Admin pages redesign
- New content/copy (user will supply)
- Any backend/auth changes
- 3D effects of any kind

---

## 12. Next message to the agent (copy-paste)

```
Read EnglishPartner_Agent_Spec.md fully. Current state: Phase 1A+1B done.
Do next, in this order:
1. Section 4 review fixes (git casing, stock-file diff, icon consistency, visual check).
2. Section 5 padding bug fix across all Card usages.
3. Section 6 visual identity tokens, rainbow border utility, micro-interactions.
4. Section 7.1 Dashboard and 7.2 Explore redesign.
5. Phase 1C (shell/nav) and 1D (modals).
Run all verification checks, then STOP and report with screenshots or page
descriptions. Do not start Phase 1E or Phase 2 until I approve.
```
