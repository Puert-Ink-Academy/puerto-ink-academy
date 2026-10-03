-- DO NOT EXECUTE this file.
-- It is the Drizzle Kit baseline snapshot of the full schema.
-- The live database was created from db/schema.sql and updated with db/auth.sql.
-- Executing this file tries to create tables that already exist.
-- Keep it so the next `drizzle-kit generate` diffs against this snapshot.
\set ON_ERROR_STOP on
DO $$
BEGIN
  RAISE EXCEPTION 'DO NOT EXECUTE drizzle/0000_flashy_lady_bullseye.sql. It is a Drizzle Kit baseline snapshot. Use db/schema.sql for a new database and db/auth.sql for the existing one.';
END
$$;--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('pending', 'graded');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'TEACHER', 'APPRENTICE');--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "apprentice_progress" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"personal_xp" integer DEFAULT 0 NOT NULL,
	"personal_level" integer DEFAULT 1 NOT NULL,
	"xp_into_level" integer DEFAULT 0 NOT NULL,
	"xp_for_next_level" integer NOT NULL,
	"levels_completed" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "apprentice_progress_xp_nonnegative" CHECK ("apprentice_progress"."personal_xp" >= 0),
	CONSTRAINT "apprentice_progress_level_positive" CHECK ("apprentice_progress"."personal_level" >= 1),
	CONSTRAINT "apprentice_progress_into_nonnegative" CHECK ("apprentice_progress"."xp_into_level" >= 0),
	CONSTRAINT "apprentice_progress_into_below_next" CHECK ("apprentice_progress"."xp_into_level" < "apprentice_progress"."xp_for_next_level"),
	CONSTRAINT "apprentice_progress_next_positive" CHECK ("apprentice_progress"."xp_for_next_level" > 0),
	CONSTRAINT "apprentice_progress_levels_completed_nonnegative" CHECK ("apprentice_progress"."levels_completed" >= 0)
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"tagline" text NOT NULL,
	"sequence_order" integer NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_sequence_order_key" UNIQUE("sequence_order"),
	CONSTRAINT "categories_name_not_blank" CHECK (length(btrim("categories"."name")) > 0),
	CONSTRAINT "categories_slug_not_blank" CHECK (length(btrim("categories"."slug")) > 0),
	CONSTRAINT "categories_sequence_order_positive" CHECK ("categories"."sequence_order" >= 1)
);
--> statement-breakpoint
CREATE TABLE "level_progress" (
	"apprentice_id" uuid NOT NULL,
	"level_id" uuid NOT NULL,
	"best_score" integer,
	"best_awarded_xp" integer,
	"best_submission_id" uuid,
	"attempt_count" integer NOT NULL,
	"latest_score" integer,
	"latest_feedback" text,
	CONSTRAINT "level_progress_apprentice_id_level_id_pk" PRIMARY KEY("apprentice_id","level_id"),
	CONSTRAINT "level_progress_attempt_count_positive" CHECK ("level_progress"."attempt_count" >= 1),
	CONSTRAINT "level_progress_best_state" CHECK ((
        "level_progress"."best_score" IS NULL
        AND "level_progress"."best_awarded_xp" IS NULL
        AND "level_progress"."best_submission_id" IS NULL
        AND "level_progress"."latest_score" IS NULL
        AND "level_progress"."latest_feedback" IS NULL
      ) OR (
        "level_progress"."best_score" BETWEEN 0 AND 10
        AND "level_progress"."best_awarded_xp" = CASE WHEN "level_progress"."best_score" >= 8 THEN "level_progress"."best_score" * 10 ELSE 0 END
        AND "level_progress"."best_submission_id" IS NOT NULL
        AND "level_progress"."latest_score" BETWEEN 0 AND 10
      ))
);
--> statement-breakpoint
CREATE TABLE "level_references" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"level_version_id" uuid NOT NULL,
	"label" text NOT NULL,
	"sort_order" integer NOT NULL,
	"url" text,
	"object_key" text,
	"alt" text,
	"width" integer,
	"height" integer,
	CONSTRAINT "level_references_label_not_blank" CHECK (length(btrim("level_references"."label")) > 0),
	CONSTRAINT "level_references_sort_order_nonnegative" CHECK ("level_references"."sort_order" >= 0),
	CONSTRAINT "level_references_file_pair" CHECK (("level_references"."url" IS NULL AND "level_references"."object_key" IS NULL) OR ("level_references"."url" IS NOT NULL AND "level_references"."object_key" IS NOT NULL)),
	CONSTRAINT "level_references_dimensions" CHECK (("level_references"."width" IS NULL AND "level_references"."height" IS NULL) OR ("level_references"."width" > 0 AND "level_references"."height" > 0))
);
--> statement-breakpoint
CREATE TABLE "level_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"level_id" uuid NOT NULL,
	"version_number" integer NOT NULL,
	"title" text NOT NULL,
	"objective" text NOT NULL,
	"exercise" text NOT NULL,
	"tips" text NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "level_versions_number_positive" CHECK ("level_versions"."version_number" >= 1)
);
--> statement-breakpoint
CREATE TABLE "levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"current_version_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "levels_position_positive" CHECK ("levels"."position" >= 1)
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "style_progress" (
	"apprentice_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"category_xp" integer DEFAULT 0 NOT NULL,
	"current_level" integer NOT NULL,
	"average_score" numeric(4, 2) DEFAULT 0 NOT NULL,
	"levels_completed" integer DEFAULT 0 NOT NULL,
	"is_locked" boolean NOT NULL,
	"is_mastered" boolean DEFAULT false NOT NULL,
	CONSTRAINT "style_progress_apprentice_id_category_id_pk" PRIMARY KEY("apprentice_id","category_id"),
	CONSTRAINT "style_progress_xp_nonnegative" CHECK ("style_progress"."category_xp" >= 0),
	CONSTRAINT "style_progress_current_level_positive" CHECK ("style_progress"."current_level" >= 1),
	CONSTRAINT "style_progress_average_score_range" CHECK ("style_progress"."average_score" BETWEEN 0 AND 10),
	CONSTRAINT "style_progress_levels_completed_nonnegative" CHECK ("style_progress"."levels_completed" >= 0),
	CONSTRAINT "style_progress_lock_and_mastery" CHECK (NOT ("style_progress"."is_locked" AND "style_progress"."is_mastered"))
);
--> statement-breakpoint
CREATE TABLE "submission_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"sort_order" integer NOT NULL,
	"url" text NOT NULL,
	"object_key" text NOT NULL,
	"alt" text,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	CONSTRAINT "submission_photos_sort_order_nonnegative" CHECK ("submission_photos"."sort_order" >= 0),
	CONSTRAINT "submission_photos_url_not_blank" CHECK (length(btrim("submission_photos"."url")) > 0),
	CONSTRAINT "submission_photos_object_key_not_blank" CHECK (length(btrim("submission_photos"."object_key")) > 0),
	CONSTRAINT "submission_photos_dimensions" CHECK ("submission_photos"."width" > 0 AND "submission_photos"."height" > 0)
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"apprentice_id" uuid NOT NULL,
	"level_id" uuid NOT NULL,
	"level_version_id" uuid NOT NULL,
	"attempt_number" integer NOT NULL,
	"status" "submission_status" NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"claimed_by" uuid,
	"claimed_at" timestamp with time zone,
	"graded_by" uuid,
	"graded_at" timestamp with time zone,
	"score" integer,
	"feedback" text,
	"awarded_xp" integer,
	CONSTRAINT "submissions_attempt_number_positive" CHECK ("submissions"."attempt_number" >= 1),
	CONSTRAINT "submissions_claim_pair" CHECK (("submissions"."claimed_by" IS NULL AND "submissions"."claimed_at" IS NULL) OR ("submissions"."claimed_by" IS NOT NULL AND "submissions"."claimed_at" IS NOT NULL)),
	CONSTRAINT "submissions_grade_state" CHECK ((
        "submissions"."status" = 'pending'
        AND "submissions"."score" IS NULL
        AND "submissions"."feedback" IS NULL
        AND "submissions"."awarded_xp" IS NULL
        AND "submissions"."graded_by" IS NULL
        AND "submissions"."graded_at" IS NULL
      ) OR (
        "submissions"."status" = 'graded'
        AND "submissions"."score" BETWEEN 0 AND 10
        AND "submissions"."awarded_xp" = CASE WHEN "submissions"."score" >= 8 THEN "submissions"."score" * 10 ELSE 0 END
        AND "submissions"."graded_by" IS NOT NULL
        AND "submissions"."graded_at" IS NOT NULL
      ))
);
--> statement-breakpoint
CREATE TABLE "titles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"min_personal_level" integer NOT NULL,
	CONSTRAINT "titles_min_personal_level_key" UNIQUE("min_personal_level"),
	CONSTRAINT "titles_name_not_blank" CHECK (length(btrim("titles"."name")) > 0),
	CONSTRAINT "titles_min_personal_level_positive" CHECK ("titles"."min_personal_level" >= 1)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"email_verified" timestamp with time zone,
	"image" text,
	"name" text NOT NULL,
	"role" "user_role" NOT NULL,
	"artist_name" text,
	"studio" text,
	"nationality" char(2),
	"profile_slug" text NOT NULL,
	"joined_at" date DEFAULT CURRENT_DATE NOT NULL,
	CONSTRAINT "users_name_not_blank" CHECK (length(btrim("users"."name")) > 0),
	CONSTRAINT "users_email_not_blank" CHECK (length(btrim("users"."email")) > 0),
	CONSTRAINT "users_artist_name_length" CHECK ("users"."artist_name" IS NULL OR char_length("users"."artist_name") <= 40),
	CONSTRAINT "users_studio_length" CHECK ("users"."studio" IS NULL OR char_length("users"."studio") <= 60),
	CONSTRAINT "users_nationality_code" CHECK ("users"."nationality" IS NULL OR "users"."nationality" ~ '^[A-Z]{2}$'),
	CONSTRAINT "users_profile_slug_not_blank" CHECK (length(btrim("users"."profile_slug")) > 0)
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apprentice_progress" ADD CONSTRAINT "apprentice_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "level_progress" ADD CONSTRAINT "level_progress_apprentice_id_users_id_fk" FOREIGN KEY ("apprentice_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "level_progress" ADD CONSTRAINT "level_progress_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "level_progress" ADD CONSTRAINT "level_progress_best_submission_id_submissions_id_fk" FOREIGN KEY ("best_submission_id") REFERENCES "public"."submissions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "level_references" ADD CONSTRAINT "level_references_level_version_id_level_versions_id_fk" FOREIGN KEY ("level_version_id") REFERENCES "public"."level_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "level_versions" ADD CONSTRAINT "level_versions_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "level_versions" ADD CONSTRAINT "level_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "levels" ADD CONSTRAINT "levels_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "levels" ADD CONSTRAINT "levels_current_version_id_level_versions_id_fk" FOREIGN KEY ("current_version_id") REFERENCES "public"."level_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "style_progress" ADD CONSTRAINT "style_progress_apprentice_id_users_id_fk" FOREIGN KEY ("apprentice_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "style_progress" ADD CONSTRAINT "style_progress_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_photos" ADD CONSTRAINT "submission_photos_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_apprentice_id_users_id_fk" FOREIGN KEY ("apprentice_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_level_id_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."levels"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_level_version_id_level_versions_id_fk" FOREIGN KEY ("level_version_id") REFERENCES "public"."level_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_claimed_by_users_id_fk" FOREIGN KEY ("claimed_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_graded_by_users_id_fk" FOREIGN KEY ("graded_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_lower_key" ON "categories" USING btree (lower("slug"));--> statement-breakpoint
CREATE UNIQUE INDEX "categories_name_lower_key" ON "categories" USING btree (lower("name"));--> statement-breakpoint
CREATE UNIQUE INDEX "level_references_version_sort_key" ON "level_references" USING btree ("level_version_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "level_versions_level_number_key" ON "level_versions" USING btree ("level_id","version_number");--> statement-breakpoint
CREATE UNIQUE INDEX "levels_category_position_key" ON "levels" USING btree ("category_id","position");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "style_progress_leaderboard" ON "style_progress" USING btree ("category_id","category_xp" DESC NULLS LAST) WHERE "style_progress"."is_locked" = false AND "style_progress"."category_xp" > 0;--> statement-breakpoint
CREATE UNIQUE INDEX "submission_photos_submission_sort_key" ON "submission_photos" USING btree ("submission_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "submissions_attempt_key" ON "submissions" USING btree ("apprentice_id","level_id","attempt_number");--> statement-breakpoint
CREATE UNIQUE INDEX "submissions_one_pending_per_level" ON "submissions" USING btree ("apprentice_id","level_id") WHERE "submissions"."status" = 'pending';--> statement-breakpoint
CREATE INDEX "submissions_pending_queue" ON "submissions" USING btree ("submitted_at") WHERE "submissions"."status" = 'pending';--> statement-breakpoint
CREATE INDEX "submissions_claimed_by" ON "submissions" USING btree ("claimed_by") WHERE "submissions"."status" = 'pending';--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_lower_key" ON "users" USING btree (lower("email"));--> statement-breakpoint
CREATE UNIQUE INDEX "users_profile_slug_lower_key" ON "users" USING btree (lower("profile_slug"));