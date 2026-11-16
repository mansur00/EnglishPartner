# EnglishPartner — UI & Design Conventions

## 1. Card Component Architecture & Padding Scale

- **Standard Card Padding:**
  - Default card padding is uniformly `p-5 md:p-6` (`20px` mobile, `24px` desktop).
  - Small card padding (`size="sm"`) is `p-4` (`16px`).
  - No element (badge, title, text, footer, button) may ever sit flush against a card border.
- **Card Subcomponents:**
  - When `CardHeader`, `CardContent`, or `CardFooter` are explicitly passed, the parent card drops default padding via `has-data-[slot=card-header]:p-0` so the structured layout controls its respective slots cleanly.
- **Borders & Elevation:**
  - Thin 1px borders using `--border` token (`border border-border`).
  - Low-contrast, subtle elevation (`shadow-xs` or `shadow-sm`).
  - Strict rule: **No 3D bevels, skeuomorphism, or thick gray double rings (`ring-1 ring-foreground/10` is removed)**.

## 2. Spacing & Typography Hierarchy

- **Title to Subtitle / Description Gap:**
  - Heading 3 (`text-base md:text-lg font-bold`) to Bengali subtitle (`text-xs md:text-sm`): `mt-1`.
  - Subtitle to English description: `mt-2.5` (tight, legible grouping; avoid oversized gaps).
- **Interactive Elements:**
  - All button tap targets on mobile must have a minimum height of `36px` to `44px`.
  - Footers separated by a thin 1px border (`border-t border-border pt-4 mt-4`).

