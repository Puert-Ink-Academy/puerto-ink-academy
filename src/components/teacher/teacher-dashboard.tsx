"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { GradingModal } from "@/components/teacher/grading-modal";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { categoryStyles } from "@/lib/categories";
import { getPlatformUser } from "@/lib/mock/admin-users";
import { categories } from "@/lib/mock/categories";
import { personalLevelFor } from "@/lib/mock/leaderboard";
import type { PendingSubmission } from "@/lib/mock/teacher-dashboard";
import { cn } from "cn";

const claimFilters = ["all", "open", "mine", "others"] as const;

type ClaimFilter = (typeof claimFilters)[number];

function matchesClaim(submission: PendingSubmission, filter: ClaimFilter, reviewerId: string) {
  const owner = submission.claimedByTeacherId;
  if (filter === "open") return owner === null;
  if (filter === "mine") return owner === reviewerId;
  if (filter === "others") return owner !== null && owner !== reviewerId;
  return true;
}

export function TeacherDashboard({
  submissions,
  reviewerId,
}: {
  submissions: PendingSubmission[];
  reviewerId: string;
}) {
  const format = useFormatter();
  const t = useTranslations("Teacher.Grading");
  const [queue, setQueue] = useState(submissions);
  const [selected, setSelected] = useState<PendingSubmission | null>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<ClaimFilter>("all");

  const visible = queue.filter((submission) => matchesClaim(submission, filter, reviewerId));
  const groups = categories
    .map((category) => ({
      category,
      items: visible.filter((submission) => submission.categoryId === category.id),
    }))
    .filter((group) => group.items.length > 0);
  const filterLabel: Record<ClaimFilter, string> = {
    all: t("filterAll"),
    open: t("filterOpen"),
    mine: t("filterMine"),
    others: t("filterOthers"),
  };

  const openReview = (submission: PendingSubmission) => {
    setSelected(submission);
    setOpen(true);
  };

  const claim = (submission: PendingSubmission) => {
    const claimed: PendingSubmission = {
      ...submission,
      claimedByTeacherId: reviewerId,
      claimedAt: new Date().toISOString(),
    };
    setQueue((current) => current.map((item) => (item.id === submission.id ? claimed : item)));
    openReview(claimed);
  };

  const drop = (submission: PendingSubmission) => {
    setQueue((current) =>
      current.map((item) =>
        item.id === submission.id ? { ...item, claimedByTeacherId: null, claimedAt: null } : item,
      ),
    );
    if (selected?.id === submission.id) {
      setSelected(null);
      setOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div
          role="group"
          aria-label={t("filters")}
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {claimFilters.map((item) => {
            const count = queue.filter((submission) =>
              matchesClaim(submission, item, reviewerId),
            ).length;
            const selectedFilter = filter === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={selectedFilter}
                onClick={() => setFilter(item)}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
                  selectedFilter
                    ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100",
                )}
              >
                {filterLabel[item]}
                <span className="text-xs tabular-nums opacity-80">{count}</span>
              </button>
            );
          })}
        </div>
        {groups.length === 0 ? (
          <Panel
            variant="dashed"
            padding="none"
            className="flex flex-col items-center px-6 py-10 text-center"
          >
            <p className="text-sm font-medium text-zinc-200">{t("filterEmpty")}</p>
          </Panel>
        ) : (
          groups.map(({ category, items }) => {
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
                {items.map((submission) => {
                  const claimedByYou = submission.claimedByTeacherId === reviewerId;
                  const claimedByOther =
                    submission.claimedByTeacherId !== null && !claimedByYou;
                  const reviewerName = submission.claimedByTeacherId
                    ? (getPlatformUser(submission.claimedByTeacherId)?.name ??
                      submission.claimedByTeacherId)
                    : "";
                  const underReview = t("underReview", { name: reviewerName });

                  return (
                    <li
                      key={submission.id}
                      className={cn(
                        "border-b border-zinc-800 last:border-b-0",
                        claimedByOther && "opacity-60",
                      )}
                    >
                      <div className="flex min-h-16 flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                        <span className="flex min-w-0 flex-1 items-center gap-4">
                          <span
                            className={cn(
                              "flex size-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                              style.chip,
                            )}
                          >
                            {submission.apprenticeName[0]}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-zinc-50">
                            {t("row", {
                              name: submission.apprenticeName,
                              level: submission.level,
                              personal: personalLevelFor(submission.apprenticeId),
                            })}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-zinc-400">
                              {submission.lessonTitle} ·{" "}
                              {format.relativeTime(new Date(submission.submittedAt))}
                            </span>
                          </span>
                        </span>
                        <span className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                          {claimedByOther && (
                            <span
                              title={underReview}
                              className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[0.65rem] font-medium text-amber-300"
                            >
                              {underReview}
                            </span>
                          )}
                          {claimedByYou && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => drop(submission)}
                            >
                              {t("drop")}
                            </Button>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant={claimedByYou ? "default" : "outline"}
                            disabled={claimedByOther}
                            onClick={() =>
                              claimedByYou ? openReview(submission) : claim(submission)
                            }
                          >
                            {claimedByYou ? t("continue") : t("claim")}
                          </Button>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </Panel>
            </section>
          );
        })
        )}
      </div>
      <GradingModal
        submission={selected}
        open={open}
        onOpenChange={setOpen}
        onDrop={selected ? () => drop(selected) : undefined}
      />
    </>
  );
}
