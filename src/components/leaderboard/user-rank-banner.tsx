import { Lock, Sparkles, TrendingUp } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

export function UserRankBanner({
  rank,
  scopeLabel,
  lockedHint,
  levelText,
  xp,
  nextRankXp,
}: {
  rank: number | null;
  scopeLabel: string;
  lockedHint?: string;
  levelText: string | null;
  xp: number;
  nextRankXp?: number;
}) {
  const format = useFormatter();
  const t = useTranslations("Leaderboard.Banner");
  const tCommon = useTranslations("Common");
  const xpToNextRank = rank === null || nextRankXp === undefined ? null : nextRankXp - xp;

  return (
    <aside
      aria-label={t("label")}
      className="sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 mt-auto rounded-xl border border-amber-400/40 bg-zinc-900/90 p-4 shadow-[0_-8px_30px_rgb(0_0_0/0.5)] backdrop-blur-md md:bottom-4"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-amber-400/60 bg-amber-400/10 text-sm font-semibold text-amber-300 tabular-nums">
          {rank === null ? "–" : `#${rank}`}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-50">
            {tCommon("you")}
            {levelText && <span className="font-normal text-zinc-500"> · {levelText}</span>}
          </p>
          {rank === null ? (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-400">
              {lockedHint ? (
                <>
                  <Lock className="size-3.5 text-zinc-500" aria-hidden />
                  {lockedHint}
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5 text-amber-400" aria-hidden />
                  {t("earnToRank", { scope: scopeLabel })}
                </>
              )}
            </p>
          ) : (
            xpToNextRank !== null &&
            xpToNextRank > 0 && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-400">
                <TrendingUp className="size-3.5 text-amber-400" aria-hidden />
                {t("toPass", { xp: format.number(xpToNextRank), rank: rank - 1 })}
              </p>
            )
          )}
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-amber-300 tabular-nums">
            {format.number(xp)}
          </p>
          <p className="text-[0.65rem] tracking-[0.12em] text-zinc-500 uppercase">{t("xp")}</p>
        </div>
      </div>
    </aside>
  );
}
