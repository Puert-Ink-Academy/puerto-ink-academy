-- Starting progress for the seeded apprentice.
-- Fine Line is open. The other four styles are locked. Personal level is 1.
-- Run db/users/seed.sql and db/curriculum/seed.sql first.
-- Existing progress rows are left unchanged.
--   psql "$DATABASE_URL" -f db/progress/seed.sql

BEGIN;

INSERT INTO apprentice_progress (
  user_id,
  personal_xp,
  personal_level,
  xp_into_level,
  xp_for_next_level,
  levels_completed
)
SELECT id, 0, 1, 0, 60, 0
FROM users
WHERE lower(email) = 'chrisvradis00@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO style_progress (
  apprentice_id,
  category_id,
  category_xp,
  current_level,
  average_score,
  levels_completed,
  is_locked,
  is_mastered
)
SELECT
  apprentice.id,
  categories.id,
  0,
  1,
  0,
  0,
  categories.sequence_order > 1,
  false
FROM users AS apprentice
CROSS JOIN categories
WHERE lower(apprentice.email) = 'chrisvradis00@gmail.com'
ON CONFLICT (apprentice_id, category_id) DO NOTHING;

COMMIT;
