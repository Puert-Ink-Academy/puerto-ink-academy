import type { CategoryId } from "@/lib/mock/categories";
import { mockPhotos, type SubmissionPhoto } from "@/lib/mock/photos";

export type PendingSubmission = {
  id: string;
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
    id: "michael-fine-line-level-8",
    apprenticeName: "Michael",
    categoryId: "fine-line",
    level: 8,
    xp: 7850,
    lessonTitle: "Shading Gradients",
    submittedAt: "2 hours ago",
    photos: [mockPhotos.gradientShading, mockPhotos.whipShading, mockPhotos.roseOutline],
  },
  {
    id: "alex-realism-level-3",
    apprenticeName: "Alex",
    categoryId: "realism",
    level: 3,
    xp: 5420,
    lessonTitle: "Skin Textures",
    submittedAt: "5 hours ago",
    photos: [mockPhotos.whipShading, mockPhotos.gradientShading],
  },
  {
    id: "john-traditional-level-1",
    apprenticeName: "John",
    categoryId: "traditional",
    level: 1,
    xp: 3200,
    lessonTitle: "Bold Outlines",
    submittedAt: "Yesterday",
    photos: [mockPhotos.liningDrills],
  },
];
