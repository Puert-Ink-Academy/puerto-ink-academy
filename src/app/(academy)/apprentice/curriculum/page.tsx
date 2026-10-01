import { SkillTree } from "@/components/apprentice/skill-tree";
import { apprenticeDashboard } from "@/lib/mock/apprentice-dashboard";
import { levelLessons } from "@/lib/mock/level-lessons";
import { levelResults } from "@/lib/mock/level-results";

export default function CurriculumPage() {
  const { currentLevel, totalLevels } = apprenticeDashboard;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
      <header>
        <p className="text-[0.7rem] font-medium tracking-[0.12em] text-amber-400 uppercase">
          Skill Tree
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
          Curriculum
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Level {currentLevel} of {totalLevels}
        </p>
      </header>
      <SkillTree
        lessons={levelLessons}
        results={levelResults}
        currentLevel={currentLevel}
      />
    </main>
  );
}
