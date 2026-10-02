import { Trophy } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { EmptyState } from "@/components/feedback/empty-state";
import { LeaderboardHeader } from "@/components/leaderboard/leaderboard-header";
import { LeaderboardTabs } from "@/components/leaderboard/leaderboard-tabs";
import { getApprenticeOverview, getCurriculum, getLeaderboard } from "@/db/queries";
import { isCountryCode } from "@/lib/countries";
import { currentUsers } from "@/lib/current-user";
import { apprenticeView } from "@/lib/live-progress";
import type { NavKey } from "@/lib/nav";

export async function LeaderboardBoard({ nav }: { nav: NavKey }) {
  const t = await getTranslations("Leaderboard");
  const curriculum = await getCurriculum();
  const viewerId = nav === "apprentice" ? currentUsers.apprentice.id : undefined;
  const [rankingsList, overview] = await Promise.all([
    Promise.all(curriculum.map((category) => getLeaderboard(category.id))),
    viewerId ? getApprenticeOverview(viewerId) : Promise.resolve(null),
  ]);
  const view = overview ? apprenticeView(curriculum, overview) : null;
  const tabs = curriculum.map((category) => ({
    id: category.id,
    label: category.name,
    slug: category.slug,
  }));
  const rankings = Object.fromEntries(
    curriculum.map((category, index) => [
      category.id,
      rankingsList[index].map((row) => ({
        rank: row.rank,
        id: row.id,
        slug: row.slug,
        name: row.name,
        level: row.level,
        personalLevel: row.personalLevel,
        xp: row.xp,
        averageScore: row.averageScore,
        isCurrentUser: viewerId !== undefined && row.id === viewerId,
        nationality: isCountryCode(row.nationality) ? row.nationality : undefined,
      })),
    ]),
  );
  const rankedCount = Object.values(rankings).reduce((total, rows) => total + rows.length, 0);
  const lockedHints: Record<string, string> = {};

  if (view) {
    curriculum.forEach((category, index) => {
      const progress = view.categories[index];
      const previous = index > 0 ? curriculum[index - 1] : undefined;
      if (progress?.isLocked && previous) {
        lockedHints[category.id] = t("lockedHint", {
          previous: previous.name,
          category: category.name,
        });
      }
    });
  }

  return (
    <>
      <LeaderboardHeader nav={nav} count={rankedCount} />
      {tabs.length === 0 ? (
        <EmptyState title={t("emptyBody")} icon={Trophy} />
      ) : (
        <LeaderboardTabs
          tabs={tabs}
          rankings={rankings}
          highlightCurrentUser={nav === "apprentice"}
          linkProfiles={nav === "apprentice"}
          showBanner={nav === "apprentice"}
          viewerPersonalLevel={overview?.personalLevel}
          lockedHints={lockedHints}
        />
      )}
    </>
  );
}
