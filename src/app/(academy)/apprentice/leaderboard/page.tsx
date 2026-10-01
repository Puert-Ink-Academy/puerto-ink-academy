import { LeaderboardHeader } from "@/components/leaderboard/leaderboard-header";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";
import { getCategoryProgress } from "@/lib/mock/apprentice-dashboard";
import { categories, getPreviousCategory } from "@/lib/mock/categories";
import {
  getRankings,
  leaderboardScopes,
  type LeaderboardScope,
} from "@/lib/mock/leaderboard";

export default function LeaderboardPage() {
  const rankings = getRankings();
  const lockedHints: Partial<Record<LeaderboardScope, string>> = {};
  for (const category of categories) {
    const previous = getPreviousCategory(category.id);
    if (previous && getCategoryProgress(category.id).isLocked) {
      lockedHints[category.id] = `Complete ${previous.name} to unlock ${category.name}`;
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100svh-8rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 md:min-h-svh">
      <LeaderboardHeader count={rankings.global.length} />
      <LeaderboardTabs
        scopes={leaderboardScopes}
        rankings={rankings}
        highlightCurrentUser
        linkProfiles
        showBanner
        lockedHints={lockedHints}
      />
    </main>
  );
}
