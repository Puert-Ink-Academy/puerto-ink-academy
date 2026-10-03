-- Wipes styles, levels, lesson versions, and reference rows.
-- Submissions and style progress point at those rows, so they are cleared too.
-- Users stay.
--   psql "$DATABASE_URL" -f db/curriculum/reset.sql

BEGIN;

DELETE FROM submission_photos;
DELETE FROM level_progress;
DELETE FROM submissions;
DELETE FROM style_progress;
DELETE FROM level_references;
DELETE FROM level_versions;
DELETE FROM levels;
DELETE FROM categories;

COMMIT;
