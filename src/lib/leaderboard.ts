import type { CountryCode } from "@/lib/countries";
import type { CategoryId } from "@/lib/mock/categories";
import type { SubmissionPhoto } from "@/lib/mock/photos";
import { unlockedCategoryIds } from "@/lib/progression";

export type CategoryStanding = {
  level: number;
  xp: number;
  averageScore: number;
};

export type MasteredLevel = {
  categoryId: CategoryId;
  level: number;
};

export type EvolutionAttempt = {
  score: number;
  /** ISO 8601 date. */
  date: string;
  photo: SubmissionPhoto;
};

export type EvolutionEntry = {
  categoryId: CategoryId;
  level: number;
  first: EvolutionAttempt;
  best: EvolutionAttempt;
};

export type ApprenticeStanding = {
  id: string;
  name: string;
  averageScore: number;
  isCurrentUser?: boolean;
  categories: Partial<Record<CategoryId, CategoryStanding>>;
  masteredLevels: MasteredLevel[];
  evolution: EvolutionEntry[];
};

export type LeaderboardScope = CategoryId;

export const leaderboardScopes: LeaderboardScope[] = ["fine-line", "realism", "traditional"];

export type LeaderboardEntry = {
  rank: number;
  id: string;
  name: string;
  level: number;
  xp: number;
  averageScore: number;
  isCurrentUser?: boolean;
  nationality?: CountryCode;
};

export function unlockedCategories(standing: ApprenticeStanding): Set<CategoryId> {
  return unlockedCategoryIds((categoryId) => standing.categories[categoryId]?.level);
}

export function unlockedTotals(standing: ApprenticeStanding): { xp: number; levelsCompleted: number } {
  const stats = [...unlockedCategories(standing)].flatMap((id) => standing.categories[id] ?? []);
  return {
    xp: stats.reduce((total, stat) => total + stat.xp, 0),
    levelsCompleted: stats.reduce((total, stat) => total + stat.level - 1, 0),
  };
}

function toUnranked(
  standing: ApprenticeStanding,
  scope: LeaderboardScope,
): Omit<LeaderboardEntry, "rank"> | null {
  const base = { id: standing.id, name: standing.name, isCurrentUser: standing.isCurrentUser };

  const stat = unlockedCategories(standing).has(scope) ? standing.categories[scope] : undefined;
  if (!stat || stat.xp === 0) return null;
  return { ...base, level: stat.level, xp: stat.xp, averageScore: stat.averageScore };
}

export function rankStandings(
  standings: ApprenticeStanding[],
  scope: LeaderboardScope,
): LeaderboardEntry[] {
  return standings
    .map((standing) => toUnranked(standing, scope))
    .filter((entry): entry is Omit<LeaderboardEntry, "rank"> => entry !== null)
    .sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}
