import { navAccent } from "@/components/layout/nav-items";
import { SectionLabel } from "@/components/ui/section-label";
import type { NavKey } from "@/lib/nav";

export function LeaderboardHeader({
  count,
  nav = "apprentice",
}: {
  count: number;
  nav?: NavKey;
}) {
  return (
    <header>
      <SectionLabel className={navAccent[nav].eyebrow}>Season Rankings</SectionLabel>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
        Leaderboard
      </h1>
      <p className="mt-1 text-sm text-zinc-400">{count} apprentices</p>
    </header>
  );
}
