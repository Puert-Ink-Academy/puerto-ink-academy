import { LeaderboardHeader } from "@/components/leaderboard/leaderboard-header";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { leaderboard } from "@/lib/mock/leaderboard";

export default function AdminLeaderboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <LeaderboardHeader nav="admin" count={leaderboard.length} />
      <LeaderboardTable entries={leaderboard} />
    </main>
  );
}
