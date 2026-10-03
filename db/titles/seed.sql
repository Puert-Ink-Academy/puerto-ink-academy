-- Starting rank names, looked up later by personal level.
-- Edit the names before you rely on them in the product.
-- Safe to run again.
--   psql "$DATABASE_URL" -f db/titles/seed.sql

BEGIN;

INSERT INTO titles (name, min_personal_level)
VALUES
  ('Apprentice', 1),
  ('Artist', 5),
  ('Mentor', 10)
ON CONFLICT (min_personal_level) DO NOTHING;

COMMIT;
