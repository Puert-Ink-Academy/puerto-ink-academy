-- Wipes every user and the rows that cannot outlive them.
-- That includes curriculum, submissions, progress, and sign-in sessions,
-- because those foreign keys block a user delete.
-- Does not run unless you execute this file.
--   psql "$DATABASE_URL" -f db/users/reset.sql

BEGIN;

DELETE FROM submission_photos;
DELETE FROM level_progress;
DELETE FROM submissions;
DELETE FROM style_progress;
DELETE FROM level_references;
DELETE FROM level_versions;
DELETE FROM levels;
DELETE FROM categories;
DELETE FROM apprentice_progress;
DELETE FROM accounts;
DELETE FROM sessions;
DELETE FROM verification_tokens;
DELETE FROM users;

COMMIT;
