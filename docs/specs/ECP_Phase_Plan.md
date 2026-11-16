# English Conversation Partner — Phase-by-Phase Build Plan

**Audience:** The AI coding agent (Antigravity), the product owner, and reviewers.
**Source documents:**
- `English_Conversation_Partner_Project_Brief.md` (product truth, §18 release plan, §19 acceptance criteria, §21 agent rules)
- `ECP_System_Framework.md` (stack, architecture, data model, routes)
- `ECP_Multi_Language_Strategy.md` (languages, fonts, fallback, RTL)
- `ECP_Audio_Voice_Guide.md` (TTS, audio pipeline, player)

**Constraint:** Free tools only. Any paid service needs explicit approval and a cost note in `docs/DECISIONS.md`.
**Status:** Plan for approval. No code starts until Phase 0 is approved.

---

## 0. How to Use This Plan

### 0.1 Rules that apply to every phase

1. **One phase at a time.** Do not start a phase until the previous phase's exit gate is passed and approved.
2. **Milestones inside a phase.** Work in small milestones. Each milestone ends with a demo, tests passing, and an update to `docs/IMPLEMENTATION_LOG.md`.
3. **Plan before code.** Before each milestone, the agent writes a short plan: files, components, data changes, user-visible result. The owner approves big changes (brief §21 rule 5).
4. **Approval points are marked** with 🛑. The agent stops there and waits.
5. **No fake features.** If a provider or content is missing, the UI shows an honest state (brief §21 rules 10–11).
6. **Definition of Done** (brief §18) applies at every phase exit (see §11).

### 0.2 Brief phases vs. this plan

The brief has two numbering schemes (§18 and §21). This plan uses one:

| This plan | Brief §18 name | Brief §21 Antigravity phases |
|---|---|---|
| Phase 0 | Workspace Discovery & Product Foundation | Phase 0 Discovery |
| Phase 1 | Core Learning Platform | Phases 1–4 (foundation, library, tools, admin) |
| Phase 2 | Active Learning | Phase 5 Active Practice |
| Phase 3 | Voice & Personalisation | Phase 6 Voice & Expansion (part) |
| Phase 4 | Expansion | Phase 6 Voice & Expansion (part) |

Phase 1 is large, so it is split into five milestone groups (1A–1E). Each has its own gate.

---

## 1. Phase Overview

| Phase | Goal | Learner can... | Exit gate |
|---|---|---|---|
| **0** Discovery & Setup | Agree stack, content plan, design direction; create the empty project | (nothing learner-facing) | 🛑 Owner approves decisions D1–D10 |
| **1** Core Learning Platform | A complete, working learning loop in English + Bangla | Find a situation, read, listen, translate, explore words and grammar, save, see progress | 🛑 Brief §19 acceptance criteria pass; owner signs off |
| **2** Active Learning | Practise responding, not just reading | Practise roles, build sentences, do listening quizzes, chat with an AI partner (text) | 🛑 Practice flows pass; AI cost and quality reviewed |
| **3** Voice & Personalisation | Speak, get feedback, get recommendations | Speak with AI by voice, get pronunciation hints, daily challenge | 🛑 Voice loop works; limits explained; privacy reviewed |
| **4** Expansion | Grow content and reach | More professions, more languages, installable app, optional paid plans | 🛑 Per-expansion approval |

---

## 2. Dependency Map

```
Phase 0 (Discovery)
   │
   ▼
Phase 1A Foundation ──► 1B Discovery ──► 1C Learning Page ──► 1D Learning Tools ──► 1E Admin & Release
                                             │                      │
                                             ▼                      ▼
                                      Audio pipeline          Vocabulary & grammar
                                      (parallel track)        content (parallel track)
   │
   ▼
Phase 2 Active Learning  (needs 1C dialogue data + 1D vocabulary)
   │
   ▼
Phase 3 Voice & Personalisation  (needs 2 AI text roleplay + STT decision)
   │
   ▼
Phase 4 Expansion  (needs stable content pipeline and language registry)
```

Parallel tracks that run alongside Phase 1:
- **Content track:** writing and reviewing scenarios (starts in Phase 0, never blocks code for long).
- **Audio track:** voices approved, pipeline built, demo audio (starts in 1C).
- **Translation track:** Bangla translations and glossary (starts in 1B).

---

## 3. Phase 0 — Discovery & Setup

**Goal:** Know exactly what will be built, with which tools, and have an empty but working project.
**Size:** S
**Free-tool note:** Everything here is free (Node.js, Git, a free GitHub or GitLab repo, free Vercel and Supabase or Neon tiers).

### 3.1 Tasks

| # | Task | Output |
|---|---|---|
| 0.1 | Inspect the workspace (Brief Prompt A). Do not change files. | `docs/WORKSPACE_AUDIT.md` |
| 0.2 | Confirm stack decisions D1–D10 from the framework file | `docs/DECISIONS.md` |
| 0.3 | Confirm language decisions L1–L8 | Updated `DECISIONS.md` |
| 0.4 | Confirm audio decisions A1–A10 | Updated `DECISIONS.md` |
| 0.5 | Create the repository (Next.js + TypeScript + Tailwind + ESLint + Prettier) | Running "hello" page |
| 0.6 | Create docs skeleton: `ARCHITECTURE.md`, `DECISIONS.md`, `IMPLEMENTATION_LOG.md`, `ENV.md`, `AUDIO_LICENSES.md`, `CONTENT_PLAN.md` | Files exist with headings |
| 0.7 | Create `.env.example` (no secrets) | Documented variables |
| 0.8 | Set up free hosting (Vercel preview) and free database project (Supabase or Neon) | Empty DB connected |
| 0.9 | Set up CI: install, lint, typecheck, unit test on each push (GitHub Actions free tier) | Green pipeline |
| 0.10 | Content plan: list the Phase 1 scenarios (see §4.6) and assign writers and reviewers | `docs/CONTENT_PLAN.md` |
| 0.11 | Design direction: colour tokens, type pairing, one-page style sheet. Show a single rendered sample page. | `docs/DESIGN_DIRECTION.md` + sample |
| 0.12 | Cost estimate: list every service and its free-tier limit | Table in `DECISIONS.md` |

### 3.2 🛑 Approval point 0

Owner reviews:
- Stack and provider list (D1–D10)
- Phase 1 scope and content plan
- Design direction sample
- Cost sheet (should show £0/$0 recurring at start)

**Gate passes when:** owner writes "approved" in `DECISIONS.md`.

### 3.3 Acceptance criteria

- [ ] Repo runs locally with one command.
- [ ] CI passes on an empty test.
- [ ] Database connects from the app (a health route returns OK).
- [ ] No secrets in git.
- [ ] Docs skeleton exists.

---

## 4. Phase 1 — Core Learning Platform

**Goal:** The brief's Phase 1. A learner can go through the full loop Discover → Understand → Listen → Explore → Practise (basic) → Review, using seed content.
**Size:** L (split into five milestone groups).
**Languages:** English source + Bangla translation and UI (per Multi-Language Strategy §15).

Each milestone group ends with its own gate. Do not skip ahead.

---

### 4.1 Milestone 1A — Foundation

**Goal:** Empty-but-real app shell with design system, routing, data layer, and i18n.
**Size:** M

**Tasks**
1. App shell: responsive header, sidebar on desktop, bottom nav on mobile. Navigation items from brief §3.1 (only the ones built so far are active; others show "Coming soon" honestly).
2. Route groups: `(public)`, `(app)`, `(admin)` (framework §8). Admin route shows "Not authorised" for everyone for now.
3. Design tokens in `globals.css` (framework §10.2), light theme first. Dark theme tokens defined but may be finished later.
4. Base UI components: Button, IconButton, Badge, Card, Tabs, Drawer, Popover, Toggle, Skeleton, EmptyState, ErrorState (framework §10.5).
5. Fonts via `next/font`: Latin (Literata, Figtree) and Bengali subset (Noto Sans Bengali). Load only the needed subset.
6. Database: Drizzle schema for `languages`, `categories`, `professions`, `scenarios`, `scenario_categories`, `scenario_professions`, `conversation_versions`, `speakers`, `dialogue_lines`, `translations` (per-language, per-version), `vocabulary`, `vocabulary_glosses`, `dialogue_vocabulary`, `grammar_explanations`, `audio_assets`. Migrations committed.
7. i18n: `messages/en.json`, `messages/bn.json`, `next-intl` wired. Language switcher stub in header.
8. Logical CSS properties only (`ms-*`, `start-*`). Lint rule or review check against `ml-*`, `pl-*`, `text-left`.
9. Seed script that loads demo content from `content/seed/` and is labelled "Demo content".
10. Basic dashboard: greeting and placeholder cards that link to real pages only.

**Acceptance criteria**
- [ ] Shell works at 375, 768, 1280 px widths.
- [ ] Keyboard can reach every nav item; focus ring visible.
- [ ] Bangla UI strings render with the Bengali font; English fallback works for a deliberately missing key.
- [ ] Migrations run on a clean database.
- [ ] Seed script is idempotent.
- [ ] Unit tests for schema constraints (for example, unique dialogue line sequence).

🛑 **Gate 1A:** Owner reviews the shell on mobile and desktop. Approves visual direction.

---

### 4.2 Milestone 1B — Discovery

**Goal:** A learner can browse, search, and filter the library.
**Size:** M

**Tasks**
1. Explore page: category list (Daily Life groups from brief §3.2A), profession list (brief §3.2B; only those with content are clickable).
2. Category detail and profession detail pages.
3. Scenario card: title, short description, level, length, style, languages available (coverage line from Multi-Language §6.3).
4. Search: English and Bangla text using Postgres full-text (`english` config) and `simple` config plus trigram (Multi-Language §11.2).
5. Filters: category, profession, level, length, style, language availability.
6. Discovery sections: "Beginner-friendly", "Everyday essentials", "Professional English", "Recently added".
7. Pagination or "load more" (brief §17.4).
8. Empty and error states for each list and for search with no result.
9. Scenario in multiple categories shows once with multiple tags (brief §3.3).

**Acceptance criteria**
- [ ] Searching "airport" and "এয়ারপোর্ট" both find the same demo scenario.
- [ ] A scenario tagged in two categories appears in both lists with one database record.
- [ ] Filters combine correctly and reset cleanly.
- [ ] Empty search shows a helpful message, not a blank page.
- [ ] Lists load in under 1 second on the demo data on a normal connection.

🛑 **Gate 1B:** Owner tests discovery with 5 sample searches.

---

### 4.3 Milestone 1C — Learning Page and Audio

**Goal:** The core experience. Read the conversation, reveal translations, play audio.
**Size:** L
**Parallel track:** Audio pipeline (Audio Guide §4–§5) built by the agent here, reviewed at 🛑 Gate 1C.

**Tasks**
1. Scenario detail page: title, situation, objective, speaker list, level, duration, languages.
2. Conversation version switch (Short / Medium / Long; Easy / Normal / Hard where provided).
3. Dialogue list: speaker label, English line, audio button, translation toggle, word chips. Sequence ordering from `sequence_number`.
4. Translation reveal/hide per line and "show all translations" (brief §7.2). Respects fallback chain (Multi-Language §6.1) and shows stale/missing labels (§6.2).
5. Sentence audio: `AudioButton` with all states (framework §7, Audio Guide §7).
6. Full conversation audio: `FullAudioPlayer` with play, pause, replay, speed, progress, line highlight from manifest.
7. Audio pipeline scripts: `generate_line.py`, `check_asset.py`, `generate_version.py`, `assemble_full.py` (Audio Guide §13).
8. Demo audio generated for the demo scenario in en-US and en-GB.
9. Language switch in the dialogue header; keeps playback and scroll position (Multi-Language §7.3).
10. Missing optional content handled gracefully (brief §5.1): no translation, no audio, no grammar.

**Acceptance criteria** (from brief §19 "Conversation learning")
- [ ] Dialogue lines appear in the correct order.
- [ ] Speaker roles are clear.
- [ ] Translation can be revealed and hidden for each line and for all.
- [ ] Sentence audio plays when available; shows "not available" when not.
- [ ] Full conversation audio plays; seek and line highlight work.
- [ ] No audio plays on page load.
- [ ] Changing translation language does not reload or lose position.
- [ ] Page works with JavaScript network failure for audio (text still readable).

🛑 **Gate 1C:** Owner listens to demo audio in both accents and approves voices (Audio Guide A1–A3). Owner reads the Bangla translations of the demo scenario.

---

### 4.4 Milestone 1D — Learning Tools and Personal Data

**Goal:** Vocabulary explorer, grammar explorer, bookmarks, saved words, basic progress.
**Size:** M

**Tasks**
1. Word chips open a vocabulary popover: word, IPA, part of speech, contextual meaning in the current sentence, word audio, "Save word" button (brief §5.1 Step 5).
2. Word forms and synonyms shown only when applicable (brief §6.1, §20 "Do not show irrelevant properties").
3. Grammar drawer: opens from a word or a sentence. Shows sentence-level grammar first, word-level detail on demand (brief §6). Missing grammar shows an honest message.
4. NLP helper service (FastAPI + spaCy) for lemma and POS during content save (Framework §12). Deployed separately; runs locally in dev.
5. **Auth implemented here (A-01, 16 Nov 2026):** Sign-up and login with magic link or Google OAuth (provider confirmed in Phase 0, D-18). Public read access requires no login. Authenticated session required only for saving data. No guest progress storage (A-02).
6. Bookmarks for conversations (add, remove, list in "Favourites").
7. My Vocabulary page: saved words, with word, meaning in preferred language, example, and audio.
8. Progress: completed conversations, last position, words saved. Persisted per user.
9. Continue Learning card on dashboard uses real progress.
10. Review screen at end of a conversation: completed status, words learned, suggested next conversation, repeat or bookmark (brief §5.1 Step 8).

**Acceptance criteria** (brief §19 "Vocabulary & grammar" and "Personal learning")
- [ ] Relevant vocabulary opens from a sentence.
- [ ] Contextual meaning matches the sentence, not a generic dictionary meaning.
- [ ] Grammar drawer opens and closes with keyboard and mouse; focus returns to the trigger.
- [ ] Missing grammar does not break the page.
- [ ] Bookmark persists after reload for authenticated users.
- [ ] Saved word appears in My Vocabulary and in the review screen.
- [ ] Progress for an authenticated user survives logout and login.
- [ ] **[A-01]** Unauthenticated user who tries to bookmark or save a word sees a "Log in to save" prompt inline, not a silent fail and not a full redirect. The learner's position in the conversation is not lost.
- [ ] **[A-02]** No local-storage progress written for unauthenticated users.

🛑 **Gate 1D:** Owner checks grammar and vocabulary accuracy on 10 sentences. Any wrong explanation blocks the gate.

---

### 4.5 Milestone 1E — Admin, Content, and Release

**Goal:** Content can be created, reviewed, and published safely. The app is ready for real learners.
**Size:** L

**Tasks**
1. Role system: `learner`, `editor`, `reviewer`, `admin` (Multi-Language §13.1 roles). Enforced in route handlers and server actions, not only the UI.
2. Admin dashboard: content library with status filter (Draft, In Review, Ready to Publish, Published, Archived).
3. Scenario editor: metadata, categories, professions, languages, status.
4. Conversation editor: speakers, dialogue lines (add, edit, reorder), translations per language, vocabulary links, grammar notes, audio generation trigger.
5. Validation before publish (framework §5.1, brief §14.3): required fields, sequence continuity, speaker references, translation count per language, audio references (for required assets only).
6. Coverage report: scenarios × languages, missing counts.
7. Audit log: who changed what and when.
8. Publish, unpublish, archive; publish is blocked for unauthorised roles.
9. Stale translation detection when English source changes (Multi-Language §4.1).
10. Content migration path: seed content and admin-created content use the same tables.
11. Release hardening:
    - Error monitoring (Sentry free tier)
    - Security headers and CSP
    - Rate limits on any write endpoint (Upstash free tier, or in-memory for dev)
    - Accessibility pass (axe automated plus manual keyboard)
    - Playwright E2E for the critical journeys (framework §14)
    - Privacy page and terms placeholder reviewed by owner
    - Remove or label every demo element

**Content for release (Phase 1 target)**

| Area | Target |
|---|---|
| Daily life scenarios | 12 scenarios across 4 categories (for example Shopping & Money, Travel & Transportation, Health & Hospital, Social Relationships) |
| Professional path | 1 path, 5 conversations (for example UI/UX Designer, brief §3.2B) |
| Versions | Every scenario has Short. At least 6 scenarios also have Medium. |
| Bangla translation | Reviewed for all published scenarios |
| Audio | en-US and en-GB sentence audio for all published lines; full audio for all published versions |
| Grammar | Sentence-level grammar for all published lines; word-level for key vocabulary |

Quality over quantity (brief §20 risk 1). Do not publish unreviewed content to hit a number.

**Acceptance criteria** (brief §19 "Admin" and "Quality")
- [ ] An authorised admin can create and edit a scenario.
- [ ] Admin can add versions and dialogue lines, and reorder them.
- [ ] Admin can manage translations and vocabulary references.
- [ ] Admin can save drafts with partial content.
- [ ] Publish works only through the review and validation workflow.
- [ ] Unauthorised users get 403 for admin API calls, not only hidden buttons.
- [ ] Responsive on mobile, tablet, desktop.
- [ ] Critical flows covered by Playwright tests.
- [ ] No dead buttons (brief §19 Quality).
- [ ] No critical or high-severity bug open.

🛑 **Gate 1E (Phase 1 exit):** Owner runs the full brief §23 success criteria as a learner would. Reviewer confirms all published content. Owner signs the release.

**Phase 1 exit checklist (brief §18 Definition of Done)**
- [ ] User-visible flows work
- [ ] UI responsive
- [ ] Data handled correctly
- [ ] Errors and empty states handled
- [ ] Important interactions tested
- [ ] No known critical regression
- [ ] Documentation updated
- [ ] Completed work and remaining limitations reported

---

## 5. Phase 2 — Active Learning

**Goal:** Learners practise responding, not only reading and listening. This is where the product becomes "conversation partner".
**Size:** L
**Starts only after:** Gate 1E passed.

### 5.1 Milestones

| Milestone | Scope | Notes |
|---|---|---|
| **2A** Listening & recall | Listening comprehension quiz (brief §10.4); "Hide one speaker" and "Complete missing lines" practice modes (brief §5.1 Step 7) | No AI needed. Quiz questions authored per scenario. |
| **2B** Sentence building | Sentence builder: arrange shuffled words into the correct sentence (brief §10.5). Validated against the stored correct answer and accepted alternatives. | Free. Uses the NLP service only to check word lists if needed. |
| **2C** "What Should I Say?" | User types an intent in English, Bangla, or Banglish; output: natural English options (polite, casual), translation, phrases, related conversation links (brief §10.7, §10.1) | Needs LLM decision (see 5.2). Must not invent commitments. |
| **2D** AI text roleplay | Choose scenario and role; AI plays the other role; hints; gentle corrections; session transcript; feedback summary (brief §9) | Needs LLM decision. Heavy guardrails (framework §4.4). |
| **2E** Review system | Vocabulary revision using spaced repetition (free algorithm, for example SM-2) on saved words; daily conversation challenge (brief §10.3) | Pure logic, free. |

### 5.2 🛑 LLM decision (required before 2C or 2D)

The AI layer needs a provider. Options must be verified and recorded:

| Option | Cost | Quality for this use | Notes |
|---|---|---|---|
| Hosted model with a **free tier** (for example Google AI Studio or Groq free tiers) | Free within limits | Good for English dialogue | Limits and terms change. Verify before use. Free tiers may use data for model improvement; check terms and do not send personal data. |
| **Local open-weight model** through Ollama (for example a small instruction model) | Free (your hardware) | Lower quality, weak Bangla, slower | Good for dev and testing. Not reliable for public launch on weak servers. |
| Paid hosted model (Claude, GPT-class) | Paid | Best | Only with owner approval and budget cap. |

**Recommendation:** Prototype in 2C and 2D with a free hosted tier and a local model for tests. Decide on production only after cost and quality tests. Record the decision as D-LLM in `DECISIONS.md`.

### 5.3 Phase 2 acceptance criteria

- [ ] Listening quiz scores correctly and explains wrong answers.
- [ ] Sentence builder accepts correct alternative word orders where the grammar allows, and says why an order is wrong.
- [ ] AI roleplay stays inside the scenario for at least 10 test conversations (scripted tests).
- [ ] AI roleplay gives at most one correction per turn (brief §9.2).
- [ ] Session transcript is saved and can be replayed.
- [ ] Feedback shows limits and never invents facts.
- [ ] Rate limits and per-user quotas enforced.
- [ ] AI cost per session measured and recorded.
- [ ] A user can stop a session at any time.
- [ ] Prompt injection test cases pass (user says "ignore instructions" → model stays in role).

🛑 **Gate 2 (Phase 2 exit):** Owner tests 5 roleplay sessions end to end. Cost per session is recorded and acceptable. Safety test cases pass.

---

## 6. Phase 3 — Voice & Personalisation

**Goal:** Learners speak with the AI and get useful feedback. Learning adapts to the learner.
**Size:** L
**Starts only after:** Gate 2 passed.

### 6.1 Milestones

| Milestone | Scope | Free-tool path |
|---|---|---|
| **3A** Speech input | Learner speaks a reply; transcription shown and editable | Browser Web Speech API (prototype, check privacy); Whisper via faster-whisper on a small server (production, free) |
| **3B** Voice roleplay loop | AI speaks its lines (pre-generated Piper audio for scripted turns; decide for free-form turns) → learner speaks → transcript → AI reply | Piper for scripted lines. For free-form AI reply audio, verify a free TTS option or keep text reply with optional audio. |
| **3C** Pronunciation hints | Word-level hints for unclear words; relative feedback only, no fake score (brief §9.3) | Whisper word timestamps; Azure free tier only with approval |
| **3D** Personalisation | Recommendations from progress and saved vocabulary; daily challenge tuned to level | Rule-based first (free). ML only later. |
| **3E** Analytics | Progress analytics dashboard for the learner; aggregate analytics for owner (no personal data beyond need) | Free: Postgres queries; PostHog free tier optional, privacy notice updated |

### 6.2 Decisions required

| # | Decision |
|---|---|
| V1 | Browser Web Speech vs local Whisper: which in production? |
| V2 | Where Whisper runs (owner server, free tier VM, or learner's device) |
| V3 | Does free-form AI reply get audio? If yes, which free TTS and what voice? |
| V4 | Pronunciation hints: local rule-based only, or Azure free tier? |
| V5 | Analytics tool and privacy statement |

### 6.3 Privacy and safety gate

Voice data is personal data. Before 3A ships:
- Microphone permission asked only when the learner taps "Speak".
- Audio is not stored by default. Transcripts stored only if the learner saves the session.
- Learner can delete voice and transcripts.
- Privacy page updated and reviewed by owner.
- No voice data used for training.

### 6.4 Phase 3 acceptance criteria

- [ ] Learner can complete a spoken roleplay with a visible transcript.
- [ ] Transcript correction is possible before the AI replies.
- [ ] Pronunciation hints explain limits and avoid percentages.
- [ ] Daily challenge changes daily and matches level.
- [ ] Recommendations explain why a conversation was suggested.
- [ ] Microphone denied → clear fallback to text mode.
- [ ] Works in Chromium and at least one other browser; unsupported browser shows a message.

🛑 **Gate 3 (Phase 3 exit):** Owner tests voice roleplay on desktop and phone. Privacy review passed.

---

## 7. Phase 4 — Expansion

**Goal:** Grow the library, languages, and reach. Each item is a separate approval.
**Size:** Open-ended. Work in one expansion at a time.

### 7.1 Expansion tracks

| Track | Scope | Gate |
|---|---|---|
| **4A** More professions | Lawyer, Doctor, Teacher, etc. (brief §3.2B). Professional content needs a subject-matter reviewer. | Reviewer named; content plan approved |
| **4B** More translation languages | Hindi first (Devanagari), then Arabic or Urdu (RTL). Follow Multi-Language §13.3 checklist. | RTL test pass for Arabic/Urdu; reviewer per language |
| **4C** Installable web app (PWA) | Add to home screen, offline caching of text (not audio by default), service worker | Storage limits and cache policy approved |
| **4D** Native mobile app | Only if PWA is not enough. React Native or Expo. | Owner approves; separate architecture review |
| **4E** Premium plans | Subscription or one-time purchase; usage limits for AI and voice | Owner approves pricing; payment provider chosen; legal review |
| **4F** Community practice | Shared roleplay or study groups | Moderation plan approved; safety review |
| **4G** Advanced analytics | More insight for learners and content quality | Privacy review |

### 7.2 Rules

- Expansions do not change the core loop (brief §23 final principle).
- Each expansion adds data and content, not a new codebase, wherever possible (brief §1.3 principle 8).
- Paid services need explicit approval, a cost sheet, and a monthly budget cap.

---

## 8. Cross-Phase Workstreams

These run through every phase, not as one-off tasks.

| Workstream | Ongoing work | Owner |
|---|---|---|
| **Content** | Write, translate, review, and publish scenarios; keep `CONTENT_PLAN.md` updated | Content lead + reviewers |
| **Quality** | Tests, accessibility checks, responsive checks, bug triage by severity | Agent (tests), owner (review) |
| **Security** | Auth checks on every route, secrets review, dependency updates, rate limits | Agent, owner approves changes |
| **Documentation** | `IMPLEMENTATION_LOG.md` after each milestone; `DECISIONS.md` when a choice is made | Agent |
| **Cost** | Monthly check of free-tier usage (database, storage, AI, audio); record in `DECISIONS.md` | Owner |
| **Licences** | `AUDIO_LICENSES.md`, font licences, content licences | Agent, owner checks |
| **Language quality** | Bangla review of new content; glossary upkeep | Bangla reviewer |

---

## 9. Milestone Template

Copy into `docs/IMPLEMENTATION_LOG.md` for every milestone.

```
## Milestone <phase><letter> — <name>
Date:
Status: planned | in progress | awaiting approval | done

### Plan (approved)
- Files:
- Components:
- Data changes (migrations):
- User-visible result:

### Done
- [ ] Tasks completed (list)
- [ ] Tests added and passing (unit / component / E2E)
- [ ] Accessibility checked (keyboard, labels)
- [ ] Responsive checked (375 / 768 / 1280)
- [ ] Empty, loading, error states checked
- [ ] Docs updated

### Known limitations
-

### Decisions made (link to DECISIONS.md)
-

### Approval
- Owner: approved / changes requested (note)
```

---

## 10. Risks by Phase

| Phase | Main risks | Mitigation |
|---|---|---|
| 0 | Stack chosen without checking the workspace | Workspace audit first (0.1) |
| 1A | Over-building the design system | Only components used by the screens in scope (brief §20) |
| 1B | Bangla search does not match well | Use simple config + trigram; synonym table; test with real Bangla queries |
| 1C | Audio quality is too robotic for learners | Voice approval gate (A1–A3); Kokoro as an option |
| 1C | Translations misaligned with English | Per-version source tracking and stale status (Multi-Language §4.1) |
| 1D | Wrong grammar explanations | Schema validation, spaCy cross-check, reviewer gate 1D |
| 1E | Too much content published without review | Validation and reviewer sign-off per scenario; cap on first release |
| 1E | Admin routes exposed | Server-side role check on every handler; tests for 403 |
| 2 | AI roleplay drifts off-topic or invents facts | Scenario-bound prompts, guardrails, scripted test cases |
| 2 | AI cost grows with users | Quotas, caching, cheaper model for short tasks, cost check at Gate 2 |
| 3 | Voice privacy concerns | Permission on tap, no default audio storage, delete option |
| 3 | Browser speech support uneven | Feature detection; text fallback always available |
| 4 | Professional content gives harmful advice | Subject-matter reviewer; "not professional advice" notice |
| 4 | Multi-language scope creep | One language per expansion; checklist from Multi-Language §13.3 |

---

## 11. Phase Exit Checklist (applies to every gate)

- [ ] Milestones in the phase are marked done in `IMPLEMENTATION_LOG.md`
- [ ] Acceptance criteria for the phase pass (listed in its section)
- [ ] Automated tests pass in CI
- [ ] Accessibility checked on key pages
- [ ] Responsive checked on 375, 768, 1280
- [ ] No known critical or high bugs
- [ ] Free-tier usage checked; costs recorded
- [ ] Docs updated (`ARCHITECTURE.md`, `DECISIONS.md`, `AUDIO_LICENSES.md` where relevant)
- [ ] Remaining limitations written down
- [ ] Owner has approved in `DECISIONS.md`

---

## 12. Suggested Session Protocol for the Agent

Each working session:
1. Read this plan, the current phase section, and the last entry in `IMPLEMENTATION_LOG.md`.
2. State the milestone and the tasks for this session. Keep it to one milestone or part of one.
3. Write the plan (files, data changes, user-visible result). Wait for approval if the change is big.
4. Build with tests.
5. Run the checks (lint, typecheck, unit, E2E for touched flows).
6. Update the log and report what is done, what is not, and what needs a decision.
7. Stop at the next 🛑 point.

---

## 13. Immediate Next Actions

1. Owner reviews this plan and the earlier four documents.
2. Owner approves Phase 0 decisions (D1–D10, L1–L8, A1–A10).
3. Agent runs Phase 0 tasks 0.1–0.12.
4. 🛑 Approval point 0.
5. Start Milestone 1A.

---

*This plan is a living document. Update the phase status and log any change to scope in `docs/DECISIONS.md`.*
