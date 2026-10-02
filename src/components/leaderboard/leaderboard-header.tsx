import { useTranslations } from "next-intl";

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
  const t = useTranslations("Leaderboard");

  return (
    <header>
      <SectionLabel className={navAccent[nav].eyebrow}>{t("eyebrow")}</SectionLabel>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">{t("title")}</h1>
      <p className="mt-1 text-sm text-zinc-400">{t("apprentices", { count })}</p>
    </header>
  );
}
