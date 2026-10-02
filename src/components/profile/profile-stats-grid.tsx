import { CheckCircle2, Crown, Sparkles, type LucideIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { SectionLabel } from "@/components/ui/section-label";
import { MASTERY_SCORE } from "@/lib/grading";
import type { ApprenticeProfile } from "@/lib/mock/profiles";
import { cn } from "cn";

type Stat = {
  id: string;
  label: ReactNode;
  value: string;
  icon: LucideIcon;
  card: string;
  iconClass: string;
  valueClass: string;
};

export function ProfileStatsGrid({ profile }: { profile: ApprenticeProfile }) {
  const format = useFormatter();
  const t = useTranslations("Profile.Stats");
  const stats: Stat[] = [
    {
      id: "xp",
      label: t("totalXp"),
      value: format.number(profile.totalXp),
      icon: Sparkles,
      card: "border-amber-400/20 bg-gradient-to-b from-amber-400/10 to-zinc-900",
      iconClass: "text-amber-400",
      valueClass: "text-amber-300",
    },
    {
      id: "perfect",
      label: t.rich("perfect", {
        score: MASTERY_SCORE,
        lower: (chunks) => <span className="normal-case">{chunks}</span>,
      }),
      value: String(profile.mastered.length),
      icon: Crown,
      card: "border-amber-300/40 bg-gradient-to-b from-amber-300/15 to-zinc-900 shadow-[0_0_28px_-12px_var(--color-amber-400)]",
      iconClass: "text-amber-300",
      valueClass: "text-amber-200",
    },
    {
      id: "completed",
      label: t("levelsCompleted"),
      value: String(profile.levelsCompleted),
      icon: CheckCircle2,
      card: "border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-zinc-900",
      iconClass: "text-emerald-400",
      valueClass: "text-emerald-300",
    },
  ];

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.id} className={cn("rounded-xl border p-4", stat.card)}>
            <SectionLabel as="dt" className="flex items-center gap-2">
              <Icon className={cn("size-4", stat.iconClass)} aria-hidden />
              <span>{stat.label}</span>
            </SectionLabel>
            <dd
              className={cn(
                "mt-3 text-3xl font-semibold tracking-tight tabular-nums",
                stat.valueClass,
              )}
            >
              {stat.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
