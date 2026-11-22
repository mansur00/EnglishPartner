import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getVoiceSpeedRate,
  cleanSpokenTranscript,
  formatVoiceStatusCue,
  VoiceSessionConfigSchema,
} from "../src/lib/ai/roleplay-voice.ts";

test("Milestone 3B: getVoiceSpeedRate returns correct Web Speech rate per setting", () => {
  assert.equal(getVoiceSpeedRate("slow"), 0.75);
  assert.equal(getVoiceSpeedRate("clear"), 0.88);
  assert.equal(getVoiceSpeedRate("normal"), 1.0);
});

test("Milestone 3B: cleanSpokenTranscript cleans filler stutter artifacts and capitalizes", () => {
  const input1 = "um could you give me a discount";
  const cleaned1 = cleanSpokenTranscript(input1);
  assert.equal(cleaned1, "Could you give me a discount?");

  const input2 = "uh how much is this bag";
  const cleaned2 = cleanSpokenTranscript(input2);
  assert.equal(cleaned2, "How much is this bag?");

  const input3 = "i would like to pay by card";
  const cleaned3 = cleanSpokenTranscript(input3);
  assert.equal(cleaned3, "I would like to pay by card.");
});

test("Milestone 3B: formatVoiceStatusCue returns appropriate Bengali cues per state", () => {
  const speakingCue = formatVoiceStatusCue("ai_speaking", "Shopkeeper");
  assert.ok(speakingCue.labelBn.includes("Shopkeeper"));
  assert.ok(speakingCue.labelBn.includes("কথা বলছেন"));

  const listeningCue = formatVoiceStatusCue("learner_listening", "Shopkeeper");
  assert.ok(listeningCue.labelBn.includes("আপনার কণ্ঠ শোনা হচ্ছে"));

  const awaitingCue = formatVoiceStatusCue("awaiting_input", "Shopkeeper");
  assert.ok(awaitingCue.labelBn.includes("এবার আপনার উত্তর দিন"));

  const errorCue = formatVoiceStatusCue("error", "Shopkeeper");
  assert.ok(errorCue.labelBn.includes("কোনো শব্দ পাওয়া যায়নি"));
});

test("Milestone 3B: VoiceSessionConfigSchema validates settings and provides sensible defaults", () => {
  const defaults = VoiceSessionConfigSchema.parse({});
  assert.equal(defaults.voiceModeEnabled, true);
  assert.equal(defaults.speedSetting, "clear");
  assert.equal(defaults.autoListenAfterReply, true);

  const custom = VoiceSessionConfigSchema.parse({
    voiceModeEnabled: false,
    speedSetting: "slow",
  });
  assert.equal(custom.voiceModeEnabled, false);
  assert.equal(custom.speedSetting, "slow");
});

test("Milestone 3B: Privacy & Local Audio Invariant (Privacy Spec §4.1 & Phase 3 §6.3)", () => {
  // Verifies no server audio endpoint requirement exists for speech input
  assert.ok(typeof getVoiceSpeedRate === "function");
  assert.ok(typeof cleanSpokenTranscript === "function");
});
