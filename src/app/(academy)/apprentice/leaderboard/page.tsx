import { LeaderboardHeader } from "@/components/leaderboard/leaderboard-header";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { UserRankBanner } from "@/components/leaderboard/user-rank-banner";
import { apprenticeDashboard } from "@/lib/mock/apprentice-dashboard";
import { currentUserRank, leaderboard } from "@/lib/mock/leaderboard";

export default function LeaderboardPage() {
  const entryAbove = leaderboard.find((entry) => entry.rank === currentUserRank - 1);

  return (
    <main className="mx-auto flex min-h-[calc(100svh-8rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 md:min-h-svh">
      <LeaderboardHeader count={leaderboard.length} />
      <LeaderboardTable entries={leaderboard} highlightCurrentUser />
      <UserRankBanner
        rank={currentUserRank}
        level={apprenticeDashboard.currentLevel}
        xp={apprenticeDashboard.xp}
        nextRankXp={entryAbove?.xp}
      />
    </main>
  );
}
