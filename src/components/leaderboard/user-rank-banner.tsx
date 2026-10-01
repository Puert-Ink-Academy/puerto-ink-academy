import { TrendingUp } from "lucide-react";

export function UserRankBanner({
  rank,
  level,
  xp,
  nextRankXp,
}: {
  rank: number;
  level: number;
  xp: number;
  nextRankXp?: number;
}) {
  const xpToNextRank = nextRankXp === undefined ? null : nextRankXp - xp;

  return (
    <aside
      aria-label="Your ranking"
      className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 mt-auto rounded-xl border border-amber-400/40 bg-zinc-900/90 p-4 shadow-[0_-8px_30px_rgb(0_0_0/0.5)] backdrop-blur-md md:bottom-4"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-amber-400/60 bg-amber-400/10 text-sm font-semibold text-amber-300 tabular-nums">
          #{rank}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-50">
            You <span className="font-normal text-zinc-500">· Level {level}</span>
          </p>
          {xpToNextRank !== null && xpToNextRank > 0 && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-400">
              <TrendingUp className="size-3.5 text-amber-400" aria-hidden />
              {xpToNextRank.toLocaleString("en-US")} XP to pass #{rank - 1}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-amber-300 tabular-nums">
            {xp.toLocaleString("en-US")}
          </p>
          <p className="text-[0.65rem] tracking-[0.12em] text-zinc-500 uppercase">XP</p>
        </div>
      </div>
    </aside>
  );
}
