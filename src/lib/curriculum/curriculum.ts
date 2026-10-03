import type { LevelLesson } from "@/lib/mock/level-lessons";

export type CurriculumCategory = {
  id: string;
  name: string;
  tagline: string;
};

export type CurriculumLevel = Omit<LevelLesson, "categoryId"> & { categoryId: string };
