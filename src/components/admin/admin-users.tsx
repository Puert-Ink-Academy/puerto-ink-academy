"use client";

import { useState } from "react";

import { ChangeRoleDialog } from "@/components/admin/change-role-dialog";
import { UsersTable } from "@/components/admin/users-table";
import type { PlatformUser } from "@/lib/mock/admin-users";
import type { Role } from "@/lib/roles";

export function AdminUsers({ initialUsers }: { initialUsers: PlatformUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [changing, setChanging] = useState<PlatformUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
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
    </>
  );
}
