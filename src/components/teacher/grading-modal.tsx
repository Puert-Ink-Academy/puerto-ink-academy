"use client";

import { CheckCircle2, RotateCcw } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";

import { PhotoGallery } from "@/components/submissions/photo-gallery";
import { ScoreInput } from "@/components/teacher/score-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { isPassingScore, xpForScore } from "@/lib/grading";
import { getCategory } from "@/lib/mock/categories";
import type { PendingSubmission } from "@/lib/mock/teacher-dashboard";
import { cn } from "cn";

function GradeResult({ score }: { score: number }) {
  const passed = isPassingScore(score);

  return (
    <div
      aria-live="polite"
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2.5",
        passed
          ? "border-emerald-500/40 bg-emerald-500/10"
          : "border-rose-500/40 bg-rose-500/10",
      )}
    >
      {passed ? (
        <CheckCircle2 className="size-5 text-emerald-400" aria-hidden />
      ) : (
        <RotateCcw className="size-5 text-rose-400" aria-hidden />
      )}
      <div className="flex-1">
        <p
          className={cn(
            "text-sm font-semibold tracking-wide uppercase",
            passed ? "text-emerald-300" : "text-rose-300",
          )}
        >
          {passed ? "Pass" : "Fail"}
        </p>
        <p className="text-xs text-zinc-400">
          {passed ? "Unlocks the next level" : "The apprentice will retry this exercise"}
        </p>
      </div>
      <p className="text-sm font-semibold text-amber-300 tabular-nums">
        +{xpForScore(score)} XP
      </p>
    </div>
  );
}

function GradingForm({
  submission,
  onSubmitted,
}: {
  submission: PendingSubmission;
  onSubmitted: () => void;
}) {
  const scoreLabelId = useId();
  const feedbackId = useId();
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (score === null) return;
        toast.success(`Grade submitted for ${submission.apprenticeName}`);
        onSubmitted();
      }}
    >
      <div className="flex flex-col gap-3">
        <p
          id={scoreLabelId}
          className="text-[0.7rem] font-medium tracking-[0.12em] text-zinc-400 uppercase"
        >
          Score (0–10)
        </p>
        <ScoreInput value={score} onChange={setScore} labelId={scoreLabelId} />
        {score !== null && <GradeResult score={score} />}
      </div>
      <div className="flex flex-col gap-2">
        <label
          htmlFor={feedbackId}
          className="text-[0.7rem] font-medium tracking-[0.12em] text-zinc-400 uppercase"
        >
          Teacher Feedback
        </label>
        <Textarea
          id={feedbackId}
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          placeholder="What went well, and what to work on next"
          className="min-h-28 border-zinc-700 bg-zinc-950/60 text-zinc-100 focus-visible:border-amber-400 focus-visible:ring-amber-400/30"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={score === null}
        className="h-11 w-full bg-amber-400 text-zinc-950 hover:bg-amber-300"
      >
        Submit Grade
      </Button>
    </form>
  );
}

export function GradingModal({
  submission,
  open,
  onOpenChange,
}: {
  submission: PendingSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {submission && (
        <DialogContent className="top-0 left-0 flex h-svh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-y-auto rounded-none bg-zinc-900 p-0 ring-zinc-800 sm:max-w-none md:top-1/2 md:left-1/2 md:grid md:h-auto md:max-h-[90svh] md:w-[calc(100%-4rem)] md:max-w-5xl md:-translate-x-1/2 md:-translate-y-1/2 md:grid-cols-[1.4fr_1fr] md:overflow-hidden md:rounded-xl pt-[env(safe-area-inset-top)] md:pt-0 [&>[data-slot=dialog-close]]:top-[calc(0.5rem+env(safe-area-inset-top))] md:[&>[data-slot=dialog-close]]:top-2 [&>[data-slot=dialog-close]]:z-10 [&>[data-slot=dialog-close]]:bg-zinc-950/70 [&>[data-slot=dialog-close]]:text-zinc-100 [&>[data-slot=dialog-close]]:backdrop-blur">
          <div className="relative flex shrink-0 items-center justify-center bg-zinc-950 md:min-h-0">
            <PhotoGallery photos={submission.photos} />
          </div>
          <div className="flex flex-col gap-5 p-5 md:overflow-y-auto">
            <div className="pr-8">
              <DialogTitle className="text-lg font-semibold text-zinc-50">
                {submission.apprenticeName}
              </DialogTitle>
              <DialogDescription className="mt-1 text-zinc-400">
                {getCategory(submission.categoryId).name} · Level {submission.level} ·{" "}
                {submission.lessonTitle} ·{" "}
                {submission.submittedAt}
              </DialogDescription>
            </div>
            <GradingForm
              submission={submission}
              onSubmitted={() => onOpenChange(false)}
            />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
