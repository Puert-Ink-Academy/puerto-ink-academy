"use server";

import { MASTERY_SCORE } from "@/lib/grading";
import { isViewableLevel } from "@/lib/levels";
import { getCategoryProgress } from "@/lib/mock/apprentice-dashboard";
import { isCategoryId } from "@/lib/mock/categories";
import { getLevelLesson } from "@/lib/mock/level-lessons";
import { getLevelResult } from "@/lib/mock/level-results";
import { sessionUsers } from "@/lib/mock/session";
import { hasPendingReview } from "@/lib/mock/teacher-dashboard";

export type SubmissionResult = { ok: true } | { error: string; pending?: true };

// Uploading to DigitalOcean Spaces and inserting the attempt row will happen here once storage is wired.
export async function submitLevelAttempt(
  categoryId: unknown,
  level: unknown,
  photoCount: unknown,
): Promise<SubmissionResult> {
  if (!isCategoryId(categoryId) || typeof level !== "number" || !getLevelLesson(categoryId, level)) {
    return { error: "This level doesn't exist." };
  }

  const progress = getCategoryProgress(categoryId);
  if (progress.isLocked || !isViewableLevel(level, progress.currentLevel)) {
    return { error: "This level is locked." };
  }

  if (hasPendingReview(sessionUsers.apprentice.id, categoryId, level)) {
    return { error: "This level already has a submission waiting for a grade.", pending: true };
  }

  if (getLevelResult(categoryId, level)?.highestScore === MASTERY_SCORE) {
    return { error: "You've already mastered this level." };
  }

  if (typeof photoCount !== "number" || photoCount < 1) {
    return { error: "Add at least one photo." };
  }

  return { ok: true };
}
