import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { SkillTree } from "@/components/apprentice/skill-tree";
import { CurriculumSkeleton } from "@/components/feedback/curriculum-skeleton";
import { Progress } from "@/components/ui/progress";
import { SectionLabel } from "@/components/ui/section-label";
import { getApprenticeOverview, getCurriculum } from "@/db/queries";
import { getCategoryStyle } from "@/lib/categories";
import { getCurrentApprentice } from "@/lib/session";
import { categoryProgressPercent } from "@/lib/levels";
import { apprenticeView } from "@/lib/live-progress";
import { cn } from "cn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations("Metadata");
  const curriculum = await getCurriculum();
  const category = curriculum.find((entry) => entry.id === id);
  if (!category) return { title: t("notFound") };
  return { title: category.name, description: category.tagline };
}

async function CategoryBody({ id }: { id: string }) {
  const apprentice = await getCurrentApprentice();
  const [curriculum, overview] = await Promise.all([
    getCurriculum(),
    getApprenticeOverview(apprentice.id),
  ]);
  const view = apprenticeView(curriculum, overview);
  const entry = view.categories.find((category) => category.category.id === id);
  if (!entry || entry.isLocked) notFound();

  const category = entry.category;
  const style = getCategoryStyle(category.slug);
  const Icon = style.icon;
  const percent = categoryProgressPercent(entry.currentLevel, entry.totalLevels);
  const level = Math.min(entry.currentLevel, Math.max(entry.totalLevels, 1));
  const format = await getFormatter();
  const t = await getTranslations("Apprentice.Category");

  return (
    <>
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
            <SectionLabel className={style.text}>{t("eyebrow")}</SectionLabel>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
              {category.name}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              {t("summary", { level, total: entry.totalLevels, xp: format.number(entry.xp) })}
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
        categoryId={category.id}
        lessons={category.levels.map((lesson) => ({
          level: lesson.position,
          title: lesson.version.title,
        }))}
        results={entry.results}
        currentLevel={entry.currentLevel}
      />
    </>
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("Apprentice.Category");

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href="/apprentice/dashboard"
        className="flex w-fit items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t("back")}
      </Link>
      <Suspense fallback={<CurriculumSkeleton />}>
        <CategoryBody id={id} />
      </Suspense>
    </main>
  );
}
