import { averageScore, isPassingScore, xpFromBestScores } from "@/lib/grading";
import { categories, type CategoryId } from "@/lib/mock/categories";
import { levelAttempts } from "@/lib/mock/level-attempts";
import { getCategoryResults } from "@/lib/mock/level-results";
import { unlockedCategoryIds } from "@/lib/progression";

export type CategoryProgress = {
  currentLevel: number;
  xp: number;
  started: boolean;
  sequenceOrder: number;
  isLocked: boolean;
};

export const apprenticeCategoryProgress: Partial<
  Record<CategoryId, Pick<CategoryProgress, "currentLevel">>
> = {
  "fine-line": { currentLevel: 5 },
};

const unlockedCategories = unlockedCategoryIds(
  (categoryId) => apprenticeCategoryProgress[categoryId]?.currentLevel,
);

function categoryXp(categoryId: CategoryId): number {
  return xpFromBestScores(getCategoryResults(categoryId).map((result) => result.highestScore));
}

export function getCategoryProgress(categoryId: CategoryId): CategoryProgress {
  const sequenceOrder = categories.find((entry) => entry.id === categoryId)?.sequenceOrder ?? 0;
  const isLocked = !unlockedCategories.has(categoryId);
  const progress = apprenticeCategoryProgress[categoryId];

  return progress
    ? {
        currentLevel: progress.currentLevel,
        xp: categoryXp(categoryId),
        started: true,
        sequenceOrder,
        isLocked,
      }
    : { currentLevel: 1, xp: 0, started: false, sequenceOrder, isLocked };
}

export type ApprenticeDashboardData = {
  xp: number;
  averageScore: number;
  completedExercises: number;
  failedAttempts: number;
  categoriesStarted: number;
  totalCategories: number;
};

const categoryProgress = categories.map((category) => getCategoryProgress(category.id));

export const apprenticeDashboard: ApprenticeDashboardData = {
  xp: categoryProgress.reduce((total, progress) => total + progress.xp, 0),
  averageScore: averageScore(levelAttempts.map((attempt) => attempt.score)),
  completedExercises: levelAttempts.filter((attempt) => isPassingScore(attempt.score)).length,
  failedAttempts: levelAttempts.filter((attempt) => !isPassingScore(attempt.score)).length,
  categoriesStarted: categoryProgress.filter((progress) => progress.started).length,
  totalCategories: categories.length,
};
