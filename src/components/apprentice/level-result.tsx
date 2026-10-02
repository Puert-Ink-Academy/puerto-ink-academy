import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { SectionLabel } from "@/components/ui/section-label";
import type { LevelResult as LevelResultData } from "@/lib/mock/level-results";

export function LevelResult({ result }: { result: LevelResultData }) {
  const t = useTranslations("Apprentice.Result");
  const tLevel = useTranslations("Apprentice.Level");
  const stats = [
    { label: t("bestScore"), value: t("scoreValue", { score: result.highestScore }) },
    { label: t("xpEarned"), value: t("xpValue", { xp: result.xp }) },
    { label: t("attempts"), value: String(result.attempts) },
  ];

  return (
    <section
      role="status"
      className="rounded-xl border border-emerald-500/40 bg-emerald-500/[0.06] p-4 shadow-[0_0_32px_-12px_var(--color-emerald-500)] sm:p-5"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="size-5 text-emerald-400" aria-hidden />
        </span>
        <h2 className="text-lg font-semibold tracking-tight text-emerald-100">{t("passed")}</h2>
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
        <SectionLabel as="h3">{tLevel("teacherFeedback")}</SectionLabel>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">{result.feedback}</p>
      </div>
    </section>
  );
}
