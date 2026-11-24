import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  VOICE_ACCENTS,
  VOICE_GENDERS,
  VOICE_TONES,
  DEFAULT_AUDIO_PREFERENCES,
  inferVoiceGender,
  parseSpeedValue,
  resolveSpeechParams,
} from "../src/lib/audio/voice-model.ts";

const MOCK_VOICES = [
  { name: "Samantha", lang: "en-US", voiceURI: "com.apple.voice.Samantha", default: true },
  { name: "Daniel", lang: "en-GB", voiceURI: "com.apple.voice.Daniel" },
  { name: "Aaron", lang: "en-US", voiceURI: "com.apple.voice.Aaron" },
  { name: "Google UK English Female", lang: "en-GB", voiceURI: "Google UK English Female" },
  { name: "Google UK English Male", lang: "en-GB", voiceURI: "Google UK English Male" },
  { name: "Karen", lang: "en-AU", voiceURI: "com.apple.voice.Karen" },
];

test("Global Voice Model: registries have expected accents, genders, and 4 tones", () => {
  assert.equal(VOICE_ACCENTS.length, 3);
  assert.equal(VOICE_GENDERS.length, 3);
  assert.equal(VOICE_TONES.length, 4);

  for (const tone of VOICE_TONES) {
    assert.ok(tone.pitch >= 0.5 && tone.pitch <= 2.0, `Tone ${tone.id} pitch in bounds`);
    assert.ok(
      tone.rateMultiplier >= 0.5 && tone.rateMultiplier <= 2.0,
      `Tone ${tone.id} rateMultiplier in bounds`
    );
    assert.ok(tone.sampleLine.length > 10, `Tone ${tone.id} has sample line`);
  }
});

test("Global Voice Model: inferVoiceGender classifies common system voices", () => {
  assert.equal(inferVoiceGender("Samantha"), "female");
  assert.equal(inferVoiceGender("Google UK English Female"), "female");
  assert.equal(inferVoiceGender("Daniel"), "male");
  assert.equal(inferVoiceGender("Google UK English Male"), "male");
  assert.equal(inferVoiceGender("Microsoft David - English"), "male");
  assert.equal(inferVoiceGender("Microsoft Aria Online (Natural)"), "female");
});

test("Global Voice Model: resolveSpeechParams selects matching accent + gender voice", () => {
  const usMale = resolveSpeechParams(MOCK_VOICES, {
    ...DEFAULT_AUDIO_PREFERENCES,
    accent: "us",
    gender: "male",
    tone: "professional",
  });
  assert.equal(usMale.voice?.name, "Aaron");
  assert.equal(usMale.matchedGender, true);
  assert.equal(usMale.pitch, 0.94);
  assert.equal(usMale.rate, 0.94);

  const ukFemale = resolveSpeechParams(MOCK_VOICES, {
    ...DEFAULT_AUDIO_PREFERENCES,
    accent: "uk",
    gender: "female",
    tone: "warm",
    speed: 1.0,
  });
  assert.equal(ukFemale.voice?.name, "Google UK English Female");
  assert.equal(ukFemale.matchedGender, true);
  assert.equal(ukFemale.pitch, 1.05);
  assert.equal(ukFemale.rate, 0.96);
});

test("Global Voice Model: applies fallback pitch offset when no matching gendered voice exists", () => {
  const singleVoice = [{ name: "Generic Voice", lang: "en-US" }];
  const maleRes = resolveSpeechParams(singleVoice, {
    ...DEFAULT_AUDIO_PREFERENCES,
    gender: "male",
    tone: "natural",
  });
  assert.equal(maleRes.matchedGender, false);
  assert.equal(maleRes.pitch, 0.88);

  const femaleRes = resolveSpeechParams(singleVoice, {
    ...DEFAULT_AUDIO_PREFERENCES,
    gender: "female",
    tone: "natural",
  });
  assert.equal(femaleRes.matchedGender, false);
  assert.equal(femaleRes.pitch, 1.08);
});

test("Global Voice Model: parseSpeedValue handles string and number inputs safely", () => {
  assert.equal(parseSpeedValue("0.75x"), 0.75);
  assert.equal(parseSpeedValue("1.25x"), 1.25);
  assert.equal(parseSpeedValue(1.5), 1.5);
  assert.equal(parseSpeedValue("invalid"), 1.0);
  assert.equal(parseSpeedValue(5.0), 2.0);
});

test("Global Voice Model: no component bypasses speech-engine with raw SpeechSynthesisUtterance", () => {
  const srcRoot = path.resolve(process.cwd(), "src");
  const violations = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(ts|tsx)$/.test(entry.name)) {
        const rel = path.relative(srcRoot, full).replace(/\\/g, "/");
        if (rel === "lib/audio/speech-engine.ts") continue;
        const content = fs.readFileSync(full, "utf8");
        if (content.includes("SpeechSynthesisUtterance")) {
          violations.push(rel);
        }
      }
    }
  }

  walk(srcRoot);
  assert.deepEqual(violations, [], `Found raw SpeechSynthesisUtterance outside speech-engine: ${violations.join(", ")}`);
});
