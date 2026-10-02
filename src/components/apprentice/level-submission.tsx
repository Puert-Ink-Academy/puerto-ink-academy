"use client";

import { ArrowLeft, BookOpen, Clock, Hourglass, RefreshCw, RotateCcw, Send } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { submitLevelAttempt } from "@/app/actions/submissions";
import {
  PhotoUploadZone,
  type SelectedPhoto,
} from "@/components/apprentice/photo-upload-zone";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { SectionLabel } from "@/components/ui/section-label";
import { MASTERY_SCORE, xpForScore } from "@/lib/grading";
import type { CategoryId } from "@/lib/mock/categories";
import { cn } from "cn";

type Variant =
  | { variant: "first" }
  | { variant: "retry"; latestScore: number; latestFeedback: string }
  | { variant: "improve" };

export type LevelSubmissionProps = Variant & {
  categoryId: CategoryId;
  categoryName: string;
  level: number;
  pending: boolean;
};

const headings: Record<Variant["variant"], string> = {
  first: "Your Submission",
  retry: "Try Again",
  improve: "Go for 10/10",
};

const buttonLabels: Record<Variant["variant"], string> = {
  first: "Submit Exercise",
  retry: "Resubmit Exercise",
  improve: `Resubmit for Better Score (Max ${MASTERY_SCORE})`,
};

export function LevelSubmission(props: LevelSubmissionProps) {
  const { variant, categoryId, categoryName, level } = props;
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [isPending, setIsPending] = useState(props.pending);
  const [sending, startSending] = useTransition();
  const ButtonIcon = variant === "first" ? Send : RefreshCw;

  const lockForReview = () => {
    photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    setPhotos([]);
    setIsPending(true);
  };

  const submit = () => {
    startSending(async () => {
      const result = await submitLevelAttempt(categoryId, level, photos.length);
      if ("error" in result) {
        toast.error(result.error);
        if (result.pending) lockForReview();
        return;
      }
      toast("Your submission has been sent to the teacher");
      lockForReview();
    });
  };

  return (
    <Panel as="section">
      <SectionLabel as="h2">{headings[variant]}</SectionLabel>

      {props.variant === "retry" && (
        <div
          role="status"
          className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3.5"
        >
          <p className="flex items-start gap-2 text-sm font-medium text-rose-200">
            <RotateCcw className="mt-0.5 size-4 shrink-0 text-rose-400" aria-hidden />
            Score: {props.latestScore}/10. Review teacher feedback and try again
          </p>
          <blockquote className="mt-2 border-l-2 border-rose-500/40 pl-3 text-sm leading-relaxed text-zinc-300">
            {props.latestFeedback}
          </blockquote>
        </div>
      )}

      {variant === "improve" && (
        <p className="mt-2 text-sm text-zinc-400">
          Your best score counts. A {MASTERY_SCORE}/10 earns +{xpForScore(MASTERY_SCORE)} XP and
          the Mastery Badge.
        </p>
      )}

      <div className="mt-4">
        <PhotoUploadZone photos={photos} onPhotosChange={setPhotos} disabled={isPending} />
      </div>

      {isPending ? (
        <>
          <Button
            type="button"
            size="lg"
            disabled
            onClick={submit}
            className="mt-5 h-11 w-full bg-zinc-800 text-zinc-300 sm:w-auto sm:px-6"
          >
            <Clock aria-hidden />
            Pending Teacher Review
          </Button>
          <div
            role="status"
            className="mt-4 flex gap-3 rounded-lg border border-sky-400/30 bg-sky-400/10 p-3.5"
          >
            <Hourglass className="mt-0.5 size-5 shrink-0 text-sky-300" aria-hidden />
            <div className="min-w-0">
              <p className="text-sm leading-relaxed text-sky-100">
                Your task is waiting for a grade. You can review the theory or practice other
                unlocked tasks while you wait.
              </p>
              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
                <a
                  href="#lesson"
                  className="flex items-center gap-1.5 text-sky-300 hover:text-sky-200"
                >
                  <BookOpen className="size-4" aria-hidden />
                  Review the theory
                </a>
                <Link
                  href={`/apprentice/category/${categoryId}`}
                  className="flex items-center gap-1.5 text-sky-300 hover:text-sky-200"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Back to {categoryName}
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Button
          type="button"
          size="lg"
          variant={variant === "improve" ? "outline" : "default"}
          disabled={photos.length === 0 || sending}
          onClick={submit}
          className={cn(
            "mt-5 h-11 w-full sm:w-auto sm:px-6",
            variant === "improve"
              ? "text-amber-300 hover:text-amber-200 dark:border-amber-400/40 dark:bg-transparent dark:hover:bg-amber-400/10"
              : "bg-amber-400 text-zinc-950 hover:bg-amber-300",
          )}
        >
          <ButtonIcon aria-hidden />
          {sending ? "Sending…" : buttonLabels[variant]}
        </Button>
      )}
    </Panel>
  );
}
