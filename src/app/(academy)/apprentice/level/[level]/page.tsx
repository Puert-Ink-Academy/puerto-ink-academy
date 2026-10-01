import { notFound } from "next/navigation";

import { LessonSections } from "@/components/apprentice/lesson-sections";
import { LevelSubmission } from "@/components/apprentice/level-submission";
import { ReferenceMaterial } from "@/components/apprentice/reference-material";
import { apprenticeDashboard } from "@/lib/mock/apprentice-dashboard";
import { getLevelLesson } from "@/lib/mock/level-lessons";

export default async function LevelPage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const levelNumber = Number(level);

  if (
    !Number.isInteger(levelNumber) ||
    levelNumber !== apprenticeDashboard.currentLevel
  ) {
    notFound();
  }

  const lesson = getLevelLesson(levelNumber);

  if (!lesson) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <header>
        <p className="text-[0.7rem] font-medium tracking-[0.12em] text-amber-400 uppercase">
          Level {lesson.level}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-50">
          {lesson.title}
        </h1>
      </header>
      <LessonSections lesson={lesson} />
      <ReferenceMaterial references={lesson.references} />
      <LevelSubmission />
    </main>
  );
}
