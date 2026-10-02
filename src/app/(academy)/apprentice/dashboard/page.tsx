import { FlaskConical } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { CategoryGrid } from "@/components/apprentice/category-grid";
import { StatGrid } from "@/components/apprentice/stat-grid";
import { DashboardSkeleton } from "@/components/feedback/dashboard-skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { SectionLabel } from "@/components/ui/section-label";
import { getApprenticeOverview, getCurriculum } from "@/db/queries";
import { currentUsers } from "@/lib/current-user";
import { apprenticeView } from "@/lib/live-progress";

async function DashboardBody() {
  const t = await getTranslations("Apprentice.Dashboard");
  const [curriculum, overview] = await Promise.all([
    getCurriculum(),
    getApprenticeOverview(currentUsers.apprentice.id),
  ]);
  const view = apprenticeView(curriculum, overview);

  if (curriculum.length === 0) {
    return (
      <>
        <StatGrid data={view.stats} />
        <EmptyState title={t("curriculumEmpty")} icon={FlaskConical} />
      </>
    );
  }

  const items = view.categories.map((entry, index) => ({
    category: {
      id: entry.category.id,
      slug: entry.category.slug,
      name: entry.category.name,
      tagline: entry.category.tagline,
      sequenceOrder: entry.category.sequenceOrder,
    },
    progress: {
      currentLevel: entry.currentLevel,
      xp: entry.xp,
      started: entry.started,
      sequenceOrder: entry.category.sequenceOrder,
      isLocked: entry.isLocked,
    },
    totalLevels: entry.totalLevels,
    previousCategoryName: index > 0 ? view.categories[index - 1]?.category.name : undefined,
  }));

  return (
    <>
      <StatGrid data={view.stats} />
      <CategoryGrid items={items} />
    </>
  );
}

export default async function DashboardPage() {
  const t = await getTranslations("Apprentice.Dashboard");

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <header>
        <SectionLabel tone="marketing">{t("eyebrow")}</SectionLabel>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">{t("title")}</h1>
        <p className="mt-1 text-sm text-zinc-400">{t("subtitle")}</p>
      </header>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardBody />
      </Suspense>
    </main>
  );
}
