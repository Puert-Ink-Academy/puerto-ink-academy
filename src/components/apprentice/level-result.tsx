import { CheckCircle2 } from "lucide-react";

import { xpForScore } from "@/lib/grading";
import type { LevelResult as LevelResultData } from "@/lib/mock/level-results";

export function LevelResult({ result }: { result: LevelResultData }) {
  const stats = [
    { label: "Score", value: `${result.score}/10` },
    { label: "XP Earned", value: `+${xpForScore(result.score)}` },
    { label: "Attempts", value: String(result.attempts) },
  ];

  return (
    <section className="rounded-xl border border-emerald-500/30 bg-zinc-900 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="size-5 text-emerald-400" aria-hidden />
        <h2 className="text-sm font-semibold text-zinc-50">Passed</h2>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5"
          >
            <dt className="text-[0.65rem] font-medium tracking-[0.12em] text-zinc-500 uppercase">
              {stat.label}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-amber-300 tabular-nums">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4">
        <h3 className="text-[0.7rem] font-medium tracking-[0.12em] text-zinc-400 uppercase">
          Teacher Feedback
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
          {result.feedback}
        </p>
      </div>
    </section>
  );
}
