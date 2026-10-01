"use client";

import { MoreHorizontal, UserCog } from "lucide-react";

import { RoleBadge } from "@/components/admin/role-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PlatformUser } from "@/lib/mock/admin-users";

const headClassName = "text-[0.7rem] tracking-[0.12em] text-zinc-500 uppercase";

export function UsersTable({
  users,
  onChangeRole,
}: {
  users: PlatformUser[];
  onChangeRole: (user: PlatformUser) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className={`pl-4 ${headClassName}`}>User</TableHead>
            <TableHead className={`w-28 ${headClassName}`}>Role</TableHead>
            <TableHead className={`hidden w-28 sm:table-cell ${headClassName}`}>
              Joined
            </TableHead>
            <TableHead className="w-14 pr-4">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/40">
              <TableCell className="py-3 pl-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-violet-400/40 bg-violet-400/10 text-sm font-semibold text-violet-300"
                  >
                    {user.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-zinc-50">{user.name}</p>
                    <p className="truncate text-xs text-zinc-500">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <RoleBadge role={user.role} />
              </TableCell>
              <TableCell className="hidden text-zinc-400 sm:table-cell">
                {user.joinedAt}
              </TableCell>
              <TableCell className="pr-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Actions for ${user.name}`}
                        className="size-10 text-zinc-400 hover:bg-zinc-800 hover:text-violet-300 aria-expanded:bg-zinc-800 aria-expanded:text-violet-300"
                      />
                    }
                  >
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => onChangeRole(user)}>
                      <UserCog />
                      Change Role
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
