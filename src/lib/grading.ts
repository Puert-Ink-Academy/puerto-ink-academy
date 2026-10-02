export const PASS_SCORE = 8;
export const MASTERY_SCORE = 10;

export type LevelState = "not-attempted" | "failed" | "passed" | "mastered";

export function isPassingScore(score: number) {
  return score >= PASS_SCORE;
}

export function xpForScore(score: number) {
  return isPassingScore(score) ? score * 10 : 0;
}

export function xpFromBestScores(bestScores: number[]) {
  return bestScores.reduce((total, score) => total + xpForScore(score), 0);
}

export function averageScore(scores: number[]) {
  if (scores.length === 0) return 0;
  return scores.reduce((total, score) => total + score, 0) / scores.length;
}

export function levelState(bestScore: number | undefined): LevelState {
  if (bestScore === undefined) return "not-attempted";
  if (bestScore >= MASTERY_SCORE) return "mastered";
  if (isPassingScore(bestScore)) return "passed";
  return "failed";
}
