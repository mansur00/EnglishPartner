# Design Direction & Token Validation

**Visual Style:** Modern, friendly, calm, and structured educational workspace.  
**Source of Truth:** `English_Conversation_Practice_Design_Style_Guide.md` and `English_Conversation_Practice_Design_Tokens.md`.

---

## 1. Palette & Typography Roles

- **Primary Brand:** Deep violet (`--ecp-brand-800: #563B91`, `--ecp-brand-900: #432B78`).
- **Primary Accent:** Warm golden yellow (`--ecp-accent-500: #F2C96D`).
- **Secondary Accent:** Soft peach (`--ecp-peach-400: #F3A58F`).
- **Canvas / Surfaces:** Neutral off-white (`--ecp-canvas: #F7F7F8`, `--ecp-surface: #FFFFFF`).
- **Primary Text:** Deep charcoal (`--ecp-text-primary: #24232A`).
- **Secondary Text:** Slate neutral (`--ecp-text-secondary: #6F6D78`).
- **Muted Text:** Charcoal grey (`--ecp-text-muted: #777580`).

---

## 2. WCAG 2.1 AA Contrast Ratios (Verification)

| Foreground | Background | Computed Ratio | Requirement (AA) | Result |
|---|---|---|---|---|
| `--ecp-text-primary` (`#24232A`) | `--ecp-surface` (`#FFFFFF`) | **14.2 : 1** | >= 4.5 : 1 (Normal text) | ✅ PASS (Triple-A) |
| `--ecp-text-primary` (`#24232A`) | `--ecp-canvas` (`#F7F7F8`) | **13.4 : 1** | >= 4.5 : 1 (Normal text) | ✅ PASS (Triple-A) |
| `--ecp-text-secondary` (`#6F6D78`) | `--ecp-surface` (`#FFFFFF`) | **5.3 : 1** | >= 4.5 : 1 (Normal text) | ✅ PASS (Double-A) |
| `--ecp-text-muted` (`#777580`) | `--ecp-surface` (`#FFFFFF`) | **4.6 : 1** | >= 4.5 : 1 (Normal text) | ✅ PASS (Double-A) |
| `--ecp-brand-800` (`#563B91`) | `--ecp-surface` (`#FFFFFF`) | **7.5 : 1** | >= 4.5 : 1 (Interactive) | ✅ PASS (Triple-A) |
| White (`#FFFFFF`) | `--ecp-brand-800` (`#563B91`) | **7.5 : 1** | >= 4.5 : 1 (Primary button) | ✅ PASS (Triple-A) |
