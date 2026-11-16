# English Conversation Practice — Design Token Documentation

**Document:** Design Token System & Implementation Guide  
**Version:** 1.0  
**Status:** Ready for Antigravity implementation  
**Primary token file:** `design-tokens.css`  
**Tailwind adapters:** `tailwind-theme-v4.css` and `tailwind-theme-v3.example.cjs`

---

## 1. Purpose

This document explains the design tokens used by the English Conversation Practice application. It defines what each token controls, when to use it, how components should consume it, and how the system should be maintained.

Design tokens are the single source of truth for recurring visual decisions, including:

- Brand and semantic colours
- Typography and text hierarchy
- Spacing and layout rhythm
- Border radius and elevation
- Responsive page gutters
- Control sizing
- Motion timing
- Layering and stacking order

The goal is to keep the entire product visually consistent while making future redesigns and theme adjustments manageable.

## 2. Source-of-truth files

Keep these files together in the project root or in the project's established styles directory:

| File | Responsibility |
|---|---|
| `design-tokens.css` | Canonical CSS custom properties and global baseline |
| `tailwind-theme-v4.css` | Tailwind CSS v4 theme adapter |
| `tailwind-theme-v3.example.cjs` | Tailwind CSS v3 theme extension example |
| `English_Conversation_Practice_Design_Tokens.md` | Human-readable documentation for the token system |

**Important:** `design-tokens.css` is the canonical source for token values. The Tailwind adapter maps those CSS variables into Tailwind utility names. Do not maintain a separate, conflicting palette inside components or configuration files.

Use only the adapter that matches the Tailwind version already installed in the project. Never load both adapters.

---

## 3. Token naming convention

Canonical CSS variables use the prefix:

```css
--ecp-*
```

`ecp` means English Conversation Practice.

Examples:

```css
var(--ecp-brand-800)
var(--ecp-space-4)
var(--ecp-radius-card)
var(--ecp-shadow-sm)
```

### Naming rules

1. Use lowercase kebab-case.
2. Group tokens by purpose: `brand`, `accent`, `surface`, `text`, `space`, `radius`, `shadow`, `duration`, `z`.
3. Use numbered scales where a family has multiple levels.
4. Prefer semantic tokens for component states, such as `success`, `warning`, and `error`.
5. Components should consume tokens rather than inventing new values.
6. Add a new token only when a repeated design need exists.
7. Do not rename or delete a token without checking all references in CSS, Tailwind configuration, and components.

---

## 4. Brand colour tokens

The brand identity uses deep violet as its primary colour, supported by warm yellow and restrained peach accents.

### 4.1 Purple brand scale

| CSS token | Value | Intended use |
|---|---|---|
| `--ecp-brand-950` | `#35215F` | Deepest brand shade; strong contrast surfaces |
| `--ecp-brand-900` | `#432B78` | Dark navigation, strong hover state |
| `--ecp-brand-800` | `#563B91` | Main primary brand colour |
| `--ecp-brand-700` | `#684BA7` | Focus ring, active emphasis, hover accents |
| `--ecp-brand-100` | `#EEE9F8` | Selected backgrounds and soft brand surfaces |
| `--ecp-brand-50` | `#F7F4FC` | Very subtle brand-tinted background |

**Usage guidance**

- Use `brand-800` for the main primary button and key brand actions.
- Use `brand-900` for a darker hover state or deep navigation surface.
- Use `brand-700` for focus indication and smaller active accents.
- Use `brand-100` for selected navigation items, active filters, and selected cards.
- Use `brand-50` for subtle section backgrounds.
- Use `brand-950` sparingly for strong emphasis.

Do not use the darkest purple for long paragraphs or large text areas.

### 4.2 Warm yellow accent scale

| CSS token | Value | Intended use |
|---|---|---|
| `--ecp-accent-500` | `#F2C96D` | Main warm accent |
| `--ecp-accent-400` | `#F7D98E` | Soft highlight surface |
| `--ecp-accent-100` | `#FFF4D8` | Pale highlight background |

Use yellow for selected milestones, learning encouragement, progress highlights, and occasional accent actions. Use dark text on yellow backgrounds. Do not use yellow as the main body text colour or as a large full-page background.

### 4.3 Peach accent scale

| CSS token | Value | Intended use |
|---|---|---|
| `--ecp-peach-400` | `#F3A58F` | Decorative accent |
| `--ecp-peach-100` | `#FCE9E2` | Soft decorative surface |

Peach is secondary. Use it for occasional decorative details, friendly empty states, or supporting visual accents. It should not compete with purple for primary actions.

---

## 5. Neutral colour tokens

Neutral colours make the interface calm and keep learning content easy to read.

| CSS token | Value | Intended use |
|---|---|---|
| `--ecp-canvas` | `#F7F7F8` | Main application background |
| `--ecp-surface` | `#FFFFFF` | Cards, panels, dialogs |
| `--ecp-surface-muted` | `#F4F4F6` | Input backgrounds and quiet sections |
| `--ecp-surface-warm` | `#FFFAF6` | Warm welcome and selected empty-state surfaces |
| `--ecp-border` | `#E9E8ED` | Default card and input border |
| `--ecp-border-strong` | `#D8D6DF` | Stronger separators and emphasis |
| `--ecp-text-primary` | `#24232A` | Main headings and body text |
| `--ecp-text-secondary` | `#6F6D78` | Supporting text and descriptions |
| `--ecp-text-muted` | `#777580` | Metadata, captions, and placeholders |
| `--ecp-white` | `#FFFFFF` | Explicit white surface |

### Usage guidance

- Use `canvas` behind the main app workspace.
- Use `surface` for cards and focused content.
- Use `surface-muted` for quiet containers and form controls where suitable.
- Use `border` for most outlines; reserve `border-strong` for clearer separation.
- Use `text-primary` for important content.
- Use `text-secondary` for supporting descriptions.
- Use `text-muted` only for less important metadata. It must still remain readable.

Do not lower text contrast merely to make the design look softer. Check contrast for actual text/background combinations.

---

## 6. Semantic colour tokens

Semantic colours communicate meaning and interaction feedback.

| Purpose | Foreground token | Value | Surface token | Value |
|---|---|---|---|---|
| Success | `--ecp-success` | `#27845D` | `--ecp-success-surface` | `#EAF6EF` |
| Warning | `--ecp-warning` | `#B7791F` | `--ecp-warning-surface` | `#FFF5DF` |
| Error | `--ecp-error` | `#C94A4A` | `--ecp-error-surface` | `#FDEEEE` |
| Information | `--ecp-info` | `#4775B8` | `--ecp-info-surface` | `#EDF3FC` |

### Product usage examples

- Success: correct exercise answer, completed lesson, saved vocabulary confirmation.
- Warning: incomplete setup, pending content review, caution before leaving an editor.
- Error: invalid form field, failed save, unavailable operation.
- Information: learning tip, new feature explanation, contextual note.

### Rules

- Never communicate a state using colour alone.
- Pair semantic colour with text, iconography, or another clear visual cue.
- Do not use red for ordinary difficulty or normal learning feedback.
- Incorrect answers should be constructive and explain how to improve.
- Use semantic surface tokens for soft backgrounds rather than applying saturated foreground colours to large areas.

---

## 7. Semantic alias tokens

The CSS file includes aliases for common global roles:

| Alias | References | Use |
|---|---|---|
| `--ecp-bg` | `--ecp-canvas` | Default app background |
| `--ecp-fg` | `--ecp-text-primary` | Default foreground text |
| `--ecp-primary` | `--ecp-brand-800` | Primary action colour |
| `--ecp-primary-hover` | `--ecp-brand-900` | Primary hover colour |
| `--ecp-focus-ring` | `--ecp-brand-700` | Keyboard focus indicator |

Use aliases for global semantic roles. Use the underlying palette token when a component needs a specific shade for a documented reason.

---

## 8. Typography tokens

### 8.1 Font families

| CSS token | Stack | Usage |
|---|---|---|
| `--ecp-font-sans` | Inter, Hind Siliguri, Noto Sans Bengali, system fallback | Main application font stack |
| `--ecp-font-bangla` | Hind Siliguri, Noto Sans Bengali, system fallback | Bangla translations and Bangla interface content |
| `--ecp-font-mono` | System monospace stack | Technical identifiers or code-like content |

The font files must be loaded by the application if they are not already available. The token file defines font preferences; it does not download or install font files.

### 8.2 Font size scale

| CSS token | Value | Pixel equivalent | Typical usage |
|---|---:|---:|---|
| `--ecp-text-xs` | `0.75rem` | 12px | Small metadata |
| `--ecp-text-sm` | `0.875rem` | 14px | Supporting text, labels |
| `--ecp-text-base` | `1rem` | 16px | Standard body text |
| `--ecp-text-lg` | `1.125rem` | 18px | Conversation dialogue |
| `--ecp-text-xl` | `1.25rem` | 20px | Card/section emphasis |
| `--ecp-text-2xl` | `1.5rem` | 24px | Section heading |
| `--ecp-text-3xl` | `1.875rem` | 30px | Page title |
| `--ecp-text-4xl` | `2rem` | 32px | Large page title |

### 8.3 Line-height tokens

| CSS token | Value | Use |
|---|---:|---|
| `--ecp-leading-tight` | `1.2` | Headings and compact labels |
| `--ecp-leading-normal` | `1.5` | General body content |
| `--ecp-leading-relaxed` | `1.65` | Longer descriptions and Bangla |
| `--ecp-dialogue-leading` | `1.7` | English conversation dialogue |

### Typography rules

- Keep dialogue more readable than metadata.
- English and Bangla text should have appropriate line height.
- Use semantic heading levels in document structure.
- Avoid using size alone to communicate hierarchy; combine size, weight, and spacing.
- Do not use 12px text for essential learning content.
- On mobile, keep form-control text at 16px or larger to avoid unwanted browser zoom on supported mobile browsers.
- Check font rendering for both Latin and Bengali scripts.

---

## 9. Spacing tokens

The spacing system follows a 4px base rhythm.

| CSS token | Value | Pixel equivalent | Typical use |
|---|---:|---:|---|
| `--ecp-space-1` | `0.25rem` | 4px | Tiny icon/text gap |
| `--ecp-space-2` | `0.5rem` | 8px | Compact control gap |
| `--ecp-space-3` | `0.75rem` | 12px | Small internal spacing |
| `--ecp-space-4` | `1rem` | 16px | Default spacing |
| `--ecp-space-5` | `1.25rem` | 20px | Comfortable card spacing |
| `--ecp-space-6` | `1.5rem` | 24px | Card padding |
| `--ecp-space-8` | `2rem` | 32px | Section gap |
| `--ecp-space-10` | `2.5rem` | 40px | Large section gap |
| `--ecp-space-12` | `3rem` | 48px | Page-level separation |
| `--ecp-space-16` | `4rem` | 64px | Large desktop spacing |
| `--ecp-space-20` | `5rem` | 80px | Extra-large separation |

### Spacing rules

- Prefer the spacing scale over arbitrary margin/padding values.
- Use consistent card padding across similar card types.
- Keep conversation turns comfortably separated.
- Avoid excessive whitespace on small screens.
- Use layout gap utilities for repeated collections rather than applying unrelated margins to every child.

---

## 10. Border radius tokens

| CSS token | Value | Typical use |
|---|---:|---|
| `--ecp-radius-sm` | `0.625rem` / 10px | Compact controls |
| `--ecp-radius-md` | `0.75rem` / 12px | Inputs and buttons |
| `--ecp-radius-card` | `1rem` / 16px | Standard cards |
| `--ecp-radius-panel` | `1.25rem` / 20px | Large panels |
| `--ecp-radius-xl` | `1.5rem` / 24px | Large modal or feature surfaces |
| `--ecp-radius-pill` | `9999px` | Badges and chips |

Use the same radius for components with the same role. Do not give every component a different radius.

---

## 11. Shadow tokens

| CSS token | Value | Typical use |
|---|---|---|
| `--ecp-shadow-xs` | `0 1px 2px rgb(31 25 48 / 0.04)` | Very subtle separation |
| `--ecp-shadow-sm` | `0 2px 10px rgb(31 25 48 / 0.04)` | Default card |
| `--ecp-shadow-md` | `0 8px 24px rgb(31 25 48 / 0.07)` | Raised/interactive card |
| `--ecp-shadow-lg` | `0 16px 48px rgb(31 25 48 / 0.14)` | Modal and overlay |

### Shadow rules

- Prefer a light border plus a subtle shadow.
- Use `shadow-sm` for ordinary cards.
- Use stronger elevation only for overlays or clearly raised elements.
- Avoid strong shadows on every component.
- Do not use shadow as the only indicator of selection or focus.

---

## 12. Layout tokens

| CSS token | Value | Pixel equivalent | Usage |
|---|---:|---:|---|
| `--ecp-content-max` | `90rem` | 1440px | Maximum application content width |
| `--ecp-reading-max` | `48rem` | 768px | Comfortable reading width |
| `--ecp-sidebar-width` | `15rem` | 240px | Desktop sidebar |
| `--ecp-context-panel-width` | `18.75rem` | 300px | Optional desktop contextual panel |
| `--ecp-page-gutter` | responsive | 16px / 20px / 32px | Horizontal page padding |
| `--ecp-control-height` | `2.75rem` | 44px | Standard control height |
| `--ecp-control-height-lg` | `3rem` | 48px | Large control height |

### Responsive page gutter

The CSS file defines:

- Base/mobile: 16px
- At 640px and above: 20px
- At 1024px and above: 32px

The application must remain usable at 320px width. Desktop sidebar and contextual panel widths are layout references, not fixed requirements for mobile.

### Reading width

Use the reading max width for long-form conversation content, explanations, and lesson text. A wider screen should not result in excessively long dialogue lines.

---

## 13. Motion tokens

| CSS token | Value | Usage |
|---|---:|---|
| `--ecp-duration-fast` | `150ms` | Small hover and focus transitions |
| `--ecp-duration-normal` | `200ms` | Standard component transitions |
| `--ecp-duration-slow` | `280ms` | Drawers and larger transitions |
| `--ecp-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Standard easing curve |

### Motion rules

- Motion must communicate state change or spatial relationship.
- Avoid constant decorative animation.
- Respect `prefers-reduced-motion`.
- Do not make essential information available only through animation.
- Keep hover and focus feedback immediate.

---

## 14. Layering tokens

| CSS token | Value | Typical usage |
|---|---:|---|
| `--ecp-z-base` | `0` | Normal content |
| `--ecp-z-sticky` | `20` | Sticky header or action bar |
| `--ecp-z-dropdown` | `30` | Dropdowns and menus |
| `--ecp-z-overlay` | `40` | Overlay backdrop |
| `--ecp-z-modal` | `50` | Modal/dialog surface |
| `--ecp-z-toast` | `60` | Toast notifications |

Do not invent random z-index values throughout the application. If a new layer is genuinely required, document it and place it into this scale.

---

## 15. CSS integration

Import the canonical tokens before component styles.

```css
/* Example global stylesheet */
@import "./design-tokens.css";

/* Import application styles after the tokens */
@import "./components.css";
```

If the project already has a global stylesheet, integrate the import into the existing structure rather than creating a competing global CSS entry point.

### Consuming tokens in CSS

```css
.app-shell {
  min-height: 100vh;
  background: var(--ecp-bg);
  color: var(--ecp-fg);
  font-family: var(--ecp-font-sans);
}

.primary-button {
  min-height: var(--ecp-control-height);
  padding-inline: var(--ecp-space-4);
  border: 0;
  border-radius: var(--ecp-radius-md);
  background: var(--ecp-primary);
  color: var(--ecp-white);
  transition:
    background-color var(--ecp-duration-fast) var(--ecp-ease-standard),
    box-shadow var(--ecp-duration-fast) var(--ecp-ease-standard);
}

.primary-button:hover {
  background: var(--ecp-primary-hover);
}

.content-card {
  padding: var(--ecp-space-6);
  border: 1px solid var(--ecp-border);
  border-radius: var(--ecp-radius-card);
  background: var(--ecp-surface);
  box-shadow: var(--ecp-shadow-sm);
}

.conversation-text {
  max-width: var(--ecp-reading-max);
  font-size: var(--ecp-text-lg);
  line-height: var(--ecp-dialogue-leading);
}
```

---

## 16. Tailwind CSS integration

First inspect the installed Tailwind version. Use exactly one adapter.

### 16.1 Tailwind CSS v4

The v4 adapter is `tailwind-theme-v4.css`.

Typical import order:

```css
@import "tailwindcss";
@import "./design-tokens.css";
@import "./tailwind-theme-v4.css";
```

The adapter maps CSS variables into Tailwind theme names. For example:

```html
<div class="bg-canvas text-text-primary">
  <section class="rounded-card border border-border bg-surface shadow-card">
    <button class="rounded-control bg-brand-800 text-white hover:bg-brand-900">
      Start learning
    </button>
  </section>
</div>
```

### 16.2 Tailwind CSS v3

The v3 example is `tailwind-theme-v3.example.cjs`.

It exports an `ecpTheme` object. Merge its values into the existing `theme.extend` object in the project's existing Tailwind configuration. Do not replace the entire config file.

Example integration shape:

```js
const { ecpTheme } = require("./tailwind-theme-v3.example.cjs");

module.exports = {
  // Preserve the project's existing content, plugins, presets, etc.
  theme: {
    extend: {
      ...ecpTheme,
      // Preserve existing extensions as needed.
    },
  },
};
```

If the existing config already defines `theme.extend`, carefully merge the keys to avoid replacing current settings.

### 16.3 Version rules

- Do not use the v3 config adapter in a v4-only setup.
- Do not use the v4 `@theme` adapter in a v3-only setup.
- Do not migrate Tailwind solely to use these tokens.
- Preserve existing plugins, content globs, presets, and project configuration.
- After integration, run the project's build and type/lint checks.

---

## 17. Component-to-token mapping

Use this table as the default token mapping for common components.

| Component | Recommended tokens |
|---|---|
| App background | `canvas`, `bg` |
| Sidebar | `brand-900`, `brand-950`, `surface` |
| Active nav item | `brand-100`, `brand-800` |
| Primary button | `brand-800`, `brand-900`, `white`, `radius-md` |
| Secondary button | `surface`, `border`, `text-primary` |
| Accent button | `accent-500`, `text-primary` |
| Card | `surface`, `border`, `radius-card`, `shadow-sm` |
| Large panel | `surface`, `radius-panel`, `shadow-sm` |
| Input | `surface`, `border`, `radius-md`, `focus-ring` |
| Selected chip | `brand-100`, `brand-900`, `radius-pill` |
| Progress bar | `brand-800`, `surface-muted` |
| Achievement highlight | `accent-100`, `accent-500` |
| Correct answer | `success`, `success-surface` |
| Incorrect answer | `error`, `error-surface` |
| Warning notice | `warning`, `warning-surface` |
| Information notice | `info`, `info-surface` |
| Dialogue text | `text-primary`, `text-lg`, `dialogue-leading` |
| Translation text | `text-secondary`, `leading-relaxed`, Bangla font |
| Modal | `surface`, `radius-xl`, `shadow-lg`, `z-modal` |
| Toast | semantic surface/foreground, `z-toast` |

These are defaults. A component may use a different token only when the design has a clear, documented reason.

---

## 18. Responsive and accessibility rules

- Use mobile-first responsive layout utilities.
- Keep the page gutter responsive through `--ecp-page-gutter`.
- Aim for at least 44px control height.
- Keep text readable at 320px viewport width.
- Ensure English and Bangla text wrap naturally.
- Use visible keyboard focus with `--ecp-focus-ring`.
- Do not use colour as the only indicator of active, success, or error state.
- Check actual text/background contrast; token names do not guarantee contrast compliance.
- Respect reduced-motion settings.
- Ensure dialogs, dropdowns, and drawers have accessible focus behaviour.
- Do not hide essential actions behind hover-only controls.

---

## 19. Rules for adding or changing tokens

Before adding a token, ask:

1. Is this value used in multiple places?
2. Does it represent a meaningful design role?
3. Can an existing token serve the same purpose?
4. Does the new token need a Tailwind mapping?
5. Is its usage documented?
6. Does it preserve contrast and accessibility?

When changing a token:
1. Search the repository for all references.
2. Check the impact on all component categories.
3. Check light/dark or alternate themes if implemented.
4. Test mobile, tablet, and desktop.
5. Update this document and the Tailwind adapter if required.
6. Run the project's validation checks.

Never silently create local component colours that conflict with the central palette.

---

## 20. Current scope and future extensions

The current token file defines a light theme. It does not yet define a complete dark theme, high-contrast theme, per-user accent themes, or a full semantic token system for every possible component state.

Do not assume these modes are already implemented.

If dark mode or another theme is introduced later:
- Keep component styles semantic.
- Add theme-specific values under a separate theme selector or supported theme mechanism.
- Preserve the same semantic token names where possible.
- Test all text, borders, surfaces, and semantic states in the new theme.
- Do not duplicate component styles solely to support a theme.

---

## 21. Antigravity implementation prompt

```text
Read the complete English_Conversation_Practice_Design_Tokens.md document.

Use these files as the token source:
- design-tokens.css
- tailwind-theme-v4.css
- tailwind-theme-v3.example.cjs

Before making changes:
1. Inspect the repository and identify the installed Tailwind CSS version.
2. Inspect the existing global stylesheet and Tailwind configuration.
3. Identify existing CSS variables and theme values that may overlap.
4. Confirm where the canonical token file should live.
5. Choose only the correct Tailwind adapter for the installed version.

Implementation requirements:
- Treat design-tokens.css as the canonical source of visual values.
- Do not duplicate palette values in components.
- Do not load both Tailwind adapters.
- Do not migrate the project's framework or Tailwind version.
- Preserve existing config, plugins, and global styles.
- Integrate tokens into the existing architecture.
- Make all shared components consume semantic tokens.
- Keep the interface mobile-first and accessible.
- Respect reduced-motion preferences.
- Verify English and Bangla font rendering.

After implementation:
- List every file created or modified.
- Show how the token file is imported.
- Show how Tailwind utilities map to the tokens.
- Report any tokens that could not be mapped and explain why.
- Run the project's build, lint, and type checks where available.
- Check for hardcoded colours or duplicate token definitions in shared components.
- Test at 320px, 360px, 390px, 768px, 1024px, 1280px, and 1440px.

Do not redesign product pages in this task. First integrate and validate the design token foundation.
```

---

## 22. Definition of done

- [ ] `design-tokens.css` is the canonical token source.
- [ ] The correct Tailwind adapter is selected based on the installed version.
- [ ] The unused adapter is not imported.
- [ ] Existing project configuration is preserved.
- [ ] Shared components use tokens rather than scattered hardcoded values.
- [ ] Typography works for English and Bangla.
- [ ] Responsive gutters and control sizes work on mobile.
- [ ] Focus and reduced-motion styles are active.
- [ ] Semantic feedback states are consistent.
- [ ] No unexpected visual regressions occur.
- [ ] Build and available project checks pass.
- [ ] This documentation is updated when tokens change.

---

**End of Design Token Documentation**
