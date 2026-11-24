/**
 * Global Audio & Voice Model Registry
 * ---------------------------------------------------------------------------
 * Single source of truth for Voice Accents, Genders, Tones, Speeds, and
 * preference persistence. Zero hardcoded speech parameters in UI components.
 */

export type VoiceAccentId = "us" | "uk" | "global";
export type VoiceGenderId = "auto" | "female" | "male";
export type VoiceToneId = "natural" | "warm" | "expressive" | "professional";

export interface VoiceAccentOption {
  id: VoiceAccentId;
  label: string;
  primaryLang: string;
  langPrefixes: string[];
  description: string;
}

export interface VoiceGenderOption {
  id: VoiceGenderId;
  label: string;
  description: string;
  /** Subtle fallback pitch offset if OS only provides one English voice */
  fallbackPitchOffset: number;
}

export interface VoiceToneOption {
  id: VoiceToneId;
  label: string;
  description: string;
  /** Pitch multiplier (Web Speech API range 0.5 - 2.0, default 1.0) */
  pitch: number;
  /** Rate multiplier applied on top of user's playback speed */
  rateMultiplier: number;
  sampleLine: string;
}

export interface AudioPreferences {
  accent: VoiceAccentId;
  gender: VoiceGenderId;
  tone: VoiceToneId;
  speed: number;
  autoPlay: boolean;
  preferredVoiceURI: string | null;
}

export const AUDIO_STORAGE_KEYS = {
  accent: "ecp_voice_accent",
  gender: "ecp_voice_gender",
  tone: "ecp_voice_tone",
  speed: "ecp_audio_speed",
  autoPlay: "ecp_autoplay_audio",
  preferredVoiceURI: "ecp_voice_uri",
} as const;

export const AUDIO_PREFS_EVENT = "ecp_audio_prefs_changed";

export const VOICE_ACCENTS: readonly VoiceAccentOption[] = [
  {
    id: "us",
    label: "US English",
    primaryLang: "en-US",
    langPrefixes: ["en-us", "en_us"],
    description: "American English pronunciation",
  },
  {
    id: "uk",
    label: "UK English",
    primaryLang: "en-GB",
    langPrefixes: ["en-gb", "en_gb"],
    description: "British English pronunciation",
  },
  {
    id: "global",
    label: "Global English",
    primaryLang: "en-US",
    langPrefixes: ["en-au", "en-ca", "en-in", "en-ie", "en-nz", "en-za", "en"],
    description: "International English voices",
  },
] as const;

export const VOICE_GENDERS: readonly VoiceGenderOption[] = [
  {
    id: "auto",
    label: "Balanced (Auto)",
    description: "Adapts naturally to system & dialogue speakers",
    fallbackPitchOffset: 0,
  },
  {
    id: "female",
    label: "Female Voice",
    description: "Clear female vocal timbre",
    fallbackPitchOffset: 0.08,
  },
  {
    id: "male",
    label: "Male Voice",
    description: "Deep male vocal timbre",
    fallbackPitchOffset: -0.12,
  },
] as const;

export const VOICE_TONES: readonly VoiceToneOption[] = [
  {
    id: "natural",
    label: "Natural",
    description: "Balanced everyday conversational delivery",
    pitch: 1.0,
    rateMultiplier: 1.0,
    sampleLine: "Hi there! Let's practice natural everyday English together.",
  },
  {
    id: "warm",
    label: "Warm & Friendly",
    description: "Gentle, approachable, and encouraging tone",
    pitch: 1.05,
    rateMultiplier: 0.96,
    sampleLine: "Welcome! Take your time, you are doing really well today.",
  },
  {
    id: "expressive",
    label: "Energetic & Expressive",
    description: "Lively, engaging, and dynamic intonation",
    pitch: 1.12,
    rateMultiplier: 1.04,
    sampleLine: "That sounds amazing! Let's jump right into the conversation!",
  },
  {
    id: "professional",
    label: "Clear & Professional",
    description: "Crisp, steady, workplace-ready articulation",
    pitch: 0.94,
    rateMultiplier: 0.94,
    sampleLine: "Good morning. Let's review the project timeline and next steps.",
  },
] as const;

export const DEFAULT_AUDIO_PREFERENCES: AudioPreferences = {
  accent: "us",
  gender: "auto",
  tone: "natural",
  speed: 1.0,
  autoPlay: true,
  preferredVoiceURI: null,
};

export function parseSpeedValue(raw: string | number | null | undefined): number {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return clamp(raw, 0.5, 2.0);
  }
  if (typeof raw === "string") {
    const cleaned = raw.replace(/x$/i, "").trim();
    const parsed = Number.parseFloat(cleaned);
    if (Number.isFinite(parsed)) {
      return clamp(parsed, 0.5, 2.0);
    }
  }
  return DEFAULT_AUDIO_PREFERENCES.speed;
}

export function getVoiceAccent(id: string | null | undefined): VoiceAccentOption {
  return VOICE_ACCENTS.find((a) => a.id === id) ?? VOICE_ACCENTS[0];
}

export function getVoiceGender(id: string | null | undefined): VoiceGenderOption {
  return VOICE_GENDERS.find((g) => g.id === id) ?? VOICE_GENDERS[0];
}

export function getVoiceTone(id: string | null | undefined): VoiceToneOption {
  return VOICE_TONES.find((t) => t.id === id) ?? VOICE_TONES[0];
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}

/**
 * Known voice name heuristics across macOS, iOS, Windows, ChromeOS, Android, and Google/Microsoft TTS.
 */
const FEMALE_VOICE_HINTS = [
  "female", "woman", "girl",
  "samantha", "karen", "moira", "tessa", "victoria", "allison", "ava", "susan",
  "kate", "serena", "fiona", "veena", "lekha", "zoe", "nicky", "shelley", "sandy",
  "kathy", "princess", "vicki", "agnes",
  "zira", "aria", "jenny", "michelle", "emma", "libby", "sonia", "natasha", "clara",
  "hazel", "heera", "neerja", "catherine", "linda",
  "google us english", "google uk english female",
];

const MALE_VOICE_HINTS = [
  "male", "man", "boy",
  "daniel", "alex", "oliver", "fred", "ralph", "junior", "aaron", "arthur",
  "tom", "lee", "rishi", "gordon", "rocko", "reed", "eddy", "grandpa", "albert",
  "bruce",
  "david", "mark", "guy", "ryan", "christopher", "eric", "roger", "steffan",
  "george", "william", "liam", "ravi", "prabhat", "sean",
  "google uk english male",
];

export interface VoiceCandidate {
  name: string;
  lang: string;
  voiceURI?: string;
  localService?: boolean;
  default?: boolean;
}

export function inferVoiceGender(voiceName: string): "female" | "male" | "unknown" {
  const lower = voiceName.toLowerCase();
  if (/\bfemale\b/.test(lower)) return "female";
  if (/\bmale\b/.test(lower)) return "male";
  if (FEMALE_VOICE_HINTS.some((h) => new RegExp(`\\b${h}\\b`).test(lower))) return "female";
  if (MALE_VOICE_HINTS.some((h) => new RegExp(`\\b${h}\\b`).test(lower))) return "male";
  return "unknown";
}

export interface SpeechParamsResult<TVoice extends VoiceCandidate = VoiceCandidate> {
  voice: TVoice | null;
  lang: string;
  pitch: number;
  rate: number;
  matchedGender: boolean;
}

/**
 * Pure, deterministic voice & prosody resolver.
 * Works both in browser (with SpeechSynthesisVoice[]) and in Node unit tests.
 */
export function resolveSpeechParams<TVoice extends VoiceCandidate>(
  voices: readonly TVoice[],
  prefs: AudioPreferences,
  overrides?: {
    rate?: number;
    pitch?: number;
    lang?: string;
    speakerGender?: "female" | "male";
  }
): SpeechParamsResult<TVoice> {
  const accentOpt = getVoiceAccent(prefs.accent);
  const toneOpt = getVoiceTone(prefs.tone);

  const targetGender: VoiceGenderId =
    prefs.gender !== "auto"
      ? prefs.gender
      : overrides?.speakerGender ?? "auto";

  const targetLang = overrides?.lang || accentOpt.primaryLang;

  // Score available voices
  let bestVoice: TVoice | null = null;
  let bestScore = -1;
  let matchedGender = targetGender === "auto";

  const englishVoices = voices.filter((v) =>
    v.lang.toLowerCase().startsWith("en")
  );

  for (const voice of englishVoices) {
    let score = 0;
    const vLang = voice.lang.toLowerCase();

    // Accent match
    if (accentOpt.langPrefixes.some((p) => vLang.startsWith(p))) {
      score += 50;
    } else if (vLang.startsWith("en")) {
      score += 10;
    }

    // Explicit user voice URI override
    if (prefs.preferredVoiceURI && voice.voiceURI === prefs.preferredVoiceURI) {
      score += 200;
    }

    // Gender match
    const inferred = inferVoiceGender(voice.name);
    if (targetGender === "female" || targetGender === "male") {
      if (inferred === targetGender) {
        score += 80;
      } else if (inferred === "unknown") {
        score += 5;
      } else {
        score -= 40;
      }
    }

    // Prefer natural/enhanced/premium/Google/Apple voices slightly over robotic ones
    const lowerName = voice.name.toLowerCase();
    if (
      lowerName.includes("natural") ||
      lowerName.includes("enhanced") ||
      lowerName.includes("premium") ||
      lowerName.includes("neural") ||
      lowerName.includes("google")
    ) {
      score += 15;
    }

    if (voice.default) {
      score += 2;
    }

    if (score > bestScore) {
      bestScore = score;
      bestVoice = voice;
    }
  }

  if (bestVoice && (targetGender === "female" || targetGender === "male")) {
    matchedGender = inferVoiceGender(bestVoice.name) === targetGender;
  }

  // Compute prosody (pitch + rate)
  const baseSpeed = overrides?.rate ?? prefs.speed;
  const effectiveRate = clamp(baseSpeed * toneOpt.rateMultiplier, 0.5, 2.0);

  // If user requested male/female but OS didn't have a matching gendered voice,
  // apply subtle pitch offset so the difference is still audible.
  const genderFallbackOffset =
    !matchedGender && (targetGender === "female" || targetGender === "male")
      ? getVoiceGender(targetGender).fallbackPitchOffset
      : 0;

  const basePitch = overrides?.pitch ?? toneOpt.pitch;
  const effectivePitch = clamp(basePitch + genderFallbackOffset, 0.5, 2.0);

  return {
    voice: bestVoice,
    lang: bestVoice?.lang || targetLang,
    pitch: Number(effectivePitch.toFixed(2)),
    rate: Number(effectiveRate.toFixed(2)),
    matchedGender,
  };
}
