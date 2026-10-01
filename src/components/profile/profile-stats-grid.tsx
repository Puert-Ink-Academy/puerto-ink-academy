import { CheckCircle2, Crown, Sparkles, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

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
  const stats: Stat[] = [
    {
      id: "xp",
      label: "Total Global XP",
      value: profile.totalXp.toLocaleString("en-US"),
      icon: Sparkles,
      card: "border-amber-400/20 bg-gradient-to-b from-amber-400/10 to-zinc-900",
      iconClass: "text-amber-400",
      valueClass: "text-amber-300",
    },
    {
      id: "perfect",
      label: (
        <>
          Perfect 10/10<span className="normal-case">s</span> Achieved
        </>
      ),
      value: String(profile.mastered.length),
      icon: Crown,
      card: "border-amber-300/40 bg-gradient-to-b from-amber-300/15 to-zinc-900 shadow-[0_0_28px_-12px_var(--color-amber-400)]",
      iconClass: "text-amber-300",
      valueClass: "text-amber-200",
    },
    {
      id: "completed",
      label: "Levels Completed",
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
            <dt className="flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.12em] text-zinc-400 uppercase">
              <Icon className={cn("size-4", stat.iconClass)} aria-hidden />
              <span>{stat.label}</span>
            </dt>
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
