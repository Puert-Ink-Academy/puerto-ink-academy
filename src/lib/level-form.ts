import { PASS_SCORE, xpForScore } from "@/lib/grading";
import type { LevelLesson } from "@/lib/mock/level-lessons";

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

export function levelFormFromLesson(lesson: LevelLesson): LevelFormValues {
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
