"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { LevelFormSheet } from "@/components/teacher/level-form-sheet";
import { LevelsTable } from "@/components/teacher/levels-table";
import { Button } from "@/components/ui/button";
import { emptyLevelForm, levelFormFromLesson } from "@/lib/level-form";
import type { LevelLesson } from "@/lib/mock/level-lessons";

export function CurriculumManager({ lessons }: { lessons: LevelLesson[] }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<LevelLesson | null>(null);

  const nextLevel = lessons.reduce((max, lesson) => Math.max(max, lesson.level), 0) + 1;

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.7rem] font-medium tracking-[0.12em] text-amber-400 uppercase">
            Teacher
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
            Curriculum
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {lessons.length} permanent levels
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            setEditing(null);
            setSheetOpen(true);
          }}
          className="h-11 w-full bg-amber-400 px-4 text-zinc-950 shadow-[0_0_24px_-6px_var(--color-amber-400)] hover:bg-amber-300 sm:w-auto"
        >
          <Plus />
          Create New Level
        </Button>
      </header>
      <LevelsTable
        lessons={lessons}
        onEdit={(lesson) => {
          setEditing(lesson);
          setSheetOpen(true);
        }}
      />
      <LevelFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode={editing ? "edit" : "create"}
        initialValues={editing ? levelFormFromLesson(editing) : emptyLevelForm(nextLevel)}
      />
    </>
  );
}
