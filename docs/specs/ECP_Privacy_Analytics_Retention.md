# English Conversation Partner — Privacy, Data Retention & Analytics Specification

**Fills gap:** G-06 in `ECP_Review_Report.md`.
**Brief sources:** §13 ("Do not collect personal data that is not required"), §9.4 (voice and transcripts), §20 (risk 6).
**Database sources:** DB Architecture §3.7, §9 (privacy requirements), §14 (retention "must not be invented during implementation").
**Status:** Draft for owner decision and **legal review**. This document is a product specification, not legal advice. The owner must confirm which data protection laws apply based on where the product is offered and where the company is registered.

---

## 1. Principles

1. **Collect the minimum.** Store only what a feature needs (brief §13).
2. **Tell the learner.** Every data type is described in plain language on the Privacy page.
3. **Default to not storing voice.** Recordings and transcripts are local or deleted unless the learner chooses to keep them.
4. **Learner controls their data.** Export and delete are available from Settings.
5. **No training on learner data.** Learner text, voice, and transcripts are not used to train any model. Check each AI provider's terms and choose settings that prevent training use.
6. **No selling, no ads.** Learner data is not sold or used for advertising.
7. **Analytics are about the product, not the person.** Aggregate where possible.

---

## 2. Data Inventory

| Data | Why it is needed | Stored where | Who can see it | Default retention |
|---|---|---|---|---|
| Account identifier and email (or auth provider reference) | Sign-in | Auth provider (preferred) | Learner, admin for support | Until account deletion |
| Display name | Greeting, profile | DB `users` | Learner; admin for support | Until account deletion |
| Preferences (UI language, translation language, accent, level, goal, daily target) | Personalise the learning page | DB `users` | Learner | Until account deletion |
| Progress, bookmarks, saved words | Core feature | DB | Learner | Until account deletion |
| Review events (SRS) | Scheduling | DB `review_events` | Learner | 12 months, then aggregated |
| Practice answers | Feedback, resume | DB `practice_answers` | Learner | 12 months after last activity |
| "What Should I Say?" requests | Feature output | Not stored unless saved | Learner | Not stored |
| Roleplay transcript (text) | Replay and feedback | DB `roleplay_messages` | Learner | 90 days after session, or on delete |
| Roleplay feedback | Learning summary | DB `roleplay_feedback` | Learner | Same as transcript |
| Voice recording (Phase 2) | Compare with model audio | **Device only** (IndexedDB) | Learner | Until learner deletes; never uploaded by default |
| Voice transcript (Phase 3) | Roleplay turn | DB, if the learner saves the session | Learner | Same as roleplay transcript |
| Technical logs (IP address, request ID, errors) | Security and fixing bugs | Hosting provider logs | Admin | 30 days, then deleted |
| Analytics events (§5) | Product improvement | Analytics store (free tier) | Owner | 13 months raw, then aggregate only |

Data never collected: government ID, financial card numbers, precise location, contacts, device identifiers beyond what the hosting provider logs.

---

## 3. Consent and Notices

| Moment | Notice or consent | Type |
|---|---|---|
| Sign-up | Terms of use and Privacy notice link. Checkbox is not pre-ticked. | Consent to terms |
| Sign-up | Optional: "Help improve the product with anonymous usage data" | Opt-in, default off |
| First microphone use (Phase 2–3) | Explain what is recorded, where it is stored, and how to delete it. Ask at the moment of use, not at sign-up. | Permission + notice |
| First AI roleplay | "Your messages are sent to an AI service to create replies. They are not used to train AI models. You can delete this session at any time." | Notice before first use |
| Saving a voice session | Explicit "Save this session" action. Default is not saved. | Opt-in |
| Analytics opt-out | Settings toggle takes effect immediately; stops new events | Opt-out |

Rules:
- Consent is never a condition for basic learning content (browsing and listening to published content works without analytics opt-in).
- Withdrawing consent stops future collection and does not delete existing learning progress unless the learner asks.

---

## 4. Retention and Deletion

### 4.1 Retention rules (starting values; owner to confirm)

| Category | Rule |
|---|---|
| Account data | Deleted within 30 days of an account deletion request |
| Progress and vocabulary | Deleted with the account |
| Roleplay transcripts | Auto-deleted 90 days after session end |
| Practice answers | Auto-deleted 12 months after last activity |
| Review events | Aggregated after 12 months (keep counts, drop per-user rows) |
| Technical logs | 30 days |
| Raw analytics | 13 months, then aggregate |
| Device recordings | Until learner deletes or clears site data |

A scheduled job (`scripts/privacy/retention.py` or a database job) enforces these rules and writes a log entry with counts, not contents.

### 4.2 Learner deletion

Settings → Privacy → "Delete my account".

Steps:
1. Confirm with the learner (type a word or click twice). Explain what is deleted.
2. Revoke sessions.
3. Delete learner rows: progress, bookmarks, vocabulary, practice, roleplay, daily challenges, preferences.
4. Delete the auth identity via the auth provider's API.
5. Send confirmation (email if an address exists) with the date the deletion completes.
6. Keep only: anonymous aggregate counts and the deletion timestamp (no user ID).

### 4.3 Learner export

Settings → Privacy → "Download my data". Returns a JSON file: profile, progress, bookmarks, vocabulary, practice history, roleplay transcripts (if stored). Excludes other users' data. Rate-limited to once per 24 hours.

### 4.4 Device data

Voice recordings in IndexedDB can be deleted from the Privacy page. The app also offers "Clear all local recordings". The app cannot delete a recording from a learner's backup; the Privacy page says so.

---

## 5. Analytics Events

Use a small, fixed set. Owner adds events only through a change to this document.

### 5.1 Event format

```json
{
  "event": "conversation_opened",
  "ts": "2026-11-16T09:30:00Z",
  "session_id": "random-per-tab-id",
  "user_ref": "hashed-user-id-or-null",
  "props": { "scenario_slug": "return-a-damaged-item", "version": "short", "ui_lang": "bn" }
}
```

Rules:
- `user_ref` is a salted hash, rotated monthly. Used only for funnels, not for identity.
- No free text in `props`. No learner messages, no transcripts, no search query text (search queries logged as length and result count only).
- No IP address stored in analytics.
- If the learner has opted out, do not send events.

### 5.2 Event list

| Event | Props | Purpose |
|---|---|---|
| `page_viewed` | `route_group` (public, app, admin) | Traffic |
| `search_performed` | `query_length`, `result_count`, `lang` | Search quality |
| `scenario_opened` | `scenario_slug`, `source` (explore, dashboard, search, professional) | Discovery |
| `conversation_version_selected` | `length`, `style`, `level` | Version demand |
| `translation_toggled` | `action` (show, hide, show_all, hide_all), `lang` | Feature use |
| `audio_played` | `type` (line, full), `accent`, `speed` | Audio demand |
| `audio_failed` | `type`, `error_code` | Audio quality |
| `grammar_opened` | `level_of_detail` (sentence, word) | Grammar demand |
| `word_saved` | `source` (popover, grammar) | Vocabulary use |
| `conversation_completed` | `scenario_slug`, `version`, `duration_seconds` | Completion |
| `exercise_completed` | `exercise_type`, `correct_count`, `total_count` | Practice quality |
| `review_session_completed` | `item_count`, `again_count` | SRS health |
| `ai_feature_used` | `feature` (say_it, roleplay), `status` (ok, fallback, limited) | AI cost and quality |
| `error_shown` | `code`, `area` | Bug triage |

Duration fields are rounded to 10 seconds. Counts are integers.

### 5.3 Dashboards for owner

- Completion rate per scenario.
- Audio failure rate per asset type.
- Search queries with zero results (aggregated by length only; use the content plan to act).
- AI fallback rate and limit hits.

No per-learner dashboard for the owner in MVP.

### 5.4 Tooling

Free options (Phase Plan §6.1, §3E): PostHog free tier (self-host or cloud) or a Postgres table with a daily aggregation job. Choose by Phase 3 gate. Whichever is chosen must support the opt-out and retention rules above.

---

## 6. Privacy Page Content (outline)

The owner writes the final text and gets it reviewed. Required sections:

1. Who we are and how to contact us (owner to fill in).
2. What data we collect (table in §2, in plain language).
3. Why we collect it.
4. How long we keep it (§4.1).
5. Third parties: auth provider, hosting, database, audio storage, AI provider (when chosen), analytics tool (when chosen). For each: what data they receive and their role.
6. AI features: what is sent to the AI service and that it is not used to train models (after checking provider terms).
7. Voice: what happens to recordings and transcripts.
8. Your choices: export, delete, opt out of analytics, withdraw consent.
9. Children: the product is for adult learners unless the owner decides otherwise. If younger learners are allowed, a separate review is required before launch.
10. Changes to this policy: how learners are told.

---

## 7. Security Requirements for Personal Data

| Requirement | Detail |
|---|---|
| Encryption in transit | HTTPS everywhere |
| Encryption at rest | Enabled by hosting provider (verify on setup) |
| Access | Least privilege for database and storage keys; no production keys in client code |
| Admin access to learner data | Support access logged in `content_audit_logs` (or `support_access_logs`); reason required |
| Backups | Encrypted; deletion requests include backups within the backup retention window (state the window in the Privacy page) |
| Incident response | Owner decides a breach response plan before launch; the agent logs incidents in `docs/INCIDENTS.md` |
| Dependency and secret scanning | CI step (free tier of GitHub secret scanning or equivalent) |

---

## 8. Testing Checklist

- [ ] Analytics events are not sent when opt-out is on.
- [ ] No learner text appears in any analytics event (automated test on event schema).
- [ ] Account deletion removes all learner rows (integration test).
- [ ] Export contains only the requesting learner's data.
- [ ] Retention job deletes expired roleplay transcripts in a test database.
- [ ] Device recordings can be deleted from the Privacy page (Playwright test).
- [ ] Learner text is not present in server logs (grep test on log output in CI).
- [ ] Privacy page renders in English and Bangla with all sections in §6.

---

## 9. Open Decisions for Owner

| # | Decision | Recommendation |
|---|---|---|
| P-1 | Jurisdiction and governing law | Owner decides with legal advice |
| P-2 | Minimum age for learners | 16+ (adults only in MVP), confirm |
| P-3 | Retention values in §4.1 | Accept starting values; review after 6 months |
| P-4 | Analytics tool | Decide at Phase 3 gate |
| P-5 | Support contact method | Owner decides (email, form) |
| P-6 | Whether email is collected at all (if auth provider is passwordless or social) | Collect only if needed for account recovery and deletion confirmation |
| P-7 | AI provider data settings | Confirm no-training option on chosen provider before Phase 2 |
