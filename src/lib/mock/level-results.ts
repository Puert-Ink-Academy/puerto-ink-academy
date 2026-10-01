import { isPassingScore } from "@/lib/grading";
import type { CategoryId } from "@/lib/mock/categories";
import { getLevelAttempts, levelAttempts } from "@/lib/mock/level-attempts";

export type LevelResult = {
  level: number;
  score: number;
  attempts: number;
  feedback: string;
};

export function getLevelResult(
  categoryId: CategoryId,
  level: number,
): LevelResult | undefined {
  const attempts = getLevelAttempts(categoryId, level);
  const passing = attempts.find((attempt) => isPassingScore(attempt.score));
  if (!passing) return undefined;

  return {
    level,
    score: passing.score,
    attempts: attempts.length,
    feedback: passing.feedback,
  };
}

export function getCategoryResults(categoryId: CategoryId): LevelResult[] {
  const levels = new Set(
    levelAttempts
      .filter((attempt) => attempt.categoryId === categoryId)
      .map((attempt) => attempt.level),
  );

  return [...levels]
    .sort((a, b) => a - b)
    .flatMap((level) => getLevelResult(categoryId, level) ?? []);
}
