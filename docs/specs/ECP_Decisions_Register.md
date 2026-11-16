# English Conversation Partner — Decisions Register

**Purpose:** One place where every conflict between the project documents is resolved. Where two documents disagree, the decision here wins once it is approved.
**How to use:** The owner marks each row `Approved`, `Changed (see note)`, or `Rejected`. The agent must not implement a conflicting value until its row is approved.
**Related:** `ECP_Review_Report.md` (full list of findings and sources).

---

## 1. How Conflicts Are Resolved

Priority order when documents disagree:

1. Owner decision recorded in this register.
2. `English_Conversation_Partner_Project_Brief.md` (product features and rules).
3. Design docs: `English_Conversation_Practice_Design_Style_Guide.md`, `English_Conversation_Practice_Design_Tokens.md`, `MOTION.md`.
4. Architecture docs: `English_Conversation_Practice_Database_Architecture.md`, `English_Conversation_Practice_Component_Library.md`.
5. Earlier working documents written during planning: `ECP_System_Framework.md`, `ECP_Multi_Language_Strategy.md`, `ECP_Audio_Voice_Guide.md`, `ECP_Phase_Plan.md`.

Rule: earlier working documents (group 5) yield to the design and architecture documents (groups 3–4) where they conflict, because those were written as implementation specs.

---

## 2. Decision Table

### D-01 Colour palette

| Option | Source |
|---|---|
| A. Purple brand, warm yellow accent, peach support (Style Guide §3, Tokens §4) | Design docs |
| B. Teal and paper palette (`ECP_System_Framework.md` §10.2, `ECP_Multi_Language_Strategy.md` none) | Planning doc |

**Recommendation:** **A.** The design docs are more complete, were written for implementation, and match the approved visual direction. Retire the teal palette from the framework file.
**Status:** Pending owner approval.

### D-02 Typography

| Option | Source |
|---|---|
| A. Inter (UI) + Hind Siliguri / Noto Sans Bengali (Bangla) | Style Guide §4, Tokens §8.1 |
| B. Literata (dialogue) + Figtree (UI) + Noto Sans Bengali | `ECP_System_Framework.md` §10.3 |

**Recommendation:** **A.** Inter for UI and English dialogue, Hind Siliguri as the first Bangla choice, Noto Sans Bengali as fallback. Literata is dropped unless the owner wants a serif reading face for long Bangla or English passages.
**Status:** Pending owner approval.

### D-03 Token naming and source of truth

| Option | Source |
|---|---|
| A. `--ecp-*` prefix in `design-tokens.css`, mapped into Tailwind by one adapter | Tokens §2–3 |
| B. Ad hoc `--color-*` variables on `:root` | `ECP_System_Framework.md` §10.2 |

**Recommendation:** **A.** Only one palette source exists: `design-tokens.css`. Components never hardcode hex values.
**Status:** Pending owner approval.

### D-04 Tailwind version and adapter

| Option | Source |
|---|---|
| Inspect the installed version. Use exactly one adapter: v4 (`@theme`) or v3 (`theme.extend`). Never both. | Style Guide §14.1, Tokens §16 |
| Assume v4 | `ECP_System_Framework.md` assumed "Tailwind CSS" without a version |

**Recommendation:** Follow the design docs. Phase 0 audit records the installed version. The decision is made from the repository, not from a preference.
**Status:** Pending Phase 0 audit result.

### D-05 Motion durations and easing

| Source | Values |
|---|---|
| Tokens §13 (`--ecp-duration-*`) | fast 150 ms, normal 200 ms, slow 280 ms; easing `cubic-bezier(0.2, 0, 0, 1)` |
| `MOTION.md` §3.1 | instant 100, fast 160, normal 220, moderate 320, slow 480, story 650 ms |
| Style Guide §12 | hover 150–200 ms, small states 150–250 ms, drawers 200–300 ms |
| `MOTION.md` §3.2 | Four easings: standard, enter, exit, emphasized |

**Recommendation:**
- CSS and Tailwind use the three token durations only (150 / 200 / 280 ms) and the single standard easing from Tokens §13.
- The Motion library uses the four easings from MOTION §3.2, but the easing values must be added to `design-tokens.css` as tokens so there is one source.
- Durations 100, 320, 480, 650 ms from MOTION §3.1 are not used unless the owner adds them as tokens.

**Status:** Pending owner approval. Tokens doc needs a small update to add enter / exit / emphasized easings.

### D-06 Colour value mismatches inside the design docs

| Token | Style Guide | Tokens doc | Recommendation |
|---|---|---|---|
| `text-muted` | `#9896A1` | `#777580` | Use `#777580` after a contrast check on `canvas` and `surface`. It is darker and likely passes 4.5:1. Confirm. |
| Input border | `#E2E0E8` (Style Guide §8.2, not tokenised) | Not present (`border` is `#E9E8ED`) | Create a token `--ecp-border-input` with `#E2E0E8`, or use `border` if the owner accepts the lighter line. |

**Status:** Pending owner approval and a contrast check by the agent (record ratios in `docs/DESIGN_DIRECTION.md`).

### D-07 Translations data model

| Option | Source |
|---|---|
| A. Explicit nullable foreign keys (`scenario_id`, `dialogue_line_id`, plus `vocabulary_gloss_id` if needed) with an exactly-one check, plus `source_version` and `source_hash` for stale detection | DB §5.10 (FK approach), Multi-Language §4.1 (versioning) |
| B. Polymorphic `source_type` + `source_id` | `ECP_System_Framework.md` §7, Multi-Language §4.1 |

**Recommendation:** **A**, merged with the stale-tracking columns from Multi-Language §4.1. DB §4 says unconstrained polymorphic IDs should not be used.
**Status:** Pending owner approval.

### D-08 Audio asset data model

| Item | DB Architecture §5.14 | Audio Guide / Framework |
|---|---|---|
| Target | Explicit FKs (`scenario_id`, `conversation_version_id`, `dialogue_line_id`), exactly one | `source_type` + `source_id` |
| Status values | `processing`, `ready`, `failed`, `archived` | `pending`, `ready`, `failed`, `stale` |
| Accent values | `us`, `uk` | `en-US`, `en-GB` |
| Timing manifest | Not defined | Required for full audio (Audio Guide §5.2) |

**Recommendation:**
- Explicit FKs with exactly-one check (DB approach).
- Status enum: `processing`, `ready`, `failed`, `stale`, `archived`.
- Accent: BCP 47 `en-US` / `en-GB` stored in the DB. The UI may show "American" / "British".
- Add a `timing_manifest` JSONB column (or `conversation_audio_manifests` table) for the full conversation audio asset.
- Add `source_hash` (unique) for reuse.

**Status:** Pending owner approval.

### D-09 Grammar explanation language

| Item | DB §5.13 | Multi-Language §4.2 |
|---|---|---|
| Explanation language stored | No | Yes (`explanation_language`) |

**Recommendation:** Add `language_code` to `grammar_explanations`. The brief (§17.3) requires that Bangla and other languages are not assumed to be the only language.
**Status:** Pending owner approval.

### D-10 Users table preferences

**DB §5.1 has:** `preferred_translation_language`, `preferred_accent` (`us` / `uk`), `learning_level`, `learning_goal`.
**Multi-Language §4.4 adds:** `ui_locale`, `secondary_translation`, `learning_language`.

**Recommendation:** Add the three fields. Change `preferred_accent` values to `en-US` / `en-GB` (see D-08).
**Status:** Pending owner approval.

### D-11 Roles

| Option | Source |
|---|---|
| `admin`, `editor`, `reviewer`, `learner` | DB §8 |
| Adds `translator`, scoped per language | Multi-Language §13.1 |

**Recommendation:** Keep the four DB roles. Add `translator` as a role in `user_roles` with an optional `language_code` scope. Permissions are checked on the server.
**Status:** Pending owner approval.

### D-12 Practice sessions and roleplay tables

| Item | DB §6.4 | DB §9 | Framework §7 |
|---|---|---|---|
| Session table | `practice_sessions` (with `mode`: listening, reading, roleplay, quiz) | `roleplay_sessions`, `roleplay_messages`, `roleplay_feedback` (future) | `practice_sessions` |

**Recommendation:**
- `practice_sessions` for all practice modes (listening, quiz, sentence builder, roleplay) with `mode`.
- `roleplay_messages` and `roleplay_feedback` as child tables for AI sessions (Phase 2).
- Do not create a separate `roleplay_sessions` table.

**Status:** Pending owner approval. See `ECP_Exercises_SRS_Spec.md`.

### D-13 Component names

The Component Library (`English_Conversation_Practice_Component_Library.md`) is the contract. Other documents must use its names.

| Used in planning docs | Component Library name |
|---|---|
| `DialogueLine` | `ConversationTurn` |
| `DialogueList` | `ConversationReader` |
| `AudioButton` | `AudioPlayButton` |
| `FullAudioPlayer` | `AudioPlayer` |
| `WordChip` | `VocabularyHighlight` |
| `VocabularyPopover` | `WordDetailPopover` |
| `GrammarDrawer` | `GrammarPanel` (rendered in a Drawer primitive) |
| `TranslationToggle` | `TranslationToggle` (same) |
| `SpeakerLabel` | `SpeakerLabel` (same) |
| `ScenarioCard` | `ScenarioCard` (same) |

**Status:** Approved by default unless the owner objects.

### D-14 Design direction work in Phase 0

`ECP_Phase_Plan.md` Phase 0 task 0.11 asks the agent to create a design direction. The design direction already exists.

**Recommendation:** Replace task 0.11 with "Validate the existing Style Guide and Tokens against the repository and the brief. Produce `docs/DESIGN_DIRECTION.md` as a review, not a new design."
**Status:** Pending owner approval.

### D-15 Phase numbering

| Document | Phase 2 means |
|---|---|
| Brief §18 | Active Learning |
| DB Architecture §15 | Learning resources (translations, vocabulary, grammar) |
| Phase Plan (this project) | Active Learning |

**Recommendation:** Use the Phase Plan numbering in all new work. In the DB doc, refer to its migration steps as "DB migration M0–M5" to avoid confusion.
**Status:** Pending owner approval.

### D-16 Search scope in Phase 1

| Option | Source |
|---|---|
| Normal filters + built-in full-text search. No dedicated search service unless measured. | DB §12 |
| `search_documents` table, trigram index, synonym table, per-language tsvector in Phase 1 | Multi-Language §11 |

**Recommendation:** Phase 1B uses DB §12 (full-text search on `english` config, plus Bangla titles in translations). Trigram and synonyms move to a later milestone (2+) if testing shows gaps.
**Status:** Pending owner approval.

### D-17 Motion libraries and the free-only rule

| Library | Conflict |
|---|---|
| Rive (MOTION §6.5) | Export and shipping may need a paid plan. Breaks the free-only rule. |
| GSAP (MOTION §6.1) | Free under the current standard licence, but must be verified before shipping. |
| Lenis (MOTION §6.3) | Open source; not for learning pages. |

**Recommendation:** Exclude Rive from MVP. Use native CSS and Motion for React first. GSAP only when a specific feature needs a timeline, after licence check. Lenis not used on learning pages.
**Status:** Pending owner approval.

### D-18 Phase 0 workspace inspection outcome

**Repository:** `https://github.com/mansur00/EnglishPartner.git` (empty — no commits yet, confirmed 16 Nov 2026)
**Database:** Supabase — project URL `https://ijlrseclqymuzdcrruoz.supabase.co` (confirmed 16 Nov 2026). Keys in `.env.local` only — never in git or docs.
**Auth:** Supabase Auth (magic link + Google OAuth) — co-located with database, no second vendor needed (A-01).
**Hosting:** Vercel — confirmed 16 Nov 2026.

The Tailwind version, router, ORM, and component library can only be decided after Phase 0 audit of the repository (currently empty). The following decisions wait for that report:
- D-04 (Tailwind version)
- Framework choice (currently Next.js in `ECP_System_Framework.md`; the component library and DB docs are framework-neutral)
- ORM choice (Drizzle or Prisma)

**Status:** Open until Phase 0 audit is reviewed.

---

## 3. Decision Summary Table (for sign-off)

| ID | Topic | Recommendation | Owner status |
|---|---|---|---|
| D-01 | Palette | Purple brand (Style Guide) | |
| D-02 | Fonts | Inter + Hind Siliguri / Noto Sans Bengali | |
| D-03 | Tokens | `--ecp-*` in `design-tokens.css` | |
| D-04 | Tailwind | Decide from repo; one adapter only | |
| D-05 | Motion durations | Token set 150 / 200 / 280 ms | |
| D-06 | Colour mismatches | Resolve `text-muted` and input border | |
| D-07 | Translations table | Explicit FKs + source version | |
| D-08 | Audio model | Explicit FKs, BCP 47 accents, unified status | |
| D-09 | Grammar language | Add `language_code` | |
| D-10 | Users fields | Add UI locale and secondary translation | |
| D-11 | Roles | Add `translator` scoped by language | |
| D-12 | Practice tables | One `practice_sessions` + roleplay children | |
| D-13 | Component names | Component Library names | |
| D-14 | Phase 0 design task | Review, not create | |
| D-15 | Phase numbering | Phase Plan numbering | |
| D-16 | Search scope | DB §12 in Phase 1 | |
| D-17 | Motion libraries | No Rive in MVP | |
| D-18 | Repo-dependent decisions | After Phase 0 audit | |

Owner signature / date: _mansur________16 nov 2026___________

---

## 4. Amendments (Post-Review Decisions)

These amendments were added after the initial register was produced. They resolve questions raised during the review and have owner approval. Each is treated as an approved decision with the same weight as D-01 to D-18.

### A-01 — Authentication Timing (resolves D-18 Framework D3, AUTH open question)

**Decision date:** 16 November 2026  
**Owner status:** ✅ Approved

| Item | Decision |
|---|---|
| Public access | Public browsing, search, and listening to published content require no login. |
| Saved data | Bookmarks, vocabulary saves, and progress persistence **require login**. |
| Unauthenticated save attempt | Show a clear **"Log in to save"** prompt inline. No silent fail. No data loss. |
| Login methods | Magic link or Google OAuth first (no password storage). One primary method chosen in Phase 0 (D-18). |
| Provider | Chosen in Phase 0 task 0.2 under D-18. Prefer the auth provider that co-locates with the database (e.g. Supabase Auth if Supabase is chosen) to avoid an unnecessary second vendor. |

**Affects:** Phase Plan §4.4 Milestone 1D, Screens spec §3.7 and §6, API Contract §4.5 and §10 API-4.

### A-02 — Guest Mode Scope (resolves S-2 open question)

**Decision date:** 16 November 2026  
**Owner status:** ✅ Approved

| Item | Decision |
|---|---|
| Phase 1 guest mode | **None.** No local-storage progress, no merge flow. |
| Reason | Guest merge adds complexity and testing cost. The unauthenticated experience (browse, search, read, listen) is already valuable without it. |
| Reconsider | After Gate 1E, if conversion data shows demand. |
| Screens spec S-2 | The guest-mode paragraph in §3.7 is superseded by this amendment. The screen can still show browse/listen to unauthenticated users; only save actions are blocked. |

**Affects:** Screens spec §3.7, §6, Phase Plan §4.4 Milestone 1D item 5, API Contract §10 API-4.

---

## 5. Open Decisions (after amendments)

The following items are still open. The agent must not implement a value for them until they are resolved.

| ID | Decision | Owner or agent | When |
|---|---|---|---|
| D-04 | Tailwind version and adapter | Agent decides from repo | Phase 0 task 0.2 |
| D-18 | Framework, ORM, auth provider, hosting | Agent confirms; owner approves | Phase 0 task 0.2 |
| L6 | Bangla reviewer and glossary owner (named person) | ✅ **Antigravity (AI agent) — approved 16 Nov 2026.** Owner does a final spot-check before Gate 1E. | Decided |
| CA-4 | Scenario writers and reviewers (named people) | ✅ **Antigravity drafts all scenarios (AI-drafted, human-reviewed per Brief §20). Owner approves each batch before publish.** — approved 16 Nov 2026 | Decided |
| P-1, P-3 | Jurisdiction and data retention periods | Owner + legal review | Before Phase 1 public release |
| D-LLM | LLM production provider | Owner at Gate 2 | Phase 2 |
| Cost | Free-tier limits and dates from provider pages | Agent records | Task 0.12, then each gate |
