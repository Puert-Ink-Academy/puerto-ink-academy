import { ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";

import { Progress } from "@/components/ui/progress";
import { getCategoryStyle } from "@/lib/categories";
import { categoryProgressPercent } from "@/lib/levels";
import { cn } from "cn";

export type CategoryCardData = {
  category: {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    sequenceOrder: number;
  };
  progress: {
    currentLevel: number;
    xp: number;
    started: boolean;
    sequenceOrder: number;
    isLocked: boolean;
  };
  totalLevels: number;
  previousCategoryName?: string;
};

type CategoryStatus = "locked" | "notStarted" | "mastered" | "inProgress";

function categoryStatus(
  progress: CategoryCardData["progress"],
  totalLevels: number,
): CategoryStatus {
  if (progress.isLocked) return "locked";
  if (!progress.started) return "notStarted";
  if (progress.currentLevel > totalLevels) return "mastered";
  return "inProgress";
}

const lockedStyle = {
  card: "cursor-not-allowed border-zinc-800 bg-zinc-900/40 opacity-60 grayscale",
  chip: "border-zinc-700 bg-zinc-800/80 text-zinc-300",
  text: "text-zinc-400",
};

function CategoryCard({ category, progress, totalLevels, previousCategoryName }: CategoryCardData) {
  const t = useTranslations("Apprentice.CategoryCard");
  const format = useFormatter();
  const locked = progress.isLocked;
  const style = getCategoryStyle(category.slug);
  const Icon = locked ? Lock : style.icon;
  const percent = categoryProgressPercent(progress.currentLevel, totalLevels);
  const level = Math.min(progress.currentLevel, totalLevels);
  const status = t(categoryStatus(progress, totalLevels));
  const unlockHint = previousCategoryName
    ? t("unlockHint", { previous: previousCategoryName })
    : t("unlockHintGeneric");

  const body = (
    <>
      {!locked && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -top-16 -right-16 size-56 opacity-20 blur-2xl transition-opacity group-hover:opacity-35",
            style.glow,
          )}
        />
      )}
      <div className="relative flex items-start gap-3">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl border",
            locked ? lockedStyle.chip : style.chip,
          )}
        >
          <Icon className={locked ? "size-6" : "size-5"} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-50">{category.name}</h2>
            <span className="rounded-md border border-zinc-700 px-1.5 py-px text-[0.6rem] font-medium tracking-[0.12em] text-zinc-400 uppercase tabular-nums">
              {t("step", { number: category.sequenceOrder })}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-zinc-400">{category.tagline}</p>
        </div>
        <span
          className={cn(
            "flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[0.6rem] font-medium tracking-[0.12em] uppercase",
            locked
              ? "border-zinc-700 bg-zinc-800 text-zinc-300"
              : progress.started
                ? style.chip
                : "border-zinc-700 text-zinc-400",
          )}
        >
          {locked && <Lock className="size-3" aria-hidden />}
          {status}
        </span>
      </div>

      <dl className="relative mt-6 grid grid-cols-2 gap-3">
        <div>
          <dt className="text-[0.65rem] font-medium tracking-[0.12em] text-zinc-500 uppercase">
            {t("currentLevel")}
          </dt>
          <dd className="mt-1 flex items-baseline gap-1.5">
            <span
              className={cn(
                "text-3xl font-semibold tabular-nums",
                locked ? lockedStyle.text : style.text,
              )}
            >
              {level}
            </span>
            <span className="text-sm text-zinc-500">{t("ofTotal", { total: totalLevels })}</span>
          </dd>
        </div>
        <div>
          <dt className="text-[0.65rem] font-medium tracking-[0.12em] text-zinc-500 uppercase">
            {t("categoryXp")}
          </dt>
          <dd
            className={cn(
              "mt-1 text-3xl font-semibold tabular-nums",
              locked ? lockedStyle.text : "text-zinc-50",
            )}
          >
            {format.number(progress.xp)}
          </dd>
        </div>
      </dl>

      <div className="relative mt-5">
        <p className="text-xs text-zinc-400">
          {t("levelProgress", { level })}{" "}
          <span
            className={cn("font-semibold tabular-nums", locked ? lockedStyle.text : style.text)}
          >
            {format.number(percent / 100, { style: "percent" })}
          </span>
        </p>
        <Progress
          value={percent}
          aria-label={t("progressLabel", { category: category.name })}
          className={cn(
            "mt-2 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-zinc-800",
            !locked && style.progress,
          )}
        />
      </div>

      <span
        className={cn(
          "relative mt-5 flex items-center gap-1.5 text-sm font-medium",
          locked ? lockedStyle.text : style.text,
        )}
      >
        {locked ? (
          <>
            <Lock className="size-3.5" aria-hidden />
            {unlockHint}
          </>
        ) : (
          <>
            {progress.started ? t("continue") : t("startTraining")}
            <ChevronRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </>
        )}
      </span>
    </>
  );

  const baseClassName =
    "group relative flex w-full flex-col overflow-hidden rounded-2xl border bg-zinc-900 p-5";

  if (locked) {
    return (
      <div
        role="group"
        aria-disabled="true"
        aria-label={t("lockedLabel", { category: category.name, hint: unlockHint })}
        className={cn(baseClassName, lockedStyle.card)}
      >
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/apprentice/category/${category.id}`}
      aria-label={t("cardLabel", {
        category: category.name,
        status,
        level,
        total: totalLevels,
        xp: format.number(progress.xp),
        percent,
      })}
      className={cn(
        baseClassName,
        "transition-all duration-200 outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        style.card,
        style.ring,
        !progress.started && "opacity-80 hover:opacity-100",
      )}
    >
      {body}
    </Link>
  );
}

export function CategoryGrid({ items }: { items: CategoryCardData[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.category.id} className="flex">
          <CategoryCard {...item} />
        </li>
      ))}
    </ul>
  );
}
