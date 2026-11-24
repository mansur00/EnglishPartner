"use client";

import {
  AUDIO_PREFS_EVENT,
  AUDIO_STORAGE_KEYS,
  AudioPreferences,
  DEFAULT_AUDIO_PREFERENCES,
  VoiceAccentId,
  VoiceGenderId,
  VoiceToneId,
  getVoiceTone,
  parseSpeedValue,
  resolveSpeechParams,
} from "./voice-model";

export function getAudioPreferences(): AudioPreferences {
  if (typeof window === "undefined") {
    return { ...DEFAULT_AUDIO_PREFERENCES };
  }
  try {
    const accentRaw = localStorage.getItem(AUDIO_STORAGE_KEYS.accent);
    const genderRaw = localStorage.getItem(AUDIO_STORAGE_KEYS.gender);
    const toneRaw = localStorage.getItem(AUDIO_STORAGE_KEYS.tone);
    const speedRaw = localStorage.getItem(AUDIO_STORAGE_KEYS.speed);
    const autoPlayRaw = localStorage.getItem(AUDIO_STORAGE_KEYS.autoPlay);
    const uriRaw = localStorage.getItem(AUDIO_STORAGE_KEYS.preferredVoiceURI);

    const accent: VoiceAccentId =
      accentRaw === "us" || accentRaw === "uk" || accentRaw === "global"
        ? accentRaw
        : DEFAULT_AUDIO_PREFERENCES.accent;

    const gender: VoiceGenderId =
      genderRaw === "auto" || genderRaw === "female" || genderRaw === "male"
        ? genderRaw
        : DEFAULT_AUDIO_PREFERENCES.gender;

    const tone: VoiceToneId =
      toneRaw === "natural" ||
      toneRaw === "warm" ||
      toneRaw === "expressive" ||
      toneRaw === "professional"
        ? toneRaw
        : DEFAULT_AUDIO_PREFERENCES.tone;

    return {
      accent,
      gender,
      tone,
      speed: parseSpeedValue(speedRaw),
      autoPlay:
        autoPlayRaw !== null ? autoPlayRaw === "true" : DEFAULT_AUDIO_PREFERENCES.autoPlay,
      preferredVoiceURI: uriRaw || null,
    };
  } catch {
    return { ...DEFAULT_AUDIO_PREFERENCES };
  }
}

export function saveAudioPreferences(partial: Partial<AudioPreferences>): AudioPreferences {
  const current = getAudioPreferences();
  const next: AudioPreferences = { ...current, ...partial };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(AUDIO_STORAGE_KEYS.accent, next.accent);
      localStorage.setItem(AUDIO_STORAGE_KEYS.gender, next.gender);
      localStorage.setItem(AUDIO_STORAGE_KEYS.tone, next.tone);
      localStorage.setItem(AUDIO_STORAGE_KEYS.speed, `${next.speed}x`);
      localStorage.setItem(AUDIO_STORAGE_KEYS.autoPlay, String(next.autoPlay));
      if (next.preferredVoiceURI) {
        localStorage.setItem(AUDIO_STORAGE_KEYS.preferredVoiceURI, next.preferredVoiceURI);
      } else {
        localStorage.removeItem(AUDIO_STORAGE_KEYS.preferredVoiceURI);
      }
      window.dispatchEvent(new CustomEvent(AUDIO_PREFS_EVENT, { detail: next }));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }
  return next;
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
  speakerGender?: "female" | "male";
  prefsOverride?: Partial<AudioPreferences>;
  cancelPrevious?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

export function stopSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore synthesis cancel errors
    }
  }
}

export function speakText(text: string, options: SpeakOptions = {}): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    options.onError?.();
    return null;
  }

  const trimmed = text.trim();
  if (!trimmed) {
    options.onEnd?.();
    return null;
  }

  if (options.cancelPrevious !== false) {
    window.speechSynthesis.cancel();
  }

  const basePrefs = getAudioPreferences();
  const prefs: AudioPreferences = options.prefsOverride
    ? { ...basePrefs, ...options.prefsOverride }
    : basePrefs;

  const voices = window.speechSynthesis.getVoices();
  const resolved = resolveSpeechParams(voices, prefs, {
    rate: options.rate,
    pitch: options.pitch,
    lang: options.lang,
    speakerGender: options.speakerGender,
  });

  const utterance = new SpeechSynthesisUtterance(trimmed);
  if (resolved.voice) {
    utterance.voice = resolved.voice;
  }
  utterance.lang = resolved.lang;
  utterance.rate = resolved.rate;
  utterance.pitch = resolved.pitch;

  if (options.onStart) utterance.onstart = options.onStart;
  if (options.onEnd) utterance.onend = options.onEnd;
  if (options.onError) utterance.onerror = () => options.onError?.();

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function previewVoiceSettings(
  prefsOverride?: Partial<AudioPreferences>,
  callbacks?: Pick<SpeakOptions, "onStart" | "onEnd" | "onError">
): SpeechSynthesisUtterance | null {
  const prefs = { ...getAudioPreferences(), ...prefsOverride };
  const tone = getVoiceTone(prefs.tone);
  return speakText(tone.sampleLine, {
    prefsOverride: prefs,
    onStart: callbacks?.onStart,
    onEnd: callbacks?.onEnd,
    onError: callbacks?.onError,
  });
}
