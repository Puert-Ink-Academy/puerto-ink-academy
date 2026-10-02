import { notFound } from "next/navigation";

import { EvolutionPortfolio } from "@/components/profile/evolution-portfolio";
import { LeaderboardStandings } from "@/components/profile/leaderboard-standings";
import { MasteryShowcase } from "@/components/profile/mastery-showcase";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileStatsGrid } from "@/components/profile/profile-stats-grid";
import { getProfile } from "@/lib/mock/profiles";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = getProfile(id);
  if (!profile) notFound();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <ProfileHeader
        profile={{
          id: profile.id,
          name: profile.name,
          email: profile.email,
          rankTitle: profile.rankTitle,
          isCurrentUser: profile.isCurrentUser,
          artistName: profile.artistName,
          studio: profile.studio,
          nationality: profile.nationality,
        }}
      />
      <ProfileStatsGrid profile={profile} />
      <LeaderboardStandings standings={profile.standings} />
      <EvolutionPortfolio cards={profile.evolution} />
      <MasteryShowcase badges={profile.mastered} linkable={profile.isCurrentUser} />
    </main>
  );
}
