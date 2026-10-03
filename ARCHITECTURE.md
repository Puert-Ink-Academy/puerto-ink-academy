# Architecture

Puerto Ink Academy is a Next.js App Router app. Server components read Postgres through Drizzle. Client components handle interaction only.

## Routes

`src/app/` holds routes, layouts, and metadata.

- `src/app/page.tsx` is the public landing page. It still uses mock previews.
- `src/app/login/page.tsx` is the demo email-code sign-in. It still uses mock users.
- `src/app/(academy)/` is the signed-in shell. Layouts split `apprentice`, `teacher`, `admin`, and `profile`.
- `src/app/actions/` holds Server Actions (`auth`, `locale`, `profile`, `submissions`).
- `src/app/flags/[code]/route.ts` serves nationality flag SVGs. Flags are not stored in Spaces.

## UI

`src/components/ui/` holds shared primitives (button, dialog, panel, table, and the rest of the shadcn set).

Feature UI is grouped by who uses it:

- `apprentice` for the dashboard, skill tree, and level submission
- `teacher` for grading and the curriculum builder
- `admin` for the user directory
- `leaderboard` for the per-style board
- `profile` for the public profile
- `feedback` for skeletons and empty states
- `layout` for the sidebar, mobile nav, and user menu
- `submissions` for the photo viewer
- `auth` for the login form
- `home` for the landing page
- `brand` for the wordmark
- `i18n` for the language switcher

A skeleton lives next to the screen it stands in for, under `feedback`. It matches the filled layout: stat cards and style cards on the dashboard, level rows on a skill tree, table rows on a leaderboard, submission rows on the grading queue.

## Database

`db/schema.sql` is the SQL applied to PostgreSQL. `src/db/schema.ts` is the Drizzle map of that file. `src/db/index.ts` opens one `postgres` pool from `DATABASE_URL` and is server-only. `src/db/queries.ts` is the read layer: curriculum, pending submissions, apprentice overview, one level's attempts, and a per-style leaderboard.

Do not run `drizzle-kit push` against the live database unless a migration is explicitly requested. Change `db/schema.sql` and `src/db/schema.ts` together.

Image bytes go to DigitalOcean Spaces. `submission_photos` and `level_references` store `url` and `object_key`. Object keys use the row ids: `submissions/{submissionId}/{photoId}` and `references/{levelVersionId}/{referenceId}`.

## Domain rules

`src/lib/` holds pure functions and shared types, grouped by domain. There are no barrel files.

- `auth/` holds the database session, the signed-in user, and email normalization.
- `curriculum/` holds shared styles, levels, and the level form.
- `progress/` holds the pass line, XP, the personal-level curve, stored level state, and per-style rankings. `grading.ts` is the 8/10 pass line and the XP formula. `live-progress.ts` turns stored scores into locked, active, and completed levels. `personal-level.ts` is the account-level curve.
- `people/` holds roles, artist details, profile slugs, the user directory, and countries.
- `slug.ts`, `nav.ts`, `logger.ts`, `page-metadata.ts`, `pwa-icon.tsx`, and `utils.ts` stay at the root.

`src/lib/mock/` remains for the landing preview, public profile, and screens that are not on the database yet. New screens do not add files there.

## Language

`src/messages/` has `en-US`, `de`, `fr`, `el`, `it`, and `es`. `src/i18n/` wires the cookie locale. A new user-facing string goes in all six catalogs. Lesson text and rank-title names are product content in one language. Buttons and labels follow the language switcher.
