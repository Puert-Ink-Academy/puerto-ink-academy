"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateArtistDetails } from "@/app/actions/profile";
import { ArtistFields } from "@/components/profile/artist-fields";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  artistDetailsInput,
  parseArtistDetails,
  type ArtistDetails,
  type ArtistDetailsErrors,
} from "@/lib/artist";

function EditArtistForm({
  profileId,
  initial,
  onSaved,
}: {
  profileId: string;
  initial: Partial<ArtistDetails>;
  onSaved: (details: ArtistDetails) => void;
}) {
  const t = useTranslations("Profile.Edit");
  const [values, setValues] = useState(artistDetailsInput(initial));
  const [errors, setErrors] = useState<ArtistDetailsErrors>({});
  const [pending, startTransition] = useTransition();

  return (
    <form
      noValidate
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const parsed = parseArtistDetails(values);
        if (!parsed.ok) {
          setErrors(parsed.errors);
          return;
        }
        setErrors({});

        startTransition(async () => {
          const result = await updateArtistDetails(profileId, values);
          if ("error" in result) {
            setErrors(result.fieldErrors ?? {});
            toast.error(t(result.error));
            return;
          }
          toast.success(t("updated"));
          onSaved(result.details);
        });
      }}
    >
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pb-5">
        <ArtistFields value={values} onChange={setValues} errors={errors} accent="amber" />
      </div>
      <SheetFooter className="mt-0 border-t border-zinc-800 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-11 w-full bg-amber-400 text-zinc-950 hover:bg-amber-300"
        >
          {pending ? t("saving") : t("save")}
        </Button>
      </SheetFooter>
    </form>
  );
}

export function EditArtistSheet({
  open,
  onOpenChange,
  profileId,
  initial,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileId: string;
  initial: Partial<ArtistDetails>;
  onSaved: (details: ArtistDetails) => void;
}) {
  const t = useTranslations("Profile.Edit");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="gap-0 border-zinc-800 bg-zinc-900 data-[side=right]:w-full data-[side=right]:sm:max-w-md [&>[data-slot=sheet-close]]:top-[calc(0.75rem+env(safe-area-inset-top))]"
      >
        <SheetHeader className="p-5 pt-[calc(1.25rem+env(safe-area-inset-top))] pr-14">
          <SheetTitle className="text-lg font-semibold text-zinc-50">{t("title")}</SheetTitle>
          <SheetDescription className="text-zinc-400">{t("description")}</SheetDescription>
        </SheetHeader>
        <EditArtistForm
          profileId={profileId}
          initial={initial}
          onSaved={(details) => {
            onSaved(details);
            onOpenChange(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
