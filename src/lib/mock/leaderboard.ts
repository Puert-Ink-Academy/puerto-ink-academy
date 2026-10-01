import { apprenticeCategoryProgress, apprenticeDashboard } from "@/lib/mock/apprentice-dashboard";
import { categories, categoryIds, type CategoryId } from "@/lib/mock/categories";
import { levelAttempts } from "@/lib/mock/level-attempts";
import { getCategoryLessons } from "@/lib/mock/level-lessons";

export type CategoryStanding = {
  level: number;
  xp: number;
  averageScore: number;
};

export type ApprenticeStanding = {
  id: string;
  name: string;
  averageScore: number;
  isCurrentUser?: boolean;
  categories: Partial<Record<CategoryId, CategoryStanding>>;
};

export type LeaderboardScope = "global" | CategoryId;

export const leaderboardScopes: LeaderboardScope[] = [
  "global",
  "fine-line",
  "realism",
  "traditional",
];

export type LeaderboardEntry = {
  rank: number;
  name: string;
  level: number;
  xp: number;
  averageScore: number;
  isCurrentUser?: boolean;
};

function currentUserAverage(categoryId: CategoryId): number {
  const scores = levelAttempts
    .filter((attempt) => attempt.categoryId === categoryId)
    .map((attempt) => attempt.score);
  if (scores.length === 0) return apprenticeDashboard.averageScore;
  return scores.reduce((total, score) => total + score, 0) / scores.length;
}

const currentUserCategories: Partial<Record<CategoryId, CategoryStanding>> = {};
for (const categoryId of categoryIds) {
  const progress = apprenticeCategoryProgress[categoryId];
  if (progress) {
    currentUserCategories[categoryId] = {
      level: progress.currentLevel,
      xp: progress.xp,
      averageScore: currentUserAverage(categoryId),
    };
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
  },
  {
    id: "alex",
    name: "Alex",
    averageScore: 9.4,
    categories: {
      "fine-line": { level: 11, xp: 3400, averageScore: 9.2 },
      realism: { level: 5, xp: 3520, averageScore: 9.6 },
    },
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
  },
  {
    id: "john-doe",
    name: "John Doe",
    averageScore: apprenticeDashboard.averageScore,
    isCurrentUser: true,
    categories: currentUserCategories,
  },
  {
    id: "sofia",
    name: "Sofia",
    averageScore: 8.9,
    categories: {
      "fine-line": { level: 9, xp: 4280, averageScore: 8.9 },
    },
  },
  {
    id: "diego",
    name: "Diego",
    averageScore: 8.4,
    categories: {
      "fine-line": { level: 8, xp: 3610, averageScore: 8.4 },
    },
  },
  {
    id: "lena",
    name: "Lena",
    averageScore: 8.7,
    categories: {
      "fine-line": { level: 11, xp: 2000, averageScore: 8.6 },
      realism: { level: 3, xp: 740, averageScore: 8.8 },
    },
  },
  {
    id: "kai",
    name: "Kai",
    averageScore: 8.2,
    categories: {
      "fine-line": { level: 6, xp: 2150, averageScore: 8.2 },
    },
  },
  {
    id: "nora",
    name: "Nora",
    averageScore: 8.6,
    categories: {
      "fine-line": { level: 4, xp: 1480, averageScore: 8.6 },
    },
  },
  {
    id: "theo",
    name: "Theo",
    averageScore: 8.0,
    categories: {
      "fine-line": { level: 2, xp: 900, averageScore: 8.0 },
    },
  },
];

function unlockedStats(
  standing: ApprenticeStanding,
): Partial<Record<CategoryId, CategoryStanding>> {
  const unlocked: Partial<Record<CategoryId, CategoryStanding>> = {};
  for (const category of categories) {
    const stat = standing.categories[category.id];
    if (!stat) break;
    unlocked[category.id] = stat;
    if (stat.level <= getCategoryLessons(category.id).length) break;
  }
  return unlocked;
}

function toUnranked(
  standing: ApprenticeStanding,
  scope: LeaderboardScope,
): Omit<LeaderboardEntry, "rank"> | null {
  const base = { name: standing.name, isCurrentUser: standing.isCurrentUser };
  const stats = unlockedStats(standing);

  if (scope === "global") {
    const values = Object.values(stats);
    return {
      ...base,
      level: values.reduce((total, stat) => total + stat.level - 1, 0),
      xp: values.reduce((total, stat) => total + stat.xp, 0),
      averageScore: standing.averageScore,
    };
  }

  const stat = stats[scope];
  if (!stat || stat.xp === 0) return null;
  return { ...base, level: stat.level, xp: stat.xp, averageScore: stat.averageScore };
}

export function getRanking(scope: LeaderboardScope): LeaderboardEntry[] {
  return apprenticeStandings
    .map((standing) => toUnranked(standing, scope))
    .filter((entry): entry is Omit<LeaderboardEntry, "rank"> => entry !== null)
    .sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
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
