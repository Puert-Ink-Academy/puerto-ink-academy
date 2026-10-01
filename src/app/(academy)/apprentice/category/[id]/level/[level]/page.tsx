import { ArrowLeft, Crown } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AttemptHistory } from "@/components/apprentice/attempt-history";
import { LessonSections } from "@/components/apprentice/lesson-sections";
import { LevelResult } from "@/components/apprentice/level-result";
import { LevelSubmission } from "@/components/apprentice/level-submission";
import { MasteryBadge } from "@/components/apprentice/mastery-badge";
import { ReferenceMaterial } from "@/components/apprentice/reference-material";
import { categoryStyles } from "@/lib/categories";
import { levelState } from "@/lib/grading";
import { isViewableLevel, levelStatus } from "@/lib/levels";
import { getCategoryProgress } from "@/lib/mock/apprentice-dashboard";
import { getCategory, isCategoryId } from "@/lib/mock/categories";
import { getLevelAttempts } from "@/lib/mock/level-attempts";
import { getLevelLesson } from "@/lib/mock/level-lessons";
import { getLevelResult } from "@/lib/mock/level-results";
import { sessionUsers } from "@/lib/mock/session";
import { getPendingSubmission } from "@/lib/mock/teacher-dashboard";
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
  const result = getLevelResult(id, levelNumber);
  const state = levelState(result?.highestScore);
  const attempts = getLevelAttempts(id, levelNumber);
  const pendingSubmission = getPendingSubmission(sessionUsers.apprentice.id, id, levelNumber);
  const submission = {
    categoryId: id,
    categoryName: category.name,
    level: levelNumber,
    pending: pendingSubmission !== undefined,
  };

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
          {state === "mastered" ? (
            <span className="flex items-center gap-1 rounded-full border border-amber-400/60 bg-amber-400/15 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-amber-300 uppercase shadow-[0_0_12px_-2px_var(--color-amber-400)]">
              <Crown className="size-3" aria-hidden />
              Mastered
            </span>
          ) : (
            isCompleted && (
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-emerald-300 uppercase">
                Completed
              </span>
            )
          )}
        </div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-50">
          {lesson.title}
        </h1>
      </header>
      <div id="lesson" className="scroll-mt-20">
        <LessonSections lesson={lesson} />
      </div>
      <ReferenceMaterial references={lesson.references} />
      {state === "not-attempted" && <LevelSubmission variant="first" {...submission} />}
      {state === "failed" && result && (
        <LevelSubmission
          variant="retry"
          latestScore={result.latestScore}
          latestFeedback={result.latestFeedback}
          {...submission}
        />
      )}
      {state === "passed" && result && (
        <>
          <LevelResult result={result} />
          <LevelSubmission variant="improve" {...submission} />
        </>
      )}
      {state === "mastered" && result && <MasteryBadge result={result} />}
      <AttemptHistory attempts={attempts} pending={pendingSubmission} />
    </main>
  );
}
