"use client";

import { SearchX, UserPlus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { AddUserDialog } from "@/components/admin/add-user-dialog";
import { ChangeRoleDialog } from "@/components/admin/change-role-dialog";
import { UsersTable } from "@/components/admin/users-table";
import { UsersToolbar } from "@/components/admin/users-toolbar";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { SectionLabel } from "@/components/ui/section-label";
import type { PlatformUser } from "@/lib/mock/admin-users";
import type { Role } from "@/lib/roles";
import {
  countryOptions,
  defaultUserFilters,
  filterUsers,
  hasActiveFilters,
  roleCounts,
  type UserFilters,
} from "@/lib/user-directory";

export function AdminUsers({ initialUsers }: { initialUsers: PlatformUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [filters, setFilters] = useState<UserFilters>(defaultUserFilters);
  const [changing, setChanging] = useState<PlatformUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addFormKey, setAddFormKey] = useState(0);

  const locale = useLocale();
  const t = useTranslations("Admin");
  const visible = filterUsers(users, filters, locale);
  const filtered = hasActiveFilters(filters);
  const clearFilters = () => setFilters({ ...defaultUserFilters, sort: filters.sort });

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionLabel tone="admin">{t("eyebrow")}</SectionLabel>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">{t("title")}</h1>
          <p className="mt-1 text-sm text-zinc-400">{t("accounts", { count: users.length })}</p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            setAddFormKey((key) => key + 1);
            setAddOpen(true);
          }}
          className="h-11 w-full bg-violet-500 px-4 text-white shadow-[0_0_24px_-6px_var(--color-violet-500)] hover:bg-violet-400 sm:w-auto"
        >
          <UserPlus />
          {t("addUser")}
        </Button>
      </header>
      <UsersToolbar
        filters={filters}
        onChange={setFilters}
        roleCounts={roleCounts(users, filters, locale)}
        countries={countryOptions(users, locale)}
      />
      {filtered && (
        <p className="-mt-2 flex items-center gap-2 text-sm text-zinc-400" aria-live="polite">
          {t("showing", { visible: visible.length, total: users.length })}
          <span aria-hidden className="text-zinc-700">
            ·
          </span>
          <button
            type="button"
            onClick={clearFilters}
            className="font-medium text-violet-300 underline-offset-4 outline-none hover:underline focus-visible:underline"
          >
            {t("clearFilters")}
          </button>
        </p>
      )}
      {visible.length > 0 ? (
        <UsersTable
          users={visible}
          onChangeRole={(user) => {
            setChanging(user);
            setDialogOpen(true);
          }}
        />
      ) : (
        <Panel
          variant="dashed"
          padding="none"
          className="flex flex-col items-center gap-2 px-6 py-10 text-center"
        >
          <SearchX className="size-6 text-zinc-600" aria-hidden />
          <p className="text-sm font-medium text-zinc-200">{t("emptyTitle")}</p>
          <p className="text-xs text-zinc-500">{t("emptyBody")}</p>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="mt-2 h-10 border-zinc-700 text-zinc-200 hover:border-violet-400/60 hover:text-violet-200"
          >
            {t("clearFilters")}
          </Button>
        </Panel>
      )}
      <ChangeRoleDialog
        user={changing}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={(userId: string, role: Role) =>
          setUsers((current) =>
            current.map((user) => (user.id === userId ? { ...user, role } : user)),
          )
        }
      />
      <AddUserDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        formKey={addFormKey}
        takenEmails={users.map((user) => user.email.toLowerCase())}
        onAdd={(user) => setUsers((current) => [user, ...current])}
      />
    </>
  );
}
