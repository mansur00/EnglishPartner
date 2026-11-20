# English Partner — Design Token System Architecture

This document provides the authoritative reference for the semantic design token architecture in English Conversation Partner, established under the **No Hard-Code Migration** (`docs/EnglishPartner_NoHardCode_Migration.md`).

---

## 1. Core Principles

1. **Zero Hard-Coded Values in Feature Code**: No hex literals (`#ffffff`), raw palette classes (`bg-white`, `text-black`), arbitrary Tailwind brackets (`rounded-[16px]`, `text-[13px]`, `h-[64px]`), or magic constants exist in UI components.
2. **Strict Font-Weight Cap**: Heading and body weights are capped at `font-semibold` (weight 600 max). `font-bold` or weight 700+ is strictly banned.
3. **Minimum Font-Size Floor**: No element renders below 12px (`0.75rem`), verified across all viewports and responsive typography.
4. **Frozen Rainbow Border Invariant**: The `@property --angle` and `.rainbow-border` implementation in `src/app/globals.css` is frozen and protected by `npm run check:frozen` (0 byte difference from baseline).
5. **Dynamic Token Reactivity**: All visual styling responds reactively to CSS variable mutations without fallback literals in `var()`.

---

## 2. Palette & Semantic Color Tokens

### 2.1 Brand Violet System
Defined in `src/app/globals.css` (`@theme inline` mapped to CSS custom properties):

| Token Variable | Tailwind Color Utility | Light Mode Value | Dark Mode Value | Usage / Semantic Role |
| --- | --- | --- | --- | --- |
| `--brand-50` | `bg-brand-50` / `text-brand-50` | `#F4F0FF` | `#1A1333` | Ultra-soft tinted backgrounds, chip hover |
| `--brand-100` | `bg-brand-100` / `border-brand-100` | `#ECE4FF` | `#231845` | Soft badges, borders on light surfaces |
| `--brand-200` | `bg-brand-200` | `#DCD0FF` | `#312163` | Subdued borders, active highlights |
| `--brand-300` | `bg-brand-300` | `#C4ADFF` | `#462F8F` | Accent borders, secondary badges |
| `--brand-400` | `bg-brand-400` | `#A67FFB` | `#6343C7` | Subtle interactive accents |
| `--brand-500` | `bg-brand-500` | `#8B5CF6` | `#7C4DE8` | Brand core violet, focus rings |
| `--brand-600` | `bg-brand-600` | `#743DE0` | `#8C5EF2` | Primary buttons, active tabs |
| `--brand-700` | `bg-brand-700` | `#5F2CC4` | `#A378FA` | Button hover states, prominent headers |
| `--brand-800` | `bg-brand-800` | `#4B219F` | `#BFA0FD` | Hero band background start gradient |
| `--brand-900` | `bg-brand-900` | `#381977` | `#D8C7FE` | Hero band background end gradient |
| `--brand-950` | `bg-brand-950` | `#210D4A` | `#EFE7FF` | Deepest contrast background surfaces |

### 2.2 Accent Sun Palette (CTAs & Highlights)
| Token Variable | Tailwind Color Utility | Light Value | Dark Value | Usage |
| --- | --- | --- | --- | --- |
| `--sun-400` | `bg-sun-400` | `#FFC038` | `#FFC038` | Secondary warm badge, streak highlights |
| `--sun-500` | `bg-sun-500`, `bg-cta` | `#F59E0B` | `#F59E0B` | Primary call-to-action buttons, start step |
| `--sun-600` | `bg-sun-600` | `#D97706` | `#D97706` | CTA hover state, pressed state |

### 2.3 Semantic Status Tokens
| Token Variable | Tailwind Color Utility | Semantic Meaning | Background Tint Utility |
| --- | --- | --- | --- |
| `--color-success` | `text-success`, `bg-success` | Completed, verified, audio active | `bg-success-bg` |
| `--color-warning` | `text-warning`, `bg-warning` | Draft translation, review pending | `bg-warning-bg` |
| `--color-error` | `text-destructive`, `bg-destructive` | Rejection, validation error, quiz incorrect | `bg-destructive/10` |
| `--color-info` | `text-info`, `bg-info` | Grammar tooltips, hints, metadata | `bg-info/10` |

### 2.4 Topic Themes
Applied via `data-topic="<slug>"` attributes on `<TopicCard>` and `<EmojiTile>`:

| Topic Slug | Surface Token (`--topic-surface`) | Tile Token (`--topic-tile`) | Ink Token (`--topic-ink`) |
| --- | --- | --- | --- |
| `shopping` | Light Warm Cream / Dark Espresso | Soft Apricot (`#FFE3C2`) | Deep Russet (`#7A350B`) |
| `tech` | Soft Blue Tint / Dark Slate | Ice Blue (`#D2E7FF`) | Navy Indigo (`#0D3B66`) |
| `food` | Soft Rose / Dark Maroon | Blossom Pink (`#FFD6DE`) | Berry Wine (`#6A1434`) |
| `travel` | Mint Foam / Dark Emerald | Fresh Mint (`#CFF0DD`) | Forest Spruce (`#0F472A`) |
| `work` | Soft Amber / Dark Ochre | Golden Wheat (`#FFEDAE`) | Warm Bronze (`#614A00`) |
| `social` | Lavender Mist / Dark Violet | Lilac Pastel (`#E3D0FA`) | Royal Plum (`#451A7A`) |

---

## 3. Typography Scale & Semantic Classes

Strictly governed by `@utility` classes in `src/app/globals.css`. Direct scale classes (`text-xs`, `text-lg`, `text-3xl`) are replaced with semantic purpose-driven tokens:

| Utility Class | Size (clamp / rem) | Weight | Line Height | Target Elements |
| --- | --- | --- | --- | --- |
| `text-page-title` | `clamp(1.625rem, 1.3rem + 1vw, 2.125rem)` | 600 | 1.2 | Main Page `<h1>` headings |
| `text-hero-title` | `clamp(1.5rem, 1.2rem + 0.8vw, 1.875rem)` | 600 | 1.25 | Hero band title text |
| `text-card-title` | `1.125rem` (18px) | 600 | 1.35 | Scenario cards, dashboard cards, modal titles |
| `text-card-title-bn` | `1.125rem` (18px) | 600 | 1.75 | Bengali dialogue/card titles with tall line height |
| `text-lead` | `1.125rem` (18px) | 400 | 1.6 | Dialogue speech text in reader (easy readability) |
| `text-body` | `1rem` (16px) | 400 | 1.5 | General descriptions, paragraph text |
| `text-meta` | `0.875rem` (14px) | 400 | 1.4 | Timestamps, counters, subtitle metadata |
| `text-meta-lead-bn` | `0.875rem` (14px) | 400 | 1.75 | Bengali subtitles and helper hints |
| `text-label` | `0.875rem` (14px) | 500-600 | 1.2 | Buttons, form labels, navigation tabs |
| `text-chip` | `0.75rem` (12px min floor) | 500 | 1.2 | Badges, CEFR chips, grammar indicators |
| `text-chip-bn` | `0.75rem` (12px min floor) | 500 | 1.6 | Bengali badge tags and status chips |
| `text-stat` | `1.75rem` (28px) | 600 | 1.1 | Today streak count, metrics number |
| `text-bangla` | Inherits size | 400-600 | 1.75 | Applied to all Bangla text to guarantee legibility |

---

## 4. Radius Scale Tokens

| Token Variable | Tailwind Utility | Computed Value | Applied Components |
| --- | --- | --- | --- |
| `--radius-card` | `rounded-card` | `16px` (`1rem`) | Feature cards, topic cards, hero containers, modals |
| `--radius-panel` | `rounded-panel` | `12px` (`0.75rem`) | Nested cards, Today panel, dialogue turn containers |
| `--radius-control` | `rounded-control` | `12px` (`0.75rem`) | Buttons, text inputs, dropdown selects, tabs |
| `--radius-bubble` | `rounded-bubble` | `12px` (`0.75rem`) | Dialogue chat speech bubbles |
| `--radius-pill` | `rounded-pill` | `9999px` | Badges, CEFR chips, streak day markers, avatars |
| `--radius-band` | `rounded-band` | `24px` (`1.5rem`) | Curved bottom of HeroBand container |

---

## 5. Layout Invariants & Magic Number Utilities

All layout spacing, sticky offsets, and component dimensions derive from semantic tokens:

| Token Variable | Utility Class | Value | Semantic Purpose |
| --- | --- | --- | --- |
| `--header-h` | `h-header`, `top-header` | `4rem` (64px) | Global header height and sticky top offset |
| — | `h-below-header` | `calc(100dvh - var(--header-h))` | Viewport scroll container height under fixed header |
| `--sidebar-w` | `w-sidebar` | `16rem` (256px) | Desktop fixed sidebar width |
| `--container-max` | `container-app` | `64rem` (1024px) | Page content container (`max-w-5xl` equivalent) |
| `--overlap-band` | `overlap-band` | `-1.5rem` (-24px) | Negative margin for card overlap on HeroBand |
| `--size-tap` | `size-tap` | `2.75rem` (44px) | Minimum touch target floor for interactive controls |
| `--control-h-md` | `size-control` | `2.5rem` (40px) | Standard icon button / control dimension |
| `--marker-size` | `size-marker` | `1.75rem` (28px) | Today panel 7-day streak circle markers |
| `--tile-size` | `size-tile` | `3rem` (48px) | Emoji topic tile dimensions |
| `--segment-h` | `h-segment` | `0.5rem` (8px) | Today panel 10-segment minute progress bar |

---

## 6. Token to Utility to Component Mapping

| Token / Utility | Target Components |
| --- | --- |
| `<PageContainer>` / `container-app` | `AppShell`, `DashboardClient`, `ExplorePage`, `CategoryPage`, `ConversationReader`, `VocabularyPage` |
| `<HeroBand>` | `DashboardClient` |
| `<TodayPanel>` | `DashboardClient` (replaces separated streak and goal widgets) |
| `<TopicCard>` | `DashboardClient`, `ExplorePage`, `CategoryPage`, `NicheLadderRoadmap` |
| `<EmojiTile>` | `TopicCard`, `CategoryPage`, `DashboardClient`, `LandingPage` |
| `<CefrChip>` | `ConversationReader`, `TopicCard`, `VocabularyPage` |
| `<ChatBubble>` | `ConversationReader`, `ConversationTurn` |
| `<Panel>` | `AdminDashboardClient`, `ConversationEditorClient`, `GrammarBreakdown`, `WordDetailPopover` |
| `<LoadingBox>` | `AppShell`, `ConversationReader`, `AdminPage`, `ConversationEditPage` |
| `btn-nav-action` | `ListeningQuizCard`, `HideSpeakerPractice`, `CompleteLineCard` |
| `card-practice` | `ListeningQuizCard`, `HideSpeakerPractice`, `CompleteLineCard` |
| `text-grammar-header` | `GrammarBreakdown`, `GrammarLayerPicker`, `RuleCard` |

---

## 7. Verification & Automated Quality Gates

Every commit is verified against five automated validation suites:

```bash
# 1. Byte-identical frozen block integrity
npm run check:frozen

# 2. Minimum font floor (12px), max font-weight (600), zero [#hex] classes
npm run lint:ui

# 3. Zero hardcoded tokens audit (0 violations across rules a to i)
npm run lint:tokens

# 4. Strict layout invariants suite (233 assertions across 7 routes, 2 viewports, 2 themes, 2 scroll states)
npm run test:layout

# 5. Token mutation suite (9 headless browser mutations, 0 unmutated elements)
node scripts/token-mutation-test.mjs
```
