export type LeaderboardEntry = {
  rank: number;
  name: string;
  level: number;
  xp: number;
  averageScore: number;
};

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "John", level: 8, xp: 7850, averageScore: 9.7 },
  { rank: 2, name: "Alex", level: 7, xp: 6920, averageScore: 9.4 },
  { rank: 3, name: "Mike", level: 7, xp: 6400, averageScore: 9.1 },
];

export const currentUserRank = 4;
