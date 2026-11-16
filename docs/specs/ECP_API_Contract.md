# English Conversation Partner — API Contract

**Fills gap:** G-03 in `ECP_Review_Report.md`.
**Depends on:** `ECP_System_Framework.md` §11 (route handlers), `ECP_Exercises_SRS_Spec.md`, `ECP_Multi_Language_Strategy.md`, `ECP_Audio_Voice_Guide.md`, DB Architecture (`English_Conversation_Practice_Database_Architecture.md`).
**Status:** Contract for approval. Assumes Next.js route handlers and Zod validation (framework decision D-18 still open until Phase 0 audit).

---

## 1. General Rules

| Rule | Value |
|---|---|
| Base path | `/api/v1` |
| Format | JSON in and out. UTF-8. |
| Dates | ISO 8601 with timezone (`2026-11-16T09:30:00Z`) |
| IDs | UUID strings |
| Language | `lang` query parameter (BCP 47). Falls back to the user's `primary_translation`, then `en`. |
| Auth | Session cookie set by the auth provider. Bearer tokens not used by the web app. |
| Validation | Zod on every request body and query. Invalid input returns `400` with field errors. |
| Versioning | `/v1`. Breaking changes need `/v2`. |
| Content types | Learners get published content only. Admin endpoints return drafts. |
| Caching | Public content: `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400`. Learner data: `private, no-store`. |

---

## 2. Standard Response Shapes

### 2.1 Success

```json
{
  "data": { },
  "meta": { "lang": "bn", "requested_at": "2026-11-16T09:30:00Z" }
}
```

### 2.2 List (paginated)

Cursor pagination. Offset pagination is not used for content lists.

```json
{
  "data": [ ],
  "meta": { "next_cursor": "opaque-string-or-null", "limit": 20 }
}
```

Query: `?limit=20&cursor=...` (limit 1–50, default 20).

### 2.3 Error

```json
{
  "error": {
    "code": "SCENARIO_NOT_FOUND",
    "message": "This conversation could not be found.",
    "details": [ { "field": "slug", "issue": "No published scenario has this slug." } ],
    "request_id": "req_01HX..."
  }
}
```

Rules:
- `message` is plain, learner-friendly English. Translated copy comes from `messages/` on the client by `code`. Server messages are a fallback only.
- Never return stack traces, SQL errors, or provider error text to the client.
- Log the full error server-side with `request_id`.

---

## 3. Error Codes

| HTTP | Code | When |
|---|---|---|
| 400 | `VALIDATION_FAILED` | Body or query fails Zod |
| 401 | `AUTH_REQUIRED` | No session |
| 403 | `FORBIDDEN` | Session exists but role is not allowed |
| 404 | `NOT_FOUND` | Resource missing or not published for learners |
| 409 | `CONFLICT` | Stale write (version mismatch) or duplicate |
| 409 | `STALE_SOURCE` | Translation or audio refers to an old English version |
| 422 | `PUBLISH_BLOCKED` | Publish validation failed; `details` lists each problem |
| 429 | `RATE_LIMITED` | Too many requests; `Retry-After` header set |
| 503 | `PROVIDER_UNAVAILABLE` | AI or TTS provider failed. Client shows the fallback state. |
| 500 | `INTERNAL_ERROR` | Unexpected. Generic message only. |

Admin routes return `404` (not `403`) for drafts when the caller is a learner, so draft existence is not revealed.

---

## 4. Learner Endpoints (public or authenticated)

### 4.1 Categories and professions

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/categories` | Public | Category tree with counts of published scenarios |
| GET | `/categories/{slug}` | Public | Category detail + first page of scenarios |
| GET | `/professions` | Public | Professions with published content |
| GET | `/professions/{slug}` | Public | Profession path with ordered scenarios |

### 4.2 Scenarios

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/scenarios` | Public | Search and filter. See 4.2.1. |
| GET | `/scenarios/{slug}` | Public | Scenario metadata, versions summary, language coverage |
| GET | `/scenarios/{slug}/versions/{versionId}` | Public | Full version: speakers, dialogue lines, translations for `lang`, vocabulary refs, audio refs |
| GET | `/scenarios/{slug}/versions/{versionId}/exercises` | Public for list, auth for progress | Exercise list (no answers) |

#### 4.2.1 Search query parameters

| Param | Type | Notes |
|---|---|---|
| `q` | string, max 120 chars | Matches English and translated titles |
| `category` | slug | Repeatable |
| `profession` | slug | |
| `level` | `A1`–`C2` | Repeatable |
| `length` | `short` \| `medium` \| `long` | |
| `style` | `casual` \| `neutral` \| `formal` | |
| `lang_available` | BCP 47 | Only scenarios with an approved translation in this language |
| `sort` | `relevance` \| `recent` \| `title` | Default `relevance` when `q` is set, else `title` |
| `cursor`, `limit` | | Section 2.2 |

### 4.3 Translations and grammar

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/lines/{lineId}/translations` | Public | Translation(s) with status (`approved`, `stale`, `draft` only for editors) |
| GET | `/grammar` | Public | Query: `dialogue_line_id` or `vocabulary_id`; `lang`; `level`. Returns approved explanations only. |
| GET | `/vocabulary/{id}` | Public | Word detail: lemma, IPA, part of speech, gloss in `lang`, forms (only if applicable) |

### 4.4 Audio

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/audio/{assetId}` | Public | Returns `{ url, duration_ms, status }`. URL is a static CDN URL for published content (no signing needed in MVP). |
| GET | `/versions/{versionId}/audio/{accent}/manifest` | Public | Timing manifest (see Audio Guide §5.2) |

Audio is never proxied through the API. The client loads the file URL directly.

### 4.5 Learner state (authenticated)

| Method | Path | Purpose |
|---|---|---|
| GET | `/me` | Profile and preferences (`ui_locale`, `primary_translation`, `secondary_translation`, `accent`, `learning_level`, `learning_goal`) |
| PATCH | `/me` | Update preferences. Body validated. |
| GET | `/me/progress` | Progress list with optional `scenario` filter |
| PUT | `/me/progress/{versionId}` | Upsert progress: `status`, `last_position` (line sequence number) |
| GET | `/me/bookmarks` | List |
| POST | `/me/bookmarks` | Body: `target_type` (`scenario` \| `vocabulary`), `target_id`. Idempotent. |
| DELETE | `/me/bookmarks/{id}` | |
| GET | `/me/vocabulary` | Saved words. Query: `due=true` for review queue. |
| POST | `/me/vocabulary` | Body: `vocabulary_id`. Idempotent. |
| PATCH | `/me/vocabulary/{id}/review` | Body: `rating` (`again` \| `hard` \| `good` \| `easy`). Runs SM-2 (exercises spec §6). |
| DELETE | `/me/vocabulary/{id}` | |

### 4.6 Practice (authenticated)

| Method | Path | Purpose |
|---|---|---|
| POST | `/practice/sessions` | Body: `exercise_id` or `version_id`, `mode`. Returns session. |
| GET | `/practice/sessions/{id}` | Session with current item and `last_item_position` |
| POST | `/practice/sessions/{id}/answers` | Body: `exercise_item_id`, `learner_answer`, `hint_used`. Returns `is_correct`, `explanation`, `closest_accepted` (sentence builder). |
| POST | `/practice/sessions/{id}/complete` | Marks complete, returns score summary |
| GET | `/me/daily-challenge` | Today's challenge or `null` |

### 4.7 AI features (Phase 2+, authenticated, rate-limited)

| Method | Path | Purpose |
|---|---|---|
| POST | `/ai/say-it` | "What Should I Say?" request. Body: `intent` (max 500 chars), `input_lang` (optional, detected if absent), `output_lang`. Returns options. See AI Prompt Spec §3. |
| POST | `/ai/roleplay/sessions` | Body: `scenario_slug`, `version_id`, `learner_role`, `mode` (`text` \| `voice`). Returns session and AI opening line. |
| POST | `/ai/roleplay/sessions/{id}/turns` | Body: `learner_text` (max 800 chars). Returns AI reply, optional hint, optional correction. |
| POST | `/ai/roleplay/sessions/{id}/end` | Returns feedback (AI Prompt Spec §6) |
| GET | `/ai/roleplay/sessions/{id}` | Transcript and feedback |
| DELETE | `/ai/roleplay/sessions/{id}` | Learner deletes their transcript |

Limits (defaults, owner to confirm):
- Max 20 turns per session.
- Max 5 sessions per learner per day.
- Max 30 "What Should I Say?" requests per learner per day.

Exceeding a limit returns `429` with `RATE_LIMITED`. The UI shows the remaining time, not a generic error.

### 4.8 Recording and speech (Phase 2–3)

Audio recordings stay on the device by default (Audio Guide §9). The API does not accept audio uploads in Phase 2. Phase 3 adds `POST /speech/transcribe` only after the privacy review in the Phase Plan Gate 3.

---

## 5. Admin Endpoints (role-protected)

All admin endpoints require role `admin`, `editor`, `reviewer`, or `translator` (scoped by `language_code`). Checked server-side in each handler (DB §13).

| Method | Path | Role | Purpose |
|---|---|---|---|
| GET | `/admin/scenarios` | editor, reviewer, admin | List incl. drafts. Filter by `status`, `language`, `missing` (asset type). |
| POST | `/admin/scenarios` | editor, admin | Create draft |
| GET | `/admin/scenarios/{id}` | editor, reviewer, admin | Full record incl. drafts |
| PATCH | `/admin/scenarios/{id}` | editor, admin | Update fields. Body includes `expected_updated_at` for optimistic lock. |
| POST | `/admin/scenarios/{id}/transition` | varies | Body: `to` status. Allowed transitions in DB §7. |
| POST | `/admin/scenarios/{id}/publish` | reviewer, admin | Runs validation. Returns `422 PUBLISH_BLOCKED` with details. |
| POST | `/admin/versions` | editor | Create version |
| PATCH | `/admin/versions/{id}` | editor | Update version metadata |
| PUT | `/admin/versions/{id}/lines` | editor | Replace the full ordered line list in one transaction (prevents broken sequences) |
| POST | `/admin/lines/{id}/translations` | translator (for `language_code`), editor | Create or update translation for one language |
| PATCH | `/admin/translations/{id}/review` | reviewer (for `language_code`) | Approve or reject |
| POST | `/admin/vocabulary` | editor | Create word |
| POST | `/admin/vocabulary/{id}/glosses` | translator, editor | Add gloss for a language |
| POST | `/admin/exercises` | editor | Create exercise |
| POST | `/admin/exercises/{id}/items` | editor | Add item (validates `item_data`) |
| POST | `/admin/audio/generate` | editor, admin | Queue generation for a version and accent. Returns job id. |
| GET | `/admin/audio/jobs/{id}` | editor, admin | Job status |
| GET | `/admin/coverage` | editor, reviewer, admin | Scenarios × languages × asset types, with counts |
| GET | `/admin/audit-logs` | admin | Filter by entity and actor |

### 5.1 Concurrency rule

Every admin `PATCH` requires `expected_updated_at`. If the record changed since, return `409 CONFLICT` with the current `updated_at`. The UI asks the editor to reload or merge. This prevents silent overwrites.

### 5.2 Line replacement

`PUT /admin/versions/{id}/lines` takes an ordered array. The server:
1. Validates `sequence_number` is contiguous from 1.
2. Validates every `speaker_id`.
3. Writes in one transaction.
4. Marks translations and audio for changed lines as `stale` (Multi-Language §4.1).

---

## 6. Webhooks and Background Jobs

No external webhooks in MVP. Background jobs (audio generation, translation drafts) run from scripts (Audio Guide §13) or a queue added in Phase 2.

Job record fields: `id`, `type`, `status` (`queued`, `running`, `succeeded`, `failed`), `input_ref`, `started_at`, `finished_at`, `error_code`, `attempts`. Retries: max 3 with backoff.

---

## 7. Rate Limits

| Scope | Limit (starting value) |
|---|---|
| Anonymous read endpoints | 120 requests per minute per IP |
| Authenticated learner | 300 requests per minute |
| Progress and vocabulary writes | 60 per minute per learner |
| AI endpoints | Per-day quotas in §4.7 plus 10 per minute |
| Admin writes | 120 per minute per user |

Implement with Upstash free tier (framework §13) or an in-memory limiter in development. Response headers: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` (IETF draft style).

---

## 8. Security Checklist per Endpoint

- [ ] Auth checked in handler, not only in middleware.
- [ ] Role checked in handler for admin paths.
- [ ] Learner-only data filtered by `user_id` from the session, never from the request body.
- [ ] Draft content never returned to learners.
- [ ] Zod schema for every body and query.
- [ ] Output never contains secrets, provider keys, or internal storage paths. Audio URLs are public CDN URLs for published content only.
- [ ] Error responses use the shape in §2.3.
- [ ] Request size limit: 100 KB for JSON bodies (AI endpoints: 8 KB).

---

## 9. Versioning and Deprecation

- Add optional fields freely. Do not remove or rename fields in `/v1`.
- Deprecated fields are marked in this document with a date and kept for at least one release.
- Client code reads `meta` and `data` only. Unknown fields are ignored.

---

## 10. Open Decisions

| # | Question | Recommendation |
|---|---|---|
| API-1 | Use Next.js route handlers or a separate backend service? | Route handlers in Phase 1. Revisit only if AI or audio jobs grow. |
| API-2 | Auth provider (Auth.js, Clerk, or Supabase Auth) | Decide in Phase 0 (D-18). Session handling depends on it. |
| API-3 | AI daily limits | Start with §4.7 values; owner confirms cost. |
| API-4 | Guest mode before login | **Decided: none in Phase 1 (A-02, 16 Nov 2026).** Write endpoints in §4.5 and §4.6 require auth. Read endpoints (§4.1–§4.4) are public. Unauthenticated call to a write endpoint returns `401 AUTH_REQUIRED`; client shows "Log in to save" prompt (A-01). |
