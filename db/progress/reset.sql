-- Clears stored scores and puts every style and personal level back to the start.
-- Submission rows stay. Run db/submissions/reset.sql if the attempts should go too.
--   psql "$DATABASE_URL" -f db/progress/reset.sql

BEGIN;

DELETE FROM level_progress;

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
