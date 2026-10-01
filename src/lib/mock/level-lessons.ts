export type LevelReference = {
  id: string;
  label: string;
};

export type LevelLesson = {
  level: number;
  title: string;
  objective: string;
  exercise: string;
  tips: string;
  references: LevelReference[];
};

export const levelLessons: LevelLesson[] = [
  {
    level: 5,
    title: "Line Control",
    objective: "What the apprentice needs to learn",
    exercise: "Detailed description of the task",
    tips: "Advice from the teacher",
    references: [
      { id: "straight-lines", label: "Straight lines" },
      { id: "curves", label: "Curves" },
      { id: "circles", label: "Circles" },
      { id: "line-weight", label: "Line weight" },
    ],
  },
];

export function getLevelLesson(level: number): LevelLesson | undefined {
  return levelLessons.find((lesson) => lesson.level === level);
}
