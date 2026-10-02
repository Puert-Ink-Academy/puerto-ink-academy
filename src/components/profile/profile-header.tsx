"use client";

import { Mail, Pencil, ShieldCheck, Store } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { EditArtistSheet } from "@/components/profile/edit-artist-sheet";
import { Button } from "@/components/ui/button";
import { CountryFlag } from "@/components/ui/country-flag";
import type { ArtistDetails } from "@/lib/artist";
import type { ApprenticeProfile } from "@/lib/mock/profiles";

export type ProfileHeaderData = Pick<
  ApprenticeProfile,
  "id" | "name" | "email" | "rankTitle" | "isCurrentUser" | "artistName" | "studio" | "nationality"
>;

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
  const tCommon = useTranslations("Common");
  const tRoles = useTranslations("Roles");

  return (
    <header className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-16 size-72 rounded-full bg-[radial-gradient(circle,var(--color-amber-400)_0%,transparent_65%)] opacity-15 blur-2xl"
      />
      <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <span
          role="img"
          aria-label={t("avatarLabel", { name: profile.name })}
          className="flex size-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-orange-700 text-3xl font-semibold text-zinc-950 shadow-[0_0_32px_-4px_var(--color-amber-400)] ring-4 ring-amber-400/30 ring-offset-4 ring-offset-zinc-900"
        >
          {initials(profile.name)}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {details.nationality && <CountryFlag code={details.nationality} size="md" />}
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
              {profile.name}
            </h1>
            {profile.isCurrentUser && (
              <span className="rounded-full border border-amber-400/50 bg-amber-400/10 px-2 py-0.5 text-[0.6rem] font-medium tracking-[0.12em] text-amber-300 uppercase">
                {tCommon("you")}
              </span>
            )}
          </div>
          {details.artistName && (
            <p className="mt-1 font-brand text-2xl leading-tight text-amber-300 drop-shadow-[0_0_14px_var(--color-amber-500)]">
              {details.artistName}
            </p>
          )}
          {details.studio && (
            <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-zinc-300 sm:justify-start">
              <Store className="size-4 shrink-0 text-zinc-500" aria-hidden />
              <span className="sr-only">{t("studioPrefix")}</span>
              <span className="truncate">{details.studio}</span>
            </p>
          )}
          <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-zinc-400 sm:justify-start">
            {profile.isCurrentUser ? (
              <>
                <Mail className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{profile.email}</span>
              </>
            ) : (
              t("publicSubtitle")
            )}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
              <ShieldCheck className="size-3.5" aria-hidden />
              {t("rank", { rank: tRoles("APPRENTICE") })}
            </p>
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
          </div>
        </div>
      </div>
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
