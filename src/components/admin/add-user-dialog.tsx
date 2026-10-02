"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { toast } from "sonner";

import { ArtistFields } from "@/components/profile/artist-fields";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  artistDetailsInput,
  parseArtistDetails,
  type ArtistDetailsErrors,
  type ArtistDetailsInput,
} from "@/lib/artist";
import type { PlatformUser } from "@/lib/mock/admin-users";
import { isRole, roles, type Role } from "@/lib/roles";
import { slugify } from "@/lib/slug";

type FieldErrorCode = "nameRequired" | "emailRequired" | "emailInvalid" | "emailTaken";

type FieldErrors = { name?: FieldErrorCode; email?: FieldErrorCode };

const labelClass = sectionLabelVariants();
const fieldClass =
  "h-11 border-zinc-700 bg-zinc-950/60 text-zinc-100 focus-visible:border-violet-400 focus-visible:ring-violet-400/30";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(name: string, email: string, takenEmails: string[]): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = "nameRequired";
  if (!email.trim()) errors.email = "emailRequired";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "emailInvalid";
  else if (takenEmails.includes(email.trim().toLowerCase())) errors.email = "emailTaken";
  return errors;
}

function AddUserForm({
  takenEmails,
  onAdd,
  onDone,
}: {
  takenEmails: string[];
  onAdd: (user: PlatformUser) => void;
  onDone: () => void;
}) {
  const t = useTranslations("Admin.AddUser");
  const tRoles = useTranslations("Roles");
  const tCommon = useTranslations("Common");
  const nameId = useId();
  const emailId = useId();
  const roleId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("APPRENTICE");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [artist, setArtist] = useState<ArtistDetailsInput>(artistDetailsInput({}));
  const [artistErrors, setArtistErrors] = useState<ArtistDetailsErrors>({});

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const nextErrors = validate(name, email, takenEmails);
        const parsed = parseArtistDetails(artist);
        setErrors(nextErrors);
        setArtistErrors(parsed.ok ? {} : parsed.errors);
        if (nextErrors.name || nextErrors.email || !parsed.ok) return;

        const trimmedEmail = email.trim();
        onAdd({
          id: `${slugify(name)}-${Date.now()}`,
          name: name.trim(),
          email: trimmedEmail,
          role,
          joinedAt: new Date().toISOString().slice(0, 10),
          ...parsed.details,
        });
        toast.success(t("inviteSent", { email: trimmedEmail }));
        onDone();
      }}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor={nameId} className={labelClass}>
          {t("name")}
        </Label>
        <Input
          id={nameId}
          autoComplete="off"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t("namePlaceholder")}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? `${nameId}-error` : undefined}
          className={fieldClass}
        />
        {errors.name && (
          <p id={`${nameId}-error`} className="text-sm text-rose-400">
            {t(errors.name)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={emailId} className={labelClass}>
          {t("email")}
        </Label>
        <Input
          id={emailId}
          type="email"
          autoComplete="off"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("emailPlaceholder")}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? `${emailId}-error` : undefined}
          className={fieldClass}
        />
        {errors.email && (
          <p id={`${emailId}-error`} className="text-sm text-rose-400">
            {t(errors.email)}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={roleId} className={labelClass}>
          {t("role")}
        </Label>
        <Select
          value={role}
          onValueChange={(value) => {
            if (isRole(value)) setRole(value);
          }}
        >
          <SelectTrigger id={roleId} className={`${fieldClass} w-full data-[size=default]:h-11`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map((option) => (
              <SelectItem key={option} value={option} className="min-h-10">
                {tRoles(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ArtistFields
        value={artist}
        onChange={setArtist}
        errors={artistErrors}
        accent="violet"
      />
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
          {tCommon("cancel")}
        </DialogClose>
        <Button type="submit" className="h-10 bg-violet-500 px-4 text-white hover:bg-violet-400">
          {t("submit")}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function AddUserDialog({
  open,
  onOpenChange,
  takenEmails,
  onAdd,
  formKey,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  takenEmails: string[];
  onAdd: (user: PlatformUser) => void;
  formKey: number;
}) {
  const t = useTranslations("Admin.AddUser");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto border-zinc-800 bg-zinc-900 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-zinc-50">{t("title")}</DialogTitle>
          <DialogDescription className="text-zinc-400">{t("description")}</DialogDescription>
        </DialogHeader>
        <AddUserForm
          key={formKey}
          takenEmails={takenEmails}
          onAdd={onAdd}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
