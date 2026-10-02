import { LeaderboardHeader } from "@/components/leaderboard/leaderboard-header";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";
import { leaderboardScopes } from "@/lib/leaderboard";
import { getRankings } from "@/lib/mock/leaderboard";

export default function TeacherLeaderboardPage() {
  const rankings = getRankings();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <LeaderboardHeader nav="teacher" count={rankings["fine-line"].length} />
      <LeaderboardTabs scopes={leaderboardScopes} rankings={rankings} />
    </main>
  );
}
