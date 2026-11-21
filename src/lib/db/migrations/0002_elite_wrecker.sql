CREATE TYPE "public"."challenge_status" AS ENUM('assigned', 'in_progress', 'completed', 'expired');--> statement-breakpoint
CREATE TYPE "public"."srs_rating" AS ENUM('again', 'hard', 'good', 'easy');--> statement-breakpoint
CREATE TABLE "content_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"action" text NOT NULL,
	"change_summary" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"challenge_date" text NOT NULL,
	"conversation_version_id" uuid,
	"scenario_slug" text NOT NULL,
	"status" "challenge_status" DEFAULT 'assigned' NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"user_vocabulary_id" uuid,
	"lemma" text,
	"rating" "srs_rating" NOT NULL,
	"review_stage" integer,
	"interval_days" integer,
	"ease_factor" text,
	"reviewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "content_audit_logs" ADD CONSTRAINT "content_audit_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_challenges" ADD CONSTRAINT "daily_challenges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_challenges" ADD CONSTRAINT "daily_challenges_conversation_version_id_conversation_versions_id_fk" FOREIGN KEY ("conversation_version_id") REFERENCES "public"."conversation_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_events" ADD CONSTRAINT "review_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_events" ADD CONSTRAINT "review_events_user_vocabulary_id_user_vocabulary_id_fk" FOREIGN KEY ("user_vocabulary_id") REFERENCES "public"."user_vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "daily_challenges_user_date_idx" ON "daily_challenges" USING btree ("user_id","challenge_date");