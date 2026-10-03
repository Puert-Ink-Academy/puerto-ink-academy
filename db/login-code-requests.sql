-- Apply once to a database created before login-code cooldowns existed.
--   psql "$DATABASE_URL" -f db/login-code-requests.sql

BEGIN;

CREATE TABLE IF NOT EXISTS login_code_requests (
  identifier text PRIMARY KEY,
  requested_at timestamptz NOT NULL
);

COMMIT;
