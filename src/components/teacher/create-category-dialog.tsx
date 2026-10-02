"use client";

import { useId, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sectionLabelVariants } from "@/components/ui/section-label";
import type { CurriculumCategory } from "@/lib/curriculum";
import { slugify } from "@/lib/slug";

const labelClass = sectionLabelVariants();
const fieldClass =
  "h-11 border-zinc-700 bg-zinc-950/60 text-zinc-100 focus-visible:border-amber-400 focus-visible:ring-amber-400/30";

function validateName(name: string, existing: CurriculumCategory[]): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) return "Enter a category name.";
  const slug = slugify(trimmed);
  if (!slug) return "Use at least one letter or number.";
  const taken = existing.some(
    (category) => category.id === slug || category.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (taken) return "A category with this name already exists.";
  return undefined;
}

function CreateCategoryForm({
  existing,
  onCreate,
  onDone,
}: {
  existing: CurriculumCategory[];
  onCreate: (category: CurriculumCategory) => void;
  onDone: () => void;
}) {
  const nameId = useId();
  const taglineId = useId();
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [error, setError] = useState<string>();

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const nextError = validateName(name, existing);
        setError(nextError);
        if (nextError) return;

        const trimmedName = name.trim();
        onCreate({ id: slugify(trimmedName), name: trimmedName, tagline: tagline.trim() });
        toast.success(`${trimmedName} category created`);
        onDone();
      }}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor={nameId} className={labelClass}>
          Name
        </Label>
        <Input
          id={nameId}
          autoComplete="off"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError(undefined);
          }}
          placeholder="Japanese"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${nameId}-error` : undefined}
          className={fieldClass}
        />
        {error && (
          <p id={`${nameId}-error`} className="text-sm text-rose-400">
            {error}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={taglineId} className={labelClass}>
          Tagline <span className="tracking-normal text-zinc-600 normal-case">(optional)</span>
        </Label>
        <Input
          id={taglineId}
          autoComplete="off"
          value={tagline}
          onChange={(event) => setTagline(event.target.value)}
          placeholder="Bold waves, koi and flowing backgrounds"
          className={fieldClass}
        />
      </div>
      <DialogFooter className="-mx-4 -mb-4 border-zinc-800 bg-zinc-950/40">
        <DialogClose
          render={
            <Button
              type="button"
              variant="ghost"
              className="h-10 text-zinc-300 hover:bg-zinc-800"
            />
          }
        >
          Cancel
        </DialogClose>
        <Button type="submit" className="h-10 bg-amber-400 px-4 text-zinc-950 hover:bg-amber-300">
          Create Category
        </Button>
      </DialogFooter>
    </form>
  );
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  existing,
  onCreate,
  formKey,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existing: CurriculumCategory[];
  onCreate: (category: CurriculumCategory) => void;
  formKey: number;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-zinc-900 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-zinc-50">Create Category</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Define a new style. You can add its levels right after.
          </DialogDescription>
        </DialogHeader>
        <CreateCategoryForm
          key={formKey}
          existing={existing}
          onCreate={onCreate}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
