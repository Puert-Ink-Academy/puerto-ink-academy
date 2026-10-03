import { BookOpen, Camera, Crown, Sparkles, Target, TrendingUp, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { SectionLabel } from "@/components/ui/section-label";
import { MASTERY_SCORE, PASS_SCORE } from "@/lib/progress/grading";

const steps = [
  { icon: BookOpen, title: "learnTitle", body: "learnBody" },
  { icon: Camera, title: "submitTitle", body: "submitBody" },
  { icon: TrendingUp, title: "gradedTitle", body: "gradedBody" },
] as const satisfies readonly { icon: LucideIcon; title: string; body: string }[];

export function HowItWorks() {
  const t = useTranslations("Marketing.HowItWorks");
  const rules = [
    { icon: Target, label: t("rulePass", { score: PASS_SCORE }) },
    { icon: Sparkles, label: t("ruleXp") },
    { icon: Crown, label: t("ruleMastery", { score: MASTERY_SCORE }) },
  ];

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="mx-auto w-full max-w-6xl scroll-mt-8 px-4 sm:px-6"
    >
      <div className="mx-auto max-w-2xl text-center">
        <SectionLabel tone="marketing">{t("eyebrow")}</SectionLabel>
        <h2
          id="how-heading"
          className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
        >
          {t("title")}
        </h2>
      </div>

      <ol className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <span
                aria-hidden
                className="font-brand pointer-events-none absolute -top-4 right-3 text-8xl text-zinc-800/70"
              >
                {index + 1}
              </span>
              <span className="relative flex size-11 items-center justify-center rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-300">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="relative mt-4 text-lg font-semibold text-zinc-50">{t(step.title)}</h3>
              <p className="relative mt-1.5 text-sm leading-relaxed text-zinc-400">
                {t(step.body)}
              </p>
            </li>
          );
        })}
      </ol>

      <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
        {rules.map((rule) => {
          const Icon = rule.icon;
          return (
            <li
              key={rule.label}
              className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 text-sm font-medium text-zinc-200"
            >
              <Icon className="size-4 text-amber-400" aria-hidden />
              {rule.label}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
