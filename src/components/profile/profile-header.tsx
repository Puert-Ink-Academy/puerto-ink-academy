import { Mail, ShieldCheck } from "lucide-react";

import type { ApprenticeProfile } from "@/lib/mock/profiles";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileHeader({ profile }: { profile: ApprenticeProfile }) {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-16 size-72 rounded-full bg-[radial-gradient(circle,var(--color-amber-400)_0%,transparent_65%)] opacity-15 blur-2xl"
      />
      <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <span
          role="img"
          aria-label={`${profile.name}'s avatar`}
          className="flex size-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-orange-700 text-3xl font-semibold text-zinc-950 shadow-[0_0_32px_-4px_var(--color-amber-400)] ring-4 ring-amber-400/30 ring-offset-4 ring-offset-zinc-900"
        >
          {initials(profile.name)}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
              {profile.name}
            </h1>
            {profile.isCurrentUser && (
              <span className="rounded-full border border-amber-400/50 bg-amber-400/10 px-2 py-0.5 text-[0.6rem] font-medium tracking-[0.12em] text-amber-300 uppercase">
                You
              </span>
            )}
          </div>
          <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-zinc-400 sm:justify-start">
            {profile.isCurrentUser ? (
              <>
                <Mail className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{profile.email}</span>
              </>
            ) : (
              "Puerto Ink Academy apprentice"
            )}
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
            <ShieldCheck className="size-3.5" aria-hidden />
            Rank: {profile.rankTitle}
          </p>
        </div>
      </div>
    </header>
  );
}
