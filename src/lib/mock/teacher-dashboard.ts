import { apprenticeDashboard } from "@/lib/mock/apprentice-dashboard";
import type { CategoryId } from "@/lib/mock/categories";
import { mockPhotos, type SubmissionPhoto } from "@/lib/mock/photos";

export type PendingSubmission = {
  id: string;
  apprenticeId: string;
  apprenticeName: string;
  categoryId: CategoryId;
  level: number;
  xp: number;
  lessonTitle: string;
  submittedAt: string;
  photos: SubmissionPhoto[];
};

export const pendingSubmissions: PendingSubmission[] = [
  {
    id: "john-doe-fine-line-level-4",
    apprenticeId: "john-doe",
    apprenticeName: "John Doe",
    categoryId: "fine-line",
    level: 4,
    xp: apprenticeDashboard.xp,
    lessonTitle: "Stencil Transfer",
    submittedAt: "20 minutes ago",
    photos: [mockPhotos.roseOutline, mockPhotos.evolutionClean],
  },
  {
    id: "sofia-fine-line-level-9",
    apprenticeId: "sofia",
    apprenticeName: "Sofia",
    categoryId: "fine-line",
    level: 9,
    xp: 4280,
    lessonTitle: "Color Packing",
    submittedAt: "1 hour ago",
    photos: [mockPhotos.colorPacking, mockPhotos.roseOutline],
  },
  {
    id: "diego-fine-line-level-8",
    apprenticeId: "diego",
    apprenticeName: "Diego",
    categoryId: "fine-line",
    level: 8,
    xp: 3610,
    lessonTitle: "Shading Gradients",
    submittedAt: "2 hours ago",
    photos: [mockPhotos.gradientShading, mockPhotos.whipShading, mockPhotos.roseOutline],
  },
  {
    id: "kai-fine-line-level-6",
    apprenticeId: "kai",
    apprenticeName: "Kai",
    categoryId: "fine-line",
    level: 6,
    xp: 2150,
    lessonTitle: "Line Weight",
    submittedAt: "Yesterday",
    photos: [mockPhotos.liningDrills],
  },
  {
    id: "alex-realism-level-5",
    apprenticeId: "alex",
    apprenticeName: "Alex",
    categoryId: "realism",
    level: 5,
    xp: 6920,
    lessonTitle: "Photo-Reference Piece",
    submittedAt: "3 hours ago",
    photos: [mockPhotos.gradientShading, mockPhotos.whipShading],
  },
  {
    id: "lena-realism-level-3",
    apprenticeId: "lena",
    apprenticeName: "Lena",
    categoryId: "realism",
    level: 3,
    xp: 2740,
    lessonTitle: "Skin Textures",
    submittedAt: "5 hours ago",
    photos: [mockPhotos.whipShading, mockPhotos.gradientShading],
  },
  {
    id: "mike-japanese-level-2",
    apprenticeId: "mike",
    apprenticeName: "Mike",
    categoryId: "japanese",
    level: 2,
    xp: 6400,
    lessonTitle: "Wave Patterns",
    submittedAt: "4 hours ago",
    photos: [mockPhotos.liningDrills, mockPhotos.colorPacking],
  },
  {
    id: "marco-traditional-level-2",
    apprenticeId: "marco",
    apprenticeName: "Marco",
    categoryId: "traditional",
    level: 2,
    xp: 7850,
    lessonTitle: "Solid Black Fill",
    submittedAt: "Yesterday",
    photos: [mockPhotos.colorPacking],
  },
];

export function getPendingSubmission(
  apprenticeId: string,
  categoryId: CategoryId,
  level: number,
): PendingSubmission | undefined {
  return pendingSubmissions.find(
    (submission) =>
      submission.apprenticeId === apprenticeId &&
      submission.categoryId === categoryId &&
      submission.level === level,
  );
}

export function hasPendingReview(
  apprenticeId: string,
  categoryId: CategoryId,
  level: number,
): boolean {
  return getPendingSubmission(apprenticeId, categoryId, level) !== undefined;
}
