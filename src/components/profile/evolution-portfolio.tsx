import { TrendingUp } from "lucide-react";

import { FirstVsBest } from "@/components/profile/first-vs-best";
import type { EvolutionCard } from "@/lib/mock/profiles";

export function EvolutionPortfolio({ cards }: { cards: EvolutionCard[] }) {
  return (
    <section aria-labelledby="evolution-heading" className="flex flex-col gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h2
            id="evolution-heading"
            className="text-[0.7rem] font-medium tracking-[0.12em] text-zinc-400 uppercase"
          >
            Evolution Portfolio
          </h2>
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300 tabular-nums">
            {cards.length}
          </span>
        </div>
        <p className="mt-1 text-sm text-zinc-500">Your first try next to your best.</p>
      </div>
      {cards.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 px-6 py-10 text-center">
          <TrendingUp className="size-6 text-zinc-600" aria-hidden />
          <p className="text-sm font-medium text-zinc-200">No comebacks yet.</p>
          <p className="text-xs text-zinc-500">Retry a level to show how far you&apos;ve come.</p>
        </div>
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
