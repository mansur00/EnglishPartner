# English Conversation Practice

## UI Design System & Visual Style Guide

**Document type:** Product UI / UX design specification\
**Purpose:** Visual direction for the English Conversation Practice web
application\
**Implementation:** Tailwind CSS utility-first styling\
**Reference basis:** Three user-provided dashboard/interface images\
**Priority:** Mobile-responsive learning experience

------------------------------------------------------------------------

## 1. Design direction

Create a calm, friendly, polished learning workspace that feels like a
blend of a modern productivity dashboard and a welcoming
language-learning product.

The references contribute visual language only:

-   **Reference 1:** Confident purple navigation, warm ivory canvas,
    rounded application frame, small yellow accents, clear separation
    between navigation and workspace.
-   **Reference 2:** Minimal neutral interface, generous whitespace,
    quiet grey surfaces, simple typography, soft peach gradient
    atmosphere, compact side panel.
-   **Reference 3:** Warm yellow highlights, light cool-grey background,
    white cards, soft shadows, clear three-column desktop composition,
    rounded surfaces.

Do not copy their product names, labels, content, icons, illustrations,
widgets, or information architecture. Build the actual English
conversation-learning product using the separate project brief as the
source for features and content.

### Design keywords

**Friendly · Calm · Focused · Modern · Warm · Structured · Encouraging ·
Accessible**

The interface should feel premium without looking corporate or
intimidating. It should encourage learners to practise for a few minutes
every day and make conversation content the visual centre of the
product.

### Core design principle

> The conversation is the hero. Navigation, progress, vocabulary,
> translations, and practice tools should support the conversation
> rather than compete with it.

------------------------------------------------------------------------

## 2. Visual system at a glance

  -----------------------------------------------------------------------
  Area                                Direction
  ----------------------------------- -----------------------------------
  Overall canvas                      Soft warm off-white

  Main surfaces                       Pure white and very light neutral

  Primary brand                       Deep, friendly violet

  Secondary accent                    Warm golden yellow

  Supporting accent                   Soft peach / coral

  Text                                Deep charcoal, not pure black

  Borders                             Very light cool grey

  Cards                               Rounded, white, subtle border and
                                      soft shadow

  Layout                              Spacious desktop workspace;
                                      simplified stacked mobile layout

  Typography                          Clean sans-serif with strong
                                      hierarchy

  Interaction                         Clear, quiet hover/focus states; no
                                      excessive animation
  -----------------------------------------------------------------------

Use purple for identity and important navigation/actions. Use yellow for
progress, selected states, encouragement, and small highlights. Peach
should remain an occasional decorative/supporting accent, not a
competing primary colour.

------------------------------------------------------------------------

## 3. Colour tokens

The values below are a proposed product palette interpreted from the
reference images. They are not sampled brand specifications. Keep the
palette centralised so it can be tuned later.

### 3.1 Brand palette

  Token          Hex         Use
  -------------- ----------- -----------------------------------------
  `brand-950`    `#35215F`   Deep purple, high emphasis
  `brand-900`    `#432B78`   Dark navigation / strong brand surfaces
  `brand-800`    `#563B91`   Primary brand
  `brand-700`    `#684BA7`   Hover / active brand
  `brand-100`    `#EEE9F8`   Selected backgrounds
  `brand-50`     `#F7F4FC`   Very soft purple surface
  `accent-500`   `#F2C96D`   Warm yellow highlight
  `accent-400`   `#F7D98E`   Soft yellow surface
  `accent-100`   `#FFF4D8`   Highlight background
  `peach-400`    `#F3A58F`   Decorative peach
  `peach-100`    `#FCE9E2`   Soft supporting background

### 3.2 Neutral palette

  Token              Hex         Use
  ------------------ ----------- ----------------------------------
  `canvas`           `#F7F7F8`   Main app background
  `surface`          `#FFFFFF`   Cards, panels, dialogs
  `surface-muted`    `#F4F4F6`   Input backgrounds, quiet panels
  `surface-warm`     `#FFFAF6`   Warm welcome / empty-state areas
  `border`           `#E9E8ED`   Default borders
  `border-strong`    `#D8D6DF`   Emphasised separators
  `text-primary`     `#24232A`   Headings and main content
  `text-secondary`   `#6F6D78`   Supporting text
  `text-muted`       `#9896A1`   Metadata and placeholders
  `white`            `#FFFFFF`   Surface

### 3.3 Semantic colours

  Purpose               Colour      Guidance
  --------------------- ----------- ------------------------------------------
  Success               `#27845D`   Completed practice, correct answer
  Success surface       `#EAF6EF`   Soft success background
  Warning               `#B7791F`   Caution or pending item
  Warning surface       `#FFF5DF`   Soft warning background
  Error                 `#C94A4A`   Validation errors and destructive states
  Error surface         `#FDEEEE`   Error background
  Information           `#4775B8`   Helpful information
  Information surface   `#EDF3FC`   Information background

Do not use semantic colours as decoration. Colour must always be paired
with text, an icon, or another non-colour indicator.

### 3.4 Colour usage ratio

As a general visual balance:

-   65--75% neutral canvas and white surfaces
-   15--20% text and neutral structure
-   5--10% purple brand surfaces and actions
-   3--5% yellow and peach accents

Avoid making every card purple or yellow. The overall interface should
remain mostly neutral.

------------------------------------------------------------------------

## 4. Typography

Use **Inter** as the preferred interface font, with a system sans-serif
fallback. If the product uses Bangla translations, use a Bangla-capable
font such as **Hind Siliguri** or **Noto Sans Bengali** for Bangla text.
Verify that both scripts render cleanly and align consistently.

### Type scale

  Role                   Desktop     Mobile Weight
  ------------------- ---------- ---------- ----------
  Page title            30--32px   25--28px 650--700
  Section heading       20--22px   18--20px 600
  Card heading          16--18px       16px 600
  Body                  14--16px   14--16px 400
  Supporting text       13--14px   13--14px 400
  Label / metadata          12px       12px 500
  Button                    14px       14px 600
  Conversation line     16--18px   16--17px 400--500

### Typography rules

-   Use sentence case for page titles, buttons, and navigation.
-   Avoid all-caps labels except for very small optional metadata.
-   Keep paragraph line-height around 1.5--1.65.
-   Keep conversation dialogue comfortable to read; do not compress it
    like dashboard metadata.
-   Use medium or semibold weights for speaker names and important
    phrases.
-   Use tabular numerals for timers, streak counts, and progress values
    where useful.
-   Avoid very light font weights on pale backgrounds.
-   Limit long line lengths. Conversation text should have a readable
    measure, ideally around 55--75 characters per line on desktop.

------------------------------------------------------------------------

## 5. Layout and spacing

Use a consistent spacing scale based on 4px increments.

  Token          Value Typical use
  ------------ ------- ------------------------------
  `space-1`        4px Icon/text gap
  `space-2`        8px Compact control spacing
  `space-3`       12px Small card spacing
  `space-4`       16px Default component spacing
  `space-5`       20px Comfortable internal spacing
  `space-6`       24px Card padding / section gap
  `space-8`       32px Major section gap
  `space-10`      40px Large section separation
  `space-12`      48px Page-level separation
  `space-16`      64px Large desktop breathing room

### Page container

-   Desktop content max width: approximately 1440px.
-   Standard page horizontal padding: 24--32px on desktop.
-   Tablet horizontal padding: 20--24px.
-   Mobile horizontal padding: 16px.
-   Keep the main content centred when the viewport is very wide.
-   Do not let text-heavy learning content stretch across the full
    desktop width.

### Desktop application shell

Use a flexible application shell:

1.  **Sidebar:** fixed or sticky, approximately 232--256px wide.
2.  **Main workspace:** flexible, min-width 0, with a comfortable
    content max width.
3.  **Optional contextual panel:** approximately 280--320px where it
    genuinely supports the current task.

Do not force every screen into three columns. A conversation lesson
should prioritise the dialogue and may use a narrower contextual panel.
A discovery or dashboard page can use a wider multi-column composition.

### Surface spacing

-   Cards: 20--24px padding on desktop; 16px on mobile.
-   Card-to-card gap: 16--20px.
-   Section-to-section gap: 28--36px.
-   Form field gap: 14--16px.
-   Dense lists: 10--14px vertical rhythm.

------------------------------------------------------------------------

## 6. Shape, borders, and elevation

### Border radius

  Element                          Radius
  ---------------------------- ----------
  Small badges                     9999px
  Inputs and compact buttons     10--12px
  Standard cards                     16px
  Large panels                   20--24px
  Modal / overlay                20--24px
  Main app frame (if framed)     24--28px

Use rounded corners consistently. Avoid mixing sharp square panels with
highly rounded cards without a clear hierarchy.

### Borders

-   Default card border: 1px solid `#E9E8ED`.
-   Inputs: 1px solid `#E2E0E8`.
-   Selected item: purple border plus a very light purple background.
-   Do not outline every nested element. Use spacing and surface
    contrast to establish hierarchy.

### Shadows

Use restrained shadows:

-   Subtle card: `0 2px 10px rgba(31, 25, 48, 0.04)`
-   Raised card: `0 8px 24px rgba(31, 25, 48, 0.07)`
-   Popover / modal: `0 16px 48px rgba(31, 25, 48, 0.14)`

Prefer a light border plus a soft shadow over a strong shadow alone.
Avoid heavy neumorphism, glassmorphism, and excessive blur.

------------------------------------------------------------------------

## 7. Navigation style

### Desktop

-   Use a left sidebar with a clear brand area at the top.
-   Navigation items should have an icon and short label.
-   Default navigation state: transparent or neutral.
-   Active state: soft purple background with purple text/icon;
    optionally use a narrow purple indicator.
-   Hover state: subtle neutral or purple-tinted background.
-   Separate primary navigation from secondary settings/help links.
-   Keep sidebar content vertically organised and avoid overcrowding.

### Tablet

-   Sidebar may become narrower or collapsible.
-   When collapsed, show recognisable icons with accessible
    tooltips/labels.
-   Keep the current page context visible.

### Mobile

-   Do not squeeze the desktop sidebar into a narrow column.
-   Use a compact top bar and a mobile bottom navigation for the most
    important destinations, or a simple slide-over drawer for secondary
    destinations.
-   Keep bottom navigation to roughly 3--5 primary destinations.
-   Respect safe-area insets on devices with home indicators.
-   Ensure the active state is identifiable without relying on colour
    alone.

------------------------------------------------------------------------

## 8. Component styling

### 8.1 Buttons

**Primary** - Purple background, white text. - Medium/semibold label. -
44--48px minimum height. - 10--12px radius. - Hover: slightly darker
purple. - Focus: visible purple focus ring.

**Secondary** - White or neutral surface. - Neutral border. - Deep
charcoal text. - Hover: light neutral/purple-tinted background.

**Accent** - Yellow background with dark text. - Reserve for one clear
highlight or encouraging action. - Do not use yellow text on white.

**Ghost** - Transparent background. - Neutral or purple text. - Hover
background appears softly.

**Destructive** - Error colour and explicit wording. - Never style a
destructive action as the default primary action.

Buttons must include disabled, loading, hover, active, and
keyboard-focus states. Do not communicate loading only by changing the
label; include a visible progress indicator when appropriate.

### 8.2 Inputs and search

-   White or very light neutral background.
-   44--48px control height.
-   10--12px radius.
-   Clear label above the field.
-   Placeholder text must be lower contrast than entered text but still
    readable.
-   Focus: purple border and soft focus ring.
-   Error: error border plus explanatory message.
-   Search icon may sit inside the leading edge.
-   On mobile, prevent input text from triggering unwanted browser zoom;
    use at least 16px text for form controls.

### 8.3 Cards

-   White surface, subtle border, 16px radius.
-   Use consistent internal padding.
-   Clear title, description, and optional metadata hierarchy.
-   Use small icon or restrained illustration only when it adds meaning.
-   Hover elevation only for interactive cards.
-   Do not make static content cards look clickable.

### 8.4 Badges and chips

-   Pill shape.
-   Compact 12--13px text.
-   Soft tinted background with readable text.
-   Use for level, duration, topic, completion, or status.
-   Keep the number of chips per card limited.

### 8.5 Tabs and segmented controls

-   Use a subtle neutral track or underline.
-   Selected state: purple text and a soft purple fill or underline.
-   Maintain clear keyboard focus and selected semantics.
-   On narrow screens, allow horizontal scrolling rather than wrapping
    into a cluttered multi-line tab bar.

### 8.6 Progress indicators

-   Use a pale neutral track.
-   Purple for main learning progress.
-   Yellow for a secondary milestone or achievement.
-   Show a numeric label when progress matters.
-   Progress must not rely on colour alone.

### 8.7 Dialogues and conversation blocks

This is the most important content component in the product.

-   Use a calm white or very light surface.
-   Speaker name should be clear and visually distinct.
-   Differentiate speakers with subtle avatar, initials, or a small
    coloured marker.
-   Dialogue text should be the most readable element.
-   Provide enough vertical spacing between turns.
-   Translation should appear below the English line in a softer text
    colour or expandable area.
-   Audio/play controls should be compact and easy to reach.
-   Highlight vocabulary only with a subtle underline or soft tint.
-   Avoid chat-bubble styling that makes long learning dialogues
    difficult to scan.
-   If using chat bubbles, keep widths readable and maintain consistent
    speaker alignment.

### 8.8 Audio controls

-   Use a clear play/pause button with a generous hit target.
-   Show playback progress and duration.
-   Provide speed control in a compact menu.
-   Use a distinct active state when a line is playing.
-   Avoid autoplay by default.
-   On mobile, keep essential audio controls within thumb reach.

### 8.9 Empty, loading, and error states

-   Empty states should be warm, concise, and action-oriented.
-   Use a small illustration or icon sparingly.
-   Loading states should preserve layout to prevent content jumps.
-   Error states should explain what happened and provide a recovery
    action.
-   Avoid using only a spinner for long-running operations.

------------------------------------------------------------------------

## 9. Responsive behaviour --- mandatory

The application must be designed mobile-first and tested at real
viewport widths. Desktop layouts must not simply be scaled down.

Tailwind CSS uses a mobile-first responsive model: unprefixed classes
define the base/mobile layout, while breakpoint-prefixed utilities apply
at that breakpoint and above.

### Tailwind default breakpoints

  Prefix     Minimum width Intended use
  -------- --------------- ------------------------------
  Base         below 640px Mobile
  `sm:`              640px Large phones / small tablets
  `md:`              768px Tablets
  `lg:`             1024px Small desktop / laptop
  `xl:`             1280px Desktop
  `2xl:`            1536px Wide desktop

Use the project's installed Tailwind version and existing configuration.
Do not replace or migrate the CSS setup just to match this document.

### Layout rules by screen size

**Mobile --- below 640px** - One-column layout. - Sidebar hidden; use
bottom navigation or drawer. - Page padding 16px. - Cards stack
vertically. - Main actions should be full-width where useful. -
Conversation text takes full available width. - Contextual tools open as
accordions, drawers, or bottom sheets. - Avoid persistent right-side
panels. - Keep controls at least 44px high where practical. - Avoid
horizontal page scrolling.

**Large mobile / small tablet --- 640px to 767px** - Mostly one
column. - Small card grids may become two columns if each card remains
readable. - Navigation remains compact. - Keep conversation content in a
single readable column.

**Tablet --- 768px to 1023px** - Use a collapsible or compact sidebar if
it fits. - Two-column card grids are appropriate. - Secondary panels may
move below the primary content. - Do not allow dialogue and translation
columns to become too narrow.

**Desktop --- 1024px to 1279px** - Full application shell may appear. -
Sidebar plus main content. - Optional right contextual panel only when
there is sufficient space. - Use two-column or three-column layouts
according to content priority.

**Wide desktop --- 1280px and above** - Use the full workspace layout. -
Keep a max-width content container. - Use additional space for
contextual learning tools, not oversized text lines. - Avoid stretching
cards or dialogue lines excessively.

### Example mobile-first Tailwind patterns

``` html
<!-- Responsive page container -->
<main class="mx-auto w-full max-w-[1440px] px-4 sm:px-5 lg:px-8">
  ...
</main>

<!-- One column on mobile, two on tablet, three on wide desktop -->
<section class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
  ...
</section>

<!-- Mobile stack, desktop sidebar + content -->
<div class="flex min-h-screen flex-col lg:flex-row">
  <aside class="hidden w-60 shrink-0 lg:block">...</aside>
  <main class="min-w-0 flex-1">...</main>
</div>

<!-- Conversation workspace with optional contextual panel -->
<div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
  <section class="min-w-0">...</section>
  <aside class="min-w-0">...</aside>
</div>

<!-- Responsive card padding -->
<article class="rounded-2xl border border-[#E9E8ED] bg-white p-4 shadow-sm sm:p-5 lg:p-6">
  ...
</article>
```

### Responsive acceptance checks

Test at minimum: - 320 × 640 - 360 × 800 - 390 × 844 - 768 × 1024 - 1024
× 768 - 1280 × 800 - 1440 × 900

At every width: - No accidental horizontal scrolling. - No clipped
navigation labels or buttons. - No overlapping cards, dialogs, or sticky
elements. - Dialogue text remains readable. - Primary action remains
visible and reachable. - Modals fit within the viewport and can scroll
internally. - Bottom navigation does not cover page content. - Touch
targets are comfortably sized. - Long English sentences and Bangla
translations wrap naturally.

------------------------------------------------------------------------

## 10. Learning experience visual principles

The product is conversation-first. Apply these rules to all learning
screens.

### Conversation hierarchy

1.  Scenario title and short context.
2.  Level, situation, and estimated duration.
3.  Main English conversation.
4.  Speaker identity and turn-by-turn controls.
5.  Translation and vocabulary support.
6.  Practice action and next step.

Do not show every learning tool expanded by default. Use progressive
disclosure: learners should first understand and follow the
conversation, then open translation, vocabulary, grammar, or practice
support when needed.

### English and Bangla display

-   English is the primary learning text.
-   Bangla translation is supporting text, not equal visual weight by
    default.
-   Provide an obvious show/hide translation control.
-   Use an appropriate Bangla font and line-height.
-   Allow longer Bangla translations to wrap without clipping.
-   Keep English and Bangla visually grouped so the relationship is
    clear.

### Learning level indicators

Use calm, consistent chips for level and difficulty. Avoid alarming
red/orange colours for normal difficulty levels. Keep level labels
understandable and consistent throughout the product.

### Practice feedback

-   Correct answer: soft green surface and clear confirmation.
-   Incorrect answer: gentle correction, not a harsh warning.
-   Suggested improvement: purple-tinted surface.
-   Encouragement: occasional yellow highlight.
-   Always explain the correction in useful language; colour alone is
    not feedback.

------------------------------------------------------------------------

## 11. Iconography and illustration

-   Use one consistent outline icon family throughout the product.
-   Prefer simple, recognisable icons.
-   Use a consistent stroke width and optical size.
-   Icons should support labels, not replace essential labels.
-   Avoid mixing filled 3D icons, thin outline icons, and emoji as the
    main interface icon system.
-   Illustrations should be occasional, friendly, and secondary.
-   Do not copy the reference images' illustrations or decorative
    graphics.

------------------------------------------------------------------------

## 12. Motion and interaction

Motion should be subtle and functional.

-   Hover transitions: approximately 150--200ms.
-   Small state transitions: approximately 150--250ms.
-   Drawer/modal transitions: approximately 200--300ms.
-   Use ease-out for entrances and ease-in for exits.
-   Avoid constant pulsing, bouncing, or distracting animated
    decorations.
-   Respect `prefers-reduced-motion`.
-   Never make an essential action depend on animation.

Suggested interactions: - Card hover: slight border/shadow change. -
Button hover: small colour shift. - Accordion: smooth height/opacity
transition if it remains performant. - Active audio line: soft
background highlight. - Completed lesson: subtle success confirmation.

------------------------------------------------------------------------

## 13. Accessibility requirements

-   Meet WCAG 2.2 AA contrast targets where applicable.
-   Body text should generally maintain at least 4.5:1 contrast.
-   Large text should generally maintain at least 3:1 contrast.
-   Provide visible keyboard focus indicators.
-   All interactive controls must be keyboard accessible.
-   Use semantic buttons, links, headings, labels, and landmarks.
-   Provide accessible names for icon-only controls.
-   Do not use colour as the only way to show status.
-   Support browser zoom and text resizing.
-   Keep focus within open modal dialogs and return focus when they
    close.
-   Respect reduced-motion preferences.
-   Ensure screen readers can distinguish speaker names, dialogue text,
    translation, and audio controls.

------------------------------------------------------------------------

## 14. Tailwind CSS implementation guidance

### 14.1 Version and project discovery

Before implementing: 1. Inspect the existing repository and identify the
installed Tailwind CSS version. 2. Check the framework, build tool,
existing global CSS, component conventions, and theme setup. 3. Preserve
the current architecture unless a change is necessary and approved. 4.
Do not assume Tailwind v3 or v4. 5. Use the correct theme configuration
approach for the installed version.

For Tailwind CSS v4, centralise design tokens using CSS-first theme
variables with `@theme` where appropriate. For Tailwind CSS v3, use the
existing `tailwind.config` theme extension pattern. Do not mix
configuration approaches.

### 14.2 Suggested Tailwind v4 theme

The following is a starting example, not an instruction to overwrite an
existing theme file. Adapt it to the installed project and preserve any
existing tokens.

``` css
@import "tailwindcss";

@theme {
  --color-brand-950: #35215F;
  --color-brand-900: #432B78;
  --color-brand-800: #563B91;
  --color-brand-700: #684BA7;
  --color-brand-100: #EEE9F8;
  --color-brand-50: #F7F4FC;

  --color-accent-500: #F2C96D;
  --color-accent-400: #F7D98E;
  --color-accent-100: #FFF4D8;

  --color-peach-400: #F3A58F;
  --color-peach-100: #FCE9E2;

  --color-canvas: #F7F7F8;
  --color-surface: #FFFFFF;
  --color-surface-muted: #F4F4F6;
  --color-border: #E9E8ED;
  --color-border-strong: #D8D6DF;

  --color-text-primary: #24232A;
  --color-text-secondary: #6F6D78;
  --color-text-muted: #9896A1;

  --color-success: #27845D;
  --color-success-surface: #EAF6EF;
  --color-warning: #B7791F;
  --color-warning-surface: #FFF5DF;
  --color-error: #C94A4A;
  --color-error-surface: #FDEEEE;
  --color-info: #4775B8;
  --color-info-surface: #EDF3FC;

  --font-sans: "Inter", "Hind Siliguri", ui-sans-serif, system-ui, sans-serif;

  --radius-card: 1rem;
  --radius-panel: 1.25rem;
}
```

### 14.3 Utility class conventions

-   Prefer theme tokens over repeated arbitrary hex values.
-   Use standard Tailwind spacing and layout utilities.
-   Use arbitrary values only when a real design need is not covered by
    the token system.
-   Avoid long, duplicated class strings across many components; extract
    reusable components or use the project's established class
    composition pattern.
-   Keep responsive variants mobile-first.
-   Use `min-w-0` on flex/grid children that contain long text.
-   Use `break-words` or suitable wrapping utilities for long words/URLs
    where necessary.
-   Use `overflow-x-auto` only for intentional horizontal scrolling
    areas, not to hide layout defects.
-   Use `focus-visible` styles for keyboard interaction.
-   Use `motion-reduce` variants for motion-sensitive users.
-   Avoid using `!important` or excessive arbitrary z-index values.
-   Keep layout primitives consistent across pages.

### 14.4 Useful utility patterns

``` html
<!-- App canvas -->
<div class="min-h-dvh bg-canvas text-text-primary antialiased">
  ...
</div>

<!-- Surface card -->
<section class="rounded-card border border-border bg-surface p-4 shadow-sm sm:p-5">
  ...
</section>

<!-- Primary action -->
<button class="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-800 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-50">
  Start practice
</button>

<!-- Secondary action -->
<button class="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700">
  View details
</button>

<!-- Selected chip -->
<span class="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-900">
  Beginner
</span>

<!-- Form field -->
<input class="min-h-11 w-full rounded-xl border border-border bg-white px-4 text-base text-text-primary placeholder:text-text-muted focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-100" />
```

These examples demonstrate the visual system. Replace sample labels with
the actual product content from the project brief.

------------------------------------------------------------------------

## 15. Do and don't

### Do

-   Keep the interface mostly neutral and spacious.
-   Use purple consistently for primary brand identity.
-   Use warm yellow sparingly for emphasis and encouragement.
-   Make the conversation text the clearest and most prominent content.
-   Use white cards with subtle borders and shadows.
-   Design the mobile experience first.
-   Use responsive layouts that adapt structurally.
-   Keep all spacing, colours, radii, and typography consistent through
    tokens.
-   Use progressive disclosure for translations and learning aids.
-   Ensure every control has accessible focus and touch states.

### Don't

-   Do not copy the reference screens' content, brand names, or exact
    layouts.
-   Do not turn the product into a generic project-management dashboard.
-   Do not use purple, yellow, or gradients on every surface.
-   Do not put too much information into one card.
-   Do not use tiny text for conversation dialogue.
-   Do not keep a desktop right panel visible on narrow screens.
-   Do not rely on hover-only interactions.
-   Do not create horizontal overflow on mobile.
-   Do not use decorative gradients behind every section.
-   Do not introduce a new colour for every category or learning level.
-   Do not invent a different design language for each page.

------------------------------------------------------------------------

## 16. Quality assurance checklist

### Visual consistency

-   [ ] Brand purple, warm yellow, peach, and neutral tokens are used
    consistently.
-   [ ] Typography scale and line-height are consistent.
-   [ ] Card radius, borders, shadows, and padding follow this guide.
-   [ ] Buttons, fields, chips, tabs, and progress indicators share
    consistent states.
-   [ ] The interface does not resemble a copied reference product.

### Responsive behaviour

-   [ ] Mobile layout is designed intentionally, not merely compressed.
-   [ ] Sidebar changes to a mobile-appropriate navigation pattern.
-   [ ] Cards and panels stack in a sensible order.
-   [ ] Conversation text and Bangla translation remain readable.
-   [ ] No horizontal overflow at the target viewport sizes.
-   [ ] Dialogs, drawers, and bottom navigation work on mobile.
-   [ ] Touch targets are large enough.

### Accessibility

-   [ ] Contrast is sufficient.
-   [ ] Keyboard focus is visible.
-   [ ] Icon-only controls have accessible labels.
-   [ ] Colour is not the only status indicator.
-   [ ] Reduced motion is respected.
-   [ ] Forms have clear labels and error messages.

### Engineering

-   [ ] Existing Tailwind version and project conventions were
    inspected.
-   [ ] Design tokens are centralised.
-   [ ] Reusable components are used for repeated patterns.
-   [ ] No unnecessary dependency or framework migration was introduced.
-   [ ] Responsive states were tested in a browser at the listed sizes.

------------------------------------------------------------------------

## 17. Antigravity implementation prompt

Use this prompt after adding this document to the project root.

``` text
Read the complete UI Design System & Visual Style Guide before making visual changes.

The three user-provided reference images define visual style only. They do not define the product's content, features, labels, or information architecture. Use the English Conversation Practice Project Brief as the source of truth for product functionality and content.

Your task:
1. Inspect the existing project, framework, installed Tailwind CSS version, current design tokens, global styles, and component architecture.
2. Do not overwrite or migrate existing project configuration without a clear technical reason.
3. Translate this style guide into a coherent reusable design system.
4. Centralise colours, typography, radii, shadows, and other design tokens using the correct configuration approach for the installed Tailwind version.
5. Build mobile-first responsive layouts. Do not simply shrink desktop screens.
6. Apply the visual language: neutral spacious canvas, white rounded cards, deep purple primary brand, warm yellow highlights, restrained peach accents, subtle borders and soft shadows.
7. Make the conversation content the main visual focus on learning screens.
8. Use progressive disclosure for translation, vocabulary, grammar, and other learning aids.
9. Implement consistent component states: default, hover, active, focus-visible, disabled, loading, empty, and error.
10. Test at 320px, 360px, 390px, 768px, 1024px, 1280px, and 1440px widths. Fix overflow, clipping, overlap, and unreadable content.

Important constraints:
- Do not copy the reference images' content, branding, exact widgets, or product layouts.
- Do not invent or remove product features; follow the project brief.
- Do not use a different visual style on each page.
- Do not introduce unnecessary dependencies.
- Do not leave placeholder controls that look functional but do nothing.
- Do not proceed with broad feature implementation until the design-system proposal and first responsive screen have been reviewed.

First deliver:
A. A short audit of the existing UI and Tailwind setup.
B. A token mapping proposal.
C. A reusable component inventory.
D. A responsive layout plan.
E. A list of files you intend to create or edit.

Wait for approval before implementing the full design system.
```

------------------------------------------------------------------------

## 18. Reference interpretation and official documentation

### What was taken from the supplied references

-   Purple navigation and warm neutral contrast from reference 1.
-   Minimal, spacious, low-noise workspace from reference 2.
-   White rounded cards, pale cool-grey canvas, and warm yellow emphasis
    from reference 3.
-   Overall use of soft shadows, generous whitespace, and clear content
    hierarchy across all three.

### Tailwind CSS documentation

Use the official documentation as the implementation authority for the
installed Tailwind version:

-   Responsive design: https://tailwindcss.com/docs/responsive-design
-   Theme variables: https://tailwindcss.com/docs/theme

This guide is a product-specific visual specification. Official Tailwind
documentation governs framework syntax and version-specific
implementation details.

------------------------------------------------------------------------

**End of document**
