export type LevelStatus = "completed" | "active" | "locked";

export function levelStatus(level: number, currentLevel: number): LevelStatus {
  if (level < currentLevel) return "completed";
  if (level === currentLevel) return "active";
  return "locked";
}

export function categoryProgressPercent(currentLevel: number, totalLevels: number) {
  if (totalLevels <= 0) return 0;
  const completed = Math.min(Math.max(currentLevel - 1, 0), totalLevels);
  return Math.round((completed / totalLevels) * 100);
}

export function isViewableLevel(level: number, currentLevel: number) {
  return Number.isInteger(level) && level >= 1 && level <= currentLevel;
}
