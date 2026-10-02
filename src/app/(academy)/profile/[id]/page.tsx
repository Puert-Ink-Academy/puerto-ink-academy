import { notFound } from "next/navigation";

import { FirstVsBest } from "@/components/profile/first-vs-best";
import { MasteryShowcase } from "@/components/profile/mastery-showcase";
import { ProfileHeader } from "@/components/profile/profile-header";
import { getProfile } from "@/lib/mock/profiles";
import { personalLevel } from "@/lib/personal-level";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = getProfile(id);
  if (!profile) notFound();

  const highlight = profile.evolution[0];

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <ProfileHeader
        profile={{
          id: profile.id,
          name: profile.name,
          isCurrentUser: profile.isCurrentUser,
          artistName: profile.artistName,
          studio: profile.studio,
          nationality: profile.nationality,
          personal: personalLevel(profile.totalXp),
        }}
      />
      {profile.mastered.length > 0 && (
        <MasteryShowcase badges={profile.mastered} linkable={profile.isCurrentUser} centered />
      )}
      {highlight && <FirstVsBest card={highlight} />}
    </main>
  );
}
