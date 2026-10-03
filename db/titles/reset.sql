-- Wipes rank titles. Nothing else points at this table.
--   psql "$DATABASE_URL" -f db/titles/reset.sql

BEGIN;

DELETE FROM titles;

COMMIT;
