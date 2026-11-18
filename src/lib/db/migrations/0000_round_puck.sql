CREATE TYPE "public"."accent_type" AS ENUM('en-US', 'en-GB');--> statement-breakpoint
CREATE TYPE "public"."audio_status" AS ENUM('processing', 'ready', 'failed', 'stale', 'archived');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'in_review', 'ready', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."text_direction" AS ENUM('ltr', 'rtl');--> statement-breakpoint
CREATE TYPE "public"."practice_mode" AS ENUM('listening_quiz', 'sentence_builder', 'dialogue_order', 'hide_speaker', 'complete_line', 'read_aloud', 'roleplay_text', 'roleplay_voice', 'flashcard');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('draft', 'in_review', 'approved', 'stale', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."user_role_type" AS ENUM('admin', 'editor', 'reviewer', 'learner', 'translator');--> statement-breakpoint
CREATE TABLE "audio_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dialogue_line_id" uuid,
	"conversation_version_id" uuid,
	"language_code" text DEFAULT 'en' NOT NULL,
	"accent" "accent_type" DEFAULT 'en-US' NOT NULL,
	"voice_id" text NOT NULL,
	"audio_url" text NOT NULL,
	"duration_ms" integer DEFAULT 0 NOT NULL,
	"timing_manifest" jsonb,
	"status" "audio_status" DEFAULT 'ready' NOT NULL,
	"source_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "audio_assets_source_hash_unique" UNIQUE("source_hash")
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"scenario_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"parent_category_id" uuid,
	"display_order" integer DEFAULT 0 NOT NULL,
	"status" "content_status" DEFAULT 'published' NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "conversation_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid NOT NULL,
	"version_name" text DEFAULT 'Short' NOT NULL,
	"level" text DEFAULT 'A1' NOT NULL,
	"length_type" text DEFAULT 'short' NOT NULL,
	"communication_style" text DEFAULT 'neutral' NOT NULL,
	"version_description" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dialogue_lines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_version_id" uuid NOT NULL,
	"speaker_id" uuid NOT NULL,
	"sequence_number" integer NOT NULL,
	"english_text" text NOT NULL,
	"learning_note" text
);
--> statement-breakpoint
CREATE TABLE "dialogue_vocabulary" (
	"dialogue_line_id" uuid NOT NULL,
	"vocabulary_id" uuid NOT NULL,
	"language_code" text NOT NULL,
	"contextual_meaning" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercise_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exercise_id" uuid NOT NULL,
	"position" integer DEFAULT 1 NOT NULL,
	"dialogue_line_id" uuid,
	"prompt_text" text,
	"prompt_audio_url" text,
	"item_data" jsonb NOT NULL,
	"explanation" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_version_id" uuid,
	"scenario_slug" text NOT NULL,
	"exercise_type" "practice_mode" NOT NULL,
	"title" text NOT NULL,
	"instructions" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"difficulty" text DEFAULT 'normal',
	"status" "content_status" DEFAULT 'published' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grammar_explanations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid,
	"dialogue_line_id" uuid,
	"vocabulary_id" uuid,
	"language_code" text NOT NULL,
	"explanation_type" text DEFAULT 'sentence' NOT NULL,
	"level" text DEFAULT 'A1' NOT NULL,
	"content" jsonb NOT NULL,
	"schema_version" integer DEFAULT 1 NOT NULL,
	"status" "content_status" DEFAULT 'published' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"code" text PRIMARY KEY NOT NULL,
	"name_english" text NOT NULL,
	"name_native" text NOT NULL,
	"script" text DEFAULT 'Latin' NOT NULL,
	"direction" text_direction DEFAULT 'ltr' NOT NULL,
	"font_family" text DEFAULT 'Inter' NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"tts_supported" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practice_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"mode" "practice_mode" NOT NULL,
	"exercise_type" "practice_mode",
	"status" text DEFAULT 'in_progress' NOT NULL,
	"score_correct" integer DEFAULT 0,
	"score_total" integer DEFAULT 0,
	"last_item_position" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "professions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"industry" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"status" "content_status" DEFAULT 'published' NOT NULL,
	CONSTRAINT "professions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "scenario_categories" (
	"scenario_id" uuid NOT NULL,
	"category_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scenario_professions" (
	"scenario_id" uuid NOT NULL,
	"profession_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scenarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"context" text,
	"learning_objective" text,
	"primary_category_id" uuid,
	"level" text DEFAULT 'A1' NOT NULL,
	"estimated_duration_minutes" integer DEFAULT 5,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "scenarios_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "speakers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"voice_profile_reference" text
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scenario_id" uuid,
	"dialogue_line_id" uuid,
	"language_code" text NOT NULL,
	"translated_text" text NOT NULL,
	"source_version" integer DEFAULT 1 NOT NULL,
	"source_hash" text,
	"review_status" "review_status" DEFAULT 'draft' NOT NULL,
	"reviewed_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"scenario_id" uuid NOT NULL,
	"conversation_version_id" uuid NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"last_position" integer DEFAULT 1 NOT NULL,
	"completed_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "user_role_type" DEFAULT 'learner' NOT NULL,
	"language_code" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_vocabulary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"vocabulary_id" uuid NOT NULL,
	"saved_at" timestamp DEFAULT now() NOT NULL,
	"review_status" text DEFAULT 'learning',
	"review_stage" integer DEFAULT 0,
	"ease_factor" text DEFAULT '2.50',
	"interval_days" integer DEFAULT 0,
	"next_review_at" timestamp,
	"last_reviewed_at" timestamp,
	"lapse_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supabase_uid" text NOT NULL,
	"display_name" text,
	"email" text,
	"ui_locale" text DEFAULT 'bn' NOT NULL,
	"primary_translation" text DEFAULT 'bn' NOT NULL,
	"secondary_translation" text,
	"preferred_accent" "accent_type" DEFAULT 'en-US' NOT NULL,
	"learning_level" text DEFAULT 'A1',
	"learning_goal" text DEFAULT 'Everyday life',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_supabase_uid_unique" UNIQUE("supabase_uid")
);
--> statement-breakpoint
CREATE TABLE "vocabulary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" text NOT NULL,
	"lemma" text NOT NULL,
	"pronunciation_ipa" text,
	"part_of_speech" text
);
--> statement-breakpoint
CREATE TABLE "vocabulary_glosses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vocabulary_id" uuid NOT NULL,
	"language_code" text NOT NULL,
	"gloss" text NOT NULL,
	"general_definition" text
);
--> statement-breakpoint
ALTER TABLE "audio_assets" ADD CONSTRAINT "audio_assets_dialogue_line_id_dialogue_lines_id_fk" FOREIGN KEY ("dialogue_line_id") REFERENCES "public"."dialogue_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audio_assets" ADD CONSTRAINT "audio_assets_conversation_version_id_conversation_versions_id_fk" FOREIGN KEY ("conversation_version_id") REFERENCES "public"."conversation_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audio_assets" ADD CONSTRAINT "audio_assets_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_scenario_id_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_versions" ADD CONSTRAINT "conversation_versions_scenario_id_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dialogue_lines" ADD CONSTRAINT "dialogue_lines_conversation_version_id_conversation_versions_id_fk" FOREIGN KEY ("conversation_version_id") REFERENCES "public"."conversation_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dialogue_lines" ADD CONSTRAINT "dialogue_lines_speaker_id_speakers_id_fk" FOREIGN KEY ("speaker_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dialogue_vocabulary" ADD CONSTRAINT "dialogue_vocabulary_dialogue_line_id_dialogue_lines_id_fk" FOREIGN KEY ("dialogue_line_id") REFERENCES "public"."dialogue_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dialogue_vocabulary" ADD CONSTRAINT "dialogue_vocabulary_vocabulary_id_vocabulary_id_fk" FOREIGN KEY ("vocabulary_id") REFERENCES "public"."vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dialogue_vocabulary" ADD CONSTRAINT "dialogue_vocabulary_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_items" ADD CONSTRAINT "exercise_items_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_items" ADD CONSTRAINT "exercise_items_dialogue_line_id_dialogue_lines_id_fk" FOREIGN KEY ("dialogue_line_id") REFERENCES "public"."dialogue_lines"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_conversation_version_id_conversation_versions_id_fk" FOREIGN KEY ("conversation_version_id") REFERENCES "public"."conversation_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_explanations" ADD CONSTRAINT "grammar_explanations_scenario_id_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_explanations" ADD CONSTRAINT "grammar_explanations_dialogue_line_id_dialogue_lines_id_fk" FOREIGN KEY ("dialogue_line_id") REFERENCES "public"."dialogue_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_explanations" ADD CONSTRAINT "grammar_explanations_vocabulary_id_vocabulary_id_fk" FOREIGN KEY ("vocabulary_id") REFERENCES "public"."vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grammar_explanations" ADD CONSTRAINT "grammar_explanations_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_categories" ADD CONSTRAINT "scenario_categories_scenario_id_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_categories" ADD CONSTRAINT "scenario_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_professions" ADD CONSTRAINT "scenario_professions_scenario_id_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_professions" ADD CONSTRAINT "scenario_professions_profession_id_professions_id_fk" FOREIGN KEY ("profession_id") REFERENCES "public"."professions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_primary_category_id_categories_id_fk" FOREIGN KEY ("primary_category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speakers" ADD CONSTRAINT "speakers_scenario_id_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_scenario_id_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_dialogue_line_id_dialogue_lines_id_fk" FOREIGN KEY ("dialogue_line_id") REFERENCES "public"."dialogue_lines"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_scenario_id_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."scenarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_conversation_version_id_conversation_versions_id_fk" FOREIGN KEY ("conversation_version_id") REFERENCES "public"."conversation_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_vocabulary" ADD CONSTRAINT "user_vocabulary_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_vocabulary" ADD CONSTRAINT "user_vocabulary_vocabulary_id_vocabulary_id_fk" FOREIGN KEY ("vocabulary_id") REFERENCES "public"."vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_glosses" ADD CONSTRAINT "vocabulary_glosses_vocabulary_id_vocabulary_id_fk" FOREIGN KEY ("vocabulary_id") REFERENCES "public"."vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocabulary_glosses" ADD CONSTRAINT "vocabulary_glosses_language_code_languages_code_fk" FOREIGN KEY ("language_code") REFERENCES "public"."languages"("code") ON DELETE no action ON UPDATE no action;