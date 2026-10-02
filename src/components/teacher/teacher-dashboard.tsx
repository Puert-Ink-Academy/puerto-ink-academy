"use client";

import { ChevronRight } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { GradingModal } from "@/components/teacher/grading-modal";
import { Panel } from "@/components/ui/panel";
import { categoryStyles } from "@/lib/categories";
import { categories } from "@/lib/mock/categories";
import type { PendingSubmission } from "@/lib/mock/teacher-dashboard";
import { cn } from "cn";

export function TeacherDashboard({ submissions }: { submissions: PendingSubmission[] }) {
  const format = useFormatter();
  const t = useTranslations("Teacher.Grading");
  const [selected, setSelected] = useState<PendingSubmission | null>(null);
  const [open, setOpen] = useState(false);

  const groups = categories
    .map((category) => ({
      category,
      items: submissions.filter((submission) => submission.categoryId === category.id),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <div className="flex flex-col gap-6">
        {groups.map(({ category, items }) => {
          const style = categoryStyles[category.id];
          const Icon = style.icon;
          const headingId = `grading-${category.id}`;

          return (
            <section key={category.id} aria-labelledby={headingId}>
              <div className="mb-2.5 flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg border",
                    style.chip,
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <h2 id={headingId} className="text-sm font-semibold text-zinc-50">
                  {category.name}
                </h2>
                <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-xs font-medium text-zinc-300 tabular-nums">
                  {items.length}
                </span>
              </div>
              <Panel as="ul" padding="flush" className="flex flex-col">
                {items.map((submission) => (
                  <li key={submission.id} className="border-b border-zinc-800 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(submission);
                        setOpen(true);
                      }}
                      className="flex min-h-16 w-full items-center gap-4 px-4 py-3 text-left transition-colors outline-none hover:bg-zinc-800/60 focus-visible:bg-zinc-800/60"
                    >
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                          style.chip,
                        )}
                      >
                        {submission.apprenticeName[0]}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-zinc-50">
                          {t("row", {
                            name: submission.apprenticeName,
                            level: submission.level,
                            xp: format.number(submission.xp),
                          })}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-zinc-400">
                          {submission.lessonTitle} ·{" "}
                          {format.relativeTime(new Date(submission.submittedAt))}
                        </span>
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-zinc-500" aria-hidden />
                    </button>
                  </li>
                ))}
              </Panel>
            </section>
          );
        })}
      </div>
      <GradingModal submission={selected} open={open} onOpenChange={setOpen} />
    </>
  );
}
