import { Crown, LayoutGrid, Network, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";

import { CategoryGrid } from "@/components/apprentice/category-grid";
import { MasteryBadge } from "@/components/apprentice/mastery-badge";
import { SkillTree } from "@/components/apprentice/skill-tree";
import { PreviewFrame } from "@/components/home/preview-frame";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { SectionLabel } from "@/components/ui/section-label";
import { MASTERY_SCORE, PASS_SCORE } from "@/lib/progress/grading";
import { getCategoryProgress } from "@/lib/mock/apprentice-dashboard";
import { getCategory, getPreviousCategory, type CategoryId } from "@/lib/mock/categories";
import { getRanking } from "@/lib/mock/leaderboard";
import { getCategoryLessons } from "@/lib/mock/level-lessons";
import { getCategoryResults, getLevelResult } from "@/lib/mock/level-results";

const previewCategories: CategoryId[] = ["fine-line", "realism"];

export function ProductPreview() {
  const t = useTranslations("Marketing.Preview");
  const categoryItems = previewCategories.map((id) => ({
    category: { ...getCategory(id), slug: id },
    progress: getCategoryProgress(id),
    totalLevels: getCategoryLessons(id).length,
    previousCategoryName: getPreviousCategory(id)?.name,
  }));
  const fineLine = getCategoryProgress("fine-line");
  const masteredResult = getLevelResult("fine-line", 3);
  const podium = getRanking("fine-line").slice(0, 3);

  return (
    <section aria-labelledby="preview-heading" className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <SectionLabel tone="marketing">{t("eyebrow")}</SectionLabel>
        <h2
          id="preview-heading"
          className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
        >
          {t("title")}
        </h2>
        <p className="mt-3 text-zinc-400">{t("body")}</p>
      </div>

      <div className="mt-10 flex flex-col gap-6">
        <PreviewFrame icon={LayoutGrid} title={t("chooseTitle")} caption={t("chooseCaption")}>
          <CategoryGrid items={categoryItems} />
        </PreviewFrame>

        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewFrame
            icon={Network}
            title={t("treeTitle")}
            caption={t("treeCaption", { score: PASS_SCORE })}
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
                title={t("masteryTitle")}
                caption={t("masteryCaption", { score: MASTERY_SCORE })}
              >
                <MasteryBadge result={masteredResult} />
              </PreviewFrame>
            )}
            <PreviewFrame
              icon={Trophy}
              title={t("leaderboardTitle")}
              caption={t("leaderboardCaption")}
            >
              <LeaderboardTable entries={podium} />
            </PreviewFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
