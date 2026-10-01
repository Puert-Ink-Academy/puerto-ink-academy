import { CurriculumManager } from "@/components/teacher/curriculum-manager";
import { levelLessons } from "@/lib/mock/level-lessons";

export default function TeacherCurriculumPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <CurriculumManager lessons={levelLessons} />
    </main>
  );
}
