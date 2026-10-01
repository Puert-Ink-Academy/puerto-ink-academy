import { Crown, LayoutGrid, Network, Trophy } from "lucide-react";

import { CategoryGrid } from "@/components/apprentice/category-grid";
import { MasteryBadge } from "@/components/apprentice/mastery-badge";
import { SkillTree } from "@/components/apprentice/skill-tree";
import { PreviewFrame } from "@/components/home/preview-frame";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { getCategoryProgress } from "@/lib/mock/apprentice-dashboard";
import { getCategory, getPreviousCategory, type CategoryId } from "@/lib/mock/categories";
import { getRanking } from "@/lib/mock/leaderboard";
import { getCategoryLessons } from "@/lib/mock/level-lessons";
import { getCategoryResults, getLevelResult } from "@/lib/mock/level-results";

const previewCategories: CategoryId[] = ["fine-line", "realism"];

export function ProductPreview() {
  const categoryItems = previewCategories.map((id) => ({
    category: getCategory(id),
    progress: getCategoryProgress(id),
    totalLevels: getCategoryLessons(id).length,
    previousCategoryName: getPreviousCategory(id)?.name,
  }));
  const fineLine = getCategoryProgress("fine-line");
  const masteredResult = getLevelResult("fine-line", 3);
  const podium = getRanking("global").slice(0, 3);

  return (
    <section aria-labelledby="preview-heading" className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[0.7rem] font-medium tracking-[0.12em] text-amber-400 uppercase">
          Inside the academy
        </p>
        <h2
          id="preview-heading"
          className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
        >
          Your training, built like a game
        </h2>
        <p className="mt-3 text-zinc-400">
          Every style is a skill tree. Every level is a real exercise, graded by a real artist.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-6">
        <PreviewFrame
          icon={LayoutGrid}
          title="Choose your style"
          caption="Styles unlock in order, so you master the fundamentals first."
        >
          <CategoryGrid items={categoryItems} />
        </PreviewFrame>

        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewFrame
            icon={Network}
            title="Climb the skill tree"
            caption="Pass a level with 8/10 or better to unlock the next one."
          >
            <SkillTree
              categoryId="fine-line"
              lessons={getCategoryLessons("fine-line").slice(0, 5)}
              results={getCategoryResults("fine-line")}
              currentLevel={fineLine.currentLevel}
            />
          </PreviewFrame>

          <div className="flex flex-col gap-6">
            {masteredResult && (
              <PreviewFrame
                icon={Crown}
                title="Earn mastery"
                caption="Retry any passed level. A perfect 10/10 earns the Mastery Badge."
              >
                <MasteryBadge result={masteredResult} />
              </PreviewFrame>
            )}
            <PreviewFrame
              icon={Trophy}
              title="Rise up the leaderboard"
              caption="Global and per-style rankings, refreshed with every grade."
            >
              <LeaderboardTable entries={podium} levelLabel="Cleared" />
            </PreviewFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
