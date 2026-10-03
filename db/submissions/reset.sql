-- Wipes attempts and photos, then puts stored progress back to a fresh start.
-- Curriculum and users stay. Level progress must go first: it points at submissions.
--   psql "$DATABASE_URL" -f db/submissions/reset.sql

BEGIN;

DELETE FROM submission_photos;
DELETE FROM level_progress;
DELETE FROM submissions;

UPDATE style_progress AS progress
SET
  category_xp = 0,
  current_level = 1,
  average_score = 0,
  levels_completed = 0,
  is_mastered = false,
  is_locked = categories.sequence_order > 1
FROM categories
WHERE categories.id = progress.category_id;

UPDATE apprentice_progress
SET
  personal_xp = 0,
  personal_level = 1,
  xp_into_level = 0,
  xp_for_next_level = 60,
  levels_completed = 0;

COMMIT;
