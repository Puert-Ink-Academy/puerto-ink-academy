"use client";

import { useId, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import type { LevelFormValues } from "@/lib/level-form";

type LevelFormMode = "create" | "edit";

const fieldClassName =
  "border-zinc-700 bg-zinc-950/60 text-zinc-100 focus-visible:border-amber-400 focus-visible:ring-amber-400/30";

function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={id}
        className="text-[0.7rem] font-medium tracking-[0.12em] text-zinc-400 uppercase"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

function LevelForm({
  mode,
  initialValues,
  onSaved,
}: {
  mode: LevelFormMode;
  initialValues: LevelFormValues;
  onSaved: () => void;
}) {
  const baseId = useId();
  const id = (name: keyof LevelFormValues) => `${baseId}-${name}`;

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const level = Number(new FormData(event.currentTarget).get("level"));
        toast.success(
          mode === "create"
            ? `Level ${level} created`
            : `Level ${level} saved as a new version`,
        );
        onSaved();
      }}
    >
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-5">
        <Field id={id("level")} label="Level Number">
          <Input
            id={id("level")}
            name="level"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            required
            defaultValue={initialValues.level}
            className={`h-11 ${fieldClassName}`}
          />
        </Field>
        <Field id={id("title")} label="Title">
          <Input
            id={id("title")}
            name="title"
            required
            defaultValue={initialValues.title}
            placeholder="Line Control"
            className={`h-11 ${fieldClassName}`}
          />
        </Field>
        <Field id={id("objective")} label="Objective">
          <Textarea
            id={id("objective")}
            name="objective"
            defaultValue={initialValues.objective}
            placeholder="What the apprentice needs to learn"
            className={`min-h-20 ${fieldClassName}`}
          />
        </Field>
        <Field id={id("exercise")} label="Exercise Description">
          <Textarea
            id={id("exercise")}
            name="exercise"
            defaultValue={initialValues.exercise}
            placeholder="Detailed description of the task"
            className={`min-h-28 ${fieldClassName}`}
          />
        </Field>
        <Field id={id("tips")} label="Tips">
          <Textarea
            id={id("tips")}
            name="tips"
            defaultValue={initialValues.tips}
            placeholder="Advice from the teacher"
            className={`min-h-20 ${fieldClassName}`}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={id("passingScore")} label="Passing Score">
            <Input
              id={id("passingScore")}
              name="passingScore"
              type="number"
              inputMode="numeric"
              min={0}
              max={10}
              step={1}
              required
              defaultValue={initialValues.passingScore}
              className={`h-11 ${fieldClassName}`}
            />
          </Field>
          <Field id={id("xpReward")} label="XP Reward">
            <Input
              id={id("xpReward")}
              name="xpReward"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              required
              defaultValue={initialValues.xpReward}
              className={`h-11 ${fieldClassName}`}
            />
          </Field>
        </div>
      </div>
      <SheetFooter className="mt-0 border-t border-zinc-800 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <Button
          type="submit"
          size="lg"
          className="h-11 w-full bg-amber-400 text-zinc-950 hover:bg-amber-300"
        >
          Save Level
        </Button>
      </SheetFooter>
    </form>
  );
}

export function LevelFormSheet({
  open,
  onOpenChange,
  mode,
  initialValues,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: LevelFormMode;
  initialValues: LevelFormValues;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="gap-0 border-zinc-800 bg-zinc-900 data-[side=right]:w-full data-[side=right]:sm:max-w-lg"
      >
        <SheetHeader className="p-5 pr-14">
          <SheetTitle className="text-lg font-semibold text-zinc-50">
            {mode === "create" ? "Create New Level" : `Edit Level ${initialValues.level}`}
          </SheetTitle>
          <SheetDescription className="text-zinc-400">
            {mode === "create"
              ? "Add a permanent level to the curriculum."
              : "Saving creates a new version, so past submissions keep their original lesson."}
          </SheetDescription>
        </SheetHeader>
        <LevelForm
          key={`${mode}-${initialValues.level}`}
          mode={mode}
          initialValues={initialValues}
          onSaved={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
