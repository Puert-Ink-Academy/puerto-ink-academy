"use client";

import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategoryStyle } from "@/lib/categories";
import type { CurriculumLevel } from "@/lib/curriculum";
import { PASS_SCORE } from "@/lib/grading";
import { DEFAULT_XP_REWARD } from "@/lib/level-form";
import { cn } from "cn";

export function LevelsTable({
  categoryId,
  lessons,
  onEdit,
}: {
  categoryId: string;
  lessons: CurriculumLevel[];
  onEdit: (lesson: CurriculumLevel) => void;
}) {
  const t = useTranslations("Teacher.Curriculum.Table");
  const style = getCategoryStyle(categoryId);

  return (
    <Panel padding="flush">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="w-16 pl-4 text-[0.7rem] tracking-[0.12em] text-zinc-500 uppercase">
              {t("level")}
            </TableHead>
            <TableHead className="text-[0.7rem] tracking-[0.12em] text-zinc-500 uppercase">
              {t("title")}
            </TableHead>
            <TableHead className="hidden text-[0.7rem] tracking-[0.12em] text-zinc-500 uppercase md:table-cell">
              {t("objective")}
            </TableHead>
            <TableHead className="hidden w-16 text-[0.7rem] tracking-[0.12em] text-zinc-500 uppercase sm:table-cell">
              {t("pass")}
            </TableHead>
            <TableHead className="hidden w-16 text-[0.7rem] tracking-[0.12em] text-zinc-500 uppercase sm:table-cell">
              {t("xp")}
            </TableHead>
            <TableHead className="w-14 pr-4">
              <span className="sr-only">{t("actions")}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessons.map((lesson) => (
            <TableRow key={lesson.level} className="border-zinc-800 hover:bg-zinc-800/40">
              <TableCell className="pl-4">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border text-xs font-semibold tabular-nums",
                    style.chip,
                  )}
                >
                  {lesson.level}
                </span>
              </TableCell>
              <TableCell className="truncate font-medium text-zinc-50">
                {t("rowTitle", { level: lesson.level, title: lesson.title })}
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
                  aria-label={t("edit", { level: lesson.level })}
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
    </Panel>
  );
}
