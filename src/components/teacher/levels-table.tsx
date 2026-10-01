"use client";

import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PASS_SCORE } from "@/lib/grading";
import { DEFAULT_XP_REWARD } from "@/lib/level-form";
import type { LevelLesson } from "@/lib/mock/level-lessons";

export function LevelsTable({
  lessons,
  onEdit,
}: {
  lessons: LevelLesson[];
  onEdit: (lesson: LevelLesson) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="w-16 pl-4 text-[0.7rem] tracking-[0.12em] text-zinc-500 uppercase">
              Level
            </TableHead>
            <TableHead className="text-[0.7rem] tracking-[0.12em] text-zinc-500 uppercase">
              Title
            </TableHead>
            <TableHead className="hidden text-[0.7rem] tracking-[0.12em] text-zinc-500 uppercase md:table-cell">
              Objective
            </TableHead>
            <TableHead className="hidden w-16 text-[0.7rem] tracking-[0.12em] text-zinc-500 uppercase sm:table-cell">
              Pass
            </TableHead>
            <TableHead className="hidden w-16 text-[0.7rem] tracking-[0.12em] text-zinc-500 uppercase sm:table-cell">
              XP
            </TableHead>
            <TableHead className="w-14 pr-4">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessons.map((lesson) => (
            <TableRow key={lesson.level} className="border-zinc-800 hover:bg-zinc-800/40">
              <TableCell className="pl-4">
                <span className="flex size-8 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 text-xs font-semibold text-amber-300 tabular-nums">
                  {lesson.level}
                </span>
              </TableCell>
              <TableCell className="truncate font-medium text-zinc-50">
                Level {lesson.level}: {lesson.title}
              </TableCell>
              <TableCell className="hidden truncate text-zinc-400 md:table-cell">
                {lesson.objective}
              </TableCell>
              <TableCell className="hidden text-zinc-300 tabular-nums sm:table-cell">
                {PASS_SCORE}/10
              </TableCell>
              <TableCell className="hidden text-amber-300 tabular-nums sm:table-cell">
                {DEFAULT_XP_REWARD}
              </TableCell>
              <TableCell className="pr-4 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit Level ${lesson.level}`}
                  onClick={() => onEdit(lesson)}
                  className="size-10 text-zinc-400 hover:bg-zinc-800 hover:text-amber-300"
                >
                  <Pencil />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
