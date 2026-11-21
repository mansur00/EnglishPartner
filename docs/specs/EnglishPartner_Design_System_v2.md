# EnglishPartner: Design System v2

> Note (18 Nov 2026): Poppins was removed from the project per D-02. The lines below are the historical record and are not current.

Scope of this document:
1. Brand palette: primary + secondary combination from **Reference 1** (deep purple + yellow)
2. Typography and control sizing: fixes for tiny fonts and small buttons
3. Topic-based soft color themes from **Reference 2** (pastel, per-category)
4. Frozen items, verification checklist, and open confirmations (with default answers so work is never blocked)

Applies on top of `EnglishPartner_Agent_Spec.md`. Where the two conflict, this document wins for color, type, and sizing.

---

## 0. FROZEN: do not touch

### 0.1 Rainbow animated gradient border
The `.rainbow-border` implementation works correctly and **must not change**, now or in later phases.

- Do NOT edit the `.rainbow-border` CSS block (selector, `@property --angle`, keyframes, `conic-gradient`, mask, padding, duration, reduced-motion fallback).
- Add this comment above it: `/* FROZEN: approved by owner. Do not modify. */`
- Do NOT change where it is used: dashboard hero card, selected category pill, focused search input, primary CTA hover, Grammar toggle when ON.
- The element it wraps must keep an **opaque inner background** from a token (`var(--card)` or `var(--background)`), so palette changes never make the stroke show through.
- New palette tokens must not be applied to the rainbow stroke itself. The rainbow colors stay as they are.
- After every phase: open Dashboard + Explore, confirm the stroke still animates, still shows only as a 2px ring, and still works in light and dark. Report "rainbow border: unchanged" in the summary, with `git diff` showing zero changes inside that block.

### 0.2 Other frozen decisions
- No 3D styling (no bevels, glossy 3D icons, heavy drop shadows). Reference 1 contains 3D icon illustrations; do NOT copy them. Use flat emoji or Hugeicons in tinted tiles instead.
- Hugeicons stays the icon library.
- Shadcn components stay near-stock; customization through tokens.

---

## 1. Brand palette (from Reference 1)

Reference 1 combination: **deep violet** as the primary (headers, navigation, active states) with **sunny yellow** as the secondary (main CTA, play buttons, progress highlights), on soft light-lavender/near-white surfaces.

Hex values below are visual approximations of the reference. Treat them as the starting point; compute contrast and adjust if a check fails.

### 1.1 Primary: deep violet

| Token | Hex | Use |
| --- | --- | --- |
| `--brand-950` | `#2A0F44` | Text on yellow, darkest ink |
| `--brand-900` | `#3B1560` | Hover/pressed for primary |
| `--brand-800` | `#4A1D6E` | **Primary** (headers, primary buttons, active nav) |
| `--brand-700` | `#5E2A88` | Secondary surfaces on dark headers |
| `--brand-600` | `#7440A3` | Links, icons on light |
| `--brand-500` | `#8E5BC0` | Focus ring, progress track accent |
| `--brand-400` | `#A97BD8` | Primary in dark mode |
| `--brand-300` | `#C9A6EC` | Decorative, dark-mode text accents |
| `--brand-200` | `#E1CCF6` | Borders on tinted surfaces |
| `--brand-100` | `#F0E5FB` | Tinted surface (accent) |
| `--brand-50`  | `#F8F2FD` | Page tint |

### 1.2 Secondary: sunny yellow

| Token | Hex | Use |
| --- | --- | --- |
| `--sun-700` | `#B88A00` | Borders/icons on light surfaces (never body text) |
| `--sun-600` | `#F2BE0A` | Pressed |
| `--sun-500` | `#FFD93D` | **Secondary / CTA fill** |
| `--sun-400` | `#FFE066` | Hover |
| `--sun-300` | `#FFE98F` | Progress track highlight |
| `--sun-200` | `#FFF1BF` | Soft tint |
| `--sun-100` | `#FFF8DF` | Very soft tint |

**Yellow rules**
- Text on a yellow fill is always `--brand-950`. Never white on yellow.
- Never use yellow as text color on light backgrounds (fails contrast).
- Saturated yellow (`--sun-500`) is reserved for: main CTA, play/start buttons, streak/goal highlights, progress fill. Do not use it as a topic color (see section 3).

### 1.3 Neutrals and semantic

| Token | Light | Dark |
| --- | --- | --- |
| `--background` | `#F8F5FC` | `#150B20` |
| `--card` | `#FFFFFF` | `#1F1230` |
| `--foreground` | `#1E1030` | `#F4EEFB` |
| `--muted-foreground` | `#6B5F7A` | `#B5A8C6` |
| `--border` | `#E6DDF0` | `#33224A` |
| `--success` | `#1F9D6B` | `#4ADE9A` |
| `--warning` | `#D98E04` | `#FBBF24` |
| `--destructive` | `#D8344F` | `#F87189` |

### 1.4 Mapping onto shadcn tokens

```css
:root {
  --primary: var(--brand-800);
  --primary-foreground: #FFFFFF;
  --secondary: var(--sun-500);
  --secondary-foreground: var(--brand-950);
  --accent: var(--brand-100);
  --accent-foreground: var(--brand-800);
  --ring: var(--brand-500);
}
.dark {
  --primary: var(--brand-400);
  --primary-foreground: var(--brand-950);
  --secondary: var(--sun-500);
  --secondary-foreground: var(--brand-950);
  --accent: #2A1B40;
  --accent-foreground: var(--brand-300);
  --ring: var(--brand-400);
}
```

Keep the existing `--ecp-*` tokens as aliases pointing to the new values so nothing that references them breaks.

### 1.5 Page background
Subtle, flat-color gradient, no pattern by default:

```css
body {
  background:
    radial-gradient(circle at 8% 0%, #EFE0FF 0, transparent 38%),
    radial-gradient(circle at 92% 8%, #FFF3C4 0, transparent 32%),
    var(--background);
}
.dark body {
  background:
    radial-gradient(circle at 8% 0%, #2A1745 0, transparent 40%),
    var(--background);
}
```

### 1.6 Layout motifs borrowed from Reference 1
- **Brand header band:** deep violet header with white text and a large curved bottom (`rounded-b-[32px]`) holding the greeting and key stats (streak, goal). Content cards overlap the band slightly.
- **Content sheet:** light surfaces with large radius (20-24px), generous padding, very soft diffuse shadow only (`0 4px 16px rgba(42,15,68,0.06)`), no hard offsets.
- **Rounded yellow play/start buttons** for "start this topic".
- **Thin progress bars** under topic tiles with labels like "You complete 40%".
- **Pill CTA:** full-width yellow pill button (like "Continue").

### 1.7 Button color roles

| Variant | Fill | Text | Use |
| --- | --- | --- | --- |
| `cta` | `--sun-500` (hover `--sun-400`) | `--brand-950` | ONE main action per screen (Start Conversation, Continue) |
| `default` | `--brand-800` | white | Standard primary actions |
| `secondary` | `--brand-100` | `--brand-800` | Secondary actions |
| `outline` | transparent, 1px `--border` | `--foreground` | Tertiary |
| `ghost` | transparent | `--foreground` | Toolbar/nav |
| `destructive` | `--destructive` | white | Danger |

---

## 2. Typography and control sizing (fixes)

### 2.1 The problems to fix
From the earlier screenshots of the current UI:
- Meta text ("5m", "4 turns"), category tags, and level chips render around 11-12px, too small to read comfortably.
- Buttons are small and short (about 13px label, low height), well under a comfortable touch/click target.
- Text sizes are set ad hoc (arbitrary values), so there is no consistent scale.

### 2.2 Hard rules
1. **Minimum font size anywhere: 12px (0.75rem).** 12px is allowed ONLY for non-interactive badges/chips and bottom-nav labels. Never for sentences or paragraphs.
2. **Body text: 16px.** Secondary/description text: **minimum 14px**.
3. **Learning content (dialogue lines, vocabulary, examples) is the product:** 18px minimum on desktop, 17px on mobile, line-height 1.7.
4. **No arbitrary pixel text sizes.** Ban `text-[10px]`, `text-[11px]`, `text-[12px]`, etc. Use only the scale tokens below.
5. All sizes in `rem`, so browser/user font settings are respected.
6. **Inputs and selects: 16px minimum** (prevents iOS zoom on focus).
7. **Interactive targets: minimum 44x44px** for anything tappable on touch screens (buttons, chips, nav items, icon buttons). 36px allowed only for dense desktop-only controls.
8. Spacing between adjacent tappable elements: at least 8px.

### 2.3 Type scale (Tailwind v4 `@theme`)

| Token | Size | Line height | Weight | Use |
| --- | --- | --- | --- | --- |
| `text-display` | `clamp(2rem, 1.4rem + 2.4vw, 2.75rem)` (32-44px) | 1.15 | 700 | Landing/dashboard hero heading |
| `text-h1` | `clamp(1.75rem, 1.4rem + 1.4vw, 2.25rem)` (28-36px) | 1.2 | 700 | Page titles |
| `text-h2` | `1.5rem` (24px) | 1.3 | 600 | Section titles |
| `text-h3` | `1.25rem` (20px) | 1.35 | 600 | Card titles |
| `text-lead` | `1.125rem` (18px) | 1.7 | 400 | **Dialogue/learning content**, hero description |
| `text-body` | `1rem` (16px) | 1.6 | 400 | Default body |
| `text-sm` | `0.875rem` (14px) | 1.5 | 400/500 | Descriptions, helper text, meta (minimum for readable info) |
| `text-xs` | `0.75rem` (12px) | 1.4 | 500/600 | **Floor.** Badges, chips, bottom-nav labels only |

```css
@theme {
  --text-xs: 0.75rem;   --text-xs--line-height: 1.4;
  --text-sm: 0.875rem;  --text-sm--line-height: 1.5;
  --text-base: 1rem;    --text-base--line-height: 1.6;
  --text-lg: 1.125rem;  --text-lg--line-height: 1.7;
  --text-xl: 1.25rem;   --text-xl--line-height: 1.35;
  --text-2xl: 1.5rem;   --text-2xl--line-height: 1.3;
  --text-3xl: clamp(1.75rem, 1.4rem + 1.4vw, 2.25rem);
  --text-3xl--line-height: 1.2;
  --text-4xl: clamp(2rem, 1.4rem + 2.4vw, 2.75rem);
  --text-4xl--line-height: 1.15;
}
```

Where the current UI uses meta/tag text at 11-12px, move it to `text-sm` (14px) for meta rows ("5m", "4 turns"), and keep `text-xs` (12px) only for the small chips themselves (CEFR level, "EN + BN").

### 2.4 Fonts
- **Headings:** Poppins 600 (semibold look, friendly geometry).
- **Body/UI:** Inter 400/500/600 (keeps the current look).
- **Bangla:** Hind Siliguri (400/500/600/700) via `next/font/google`, applied to any Bangla text (EN + BN subtitles, translations).
  - Bangla line-height **1.75** (taller glyph stacks), same or +1px font size compared to adjacent English.
  - Never apply negative letter-spacing to Bangla.
- Load with `next/font` (self-hosted, `display: swap`), only the weights listed, subsets `latin` and `bengali`.
- Letter-spacing: headings `-0.01em` max; body `0`.

### 2.5 Control sizes

| Control | Height | Horizontal padding | Font | Radius |
| --- | --- | --- | --- | --- |
| Button `sm` (dense desktop only) | 36px | 14px | 14px / 600 | pill |
| Button `md` (**default**) | 44px | 20px | 16px / 600 | pill |
| Button `lg` (hero/CTA) | 52px | 28px | 18px / 700 | pill |
| Icon button | 44x44 | n/a | icon 22-24px | full |
| Input | 48px | 16px | 16px | 14px |
| Select trigger | 44px | 14px | 15-16px | 14px |
| Filter chip / category pill (interactive) | 40px | 16px | 14-15px / 600 | pill |
| Badge / level chip (non-interactive) | 24px | 10px | 12px / 600 | pill |
| Nav item (sidebar) | 44px | 12px | 15px / 500 | 12px |
| Bottom-nav item | 56px tall | n/a | label 12px / 600, icon 24px | n/a |
| Tabs trigger | 44px | 16px | 15px / 600 | pill or 12px |

Mobile: primary buttons that sit alone in a card or sheet are full width.

```ts
// button.tsx size variants (cva), keep stock structure
size: {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-base",     // default
  lg: "h-13 px-7 text-lg",       // define h-13 = 3.25rem in theme
  icon: "size-11",
},
```

### 2.6 Enforcement (so this does not regress)
Add `scripts/check-ui-sizes.sh` and `npm run lint:ui`:

```bash
# fail on arbitrary text sizes and sub-12px values
grep -rnE "text-\[[0-9.]+(px|rem)\]" src && exit 1
grep -rnE "font-size:\s*(([0-9]|1[01])(\.[0-9]+)?px|0\.[0-6][0-9]*rem)" src && exit 1
exit 0
```

Also add a short section to `docs/ui-conventions.md` repeating the scale and control sizes. Run `lint:ui` in the verification step.

---

## 3. Topic-based soft color themes (from Reference 2)

Reference 2 idea: every topic/task area has its own **soft pastel panel** with a matching stronger accent for progress bars, chips, and buttons, plus a friendly feel. We apply that to conversation categories.

### 3.1 Mechanism
Each topic page, card, and reader header sets `data-topic="<slug>"`. CSS variables inside that scope drive everything topic-colored:

```css
[data-topic="travel"] {
  --topic-surface: #EAF4FF;  /* large panel bg */
  --topic-tile:    #D2E7FF;  /* icon tile, chip bg */
  --topic-border:  #B5D5F8;
  --topic-accent:  #3B82E6;  /* progress fill, small shapes, NOT body text */
  --topic-ink:     #1D4E96;  /* text and icons on the surface/tile */
}
```

Components use only `--topic-*` (never hard-coded hex). `getCategoryTheme(slug)` returns the slug and emoji; colors live in CSS.

### 3.2 Palette: light mode

| Topic (slug) | Pastel name | `--topic-surface` | `--topic-tile` | `--topic-border` | `--topic-accent` | `--topic-ink` |
| --- | --- | --- | --- | --- | --- | --- |
| `shopping` | Peach | `#FFF4E6` | `#FFE3C2` | `#F7CFA0` | `#F09A2E` | `#8A4A06` |
| `travel` | Sky | `#EAF4FF` | `#D2E7FF` | `#B5D5F8` | `#3B82E6` | `#1D4E96` |
| `health` | Rose | `#FFECF0` | `#FFD6DE` | `#F9BCC9` | `#E8587C` | `#9A2546` |
| `social` | Mint | `#E9F8EF` | `#CFF0DD` | `#AEE2C6` | `#2FAE78` | `#14663F` |
| `workplace` | Butter | `#FFF7DA` | `#FFEDAE` | `#F5DB7A` | `#E0AE0B` | `#6E5300` |
| `professional` | Lilac | `#F3EAFE` | `#E3D0FA` | `#CDB0F0` | `#7B45C4` | `#4A1D6E` |

### 3.3 Palette: dark mode

| Topic | `--topic-surface` | `--topic-tile` | `--topic-border` | `--topic-accent` | `--topic-ink` |
| --- | --- | --- | --- | --- | --- |
| `shopping` | `#2E2318` | `#3D2E1C` | `#5A4327` | `#F2A64B` | `#FFD9A8` |
| `travel` | `#172536` | `#1E3350` | `#2D4B73` | `#5FA3F5` | `#BBD9FF` |
| `health` | `#34202A` | `#4A2735` | `#6A3649` | `#F27C9C` | `#FFC4D2` |
| `social` | `#1A2E25` | `#21402F` | `#2F5A44` | `#5FD39A` | `#BDF2D8` |
| `workplace` | `#332D16` | `#453C1B` | `#665827` | `#F2CF4A` | `#FFEFA8` |
| `professional` | `#2A2040` | `#372A58` | `#4E3C7E` | `#B28BF0` | `#E2D0FF` |

### 3.4 Usage rules
- **Surface** (`--topic-surface`): topic card background, topic page header panel, reader header.
- **Tile** (`--topic-tile`): icon/emoji tile, tag/chip background.
- **Border** (`--topic-border`): card border, hover border.
- **Accent** (`--topic-accent`): progress bar fill, small decorative shapes, active dots. **Never** as text color on light backgrounds; never white text on it (fails contrast on lighter accents).
- **Ink** (`--topic-ink`): all text and icons placed on surface/tile.
- Progress bars: track = `--topic-tile`, fill = `--topic-accent`, height 8px, rounded-full, with a 14px label ("40% complete").
- Soft look: no heavy shadows; panels are flat pastel with a 1px border and 20-24px radius.
- Saturated brand yellow stays reserved for CTA/play/streak. Butter (workplace) is a pale tint only and must stay visibly different from the CTA yellow.
- The **conversation reader keeps neutral surfaces** (card/background); only the header strip carries the topic color. That keeps grammar colors (Phase 2) readable.
- The rainbow border is unaffected by topic themes (section 0.1).

### 3.5 Where topic themes appear
- Explore: conversation cards (surface tint on hover or as header strip, tile behind emoji, ink for category label), category pills (selected pill: rainbow border, inner fill `--topic-tile`).
- Dashboard: Everyday/Professional cards, "Continue where you left off" card (uses the topic of the last conversation), progress rows.
- Category pages: header panel in topic surface with big emoji tile and progress.
- Conversation reader: top strip and progress bar.
- Vocabulary: word cards carry the topic they came from as a small tile chip.

### 3.6 Reference 2 layout ideas to use
- Rounded stacked panels with a soft pastel header panel holding summary/progress.
- Task/conversation rows with small icon tile, title, meta, progress, and a round action button on the right.
- Friendly tone: short encouraging line in the panel header ("Nice! 3 of 8 turns done"). Illustrated mascot is optional (see confirmations).

---

## 4. Applying it: component notes

### Dashboard
- Deep-violet header band with greeting (display/h1 white), streak + daily-goal pills inside it (14px labels minimum).
- Hero card (rainbow border, unchanged): topic-tinted left content, mini dialogue preview on the right, `cta` yellow "Start Conversation" button (`lg`, 52px).
- Everyday / Professional cards: topic surface, tile with emoji, `md` buttons full width.
- Progress card: topic-colored progress rows with round yellow play buttons.

### Explore
- Search input 48px, 16px text.
- Category pills 40px, text 14-15px; selected pill: rainbow border + topic tile fill.
- Filters: Select triggers 44px, text 15-16px, labels 14px.
- Card: title `text-h3` (20px), Bangla subtitle 15px Hind Siliguri, description 14-15px, meta row 14px, level chip 12px, Practice button `md`.

### Reader
- Dialogue text `text-lead` (18px+), Bangla translation 16-17px with line-height 1.75.
- Controls (play audio, grammar toggle, word popover buttons) at least 44px targets.

### Navigation
- Sidebar items 44px, 15px text. Bottom nav items 56px tall, 24px icons, 12px labels. No 10-11px labels anywhere.

---

## 5. Interaction with Phase 2 (grammar colors)

The brand violet and the proposed Subject indigo are close, and brand yellow is close to the Verb amber. Because the reader keeps neutral surfaces, this is manageable, but the grammar palette needs to stay distinguishable from UI chrome:
- Prefer Subject = blue, Verb = orange, Object = green in the grammar tints (see confirmation 6).
- Grammar tokens remain `--gram-*`, separate from `--brand-*`, `--sun-*`, `--topic-*`.
- Compute contrast of grammar text on tinted backgrounds on both themes and show the table.

---

## 6. Verification checklist

- [ ] `.rainbow-border` block: zero diff; stroke animates on hero, selected pill, focused search, CTA hover, grammar toggle (ON)
- [ ] Reduced-motion: rainbow static, no transitions
- [ ] `npm run lint:ui` passes (no `text-[Npx]`, no value below 12px)
- [ ] No text under 14px except badges/chips/nav labels at exactly 12px
- [ ] Default button height 44px, hero CTA 52px, inputs 48px, chips 40px (measure in devtools at 360px and 1280px)
- [ ] All tappable targets at least 44px on mobile, gaps at least 8px
- [ ] Contrast table (WCAG AA, 4.5:1 for text, 3:1 for UI shapes) for: primary/white, brand-950 on yellow, each topic ink on its surface and tile, muted-foreground on card and background, all in light and dark
- [ ] Hind Siliguri loads for all Bangla text; Bangla line-height at least 1.75; no clipped glyphs
- [ ] `git ls-files src/components/ui` all lowercase
- [ ] Typecheck, lint, build (80+ static routes), tests pass
- [ ] Screenshots or descriptions of Dashboard, Explore, one conversation, in light and dark, desktop and 360px mobile

---

## 7. Open confirmations (agent proceeds with the default; owner can override)

| # | Question | Default used if no answer |
| --- | --- | --- |
| 1 | Is the approximated brand violet `#4A1D6E` and yellow `#FFD93D` close enough to Reference 1, or should exact hex be sampled from the reference image? | Use as given; adjust only if contrast fails |
| 2 | Main CTA is yellow (like the "Continue" button in Reference 1) and standard primary buttons are violet. OK? | Yes |
| 3 | Dark mode: keep it and use the dark palette above? | Keep, using the dark palette |
| 4 | Fonts: Poppins (headings), Inter (body), Hind Siliguri (Bangla). OK? | Yes |
| 5 | Topic to color mapping: shopping=peach, travel=sky, health=rose, social=mint, workplace=butter, professional=lilac. Any change? | As listed |
| 6 | Grammar palette: change Subject from indigo to blue (to avoid clashing with brand violet), keep Verb orange, Object green? | Yes, change |
| 7 | CEFR level chips (A1 to C2): keep their own distinct colors, or tint them from the topic? | Keep own fixed colors, 12px text |
| 8 | Reference 1 has a faint doodle pattern on the background. Add a very low-opacity pattern? | No pattern for now |
| 9 | Reference 2 uses friendly mascot illustrations. Add a mascot later (needs artwork)? | No mascot for now |
| 10 | Dashboard: curved deep-violet header band like Reference 1? | Yes |

---

## 8. Message to the agent (copy-paste)

```
Read EnglishPartner_Design_System_v2.md fully. It overrides color, type and
sizing decisions from the earlier spec.

Priority order:
1. FROZEN: do not modify the .rainbow-border CSS or its usages. Add the FROZEN
   comment. Report "rainbow border unchanged" with a zero-diff proof.
2. Typography and sizing fixes (section 2): type scale in @theme, Poppins +
   Inter + Hind Siliguri via next/font, button/input/chip/nav sizes, remove
   every arbitrary text-[Npx], add lint:ui script. Min 12px (badges and
   bottom-nav labels only), 14px for secondary text, 16px body, 18px for
   learning content, 44px targets.
3. Brand palette (section 1): violet primary + yellow secondary tokens,
   shadcn mapping, light and dark, keep --ecp-* as aliases. Add the `cta`
   button variant (yellow).
4. Topic themes (section 3): data-topic scoped --topic-* variables in light and
   dark, applied to Explore cards, category pills, dashboard cards, category
   page header and reader header strip (reader body stays neutral).
5. Apply to Dashboard and Explore per section 4, including the curved violet
   header band.

Use the default answers in section 7 for anything unconfirmed. Run typecheck,
lint, lint:ui, build and tests. Produce the contrast table. STOP and report
with screenshots or page descriptions in light and dark, desktop and 360px
mobile. Do not start Phase 1E or Phase 2 until I approve.
```
