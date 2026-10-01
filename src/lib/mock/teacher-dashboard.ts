export type PendingSubmission = {
  id: string;
  apprenticeName: string;
  level: number;
  xp: number;
  lessonTitle: string;
  submittedAt: string;
  photo: { src: string; alt: string; width: number; height: number };
};

const mockPhoto = {
  src: "/mock/tattoo-submission.jpg",
  alt: "Practice skin with straight line, curve, circle, and rose outline drills",
  width: 1152,
  height: 864,
};

export const pendingSubmissions: PendingSubmission[] = [
  {
    id: "michael-level-8",
    apprenticeName: "Michael",
    level: 8,
    xp: 7850,
    lessonTitle: "Shading Gradients",
    submittedAt: "2 hours ago",
    photo: mockPhoto,
  },
  {
    id: "alex-level-6",
    apprenticeName: "Alex",
    level: 6,
    xp: 5420,
    lessonTitle: "Whip Shading",
    submittedAt: "5 hours ago",
    photo: mockPhoto,
  },
  {
    id: "john-level-4",
    apprenticeName: "John",
    level: 4,
    xp: 3200,
    lessonTitle: "Curves and Circles",
    submittedAt: "Yesterday",
    photo: mockPhoto,
  },
];
