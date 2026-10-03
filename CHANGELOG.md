# Changelog

## Unreleased

### Added

- A sign-in code can be requested once a minute for each email. The login form shows how long is left.
- Entering the code opens the sign-in address in the browser, so the session cookie is stored and the role dashboard loads.
- A signed-in visit to `/login` goes to that role's dashboard. Profiles keep the viewer's own navigation.

### Changed

- Sign-in mail is sent as Puerto Ink Academy. Gmail still shows the name set on that Google account.

### Database

- `db/login-code-requests.sql` adds `login_code_requests`. It has been applied to the live database.
- The admin account email is `purtoinkacademy@gmail.com`. The live row was updated, and `db/users/seed.sql` matches it.

## [0.2.0] - 2026-10-03

### Added

- Email one-time-code sign-in with Auth.js, the Drizzle adapter, and Gmail SMTP. Only an email that already exists in `users` can request a code.
- Auth.js columns on `users` (`email_verified`, `image`) and tables `accounts`, `sessions`, and `verification_tokens`.
- The signed-in user's id and role are read from the database session. Academy pages redirect to `/login` when there is no session.
- Reset and seed SQL, grouped by directory and not run unless noted below: `db/users/`, `db/curriculum/`, `db/submissions/`, `db/progress/`, `db/sessions/` (reset only), and `db/titles/`.

### Database

- `db/auth.sql` is the one-time update for a database created from `db/schema.sql`. It has been applied to the live database.
- `db/users/seed.sql` has been applied. It added the admin, teacher, and apprentice test accounts. Running it again leaves those rows unchanged.
- `drizzle/0000_flashy_lady_bullseye.sql` is a Drizzle Kit baseline of the whole schema. It is marked so it stops if executed. Do not run it on the live database.

### Environment

Sign-in needs these values in `.env.local`:

- `AUTH_SECRET`
- `AUTH_URL`
- `AUTH_TRUST_HOST`
- `EMAIL_SERVER_HOST`
- `EMAIL_SERVER_PORT`
- `EMAIL_SERVER_USER`
- `EMAIL_SERVER_PASSWORD`
- `EMAIL_FROM`
