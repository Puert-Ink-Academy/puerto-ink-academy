import { ArrowLeft, Crown } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { AttemptHistory } from "@/components/apprentice/attempt-history";
import { LessonSections } from "@/components/apprentice/lesson-sections";
import { LevelResult } from "@/components/apprentice/level-result";
import { LevelSubmission } from "@/components/apprentice/level-submission";
import { MasteryBadge } from "@/components/apprentice/mastery-badge";
import { ReferenceMaterial } from "@/components/apprentice/reference-material";
import { SectionLabel } from "@/components/ui/section-label";
import { categoryStyles } from "@/lib/categories";
import { levelState } from "@/lib/grading";
import { isViewableLevel, levelStatus } from "@/lib/levels";
import { getCategoryProgress } from "@/lib/mock/apprentice-dashboard";
import { getCategory, isCategoryId } from "@/lib/mock/categories";
import { getLevelAttempts } from "@/lib/mock/level-attempts";
import { getLevelLesson } from "@/lib/mock/level-lessons";
import { getLevelResult } from "@/lib/mock/level-results";
import { getPendingSubmission } from "@/lib/mock/teacher-dashboard";
import { getCurrentApprentice } from "@/lib/session";
import { getCurriculum } from "@/db/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; level: string }>;
}): Promise<Metadata> {
  const { id, level } = await params;
  const levelNumber = Number(level);
  const t = await getTranslations("Metadata");

  if (isCategoryId(id) && Number.isInteger(levelNumber)) {
    const lesson = getLevelLesson(id, levelNumber);
    if (lesson) return { title: lesson.title, description: lesson.objective };
  }

  const curriculum = await getCurriculum();
  const match = curriculum
    .find((category) => category.id === id)
    ?.levels.find((entry) => entry.position === levelNumber);
  if (match) return { title: match.version.title, description: match.version.objective };

  return { title: t("notFound") };
}

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
  const apprentice = await getCurrentApprentice();
  const pendingSubmission = getPendingSubmission(apprentice.id, id, levelNumber);
  const t = await getTranslations("Apprentice.Level");
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
        {t("back", { category: category.name })}
      </Link>
      <header>
        <div className="flex items-center gap-2">
          <SectionLabel className={categoryStyles[id].text}>
            {t("eyebrow", { category: category.name, level: lesson.level })}
          </SectionLabel>
          {state === "mastered" ? (
            <span className="flex items-center gap-1 rounded-full border border-amber-400/60 bg-amber-400/15 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-amber-300 uppercase shadow-[0_0_12px_-2px_var(--color-amber-400)]">
              <Crown className="size-3" aria-hidden />
              {t("mastered")}
            </span>
          ) : (
            isCompleted && (
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-emerald-300 uppercase">
                {t("completed")}
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
