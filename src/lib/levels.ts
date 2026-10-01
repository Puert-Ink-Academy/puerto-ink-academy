export type LevelStatus = "completed" | "active" | "locked";

export function levelStatus(level: number, currentLevel: number): LevelStatus {
  if (level < currentLevel) return "completed";
  if (level === currentLevel) return "active";
  return "locked";
}

export function isViewableLevel(level: number, currentLevel: number) {
  return Number.isInteger(level) && level >= 1 && level <= currentLevel;
}
