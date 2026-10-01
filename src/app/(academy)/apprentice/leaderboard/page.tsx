import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { UserRankBanner } from "@/components/leaderboard/user-rank-banner";
import { apprenticeDashboard } from "@/lib/mock/apprentice-dashboard";
import { currentUserRank, leaderboard } from "@/lib/mock/leaderboard";

export default function LeaderboardPage() {
  const entryAbove = leaderboard.find((entry) => entry.rank === currentUserRank - 1);

  return (
    <main className="mx-auto flex min-h-[calc(100svh-4.5rem-env(safe-area-inset-bottom))] w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 md:min-h-svh">
      <header>
        <p className="text-[0.7rem] font-medium tracking-[0.12em] text-amber-400 uppercase">
          Season Rankings
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
          Leaderboard
        </h1>
      </header>
      <LeaderboardTable entries={leaderboard} />
      <UserRankBanner
        rank={currentUserRank}
        level={apprenticeDashboard.currentLevel}
        xp={apprenticeDashboard.xp}
        nextRankXp={entryAbove?.xp}
      />
    </main>
  );
}
