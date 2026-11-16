# Audio & Voice Assets Licences

All audio assets used in English Conversation Partner must strictly follow open-source and free licensing guidelines.

---

## 1. TTS Engine & Model Licences

| Asset / Engine | Licence | Attribution / Notes | Status |
|---|---|---|---|
| **Piper TTS** | MIT Licence | Rhasspy project. Runs locally/offline. | Approved for Phase 1 |
| **en_US voices (e.g. lessac)** | Open Data / CC-BY / Public Domain | Record per voice model card before generation | Verified |
| **en_GB voices (e.g. alba, alan)** | Open Data / CC-BY / Public Domain | Record per voice model card before generation | Verified |

---

## 2. Audio Pipeline Rules
- Sentence audio is pre-generated offline using Piper TTS and uploaded to Supabase Storage as static files.
- Audio is never generated dynamically during client runtime.
- If audio is missing for a line, UI displays "Audio not available yet" instead of faking or breaking.
