import type { CategoryId } from "@/lib/mock/categories";
import { mockPhotos, type SubmissionPhoto } from "@/lib/mock/photos";

export type LevelAttempt = {
  id: string;
  categoryId: CategoryId;
  level: number;
  attempt: number;
  submittedAt: string;
  photos: SubmissionPhoto[];
  score: number;
  feedback: string;
};

export const levelAttempts: LevelAttempt[] = [
  {
    categoryId: "fine-line",
    id: "fine-line-level-1-attempt-1",
    level: 1,
    attempt: 1,
    submittedAt: "Mar 4, 2026",
    photos: [mockPhotos.liningDrills],
    score: 9,
    feedback: "Clean station and solid glove discipline. Great start.",
  },
  {
    categoryId: "fine-line",
    id: "fine-line-level-2-attempt-1",
    level: 2,
    attempt: 1,
    submittedAt: "Mar 11, 2026",
    photos: [mockPhotos.liningDrills, mockPhotos.roseOutline],
    score: 6,
    feedback:
      "Needle hang is too long, so the lines blow out. Shorten it and resubmit.",
  },
  {
    categoryId: "fine-line",
    id: "fine-line-level-2-attempt-2",
    level: 2,
    attempt: 2,
    submittedAt: "Mar 14, 2026",
    photos: [mockPhotos.liningDrills],
    score: 8,
    feedback: "Hang is right now. Keep an eye on your voltage for lining.",
  },
  {
    categoryId: "fine-line",
    id: "fine-line-level-3-attempt-1",
    level: 3,
    attempt: 1,
    submittedAt: "Mar 22, 2026",
    photos: [mockPhotos.liningDrills, mockPhotos.whipShading],
    score: 10,
    feedback: "Perfectly even depth across the whole sheet. No notes.",
  },
  {
    categoryId: "fine-line",
    id: "fine-line-level-4-attempt-1",
    level: 4,
    attempt: 1,
    submittedAt: "Apr 2, 2026",
    photos: [mockPhotos.roseOutline],
    score: 8,
    feedback: "Placement is good. Use a little less solution for crisper lines.",
  },
  {
    categoryId: "fine-line",
    id: "fine-line-level-5-attempt-1",
    level: 5,
    attempt: 1,
    submittedAt: "Apr 12, 2026",
    photos: [mockPhotos.liningDrills, mockPhotos.roseOutline],
    score: 7,
    feedback:
      "Close. Your straights are steady, but rework the transitions on the curves so they don't wobble.",
  },
];

export function getLevelAttempts(categoryId: CategoryId, level: number): LevelAttempt[] {
  return levelAttempts
    .filter((attempt) => attempt.categoryId === categoryId && attempt.level === level)
    .sort((a, b) => b.attempt - a.attempt);
}
