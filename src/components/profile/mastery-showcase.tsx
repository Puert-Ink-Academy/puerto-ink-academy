import { Crown } from "lucide-react";
import Link from "next/link";

import { categoryStyles } from "@/lib/categories";
import type { ShowcaseBadge } from "@/lib/mock/profiles";
import { cn } from "cn";

function BadgeTile({ badge }: { badge: ShowcaseBadge }) {
  const style = categoryStyles[badge.category.id];
  const Icon = style.icon;

  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 mx-auto size-32 rounded-full bg-[radial-gradient(circle,var(--color-amber-400)_0%,transparent_65%)] opacity-25 blur-xl"
      />
      <span className="relative flex size-12 items-center justify-center rounded-full border-2 border-amber-200 bg-gradient-to-b from-amber-300 to-amber-500 text-zinc-950 shadow-[0_0_24px_var(--color-amber-400),inset_0_2px_4px_rgb(255_255_255/0.5)]">
        <Crown className="size-6" aria-hidden />
      </span>
      <span className="relative mt-3 bg-gradient-to-b from-amber-100 to-amber-400 bg-clip-text text-xl font-semibold text-transparent tabular-nums">
        10/10
      </span>
      <span
        className={cn(
          "relative mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.6rem] font-medium tracking-[0.1em] uppercase",
          style.chip,
        )}
      >
        <Icon className="size-3" aria-hidden />
        {badge.category.name}
      </span>
      <span className="relative mt-2 text-xs text-zinc-300">
        Level {badge.level} · {badge.title}
      </span>
    </>
  );
}

export function MasteryShowcase({
  badges,
  linkable,
}: {
  badges: ShowcaseBadge[];
  linkable: boolean;
}) {
  const tileClass =
    "relative flex flex-col items-center overflow-hidden rounded-xl border border-amber-400/30 bg-zinc-900 px-3 py-4 text-center shadow-[0_0_24px_-14px_var(--color-amber-400)]";

  return (
    <section aria-labelledby="showcase-heading" className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2
          id="showcase-heading"
          className="text-[0.7rem] font-medium tracking-[0.12em] text-zinc-400 uppercase"
        >
          Mastery Showcase
        </h2>
        <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-xs font-medium text-amber-300 tabular-nums">
          {badges.length}
        </span>
      </div>
      {badges.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 px-6 py-10 text-center">
          <Crown className="size-6 text-zinc-600" aria-hidden />
          <p className="text-sm font-medium text-zinc-200">No perfect scores yet.</p>
          <p className="text-xs text-zinc-500">Retry a passed level to earn your first.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {badges.map((badge) => {
            const key = `${badge.category.id}-${badge.level}`;
            const label = `${badge.category.name} Level ${badge.level}: ${badge.title}, 10/10`;
            return (
              <li key={key} className="flex">
                {linkable ? (
                  <Link
                    href={`/apprentice/category/${badge.category.id}/level/${badge.level}`}
                    aria-label={label}
                    className={cn(
                      tileClass,
                      "w-full transition-transform outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-amber-400",
                    )}
                  >
                    <BadgeTile badge={badge} />
                  </Link>
                ) : (
                  <div role="img" aria-label={label} className={cn(tileClass, "w-full")}>
                    <BadgeTile badge={badge} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
