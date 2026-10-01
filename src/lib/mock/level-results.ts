import { xpForScore } from "@/lib/grading";
import type { CategoryId } from "@/lib/mock/categories";
import { getLevelAttempts, levelAttempts } from "@/lib/mock/level-attempts";

export type LevelResult = {
  level: number;
  highestScore: number;
  xp: number;
  attempts: number;
  feedback: string;
  latestScore: number;
  latestFeedback: string;
};

export function getLevelResult(
  categoryId: CategoryId,
  level: number,
): LevelResult | undefined {
  const attempts = getLevelAttempts(categoryId, level);
  const [latest] = attempts;
  if (!latest) return undefined;

  const best = attempts.reduce((top, attempt) => (attempt.score > top.score ? attempt : top));

  return {
    level,
    highestScore: best.score,
    xp: xpForScore(best.score),
    attempts: attempts.length,
    feedback: best.feedback,
    latestScore: latest.score,
    latestFeedback: latest.feedback,
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
