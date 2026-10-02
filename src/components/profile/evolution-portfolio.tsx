import { TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { FirstVsBest } from "@/components/profile/first-vs-best";
import { Panel } from "@/components/ui/panel";
import { SectionLabel } from "@/components/ui/section-label";
import type { EvolutionCard } from "@/lib/mock/profiles";

export function EvolutionPortfolio({ cards }: { cards: EvolutionCard[] }) {
  const t = useTranslations("Profile.Evolution");

  return (
    <section aria-labelledby="evolution-heading" className="flex flex-col gap-3">
      <div>
        <div className="flex items-center gap-2">
          <SectionLabel as="h2" id="evolution-heading">
            {t("title")}
          </SectionLabel>
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300 tabular-nums">
            {cards.length}
          </span>
        </div>
        <p className="mt-1 text-sm text-zinc-500">{t("subtitle")}</p>
      </div>
      {cards.length === 0 ? (
        <Panel
          variant="dashed"
          padding="none"
          className="flex flex-col items-center gap-2 px-6 py-10 text-center"
        >
          <TrendingUp className="size-6 text-zinc-600" aria-hidden />
          <p className="text-sm font-medium text-zinc-200">{t("emptyTitle")}</p>
          <p className="text-xs text-zinc-500">{t("emptyBody")}</p>
        </Panel>
      ) : (
        <ul className="flex flex-col gap-4">
          {cards.map((card) => (
            <li key={`${card.category.id}-${card.level}`}>
              <FirstVsBest card={card} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
