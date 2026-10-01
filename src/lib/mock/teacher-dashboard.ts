import { mockPhotos, type SubmissionPhoto } from "@/lib/mock/photos";

export type PendingSubmission = {
  id: string;
  apprenticeName: string;
  level: number;
  xp: number;
  lessonTitle: string;
  submittedAt: string;
  photos: SubmissionPhoto[];
};

export const pendingSubmissions: PendingSubmission[] = [
  {
    id: "michael-level-8",
    apprenticeName: "Michael",
    level: 8,
    xp: 7850,
    lessonTitle: "Shading Gradients",
    submittedAt: "2 hours ago",
    photos: [mockPhotos.gradientShading, mockPhotos.whipShading, mockPhotos.roseOutline],
  },
  {
    id: "alex-level-6",
    apprenticeName: "Alex",
    level: 6,
    xp: 5420,
    lessonTitle: "Whip Shading",
    submittedAt: "5 hours ago",
    photos: [mockPhotos.whipShading, mockPhotos.gradientShading],
  },
  {
    id: "john-level-4",
    apprenticeName: "John",
    level: 4,
    xp: 3200,
    lessonTitle: "Curves and Circles",
    submittedAt: "Yesterday",
    photos: [mockPhotos.liningDrills],
  },
];
