import { averageScore, MASTERY_SCORE } from "@/lib/grading";
import {
  rankStandings,
  type ApprenticeStanding,
  type CategoryStanding,
  type EvolutionAttempt,
  type EvolutionEntry,
  type LeaderboardEntry,
  type LeaderboardScope,
  type MasteredLevel,
} from "@/lib/leaderboard";
import { getPlatformUser } from "@/lib/mock/admin-users";
import {
  apprenticeCategoryProgress,
  apprenticeDashboard,
  getCategoryProgress,
} from "@/lib/mock/apprentice-dashboard";
import { categoryIds, type CategoryId } from "@/lib/mock/categories";
import { levelAttempts, type LevelAttempt } from "@/lib/mock/level-attempts";
import { mockPhotos } from "@/lib/mock/photos";

function currentUserAverage(categoryId: CategoryId): number {
  return averageScore(
    levelAttempts
      .filter((attempt) => attempt.categoryId === categoryId)
      .map((attempt) => attempt.score),
  );
}

const currentUserCategories: Partial<Record<CategoryId, CategoryStanding>> = {};
for (const categoryId of categoryIds) {
  if (apprenticeCategoryProgress[categoryId]) {
    const progress = getCategoryProgress(categoryId);
    currentUserCategories[categoryId] = {
      level: progress.currentLevel,
      xp: progress.xp,
      averageScore: currentUserAverage(categoryId),
    };
  }
}

const currentUserMastered: MasteredLevel[] = [];
for (const attempt of levelAttempts) {
  const known = currentUserMastered.some(
    (entry) => entry.categoryId === attempt.categoryId && entry.level === attempt.level,
  );
  if (attempt.score === MASTERY_SCORE && !known) {
    currentUserMastered.push({ categoryId: attempt.categoryId, level: attempt.level });
  }
}

function evolutionAttempt(attempt: LevelAttempt): EvolutionAttempt | undefined {
  const [photo] = attempt.photos;
  return photo && { score: attempt.score, date: attempt.submittedAt, photo };
}

const attemptsByLevel = new Map<string, LevelAttempt[]>();
for (const attempt of levelAttempts) {
  const key = `${attempt.categoryId}:${attempt.level}`;
  attemptsByLevel.set(key, [...(attemptsByLevel.get(key) ?? []), attempt]);
}

const currentUserEvolution: EvolutionEntry[] = [];
for (const attempts of attemptsByLevel.values()) {
  const firstAttempt = attempts.reduce((low, attempt) =>
    attempt.attempt < low.attempt ? attempt : low,
  );
  const bestAttempt = attempts.reduce((top, attempt) =>
    attempt.score > top.score ? attempt : top,
  );
  const first = evolutionAttempt(firstAttempt);
  const best = evolutionAttempt(bestAttempt);
  if (first && best && best.score > first.score) {
    currentUserEvolution.push({
      categoryId: firstAttempt.categoryId,
      level: firstAttempt.level,
      first,
      best,
    });
  }
}

// A mastered category has `level` one past its last lesson (Fine Line 11, the others 6).
export const apprenticeStandings: ApprenticeStanding[] = [
  {
    id: "marco",
    name: "Marco",
    averageScore: 9.7,
    categories: {
      "fine-line": { level: 11, xp: 3000, averageScore: 9.8 },
      realism: { level: 6, xp: 2000, averageScore: 9.6 },
      japanese: { level: 6, xp: 2000, averageScore: 9.7 },
      traditional: { level: 2, xp: 850, averageScore: 9.5 },
    },
    masteredLevels: [
      { categoryId: "fine-line", level: 3 },
      { categoryId: "fine-line", level: 7 },
      { categoryId: "fine-line", level: 9 },
      { categoryId: "realism", level: 2 },
      { categoryId: "japanese", level: 4 },
    ],
    evolution: [
      {
        categoryId: "realism",
        level: 2,
        first: { score: 7, date: "Jun 3, 2026", photo: mockPhotos.whipShading },
        best: { score: 10, date: "Jun 11, 2026", photo: mockPhotos.gradientShading },
      },
    ],
  },
  {
    id: "alex",
    name: "Alex",
    averageScore: 9.4,
    categories: {
      "fine-line": { level: 11, xp: 3400, averageScore: 9.2 },
      realism: { level: 5, xp: 3520, averageScore: 9.6 },
    },
    masteredLevels: [
      { categoryId: "fine-line", level: 1 },
      { categoryId: "fine-line", level: 6 },
      { categoryId: "realism", level: 3 },
    ],
    evolution: [
      {
        categoryId: "fine-line",
        level: 6,
        first: { score: 6, date: "Apr 9, 2026", photo: mockPhotos.evolutionRough },
        best: { score: 10, date: "Apr 21, 2026", photo: mockPhotos.liningDrills },
      },
    ],
  },
  {
    id: "mike",
    name: "Mike",
    averageScore: 9.1,
    categories: {
      "fine-line": { level: 11, xp: 4100, averageScore: 9.1 },
      realism: { level: 6, xp: 1900, averageScore: 9.2 },
      japanese: { level: 2, xp: 400, averageScore: 8.9 },
    },
    masteredLevels: [
      { categoryId: "fine-line", level: 2 },
      { categoryId: "fine-line", level: 4 },
      { categoryId: "fine-line", level: 8 },
      { categoryId: "fine-line", level: 10 },
    ],
    evolution: [
      {
        categoryId: "fine-line",
        level: 8,
        first: { score: 7, date: "May 2, 2026", photo: mockPhotos.whipShading },
        best: { score: 10, date: "May 9, 2026", photo: mockPhotos.gradientShading },
      },
    ],
  },
  {
    id: "john-doe",
    name: "John Doe",
    averageScore: apprenticeDashboard.averageScore,
    isCurrentUser: true,
    categories: currentUserCategories,
    masteredLevels: currentUserMastered,
    evolution: currentUserEvolution,
  },
  {
    id: "sofia",
    name: "Sofia",
    averageScore: 8.9,
    categories: {
      "fine-line": { level: 9, xp: 4280, averageScore: 8.9 },
    },
    masteredLevels: [{ categoryId: "fine-line", level: 5 }],
    evolution: [],
  },
  {
    id: "diego",
    name: "Diego",
    averageScore: 8.4,
    categories: {
      "fine-line": { level: 8, xp: 3610, averageScore: 8.4 },
    },
    masteredLevels: [{ categoryId: "fine-line", level: 2 }],
    evolution: [],
  },
  {
    id: "lena",
    name: "Lena",
    averageScore: 8.7,
    categories: {
      "fine-line": { level: 11, xp: 2000, averageScore: 8.6 },
      realism: { level: 3, xp: 740, averageScore: 8.8 },
    },
    masteredLevels: [
      { categoryId: "fine-line", level: 1 },
      { categoryId: "realism", level: 1 },
    ],
    evolution: [
      {
        categoryId: "fine-line",
        level: 1,
        first: { score: 8, date: "Feb 6, 2026", photo: mockPhotos.liningDrills },
        best: { score: 10, date: "Feb 14, 2026", photo: mockPhotos.evolutionClean },
      },
    ],
  },
  {
    id: "kai",
    name: "Kai",
    averageScore: 8.2,
    categories: {
      "fine-line": { level: 6, xp: 2150, averageScore: 8.2 },
    },
    masteredLevels: [],
    evolution: [],
  },
  {
    id: "nora",
    name: "Nora",
    averageScore: 8.6,
    categories: {
      "fine-line": { level: 4, xp: 1480, averageScore: 8.6 },
    },
    masteredLevels: [{ categoryId: "fine-line", level: 1 }],
    evolution: [],
  },
  {
    id: "theo",
    name: "Theo",
    averageScore: 8.0,
    categories: {
      "fine-line": { level: 2, xp: 900, averageScore: 8.0 },
    },
    masteredLevels: [],
    evolution: [],
  },
];

export function getRanking(scope: LeaderboardScope): LeaderboardEntry[] {
  return rankStandings(apprenticeStandings, scope).map((entry) => ({
    ...entry,
    nationality: getPlatformUser(entry.id)?.nationality,
  }));
}

export function getRankings(): Record<LeaderboardScope, LeaderboardEntry[]> {
  return {
    global: getRanking("global"),
    "fine-line": getRanking("fine-line"),
    realism: getRanking("realism"),
    japanese: getRanking("japanese"),
    traditional: getRanking("traditional"),
    watercolor: getRanking("watercolor"),
  };
}
