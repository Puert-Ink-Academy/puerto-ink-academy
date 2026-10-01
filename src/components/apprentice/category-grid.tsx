import { ChevronRight, Lock } from "lucide-react";
import Link from "next/link";

import { Progress } from "@/components/ui/progress";
import { categoryStyles } from "@/lib/categories";
import { categoryProgressPercent } from "@/lib/levels";
import type { CategoryProgress } from "@/lib/mock/apprentice-dashboard";
import type { Category } from "@/lib/mock/categories";
import { cn } from "cn";

export type CategoryCardData = {
  category: Category;
  progress: CategoryProgress;
  totalLevels: number;
  previousCategoryName?: string;
};

function statusLabel(progress: CategoryProgress, totalLevels: number) {
  if (progress.isLocked) return "Locked";
  if (!progress.started) return "Not started";
  if (progress.currentLevel > totalLevels) return "Mastered";
  return "In progress";
}

const lockedStyle = {
  card: "cursor-not-allowed border-zinc-800 bg-zinc-900/40 opacity-60 grayscale",
  chip: "border-zinc-700 bg-zinc-800/80 text-zinc-300",
  text: "text-zinc-400",
};

function CategoryCard({ category, progress, totalLevels, previousCategoryName }: CategoryCardData) {
  const locked = progress.isLocked;
  const style = categoryStyles[category.id];
  const Icon = locked ? Lock : style.icon;
  const percent = categoryProgressPercent(progress.currentLevel, totalLevels);
  const level = Math.min(progress.currentLevel, totalLevels);
  const unlockHint = `Complete ${previousCategoryName ?? "the previous style"} to unlock`;

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
              Step {category.sequenceOrder}
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
          {statusLabel(progress, totalLevels)}
        </span>
      </div>

      <dl className="relative mt-6 grid grid-cols-2 gap-3">
        <div>
          <dt className="text-[0.65rem] font-medium tracking-[0.12em] text-zinc-500 uppercase">
            Current Level
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
            <span className="text-sm text-zinc-500">of {totalLevels}</span>
          </dd>
        </div>
        <div>
          <dt className="text-[0.65rem] font-medium tracking-[0.12em] text-zinc-500 uppercase">
            Category XP
          </dt>
          <dd
            className={cn(
              "mt-1 text-3xl font-semibold tabular-nums",
              locked ? lockedStyle.text : "text-zinc-50",
            )}
          >
            {progress.xp.toLocaleString("en-US")}
          </dd>
        </div>
      </dl>

      <div className="relative mt-5">
        <p className="text-xs text-zinc-400">
          Level {level}:{" "}
          <span
            className={cn("font-semibold tabular-nums", locked ? lockedStyle.text : style.text)}
          >
            {percent}%
          </span>
        </p>
        <Progress
          value={percent}
          aria-label={`${category.name} progress`}
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
            {progress.started ? "Continue" : "Start training"}
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
        aria-label={`${category.name}: locked. ${unlockHint}`}
        className={cn(baseClassName, lockedStyle.card)}
      >
        {body}
      </div>
    );
  }

  return (
    <Link
      href={`/apprentice/category/${category.id}`}
      aria-label={`${category.name}: ${statusLabel(progress, totalLevels)}, level ${level} of ${totalLevels}, ${progress.xp.toLocaleString("en-US")} XP, ${percent}% complete`}
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
