import { navAccent, type NavKey } from "@/components/layout/nav-items";
import { cn } from "cn";

export function LeaderboardHeader({
  count,
  nav = "apprentice",
}: {
  count: number;
  nav?: NavKey;
}) {
  return (
    <header>
      <p
        className={cn(
          "text-[0.7rem] font-medium tracking-[0.12em] uppercase",
          navAccent[nav].eyebrow,
        )}
      >
        Season Rankings
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
        Leaderboard
      </h1>
      <p className="mt-1 text-sm text-zinc-400">{count} apprentices</p>
    </header>
  );
}
