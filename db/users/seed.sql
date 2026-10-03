-- Test accounts for email sign-in. Safe to run again.
-- Existing emails are left unchanged. This does not update a name or role
-- that is already stored.
--   psql "$DATABASE_URL" -f db/users/seed.sql

BEGIN;

INSERT INTO users (email, name, role, profile_slug)
VALUES
  ('purtoinkacademy@gmail.com', 'Puerto Ink', 'ADMIN', 'puerto-ink'),
  ('christoforosvradis@gmail.com', 'Christoforos Vradis', 'TEACHER', 'christoforos-vradis'),
  ('chrisvradis00@gmail.com', 'Chris Koukos', 'APPRENTICE', 'chris-koukos')
ON CONFLICT ((lower(email))) DO NOTHING;

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

COMMIT;
