import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { EmptyState } from "@/components/feedback/empty-state";
import { QueueSkeleton } from "@/components/feedback/queue-skeleton";
import { navAccent, roleBadge } from "@/components/layout/nav-items";
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard";
import { SectionLabel } from "@/components/ui/section-label";
import { getPendingSubmissions } from "@/db/queries";
import { currentUsers } from "@/lib/current-user";
import type { StaffNav } from "@/lib/nav";

function reviewerId(nav: StaffNav) {
  return nav === "admin" ? currentUsers.admin.id : currentUsers.teacher.id;
}

async function PendingQueue({ nav }: { nav: StaffNav }) {
  const t = await getTranslations("Teacher.Grading");
  const rows = await getPendingSubmissions();

  if (rows.length === 0) {
    return <EmptyState title={t("queueEmpty")} />;
  }

  const styles = new Set(rows.map((row) => row.categoryId)).size;
  const submissions = rows.map((row) => ({
    id: row.id,
    apprenticeId: row.apprenticeId,
    apprenticeName: row.apprenticeName,
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    categorySlug: row.categorySlug,
    level: row.levelPosition,
    lessonTitle: row.lessonTitle,
    submittedAt: row.submittedAt.toISOString(),
    photos: row.photos.map((photo) => ({
      src: photo.url,
      alt: photo.alt ?? row.lessonTitle,
      width: photo.width,
      height: photo.height,
    })),
    claimedByTeacherId: row.claimedBy,
    claimedAt: row.claimedAt ? row.claimedAt.toISOString() : null,
    personalLevel: row.personalLevel,
    claimedByName: row.claimedByName,
  }));

  return (
    <>
      <p className="text-sm text-zinc-400">{t("summary", { submissions: rows.length, styles })}</p>
      <TeacherDashboard submissions={submissions} reviewerId={reviewerId(nav)} />
    </>
  );
}

export async function GradingView({ nav }: { nav: StaffNav }) {
  const t = await getTranslations("Teacher.Grading");
  const tRoles = await getTranslations("Roles");

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <header>
        <SectionLabel className={navAccent[nav].eyebrow}>{tRoles(roleBadge[nav].role)}</SectionLabel>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">{t("title")}</h1>
      </header>
      <Suspense fallback={<QueueSkeleton />}>
        <PendingQueue nav={nav} />
      </Suspense>
    </main>
  );
}
