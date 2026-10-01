import { CategoryGrid } from "@/components/apprentice/category-grid";
import { StatGrid } from "@/components/apprentice/stat-grid";
import { apprenticeDashboard, getCategoryProgress } from "@/lib/mock/apprentice-dashboard";
import { categories, getPreviousCategory } from "@/lib/mock/categories";
import { getCategoryLessons } from "@/lib/mock/level-lessons";

export default function DashboardPage() {
  const items = categories.map((category) => ({
    category,
    progress: getCategoryProgress(category.id),
    totalLevels: getCategoryLessons(category.id).length,
    previousCategoryName: getPreviousCategory(category.id)?.name,
  }));

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <header>
        <p className="text-[0.7rem] font-medium tracking-[0.12em] text-amber-400 uppercase">
          Choose your path
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-400">Pick a skill tree to train today.</p>
      </header>
      <StatGrid data={apprenticeDashboard} />
      <CategoryGrid items={items} />
    </main>
  );
}
