import { Lock } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import { SectionLabel } from "@/components/ui/section-label";
import { categoryStyles } from "@/lib/curriculum/categories";
import type { ScopeStanding } from "@/lib/mock/profiles";
import { cn } from "cn";

const podium: Record<number, { card: string; rank: string }> = {
  1: {
    card: "ring-amber-400/50 bg-gradient-to-b from-amber-400/15 to-zinc-900 shadow-[0_0_28px_-10px_var(--color-amber-400)]",
    rank: "text-amber-300",
  },
  2: {
    card: "ring-zinc-300/40 bg-gradient-to-b from-zinc-300/10 to-zinc-900",
    rank: "text-zinc-100",
  },
  3: {
    card: "ring-orange-500/40 bg-gradient-to-b from-orange-600/15 to-zinc-900",
    rank: "text-orange-300",
  },
};

function StandingCard({ standing }: { standing: ScopeStanding }) {
  const format = useFormatter();
  const t = useTranslations("Profile.Standings");
  const Icon = categoryStyles[standing.scope].icon;
  const iconClass = categoryStyles[standing.scope].text;
  const medal = standing.rank !== null ? podium[standing.rank] : undefined;

  return (
    <Card
      size="sm"
      className={cn(
        "bg-zinc-900 ring-zinc-800",
        medal?.card,
        standing.locked && "opacity-60 grayscale",
      )}
    >
      <CardContent className="flex flex-col gap-3">
        <SectionLabel className="flex items-center gap-2">
          <Icon className={cn("size-4", standing.locked ? "text-zinc-500" : iconClass)} aria-hidden />
          {t("rankLabel", { scope: standing.label })}
        </SectionLabel>
        {standing.locked ? (
          <p className="flex items-center gap-1.5 text-lg font-semibold text-zinc-400">
            <Lock className="size-4" aria-hidden />
            {t("locked")}
          </p>
        ) : standing.rank === null ? (
          <p className="text-lg font-semibold text-zinc-400">{t("unranked")}</p>
        ) : (
          <p className="flex items-baseline gap-1.5">
            <span
              className={cn(
                "text-3xl font-semibold tracking-tight tabular-nums",
                medal?.rank ?? "text-zinc-50",
              )}
            >
              #{standing.rank}
            </span>
            <span className="text-xs text-zinc-500">{t("ofTotal", { total: standing.ranked })}</span>
          </p>
        )}
        <p className="text-xs text-zinc-500 tabular-nums">
          {t("xp", { xp: format.number(standing.xp) })}
        </p>
      </CardContent>
    </Card>
  );
}

export function LeaderboardStandings({ standings }: { standings: ScopeStanding[] }) {
  const t = useTranslations("Profile.Standings");

  return (
    <section aria-labelledby="standings-heading" className="flex flex-col gap-3">
      <SectionLabel as="h2" id="standings-heading">
        {t("title")}
      </SectionLabel>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {standings.map((standing) => (
          <StandingCard key={standing.scope} standing={standing} />
        ))}
      </div>
    </section>
  );
}
