import type { CurriculumLevel } from "@/lib/curriculum/curriculum";
import { PASS_SCORE, xpForScore } from "@/lib/progress/grading";

export type LevelFormValues = {
  level: number;
  title: string;
  objective: string;
  exercise: string;
  tips: string;
  passingScore: number;
  xpReward: number;
};

export const DEFAULT_XP_REWARD = xpForScore(10);

export function emptyLevelForm(nextLevel: number): LevelFormValues {
  return {
    level: nextLevel,
    title: "",
    objective: "",
    exercise: "",
    tips: "",
    passingScore: PASS_SCORE,
    xpReward: DEFAULT_XP_REWARD,
  };
}

export function levelFormFromLesson(lesson: CurriculumLevel): LevelFormValues {
  return {
    level: lesson.level,
    title: lesson.title,
    objective: lesson.objective,
    exercise: lesson.exercise,
    tips: lesson.tips,
    passingScore: PASS_SCORE,
    xpReward: DEFAULT_XP_REWARD,
  };
}

function text(formData: FormData, name: keyof LevelFormValues): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function levelFormFromData(formData: FormData): LevelFormValues {
  return {
    level: Number(text(formData, "level")),
    title: text(formData, "title"),
    objective: text(formData, "objective"),
    exercise: text(formData, "exercise"),
    tips: text(formData, "tips"),
    passingScore: Number(text(formData, "passingScore")),
    xpReward: Number(text(formData, "xpReward")),
  };
}
