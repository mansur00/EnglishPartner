# English Conversation Partner — Multi-Language Strategy

**Companion to:** `ECP_System_Framework.md` and `English_Conversation_Partner_Project_Brief.md` (§7 Translation System, §8 Audio, §17.3 Internationalisation)
**Purpose:** Make sure multiple languages are supported from the first line of code, so that adding a language later means adding data, not rewriting the product.
**Status:** Proposal, pending approval.

---

## 1. The Core Problem

"Multi-language" is not one feature. It is at least nine separate axes, and each one can break the product if it is treated as an afterthought.

| # | Axis | Example | If ignored, this breaks... |
|---|---|---|---|
| 1 | **UI language** | Buttons, menus, errors say "Save", "Log in" | Whole interface is English-only for Bangla users |
| 2 | **Source (learning) language** | Dialogue written in English | Hardcoded English assumptions in code |
| 3 | **Translation language** | Bangla, later Hindi, Arabic | One translation per line becomes impossible |
| 4 | **Explanation language** | Grammar note in Bangla vs Hindi | Grammar text becomes unreadable for others |
| 5 | **Audio language and voice** | English TTS vs Bangla narration | Wrong voice reads wrong language |
| 6 | **Script, font, direction** | Bangla, Devanagari, Arabic (RTL) | Broken glyphs, reversed layout |
| 7 | **Locale formats** | Dates, numbers, currency, numerals | Confusing prices and dates |
| 8 | **Search and input** | Search in Bangla, typing in Banglish | Learner cannot find content |
| 9 | **Content coverage and fallback** | Line exists in English, not in Bangla | Blank screens or broken layout |

This document defines a decision for each axis, then the data model, UI, AI, audio, search, admin, and testing rules that follow.

---

## 2. Decisions Summary

| Decision | Choice |
|---|---|
| Learning (source) language | **English only** for the MVP. Stored as a field (`source_language = 'en'`) from day one, so it is not hardcoded. |
| Translation languages at launch | **Bangla (`bn`)** as primary. Schema supports any number. |
| Language codes | **BCP 47** tags: `en`, `en-US`, `en-GB`, `bn`, `hi`, `ar`, and so on. Stored lowercase in the DB. |
| Source of truth | **English** text always. Every other language is derived from it and can become stale. |
| Fallback chain | User's primary → user's secondary → English. English is never removed. |
| UI strings | Externalised into locale files (`messages/en.json`, `messages/bn.json`). No hardcoded UI text in components. |
| Adding a language | Add a row in `languages`, add a locale file, add fonts, generate and review translations. No code change. |
| Who can translate | Editors per language. A language is "published" only after its reviewer signs off. |

---

## 3. Language Registry (single source of truth)

Do not hardcode language lists anywhere. Use one table and one TypeScript config generated from it.

### 3.1 Table: `languages`

| Column | Type | Example (bn) | Notes |
|---|---|---|---|
| `code` | text, PK | `bn` | BCP 47, lowercase |
| `name_english` | text | `Bangla` | For admin UI |
| `name_native` | text | `বাংলা` | Shown to the learner in the picker |
| `script` | text | `Bengali` | ISO 15924 name |
| `direction` | enum | `ltr` | `ltr` or `rtl` |
| `font_family` | text | `Noto Sans Bengali` | Key used by the font loader |
| `role` | enum | `source`, `translation`, `ui` | `source` for English; others are translation/ui |
| `status` | enum | `planned`, `beta`, `available`, `retired` | Controls whether learners see it |
| `tts_supported` | bool | `false` for now | Whether we generate audio in this language |
| `review_required` | bool | `true` | Whether content must be reviewed before publish |
| `plural_rules` | text | `one-other` | Used by the i18n library |
| `display_order` | int | `2` | Order in the picker |

### 3.2 Generated TypeScript config

```ts
// lib/i18n/languages.ts — conceptual, generated from the DB at build time
export type LanguageCode = "en" | "bn" | "hi" | "ar" | "ur"; // extend by registry

export interface LanguageConfig {
  code: LanguageCode;
  nameNative: string;
  direction: "ltr" | "rtl";
  fontFamily: string;
  status: "planned" | "beta" | "available" | "retired";
  ttsSupported: boolean;
}
```

Rule: a language with `status = planned` never appears in the learner's picker, even if its translations exist.

---

## 4. Data Model Changes

These changes update the entity list in §7 and §15 of the framework file.

### 4.1 Translations are per language, per source version

```
translations
  id
  source_type          -- 'dialogue_line' | 'scenario' | 'vocabulary' | 'expression' ...
  source_id
  source_version       -- increments when the English source changes
  language_code        -- FK → languages.code
  translated_text
  translation_method   -- 'human' | 'llm' | 'mt_api' | 'imported'
  model_name           -- which model produced it, if any
  prompt_version
  review_status        -- 'draft' | 'in_review' | 'approved' | 'stale'
  reviewed_by
  reviewed_at

  UNIQUE (source_type, source_id, language_code, source_version)
```

**Key rule — stale translations:** When an English line changes, its `source_version` increases. Existing Bangla translations are then marked `stale` automatically. Learners see the old approved text with a "may be outdated" note, not a silent mismatch. This is the main protection against translations drifting from the English they describe.

### 4.2 Grammar and vocabulary are language-specific

Grammar explanations and word glosses depend on the explanation language, so they cannot be one shared record.

```
grammar_explanations
  id, target_type, target_id
  explanation_language   -- the language the explanation is written in
  level
  content                -- structured JSON (English-neutral parts + localized text)
  status
  UNIQUE (target_type, target_id, explanation_language, level)

vocabulary
  id, lemma, part_of_speech          -- language-neutral (English headword)
  pronunciation                      -- IPA, shared across explanation languages

vocabulary_glosses
  vocabulary_id
  language_code
  gloss                              -- meaning in that language
  general_definition
  UNIQUE (vocabulary_id, language_code)

dialogue_vocabulary
  dialogue_line_id, vocabulary_id
  language_code                      -- contextual meaning per language
  contextual_meaning
  UNIQUE (dialogue_line_id, vocabulary_id, language_code)
```

Shared, language-neutral data: IPA, part of speech, lemma, grammar structure. Localised data: glosses, explanations, contextual meanings, UI text.

### 4.3 Audio is tied to a language and a voice

```
audio_assets
  id, source_type, source_id
  language_code          -- the language being spoken
  voice_id
  accent                 -- 'en-US' | 'en-GB' | null (only for English)
  audio_url, duration, status
  source_hash            -- text + voice + speed hash, for reuse
  UNIQUE (source_hash)
```

Rule: the voice's language must match the text's language. A Bangla sentence must never be sent to an English voice.

### 4.4 User preferences

```
users
  ui_locale              -- 'bn' | 'en' (interface language)
  primary_translation    -- e.g. 'bn'
  secondary_translation  -- optional, e.g. 'en' explanations, or null
  accent                 -- 'en-US' | 'en-GB'
  learning_language      -- 'en' (fixed for MVP, stored for future use)
```

Keep `ui_locale` and `primary_translation` separate. A learner may use the Bangla interface but still want English explanations, or the reverse.

---

## 5. Interface Localisation (UI strings)

### 5.1 Library

Use **next-intl** (fits the Next.js App Router, supports server components, ICU plurals) or **react-i18next** if the team already knows it.

### 5.2 File layout

```
messages/
├─ en.json          -- source for UI strings (English is the reference)
├─ bn.json
└─ (future) hi.json, ar.json
```

### 5.3 Rules

- Components use keys only: `t("learning.showTranslation")`, never `"Show translation"` written directly in JSX.
- Use ICU message format for plurals and variables: `"{count, plural, one {# word saved} other {# words saved}}"`. Bangla and English plural rules differ, so do not concatenate strings.
- Keys describe the meaning ("learning.saveWord"), not the English text, so translators can change wording without breaking code.
- Missing UI key → falls back to English and logs a warning in development. Never shows the raw key to learners.
- Run a CI check that fails if a key exists in `en.json` but is missing from another locale above a threshold (for example, 100% for `bn` before release).

### 5.4 Button and copy consistency across languages

The naming rule from the design guidance still applies in every language: the button label, the toast, and the screen title must use the same verb. Keep a small glossary in `messages/glossary.md` so "Save word" is "শব্দ সংরক্ষণ করুন" everywhere, not three different Bangla phrases.

---

## 6. Content Localisation and Fallback

### 6.1 Fallback chain

For any piece of learner-facing text, resolve in this order:

1. User's `primary_translation`, if status is `approved`
2. User's `primary_translation`, if status is `stale` (show with a note)
3. User's `secondary_translation`, if available
4. English source (always available; it is the source)

Never show a blank area. Never hide the English sentence.

### 6.2 Visual signals (not colour alone)

| State | Learner sees |
|---|---|
| Approved translation | Translation text, no label |
| Stale translation | Translation with a small label "Translation may be outdated" |
| Missing translation | English line, with "Bangla translation coming soon" in muted text |
| Missing audio | Audio button disabled with text "Audio not available yet" |
| Missing grammar | "Grammar note not available for this sentence" |

### 6.3 Coverage per scenario

Each scenario shows which languages it has, on the card and detail page:

```
Languages: English ✓   Bangla ✓   Hindi —
```

Use text plus a symbol, not colour alone. Filter in Explore: "Show only scenarios with Bangla translation".

### 6.4 Partial publishing

A scenario may be published in English-only. It appears to learners with the Bangla option hidden or marked "Coming soon". The admin decides whether a language must be complete before publication, per language.

---

## 7. Language Selection UX

### 7.1 First-run (onboarding)

1. Ask: "Which language should we use for explanations?" with native names: **বাংলা**, **English**. Show options as buttons, not a dropdown with flags.
2. Pre-select based on browser language, but always let the user confirm. Do not auto-switch silently.
3. Ask UI language separately only if different from the explanation language, or default them together and let the user change later.

### 7.2 Settings

- Interface language (dropdown with native names)
- Primary translation language
- Secondary translation (optional)
- English accent (American, British)
- Playback speed default

### 7.3 During learning

- A small language switch in the dialogue header ("Translation: বাংলা ▾")
- Changing language updates translations on the page without reloading and without losing playback position or scroll position
- Changing the setting here updates the user's preference, with a clear confirmation the first time

### 7.4 Input language

The learner may type a question or intent in Bangla, English, or Banglish (Bangla written in Latin letters, for example "ami manager ke bolte chai").

- "What Should I Say?" accepts any supported input language and detects it
- Output always includes English options first, then the translation in the learner's primary language
- Banglish is supported as input in a later phase, using a romanisation mapping; in MVP, show a clear message if the input is not understood, rather than guessing

### 7.5 Mixed-language content

Translation rows are aligned sentence by sentence. The UI must never mix one line of Bangla with a different line of English. Alignment is checked when the translation is saved (see §9.3).

---

## 8. Scripts, Fonts, and Direction

### 8.1 Font strategy

| Script | Font (example) | Load strategy |
|---|---|---|
| Latin (English) | Literata / Figtree (from framework) | Always loaded |
| Bengali | Noto Sans Bengali | Loaded only when `bn` is the user's language |
| Devanagari (Hindi) | Noto Sans Devanagari | Loaded when `hi` enabled |
| Arabic / Urdu | Noto Naskh Arabic / Noto Sans Arabic | Loaded when `ar`/`ur` enabled |
| IPA symbols | Noto Sans | Always loaded for pronunciation |

Use `next/font` with `subsets` and `display: "swap"`. Do not bundle every script for every user; this keeps the initial learning page fast (brief §17.4).

### 8.2 Setting the language on the page

```html
<html lang="bn" dir="ltr">   <!-- set from the user's ui_locale -->
```

- Set `lang` on the root element and on any element that contains text in a different language. This helps screen readers pick the right voice and pronunciation.
- Set `dir="rtl"` for Arabic and Urdu, and let the layout flip.

### 8.3 Layout rules (apply from day one)

- Use **logical CSS properties** and Tailwind logical utilities: `ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`. Avoid `ml-*`, `pl-*`, `text-left` for layout. This makes RTL a configuration change, not a rewrite.
- Use Tailwind's `rtl:` and `ltr:` variants only for real exceptions, such as directional icons.
- Mirror arrows and "next" icons for RTL. Do not mirror audio controls, play icons, or the logo.
- Bangla and Hindi often need more vertical space than English. Use `leading-relaxed` for those scripts. Do not use fixed heights on text containers.
- Expect text expansion: German and some other languages can run about 30 percent longer than English. Bangla can be longer too. Test with pseudo-locale (see §12).
- Do not truncate dialogue lines with ellipsis. Let them wrap.

### 8.4 Unicode and input

- Normalise user input and stored text to **NFC** before saving and comparing.
- Do not strip zero-width joiner (ZWJ) or zero-width non-joiner (ZWNJ) characters from Bangla or Hindi text; they control how letters join.
- Store all text as UTF-8 in PostgreSQL. Use a collation that handles Unicode properly for sorting and search.
- Sort lists by the user's locale (`Intl.Collator(locale)`), not by raw code points.

---

## 9. AI and Translation Pipeline

### 9.1 Parameterise every AI call by language

Every LLM prompt for translation, glosses, grammar, or "What Should I Say?" receives:

```
source_language:   en
target_language:   bn
target_script:     Bengali
register:          casual | neutral | formal
glossary:          terms for this language and domain
```

Prompts live in `content/prompts/` with versions, as in the framework file. Each prompt has a version for each supported language, or one prompt with explicit target language parameters.

### 9.2 Output must be in the right language

LLMs sometimes answer in the wrong language or mix scripts. Add a check after every generation:

- Script check: for `bn`, at least X% of letters must be Bengali script (Unicode block U+0980–U+09FF). For `hi`, Devanagari (U+0900–U+097F). For `ar`/`ur`, Arabic script blocks.
- Length check: translation length should be within a reasonable ratio of the source (for example 0.5x to 2.0x). Outside the range, flag for review.
- Alignment check: number of translated lines equals number of source lines.
- Failed checks are stored as `draft` with a warning, never auto-approved.

### 9.3 Glossary per language

Keep a glossary table so that important terms are consistent across scenarios:

```
glossary_terms
  id, language_code, domain           -- 'general', 'legal', 'medical', 'banking'...
  source_term                         -- 'deadline'
  target_term                         -- 'সময়সীমা'
  note
  UNIQUE (language_code, domain, source_term)
```

Professional scenarios (legal, medical) need domain glossaries reviewed by a specialist.

### 9.4 Cache keys include the language

```
cache_key = sha256(source_text + source_language + target_language + model + prompt_version + glossary_version)
```

Without the target language in the key, a Bangla result could be served to a Hindi learner.

### 9.5 Cost planning per language

Each new language roughly multiplies generation cost (translation, glosses, grammar, and any audio). Record estimated cost per language in `docs/DECISIONS.md` before enabling it.

---

## 10. Audio and Language

| Situation | Decision |
|---|---|
| English dialogue audio | Yes, with en-US and en-GB voices |
| Bangla translation read aloud | **Not in MVP.** Learners read Bangla; English is what they practise. Revisit in Phase 3 if asked. |
| Bangla pronunciation help for English words | Optional later feature; keep English audio as the reference |
| Hindi, Arabic narration | Only after TTS quality is verified for that language and content is reviewed |

Rule: the `voice_id` must belong to the `language_code` of the text. Enforce this in the TTS adapter, not only in the admin UI.

---

## 11. Search and Discovery Across Languages

### 11.1 What learners search for

- English scenario titles and phrases ("at the airport")
- Bangla phrases ("এয়ারপোর্টে")
- Intent sentences in any supported language ("I need to tell my manager I need two more days")
- Profession names in English and Bangla

### 11.2 Implementation

| Need | Approach |
|---|---|
| English full-text search | PostgreSQL `tsvector` with the `english` configuration |
| Bangla search | PostgreSQL has no built-in Bangla text-search config. Use the `simple` configuration on a per-language `tsvector` column, plus `pg_trgm` trigram index for partial matches |
| Search in translated titles and descriptions | Index title and description translations in the same search table, tagged with `language_code` |
| Synonyms and transliteration | Synonym table per language (for example "এয়ারপোর্ট" ↔ "airport"), maintained by editors |
| Natural-language intent search | Later phase, using embeddings (pgvector) that are multilingual |

Keep a `search_documents` table, rebuilt when content is published:

```
search_documents
  id, source_type, source_id
  language_code, field          -- 'title', 'description', 'situation'
  text
  tsv                           -- generated tsvector
  INDEX (tsv), INDEX gin_trgm (text)
```

### 11.3 Result display

Search results show the title in the user's primary language when available, with English below it. Matching works across both.

---

## 12. Testing Strategy for Languages

| Test | Purpose |
|---|---|
| **Pseudo-locale** (for example, inflate strings by 30% and wrap with markers) | Finds layout breakage from text expansion |
| **RTL pseudo-locale** | Checks mirroring of layout before Arabic or Urdu is added |
| **Missing translation** | Every fallback state renders without error or blank space |
| **Stale translation** | Stale label appears and English change triggers stale status |
| **Language switch** | Switching during learning keeps playback and scroll position |
| **Font rendering** | Screenshot test for Bangla, Hindi, Arabic samples on key pages |
| **Script validation** | Unit tests for the script check on LLM outputs |
| **Search per language** | Bangla and English queries return the same scenario |
| **Locale sorting** | Lists sort correctly per locale |
| **Accessibility** | `lang` attribute is correct on every language switch; screen reader reads the translation in the right language |
| **Coverage report** | CI reports missing translation counts per language |

Add these to the Playwright suite from the framework file (§14). Map them to brief §19 acceptance criteria under "Quality".

---

## 13. Admin Workflow for Languages

### 13.1 Roles

| Role | Can do |
|---|---|
| Editor (English) | Create and edit English source content |
| Translator (per language) | Create and edit translations for assigned languages |
| Reviewer (per language) | Approve or reject translations; sign off on language publication |
| Admin | Manage languages registry, publish, archive |

Access control is per language: a Bangla translator cannot approve Hindi content.

### 13.2 Dashboard

- Coverage table: scenarios × languages, with counts of approved, draft, stale, missing
- Queue of stale translations, sorted by age
- Queue of failed AI checks (script, length, alignment)
- Filter by language, domain, and status

### 13.3 Adding a new language (checklist)

1. Add row in `languages` with `status = planned`
2. Add `messages/<code>.json` (copy structure from `en.json`)
3. Add font subset and verify rendering with the font test page
4. Add glossary entries for general and key domains
5. Add reviewer(s) for that language
6. Generate translations (AI draft), run automated checks
7. Human review to target coverage (for example, 100% of the first 20 scenarios)
8. Run pseudo-locale and language tests
9. Change status to `beta`, then `available`
10. Record cost and decision in `docs/DECISIONS.md`

This checklist is what makes "add a language" a process rather than a refactor.

---

## 14. Dates, Numbers, and Currency

- Use the built-in `Intl` API for all formatting: `Intl.DateTimeFormat(locale)`, `Intl.NumberFormat(locale)`.
- Numerals: follow the user's locale by default. Offer an option for Bengali numerals (০১২৩) in Bangla UI. Do not convert numbers inside English dialogue.
- **Currency in scenarios is cultural content, not just formatting.** A shopping dialogue that says "$20" is English practice material and should keep its currency, with a translation that explains it. For Bangla translations, the translator may localise the example to "৳২০০" only if the English source is marked as adaptable. Record this choice per scenario as `localisation_mode: 'translate' | 'adapt'`.
- Never convert currency automatically. Exchange rates change, and a conversion error teaches a wrong example.

---

## 15. Phased Rollout

Matches brief §18. Multi-language is designed in Phase 0 and Phase 1; new languages come later.

| Phase | Language scope |
|---|---|
| **Phase 0** | Language registry, BCP 47 codes, locale file structure, font plan, decision on fallback |
| **Phase 1** | English source, **Bangla** translation and UI, fallback chain, language switcher, per-language translations table, search for both languages |
| **Phase 2** | Glosses and grammar in Bangla, "What Should I Say?" in Bangla input, glossary for key professional domains |
| **Phase 3** | Additional translation languages (for example Hindi), Banglish input |
| **Phase 4** | Arabic / Urdu with RTL verified, more languages, learning languages other than English (only if approved) |

**Phase 1 already includes:** language registry, translation table with language and source version, UI i18n, font loading per script, logical CSS properties, fallback chain, and language switch. Missing these in Phase 1 would make Phase 3 expensive.

---

## 16. Adding Multi-Language Support: What Changes in the Framework File

Apply these updates to `ECP_System_Framework.md`:

| Section | Update |
|---|---|
| §4 AI and Model Layer | Add `target_language` to every prompt; add script and length checks |
| §7 Data Model | Replace `translations` with the per-language, per-version version above; add `languages`, `vocabulary_glosses`, `glossary_terms`, `search_documents`; add `language_code` to `grammar_explanations` and `audio_assets` |
| §9 Frontend | Add `messages/`, `lib/i18n/`, `next/font` subsets, `lang` and `dir` on root |
| §10 Tailwind | Require logical properties (`ms-*`, `start-*`); add script-specific line-height rules |
| §11 Backend | Add language parameter to content and search endpoints; `Accept-Language` as fallback for first visit only |
| §14 Testing | Add pseudo-locale, RTL, fallback, and per-language search tests |
| §16 Decisions | Add D11: Phase 1 language list (en source + bn). Add D12: translation review owners. Add D13: Currency localisation policy |

---

## 17. Decisions Needing Your Approval

| # | Decision | Recommendation |
|---|---|---|
| L1 | Learning language for MVP | English only; store the field for future use |
| L2 | Phase 1 languages | English source + Bangla translation and UI |
| L3 | Second translation in Phase 1 | Optional; allowed by schema, not required in UI |
| L4 | Bangla TTS in Phase 1 | No. English audio only. |
| L5 | Banglish input | Phase 3. In MVP, show a clear message rather than guessing. |
| L6 | Bangla reviewer | Confirm who reviews Bangla translations and professional glossary terms |
| L7 | Currency policy | Keep source currency in English dialogue; translator may adapt only where marked |
| L8 | RTL timing | Build logical CSS now; verify RTL in Phase 4 |

---

## 18. Common Mistakes to Avoid

1. Hardcoding `bn` or `en` in components or SQL. Read from the `languages` registry.
2. Storing one translation per line with no language or version field. Changes to English will silently break alignment.
3. Using `left`, `right`, `ml-*`, `pl-*` for layout. This makes RTL very expensive later.
4. Using one font for every script, or loading every script for every user.
5. Concatenating translated strings in code. Use ICU message format.
6. Sending a Bangla sentence to an English voice, or the reverse.
7. Caching AI output without the target language in the cache key.
8. Auto-approving LLM translations.
9. Converting currency or units automatically inside English practice dialogue.
10. Saying "multi-language supported" when only one language has real content. Show coverage honestly.

---

## 19. Summary

Multi-language is safe to build in from the start if these five things are true:

1. **English is the source, and every other language is derived and versioned.**
2. **Languages are data (a registry), not code.**
3. **Every translation, gloss, explanation, and audio file carries its language code.**
4. **Fallback always ends in English, so the learner is never left with a blank screen.**
5. **Layout, fonts, and prompts are language-aware from Phase 1.**

Phase 1 can ship with only Bangla as a second language, while the structure is ready for many more.

---

*Update this document when a new language is added, and record the decision in `docs/DECISIONS.md`.*
