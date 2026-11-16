# English Conversation Partner — Phase 0 Kit

**Purpose:** Everything needed to run Phase 0 (Discovery & Setup) in one pass: the agent prompt to paste, the document templates the agent fills, the design-token generation task, and the owner approval checklist.
**Approved inputs:** `ECP_Decisions_Register.md` (D-01 to D-18, approved 16 November 2026), `ECP_Phase_Plan.md` §3, and the spec documents listed in Phase Plan §0.3.
**Exit gate:** 🛑 Approval point 0 (§6). Phase 1 does not start until it passes.

---

## 1. Phase 0 at a Glance

| Task | Output | Owner input needed |
|---|---|---|
| 0.1 Workspace audit | `docs/WORKSPACE_AUDIT.md` | No |
| 0.2 Confirm D-04 and D-18 | `docs/DECISIONS.md` rows | No, unless the audit finds a conflict |
| 0.3–0.4 Register and language/audio decisions | `docs/DECISIONS.md` (copied from register) | No, already approved |
| 0.5 Repository and tooling | Running app | No |
| 0.6 Docs skeleton | Seven docs files (§3) | No |
| 0.7 `.env.example` | Variable names only (§3.3) | Provider account names |
| 0.8 Hosting and database | Health route returns OK | Free-tier accounts created by owner |
| 0.9 CI | Green pipeline | No |
| 0.10 Content plan | `docs/CONTENT_PLAN.md` | Reviewer names; scenario list approval |
| 0.11 Design validation and tokens | `design-tokens.css`, one Tailwind adapter, `docs/DESIGN_DIRECTION.md` | No |
| 0.12 Cost sheet | Table in `DECISIONS.md` | No |

---

## 2. Paste-Ready Agent Prompt (Phase 0)

Paste this into Antigravity as the first task. Attach or place the listed files in the workspace first.

```text
You are the implementation partner for "English Conversation Partner".
Phase 0 only: Discovery and Setup. Do not build features.

READ FIRST, in this order (all are in the workspace):
1. English_Conversation_Partner_Project_Brief.md (source of truth for features; §17, §18, §21 rules)
2. ECP_Decisions_Register.md (approved decisions D-01 to D-18; approved 16 November 2026)
3. ECP_Phase_Plan.md (§0 rules, §3 Phase 0 tasks)
4. ECP_System_Framework.md (v2)
5. English_Conversation_Practice_Design_Style_Guide.md
6. English_Conversation_Practice_Design_Tokens.md
7. English_Conversation_Practice_Component_Library.md
8. English_Conversation_Practice_Database_Architecture.md
9. MOTION.md
10. ECP_Multi_Language_Strategy.md (v2), ECP_Audio_Voice_Guide.md (v2)
11. ECP_Exercises_SRS_Spec.md, ECP_API_Contract.md, ECP_AI_Prompt_Spec.md,
    ECP_Privacy_Analytics_Retention.md, ECP_Content_Authoring_Guide.md,
    ECP_Screens_Landing_Auth_Onboarding.md

RULES
- Approved decisions are final. Do not change them. If the repository conflicts with a decision, stop and report the conflict.
- Do not overwrite or delete existing work without approval (Brief §21 rule 3).
- Do not start Phase 1.
- Free tools only. Any paid service needs owner approval.
- Never place secrets in code, git, or docs. Document variable names only.

TASKS (in order)

0.1 Workspace audit. Change no files yet. Create docs/WORKSPACE_AUDIT.md
    using the template in ECP_Phase0_Kit.md §3.1. Report: framework and version,
    Node and package manager, Tailwind version, router, existing components,
    global CSS, database and ORM, auth, tests, lint config, existing design tokens,
    and anything reusable. List every conflict with the approved decisions.

0.2 Confirm D-04 (Tailwind adapter) and D-18 (framework, ORM, auth, hosting).
    Record the decision and its evidence in docs/DECISIONS.md. If the existing
    project already uses a framework or ORM, keep it and record why.

0.3 and 0.4 Copy the approved decisions D-01 to D-18, L1 to L8, and A1 to A10 from
    ECP_Decisions_Register.md and ECP_Multi_Language_Strategy.md / ECP_Audio_Voice_Guide.md
    into docs/DECISIONS.md, each marked "Approved 2026-11-16".

0.5 Create the repository if empty (or use the existing one). TypeScript, Tailwind,
    ESLint, Prettier. The app must run locally with one command. Show a single
    placeholder page.

0.6 Create docs/ARCHITECTURE.md, DECISIONS.md, IMPLEMENTATION_LOG.md, ENV.md,
    AUDIO_LICENSES.md, CONTENT_PLAN.md, DESIGN_DIRECTION.md using the templates in
    ECP_Phase0_Kit.md §3.

0.7 Create .env.example with variable names only (ECP_Phase0_Kit.md §3.3).

0.8 Connect a free hosting preview and a free database (owner creates the accounts).
    Add a health route that returns OK only when the database responds.
    Do not run any migrations that create product tables yet.

0.9 CI on each push: install, lint, typecheck, unit test. One empty passing test.

0.10 Create docs/CONTENT_PLAN.md from ECP_Content_Authoring_Guide.md §2.2 and §10.
     Leave reviewer names blank for the owner.

0.11 Design validation and tokens:
     a. Create design-tokens.css from the values in English_Conversation_Practice_Design_Tokens.md
        and English_Conversation_Practice_Design_Style_Guide.md (see ECP_Phase0_Kit.md §4).
        Copy values exactly. Do not invent values. Where the two documents differ, use the
        decision in D-06 and record it.
     b. Create ONE Tailwind adapter that matches the installed version (tailwind-theme-v4.css
        for v4, or the v3 extension for v3). Never load both.
     c. Create components.css only if the Tokens doc imports it and it has content to hold.
     d. Compute WCAG contrast ratios for every text/background pair listed in
        ECP_Phase0_Kit.md §5 and record them in docs/DESIGN_DIRECTION.md.
     e. Render one sample page using the tokens: a conversation line, a button set,
        a card, a badge, a focus state, and the audio unavailable state. Show it in the
        Phase 0 demo. No new visual design.

0.12 Cost sheet: every service the project uses, its free-tier limit, and the date
     the limit was checked from the provider's current page. Record in docs/DECISIONS.md.

STOP POINT (🛑)
When 0.1 to 0.12 are done, stop. Report:
- Files created and changed (list)
- Test and lint results
- Conflicts found and how each was handled
- Items that still need owner input
Do not start Phase 1 until the owner approves.
```

---

## 3. Document Templates

### 3.1 `docs/WORKSPACE_AUDIT.md`

```markdown
# Workspace Audit

**Date:**
**Auditor:** agent
**Workspace path:**

## 1. Project state
- Empty / existing: 
- Git: yes / no; branch:
- Last commit:

## 2. Stack
| Item | Found | Version | Matches decision? |
|---|---|---|---|
| Framework | | | D-18 |
| Language | | | |
| Package manager | | | |
| Node | | | |
| Tailwind CSS | | | D-04 |
| Router | | | |
| Component library / primitives | | | Component Library §2 |
| Database | | | D-18 |
| ORM and migrations | | | D-18 |
| Auth | | | D-18 |
| Hosting | | | D-18 |
| Test runner | | | Style Guide §16 |
| Lint / format | | | |
| CI | | | |

## 3. Existing code and assets
- Components that can be reused:
- Global styles and tokens found:
- Existing schema or migrations:
- Existing content or seed data:

## 4. Conflicts with approved decisions
| Decision | Repository says | Recommended action | Owner decision needed? |
|---|---|---|---|

## 5. Risks

## 6. Recommended next step
```

### 3.2 `docs/DECISIONS.md` (header and format)

```markdown
# Decisions

Format: ID | Decision | Value | Status | Date | Evidence

## Approved on 2026-11-16 (from ECP_Decisions_Register.md)
| ID | Decision | Value | Status | Date |
|---|---|---|---|---|
| D-01 | Palette | Purple brand, warm yellow, peach support | Approved | 2026-11-16 |
| D-02 | Fonts | Inter; Hind Siliguri, then Noto Sans Bengali | Approved | 2026-11-16 |
| D-03 | Tokens | `--ecp-*` in design-tokens.css | Approved | 2026-11-16 |
| D-04 | Tailwind | Installed version; one adapter | Confirm in 0.2 | |
| D-05 | Motion durations | 150 / 200 / 280 ms | Approved | 2026-11-16 |
| D-06 | Colour mismatches | Resolve in 0.11 | Approved | 2026-11-16 |
| D-07 | Translations table | Explicit FKs + source version | Approved | 2026-11-16 |
| D-08 | Audio model | Explicit FKs, BCP 47 accents, unified status | Approved | 2026-11-16 |
| D-09 | Grammar language | `language_code` added | Approved | 2026-11-16 |
| D-10 | User fields | UI locale, secondary translation, accent | Approved | 2026-11-16 |
| D-11 | Roles | translator scoped by language | Approved | 2026-11-16 |
| D-12 | Practice tables | One practice_sessions + roleplay children | Approved | 2026-11-16 |
| D-13 | Component names | Component Library names | Approved | 2026-11-16 |
| D-14 | Phase 0 design task | Validate, not create | Approved | 2026-11-16 |
| D-15 | Phase numbering | Phase Plan numbering | Approved | 2026-11-16 |
| D-16 | Search scope | DB §12 in Phase 1 | Approved | 2026-11-16 |
| D-17 | Motion libraries | No Rive in MVP | Approved | 2026-11-16 |
| D-18 | Framework, ORM, auth, hosting | Confirm in 0.2 | Pending audit | |

## Phase 0 decisions (added by the agent)
| ID | Decision | Value | Evidence | Date |
|---|---|---|---|---|
```

### 3.3 `.env.example` (names only)

```bash
# App
APP_URL=
NODE_ENV=development

# Database
DATABASE_URL=

# Auth (use the provider chosen in D-18; delete the rest)
AUTH_SECRET=
AUTH_URL=
# CLERK_PUBLISHABLE_KEY=
# CLERK_SECRET_KEY=

# Audio storage (production)
R2_ACCOUNT_ID=
R2_BUCKET=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_BASE_URL=

# Rate limits (Phase 1 production; optional in dev)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Monitoring
SENTRY_DSN=

# AI (Phase 2; provider decided at gate)
AI_PROVIDER=
AI_API_KEY=

# NLP service
NLP_SERVICE_URL=
```

Rules: no values in git. `.env.local` is in `.gitignore`. Production values live in the hosting provider's settings.

### 3.4 `docs/ENV.md`

```markdown
# Environment Variables

| Name | Used by | Required in | Secret | Where set |
|---|---|---|---|---|
| APP_URL | app | all | no | |
| DATABASE_URL | app, migrations | all | yes | |
| AUTH_SECRET | auth | all | yes | |
| ... | | | | |

Local setup steps:
1.
2.
```

### 3.5 `docs/ARCHITECTURE.md` (skeleton)

```markdown
# Architecture

Source: ECP_System_Framework.md (v2). Update this file when the built system differs.

## 1. Stack as built
## 2. Runtime diagram (as built)
## 3. Folder structure (as built)
## 4. Data model (as built; list migrations)
## 5. API (link to ECP_API_Contract.md; list deviations)
## 6. Deviations from the framework and why
## 7. Known limitations
```

### 3.6 `docs/CONTENT_PLAN.md`

```markdown
# Content Plan

## 1. Phase 1 target (from Phase Plan §4.5)
| Area | Target | Owner | Status |
|---|---|---|---|
| Daily-life scenarios | 12 across 4 categories | | not started |
| Professional path | 1 path, 5 conversations | | not started |
| Versions | Short for all; Medium for 6 | | |
| Bangla reviewer | Named | | |

## 2. Scenario list
| # | Title | Category | Level | Versions | Writer | Reviewer | Status |
|---|---|---|---|---|---|---|---|

## 3. Reviewers and roles (Content Guide §10)

## 4. Open items (Content Guide CA-1 to CA-5)
```

### 3.7 `docs/DESIGN_DIRECTION.md`

```markdown
# Design Direction — Phase 0 Validation

## 1. Sources checked
- Style Guide version and date:
- Tokens doc version and date:
- MOTION.md version and date:

## 2. Token generation
| Family | Tokens generated | Source section | Notes |
|---|---|---|---|
| Brand | | Style Guide §3.1 | |
| Accent and peach | | | |
| Neutral | | Style Guide §3.2 | |
| Semantic | | Style Guide §3.3 | |
| Typography | | Tokens §8 | |
| Spacing | | Tokens §9 | |
| Radius | | Tokens §10 | |
| Shadow | | Tokens §11 | |
| Layout | | Tokens §12 | |
| Motion | | Tokens §13 | |
| Layering | | Tokens §14 | |

## 3. Conflicts resolved
| Token | Style Guide | Tokens doc | Used | Reason |
|---|---|---|---|---|
| text-muted | #9896A1 | #777580 | | Check contrast (section 4) |
| input border | #E2E0E8 | not present | | Add token |

## 4. Contrast results
(see ECP_Phase0_Kit.md §5)

## 5. Sample page
- Path:
- Screenshot:
- Checked at 320 / 375 / 768 / 1280:
- Reduced motion checked:
- Keyboard focus checked:

## 6. Items for owner review
```

### 3.8 `docs/AUDIO_LICENSES.md`

```markdown
# Audio Licences

| Asset or tool | Source URL | Licence | Checked on | Checked by | Used in |
|---|---|---|---|---|---|
| Piper engine | | MIT | | | |
| Piper voice: en_US-… | | (from model card) | | | |
| Piper voice: en_GB-… | | | | | |
| FFmpeg | | LGPL/GPL | | | |
| Wiktionary file (if used) | | per file | | | |

Rule: a voice or file with an unclear licence is not used in learner-facing audio.
```

### 3.9 Cost sheet (table in `DECISIONS.md`)

```markdown
## Cost sheet — checked on:
| Service | Purpose | Free-tier limit (from provider page) | Date checked | Recurring cost | Upgrade trigger |
|---|---|---|---|---|---|
| Hosting (Vercel or chosen) | App | | | £0 / $0 | |
| Database (Supabase or Neon) | Data | | | | |
| Object storage (R2 or Supabase) | Audio | | | | |
| Auth provider | Login | | | | |
| Redis (Upstash) | Rate limits | | | | Phase 1 release |
| Sentry | Errors | | | | |
| GitHub Actions | CI | | | | |
| LLM provider | Phase 2 | | | | Gate 2 decision |
| Piper, FFmpeg, spaCy, Whisper | Local tools | No cost | | | |
Total recurring cost at Phase 0 end: 
```

Owner note: free-tier limits change. Check each provider's page on the day and write the date.

---

## 4. Design Token Generation Task (0.11a)

The agent creates `design-tokens.css` from the Tokens document. It must not invent values.

| Step | Action |
|---|---|
| 1 | Open the Tokens doc §4–§14. Copy every `--ecp-*` name and value. |
| 2 | Cross-check each colour with Style Guide §3. If a value differs, apply D-06 and log it in DESIGN_DIRECTION.md §3. |
| 3 | Add the easing tokens required by D-05: `--ecp-ease-enter`, `--ecp-ease-exit`, `--ecp-ease-emphasized`, using MOTION.md §3.2 values. Log the addition. |
| 4 | Add `--ecp-border-input` with `#E2E0E8` (D-06). Log it. |
| 5 | Add the global baseline (body colour, font, background) from Tokens §15. |
| 6 | Add dark theme values only if the Tokens doc defines them. If not, leave them out and log it. |
| 7 | Run a token audit: no token used in components is missing from the file; no hex value appears outside the token file. |

Acceptance: the Tokens doc and `design-tokens.css` list the same names; the only differences are the ones logged in DESIGN_DIRECTION.md §3.

---

## 5. Contrast Check (0.11d)

Pairs to check (WCAG 2.2 AA: normal text 4.5:1, large text 3:1):

| Foreground | Background | Use |
|---|---|---|
| text-primary | canvas | Body on app background |
| text-primary | surface | Body in cards |
| text-secondary | canvas | Supporting text |
| text-secondary | surface | Supporting text in cards |
| text-muted (both candidate values) | canvas | Metadata |
| text-muted (both candidate values) | surface | Metadata |
| brand-800 | surface | Primary button text on white |
| white | brand-800 | Primary button label |
| brand-900 | accent-100 | Highlight text |
| success | success-surface | Success message |
| warning | warning-surface | Warning message |
| error | error-surface | Error message |
| info | info-surface | Info message |
| text-primary | accent-100 | Vocabulary highlight |

Script for the agent to run (Python):

```python
def lum(hex_):
    h = hex_.lstrip("#")
    c = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

def ratio(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + 0.05) / (lb + 0.05)

print(round(ratio("#24232A", "#F7F7F8"), 2))
```

Record every pair with its ratio and PASS/FAIL in `DESIGN_DIRECTION.md`. A FAIL is fixed by changing the token value only with owner approval, unless the use is decorative (then it must not carry text).

---

## 6. Owner Approval Checklist (🛑 Approval Point 0)

The owner ticks each item before Phase 1 starts.

- [ ] `docs/WORKSPACE_AUDIT.md` reviewed; conflicts listed and resolved or accepted.
- [ ] D-04 (Tailwind version and adapter) recorded with evidence.
- [ ] D-18 (framework, ORM, auth, hosting) recorded with evidence.
- [ ] `docs/DECISIONS.md` contains D-01 to D-18, L1 to L8, A1 to A10, all approved.
- [ ] Repository runs locally with one command.
- [ ] CI passes on push.
- [ ] Hosting preview and database connected; health route returns OK.
- [ ] No secrets in git (scan done); `.env.example` has names only.
- [ ] Docs skeleton present (seven files).
- [ ] `design-tokens.css` present; one Tailwind adapter; no duplicate palette.
- [ ] Contrast results recorded; any FAIL resolved or approved.
- [ ] Sample page reviewed on phone and desktop, with keyboard focus visible.
- [ ] `CONTENT_PLAN.md` reviewed; reviewer names filled in by owner.
- [ ] Cost sheet shows zero recurring cost, or each cost is approved.
- [ ] Owner open items (Register §4) listed with owner answers or a due date.

Owner decision: ☐ Approved, start Milestone 1A   ☐ Changes needed (note below)

Notes: ____________________________________________

Date: ____________________ Owner: ____________________

---

## 7. What Happens After Approval

1. Agent logs Phase 0 completion in `docs/IMPLEMENTATION_LOG.md`.
2. Agent writes the Milestone 1A plan (Phase Plan §4.1) and waits for approval of the plan before building (Brief §21 rule 5).
3. Owner approves Milestone 1A's plan; the agent builds it with tests.
4. 🛑 Gate 1A review.

---

## 8. If the Repository Conflicts with an Approved Decision

Do not silently work around it. The agent:
1. Writes the conflict in `WORKSPACE_AUDIT.md` §4 with evidence (file path, line, version).
2. Proposes one or two options, with trade-offs.
3. Stops and waits for owner approval.

Examples to expect: the existing project already uses Tailwind v3 (adapter changes); the existing project uses a different framework (D-18 needs review); a Bangla font is already loaded differently (token and font decisions).
