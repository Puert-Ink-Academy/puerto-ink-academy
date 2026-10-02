"use server";

import { getTranslations } from "next-intl/server";

import { MASTERY_SCORE } from "@/lib/grading";
import { isViewableLevel } from "@/lib/levels";
import { getCategoryProgress } from "@/lib/mock/apprentice-dashboard";
import { isCategoryId } from "@/lib/mock/categories";
import { getLevelLesson } from "@/lib/mock/level-lessons";
import { getLevelResult } from "@/lib/mock/level-results";
import { hasPendingReview } from "@/lib/mock/teacher-dashboard";
import { getCurrentApprentice } from "@/lib/session";

export type SubmissionResult = { ok: true } | { error: string; pending?: true };

// Uploading to DigitalOcean Spaces and inserting the attempt row will happen here once storage is wired.
export async function submitLevelAttempt(
  categoryId: unknown,
  level: unknown,
  photoCount: unknown,
): Promise<SubmissionResult> {
  const t = await getTranslations("Errors");

  if (!isCategoryId(categoryId) || typeof level !== "number" || !getLevelLesson(categoryId, level)) {
    return { error: t("levelMissing") };
  }

  const progress = getCategoryProgress(categoryId);
  if (progress.isLocked || !isViewableLevel(level, progress.currentLevel)) {
    return { error: t("levelLocked") };
  }

  if (hasPendingReview(getCurrentApprentice().id, categoryId, level)) {
    return { error: t("pendingReview"), pending: true };
  }

  if (getLevelResult(categoryId, level)?.highestScore === MASTERY_SCORE) {
    return { error: t("alreadyMastered") };
  }

  if (typeof photoCount !== "number" || photoCount < 1) {
    return { error: t("noPhotos") };
  }

  return { ok: true };
}
