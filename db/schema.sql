-- Puerto Ink Academy schema (PostgreSQL 13+)
-- Run this once against the empty database:
--   psql "$DATABASE_URL" -f db/schema.sql

BEGIN;

CREATE TYPE user_role AS ENUM ('ADMIN', 'TEACHER', 'APPRENTICE');

CREATE TYPE submission_status AS ENUM ('pending', 'graded');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text NOT NULL,
  role user_role NOT NULL,
  artist_name text,
  studio text,
  nationality char(2),
  profile_slug text NOT NULL,
  joined_at date NOT NULL DEFAULT CURRENT_DATE,
  CONSTRAINT users_name_not_blank CHECK (length(btrim(name)) > 0),
  CONSTRAINT users_email_not_blank CHECK (length(btrim(email)) > 0),
  CONSTRAINT users_artist_name_length CHECK (
    artist_name IS NULL OR char_length(artist_name) <= 40
  ),
  CONSTRAINT users_studio_length CHECK (
    studio IS NULL OR char_length(studio) <= 60
  ),
  CONSTRAINT users_nationality_code CHECK (
    nationality IS NULL OR nationality ~ '^[A-Z]{2}$'
  ),
  CONSTRAINT users_profile_slug_not_blank CHECK (length(btrim(profile_slug)) > 0)
);

CREATE UNIQUE INDEX users_email_lower_key ON users (lower(email));

CREATE UNIQUE INDEX users_profile_slug_lower_key ON users (lower(profile_slug));

CREATE TABLE titles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  min_personal_level integer NOT NULL,
  CONSTRAINT titles_name_not_blank CHECK (length(btrim(name)) > 0),
  CONSTRAINT titles_min_personal_level_positive CHECK (min_personal_level >= 1),
  CONSTRAINT titles_min_personal_level_key UNIQUE (min_personal_level)
);

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  tagline text NOT NULL,
  sequence_order integer NOT NULL,
  created_by uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT categories_name_not_blank CHECK (length(btrim(name)) > 0),
  CONSTRAINT categories_slug_not_blank CHECK (length(btrim(slug)) > 0),
  CONSTRAINT categories_sequence_order_positive CHECK (sequence_order >= 1),
  CONSTRAINT categories_sequence_order_key UNIQUE (sequence_order)
);

CREATE UNIQUE INDEX categories_slug_lower_key ON categories (lower(slug));

CREATE UNIQUE INDEX categories_name_lower_key ON categories (lower(name));

-- current_version_id is required, but the first version row cannot exist
-- until this level row does. Both foreign keys are deferred so one transaction
-- can insert the level and version 1 together. See the example at the bottom.
CREATE TABLE levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories (id) ON DELETE RESTRICT,
  position integer NOT NULL,
  current_version_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT levels_position_positive CHECK (position >= 1),
  CONSTRAINT levels_category_position_key UNIQUE (category_id, position)
);

CREATE TABLE level_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id uuid NOT NULL,
  version_number integer NOT NULL,
  title text NOT NULL,
  objective text NOT NULL,
  exercise text NOT NULL,
  tips text NOT NULL,
  created_by uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT level_versions_number_positive CHECK (version_number >= 1),
  CONSTRAINT level_versions_level_number_key UNIQUE (level_id, version_number)
);

ALTER TABLE levels
  ADD CONSTRAINT levels_current_version_id_fkey
  FOREIGN KEY (current_version_id) REFERENCES level_versions (id)
  DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE level_versions
  ADD CONSTRAINT level_versions_level_id_fkey
  FOREIGN KEY (level_id) REFERENCES levels (id)
  DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE level_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_version_id uuid NOT NULL REFERENCES level_versions (id) ON DELETE CASCADE,
  label text NOT NULL,
  sort_order integer NOT NULL,
  url text,
  object_key text,
  alt text,
  width integer,
  height integer,
  CONSTRAINT level_references_label_not_blank CHECK (length(btrim(label)) > 0),
  CONSTRAINT level_references_sort_order_nonnegative CHECK (sort_order >= 0),
  CONSTRAINT level_references_version_sort_key UNIQUE (level_version_id, sort_order),
  CONSTRAINT level_references_file_pair CHECK (
    (url IS NULL AND object_key IS NULL)
    OR (url IS NOT NULL AND object_key IS NOT NULL)
  ),
  CONSTRAINT level_references_dimensions CHECK (
    (width IS NULL AND height IS NULL)
    OR (width > 0 AND height > 0)
  )
);

CREATE TABLE submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  apprentice_id uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  level_id uuid NOT NULL REFERENCES levels (id) ON DELETE RESTRICT,
  level_version_id uuid NOT NULL REFERENCES level_versions (id) ON DELETE RESTRICT,
  attempt_number integer NOT NULL,
  status submission_status NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  claimed_by uuid REFERENCES users (id) ON DELETE RESTRICT,
  claimed_at timestamptz,
  graded_by uuid REFERENCES users (id) ON DELETE RESTRICT,
  graded_at timestamptz,
  score integer,
  feedback text,
  awarded_xp integer,
  CONSTRAINT submissions_attempt_number_positive CHECK (attempt_number >= 1),
  CONSTRAINT submissions_attempt_key UNIQUE (apprentice_id, level_id, attempt_number),
  CONSTRAINT submissions_claim_pair CHECK (
    (claimed_by IS NULL AND claimed_at IS NULL)
    OR (claimed_by IS NOT NULL AND claimed_at IS NOT NULL)
  ),
  CONSTRAINT submissions_grade_state CHECK (
    (
      status = 'pending'
      AND score IS NULL
      AND feedback IS NULL
      AND awarded_xp IS NULL
      AND graded_by IS NULL
      AND graded_at IS NULL
    )
    OR (
      status = 'graded'
      AND score BETWEEN 0 AND 10
      AND awarded_xp = CASE WHEN score >= 8 THEN score * 10 ELSE 0 END
      AND graded_by IS NOT NULL
      AND graded_at IS NOT NULL
    )
  )
);

-- One waiting submission per apprentice per level. A second upload stays locked.
CREATE UNIQUE INDEX submissions_one_pending_per_level
  ON submissions (apprentice_id, level_id)
  WHERE status = 'pending';

CREATE INDEX submissions_pending_queue
  ON submissions (submitted_at)
  WHERE status = 'pending';

CREATE INDEX submissions_claimed_by
  ON submissions (claimed_by)
  WHERE status = 'pending';

CREATE TABLE submission_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES submissions (id) ON DELETE CASCADE,
  sort_order integer NOT NULL,
  url text NOT NULL,
  object_key text NOT NULL,
  alt text,
  width integer NOT NULL,
  height integer NOT NULL,
  CONSTRAINT submission_photos_sort_order_nonnegative CHECK (sort_order >= 0),
  CONSTRAINT submission_photos_submission_sort_key UNIQUE (submission_id, sort_order),
  CONSTRAINT submission_photos_url_not_blank CHECK (length(btrim(url)) > 0),
  CONSTRAINT submission_photos_object_key_not_blank CHECK (length(btrim(object_key)) > 0),
  CONSTRAINT submission_photos_dimensions CHECK (width > 0 AND height > 0)
);

CREATE TABLE level_progress (
  apprentice_id uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  level_id uuid NOT NULL REFERENCES levels (id) ON DELETE RESTRICT,
  best_score integer,
  best_awarded_xp integer,
  best_submission_id uuid REFERENCES submissions (id) ON DELETE RESTRICT,
  attempt_count integer NOT NULL,
  latest_score integer,
  latest_feedback text,
  PRIMARY KEY (apprentice_id, level_id),
  CONSTRAINT level_progress_attempt_count_positive CHECK (attempt_count >= 1),
  CONSTRAINT level_progress_best_state CHECK (
    (
      best_score IS NULL
      AND best_awarded_xp IS NULL
      AND best_submission_id IS NULL
      AND latest_score IS NULL
      AND latest_feedback IS NULL
    )
    OR (
      best_score BETWEEN 0 AND 10
      AND best_awarded_xp = CASE WHEN best_score >= 8 THEN best_score * 10 ELSE 0 END
      AND best_submission_id IS NOT NULL
      AND latest_score BETWEEN 0 AND 10
    )
  )
);

CREATE TABLE style_progress (
  apprentice_id uuid NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  category_id uuid NOT NULL REFERENCES categories (id) ON DELETE RESTRICT,
  category_xp integer NOT NULL DEFAULT 0,
  current_level integer NOT NULL,
  average_score numeric(4, 2) NOT NULL DEFAULT 0,
  levels_completed integer NOT NULL DEFAULT 0,
  is_locked boolean NOT NULL,
  is_mastered boolean NOT NULL DEFAULT false,
  PRIMARY KEY (apprentice_id, category_id),
  CONSTRAINT style_progress_xp_nonnegative CHECK (category_xp >= 0),
  CONSTRAINT style_progress_current_level_positive CHECK (current_level >= 1),
  CONSTRAINT style_progress_average_score_range CHECK (average_score BETWEEN 0 AND 10),
  CONSTRAINT style_progress_levels_completed_nonnegative CHECK (levels_completed >= 0),
  CONSTRAINT style_progress_lock_and_mastery CHECK (NOT (is_locked AND is_mastered))
);

-- Leaderboard read: unlocked rows with XP, highest XP first. Rank is not stored.
CREATE INDEX style_progress_leaderboard
  ON style_progress (category_id, category_xp DESC)
  WHERE is_locked = false AND category_xp > 0;

CREATE TABLE apprentice_progress (
  user_id uuid PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  personal_xp integer NOT NULL DEFAULT 0,
  personal_level integer NOT NULL DEFAULT 1,
  xp_into_level integer NOT NULL DEFAULT 0,
  xp_for_next_level integer NOT NULL,
  levels_completed integer NOT NULL DEFAULT 0,
  CONSTRAINT apprentice_progress_xp_nonnegative CHECK (personal_xp >= 0),
  CONSTRAINT apprentice_progress_level_positive CHECK (personal_level >= 1),
  CONSTRAINT apprentice_progress_into_nonnegative CHECK (xp_into_level >= 0),
  CONSTRAINT apprentice_progress_into_below_next CHECK (xp_into_level < xp_for_next_level),
  CONSTRAINT apprentice_progress_next_positive CHECK (xp_for_next_level > 0),
  CONSTRAINT apprentice_progress_levels_completed_nonnegative CHECK (levels_completed >= 0)
);

COMMIT;

-- Creating a level and its first version must be one transaction.
-- Replace the UUIDs and text, and use a real teacher or admin id for created_by.
--
-- BEGIN;
-- INSERT INTO levels (id, category_id, position, current_version_id)
-- VALUES (
--   '00000000-0000-0000-0000-000000000010',
--   '00000000-0000-0000-0000-000000000001',
--   1,
--   '00000000-0000-0000-0000-000000000011'
-- );
-- INSERT INTO level_versions (
--   id, level_id, version_number, title, objective, exercise, tips, created_by
-- )
-- VALUES (
--   '00000000-0000-0000-0000-000000000011',
--   '00000000-0000-0000-0000-000000000010',
--   1,
--   'Studio Hygiene',
--   'Set up and break down a clean station',
--   'Photograph the wrapped station',
--   'Wrap everything you will touch',
--   '00000000-0000-0000-0000-0000000000aa'
-- );
-- COMMIT;
