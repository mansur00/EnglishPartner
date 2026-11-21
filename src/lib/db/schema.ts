import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  jsonb,
  pgEnum,
  check,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// --- ENUMS ---
export const roleEnum = pgEnum("user_role_type", ["admin", "editor", "reviewer", "learner", "translator"]);
export const directionEnum = pgEnum("text_direction", ["ltr", "rtl"]);
export const contentStatusEnum = pgEnum("content_status", ["draft", "in_review", "ready", "published", "archived"]);
export const audioStatusEnum = pgEnum("audio_status", ["processing", "ready", "failed", "stale", "archived"]);
export const accentEnum = pgEnum("accent_type", ["en-US", "en-GB"]);
export const reviewStatusEnum = pgEnum("review_status", ["draft", "in_review", "approved", "stale", "rejected"]);

// --- 1. LANGUAGES REGISTRY ---
export const languages = pgTable("languages", {
  code: text("code").primaryKey(), // e.g. "en", "bn", "hi"
  nameEnglish: text("name_english").notNull(),
  nameNative: text("name_native").notNull(),
  script: text("script").notNull().default("Latin"),
  direction: directionEnum("direction").notNull().default("ltr"),
  fontFamily: text("font_family").notNull().default("Inter"),
  status: text("status").notNull().default("available"),
  ttsSupported: boolean("tts_supported").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
});

// --- 2. USERS & PREFERENCES (A-01, D-10) ---
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  supabaseUid: text("supabase_uid").notNull().unique(),
  displayName: text("display_name"),
  email: text("email"),
  uiLocale: text("ui_locale").notNull().default("bn"),
  primaryTranslation: text("primary_translation").notNull().default("bn"),
  secondaryTranslation: text("secondary_translation"),
  preferredAccent: accentEnum("preferred_accent").notNull().default("en-US"),
  learningLevel: text("learning_level").default("A1"),
  learningGoal: text("learning_goal").default("Everyday life"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- 3. USER ROLES (D-11) ---
export const userRoles = pgTable("user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: roleEnum("role").notNull().default("learner"),
  languageCode: text("language_code").references(() => languages.code),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- 4. CATEGORIES & PROFESSIONS ---
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentCategoryId: uuid("parent_category_id"),
  displayOrder: integer("display_order").notNull().default(0),
  status: contentStatusEnum("status").notNull().default("published"),
});

export const professions = pgTable("professions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  industry: text("industry"),
  displayOrder: integer("display_order").notNull().default(0),
  status: contentStatusEnum("status").notNull().default("published"),
});

// --- 5. SCENARIOS (Central entity) ---
export const scenarios = pgTable("scenarios", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  context: text("context"),
  learningObjective: text("learning_objective"),
  primaryCategoryId: uuid("primary_category_id").references(() => categories.id),
  level: text("level").notNull().default("A1"),
  estimatedDurationMinutes: integer("estimated_duration_minutes").default(5),
  status: contentStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const scenarioCategories = pgTable("scenario_categories", {
  scenarioId: uuid("scenario_id").references(() => scenarios.id, { onDelete: "cascade" }).notNull(),
  categoryId: uuid("category_id").references(() => categories.id, { onDelete: "cascade" }).notNull(),
});

export const scenarioProfessions = pgTable("scenario_professions", {
  scenarioId: uuid("scenario_id").references(() => scenarios.id, { onDelete: "cascade" }).notNull(),
  professionId: uuid("profession_id").references(() => professions.id, { onDelete: "cascade" }).notNull(),
});

// --- 6. CONVERSATION VERSIONS & LINES ---
export const conversationVersions = pgTable("conversation_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  scenarioId: uuid("scenario_id").references(() => scenarios.id, { onDelete: "cascade" }).notNull(),
  versionName: text("version_name").notNull().default("Short"),
  level: text("level").notNull().default("A1"),
  lengthType: text("length_type").notNull().default("short"), // short, medium, long
  communicationStyle: text("communication_style").notNull().default("neutral"), // casual, neutral, formal
  versionDescription: text("version_description"),
  status: contentStatusEnum("status").notNull().default("draft"),
});

export const speakers = pgTable("speakers", {
  id: uuid("id").primaryKey().defaultRandom(),
  scenarioId: uuid("scenario_id").references(() => scenarios.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  voiceProfileReference: text("voice_profile_reference"),
});

export const dialogueLines = pgTable("dialogue_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationVersionId: uuid("conversation_version_id").references(() => conversationVersions.id, { onDelete: "cascade" }).notNull(),
  speakerId: uuid("speaker_id").references(() => speakers.id, { onDelete: "cascade" }).notNull(),
  sequenceNumber: integer("sequence_number").notNull(),
  englishText: text("english_text").notNull(),
  learningNote: text("learning_note"),
});

// --- 7. TRANSLATIONS (D-07: Explicit FKs + Stale Detection) ---
export const translations = pgTable(
  "translations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scenarioId: uuid("scenario_id").references(() => scenarios.id, { onDelete: "cascade" }),
    dialogueLineId: uuid("dialogue_line_id").references(() => dialogueLines.id, { onDelete: "cascade" }),
    languageCode: text("language_code").references(() => languages.code).notNull(),
    translatedText: text("translated_text").notNull(),
    sourceVersion: integer("source_version").notNull().default(1),
    sourceHash: text("source_hash"),
    reviewStatus: reviewStatusEnum("review_status").notNull().default("draft"),
    reviewedBy: uuid("reviewed_by"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    check(
      "translations_target_check",
      sql`(${table.scenarioId} IS NOT NULL AND ${table.dialogueLineId} IS NULL) OR (${table.scenarioId} IS NULL AND ${table.dialogueLineId} IS NOT NULL)`
    ),
  ]
);

// --- 8. VOCABULARY & GLOSSES ---
export const vocabulary = pgTable("vocabulary", {
  id: uuid("id").primaryKey().defaultRandom(),
  word: text("word").notNull(),
  lemma: text("lemma").notNull(),
  pronunciationIpa: text("pronunciation_ipa"),
  partOfSpeech: text("part_of_speech"),
});

export const vocabularyGlosses = pgTable("vocabulary_glosses", {
  id: uuid("id").primaryKey().defaultRandom(),
  vocabularyId: uuid("vocabulary_id").references(() => vocabulary.id, { onDelete: "cascade" }).notNull(),
  languageCode: text("language_code").references(() => languages.code).notNull(),
  gloss: text("gloss").notNull(),
  generalDefinition: text("general_definition"),
});

export const dialogueVocabulary = pgTable("dialogue_vocabulary", {
  dialogueLineId: uuid("dialogue_line_id").references(() => dialogueLines.id, { onDelete: "cascade" }).notNull(),
  vocabularyId: uuid("vocabulary_id").references(() => vocabulary.id, { onDelete: "cascade" }).notNull(),
  languageCode: text("language_code").references(() => languages.code).notNull(),
  contextualMeaning: text("contextual_meaning").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
});

// --- 9. GRAMMAR EXPLANATIONS (D-09: With language_code) ---
export const grammarExplanations = pgTable("grammar_explanations", {
  id: uuid("id").primaryKey().defaultRandom(),
  scenarioId: uuid("scenario_id").references(() => scenarios.id, { onDelete: "cascade" }),
  dialogueLineId: uuid("dialogue_line_id").references(() => dialogueLines.id, { onDelete: "cascade" }),
  vocabularyId: uuid("vocabulary_id").references(() => vocabulary.id, { onDelete: "cascade" }),
  languageCode: text("language_code").references(() => languages.code).notNull(),
  explanationType: text("explanation_type").notNull().default("sentence"), // sentence, word, tense
  level: text("level").notNull().default("A1"),
  content: jsonb("content").notNull(), // structured grammar JSON
  schemaVersion: integer("schema_version").notNull().default(1),
  status: contentStatusEnum("status").notNull().default("published"),
});

// --- 10. AUDIO ASSETS (D-08: Explicit FKs, timing manifest, BCP 47 accents) ---
export const audioAssets = pgTable(
  "audio_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    dialogueLineId: uuid("dialogue_line_id").references(() => dialogueLines.id, { onDelete: "cascade" }),
    conversationVersionId: uuid("conversation_version_id").references(() => conversationVersions.id, { onDelete: "cascade" }),
    languageCode: text("language_code").references(() => languages.code).notNull().default("en"),
    accent: accentEnum("accent").notNull().default("en-US"),
    voiceId: text("voice_id").notNull(),
    audioUrl: text("audio_url").notNull(),
    durationMs: integer("duration_ms").notNull().default(0),
    timingManifest: jsonb("timing_manifest"), // Word/turn timestamps for full conversations
    status: audioStatusEnum("status").notNull().default("ready"),
    sourceHash: text("source_hash").unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    check(
      "audio_assets_target_check",
      sql`(${table.dialogueLineId} IS NOT NULL AND ${table.conversationVersionId} IS NULL) OR (${table.dialogueLineId} IS NULL AND ${table.conversationVersionId} IS NOT NULL)`
    ),
  ]
);

// --- 11. LEARNER PROGRESS & PERSONAL DATA (A-01, A-02) ---
export const userProgress = pgTable("user_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  scenarioId: uuid("scenario_id").references(() => scenarios.id, { onDelete: "cascade" }).notNull(),
  conversationVersionId: uuid("conversation_version_id").references(() => conversationVersions.id, { onDelete: "cascade" }).notNull(),
  status: text("status").notNull().default("in_progress"), // in_progress, completed
  lastPosition: integer("last_position").notNull().default(1),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userVocabulary = pgTable("user_vocabulary", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  vocabularyId: uuid("vocabulary_id").references(() => vocabulary.id, { onDelete: "cascade" }).notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
  reviewStatus: text("review_status").default("learning"),
  reviewStage: integer("review_stage").default(0),
  easeFactor: text("ease_factor").default("2.50"),
  intervalDays: integer("interval_days").default(0),
  nextReviewAt: timestamp("next_review_at"),
  lastReviewedAt: timestamp("last_reviewed_at"),
  lapseCount: integer("lapse_count").default(0),
});

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  scenarioId: uuid("scenario_id").references(() => scenarios.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- 12. EXERCISES & PRACTICE SESSIONS (Phase 2, ECP_Exercises_SRS_Spec.md §3.4, Register D-12) ---
export const practiceModeEnum = pgEnum("practice_mode", [
  "listening_quiz",
  "sentence_builder",
  "dialogue_order",
  "hide_speaker",
  "complete_line",
  "read_aloud",
  "roleplay_text",
  "roleplay_voice",
  "flashcard"
]);

// Keep exerciseTypeEnum alias per D-12
export const exerciseTypeEnum = practiceModeEnum;

export const exercises = pgTable("exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationVersionId: uuid("conversation_version_id").references(() => conversationVersions.id, { onDelete: "cascade" }),
  scenarioSlug: text("scenario_slug").notNull(),
  exerciseType: practiceModeEnum("exercise_type").notNull(),
  title: text("title").notNull(),
  instructions: text("instructions").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  difficulty: text("difficulty").default("normal"),
  status: contentStatusEnum("status").notNull().default("published"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const exerciseItems = pgTable("exercise_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  exerciseId: uuid("exercise_id").references(() => exercises.id, { onDelete: "cascade" }).notNull(),
  position: integer("position").notNull().default(1),
  dialogueLineId: uuid("dialogue_line_id").references(() => dialogueLines.id, { onDelete: "set null" }),
  promptText: text("prompt_text"),
  promptAudioUrl: text("prompt_audio_url"),
  itemData: jsonb("item_data").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const practiceSessions = pgTable("practice_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  mode: practiceModeEnum("mode").notNull(),
  exerciseType: practiceModeEnum("exercise_type"),
  status: text("status").notNull().default("in_progress"),
  scoreCorrect: integer("score_correct").default(0),
  scoreTotal: integer("score_total").default(0),
  lastItemPosition: integer("last_item_position").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- 13. REVIEW EVENTS & DAILY CHALLENGES (Phase 2/3, ECP_Exercises_SRS_Spec.md §6.4 & §7, KI-08) ---
export const srsRatingEnum = pgEnum("srs_rating", ["again", "hard", "good", "easy"]);
export const challengeStatusEnum = pgEnum("challenge_status", ["assigned", "in_progress", "completed", "expired"]);

export const reviewEvents = pgTable("review_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  userVocabularyId: uuid("user_vocabulary_id").references(() => userVocabulary.id, { onDelete: "cascade" }),
  lemma: text("lemma"),
  rating: srsRatingEnum("rating").notNull(),
  reviewStage: integer("review_stage"),
  intervalDays: integer("interval_days"),
  easeFactor: text("ease_factor"),
  reviewedAt: timestamp("reviewed_at").defaultNow().notNull(),
});

export const dailyChallenges = pgTable(
  "daily_challenges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    challengeDate: text("challenge_date").notNull(), // ISO YYYY-MM-DD
    conversationVersionId: uuid("conversation_version_id").references(() => conversationVersions.id, { onDelete: "cascade" }),
    scenarioSlug: text("scenario_slug").notNull(),
    status: challengeStatusEnum("status").notNull().default("assigned"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("daily_challenges_user_date_idx").on(table.userId, table.challengeDate),
  ]
);

export const contentAuditLogs = pgTable("content_audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  action: text("action").notNull(),
  changeSummary: text("change_summary"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

