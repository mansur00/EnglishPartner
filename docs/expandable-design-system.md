# Expandable Design System
**Based on shadcn/ui patterns & EnglishPartner tokens**

> A code-first, expandable design system foundation built for EnglishPartner.  
> Directly aligned with CVA props, Tailwind CSS tokens, and accessibility invariants.

---

## 1. Principles

1. **Code-first naming:** Every variant, size, and state name strictly matches the prop names in CVA and Tailwind.
2. **Minimal by default:** Ships the necessary semantic primitives with room to expand without breaking changes.
3. **Composable, not monolithic:** Uses composition (`Field`, `InputGroup`, `Pill`, `Tag`) over variant explosion.
4. **Token-driven:** Colors, radius, spacing, and typography live in CSS variables—strictly 0 hardcoded values.
5. **Accessibility first:** Built on Base UI & React primitives, keyboard-focused, high contrast (WCAG AAA compliant), with clear focus rings.

---

## 2. Core Tokens (Foundation Layer)

### Semantic Color Tokens
- `--primary`, `--primary-foreground`: Brand violet action color (`#4A1D6E`).
- `--secondary`, `--secondary-foreground`: Soft brand tint.
- `--cta`, `--cta-hover`: High-contrast saturated yellow (`--sun-500 #FFD93D`) for primary calls-to-action.
- `--muted`, `--muted-foreground`: Subtle backgrounds and secondary text.
- `--card`, `--card-foreground`: Elevated surfaces with 1px border.
- `--destructive`, `--destructive-foreground`: Negative / irreversible status.
- `--border`, `--input`, `--ring`: Interactive states and focus rings.

### Radius Scale
- `--radius-card` (16px / `1rem`): Page cards, hero cards, dialogs.
- `--radius-panel` (12px / `0.75rem`): Nested dialogue previews, inner panels.
- `--radius-control` (12px / `0.75rem`): Buttons, inputs, selects, tabs.
- `--radius-pill` (9999px): Badges, pills, tags, chips, progress indicators.

### Component Height Scale
| Size | Height | Button Class | Input Class | Typical Use |
|---|---|---|---|---|
| `xs` | 28px | `h-7 px-2.5 text-chip` | — | Dense toolbars, tables |
| `sm` | 32–36px | `h-control-sm px-3.5 text-meta` | `h-control-sm px-3 text-meta` | Compact forms, secondary UI |
| `default` / `md` | 36–44px | `h-control-md px-5 text-label` | `h-input px-4 text-body` | Standard forms & actions |
| `lg` | 48–52px | `h-control-lg px-7 text-lead` | `h-control-lg px-4 text-lead` | Hero CTAs, prominent inputs |
| `icon` | 44px square | `size-tap` | — | Touch-optimized icon button |
| `icon-xs` | 28px square | `size-7` | — | Compact toolbars |
| `icon-sm` | 36px square | `h-control-sm w-control-sm` | — | Compact cards |
| `icon-lg` | 48px square | `h-control-lg w-control-lg` | — | Prominent actions |

---

## 3. Implemented Components

### 3.1 Button (`src/components/ui/button.tsx`)
```tsx
import { Button } from "@/components/ui/button";

// Primary action
<Button variant="default" size="default">Continue</Button>

// Secondary action
<Button variant="secondary" size="sm">Cancel</Button>

// Loading button with spinner
<Button loading variant="default">Saving...</Button>

// Pill button
<Button pill variant="cta" size="lg">Start Learning</Button>

// Icon-only button
<Button variant="outline" size="icon-sm">
  <HugeiconsIcon icon={VolumeHighIcon} size={16} />
</Button>
```

### 3.2 Input (`src/components/ui/input.tsx`)
```tsx
import { Input } from "@/components/ui/input";

// Standard outline input
<Input placeholder="Enter your name..." />

// Filled input
<Input variant="filled" placeholder="Quick search..." />

// Compact pill input
<Input pill inputSize="sm" placeholder="Filter tags..." />
```

### 3.3 Field Pattern (`src/components/ui/field.tsx`)
```tsx
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

<Field invalid={hasError}>
  <FieldLabel>Email address</FieldLabel>
  <Input type="email" placeholder="you@example.com" />
  <FieldDescription>We will only use this for login confirmation.</FieldDescription>
  <FieldError>Please enter a valid email address.</FieldError>
</Field>
```

### 3.4 InputGroup (`src/components/ui/input-group.tsx`)
```tsx
import { InputGroup, InputGroupPrefix, InputGroupSuffix } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

<InputGroup>
  <InputGroupPrefix>
    <HugeiconsIcon icon={Search01Icon} size={16} />
  </InputGroupPrefix>
  <Input className="pl-10" placeholder="Search conversations..." />
</InputGroup>
```

### 3.5 Badge (`src/components/ui/badge.tsx`)
```tsx
import { Badge } from "@/components/ui/badge";

<Badge variant="default">New</Badge>
<Badge variant="success">Completed</Badge>
<Badge variant="warning">In Review</Badge>
<Badge variant="destructive">Error</Badge>
<Badge shape="rounded">Card Tag</Badge>
```

### 3.6 Pill (`src/components/ui/pill.tsx`)
```tsx
import { Pill } from "@/components/ui/pill";

<Pill variant="default">A1 Beginner</Pill>
<Pill variant="success" dot>Live Session</Pill>
```

### 3.7 Tag (`src/components/ui/tag.tsx`)
```tsx
import { Tag } from "@/components/ui/tag";

// Removable filter chip
<Tag onRemove={() => removeFilter("shopping")}>Shopping</Tag>

// Selectable category chip
<Tag selected={isSelected} onClick={() => setIsSelected(!isSelected)}>
  Grammar Focus
</Tag>
```

---

## 4. Expansion Checklist

When adding a new variant or component:
- [x] Variants map to semantic colors (never arbitrary hex).
- [x] Heights align with the `xs / sm / default / lg` scale.
- [x] Maximum font-weight is 600 (`font-semibold`).
- [x] Minimum font-size floor is 12px.
- [x] Zero hard-coding violations verified via `npm run lint:tokens`.
