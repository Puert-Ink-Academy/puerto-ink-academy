import { notFound } from "next/navigation";

import { LessonSections } from "@/components/apprentice/lesson-sections";
import { LevelResult } from "@/components/apprentice/level-result";
import { LevelSubmission } from "@/components/apprentice/level-submission";
import { ReferenceMaterial } from "@/components/apprentice/reference-material";
import { isViewableLevel, levelStatus } from "@/lib/levels";
import { apprenticeDashboard } from "@/lib/mock/apprentice-dashboard";
import { getLevelLesson } from "@/lib/mock/level-lessons";
import { getLevelResult } from "@/lib/mock/level-results";

export default async function LevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const levelNumber = Number(level);
  const { currentLevel } = apprenticeDashboard;

  if (!isViewableLevel(levelNumber, currentLevel)) {
    notFound();
  }

  const lesson = getLevelLesson(levelNumber);

  if (!lesson) {
    notFound();
  }

  const isCompleted = levelStatus(levelNumber, currentLevel) === "completed";
  const result = isCompleted ? getLevelResult(levelNumber) : undefined;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <header>
        <div className="flex items-center gap-2">
          <p className="text-[0.7rem] font-medium tracking-[0.12em] text-amber-400 uppercase">
            Level {lesson.level}
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
    </main>
  );
}
