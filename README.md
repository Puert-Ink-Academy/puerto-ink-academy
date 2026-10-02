# Puerto Ink Academy

A mobile-first, installable web app for training tattoo apprentices. Apprentices work through style categories level by level, submit photos of their practice work, and earn XP from teacher grades. Teachers grade submissions and build the curriculum, and admins manage users on top of everything a teacher can do.

The look is dark-only and "premium gaming": amber accents for apprentices and teachers, violet for admins, emerald for passes, rose for fails and gold for 10/10 mastery.

> **Status:** UI prototype. All data is mock data in `src/lib/mock/`, and nothing is persisted yet. A reload resets any change you make in the app. See [Roadmap](#roadmap).

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router, Server Actions, Turbopack) with React 19 and strict TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com) (`base-nova` style on [Base UI](https://base-ui.com))
- [lucide-react](https://lucide.dev) icons and [sonner](https://sonner.emilkowal.ski) toasts
- [Drizzle ORM](https://orm.drizzle.team) and PostgreSQL (installed, not wired up yet)
- Planned: DigitalOcean Spaces for photo storage, Auth.js email codes for sign-in

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type check |

## Trying it out

Sign in at `/login` with one of the mock accounts. Any 6-digit code works in demo mode.

| Role | Email | Lands on |
| --- | --- | --- |
| Apprentice | `john.doe@puertoink.academy` | `/apprentice/dashboard` |
| Teacher | `jane.smith@puertoink.academy` | `/teacher/dashboard` |
| Admin | `admin@puertoink.academy` | `/admin/dashboard` |

There's no real session yet, so you can also open any route directly.

Good places to look as an apprentice (John Doe):

- `/apprentice/dashboard`: the category hub. Fine Line is active and the other styles are locked in sequence.
- `/apprentice/category/fine-line`: the skill tree. Level 3 wears a gold mastery crown.
- `/apprentice/category/fine-line/level/5`: a failed attempt (6/10) with the retry form.
- `/apprentice/category/fine-line/level/4`: passed (8/10), with a resubmission waiting for review, so uploads are locked.
- `/apprentice/category/fine-line/level/3`: mastered (10/10), with the Mastery Badge.
- `/profile/john-doe`: stats, leaderboard standings, the Evolution Portfolio and the Mastery Showcase.
- `/apprentice/leaderboard`: Global and per-style rankings.

## Features

### Apprentices

- **Category hub:** each style (Fine Line, Realism, Japanese, Traditional, Watercolor) shows a card with its current level, category XP and progress. Styles unlock in order; a style stays grayed out and locked until the one before it is mastered.
- **Skill trees:** each style has its own linear level path. Completed levels show their best score, 10/10 levels get a gold crown, and locked levels can't be opened.
- **Level pages:** the objective, exercise, tips and reference material, then a state-dependent section:
  - not attempted: photo upload and Submit
  - failed (under 8): the score, the teacher's feedback and a retry form
  - passed (8 or 9): "Level Passed!" with a secondary "Resubmit for Better Score (Max 10)"
  - mastered (10): a glowing Mastery Badge, and no more submissions
  - waiting for a grade: the upload zone is locked with a "Pending Teacher Review" notice
- **Attempt history:** every attempt per level, with photos, score, XP and feedback.
- **Leaderboard:** Global and per-style tabs with gold, silver and bronze podiums, a sticky "your rank" banner, and links to profiles.
- **Profiles** (`/profile/[id]`): stats, rank cards per style, an Evolution Portfolio that puts a first attempt next to the best one, and a showcase of every 10/10 earned. Emails are only shown on your own profile.

### Teachers

- **Grading queue:** pending submissions grouped by style, with a grading dialog, a zoomable multi-photo viewer, a 0–10 score picker and feedback.
- **Curriculum builder:** a category accordion with a level table per style, "Create New Level" inside each category, and a "Create Category" dialog.
- **Leaderboard:** the same tabs, read-only.

### Admins

- **Users:** the account list with role management and an "Add user" dialog.
- Everything teachers have: grading, curriculum and leaderboard.

### App shell

- Sidebar on desktop and a bottom tab bar on phones, with role pills and an account menu.
- Installable PWA with generated icons and iOS standalone support.

## Business rules

- **Passing:** a score of 8/10 or higher passes and unlocks the next level.
- **XP:** a passing score earns its score × 10 (10 → 100 XP, 9 → 90, 8 → 80). Below 8 earns 0.
- **Best attempt counts:** resubmitting a passed level can raise its XP to the max, but never stacks or lowers it.
- **Endless attempts:** failed attempts stay in the history and can be retried.
- **Linear and locked:** apprentices can only open completed levels and their active level. Styles unlock in sequence.
- **One submission at a time:** a level with a submission waiting for a grade can't take another. The `submitLevelAttempt` server action enforces this along with the lock and mastery rules, so the UI can't be bypassed.
- **Versioning** (planned): editing a lesson will create a new version in `level_versions`, so past submissions keep their original lesson.

## Project structure

```text
src/
  app/
    (academy)/          role sections: apprentice/, teacher/, admin/, profile/
    actions/            server actions (auth, submissions)
    login/              email-code sign-in
  components/
    apprentice/         category grid, skill tree, level page parts
    teacher/            grading, curriculum builder
    admin/              user management
    leaderboard/        tabs, table, rank banner
    profile/            profile header, stats, standings, portfolio, showcase
    submissions/        photo gallery and fullscreen viewer
    layout/             app shell, navigation, account menu
    ui/                 shadcn/ui components, plus Panel and SectionLabel
  lib/
    mock/               mock data (the stand-in for the database)
    grading.ts          pass, XP, average and mastery rules
    levels.ts           level status and progress helpers
    progression.ts      category mastery and sequential unlocks
    leaderboard.ts      ranking types and math
    session.ts          current user for each role (mock identity for now)
public/mock/            mock submission photos
```

Rules live in `src/lib/`, and `src/lib/mock/` only supplies data. John's category XP, total XP and average score are computed from his attempt history (best score per level), and his ranks, mastery crowns and Evolution Portfolio come from the same data, so the pages stay consistent with each other. The other apprentices' standings are hand-written demo data.

## Roadmap

- Auth.js email-code sign-in with role-protected routes, replacing the demo login
- Drizzle schema and PostgreSQL for users, categories, levels, `level_versions` and attempts
- Photo uploads to DigitalOcean Spaces with a CDN
- Persisting the admin "Add user" flow, the curriculum builder and grading
- An email provider (such as Resend) for sign-in codes and invites
