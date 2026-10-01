export const PASS_SCORE = 8;

export function isPassingScore(score: number) {
  return score >= PASS_SCORE;
}

export function xpForScore(score: number) {
  return isPassingScore(score) ? score * 10 : 0;
}
