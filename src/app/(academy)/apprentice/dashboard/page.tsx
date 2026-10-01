import { CurriculumTree } from "@/components/apprentice/curriculum-tree";
import { LevelProgress } from "@/components/apprentice/level-progress";
import { StatGrid } from "@/components/apprentice/stat-grid";
import { apprenticeDashboard } from "@/lib/mock/apprentice-dashboard";

export default function DashboardPage() {
  const data = apprenticeDashboard;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
        Dashboard
      </h1>
      <StatGrid data={data} />
      <LevelProgress currentLevel={data.currentLevel} progress={data.levelProgress} />
      <CurriculumTree currentLevel={data.currentLevel} totalLevels={data.totalLevels} />
    </main>
  );
}
