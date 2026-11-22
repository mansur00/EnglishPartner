/**
 * Voice Roleplay Loop Helpers & Audio Utilities (Milestone 3B)
 * Complies with ECP_Phase_Plan.md §6.1, Audio Voice Guide §10, and Brief §9.
 */

import { z } from "zod";

export type VoiceSpeedSetting = "slow" | "clear" | "normal";

export const VoiceSessionConfigSchema = z.object({
  voiceModeEnabled: z.boolean().default(true),
  speedSetting: z.enum(["slow", "clear", "normal"]).default("clear"),
  autoListenAfterReply: z.boolean().default(true),
});

export type VoiceSessionConfig = z.infer<typeof VoiceSessionConfigSchema>;

/**
 * Maps voice speed setting to Web Speech API playback rate.
 */
export function getVoiceSpeedRate(setting: VoiceSpeedSetting): number {
  switch (setting) {
    case "slow":
      return 0.75;
    case "clear":
      return 0.88;
    case "normal":
      return 1.0;
    default:
      return 0.88;
  }
}

/**
 * Cleans spoken speech transcripts from browser recognition:
 * removes filler stutter artifacts and capitalizes the first letter.
 */
export function cleanSpokenTranscript(raw: string): string {
  if (!raw) return "";

  let cleaned = raw.trim();

  // Remove common speech filler stutters at the very start
  cleaned = cleaned.replace(/^(um|uh|er|ah|like)\s+/i, "");

  // Capitalize first character
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  // Ensure sentence ends with appropriate punctuation if missing
  if (cleaned.length > 0 && !/[.?!]$/.test(cleaned)) {
    // If it starts with question words, append question mark
    if (/^(how|what|where|when|why|who|can|could|would|do|does|is|are)\b/i.test(cleaned)) {
      cleaned += "?";
    } else {
      cleaned += ".";
    }
  }

  return cleaned;
}

/**
 * Formats contextual voice status cue in Bengali for the learner.
 */
export function formatVoiceStatusCue(
  state: "ai_speaking" | "learner_listening" | "awaiting_input" | "error" | "idle",
  aiRoleName: string
): { labelBn: string; hintBn: string } {
  switch (state) {
    case "ai_speaking":
      return {
        labelBn: `${aiRoleName} কথা বলছেন...`,
        hintBn: "মনোযোগ দিয়ে শুনুন এবং উত্তর প্রস্তুত করুন",
      };
    case "learner_listening":
      return {
        labelBn: "আপনার কণ্ঠ শোনা হচ্ছে...",
        hintBn: "স্পষ্ট স্বরে ইংরেজিতে বলুন, শেষ হলে থামুন",
      };
    case "awaiting_input":
      return {
        labelBn: "এবার আপনার উত্তর দিন",
        hintBn: "মাইক বাটনে ট্যাপ করে বলুন অথবা লিখে পাঠান",
      };
    case "error":
      return {
        labelBn: "মাইক্রোফোনে কোনো শব্দ পাওয়া যায়নি",
        hintBn: "আরেকবার বলুন অথবা সরাসরি টেক্সট লিখে পাঠান",
      };
    case "idle":
    default:
      return {
        labelBn: "ভয়েস মোড সক্রিয়",
        hintBn: "পার্টনারের কথা শুনুন এবং ইংরেজিতে উত্তর দিন",
      };
  }
}
