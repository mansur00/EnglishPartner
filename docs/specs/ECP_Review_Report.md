# English Conversation Partner — Document Review Report

**Scope:** All 11 uploaded files.
**Method:** Line counts and diffs were checked with `wc` and `diff`. Headings were listed for every file. Key sections were read in full: design tokens, style guide (§1–4, §12–14), motion (§3, §6–8), database (§1–5, §7–9, §12, §15), component library (§1–2, §10, §16–17), and the planning docs against those.
**Result:** The product direction is consistent. The design and architecture documents are detailed. However, there are **real conflicts** (the most serious: visual identity and the database model), **referenced files that were not uploaded**, and **gaps** that an agent would have to guess at.

---

## 1. File-by-File Status

| File | Lines | Role | Status |
|---|---:|---|---|
| `English_Conversation_Partner_Project_Brief.md` | 1454 | Product source of truth | Good. Complete. |
| `English_Conversation_Partner_Project_Brief_1.md` | 1454 | Duplicate | **Identical to the brief** (diff returned no differences). Delete one to avoid confusion. |
| `English_Conversation_Practice_Design_Style_Guide.md` | 892 | Visual direction | Good. Conflicts with my framework (palette, font). |
| `English_Conversation_Practice_Design_Tokens.md` | 632 | Token system | Good. Refers to 4 CSS/JS files that are **not uploaded**. Has 2 mismatches with the style guide. Motion values conflict with MOTION.md. |
| `English_Conversation_Practice_Component_Library.md` | 566 | Component contract | Good. Names conflict with my docs. Needs `design-tokens.css`, which is missing. |
| `English_Conversation_Practice_Database_Architecture.md` | 969 | Schema plan | Strong. Conflicts with my translation, audio, grammar, and user models. Missing quiz, SRS, and privacy tables. |
| `MOTION.md` | 890 | Motion system | Good. Recommends Rive, which conflicts with the free-only rule. Duration tokens conflict with the tokens doc. |
| `ECP_System_Framework.md` (mine) | 653 | Stack and architecture | **Needs update.** Palette, fonts, token naming, translation model, roles, component names. |
| `ECP_Multi_Language_Strategy.md` (mine) | 564 | Languages | **Needs update.** Translation/audio model, roles, accent codes. |
| `ECP_Audio_Voice_Guide.md` (mine) | 669 | Audio | **Needs update.** Status enum, accent codes, component names, timing manifest. |
| `ECP_Phase_Plan.md` (mine) | 547 | Build phases | **Needs update.** Phase 0 design task is now outdated; Phase numbering clash with DB doc. |

---

## 2. Critical Conflicts

Each conflict is listed with the documents involved. The recommended resolution is in `ECP_Decisions_Register.md`.

| ID | Severity | Conflict | Where | Decision |
|---|---|---|---|---|
| C-01 | **Critical** | Colour palette: my framework uses teal and paper. The design docs use purple, warm yellow, and peach. | Framework §10.2 vs Style Guide §3, Tokens §4 | D-01 |
| C-02 | **Critical** | Fonts: my framework uses Literata and Figtree. The design docs use Inter and Hind Siliguri / Noto Sans Bengali. | Framework §10.3 vs Style Guide §4, Tokens §8.1 | D-02 |
| C-03 | **Critical** | Translations model: DB says no unconstrained polymorphic IDs. My framework and multi-language docs use `source_type` + `source_id`. | DB §4, §5.10 vs Framework §7, Multi-Language §4.1 | D-07 |
| C-04 | High | Audio model: different target model, status values, accent codes, and no timing manifest in DB. | DB §5.14, §5.1 vs Audio Guide §5.1, Multi-Language §4.3 | D-08 |
| C-05 | High | Motion durations: three different sets. | Tokens §13 (150/200/280 ms) vs MOTION §3.1 (100–650 ms) vs Style Guide §12 | D-05 |
| C-06 | High | Motion library: Rive may need a paid plan, which breaks the free-only rule. | MOTION §6.5 vs my free-only rule | D-17 |
| C-07 | Medium | `text-muted` colour: `#9896A1` vs `#777580`. Input border `#E2E0E8` is not tokenised. | Style Guide §3.2, §8.2 vs Tokens §5 | D-06 |
| C-08 | Medium | Token naming: my docs use `--color-*` variables and `:root` values. Tokens use `--ecp-*` and one adapter. | Framework §10.2 vs Tokens §3, §16 | D-03 |
| C-09 | Medium | Tailwind version: my docs assume it. Design docs say to inspect and use exactly one adapter. | Framework §10 vs Style Guide §14.1, Tokens §16 | D-04 |
| C-10 | Medium | Grammar explanations have no explanation language in DB. | DB §5.13 vs Multi-Language §4.2 | D-09 |
| C-11 | Medium | User preferences lack UI locale and secondary translation. | DB §5.1 vs Multi-Language §4.4 | D-10 |
| C-12 | Medium | Roles: DB has 4 roles and no translator. | DB §8 vs Multi-Language §13.1 | D-11 |
| C-13 | Medium | AI session tables: DB has `roleplay_*` tables, my framework has `practice_sessions` only. | DB §6.4, §9 vs Framework §7 | D-12 |
| C-14 | Medium | Component names differ in every planning doc. | Component Library §10 vs Audio Guide §7, Framework §9.2 | D-13 |
| C-15 | Medium | Phase 0 asks for a design direction that already exists. | Phase Plan §3 task 0.11 vs Style Guide, Tokens | D-14 |
| C-16 | Low | "Phase 2" means different things in DB and Phase Plan. | DB §15 vs Phase Plan §1 | D-15 |
| C-17 | Low | Search scope: DB keeps it simple; my multi-language doc adds trigram, synonyms, and a search table. | DB §12 vs Multi-Language §11 | D-16 |
| C-18 | Low | Component Library says "do not assume React/Next.js" and framework-neutral. My docs assume Next.js. | Component Library §1.10 vs Framework §2 | Keep Next.js as recommendation; confirm in Phase 0 audit (D-18) |

---

## 3. Referenced Files That Are Missing

These files are referenced as required inputs but were not uploaded. The agent cannot start the design system without them.

| File | Referenced in | Impact |
|---|---|---|
| `design-tokens.css` | Tokens §2, Component Library §1, §16, Style Guide | **Blocker** for the design system. The canonical token file does not exist yet. |
| `tailwind-theme-v4.css` | Tokens §2, §16.1 | Blocker if the project uses Tailwind v4. |
| `tailwind-theme-v3.example.cjs` | Tokens §2, §16.2 | Blocker if the project uses Tailwind v3. |
| `components.css` | Tokens §15 (`@import "./components.css"`) | Needed for shared component classes. |
| Reference dashboard images (three) | Style Guide header ("Reference basis") | Not needed for code, but the designer should confirm the visual direction against them. |

**Action:** Generate these files from the token and style docs in a Phase 0 task. They are code, not documents, so they are not written as MD here. Once the owner approves D-01 to D-06, the agent can create them.

---

## 4. Gaps (Missing Deliverables)

Each gap is listed with priority and whether an MD file was created in this review.

| ID | Gap | Why it matters | Priority | Created in this review |
|---|---|---|---|---|
| G-01 | Single decisions register | Conflicts above need one place to be resolved | Critical | Yes: `ECP_Decisions_Register.md` |
| G-02 | Exercise, quiz, sentence builder, and SRS data model | Brief §10.4–10.5 and Component Library `ReviewQueue` need tables. DB has none. | High | Yes: `ECP_Exercises_SRS_Spec.md` |
| G-03 | API contract (endpoints, schemas, error codes) | Agent cannot build the frontend and backend consistently without it | High | Yes: `ECP_API_Contract.md` |
| G-04 | Content authoring guide (dialogue writing rules, CEFR assessment, Bangla translation style, JSON import format) | Brief §20 risks 1–3 depend on content quality; nothing defines how content is written | High | Yes: `ECP_Content_Authoring_Guide.md` |
| G-05 | AI prompt specification and grammar JSON schema | Framework §4 and Multi-Language §9 reference prompts and schemas that do not exist | High | Yes: `ECP_AI_Prompt_Spec.md` |
| G-06 | Privacy, retention, consent, analytics events | DB §8, §9 and Phase Plan Gate 3 require these; none exist | High | Yes: `ECP_Privacy_Analytics_Retention.md` |
| G-07 | Landing, sign-up/login, onboarding screen specs | Brief §16.3 items 1–3 have no spec | Medium | Yes: `ECP_Screens_Landing_Auth_Onboarding.md` |
| G-08 | Test traceability: brief §19 criteria mapped to tests | Phase Plan needs it for gates | Medium | Partial: section 6 below. Full file is the next step. |
| G-09 | Dashboard and progress metric definitions (what "streak", "daily goal", "skill progress" mean) | Component Library §10.7 defines components but not rules; streak logic has edge cases | Medium | Not yet. Next step. |
| G-10 | Deployment, environment variables, operations (`ENV.md`, `ARCHITECTURE.md`) | Phase Plan Phase 0 lists these; no spec exists | Medium | Not yet. |
| G-11 | Offline and installable app (PWA) spec | Only mentioned in Phase 4 | Low | Not yet. Defer until Phase 4. |
| G-12 | Error-state copy catalogue (exact messages) | Style Guide §8.9 gives patterns; messages are not written | Low | Covered in API contract error codes and Screens spec |

---

## 5. Missing Details Inside Existing Documents

These are not missing files, but the agent will have to guess unless the owner decides.

| Document | Missing detail |
|---|---|
| Brief §10.4 Listening quiz | No question format, answer format, or scoring rule |
| Brief §10.5 Sentence builder | No accepted-alternatives rule (who decides alternatives, how they are stored) |
| Brief §9 AI Speaking Partner | No feedback rubric, turn limit, session length, or cost cap |
| Brief §13 User data | No retention period. DB §14 says it "must not be invented during implementation", so the owner must decide. |
| Style Guide §10 | "Practice feedback" visual rules, but no copy rules for correct and incorrect answers |
| DB §12 | Search ranking rules (which result comes first) |
| DB §19 | Antigravity prompt refers to Phase numbers that do not match the Phase Plan |
| MOTION §5 | Signature interactions describe behaviour but not triggers for each state |

Most of these are covered by the new spec files in this review. Items marked "owner decision" need an answer from the owner.

---

## 6. Brief §19 Acceptance Criteria Coverage

Quick check of whether each criterion has an owner in the existing documents.

| Brief §19 group | Covered by | Gap |
|---|---|---|
| Discovery | DB §5.5, §12; Component Library §10.1 | Ranking rules missing (G-09) |
| Conversation learning | DB §5.9–5.14; Style Guide §8.7; Component Library §10.2; Audio Guide §7 | Language switch behaviour is in Multi-Language §7.3 only; move to Component Library |
| Vocabulary and grammar | DB §5.11–5.13; Component Library §10.4 | Grammar schema missing (G-05) |
| Personal learning | DB §6; Component Library §10.7 | Streak and progress rules (G-09) |
| Admin | DB §7–8; Component Library §12 | Translator role (D-11) |
| Quality | Style Guide §13, §16; MOTION §10, §13 | Test traceability (G-08) |

---

## 7. Changes Needed in My Earlier Documents

Since you asked me to review my own files, these are the changes I would make. They are not made in this review; they should be made after the decisions are approved, so that the updates are correct the first time.

| File | Changes |
|---|---|
| `ECP_System_Framework.md` | Replace §10 palette, fonts, and token naming with the design docs. Replace §7 translation and audio tables with D-07 and D-08. Update roles (§8, §11). Replace component names (§9.2). Add the Tailwind version decision (D-04). |
| `ECP_Multi_Language_Strategy.md` | Update §4.1 translation table to D-07. Update §4.3 audio to D-08. Update §4.4 users to D-10. Update §13 roles to D-11. Remove duplicate search design (D-16). |
| `ECP_Audio_Voice_Guide.md` | Change accent codes to `en-US` / `en-GB` and status enum to D-08. Change component names to D-13. Note Rive exclusion is not relevant here; Audio stays free-only. |
| `ECP_Phase_Plan.md` | Change task 0.11 (D-14). Use Phase Plan numbering in DB references (D-15). Add the new spec files to each phase's inputs. Add `ReviewQueue` and exercise tables to Phase 2 milestones. |

---

## 8. Recommended Order of Work

1. Owner reviews `ECP_Decisions_Register.md` and marks each row.
2. Owner deletes the duplicate `English_Conversation_Partner_Project_Brief_1.md` (or confirms it is intentional).
3. Upload the missing token files, or ask the agent to create them after approval (section 3).
4. Owner reviews the six new spec files and answers the owner decisions listed in section 5.
5. Update my earlier four documents using section 7.
6. Phase 0 audit (Brief Prompt A) decides D-04 and D-18.
7. Only then start Phase 0 build tasks.

---

## 9. Summary

- **The product idea, brief, and design direction are sound.** The design docs (style guide, tokens, component library, motion) are mostly consistent with one another and with the brief.
- **The most serious problem is that my earlier documents disagree with the design docs.** I wrote the palette, fonts, and data model before the design docs were available. Those parts of my work should be replaced, not extended.
- **Two blockers stop the design system:** the missing `design-tokens.css` and the Tailwind adapter files.
- **Several spec gaps need new documents.** Six new MD files are created with this review for those gaps (see the Gaps table).

Owner sign-off required on the decisions register before the agent implements anything in the conflicting areas.
