import { categories, type CategoryId } from "@/lib/mock/categories";
import { getCategoryLessons } from "@/lib/mock/level-lessons";

export function isCategoryMastered(currentLevel: number | undefined, lessonCount: number) {
  return currentLevel !== undefined && currentLevel > lessonCount;
}

export function unlockedCategoryIds(
  currentLevelOf: (categoryId: CategoryId) => number | undefined,
): Set<CategoryId> {
  const unlocked = new Set<CategoryId>();
  for (const category of categories) {
    unlocked.add(category.id);
    const lessonCount = getCategoryLessons(category.id).length;
    if (!isCategoryMastered(currentLevelOf(category.id), lessonCount)) break;
  }
  return unlocked;
}
