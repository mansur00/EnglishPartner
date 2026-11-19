# EnglishPartner: Grammar Color-Coding System Reference Manual

**Authoritative architecture and maintenance guide for the Grammar Color-Coding System (Phase 2).**
Complies strictly with `EnglishPartner_Grammar_ColorCoding_Spec.md` and the Permanent No Hard-Code Design Policy.

---

## 1. System Architecture Overview

The EnglishPartner grammar color-coding system is built on a **data-driven, zero-hard-code** architecture where all category definitions, display names, linguistic rules, tokens, and sources are externalized into registries and data files.

```
┌─────────────────────────────────────────────────────────────┐
│                     Taxonomy Registry                       │
│             src/content/grammar/taxonomy.json               │
│        (130 categories across 5 layers: POS, Roles,         │
│          Verbs/Tenses, Phrases/Clauses, Patterns)           │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐┌──────────────────────────────┐
│  Bilingual Labels & Rules    ││     Design Tokens & CSS      │
│  src/content/grammar/        ││  src/styles/                 │
│  ├── labels.en.json          ││  ├── grammar-tokens.css      │
│  ├── labels.bn.json          ││  └── grammar.css             │
│  ├── rules.en.json           ││  (:root & .dark; WCAG 4.5:1+)│
│  └── rules.bn.json           ││                              │
└──────────────┬───────────────┘└─────────────┬────────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                Annotation & Resolution Pipeline             │
│  services/nlp/annotate.py (spaCy + Deterministic Rules)     │
│  data/grammar/*.json (Committed Precomputed Datasets)       │
│  data/grammar/lists/ (Phrasal verbs, Idioms, Collocations)   │
│  data/grammar/overrides/ (Manual linguistic overrides)      │
│  src/lib/grammar/resolve.ts (Merge overrides + gate conf)   │
│  src/lib/grammar/fallback.ts (Lazy runtime fallback)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 React Components & UI Surfaces              │
│  src/components/grammar/                                    │
│  ├── GrammarText.tsx (Flat token rendering with attributes) │
│  ├── GrammarToggleButton.tsx (44px target, .rainbow-border) │
│  ├── GrammarModeSwitch.tsx (Global all-lines switch)        │
│  ├── GrammarLayerPicker.tsx (Popover for 5 layers)          │
│  ├── GrammarLegend.tsx (Contextual legend & focus mode)     │
│  ├── GrammarSummaryRow.tsx (Summary chips for tenses/voice) │
│  └── RuleCard.tsx (Dialog view with formula & examples)     │
│                                                             │
│  Surfaces: ConversationTurns, Vocabulary, Practice, Admin   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. The 5 Linguistic Layers

1. **Parts of Speech (`pos`):**
   - Text color channel (`var(--gram-pos-<key>-ink)`) and tint backgrounds (`var(--gram-pos-<key>-bg)`).
   - Categories: noun, pronoun, verb, adjective, adverb, preposition, conjunction, determiner, interjection, particle, numeral.
2. **Sentence Roles (`role`):**
   - Non-color geometric channel: background tint + distinct underline geometry.
   - Subject (blue tint + solid line), Verb Phrase (amber tint + double line), Direct Object (green tint + dotted line), Indirect Object (dashed line), Subject/Object Complements (wavy line), Adverbials, Prepositional Objects, Agents, Expletives, Vocatives.
3. **Verbs & Tenses (`tense`):**
   - Top tense bars above verb groups. Time determines hue (`--gram-time-past`, `--gram-time-present`, `--gram-time-future`), aspect determines line pattern (solid for simple, dashed for continuous, double for perfect, dotted for perfect-continuous).
   - Covers all 12 English tenses, passive voice, modal auxiliaries, and non-finite forms (infinitives, gerunds, participles).
4. **Phrases & Clauses (`phrase`):**
   - Outlines and bracket indicators enclosing phrase and clause spans without breaking inline word flow.
   - Subtypes: Noun phrase, verb phrase, prepositional phrase, relative clause, conditional clause, adverbial clause.
5. **Pattern Families (`pattern`):**
   - Distinct colored overlines and summary chips.
   - Families: Conditionals (zero, 1st, 2nd, 3rd, mixed), Passive Voice, Causative (`have`/`get`), Reported Speech (statements, questions, commands), Questions (indirect, tag, subject/object), Comparisons, Existential `there`, Cleft sentences, Polite requests.

---

## 3. How to Add a Category in `taxonomy.json`

To introduce a new grammatical category:

1. **Add the entry to `src/content/grammar/taxonomy.json` under `categories`:**
   ```json
   "my-category": {
     "key": "my-category",
     "layer": "pos",
     "parent": "adjective",
     "level": "advanced",
     "channel": "ink",
     "hasRule": true,
     "i18n": {
       "label": "grammar.category.my_category",
       "desc": "grammar.category.my_category.desc"
     }
   }
   ```
2. **Add English and Bangla display labels:**
   - In `src/content/grammar/labels.en.json`:
     ```json
     "my-category": {
       "name": "My Category",
       "short": "Cat",
       "desc": "Explanation of my category."
     }
     ```
   - In `src/content/grammar/labels.bn.json`:
     ```json
     "my-category": {
       "name": "আমার ক্যাটাগরি (My Category)",
       "short": "ক্যাট",
       "desc": "আমার ক্যাটাগরির বিস্তারিত ব্যাখ্যা।",
       "reviewed": false
     }
     ```
   *(Note: Set `"reviewed": false` so it appears in `npm run grammar:report` for owner review).*
3. **Add semantic tokens in `src/styles/grammar-tokens.css`:**
   - Define ink/line and background tokens under `:root` and `.dark`:
     ```css
     --gram-pos-my-category-ink: #...;
     --gram-pos-my-category-bg: #...;
     ```
4. **Run `npm run grammar:check`:**
   - The build gate validates taxonomy integrity, label parity, and CSS coverage.

---

## 4. How to Add a Rule Card

Rule cards provide in-depth modal explanations when a learner taps a rule chip or inspects a verb/tense/pattern group:

1. **In `src/content/grammar/rules.en.json`:**
   ```json
   "conditional-zero": {
     "key": "conditional-zero",
     "title": "Zero Conditional",
     "formula": "If + present simple, ... present simple",
     "explanation": "Used for universal facts, general truths, and scientific laws.",
     "usage": ["universal truths", "habits", "rules"],
     "examples": [
       { "text": "If you heat ice, it melts.", "note": "Scientific fact" }
     ],
     "commonMistakes": [
       "Using 'will' in the result clause (e.g., 'If it rains, grass will get wet' instead of 'gets wet')."
     ],
     "related": ["conditional-first", "present-simple"]
   }
   ```
2. **In `src/content/grammar/rules.bn.json`:**
   - Provide the textbook Bangla equivalent with formula and examples, and set `"reviewed": false` if pending owner review.
3. **Parity check:**
   - `npm run grammar:check` verifies 1:1 key parity between English and Bangla rule sets.

---

## 5. How to Add an Idiom, Phrasal Verb, or Collocation

The offline annotator loads phrase lists from `data/grammar/lists/` during sentence parsing:

1. **Files in `data/grammar/lists/`:**
   - `phrasal-verbs.json`: List of strings, e.g. `["check in", "pick up", "look forward to", ...]`
   - `idioms.json`: List of strings, e.g. `["piece of cake", "break a leg", ...]`
   - `linking-words.json`: List of strings, e.g. `["however", "therefore", "on the other hand", ...]`
   - `collocations.json`: List of strings, e.g. `["make a decision", "take a look", ...]`
2. **After updating:**
   - Run `python3 services/nlp/annotate.py` or re-generate conversation annotations. The matcher automatically groups multi-word tokens.

---

## 6. How Overrides Work in `data/grammar/overrides/`

When an automated spaCy parse or ambiguous dialogue idiom needs a human-curated correction:

1. Create a JSON file in `data/grammar/overrides/<sourceId>.override.json` (e.g. `data/grammar/overrides/asking-price-product-details.override.json`).
2. Specify the line ID and exact token overrides:
   ```json
   {
     "sourceId": "asking-price-product-details",
     "overrides": {
       "line-3": {
         "tokens": [
           { "index": 2, "pos": "verb", "role": "verb-phrase", "confidence": 1.0 }
         ],
         "groups": [
           {
             "type": "pattern",
             "key": "polite-request",
             "tokens": [0, 1, 2],
             "confidence": 1.0
           }
         ]
       }
     }
   }
   ```
3. `src/lib/grammar/resolve.ts` automatically applies these overrides at runtime over the generated dataset. Overridden lines receive `override: true` and 1.0 confidence.

---

## 7. How to Register a New Grammar Source

The sources registry in `src/lib/grammar/sources.ts` decouples sentence sources from UI rendering:

```typescript
import { sourcesRegistry } from "@/lib/grammar/sources";

sourcesRegistry.register({
  id: "my-practice-set",
  title: "Special Practice Set",
  listSentences: () => {
    return myDataset.map((item) => ({
      id: `practice/${item.id}`,
      text: item.promptText,
      lang: "en",
    }));
  },
});
```

Any registered source can be batch-annotated by the build pipeline or consumed by `useGrammar`.

---

## 8. Verification & Maintenance CLI

1. **`npm run grammar:check` (Authoritative Build Gate):**
   - Validates taxonomy schema, English/Bangla label parity, rule cards parity, and checks all tokens and groups in `data/grammar/*.json`.
   - Wired into `prebuild` in `package.json`: missing or malformed grammar data strictly blocks `npm run build`.
2. **`npm run grammar:report` (Status & Owner Queue):**
   - Prints full metrics on total categories, translation completion, confidence breakdown (high/medium/low), author list entry counts, gold benchmark scores, and outputs the queue of unreviewed Bangla entries for owner review.
3. **`npm run grammar:palette` (WCAG Contrast & CIEDE2000 Validator):**
   - Validates 4.5:1+ contrast on all ink tokens against card surfaces and backgrounds.
   - Validates color-blind distinguishability under normal, protanopia, deuteranopia, and tritanopia simulations.
4. **`npm test` (Unit & Regression Tests):**
   - Runs `tests/grammar-tenses.test.mjs` (12 tenses, passives, inversions, negatives).
   - Runs `tests/grammar-token-mutation.test.mjs` (CSS variable reactivity without hard-coded fallbacks).
   - Runs `tests/grammar-future-content.test.mjs` (future content zero-code acceptance and build gate rejection of invalid categories).
