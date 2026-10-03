import "server-only";

import { and, asc, desc, eq, gt, sql } from "drizzle-orm";

import { db } from "@/db/index";
import {
  apprenticeProgress,
  levelProgress,
  levels,
  loginCodeRequests,
  styleProgress,
  submissions,
  users,
} from "@/db/schema";

export async function getCurriculum() {
  const categories = await db.query.categories.findMany({
    orderBy: (category, { asc: orderAsc }) => [orderAsc(category.sequenceOrder)],
    with: {
      levels: {
        orderBy: (level, { asc: orderAsc }) => [orderAsc(level.position)],
        with: {
          currentVersion: {
            with: {
              references: {
                orderBy: (reference, { asc: orderAsc }) => [orderAsc(reference.sortOrder)],
              },
            },
          },
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    tagline: category.tagline,
    sequenceOrder: category.sequenceOrder,
    levels: category.levels.map((level) => ({
      id: level.id,
      position: level.position,
      version: {
        id: level.currentVersion.id,
        versionNumber: level.currentVersion.versionNumber,
        title: level.currentVersion.title,
        objective: level.currentVersion.objective,
        exercise: level.currentVersion.exercise,
        tips: level.currentVersion.tips,
        references: level.currentVersion.references.map((reference) => ({
          id: reference.id,
          label: reference.label,
          sortOrder: reference.sortOrder,
          url: reference.url,
          objectKey: reference.objectKey,
          alt: reference.alt,
          width: reference.width,
          height: reference.height,
        })),
      },
    })),
  }));
}

export async function getPendingSubmissions() {
  const rows = await db.query.submissions.findMany({
    where: eq(submissions.status, "pending"),
    orderBy: (submission, { asc: orderAsc }) => [orderAsc(submission.submittedAt)],
    with: {
      photos: {
        orderBy: (photo, { asc: orderAsc }) => [orderAsc(photo.sortOrder)],
      },
      apprentice: {
        with: { progress: true },
      },
      claimer: true,
      levelVersion: true,
      level: {
        with: { category: true },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    apprenticeId: row.apprenticeId,
    apprenticeName: row.apprentice.name,
    personalLevel: row.apprentice.progress?.personalLevel ?? 1,
    claimedByName: row.claimer?.name ?? null,
    categoryId: row.level.category.id,
    categoryName: row.level.category.name,
    categorySlug: row.level.category.slug,
    levelPosition: row.level.position,
    lessonTitle: row.levelVersion.title,
    submittedAt: row.submittedAt,
    claimedBy: row.claimedBy,
    claimedAt: row.claimedAt,
    photos: row.photos.map((photo) => ({
      id: photo.id,
      url: photo.url,
      objectKey: photo.objectKey,
      alt: photo.alt,
      width: photo.width,
      height: photo.height,
      sortOrder: photo.sortOrder,
    })),
  }));
}

/**
 * @param userId Apprentice id. TODO(auth): pass the session user instead of a hardcoded id.
 */
export async function getApprenticeOverview(userId: string) {
  const [progress, styles, bestScores, graded] = await Promise.all([
    db.query.apprenticeProgress.findFirst({
      where: eq(apprenticeProgress.userId, userId),
    }),
    db.query.styleProgress.findMany({
      where: eq(styleProgress.apprenticeId, userId),
    }),
    db
      .select({
        categoryId: levels.categoryId,
        position: levels.position,
        bestScore: levelProgress.bestScore,
      })
      .from(levelProgress)
      .innerJoin(levels, eq(levels.id, levelProgress.levelId))
      .where(eq(levelProgress.apprenticeId, userId)),
    db
      .select({ score: submissions.score })
      .from(submissions)
      .where(and(eq(submissions.apprenticeId, userId), eq(submissions.status, "graded"))),
  ]);

  return {
    personalXp: progress?.personalXp ?? 0,
    personalLevel: progress?.personalLevel ?? 1,
    xpIntoLevel: progress?.xpIntoLevel ?? 0,
    xpForNextLevel: progress?.xpForNextLevel ?? 60,
    levelsCompleted: progress?.levelsCompleted ?? 0,
    styles: styles.map((style) => ({
      categoryId: style.categoryId,
      categoryXp: style.categoryXp,
      currentLevel: style.currentLevel,
      isLocked: style.isLocked,
      isMastered: style.isMastered,
    })),
    bestScores: bestScores.map((row) => ({
      categoryId: row.categoryId,
      position: row.position,
      bestScore: row.bestScore,
    })),
    gradedScores: graded.flatMap((row) => (row.score === null ? [] : [row.score])),
  };
}

/**
 * @param userId Apprentice id. TODO(auth): pass the session user instead of a hardcoded id.
 */
export async function getApprenticeLevel(
  userId: string,
  categoryId: string,
  levelPosition: number,
) {
  const [progress, style, level] = await Promise.all([
    db.query.apprenticeProgress.findFirst({
      where: eq(apprenticeProgress.userId, userId),
    }),
    db.query.styleProgress.findFirst({
      where: and(eq(styleProgress.apprenticeId, userId), eq(styleProgress.categoryId, categoryId)),
    }),
    db.query.levels.findFirst({
      where: and(eq(levels.categoryId, categoryId), eq(levels.position, levelPosition)),
    }),
  ]);

  const attempts = level
    ? await db.query.submissions.findMany({
        where: and(eq(submissions.apprenticeId, userId), eq(submissions.levelId, level.id)),
        orderBy: (submission, { asc: orderAsc }) => [orderAsc(submission.attemptNumber)],
        with: {
          photos: {
            orderBy: (photo, { asc: orderAsc }) => [orderAsc(photo.sortOrder)],
          },
        },
      })
    : [];

  return {
    currentLevel: style?.currentLevel ?? null,
    categoryXp: style?.categoryXp ?? null,
    personalXp: progress?.personalXp ?? null,
    personalLevel: progress?.personalLevel ?? null,
    xpIntoLevel: progress?.xpIntoLevel ?? null,
    xpForNextLevel: progress?.xpForNextLevel ?? null,
    attempts: attempts.map((attempt) => ({
      id: attempt.id,
      attemptNumber: attempt.attemptNumber,
      status: attempt.status,
      submittedAt: attempt.submittedAt,
      score: attempt.score,
      feedback: attempt.feedback,
      awardedXp: attempt.awardedXp,
      photos: attempt.photos.map((photo) => ({
        id: photo.id,
        url: photo.url,
        objectKey: photo.objectKey,
        alt: photo.alt,
        width: photo.width,
        height: photo.height,
        sortOrder: photo.sortOrder,
      })),
    })),
  };
}

export async function getLeaderboard(categoryId: string) {
  const rows = await db
    .select({
      id: users.id,
      slug: users.profileSlug,
      name: users.name,
      nationality: users.nationality,
      level: styleProgress.currentLevel,
      xp: styleProgress.categoryXp,
      averageScore: styleProgress.averageScore,
      personalXp: apprenticeProgress.personalXp,
      personalLevel: apprenticeProgress.personalLevel,
    })
    .from(styleProgress)
    .innerJoin(users, eq(users.id, styleProgress.apprenticeId))
    .innerJoin(apprenticeProgress, eq(apprenticeProgress.userId, styleProgress.apprenticeId))
    .where(
      and(
        eq(styleProgress.categoryId, categoryId),
        eq(styleProgress.isLocked, false),
        gt(styleProgress.categoryXp, 0),
      ),
    )
    .orderBy(desc(styleProgress.categoryXp), asc(users.name));

  return rows.map((row, index) => ({
    rank: index + 1,
    ...row,
  }));
}

const authUserColumns = {
  id: users.id,
  email: users.email,
  emailVerified: users.emailVerified,
  image: users.image,
  name: users.name,
  role: users.role,
  artistName: users.artistName,
};

export async function getUserByEmail(email: string) {
  const [row] = await db
    .select(authUserColumns)
    .from(users)
    .where(sql`lower(${users.email}) = ${email}`)
    .limit(1);

  return row ?? null;
}

export async function getUserById(id: string) {
  const [row] = await db.select(authUserColumns).from(users).where(eq(users.id, id)).limit(1);

  return row ?? null;
}

const LOGIN_CODE_COOLDOWN_MS = 60_000;

export async function claimLoginCodeRequest(
  email: string,
): Promise<{ ok: true } | { ok: false; retryAfterSeconds: number }> {
  const claimed = await db.execute<{ requested_at: Date | string }>(sql`
    INSERT INTO login_code_requests (identifier, requested_at)
    VALUES (${email}, now())
    ON CONFLICT (identifier) DO UPDATE
    SET requested_at = now()
    WHERE login_code_requests.requested_at <= now() - interval '1 minute'
    RETURNING requested_at
  `);

  if (claimed.length > 0) return { ok: true };

  const [existing] = await db
    .select({ requestedAt: loginCodeRequests.requestedAt })
    .from(loginCodeRequests)
    .where(eq(loginCodeRequests.identifier, email))
    .limit(1);

  const elapsed = existing ? Date.now() - existing.requestedAt.getTime() : 0;
  const retryAfterSeconds = Math.min(
    60,
    Math.max(1, Math.ceil((LOGIN_CODE_COOLDOWN_MS - elapsed) / 1000)),
  );

  return { ok: false, retryAfterSeconds };
}
