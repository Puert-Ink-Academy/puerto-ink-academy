export type LeaderboardEntry = {
  rank: number;
  name: string;
  level: number;
  xp: number;
  averageScore: number;
  isCurrentUser?: boolean;
};

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Marco", level: 8, xp: 7850, averageScore: 9.7 },
  { rank: 2, name: "Alex", level: 7, xp: 6920, averageScore: 9.4 },
  { rank: 3, name: "Mike", level: 7, xp: 6400, averageScore: 9.1 },
  { rank: 4, name: "John Doe", level: 5, xp: 4850, averageScore: 8.5, isCurrentUser: true },
  { rank: 5, name: "Sofia", level: 4, xp: 4280, averageScore: 8.9 },
  { rank: 6, name: "Diego", level: 4, xp: 3610, averageScore: 8.4 },
  { rank: 7, name: "Lena", level: 3, xp: 2740, averageScore: 8.7 },
  { rank: 8, name: "Kai", level: 3, xp: 2150, averageScore: 8.2 },
  { rank: 9, name: "Nora", level: 2, xp: 1480, averageScore: 8.6 },
  { rank: 10, name: "Theo", level: 1, xp: 900, averageScore: 8.0 },
];

export const currentUserRank =
  leaderboard.find((entry) => entry.isCurrentUser)?.rank ?? leaderboard.length + 1;
