import type { ScenarioItem } from "../../content/seed/scenarios.ts";
import type { ConversationVersionData } from "../../content/seed/dialogues.ts";

export interface ValidationIssue {
  type: "error" | "warning";
  code: string;
  field: string;
  message: string;
  messageBn: string;
}

export interface PublishValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

/**
 * Validates a Scenario and its Conversation Versions before publishing.
 * Enforces DB §5.1 & Brief §14.3 strict publishing constraints.
 */
export function validateForPublish(
  scenario: Partial<ScenarioItem>,
  version?: ConversationVersionData
): PublishValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  // 1. Scenario Metadata Checks
  if (!scenario.title || scenario.title.trim().length < 3) {
    errors.push({
      type: "error",
      code: "SCENARIO_TITLE_MISSING",
      field: "title",
      message: "English scenario title is required (minimum 3 characters).",
      messageBn: "ইংরেজি শিরোনাম দেওয়া আবশ্যক (কমপক্ষে ৩ অক্ষর)।",
    });
  }

  if (!scenario.titleBn || scenario.titleBn.trim().length < 3) {
    errors.push({
      type: "error",
      code: "SCENARIO_TITLE_BN_MISSING",
      field: "titleBn",
      message: "Bengali scenario title is required.",
      messageBn: "বাংলা শিরোনাম দেওয়া আবশ্যক।",
    });
  }

  if (!scenario.slug || !/^[a-z0-9-]+$/.test(scenario.slug)) {
    errors.push({
      type: "error",
      code: "SCENARIO_SLUG_INVALID",
      field: "slug",
      message: "Valid URL slug (lowercase alphanumeric and hyphens) is required.",
      messageBn: "সঠিক URL স্লাগ আবশ্যক।",
    });
  }

  if (!scenario.categories || scenario.categories.length === 0) {
    errors.push({
      type: "error",
      code: "CATEGORY_MISSING",
      field: "categories",
      message: "At least one category must be assigned to the scenario.",
      messageBn: "কমপক্ষে একটি ক্যাটাগরি যুক্ত করতে হবে।",
    });
  }

  if (!scenario.learningObjective || scenario.learningObjective.trim().length < 10) {
    warnings.push({
      type: "warning",
      code: "LEARNING_OBJECTIVE_SHORT",
      field: "learningObjective",
      message: "Learning objective is very brief. Consider making it actionable.",
      messageBn: "শেখার উদ্দেশ্যটি আরও সুস্পষ্ট ও বিস্তারিত হওয়া উচিত।",
    });
  }

  // 2. Conversation Dialogue Checks (if version is provided)
  if (version) {
    if (!version.speakers || version.speakers.length < 2) {
      errors.push({
        type: "error",
        code: "SPEAKERS_INSUFFICIENT",
        field: "speakers",
        message: "A conversation must have at least 2 distinct speakers.",
        messageBn: "কথোপকথনে কমপক্ষে দুইজন স্বতন্ত্র বক্তা থাকতে হবে।",
      });
    }

    if (!version.lines || version.lines.length === 0) {
      errors.push({
        type: "error",
        code: "LINES_EMPTY",
        field: "lines",
        message: "Conversation version contains zero dialogue lines.",
        messageBn: "কথোপকথনে কোনো বাক্য নেই।",
      });
    } else {
      const speakerIds = new Set((version.speakers || []).map((s) => s.id));

      // Sequence Continuity & Content Check
      version.lines.forEach((line, index) => {
        const expectedSequence = index + 1;
        if (line.sequenceNumber !== expectedSequence) {
          errors.push({
            type: "error",
            code: "SEQUENCE_GAP",
            field: `lines[${index}].sequenceNumber`,
            message: `Line sequence gap detected: expected #${expectedSequence}, found #${line.sequenceNumber}.`,
            messageBn: `বাক্যের ক্রমভঙ্গ হয়েছে: #${expectedSequence} প্রত্যাশিত ছিল, কিন্তু #${line.sequenceNumber} পাওয়া গেছে।`,
          });
        }

        // Speaker reference valid
        if (!speakerIds.has(line.speakerId)) {
          errors.push({
            type: "error",
            code: "UNKNOWN_SPEAKER_REF",
            field: `lines[${index}].speakerId`,
            message: `Line #${line.sequenceNumber} references non-existent speaker ID: '${line.speakerId}'.`,
            messageBn: `লাইন #${line.sequenceNumber}-এ বক্তার আইডি মেলেনি।`,
          });
        }

        // English text check
        if (!line.englishText || line.englishText.trim().length < 2) {
          errors.push({
            type: "error",
            code: "LINE_TEXT_EMPTY",
            field: `lines[${index}].englishText`,
            message: `Line #${line.sequenceNumber} has empty English dialogue text.`,
            messageBn: `লাইন #${line.sequenceNumber}-এর ইংরেজি বাক্য খালি।`,
          });
        }

        // Bangla translation check
        if (!line.translationBn || line.translationBn.trim().length < 2) {
          errors.push({
            type: "error",
            code: "LINE_TRANSLATION_MISSING",
            field: `lines[${index}].translationBn`,
            message: `Line #${line.sequenceNumber} is missing required Bengali translation.`,
            messageBn: `লাইন #${line.sequenceNumber}-এর বাংলা অনুবাদ অনুপস্থিত।`,
          });
        }

        // Audio availability warning
        if (!line.audioUrl?.["en-US"] && !line.audioUrl?.["en-GB"]) {
          warnings.push({
            type: "warning",
            code: "LINE_AUDIO_UNAVAILABLE",
            field: `lines[${index}].audioUrl`,
            message: `Line #${line.sequenceNumber} does not yet have synthesized audio files attached.`,
            messageBn: `লাইন #${line.sequenceNumber}-এ অডিও ফাইল এখনো সংযুক্ত হয়নি।`,
          });
        }
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
