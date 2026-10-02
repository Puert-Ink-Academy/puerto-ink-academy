import { Suspense } from "react";

import { CurriculumSkeleton } from "@/components/feedback/curriculum-skeleton";
import { CurriculumManager } from "@/components/teacher/curriculum-manager";
import { getCurriculum } from "@/db/queries";
import type { StaffNav } from "@/lib/nav";

async function CurriculumBody({ nav }: { nav: StaffNav }) {
  const curriculum = await getCurriculum();

  return (
    <CurriculumManager
      nav={nav}
      categories={curriculum.map((category) => ({
        id: category.id,
        name: category.name,
        tagline: category.tagline,
      }))}
      lessons={curriculum.flatMap((category) =>
        category.levels.map((level) => ({
          categoryId: category.id,
          level: level.position,
          title: level.version.title,
          objective: level.version.objective,
          exercise: level.version.exercise,
          tips: level.version.tips,
          references: level.version.references.map((reference) => ({
            id: reference.id,
            label: reference.label,
          })),
        })),
      )}
    />
  );
}

export function CurriculumPage({ nav }: { nav: StaffNav }) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <Suspense fallback={<CurriculumSkeleton />}>
        <CurriculumBody nav={nav} />
      </Suspense>
    </main>
  );
}
