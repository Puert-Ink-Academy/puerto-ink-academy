import { navAccent, roleBadge } from "@/components/layout/nav-items";
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard";
import { SectionLabel } from "@/components/ui/section-label";
import { pendingSubmissions } from "@/lib/mock/teacher-dashboard";
import type { StaffNav } from "@/lib/nav";

export function GradingView({ nav }: { nav: StaffNav }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <header>
        <SectionLabel className={navAccent[nav].eyebrow}>{roleBadge[nav].label}</SectionLabel>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
          Submissions to grade
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {pendingSubmissions.length} submissions across{" "}
          {new Set(pendingSubmissions.map((submission) => submission.categoryId)).size} styles
          are waiting for feedback.
        </p>
      </header>
      <TeacherDashboard submissions={pendingSubmissions} />
    </main>
  );
}
