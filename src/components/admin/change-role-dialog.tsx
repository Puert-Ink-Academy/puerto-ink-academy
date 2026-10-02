"use client";

import { useTranslations } from "next-intl";
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
import { Label } from "@/components/ui/label";
import { sectionLabelVariants } from "@/components/ui/section-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PlatformUser } from "@/lib/mock/admin-users";
import { isRole, roles, type Role } from "@/lib/roles";

function ChangeRoleForm({
  user,
  onSave,
  onDone,
}: {
  user: PlatformUser;
  onSave: (userId: string, role: Role) => void;
  onDone: () => void;
}) {
  const t = useTranslations("Admin.ChangeRole");
  const tRoles = useTranslations("Roles");
  const tCommon = useTranslations("Common");
  const triggerId = useId();
  const [role, setRole] = useState<Role>(user.role);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(user.id, role);
        toast.success(t("saved", { name: user.name, role: tRoles(role) }));
        onDone();
      }}
    >
      <div className="flex flex-col gap-2">
        <Label
          htmlFor={triggerId}
          className={sectionLabelVariants()}
        >
          {t("role")}
        </Label>
        <Select
          value={role}
          onValueChange={(value) => {
            if (isRole(value)) setRole(value);
          }}
        >
          <SelectTrigger
            id={triggerId}
            className="w-full border-zinc-700 data-[size=default]:h-11 bg-zinc-950/60 text-zinc-100 focus-visible:border-violet-400 focus-visible:ring-violet-400/30"
          >
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
        <Button
          type="submit"
          className="h-10 bg-violet-500 px-4 text-white hover:bg-violet-400"
        >
          {t("save")}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ChangeRoleDialog({
  user,
  open,
  onOpenChange,
  onSave,
}: {
  user: PlatformUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userId: string, role: Role) => void;
}) {
  const t = useTranslations("Admin.ChangeRole");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {user && (
        <DialogContent className="border-zinc-800 bg-zinc-900 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-zinc-50">{t("title")}</DialogTitle>
            <DialogDescription className="truncate text-zinc-400">
              {user.name} · {user.email}
            </DialogDescription>
          </DialogHeader>
          <ChangeRoleForm
            key={user.id}
            user={user}
            onSave={onSave}
            onDone={() => onOpenChange(false)}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}
