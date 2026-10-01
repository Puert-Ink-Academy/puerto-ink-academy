export type LevelResult = {
  level: number;
  score: number;
  attempts: number;
  feedback: string;
};

export const levelResults: LevelResult[] = [
  {
    level: 1,
    score: 9,
    attempts: 1,
    feedback: "Clean station and solid glove discipline. Great start.",
  },
  {
    level: 2,
    score: 8,
    attempts: 2,
    feedback: "Hang is right now. Keep an eye on your voltage for lining.",
  },
  {
    level: 3,
    score: 10,
    attempts: 1,
    feedback: "Perfectly even depth across the whole sheet. No notes.",
  },
  {
    level: 4,
    score: 8,
    attempts: 1,
    feedback: "Placement is good. Use a little less solution for crisper lines.",
  },
];

export function getLevelResult(level: number): LevelResult | undefined {
  return levelResults.find((result) => result.level === level);
}
