"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { GradingModal } from "@/components/teacher/grading-modal";
import { getCategory } from "@/lib/mock/categories";
import type { PendingSubmission } from "@/lib/mock/teacher-dashboard";

export function TeacherDashboard({ submissions }: { submissions: PendingSubmission[] }) {
  const [selected, setSelected] = useState<PendingSubmission | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <ul className="flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        {submissions.map((submission) => (
          <li key={submission.id} className="border-b border-zinc-800 last:border-b-0">
            <button
              type="button"
              onClick={() => {
                setSelected(submission);
                setOpen(true);
              }}
              className="flex min-h-16 w-full items-center gap-4 px-4 py-3 text-left transition-colors outline-none hover:bg-zinc-800/60 focus-visible:bg-zinc-800/60"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 text-sm font-semibold text-amber-300">
                {submission.apprenticeName[0]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-zinc-50">
                  {submission.apprenticeName} — Level {submission.level} —{" "}
                  {submission.xp.toLocaleString("en-US")} XP
                </span>
                <span className="mt-0.5 block truncate text-xs text-zinc-400">
                  {getCategory(submission.categoryId).name} · {submission.lessonTitle} ·{" "}
                  {submission.submittedAt}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-zinc-500" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      <GradingModal submission={selected} open={open} onOpenChange={setOpen} />
    </>
  );
}
