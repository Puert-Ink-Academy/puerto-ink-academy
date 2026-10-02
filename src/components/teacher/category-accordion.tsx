"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { LevelsTable } from "@/components/teacher/levels-table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getCategoryStyle } from "@/lib/categories";
import type { CurriculumCategory, CurriculumLevel } from "@/lib/curriculum";
import { cn } from "cn";

export function CategoryAccordion({
  categories,
  lessons,
  value,
  onValueChange,
  onCreateLevel,
  onEditLevel,
}: {
  categories: CurriculumCategory[];
  lessons: CurriculumLevel[];
  value: string[];
  onValueChange: (value: string[]) => void;
  onCreateLevel: (categoryId: string) => void;
  onEditLevel: (lesson: CurriculumLevel) => void;
}) {
  const t = useTranslations("Teacher.Curriculum");

  return (
    <Accordion
      multiple
      value={value}
      onValueChange={(next: string[]) => onValueChange(next)}
      className="gap-3"
    >
      {categories.map((category) => {
        const style = getCategoryStyle(category.id);
        const Icon = style.icon;
        const levels = lessons
          .filter((lesson) => lesson.categoryId === category.id)
          .sort((a, b) => a.level - b.level);

        return (
          <AccordionItem
            key={category.id}
            value={category.id}
            id={`category-${category.id}`}
            className="scroll-mt-24 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 not-last:border-b"
          >
            <AccordionTrigger className="min-w-0 items-center gap-3 rounded-none px-4 py-3.5 hover:bg-zinc-800/40 hover:no-underline focus-visible:ring-amber-400/50 **:data-[slot=accordion-trigger-icon]:ml-0 **:data-[slot=accordion-trigger-icon]:text-zinc-500">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg border",
                  style.chip,
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-zinc-50">{category.name}</span>
                {category.tagline && (
                  <span className="block truncate text-xs font-normal text-zinc-400">
                    {category.tagline}
                  </span>
                )}
              </span>
              <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-950/60 px-2 py-0.5 text-xs font-medium text-zinc-300 tabular-nums">
                {t("levelCount", { count: levels.length })}
              </span>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-3 border-t border-zinc-800 p-4 [&_p:not(:last-child)]:mb-0">
              <div className="flex justify-end">
                <Button
                  size="lg"
                  aria-label={t("createLevelIn", { category: category.name })}
                  onClick={() => onCreateLevel(category.id)}
                  className="h-11 w-full bg-amber-400 px-4 text-zinc-950 shadow-[0_0_24px_-6px_var(--color-amber-400)] hover:bg-amber-300 sm:w-auto"
                >
                  <Plus />
                  {t("createLevel")}
                </Button>
              </div>
              {levels.length > 0 ? (
                <LevelsTable categoryId={category.id} lessons={levels} onEdit={onEditLevel} />
              ) : (
                <div className="rounded-xl border border-dashed border-zinc-800 px-6 py-8 text-center">
                  <p className="text-sm font-medium text-zinc-200">{t("emptyTitle")}</p>
                  <p className="mt-1 text-xs text-zinc-500">{t("emptyBody")}</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
