-- Signs everyone out and drops unused email codes.
-- Users stay.
--   psql "$DATABASE_URL" -f db/sessions/reset.sql

BEGIN;

DELETE FROM sessions;
DELETE FROM verification_tokens;
DELETE FROM login_code_requests;
DELETE FROM accounts;

COMMIT;
