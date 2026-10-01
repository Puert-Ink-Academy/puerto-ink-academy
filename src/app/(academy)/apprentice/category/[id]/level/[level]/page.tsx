import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AttemptHistory } from "@/components/apprentice/attempt-history";
import { LessonSections } from "@/components/apprentice/lesson-sections";
import { LevelResult } from "@/components/apprentice/level-result";
import { LevelSubmission } from "@/components/apprentice/level-submission";
import { ReferenceMaterial } from "@/components/apprentice/reference-material";
import { categoryStyles } from "@/lib/categories";
import { isViewableLevel, levelStatus } from "@/lib/levels";
import { getCategoryProgress } from "@/lib/mock/apprentice-dashboard";
import { getCategory, isCategoryId } from "@/lib/mock/categories";
import { getLevelAttempts } from "@/lib/mock/level-attempts";
import { getLevelLesson } from "@/lib/mock/level-lessons";
import { getLevelResult } from "@/lib/mock/level-results";
import { cn } from "cn";

export default async function LevelPage({
  params,
}: {
  params: Promise<{ id: string; level: string }>;
}) {
  const { id, level } = await params;
  if (!isCategoryId(id)) notFound();

  const levelNumber = Number(level);
  const { currentLevel, isLocked } = getCategoryProgress(id);

  if (isLocked || !isViewableLevel(levelNumber, currentLevel)) {
    notFound();
  }

  const lesson = getLevelLesson(id, levelNumber);

  if (!lesson) {
    notFound();
  }

  const category = getCategory(id);
  const isCompleted = levelStatus(levelNumber, currentLevel) === "completed";
  const result = isCompleted ? getLevelResult(id, levelNumber) : undefined;
  const attempts = getLevelAttempts(id, levelNumber);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <Link
        href={`/apprentice/category/${id}`}
        className="flex w-fit items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to {category.name}
      </Link>
      <header>
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "text-[0.7rem] font-medium tracking-[0.12em] uppercase",
              categoryStyles[id].text,
            )}
          >
            {category.name} · Level {lesson.level}
          </p>
          {isCompleted && (
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-emerald-300 uppercase">
              Completed
            </span>
          )}
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-50">
          {lesson.title}
        </h1>
      </header>
      <LessonSections lesson={lesson} />
      <ReferenceMaterial references={lesson.references} />
      {isCompleted ? result && <LevelResult result={result} /> : <LevelSubmission />}
      <AttemptHistory attempts={attempts} />
    </main>
  );
}
