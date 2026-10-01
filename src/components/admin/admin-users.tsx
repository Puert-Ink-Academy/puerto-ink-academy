"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";

import { AddUserDialog } from "@/components/admin/add-user-dialog";
import { ChangeRoleDialog } from "@/components/admin/change-role-dialog";
import { UsersTable } from "@/components/admin/users-table";
import { Button } from "@/components/ui/button";
import type { PlatformUser } from "@/lib/mock/admin-users";
import type { Role } from "@/lib/roles";

export function AdminUsers({ initialUsers }: { initialUsers: PlatformUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [changing, setChanging] = useState<PlatformUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addFormKey, setAddFormKey] = useState(0);

  return (
    <>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.7rem] font-medium tracking-[0.12em] text-violet-400 uppercase">
            Admin
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50">
            User Management
          </h1>
          <p className="mt-1 text-sm text-zinc-400">{users.length} accounts</p>
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
          Add user
        </Button>
      </header>
      <UsersTable
        users={users}
        onChangeRole={(user) => {
          setChanging(user);
          setDialogOpen(true);
        }}
      />
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
