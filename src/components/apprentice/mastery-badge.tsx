import { Crown } from "lucide-react";
import { useTranslations } from "next-intl";

import { SectionLabel } from "@/components/ui/section-label";
import { MASTERY_SCORE } from "@/lib/progress/grading";
import type { LevelResult } from "@/lib/mock/level-results";

export function MasteryBadge({ result }: { result: LevelResult }) {
  const t = useTranslations("Apprentice.Mastery");
  const tResult = useTranslations("Apprentice.Result");
  const tLevel = useTranslations("Apprentice.Level");
  const stats = [
    { label: tResult("score"), value: tResult("scoreValue", { score: result.highestScore }) },
    { label: tResult("xpEarned"), value: tResult("xpValue", { xp: result.xp }) },
    { label: tResult("attempts"), value: String(result.attempts) },
  ];

  return (
    <section
      aria-label={t("label")}
      className="relative overflow-hidden rounded-2xl border border-amber-400/50 bg-zinc-900 p-5 shadow-[0_0_48px_-12px_var(--color-amber-400)] sm:p-6"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 mx-auto size-72 rounded-full bg-[radial-gradient(circle,var(--color-amber-400)_0%,transparent_65%)] opacity-25 blur-2xl"
      />
      <div className="relative flex flex-col items-center text-center">
        <span className="relative flex size-20 items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-amber-400/25 [animation-duration:2.5s] motion-reduce:animate-none"
          />
          <span className="relative flex size-20 items-center justify-center rounded-full border-2 border-amber-200 bg-gradient-to-b from-amber-300 to-amber-500 text-zinc-950 shadow-[0_0_40px_var(--color-amber-400),inset_0_2px_6px_rgb(255_255_255/0.5)]">
            <Crown className="size-9" aria-hidden />
          </span>
        </span>
        <p className="mt-4 text-[0.7rem] font-medium tracking-[0.2em] text-amber-400 uppercase">
          {t("label")}
        </p>
        <h2 className="mt-1 bg-gradient-to-b from-amber-100 to-amber-400 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
          {t("title", { score: MASTERY_SCORE })}
        </h2>
        <p className="mt-1 text-sm text-zinc-400">{t("subtitle")}</p>
      </div>

      <dl className="relative mt-5 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-amber-400/20 bg-zinc-950/60 px-3 py-2.5 text-center"
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
      <div className="relative mt-4">
        <SectionLabel as="h3">{tLevel("teacherFeedback")}</SectionLabel>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">{result.feedback}</p>
      </div>
    </section>
  );
}
