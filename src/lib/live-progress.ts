import { averageScore, isPassingScore } from "@/lib/grading";

type LevelRef = { position: number };

type CategoryRef = {
  id: string;
  levels: LevelRef[];
};

type BestScore = {
  categoryId: string;
  position: number;
  bestScore: number | null;
};

type StyleXp = {
  categoryId: string;
  categoryXp: number;
};

export type ApprenticeOverviewInput = {
  personalXp: number;
  styles: StyleXp[];
  bestScores: BestScore[];
  gradedScores: number[];
};

export function apprenticeView<T extends CategoryRef>(
  curriculum: T[],
  overview: ApprenticeOverviewInput,
) {
  const scoreOf = (categoryId: string, position: number) =>
    overview.bestScores.find(
      (row) => row.categoryId === categoryId && row.position === position,
    )?.bestScore;

  const categoryMastered = (category: CategoryRef) =>
    category.levels.length > 0 &&
    category.levels.every((level) => {
      const score = scoreOf(category.id, level.position);
      return score !== null && score !== undefined && isPassingScore(score);
    });

  let previousMastered = true;
  const categories = curriculum.map((category, index) => {
    const isLocked = index > 0 && !previousMastered;
    const mastered = categoryMastered(category);
    if (!mastered) previousMastered = false;

    const positions = [...category.levels].sort((a, b) => a.position - b.position);
    let currentLevel = positions[0]?.position ?? 1;
    for (const level of positions) {
      const score = scoreOf(category.id, level.position);
      if (score === null || score === undefined || !isPassingScore(score)) {
        currentLevel = level.position;
        break;
      }
      currentLevel = level.position + 1;
    }

    const xp = overview.styles.find((style) => style.categoryId === category.id)?.categoryXp ?? 0;
    const started =
      xp > 0 || positions.some((level) => scoreOf(category.id, level.position) != null);

    return {
      category,
      isLocked,
      mastered,
      currentLevel,
      xp,
      started,
      totalLevels: positions.length,
      results: positions.flatMap((level) => {
        const score = scoreOf(category.id, level.position);
        return score === null || score === undefined
          ? []
          : [{ level: level.position, highestScore: score }];
      }),
    };
  });

  const graded = overview.gradedScores;

  return {
    categories,
    stats: {
      xp: overview.personalXp,
      averageScore: averageScore(graded),
      completedExercises: graded.filter((score) => isPassingScore(score)).length,
      failedAttempts: graded.filter((score) => !isPassingScore(score)).length,
      categoriesStarted: categories.filter((category) => category.started && !category.isLocked)
        .length,
      totalCategories: curriculum.length,
    },
  };
}
