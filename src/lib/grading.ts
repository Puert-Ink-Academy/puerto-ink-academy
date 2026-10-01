export const PASS_SCORE = 8;
export const MASTERY_SCORE = 10;

export type LevelState = "not-attempted" | "failed" | "passed" | "mastered";

export function isPassingScore(score: number) {
  return score >= PASS_SCORE;
}

export function xpForScore(score: number) {
  return isPassingScore(score) ? score * 10 : 0;
}

export function levelState(bestScore: number | undefined): LevelState {
  if (bestScore === undefined) return "not-attempted";
  if (bestScore >= MASTERY_SCORE) return "mastered";
  if (isPassingScore(bestScore)) return "passed";
  return "failed";
}
