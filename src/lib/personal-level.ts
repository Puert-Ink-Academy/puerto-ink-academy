const BASE_XP = 60;
const GROWTH = 7 / 6;

export type PersonalLevelProgress = {
  level: number;
  into: number;
  need: number;
};

/** XP required to leave `level`. Level 1 costs 60, and each next step grows by 7/6. */
export function xpToAdvance(level: number): number {
  return Math.round(BASE_XP * GROWTH ** (level - 1));
}

export function personalLevel(totalXp: number): PersonalLevelProgress {
  let level = 1;
  let remaining = Math.max(0, totalXp);
  let need = xpToAdvance(level);

  while (remaining >= need) {
    remaining -= need;
    level += 1;
    need = xpToAdvance(level);
  }

  return { level, into: remaining, need };
}
