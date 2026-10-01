import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SkillTree } from "@/components/apprentice/skill-tree";
import { Progress } from "@/components/ui/progress";
import { categoryStyles } from "@/lib/categories";
import { categoryProgressPercent } from "@/lib/levels";
import { getCategoryProgress } from "@/lib/mock/apprentice-dashboard";
import { getCategory, isCategoryId } from "@/lib/mock/categories";
import { getCategoryLessons } from "@/lib/mock/level-lessons";
import { getCategoryResults } from "@/lib/mock/level-results";
import { cn } from "cn";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isCategoryId(id)) notFound();

  const progress = getCategoryProgress(id);
  if (progress.isLocked) notFound();

  const category = getCategory(id);
  const style = categoryStyles[id];
  const Icon = style.icon;
  const lessons = getCategoryLessons(id);
  const percent = categoryProgressPercent(progress.currentLevel, lessons.length);
  const level = Math.min(progress.currentLevel, lessons.length);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/apprentice/dashboard"
        className="flex w-fit items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to dashboard
      </Link>
      <header className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl border",
              style.chip,
            )}
          >
            <Icon className="size-6" aria-hidden />
          </span>
          <div>
            <p
              className={cn(
                "text-[0.7rem] font-medium tracking-[0.12em] uppercase",
                style.text,
              )}
            >
              Skill Tree
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
              {category.name}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Level {level} of {lessons.length} · {progress.xp.toLocaleString("en-US")} XP
            </p>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">{category.tagline}</span>
            <span className={cn("font-semibold tabular-nums", style.text)}>{percent}%</span>
          </div>
          <Progress
            value={percent}
            aria-label={`${category.name} progress`}
            className={cn(
              "mt-2 [&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-track]]:bg-zinc-800",
              style.progress,
            )}
          />
        </div>
      </header>
      <SkillTree
        categoryId={id}
        lessons={lessons}
        results={getCategoryResults(id)}
        currentLevel={progress.currentLevel}
      />
    </main>
  );
}
