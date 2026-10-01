export type ApprenticeDashboardData = {
  currentLevel: number;
  xp: number;
  averageScore: number;
  completedExercises: number;
  failedAttempts: number;
  levelProgress: number;
  totalLevels: number;
};

export const apprenticeDashboard: ApprenticeDashboardData = {
  currentLevel: 5,
  xp: 4850,
  averageScore: 8.5,
  completedExercises: 2,
  failedAttempts: 2,
  levelProgress: 80,
  totalLevels: 10,
};
