import { isPassingScore } from "@/lib/grading";
import { getLevelAttempts, levelAttempts } from "@/lib/mock/level-attempts";

export type LevelResult = {
  level: number;
  score: number;
  attempts: number;
  feedback: string;
};

function resultForLevel(level: number): LevelResult | undefined {
  const attempts = getLevelAttempts(level);
  const passing = attempts.find((attempt) => isPassingScore(attempt.score));
  if (!passing) return undefined;

  return {
    level,
    score: passing.score,
    attempts: attempts.length,
    feedback: passing.feedback,
  };
}

export const levelResults: LevelResult[] = [
  ...new Set(levelAttempts.map((attempt) => attempt.level)),
]
  .sort((a, b) => a - b)
  .flatMap((level) => resultForLevel(level) ?? []);

export function getLevelResult(level: number): LevelResult | undefined {
  return levelResults.find((result) => result.level === level);
}
