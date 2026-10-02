import { useTranslations } from "next-intl";

import { navAccent, roleBadge } from "@/components/layout/nav-items";
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard";
import { SectionLabel } from "@/components/ui/section-label";
import { pendingSubmissions } from "@/lib/mock/teacher-dashboard";
import type { StaffNav } from "@/lib/nav";
import { getSessionUser } from "@/lib/session";

export function GradingView({ nav }: { nav: StaffNav }) {
  const t = useTranslations("Teacher.Grading");
  const tRoles = useTranslations("Roles");
  const styles = new Set(pendingSubmissions.map((submission) => submission.categoryId)).size;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <header>
        <SectionLabel className={navAccent[nav].eyebrow}>{tRoles(roleBadge[nav].role)}</SectionLabel>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">{t("title")}</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {t("summary", { submissions: pendingSubmissions.length, styles })}
        </p>
      </header>
      <TeacherDashboard
        submissions={pendingSubmissions}
        reviewerId={getSessionUser(nav).id}
      />
    </main>
  );
}
