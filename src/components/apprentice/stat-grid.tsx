import {
  CheckCircle2,
  LayoutGrid,
  Sparkles,
  Target,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import type { ApprenticeDashboardData } from "@/lib/mock/apprentice-dashboard";
import { cn } from "cn";

type StatTone = "amber" | "rose" | "neutral";

type Stat = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: StatTone;
};

const toneStyles: Record<StatTone, { icon: string; value: string; card: string }> = {
  amber: {
    icon: "text-amber-400",
    value: "text-amber-300",
    card: "border-amber-400/20 bg-gradient-to-b from-amber-400/10 to-zinc-900",
  },
  rose: {
    icon: "text-rose-400",
    value: "text-rose-300",
    card: "border-rose-500/20 bg-gradient-to-b from-rose-500/10 to-zinc-900",
  },
  neutral: {
    icon: "text-zinc-400",
    value: "text-zinc-50",
    card: "border-zinc-800 bg-zinc-900",
  },
};

export function StatGrid({ data }: { data: ApprenticeDashboardData }) {
  const stats: Stat[] = [
    {
      label: "Categories",
      value: `${data.categoriesStarted}/${data.totalCategories}`,
      icon: LayoutGrid,
      tone: "amber",
    },
    { label: "Total XP", value: data.xp.toLocaleString("en-US"), icon: Sparkles, tone: "amber" },
    { label: "Avg Score", value: `${data.averageScore}/10`, icon: Target, tone: "neutral" },
    { label: "Completed", value: String(data.completedExercises), icon: CheckCircle2, tone: "neutral" },
    { label: "Failed Attempts", value: String(data.failedAttempts), icon: XCircle, tone: "rose" },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {stats.map((stat, index) => {
        const tone = toneStyles[stat.tone];
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className={cn(
              "rounded-xl border p-4",
              tone.card,
              index === stats.length - 1 && "col-span-2 lg:col-span-1",
            )}
          >
            <dt className="flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.12em] text-zinc-400 uppercase">
              <Icon className={cn("size-4", tone.icon)} aria-hidden />
              {stat.label}
            </dt>
            <dd className={cn("mt-3 text-3xl font-semibold tracking-tight tabular-nums", tone.value)}>
              {stat.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
