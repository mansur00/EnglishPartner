# English Conversation Partner — System Framework

**Source of truth:** `English_Conversation_Partner_Project_Brief.md`
**Purpose:** Technical framework covering the application stack, AI/model layer, content pipeline, data flow, folder structure, and phased rollout.
**Status:** Proposal, pending approval (the brief requires approval before scaffolding or major architecture decisions).

---

## 1. Summary of Recommendation

| Layer | Recommended choice | Why |
|---|---|---|
| Frontend framework | **Next.js (App Router) + React + TypeScript** | SEO for scenario pages, server components for fast learning pages, server actions and route handlers keep API keys off the browser |
| Styling | **Tailwind CSS** + design tokens (CSS variables) | Consistent design system, responsive utilities, easy dark/light and Bangla font handling |
| UI primitives | **Radix UI** (or shadcn/ui built on Radix) | Accessible dialogs, drawers, popovers, tabs, and menus with keyboard support out of the box |
| Server state | **TanStack Query** for client data, server components for initial data | Clear loading, error, and cache behaviour |
| Validation | **Zod** | Shared schemas for forms, API input, and content validation |
| Database | **PostgreSQL** (Supabase or Neon) | The brief's data model is relational; needs joins, many-to-many categories, and full-text search |
| ORM / migrations | **Drizzle ORM** (or Prisma) | Typed queries, controlled migrations |
| Authentication | **Auth.js** or **Clerk** (or Supabase Auth if Supabase is chosen) | Secure sessions and role-based access for admins |
| Object storage (audio) | **Cloudflare R2** or **Supabase Storage** / S3 | Store audio by reference, CDN delivery, low egress cost |
| Caching / rate limits | **Upstash Redis** (later phase) | Rate-limit AI endpoints, cache TTS and translation results |
| NLP helper service | **Python FastAPI + spaCy** (small separate service) | Reliable lemma, POS, and tokenisation; JavaScript NLP is weaker for English |
| LLM provider | **Provider-agnostic gateway**, default to one Claude-class or GPT-class model | Swap models without touching product code |
| TTS provider | **Azure Neural TTS** or **Google Cloud TTS** (primary); ElevenLabs as a quality option | Mature en-US and en-GB voices, SSML control, reliable for sentence audio |
| Speech recognition (Phase 3) | **Azure Speech** (with pronunciation assessment) or Whisper-class STT | Pronunciation scoring with phoneme-level feedback |
| Hosting | **Vercel** (app) + managed Postgres + R2 | Fast setup, preview deployments, easy to start cheaply |
| Testing | **Vitest** (unit), **React Testing Library**, **Playwright** (end-to-end) | Covers the brief's critical flows |
| Observability | **Sentry** + structured logs; **PostHog** (optional, privacy-conscious) | Errors and learning-flow analytics |

**Important:** Every provider above is a recommendation. The brief says not to assume a provider until it is verified in the workspace and approved, so each must be confirmed, costed, and checked for Bangla and accent quality before it is locked in.

---

## 2. Why Next.js instead of the alternatives

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **Next.js** | SSR/SSG for SEO, App Router, server actions, route handlers, large ecosystem | Slightly more complex mental model | **Recommended** |
| Vite + React SPA | Simple, fast dev | Weak SEO for scenario pages, needs a separate backend for keys | Only if no SEO is needed |
| Remix / React Router | Strong data loading model | Smaller ecosystem for this use case | Viable alternative |
| Vue / Nuxt, Svelte / SvelteKit | Excellent DX | Team familiarity matters; the brief already names React and Next | Not chosen |

The product needs public, indexable scenario pages (for SEO and sharing), authenticated learner pages, and an admin area. Next.js covers all three in one codebase.

---

## 3. High-Level Architecture

```
                ┌──────────────────────────────────────────┐
                │              Browser / PWA               │
                │  Next.js UI (React + Tailwind + Radix)   │
                │  Audio player · Translation toggle ·     │
                │  Grammar drawer · Vocabulary popover     │
                └───────────────┬──────────────────────────┘
                                │ HTTPS (server components,
                                │ server actions, route handlers)
                ┌───────────────▼──────────────────────────┐
                │         Next.js Server Layer             │
                │  Auth · Content API · Progress API ·     │
                │  Admin API · AI Gateway · Audio signer   │
                └──┬─────────┬─────────┬──────────┬────────┘
                   │         │         │          │
          ┌────────▼──┐ ┌────▼────┐ ┌──▼──────┐ ┌─▼────────────────┐
          │ PostgreSQL│ │ Redis   │ │ Object  │ │ AI Services      │
          │ (content, │ │ (rate   │ │ Storage │ │ • LLM gateway    │
          │ users,    │ │ limits, │ │ (audio, │ │ • TTS            │
          │ progress) │ │ cache)  │ │ images) │ │ • STT (Phase 3)  │
          └───────────┘ └─────────┘ └─────────┘ └──────────────────┘
                                                        ▲
                               ┌────────────────────────┘
                     ┌─────────┴──────────┐
                     │ NLP Service        │
                     │ (FastAPI + spaCy)  │
                     │ lemma · POS ·      │
                     │ tokenise · align   │
                     └────────────────────┘

   Content pipeline (offline / admin):
   LLM draft → NLP validation → translation QA → TTS generation
            → human review → Ready to Publish → Published
```

**Key rule:** The browser never talks to an AI or TTS provider directly. All provider calls go through the server layer, which holds the secrets, applies rate limits, and caches results.

---

## 4. AI and Model Layer

This is the part of the system that uses models. Each model has a clear job, and the product never depends on a single provider.

### 4.1 Model roles

| # | Job | Model type | When it runs | Notes |
|---|---|---|---|---|
| M1 | **Conversation drafting** | LLM (strong general model) | Offline, admin-triggered | Generates draft dialogues by scenario, level, and style. Output is always reviewed by a human before publishing. |
| M2 | **Sentence translation** | LLM with glossary, optionally a dedicated MT API as baseline | Offline, cached | Translates by sentence; keeps source and target aligned. Bangla output needs native review. |
| M3 | **Contextual grammar explanation** | LLM with structured output (JSON schema) | Offline, cached per sentence/word | Must use the actual sentence as context. Output validated against the grammar schema. |
| M4 | **Contextual word meaning** | LLM + lexicon lookup | Offline, cached per dialogue line | Stored in `DialogueVocabulary.contextual_meaning`. |
| M5 | **Lemma, POS, tokenisation, alignment** | spaCy (NLP service), not an LLM | On content save | Deterministic. Used to validate and enrich LLM output. |
| M6 | **TTS (sentence and full audio)** | Neural TTS | Offline, generated once per sentence + voice | Result stored in object storage and reused by `audio_asset`. |
| M7 | **"What Should I Say?"** | LLM (fast, cheaper model is fine) | Online, rate-limited | Must not invent commitments or facts (brief §10.1). |
| M8 | **AI Speaking Partner (text)** | LLM with scenario system prompt and guardrails | Online, rate-limited, session-based | Phase 2. Stays inside the scenario. |
| M9 | **Speaking feedback** | LLM for language feedback + STT/pronunciation service for audio | Online, after session | Phase 2 (text), Phase 3 (voice). Pronunciation scores are presented with limitations. |
| M10 | **Speech recognition** | STT service | Online, Phase 3 | Only after provider decision and cost check. |

### 4.2 LLM gateway (provider-agnostic)

Create one internal module, for example `lib/ai/llm.ts`, with a single interface:

```ts
// Conceptual interface, not final code
interface LLMProvider {
  name: string;
  generate(input: {
    system: string;
    messages: { role: "user" | "assistant"; content: string }[];
    schema?: ZodSchema;          // for structured output
    temperature?: number;
    maxTokens?: number;
    purpose: "draft" | "translate" | "grammar" | "meaning" | "say-it" | "roleplay" | "feedback";
  }): Promise<{ text: string; parsed?: unknown; usage: TokenUsage }>;
}
```

Benefits:
- Switch providers per task (for example, a cheaper model for "What Should I Say?" and a stronger model for drafting).
- Log token usage per `purpose` for cost monitoring.
- Enforce schema validation in one place.
- Add fallback providers without changing features.

### 4.3 Prompt management

- Store prompts as versioned files in `content/prompts/` (for example `grammar.v1.md`).
- Every generated record stores `prompt_version` and `model_name` so results can be audited and regenerated.
- Keep system prompts free of secrets.

### 4.4 Guardrails for AI features

| Risk | Control |
|---|---|
| Invented facts or commitments ("What Should I Say?") | Prompt rule plus a "do not invent" check; show the user's original intent next to the output |
| Off-topic roleplay | Scenario-bound system prompt; turn limit; safety filter on input |
| Hallucinated grammar | Schema validation + NLP cross-check (spaCy POS must match the claimed POS) |
| Translation drift | Sentence alignment check; human review status on each `Translation` row |
| Cost spikes | Per-user and per-day quotas in Redis; cache by content hash |
| Prompt injection from user text | Treat user input as data; never let it change system instructions; no tool access beyond the scenario |
| Professional advice risk (legal, medical) | Disclaimer on those scenarios; content reviewed by a knowledgeable reviewer; no advice-style output in roleplay |

### 4.5 Content cache key

To avoid paying twice for the same output, use a content hash:

```
cache_key = sha256(purpose + model_name + prompt_version + normalised_input)
```

Store the result in the `Translation`, `GrammarExplanation`, or `AudioAsset` table, and check the hash before any new call.

---

## 5. Content Pipeline (Admin Workflow)

The brief warns against generating large amounts of unreviewed content. This pipeline enforces that.

```
 ┌─────────┐   ┌───────────┐   ┌────────────┐   ┌────────────┐   ┌──────────────┐   ┌───────────┐
 │  Draft  │ → │ Generate  │ → │ Auto-check │ → │ Human      │ → │ Ready to     │ → │ Published │
 │ (scene  │   │ dialogue, │   │ NLP, schema│   │ review     │   │ Publish      │   │           │
 │ brief)  │   │ translate,│   │ alignment, │   │ (editor +  │   │ (all required│   │           │
 │         │   │ grammar,  │   │ speaker    │   │ native     │   │ checks pass) │   │           │
 │         │   │ audio     │   │ refs       │   │ reviewer)  │   │              │   │           │
 └─────────┘   └───────────┘   └────────────┘   └────────────┘   └──────────────┘   └───────────┘
                                                                          │
                                                                    Archived ← (any time)
```

### 5.1 Automated checks before publishing

Aligned with brief §14.3:

- Required scenario fields present
- Dialogue lines have a continuous `sequence_number`
- Every `speaker_id` exists
- Translation count matches dialogue line count per language
- Every `vocabulary_id` referenced exists
- Every `audio_asset_id` exists and has `status = ready`
- Grammar references point to existing targets
- Level and style metadata present

### 5.2 Human review checklist

- Dialogue sounds natural for the stated style (casual, neutral, formal)
- Translation keeps meaning, tone, and politeness
- Idioms and phrasal verbs explained by meaning
- Grammar note matches the actual sentence
- Level assignment checked against sentence complexity, not decoration
- Professional content (legal, medical, financial) reviewed by a relevant expert

### 5.3 Partial content is allowed

A scenario can be saved as a Draft with missing translation, audio, or grammar. The learner page must handle missing parts gracefully (brief §5.1).

---

## 6. Audio System

| Item | Decision |
|---|---|
| Audio granularity | Per sentence, per voice, plus full-conversation audio (stitched or rendered as one file) |
| Reuse | Hash of `(text + voice_id + speed + SSML)` → one `AudioAsset`; reuse across scenarios |
| Storage | Object storage; the DB stores `audio_url`, `duration`, `status`, `voice_id`, `accent` |
| Delivery | CDN; signed URLs for any non-public audio |
| Loading | Lazy-load non-critical audio; never preload every sentence on first paint |
| Playback speed | 0.75x, 1x, 1.25x, 1.5x, 2x (native `playbackRate`) |
| Accents | American and British variants, configured per voice |
| Word pronunciation | Generated once per lemma + accent |
| Timing | Use TTS word-level timing (where the provider supports it) to power a progress indicator and word highlight |
| Autoplay | Never autoplay; always user-initiated |
| Failure | Loading, error, and retry states on every audio button |

---

## 7. Data Model (implementation notes)

Use the brief's entities (§15) as the base. Additional recommendations:

| Table | Notes |
|---|---|
| `users` | Auth provider owns credentials; store only profile and preferences |
| `categories` | Self-referencing `parent_id`; unique `slug` |
| `professions` | Same pattern as categories |
| `scenarios` | Single record; many-to-many with categories (`scenario_categories`) and professions (`scenario_professions`) |
| `scenario_tags` | Add tags as a separate table for flexible discovery |
| `conversation_versions` | `(scenario_id, level, length_type, style)` unique |
| `speakers` | Per scenario or per version, with a role label |
| `dialogue_lines` | `(conversation_version_id, sequence_number)` unique; index on `conversation_version_id` |
| `translations` | Polymorphic (`source_type`, `source_id`) → add a check constraint on allowed types; index `(source_type, source_id, language_code)` |
| `vocabulary` | Unique `(lemma, part_of_speech)` where applicable |
| `dialogue_vocabulary` | Junction with `contextual_meaning` |
| `grammar_explanations` | Store `explanation` as structured JSON, plus `schema_version` |
| `audio_assets` | Unique `(source_type, source_id, voice_id, accent)` |
| `user_progress` | Unique `(user_id, conversation_version_id)` |
| `user_vocabulary` | Unique `(user_id, vocabulary_id)` |
| `bookmarks` | Unique `(user_id, target_type, target_id)` |
| `practice_sessions` | Store transcript as JSON or in object storage |
| `audit_log` | Who changed what in admin, and when (needed for content governance) |
| `content_status_history` | Draft → In Review → Ready → Published → Archived transitions |

**Polymorphic relations:** `translations` and `grammar_explanations` use `(target_type, target_id)`. Enforce with application-level validation and a check constraint. Do not use a separate table per target type unless the complexity grows.

**Indexing:** Full-text index on scenario title, description, and situation text (PostgreSQL `tsvector`). Add `pgvector` later for natural-language "intent search" (brief §10).

**Access control:**
- Learners: read published content; write only their own progress, bookmarks, and vocabulary.
- Editors: read and write drafts they are assigned to.
- Admins: publish, archive, manage users.
- Enforce at the server layer (route handlers and server actions), not only in the UI.

---

## 8. Routes and Screens

Matches brief §16.3 and the navigation in §3.1.

```
/                          Landing page (public)
/login  /signup            Authentication
/onboarding                Learning preferences (level, goal, translation language, accent)

/(app)                     Learner area (requires auth)
  /dashboard               Continue learning, recommendations, streak, progress
  /explore                 Search, filters, discovery sections
  /explore/daily-life      Category index
  /explore/category/[slug] Category detail
  /professions             Profession index
  /professions/[slug]      Profession detail (learning path)
  /conversations/[slug]    Scenario detail + learning page
     ?version=short|medium|long
  /vocabulary              My Vocabulary (saved words)
  /favourites              Bookmarked conversations
  /progress                Progress and history
  /settings                Preferences
  /practice                AI Speaking Partner (Phase 2+)
  /practice/[sessionId]    Session and feedback

/admin                     Admin area (role-protected)
  /admin/content           Content library, filters, statuses
  /admin/scenarios/[id]    Scenario editor
  /admin/conversations/[id] Conversation editor (lines, speakers, audio)
  /admin/vocabulary        Vocabulary management
  /admin/professions       Profession management
  /admin/categories        Category management
  /admin/review            Review queue
```

Use route groups `(public)`, `(app)`, and `(admin)` with separate layouts and middleware checks.

---

## 9. Frontend Architecture

### 9.1 Folder structure

```
english-conversation-partner/
├─ app/
│  ├─ (public)/           landing, login, signup
│  ├─ (app)/              learner routes
│  ├─ (admin)/            admin routes (role-guarded)
│  ├─ api/                route handlers (only where needed)
│  ├─ layout.tsx
│  └─ globals.css         Tailwind + design tokens
├─ components/
│  ├─ ui/                 Button, Input, Badge, Card, Drawer, Tabs, Toast (primitives)
│  ├─ layout/             AppShell, Sidebar, MobileNav, Header
│  ├─ discovery/          SearchBar, FilterBar, ScenarioCard, SectionRow
│  ├─ learning/           ScenarioHeader, ConversationVersionSwitch,
│  │                      DialogueList, DialogueLine, SpeakerLabel,
│  │                      TranslationToggle, AudioButton, FullAudioPlayer,
│  │                      WordChip, VocabularyPopover, GrammarDrawer,
│  │                      ReviewSummary
│  ├─ practice/           RoleplayChat, HintButton, FeedbackPanel (later)
│  └─ admin/              ScenarioForm, LineEditor, TranslationTable,
│                         AudioStatusBadge, PublishControls
├─ features/              feature logic (hooks, services, state)
│  ├─ learning/
│  ├─ discovery/
│  ├─ progress/
│  ├─ vocabulary/
│  ├─ practice/
│  └─ admin/
├─ lib/
│  ├─ db/                 Drizzle schema, client, migrations
│  ├─ auth/               session, role checks
│  ├─ ai/                 llm.ts, prompts loader, cache, guardrails
│  ├─ audio/              TTS adapter, storage adapter, signer
│  ├─ i18n/               language codes, translation fallback
│  ├─ validation/         Zod schemas (shared client + server)
│  └─ utils/
├─ content/
│  ├─ prompts/            versioned prompt files
│  ├─ seed/               demo content (clearly labelled as demo)
│  └─ fixtures/           test data
├─ services/
│  └─ nlp/                FastAPI + spaCy service (separate deployable)
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  └─ e2e/                Playwright flows
├─ docs/
│  ├─ ARCHITECTURE.md
│  ├─ DECISIONS.md        architecture decision records
│  ├─ IMPLEMENTATION_LOG.md
│  └─ ENV.md              environment variables (no secrets)
└─ .env.example
```

### 9.2 Component principles

- **Data-driven:** Components take typed props from a content model. No conversation text hardcoded in components (brief §17.2).
- **Server components by default;** client components only for audio, toggles, drawers, and popovers.
- **Single responsibility:** `DialogueLine` renders one line; `AudioButton` handles playback state; `TranslationToggle` handles reveal/hide.
- **Keyboard and screen reader:** every control reachable by keyboard; labels include speaker and sentence context (for example, "Play line 3 by Passenger").
- **States:** each data-driven component has loading, empty, error, and success variants.

### 9.3 Key learning page composition

```
ScenarioHeader (title, level, length, style, duration, objective)
ConversationVersionSwitch (short | medium | long)
FullAudioPlayer (play, pause, replay, speed, progress)
DialogueList
  └─ DialogueLine (x N)
       ├─ SpeakerLabel
       ├─ English sentence (word chips → VocabularyPopover)
       ├─ AudioButton (sentence)
       └─ TranslationToggle (reveal / hide)
VocabularyPanel (secondary, collapsed by default)
GrammarDrawer (opened from a word or sentence; progressive detail)
PracticePanel (read aloud, role-play, complete lines, questions)
ReviewSummary (end of conversation)
```

### 9.4 State management

| Concern | Tool |
|---|---|
| Server data (scenarios, lines, progress) | Server components + TanStack Query for client refetch |
| Playback state (current line, speed, playing) | Local React state in a `PlaybackProvider` context |
| Translation visibility | Local state, persisted to user preference |
| Admin forms | React Hook Form + Zod |
| Global UI (drawers, toasts) | Radix primitives + a small toast store |

Avoid a global store (Redux) unless complexity demands it.

---

## 10. Tailwind CSS and Design System

### 10.1 Design principles (from brief §16)

Calm, friendly, trustworthy, and focused. The English sentence is the most visually prominent element. Translation, vocabulary, and grammar are secondary and revealed on request.

### 10.2 Design tokens

Define tokens as CSS variables and map them into Tailwind, so light and dark themes and future branding changes are a single edit.

```css
/* globals.css — conceptual */
:root {
  --color-paper:    #FAF7F2;   /* page background */
  --color-ink:      #1F2A2E;   /* primary text */
  --color-muted:    #5C6B70;   /* secondary text */
  --color-line:     #E4DED3;   /* dividers, borders */
  --color-accent:   #2F6F5E;   /* primary action, audio active */
  --color-accent-2: #C98B3C;   /* highlights: vocabulary, new words */
  --color-success:  #2E7D4F;
  --color-danger:   #B3432F;
  --color-focus:    #1F5FA8;   /* focus ring, always visible */
}
```

Notes:
- The accent is a deep teal-green, chosen to avoid the common "warm cream + terracotta" AI-default look and the "black + neon" look. This is a proposal to review visually.
- Never use color alone to convey meaning (brief §16.2). Pair color with icons and text.
- Provide dark mode tokens in the same file.

### 10.3 Typography

| Role | Suggested face | Notes |
|---|---|---|
| English dialogue (reading) | **Literata** or **Newsreader** | Serif designed for long reading; gives dialogue a book-like calm |
| UI text and labels | **Figtree** or **Instrument Sans** | Clean, readable at small sizes |
| Bangla text | **Noto Sans Bengali** or **Hind Siliguri** | Bangla must render properly; test line height and conjunct characters |
| Phonetic symbols | **Noto Sans** (IPA coverage) | For pronunciation display |

Set a type scale with Tailwind's `text-*` tokens. Keep English line length under ~70 characters on desktop. Give Bangla text slightly more line height than English.

Load fonts with `next/font` to avoid layout shift and to keep the initial learning page fast.

### 10.4 Layout rules

- Mobile-first breakpoints: `sm` 640, `md` 768, `lg` 1024, `xl` 1280.
- Learning page: single column on mobile; two columns on desktop (dialogue + secondary panel).
- Touch targets at least 44 × 44 px.
- Sticky bottom audio bar on mobile for the full conversation.
- Use `prefers-reduced-motion` to disable non-essential motion.

### 10.5 Components to build first (Phase 1)

Button, IconButton, Badge (level, style), Card, Tabs, Drawer (grammar), Popover (vocabulary), Toggle (translation), AudioButton, ProgressBar, EmptyState, ErrorState, Skeleton.

### 10.6 Interaction and copy rules

- Button labels use plain verbs: "Play sentence", "Show translation", "See grammar", "Save word".
- Each action keeps the same name across the flow (for example, "Save word" produces "Word saved").
- Error messages say what happened and how to fix it. Empty states invite action.
- Motion only where it answers a user action (opening a drawer, revealing a translation). One page-load moment at most.

---

## 11. Backend and API

### 11.1 Route handlers and server actions

| Area | Examples | Notes |
|---|---|---|
| Content read | `GET /api/categories`, `GET /api/scenarios?…` | Paginated, cached |
| Scenario detail | `GET /api/scenarios/[slug]?version=` | Returns version, lines, translations, audio refs |
| Progress | `POST /api/progress`, `PATCH /api/progress/[id]` | Authenticated |
| Bookmarks | `POST /api/bookmarks`, `DELETE /api/bookmarks/[id]` | Authenticated |
| Vocabulary | `POST /api/vocabulary`, `GET /api/vocabulary` | Authenticated |
| Grammar | `GET /api/grammar?target_type=&target_id=` | Cached |
| Audio | `GET /api/audio/[id]` returns a signed URL | Never expose storage keys |
| Admin content | `/api/admin/*` | Role check on every request |
| AI (Phase 2+) | `POST /api/ai/say-it`, `POST /api/ai/roleplay/turn` | Rate-limited, authenticated |

Validate all input with Zod at the boundary. Return typed errors with stable codes.

### 11.2 Security checklist

- Secrets only in server environment variables; never in client bundles.
- Auth checks on every protected route and API.
- Admin routes protected by role check in middleware and in each handler.
- Rate limits on AI and audio endpoints.
- CSRF protection on state-changing requests (handled by server actions or explicit tokens).
- Input length limits on AI prompts.
- Content Security Policy headers.
- No personal data beyond what the brief requires (brief §13).

---

## 12. NLP Helper Service

Small Python service, deployed separately.

| Endpoint | Input | Output |
|---|---|---|
| `POST /tokenize` | sentence | tokens with character offsets |
| `POST /analyze` | sentence | tokens with lemma, POS, dependency, tense hints |
| `POST /align` | source sentences and translations | alignment check (counts, obvious mismatches) |
| `POST /validate-grammar` | grammar JSON + sentence | confirms POS and subject/verb claims |

Why separate: spaCy is the strongest practical option for English linguistic analysis, and keeping it as its own service avoids forcing it into the Node runtime. Start with analysis at content-save time (not per learner request) to control cost and latency.

---

## 13. Hosting, Infrastructure and Cost Notes

| Component | Starting option | Scale-up option | Cost driver |
|---|---|---|---|
| App hosting | Vercel | Self-hosted Node container | Function time, bandwidth |
| Database | Supabase or Neon Postgres | Dedicated Postgres | Storage, connections |
| Object storage + CDN | Cloudflare R2 | S3 + CloudFront | Storage, egress |
| TTS | Azure or Google TTS | Dedicated voice license | Characters generated (generate once, reuse) |
| LLM | One provider, cheap model for quick tasks | Multi-provider routing | Tokens per feature |
| STT (Phase 3) | Azure Speech or Whisper-class | Streaming STT | Audio minutes |
| Redis | Upstash | Self-hosted | Requests |
| Monitoring | Sentry free tier | Paid tier | Events |

**Cost rule (brief §20):** Generate audio and AI output once, store it, and reuse it. Track usage per feature from day one. Do not enable voice roleplay for all users until per-session cost is measured.

Exact prices change often. Check current provider pricing before committing, and record the estimate in `docs/DECISIONS.md`.

---

## 14. Testing Strategy

| Level | Tool | What to cover |
|---|---|---|
| Schema and validation | Vitest | Zod schemas, content validators, dialogue ordering, translation alignment |
| Components | Vitest + React Testing Library | DialogueLine, TranslationToggle, AudioButton states, GrammarDrawer open/close |
| API | Vitest + test database | Auth checks, admin role checks, progress and bookmark persistence |
| End-to-end | Playwright | Discover → open scenario → switch version → reveal translation → play audio → open grammar → bookmark → complete |
| Accessibility | axe-core in tests, manual keyboard pass | Important controls, focus order, labels |
| Responsive | Playwright with mobile and tablet viewports | Learning page on 375, 768, 1280 widths |
| AI output | Golden-set evaluation | Sample scenarios with expected properties (schema valid, POS matches, no invented facts) |

Brief acceptance criteria (§19) should map directly to Playwright test names so progress is easy to track.

---

## 15. Phased Implementation Plan

Follows brief §18. Do not attempt all phases in one task.

### Phase 0 — Discovery (current step)
- Inspect the workspace (none exists yet based on the brief alone)
- Confirm stack, providers, and hosting
- Write `docs/DECISIONS.md`
- Estimate cost for chosen providers
- **Wait for approval**

### Phase 1 — Core learning platform (smallest sensible MVP)
1. App shell, responsive navigation, theme tokens, font setup
2. Database schema (categories, professions, scenarios, versions, lines, speakers, translations, vocabulary, grammar, audio assets)
3. Seed demo content (clearly labelled as demo)
4. Dashboard (basic)
5. Category and profession discovery
6. Search and filters (Postgres full-text)
7. Scenario detail and learning page
8. Conversation version switch
9. Translation reveal/hide
10. Vocabulary explorer (contextual)
11. Grammar explorer (drawer)
12. Sentence and full-conversation audio (pre-generated assets only; show "not available" when missing)
13. Bookmarks and basic progress
14. Admin foundation (draft and publish, validation)

**Phase 1 may be split further:** Ship discovery and the learning page first with seed content. Add admin and auth after that, if the team prefers.

### Phase 2 — Active learning
- Listening comprehension activities
- Sentence builder
- Speaking practice interface (read aloud, role-play, hide-and-respond)
- AI text roleplay (M8, M9 text)
- Session transcript and feedback summary
- Vocabulary revision

### Phase 3 — Voice and personalisation
- Voice roleplay (STT + TTS loop)
- Pronunciation feedback (with stated limitations)
- Recommendations
- Daily challenge
- Advanced progress analytics

### Phase 4 — Expansion
- More professions and industries
- Additional translation languages (Hindi, Urdu, Arabic, and others)
- Mobile app (React Native or PWA), if approved
- Premium access, if approved

---

## 16. Decisions Needing Your Approval

These must be confirmed before scaffolding (brief §17.1 and §21).

| # | Decision | My recommendation | Question for you |
|---|---|---|---|
| D1 | Frontend framework | Next.js + TypeScript + Tailwind | Approve? |
| D2 | Database and hosting | Supabase or Neon Postgres + Vercel | Preferred? Any budget limit? |
| D3 | Auth | Auth.js or Clerk | Do you want login in Phase 1, or guest mode first? |
| D4 | LLM provider | One provider with a gateway | Do you have an API account or preferred provider? |
| D5 | TTS provider and accents | Azure or Google TTS, US and UK voices | Which accent is the default? Do you need Bangla narration anywhere? |
| D6 | Translation languages at launch | English source + Bangla | Confirm Bangla is the only target in Phase 1. |
| D7 | Content source | AI-drafted, human-reviewed | Who will review English and Bangla content? |
| D8 | Who writes professional scenarios | Subject expert review for legal, medical, finance | Is there a reviewer available? |
| D9 | NLP service | Python FastAPI + spaCy | OK to add a second service, or prefer JS-only? |
| D10 | Design direction | Calm teal-and-paper palette with serif dialogue | Do you want to see a visual mockup first? |

---

## 17. Open Questions

1. Is this a solo build or a team build? (Affects admin and review workflow scope.)
2. Who is the target first user: Bangla-speaking learners, or global English learners?
3. Is the product free, subscription, or freemium? (Affects AI quotas and auth timing.)
4. Do you already have content (scripts, audio, translations), or will content be generated from scratch?
5. Is there an existing brand, logo, or colour preference?
6. Should voice roleplay be in scope for the first public release? (Recommended: no.)

---

## 18. Risks and Mitigations (summary)

| Risk | Mitigation |
|---|---|
| Content volume overwhelms review | Staged rollout: 20–30 quality scenarios before scaling |
| Machine translation errors, especially in Bangla idioms | Native review, glossary, `review_status` field |
| Grammar explanation errors | Schema validation + spaCy cross-check + human review |
| Audio cost growth | Generate once, reuse by hash, monitor characters |
| AI cost in roleplay | Quotas, caching, cheaper model for simple tasks |
| Scope creep | Phase gates; Definition of Done per phase (brief §18) |
| Legal and medical misuse | Disclaimers, expert review, no advice-style output |
| Accessibility gaps | Keyboard and screen reader checks in each phase |
| Provider lock-in | LLM gateway and TTS adapter interfaces |

---

## 19. Immediate Next Steps

1. Review this framework and mark decisions D1–D10.
2. Approve the stack (or request changes).
3. Run Phase 0 discovery in the actual workspace (Antigravity or local).
4. Produce `docs/DECISIONS.md` and an estimated cost sheet.
5. Begin Phase 1 with the app shell, theme tokens, and the database schema.

---

*This framework is a planning document. It should be updated as decisions are made and recorded in `docs/DECISIONS.md`.*
