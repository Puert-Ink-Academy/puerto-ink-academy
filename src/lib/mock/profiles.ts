import type { CountryCode } from "@/lib/countries";
import {
  unlockedCategories,
  type ApprenticeStanding,
  type EvolutionAttempt,
  type LeaderboardScope,
} from "@/lib/leaderboard";
import { getPlatformUser } from "@/lib/mock/admin-users";
import { categories, type Category } from "@/lib/mock/categories";
import { apprenticeStandings, getRanking } from "@/lib/mock/leaderboard";
import { getLevelLesson } from "@/lib/mock/level-lessons";

export type ScopeStanding = {
  scope: LeaderboardScope;
  label: string;
  locked: boolean;
  rank: number | null;
  ranked: number;
  xp: number;
};

export type ShowcaseBadge = {
  category: Category;
  level: number;
  title: string;
};

export type EvolutionCard = {
  category: Category;
  level: number;
  title: string;
  first: EvolutionAttempt;
  best: EvolutionAttempt;
};

export type ApprenticeProfile = {
  id: string;
  name: string;
  email: string;
  artistName?: string;
  studio?: string;
  nationality?: CountryCode;
  rankTitle: "Apprentice";
  isCurrentUser: boolean;
  totalXp: number;
  levelsCompleted: number;
  standings: ScopeStanding[];
  mastered: ShowcaseBadge[];
  evolution: EvolutionCard[];
};

function scopeStanding(
  standing: ApprenticeStanding,
  scope: LeaderboardScope,
  label: string,
  locked: boolean,
): ScopeStanding {
  const ranking = getRanking(scope);
  const entry = ranking.find((item) => item.id === standing.id);
  return {
    scope,
    label,
    locked,
    rank: locked ? null : (entry?.rank ?? null),
    ranked: ranking.length,
    xp: entry?.xp ?? 0,
  };
}

export function getProfile(id: string): ApprenticeProfile | undefined {
  const standing = apprenticeStandings.find((entry) => entry.id === id);
  if (!standing) return undefined;

  const unlocked = unlockedCategories(standing);
  const global = getRanking("global").find((entry) => entry.id === id);

  const completedLevel = (categoryId: Category["id"], level: number) => {
    const category = categories.find((entry) => entry.id === categoryId);
    const stat = standing.categories[categoryId];
    const lesson = getLevelLesson(categoryId, level);
    if (!category || !stat || !lesson || !unlocked.has(categoryId) || level >= stat.level) {
      return undefined;
    }
    return { category, level, title: lesson.title };
  };

  const mastered = standing.masteredLevels.flatMap(
    ({ categoryId, level }) => completedLevel(categoryId, level) ?? [],
  );

  const evolution = standing.evolution
    .flatMap(({ categoryId, level, first, best }) => {
      const completed = completedLevel(categoryId, level);
      return completed ? [{ ...completed, first, best }] : [];
    })
    .sort((a, b) => b.best.score - b.first.score - (a.best.score - a.first.score));

  const user = getPlatformUser(standing.id);

  return {
    id: standing.id,
    name: standing.name,
    email: user?.email ?? `${standing.id}@puertoink.academy`,
    artistName: user?.artistName,
    studio: user?.studio,
    nationality: user?.nationality,
    rankTitle: "Apprentice",
    isCurrentUser: standing.isCurrentUser === true,
    totalXp: global?.xp ?? 0,
    levelsCompleted: global?.level ?? 0,
    standings: [
      scopeStanding(standing, "global", "Global", false),
      ...categories.map((category) =>
        scopeStanding(standing, category.id, category.name, !unlocked.has(category.id)),
      ),
    ],
    mastered,
    evolution,
  };
}
