# English Conversation Partner — Exercises, Quizzes, Sentence Builder & Review (SRS) Specification

**Fills gap:** G-02 in `ECP_Review_Report.md`.
**Brief sources:** §5.1 Step 7 (Practise), §10.3 (Daily challenge), §10.4 (Listening quiz), §10.5 (Sentence builder), §10.6 (Revision system), §19 (Acceptance criteria).
**Component sources:** Component Library §10.5 (Practice and assessment), §10.7 (ReviewQueue, Flashcard).
**Database sources:** DB Architecture §6.4 (`practice_sessions`), §9 (roleplay extension).
**Status:** Proposal. Table names follow decision D-12 in `ECP_Decisions_Register.md`.

---

## 1. Scope by Phase

| Exercise type | Phase | Needs AI? |
|---|---|---|
| Read aloud, hide one speaker, complete missing line | 1D or 2A | No |
| Listening comprehension quiz | 2A | No |
| Sentence builder (word ordering) | 2B | No |
| Dialogue ordering | 2A | No |
| Flashcard review (saved words, SRS) | 2E | No |
| AI text roleplay | 2D | Yes (see `ECP_AI_Prompt_Spec.md`) |
| Voice roleplay | 3B | Yes, plus speech service |

Phase 1 ships only the practice modes marked "1D or 2A" if the owner moves them earlier. Otherwise Phase 1 has no exercises.

---

## 2. Common Rules for All Exercises

1. Every exercise belongs to one **conversation version** (or one scenario), so content is reusable.
2. Exercises are **data**, not code. An editor creates them in the admin. No exercise text is hardcoded in components.
3. Every question has an explanation the learner sees after answering.
4. Accept **acceptable alternatives**, not one exact string (Component Library §10.5).
5. A wrong answer is never shown as a judgement of the learner. Use "Not quite. The word order here is…".
6. Exercises can be skipped. Progress is saved at the question level.
7. No exercise is published without at least one reviewed answer key.

---

## 3. Tables

### 3.1 `exercises`

| Column | Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | Yes | PK |
| `conversation_version_id` | uuid | Yes | FK. Exercise belongs to one version. |
| `exercise_type` | varchar(40) | Yes | `listening_quiz`, `sentence_builder`, `dialogue_order`, `hide_speaker`, `complete_line`, `read_aloud`, `matching`, `fill_blank`, `multiple_choice` |
| `title` | varchar(160) | Yes | Shown in the practice list |
| `instructions` | text | Yes | Learner-facing instructions, in the UI language of the learner (translated via `messages/` for UI, or via `translations` for content) |
| `display_order` | int | Yes | Default 0 |
| `difficulty` | varchar(10) | No | `easy`, `normal`, `hard` (matches version difficulty) |
| `status` | varchar(20) | Yes | `draft`, `in_review`, `ready_to_publish`, `published`, `archived` (same lifecycle as content) |
| `created_at`, `updated_at` | timestamptz | Yes | |

Constraint: unique (`conversation_version_id`, `display_order`).

### 3.2 `exercise_items`

One question or one prompt inside an exercise.

| Column | Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | Yes | PK |
| `exercise_id` | uuid | Yes | FK |
| `position` | int | Yes | Order within exercise. Unique with `exercise_id`. |
| `dialogue_line_id` | uuid | No | Line the item relates to (for listening, the line to play) |
| `prompt_text` | text | No | English prompt or question |
| `prompt_audio_asset_id` | uuid | No | FK to `audio_assets` (listening items) |
| `item_data` | jsonb | Yes | Shape depends on `exercise_type`; see §4. Validated by Zod on save. |
| `explanation` | text | No | Shown after answering. Required before publish. |
| `created_at`, `updated_at` | timestamptz | Yes | |

### 3.3 `exercise_item_answers`

Accepted answers. Used for checking and for storing alternatives.

| Column | Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | Yes | PK |
| `exercise_item_id` | uuid | Yes | FK |
| `answer_type` | varchar(20) | Yes | `correct`, `acceptable`, `incorrect_with_reason` |
| `answer_text` | text | Yes | Normalised (NFC, trimmed, lowercased for comparison only) |
| `feedback` | text | No | Why this answer is accepted or why it is wrong |
| `created_at` | timestamptz | Yes | |

Rule: at least one `correct` row per item before publish.

### 3.4 `practice_sessions` (extended, DB §6.4)

Add these columns to the existing table from DB Architecture §6.4:

| Column | Type | Notes |
|---|---|---|
| `status` | varchar(20) | `in_progress`, `completed`, `abandoned` |
| `score_correct` | int | Null if not applicable |
| `score_total` | int | Null if not applicable |
| `last_item_position` | int | Resume point |

`mode` values are `listening_quiz`, `sentence_builder`, `dialogue_order`, `hide_speaker`, `complete_line`, `read_aloud`, `roleplay_text`, `roleplay_voice`, `flashcard`.

### 3.5 `practice_answers`

One row per answer given by a learner.

| Column | Type | Required | Notes |
|---|---|---:|---|
| `id` | uuid | Yes | PK |
| `practice_session_id` | uuid | Yes | FK |
| `exercise_item_id` | uuid | Yes | FK |
| `learner_answer` | text | Yes | Exact input as typed or chosen |
| `is_correct` | boolean | Yes | |
| `attempt_number` | int | Yes | Default 1 |
| `hint_used` | boolean | Yes | Default false |
| `answered_at` | timestamptz | Yes | |

Constraint: unique (`practice_session_id`, `exercise_item_id`, `attempt_number`).

### 3.6 `roleplay_messages` and `roleplay_feedback` (Phase 2, DB §9)

Use DB §9 definitions. Two additions:
- `roleplay_messages.practice_session_id` (not `roleplay_session_id`). The session is a `practice_sessions` row with `mode` = `roleplay_text` or `roleplay_voice`.
- `roleplay_feedback.feedback_json` must match the schema in `ECP_AI_Prompt_Spec.md` §3.6 and §6.

Do not create a separate `roleplay_sessions` table (D-12).

---

## 4. `item_data` Shapes

These are the JSON shapes stored in `exercise_items.item_data`. Validate each with a Zod schema in `lib/validation/exercises.ts`.

### 4.1 `multiple_choice` (listening comprehension)

```json
{
  "options": [
    { "id": "a", "text": "The station is across the road." },
    { "id": "b", "text": "The station is closed today." },
    { "id": "c", "text": "The station is far from here." }
  ],
  "correct_option_id": "a",
  "allow_multiple": false
}
```

Rules: 2 to 5 options. Exactly one correct unless `allow_multiple` is true.

### 4.2 `sentence_builder`

```json
{
  "chunks": ["the bus", "stops", "at", "the corner"],
  "shuffle": true,
  "accepted_orders": [
    ["the bus", "stops", "at", "the corner"]
  ],
  "dialogue_line_id": "uuid"
}
```

Rules:
- `accepted_orders` must contain at least one order. Every order must use exactly the same chunks.
- Chunks are word groups, not single letters, except for beginner (A1) items where single words are allowed.
- The check compares the learner's order against each accepted order, after normalising case and punctuation.
- If the learner's order is not accepted, show the closest accepted order and the explanation. Do not mark it wrong without showing why.

### 4.3 `dialogue_order`

```json
{
  "turns": [
    { "dialogue_line_id": "uuid-1", "speaker_id": "uuid" },
    { "dialogue_line_id": "uuid-2", "speaker_id": "uuid" },
    { "dialogue_line_id": "uuid-3", "speaker_id": "uuid" }
  ],
  "shuffle": true
}
```

Rules: `turns` must match the version's `dialogue_lines` in order. Lines are referenced by id, not copied.

### 4.4 `hide_speaker`

```json
{
  "visible_speaker_id": "uuid",
  "hidden_speaker_id": "uuid",
  "reveal_mode": "after_answer"
}
```

Rules: learner speaks or types the hidden speaker's lines. `reveal_mode` is `after_answer` or `on_request`. The hidden line is always available to reveal.

### 4.5 `complete_line`

```json
{
  "dialogue_line_id": "uuid",
  "blanks": [
    { "position": 1, "accepted": ["could", "can"] },
    { "position": 3, "accepted": ["tell", "let"] }
  ],
  "masked_text": "___ you tell me where the ___ is?"
}
```

Rules: `masked_text` is generated from `dialogue_lines.english_text` by replacing the blank words. Editors may override it. Each blank has at least one accepted answer.

### 4.6 `read_aloud`

```json
{
  "dialogue_line_id": "uuid",
  "compare_mode": "self_check"
}
```

Phase 2A: the learner reads aloud and self-checks with the model audio. No automatic scoring. Phase 3 may add speech recognition, under the rules in `ECP_Audio_Voice_Guide.md` §10.

### 4.7 `flashcard` (review of saved words)

Flashcards are not stored per version. They use `vocabulary` and `user_vocabulary` (§6) and the review state below.

---

## 5. Sentence Builder Acceptance Rules

- The learner can drag or tap chunks. Keyboard: arrow keys move, Space picks up, Enter drops.
- The learner can undo the last move.
- The check button is labelled "Check order" (not "Submit").
- Correct: show "Correct" with an icon and text, not only green.
- Incorrect: show which chunk is out of place (highlight the chunk, not the whole row).
- A hint shows the first chunk of an accepted order. Mark `hint_used` in `practice_answers`.

---

## 6. Review System (SRS)

The Component Library has a `ReviewQueue` (§10.7), but DB Architecture has no scheduling fields. This section defines them.

### 6.1 Columns added to `user_vocabulary` (DB §6.2)

| Column | Type | Notes |
|---|---|---|
| `review_stage` | smallint | 0 = new, then increases after each correct recall. Max 8. |
| `ease_factor` | numeric(4,2) | Default 2.50. Min 1.30. Used by SM-2. |
| `interval_days` | int | Days until next review. Default 0. |
| `next_review_at` | timestamptz | When the item appears in the queue. Indexed. |
| `last_reviewed_at` | timestamptz | |
| `lapse_count` | int | Number of times the learner forgot an item. Default 0. |

### 6.2 Algorithm

Use **SM-2** (public domain algorithm, free to implement). The agent implements it as a pure function in `lib/srs/sm2.ts` with unit tests.

Learner rating per card: `again`, `hard`, `good`, `easy`. Map to SM-2 quality 0–5:
- again → 0, hard → 3, good → 4, easy → 5

On each review:
- If quality < 3: `interval_days` = 1, `lapse_count` + 1, `review_stage` = 0.
- Else: `interval_days` = 1 on first success, 6 on second, otherwise round(previous × ease_factor). `review_stage` + 1 (max 8).
- Update `ease_factor` = max(1.30, ease + (0.1 − (5 − q) × (0.08 + (5 − q) × 0.02))).
- `next_review_at` = now + `interval_days`.

### 6.3 Review queue rules

- Queue shows items where `next_review_at` ≤ now, ordered by `next_review_at`, then `review_stage` ascending.
- Daily limit: default 20 new words and 50 reviews. Owner can change it.
- If the learner has no due items, show "Nothing due today" with a link to explore a new conversation. Do not show a red count.
- Missing a day must not reset the queue or show penalty copy (Component Library §10.7).

### 6.4 Storage of review events

Add table `review_events`:

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK |
| `user_vocabulary_id` | uuid | FK |
| `rating` | varchar(10) | `again`, `hard`, `good`, `easy` |
| `reviewed_at` | timestamptz | |

Keep this for analytics only. Retention rules: `ECP_Privacy_Analytics_Retention.md`.

---

## 7. Daily Challenge (Brief §10.3)

| Rule | Value |
|---|---|
| Selection | One scenario per day per learner, chosen by rules: unfinished, matches level, not seen in last 7 days |
| Content | One short version + 3 exercises from that version |
| Table | `daily_challenges`: `id`, `user_id`, `challenge_date` (date), `conversation_version_id`, `status`, `completed_at`. Unique (`user_id`, `challenge_date`). |
| Missed day | No penalty. The challenge expires. A new one is assigned the next day. |
| Copy | "Today's conversation" (not "Daily streak lost") |

---

## 8. Progress Written by Exercises

When a learner completes an exercise:

1. Insert or update the `practice_sessions` row (`status` = `completed`).
2. Update `user_progress` for the version (see DB §6.1): add exercise completion.
3. For new vocabulary used in the exercise, offer "Save word" (never auto-save).
4. Write an analytics event (see `ECP_Privacy_Analytics_Retention.md` §5).

---

## 9. Acceptance Criteria

- [ ] Each exercise type can be created, previewed, and published in admin.
- [ ] Publish is blocked if any item has no `correct` answer or no explanation.
- [ ] Sentence builder accepts two valid orders and rejects an invalid one with a reason.
- [ ] Multiple-choice item shows the explanation after answering.
- [ ] Resuming a session starts at `last_item_position`.
- [ ] SM-2 unit tests cover: first success, second success, failure reset, ease floor at 1.30.
- [ ] Review queue shows "Nothing due today" when empty.
- [ ] Daily challenge is not repeated for the same learner within 7 days.
- [ ] Keyboard can complete every exercise type.
- [ ] No exercise item is shown without a question or prompt.

---

## 10. Open Decisions for Owner

| # | Question | Recommendation |
|---|---|---|
| E-1 | Which exercise types ship in Phase 1? | Only `read_aloud` and `complete_line` (no scoring). Others in Phase 2. |
| E-2 | Are alternatives written by editors or by AI? | Editors write. AI may suggest; a reviewer approves. |
| E-3 | Daily new word limit | 20 new, 50 reviews |
| E-4 | Does the daily challenge count toward progress? | Yes, once per day |
