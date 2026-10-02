import { CheckCircle2, Hourglass, RotateCcw } from "lucide-react";

import { PhotoThumbnails } from "@/components/submissions/photo-thumbnails";
import { Panel } from "@/components/ui/panel";
import { SectionLabel } from "@/components/ui/section-label";
import { isPassingScore, xpForScore } from "@/lib/grading";
import type { LevelAttempt } from "@/lib/mock/level-attempts";
import type { SubmissionPhoto } from "@/lib/mock/photos";
import { cn } from "cn";

export type PendingAttempt = {
  submittedAt: string;
  photos: SubmissionPhoto[];
};

export function AttemptHistory({
  attempts,
  pending,
}: {
  attempts: LevelAttempt[];
  pending?: PendingAttempt;
}) {
  if (attempts.length === 0 && !pending) return null;

  return (
    <Panel as="section">
      <SectionLabel as="h2">Attempts</SectionLabel>
      <ol className="mt-4 flex flex-col">
        {pending && (
          <li className="relative flex gap-3 pb-5 last:pb-0">
            {attempts.length > 0 && (
              <span
                aria-hidden
                className="absolute top-8 bottom-0 left-[0.9375rem] w-px bg-zinc-800"
              />
            )}
            <span
              aria-hidden
              className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-sky-400/40 bg-sky-400/10 text-sky-300"
            >
              <Hourglass className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-sm font-semibold text-zinc-50">
                  Attempt {attempts.length + 1}
                </p>
                <p className="text-xs text-zinc-500">{pending.submittedAt}</p>
                <span className="ml-auto rounded-full border border-sky-400/40 bg-sky-400/10 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-sky-300 uppercase">
                  Pending review
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                Waiting for your teacher&apos;s grade and feedback.
              </p>
              <div className="mt-3">
                <PhotoThumbnails photos={pending.photos} />
              </div>
            </div>
          </li>
        )}
        {attempts.map((attempt, index) => {
          const passed = isPassingScore(attempt.score);
          const isLast = index === attempts.length - 1;
          const Icon = passed ? CheckCircle2 : RotateCcw;

          return (
            <li key={attempt.id} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute top-8 bottom-0 left-[0.9375rem] w-px bg-zinc-800"
                />
              )}
              <span
                aria-hidden
                className={cn(
                  "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border",
                  passed
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-400",
                )}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-sm font-semibold text-zinc-50">
                    Attempt {attempt.attempt}
                  </p>
                  <p className="text-xs text-zinc-500">{attempt.submittedAt}</p>
                  <span
                    className={cn(
                      "ml-auto rounded-full border px-2 py-0.5 text-[0.65rem] font-medium tracking-wide uppercase tabular-nums",
                      passed
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                        : "border-rose-500/40 bg-rose-500/10 text-rose-300",
                    )}
                  >
                    {passed ? "Pass" : "Fail"} · {attempt.score}/10 · +
                    {xpForScore(attempt.score)} XP
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-300">
                  {attempt.feedback}
                </p>
                <div className="mt-3">
                  <PhotoThumbnails photos={attempt.photos} />
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
