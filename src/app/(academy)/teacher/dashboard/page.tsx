import { TeacherDashboard } from "@/components/teacher/teacher-dashboard";
import { pendingSubmissions } from "@/lib/mock/teacher-dashboard";

export default function TeacherDashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <header>
        <p className="text-[0.7rem] font-medium tracking-[0.12em] text-amber-400 uppercase">
          Teacher
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
          Submissions to grade
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {pendingSubmissions.length} apprentices are waiting for feedback.
        </p>
      </header>
      <TeacherDashboard submissions={pendingSubmissions} />
    </main>
  );
}
