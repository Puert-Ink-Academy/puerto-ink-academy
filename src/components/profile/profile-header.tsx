"use client";

import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { EditArtistSheet } from "@/components/profile/edit-artist-sheet";
import { Button } from "@/components/ui/button";
import type { ArtistDetails } from "@/lib/people/artist";
import type { ApprenticeProfile } from "@/lib/mock/profiles";
import type { PersonalLevelProgress } from "@/lib/progress/personal-level";

export type ProfileHeaderData = Pick<
  ApprenticeProfile,
  "id" | "name" | "isCurrentUser" | "artistName" | "studio" | "nationality"
> & {
  personal: PersonalLevelProgress;
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileHeader({ profile }: { profile: ProfileHeaderData }) {
  const [details, setDetails] = useState<Partial<ArtistDetails>>({
    artistName: profile.artistName,
    studio: profile.studio,
    nationality: profile.nationality,
  });
  const [editOpen, setEditOpen] = useState(false);
  const t = useTranslations("Profile");
  const username = details.artistName || profile.name;
  const { level, into, need } = profile.personal;
  const progress = Math.min(100, (into / need) * 100);

  return (
    <header className="flex flex-col items-center gap-4 text-center">
      <span
        role="img"
        aria-label={t("avatarLabel", { name: username })}
        className="flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-orange-700 text-4xl font-semibold text-zinc-950 shadow-[0_0_32px_-4px_var(--color-amber-400)] ring-4 ring-amber-400/30 ring-offset-4 ring-offset-zinc-950"
      >
        {initials(username)}
      </span>
      <div className="flex flex-col items-center">
        <h1 className="font-brand text-4xl leading-none text-amber-300 drop-shadow-[0_0_14px_var(--color-amber-500)] sm:text-5xl">
          {username}
        </h1>
        <p className="mt-4 text-sm font-medium tracking-wide text-zinc-200">
          {t("personalLevel", { level })}
        </p>
        <div
          role="progressbar"
          aria-valuenow={into}
          aria-valuemin={0}
          aria-valuemax={need}
          aria-label={t("personalProgressLabel", { next: level + 1 })}
          className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-zinc-800"
        >
          <div className="h-full rounded-full bg-amber-400" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-1.5 text-xs text-zinc-500 tabular-nums">
          {t("personalProgress", { into, need })}
        </p>
      </div>
      {profile.isCurrentUser && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setEditOpen(true)}
          className="h-8 rounded-full border-zinc-700 bg-zinc-950/40 px-3 text-xs text-zinc-200 hover:border-amber-400/60 hover:text-amber-300"
        >
          <Pencil className="size-3.5" aria-hidden />
          {t("edit")}
        </Button>
      )}
      {profile.isCurrentUser && (
        <EditArtistSheet
          open={editOpen}
          onOpenChange={setEditOpen}
          profileId={profile.id}
          initial={details}
          onSaved={setDetails}
        />
      )}
    </header>
  );
}
