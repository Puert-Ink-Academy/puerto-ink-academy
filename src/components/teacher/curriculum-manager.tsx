"use client";

import { FolderPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { navAccent, roleBadge } from "@/components/layout/nav-items";
import { CategoryAccordion } from "@/components/teacher/category-accordion";
import { CreateCategoryDialog } from "@/components/teacher/create-category-dialog";
import { LevelFormSheet } from "@/components/teacher/level-form-sheet";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import type { CurriculumCategory, CurriculumLevel } from "@/lib/curriculum";
import {
  emptyLevelForm,
  levelFormFromLesson,
  type LevelFormValues,
} from "@/lib/level-form";
import type { StaffNav } from "@/lib/nav";

type SheetTarget = {
  categoryId: string;
  editing: CurriculumLevel | null;
};

export function CurriculumManager({
  nav,
  categories,
  lessons,
}: {
  nav: StaffNav;
  categories: CurriculumCategory[];
  lessons: CurriculumLevel[];
}) {
  const t = useTranslations("Teacher.Curriculum");
  const tRoles = useTranslations("Roles");
  const [categoryList, setCategoryList] = useState(categories);
  const [levelList, setLevelList] = useState(lessons);
  const [openItems, setOpenItems] = useState<string[]>(
    categories[0] ? [categories[0].id] : [],
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheet, setSheet] = useState<SheetTarget | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryFormKey, setCategoryFormKey] = useState(0);
  const [scrollTarget, setScrollTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!scrollTarget) return;
    document
      .getElementById(`category-${scrollTarget}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setScrollTarget(null);
  }, [scrollTarget]);

  const sheetCategory = categoryList.find((category) => category.id === sheet?.categoryId);
  const sheetLevels = levelList.filter((lesson) => lesson.categoryId === sheet?.categoryId);
  const nextLevel = sheetLevels.reduce((max, lesson) => Math.max(max, lesson.level), 0) + 1;
  const takenLevels = sheetLevels
    .map((lesson) => lesson.level)
    .filter((level) => level !== sheet?.editing?.level);

  const openSheet = (target: SheetTarget) => {
    setSheet(target);
    setSheetOpen(true);
  };

  const saveLevel = (values: LevelFormValues) => {
    if (!sheet) return;
    const { categoryId, editing } = sheet;
    const content = {
      level: values.level,
      title: values.title,
      objective: values.objective,
      exercise: values.exercise,
      tips: values.tips,
    };

    setLevelList((current) =>
      editing
        ? current.map((lesson) =>
            lesson.categoryId === categoryId && lesson.level === editing.level
              ? { ...lesson, ...content }
              : lesson,
          )
        : [...current, { ...content, categoryId, references: [] }],
    );
  };

  const createCategory = (category: CurriculumCategory) => {
    setCategoryList((current) => [...current, category]);
    setOpenItems((current) => [...current, category.id]);
    setScrollTarget(category.id);
  };

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionLabel className={navAccent[nav].eyebrow}>{tRoles(roleBadge[nav].role)}</SectionLabel>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {t("summary", { categories: categoryList.length, levels: levelList.length })}
          </p>
        </div>
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            setCategoryFormKey((key) => key + 1);
            setCategoryDialogOpen(true);
          }}
          className="h-11 w-full px-4 text-amber-300 hover:text-amber-200 sm:w-auto dark:border-amber-400/50 dark:bg-amber-400/10 dark:hover:bg-amber-400/20"
        >
          <FolderPlus />
          {t("createCategory")}
        </Button>
      </header>
      <CategoryAccordion
        categories={categoryList}
        lessons={levelList}
        value={openItems}
        onValueChange={setOpenItems}
        onCreateLevel={(categoryId) => openSheet({ categoryId, editing: null })}
        onEditLevel={(lesson) => openSheet({ categoryId: lesson.categoryId, editing: lesson })}
      />
      {sheet && sheetCategory && (
        <LevelFormSheet
          key={`${sheet.categoryId}-${sheet.editing?.level ?? "new"}`}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          mode={sheet.editing ? "edit" : "create"}
          categoryName={sheetCategory.name}
          takenLevels={takenLevels}
          initialValues={
            sheet.editing ? levelFormFromLesson(sheet.editing) : emptyLevelForm(nextLevel)
          }
          onSave={saveLevel}
        />
      )}
      <CreateCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        existing={categoryList}
        onCreate={createCategory}
        formKey={categoryFormKey}
      />
    </>
  );
}
