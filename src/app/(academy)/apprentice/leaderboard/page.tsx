import { getTranslations } from "next-intl/server";

import { LeaderboardHeader } from "@/components/leaderboard/leaderboard-header";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";
import { leaderboardScopes, type LeaderboardScope } from "@/lib/leaderboard";
import { getCategoryProgress } from "@/lib/mock/apprentice-dashboard";
import { categories, getPreviousCategory } from "@/lib/mock/categories";
import { getRankings } from "@/lib/mock/leaderboard";

export default async function LeaderboardPage() {
  const rankings = getRankings();
  const t = await getTranslations("Leaderboard");
  const lockedHints: Partial<Record<LeaderboardScope, string>> = {};
  for (const category of categories) {
    const previous = getPreviousCategory(category.id);
    if (previous && getCategoryProgress(category.id).isLocked) {
      lockedHints[category.id] = t("lockedHint", {
        previous: previous.name,
        category: category.name,
      });
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100svh-8rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 md:min-h-svh">
      <LeaderboardHeader count={rankings["fine-line"].length} />
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
