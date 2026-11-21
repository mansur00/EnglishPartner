# English Conversation Partner — Gemini 3.8 TTS Implementation Spec

**Status:** Proposal for owner approval as amendment **A-11**. Nothing in this document is in production until A-11 is signed.
**Read with:** `ECP_Audio_Voice_Guide.md` (v2) §2.1, §3, §4, §5, §17; `ECP_Decisions_Register.md` §5; `ECP_Privacy_Analytics_Retention.md` §2, §5.
**Scope:** Replaces Piper as the **generator** only for lines the owner chooses. The pipeline, storage, checks, manifest, and player stay the same.

---

## 1. Decision Required: Amendment A-11

Audio Guide A1 says Piper is primary and paid TTS needs approval. Gemini 3.8 TTS is not free in the same sense as Piper, so it needs its own row.

| Field | Proposed text |
|---|---|
| ID | A-11 |
| Topic | Gemini 3.8 Flash TTS as an offline audio provider |
| Decision | Allowed for **scripted content only** (dialogue lines, word lists, test sentences). Never used for learner text, transcripts, or roleplay. Runs only in the offline pipeline, never in a learner request. Piper stays as fallback. |
| Model | Start with `gemini-3.8-flash-tts`. Compare with `gemini-3.8-flash-lite-tts` on cost before bulk generation. |
| Conditions | (a) Free-tier data policy checked: the free tier currently states "used to improve our products". Use a paid tier for production generation, or confirm the policy in writing. (b) Terms for generated audio checked and recorded in `AUDIO_LICENSES.md`. (c) Preview status accepted: generated files are stored, so the product does not depend on the API being available. (d) Cost recorded per generation run. |
| Affects | Audio Guide §2.1, §16; Cost sheet (Phase 0 task 0.12) |
| Status | Proposed. Owner signs. |

Owner decision: ☐ Approved for production  ☐ Approved for voice test only  ☐ Rejected

---

## 2. Architecture

```
dialogue_lines (scripted English + speaker + style)
   │
   ▼
TTS adapter (interface)            ← same for every provider
   ├── PiperProvider       (existing, free, offline)
   └── GeminiProvider      (new, Gemini 3.8 TTS, offline pipeline only)
   │
   ▼
WAV bytes → FFmpeg loudnorm → MP3 → storage → audio_assets row
   │
   ▼
Quality checks → manifest assembly → player (unchanged)
```

Rules:
- The provider is chosen **per asset** from `voices.json`, not hardcoded.
- Learners never trigger a provider call. Audio is generated in advance and served as files.
- A provider can be removed without changing the product; existing assets keep working.

---

## 3. Configuration

### 3.1 `content/audio/voices.json` (added entries)

```json
{
  "config_version": 2,
  "voices": [
    {
      "voice_key": "gemini:en-US:Kore",
      "provider": "gemini",
      "model": "gemini-3.8-flash-tts",
      "provider_voice_id": "Kore",
      "language_code": "en",
      "accent": "en-US",
      "style_default": "neutral and polite",
      "status": "approved",
      "licence": "CHECK_GEMINI_TERMS_DATE"
    },
    {
      "voice_key": "gemini:en-GB:Puck",
      "provider": "gemini",
      "model": "gemini-3.8-flash-tts",
      "provider_voice_id": "Puck",
      "language_code": "en",
      "accent": "en-GB",
      "style_default": "calm and friendly",
      "status": "candidate",
      "licence": "CHECK_GEMINI_TERMS_DATE"
    }
  ]
}
```

Voice names above are examples from the official docs. The agent lists the available voices from the current docs and runs the voice test in §6 before setting any voice to `approved`. Accent is a label for the voice's style, not a guaranteed accent; confirm by listening.

### 3.2 Environment

```bash
# .env.local (never committed)
GEMINI_API_KEY=...
```

Install: `pip install "google-genai>=2.25.0"` (the version the docs require for `interaction.output_audio`).

---

## 4. Provider Code

`scripts/audio/providers/gemini_provider.py`:

```python
import base64
from google import genai

PIPELINE_VERSION = 1  # bump when audio processing changes

class GeminiProvider:
    name = "gemini"

    def __init__(self, model: str = "gemini-3.8-flash-tts"):
        self.model = model
        self.client = genai.Client()  # reads GEMINI_API_KEY from environment

    def synthesize(self, text: str, voice_id: str, style: str) -> bytes:
        """Return WAV bytes for one verbatim transcript line."""
        interaction = self.client.interactions.create(
            model=self.model,
            input=[{
                "type": "user_input",
                "content": [{
                    "type": "text",
                    "text": text,  # verbatim transcript only
                    "annotations": [{"type": "speech_metadata", "style": style}],
                }],
            }],
            response_format={"type": "audio"},
            generation_config={"speech_config": [{"voice": voice_id}]},
        )
        audio = interaction.output_audio  # last audio block
        if audio is None or not audio.data:
            raise RuntimeError("Gemini TTS returned no audio")
        return base64.b64decode(audio.data)  # WAV (audio/wav) by default
```

Rules in this code:
- `text` is the verbatim English line. Style goes in `speech_metadata`, never inside the text (for example, not "Say cheerfully: Hello"). Gemini 3.8 may read such directions aloud.
- The function returns bytes. It does not write to the database. The pipeline does that.
- No API key appears in code.

### 4.1 Hash and reuse (same rule as Audio Guide §4.3)

```python
import hashlib

def source_hash(text, provider, model, voice_id, style, pipeline_version):
    key = "|".join([text, provider, model, voice_id, style, str(pipeline_version)])
    return hashlib.sha256(key.encode("utf-8")).hexdigest()
```

If an `audio_assets` row with this hash and `status = ready` exists, skip the call. Changing the model, voice, style, or text creates a new hash.

### 4.2 Generation step (one line)

```python
import subprocess, pathlib

def generate_line(provider, line, voice, out_dir):
    h = source_hash(line.tts_text or line.english_text, provider.name,
                    provider.model, voice["provider_voice_id"],
                    voice["style_default"] if not line.style else line.style,
                    PIPELINE_VERSION)
    wav = pathlib.Path(out_dir) / f"{h}.wav"
    mp3 = pathlib.Path(out_dir) / f"{h}.mp3"
    if mp3.exists():
        return h, mp3
    wav.write_bytes(provider.synthesize(line.tts_text or line.english_text,
                                        voice["provider_voice_id"],
                                        line.style or voice["style_default"]))
    # loudness normalise and encode (Audio Guide §4.5)
    subprocess.run(["ffmpeg", "-y", "-i", str(wav),
                    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
                    "-ac", "1", "-ar", "44100",
                    "-codec:a", "libmp3lame", "-b:a", "96k", str(mp3)], check=True)
    return h, mp3
```

After this step, run the existing `check_asset.py` (Audio Guide §4.6). A failed check sets `status = failed`; the line is not published with a bad asset.

### 4.3 Storing the result

Write one `audio_assets` row with `provider = 'gemini'`, `provider_voice_id`, `source_hash`, `storage_key`, `duration_ms`, `byte_size`, `licence`, and `pipeline_version`. The existing timing-manifest assembly (`assemble_full.py`) works unchanged, because it reads durations from the MP3 files.

---

## 5. Compliance Rules (must hold for every run)

| Rule | How it is enforced |
|---|---|
| Scripted text only | The generator reads `dialogue_lines` and `vocabulary` only. No code path reads `roleplay_messages`, `practice_answers`, or any learner table. A test asserts this. |
| No learner data in the request | Test: a grep over the provider module for learner table names returns nothing. |
| Pinned model | The model string is in `voices.json`, not in the code path. Changing it creates new hashes. |
| Logged usage | Each run writes a row to `logs/audio/gemini_runs.jsonl`: date, model, line count, characters, failures. Used for the cost sheet. |
| Fallback | If the Gemini call fails three times for a line, the pipeline tries the Piper voice for that line only if the owner allowed mixed providers, otherwise it marks the line `failed`. |
| No runtime calls | The API route and player have no import of the Gemini provider. A test checks the import graph. |

---

## 6. Voice Test (before any production run)

1. Take `content/audio/test_sentences.txt` (ten sentences, Audio Guide §3.3).
2. For each candidate voice (at least three from the official list), generate every sentence with the same style.
3. Generate the same ten sentences with the approved Piper voice for comparison.
4. Reviewer scores each voice 1–5 on clarity, naturalness, pacing, and names and numbers. Record scores in `docs/VOICE_TEST.md`.
5. Set `status: approved` only for voices that score at least 4 on average and at least 4 on names and numbers.
6. Record the date, model, and cost of the test run in the cost sheet.

Also test the **model choice**: generate the same set with `gemini-3.8-flash-tts` and `gemini-3.8-flash-lite-tts`. If Lite is close in quality, use Lite for bulk content (it is positioned for high-volume work).

---

## 7. Tests

| Test | Type | Expected |
|---|---|---|
| `source_hash` stable for same input; changes when model, voice, style, or text changes | Unit | Pass |
| Provider returns bytes when `output_audio` is present; raises when empty | Unit (mock client) | Pass |
| Provider rejects text containing a style prefix such as "Say cheerfully:" | Unit | Fail with clear error (add this check) |
| Generation skips when hash exists | Integration | No API call (mock counts calls) |
| Generated MP3 passes `check_asset.py` | Integration | Pass |
| Learner tables not referenced in provider or generation modules | Static check in CI | No match |
| API routes do not import the provider | Static check in CI | No match |
| Full assembly works with Gemini-generated lines | Integration | Manifest times match durations |

---

## 8. Cost and Limits Control

| Item | Rule |
|---|---|
| Estimate before a run | Characters × lines; compare with the free-tier or paid-tier limit on the provider's pricing page on the same day |
| Record | Date, model, lines, characters, cost, and the page used |
| Re-generation | Only when the hash changes. Never regenerate "to be safe". |
| Storage | Same budget as Audio Guide §18 (about 200–300 MB for 100 conversations in two accents) |
| Stop rule | If a run exceeds the estimate by 20%, stop and report to the owner |

Pricing and free-tier terms change. The agent must check them on the day and write the date. This spec does not state prices.

---

## 9. Steps for the Agent

1. Owner signs A-11 (§1) with the scope chosen: production or voice test only.
2. Install `google-genai>=2.25.0`; add `GEMINI_API_KEY` to `.env.local`.
3. Write `gemini_provider.py` (§4) and its unit tests (§7).
4. Add Gemini voice entries to `voices.json` as `candidate`.
5. Run the voice test (§6). Owner listens and approves voices.
6. Run `generate_version.py` with the Gemini provider on demo content only.
7. Run `check_asset.py` and `assemble_full.py`. Listen to the full audio.
8. Record usage and cost in `docs/DECISIONS.md` and `docs/AUDIO_LICENSES.md`.
9. Report to the owner. Production generation starts only after the owner approves the report.

---

## 10. Open Items

| # | Item | Owner or agent |
|---|---|---|
| G-1 | Owner decides A-11 scope (production or voice test) | Owner |
| G-2 | Paid tier or free tier for production generation (data policy, §1) | Owner |
| G-3 | Voice list from the current docs; choose three candidates | Agent |
| G-4 | Terms for generated audio (ownership and use) | Agent records; owner checks |
| G-5 | Pricing and free-tier limits on the test day | Agent |
