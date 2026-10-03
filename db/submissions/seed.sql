-- One pending Fine Line attempt for the seeded apprentice.
-- Run db/users/seed.sql and db/curriculum/seed.sql first.
-- The photo is a placeholder. It is not a file in Spaces.
-- Safe to run again.
--   psql "$DATABASE_URL" -f db/submissions/seed.sql

BEGIN;

INSERT INTO submissions (
  id,
  apprentice_id,
  level_id,
  level_version_id,
  attempt_number,
  status
)
SELECT
  '14000000-0000-4000-8000-000000000001',
  apprentice.id,
  '11000000-0000-4000-8000-000000000001',
  '12000000-0000-4000-8000-000000000001',
  1,
  'pending'
FROM users AS apprentice
WHERE lower(apprentice.email) = 'chrisvradis00@gmail.com'
ON CONFLICT (id) DO NOTHING;

INSERT INTO submission_photos (
  id,
  submission_id,
  sort_order,
  url,
  object_key,
  alt,
  width,
  height
)
SELECT
  '15000000-0000-4000-8000-000000000001',
  '14000000-0000-4000-8000-000000000001',
  0,
  'https://example.com/seed/studio-hygiene.jpg',
  'submissions/14000000-0000-4000-8000-000000000001/15000000-0000-4000-8000-000000000001',
  'Wrapped station',
  1200,
  1600
WHERE EXISTS (
  SELECT 1
  FROM submissions
  WHERE id = '14000000-0000-4000-8000-000000000001'
)
ON CONFLICT (id) DO NOTHING;

COMMIT;
