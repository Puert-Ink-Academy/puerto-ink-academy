import { isPassingScore } from "@/lib/grading";
import { categories, getPreviousCategory, type CategoryId } from "@/lib/mock/categories";
import { levelAttempts } from "@/lib/mock/level-attempts";
import { getCategoryLessons } from "@/lib/mock/level-lessons";

export type CategoryProgress = {
  currentLevel: number;
  xp: number;
  started: boolean;
  sequenceOrder: number;
  isLocked: boolean;
};

export const apprenticeCategoryProgress: Partial<
  Record<CategoryId, Pick<CategoryProgress, "currentLevel" | "xp">>
> = {
  "fine-line": { currentLevel: 5, xp: 3900 },
};

function isMastered(categoryId: CategoryId): boolean {
  const progress = apprenticeCategoryProgress[categoryId];
  return progress !== undefined && progress.currentLevel > getCategoryLessons(categoryId).length;
}

export function getCategoryProgress(categoryId: CategoryId): CategoryProgress {
  const sequenceOrder = categories.find((entry) => entry.id === categoryId)?.sequenceOrder ?? 0;
  const previous = getPreviousCategory(categoryId);
  const isLocked = previous !== undefined && !isMastered(previous.id);
  const progress = apprenticeCategoryProgress[categoryId];

  return progress
    ? { ...progress, started: true, sequenceOrder, isLocked }
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
  averageScore: 8.5,
  completedExercises: levelAttempts.filter((attempt) => isPassingScore(attempt.score)).length,
  failedAttempts: levelAttempts.filter((attempt) => !isPassingScore(attempt.score)).length,
  categoriesStarted: categoryProgress.filter((progress) => progress.started).length,
  totalCategories: categories.length,
};
