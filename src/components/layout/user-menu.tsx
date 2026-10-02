"use client";

import { ChevronsUpDown, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

import { logout } from "@/app/actions/auth";
import { navAccent } from "@/components/layout/nav-items";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NavKey } from "@/lib/nav";
import { getSessionUser } from "@/lib/session";
import { cn } from "cn";

function Avatar({ name, className }: { name: string; className: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
        className,
      )}
    >
      {name.charAt(0)}
    </span>
  );
}

export function UserMenu({
  nav,
  variant,
}: {
  nav: NavKey;
  variant: "sidebar" | "compact";
}) {
  const user = getSessionUser(nav);
  const accent = navAccent[nav];
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={variant === "compact" ? "Account menu" : undefined}
        className={cn(
          "flex items-center outline-none focus-visible:ring-2 focus-visible:ring-zinc-500",
          variant === "sidebar"
            ? "h-14 w-full gap-3 rounded-lg px-2 text-left hover:bg-zinc-800 aria-expanded:bg-zinc-800"
            : "size-10 justify-center rounded-full",
        )}
      >
        <Avatar name={user.name} className={accent.avatar} />
        {variant === "sidebar" && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-zinc-50">
                {user.name}
              </span>
              <span className="block truncate text-xs text-zinc-500">{user.email}</span>
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-zinc-500" aria-hidden />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={variant === "sidebar" ? "top" : "bottom"}
        align={variant === "sidebar" ? "start" : "end"}
        className="w-56 border-zinc-800 bg-zinc-900"
      >
        <div className="px-2 py-1.5">
          <p className="truncate text-sm font-medium text-zinc-50">{user.name}</p>
          <p className="truncate text-xs text-zinc-500">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        {nav === "apprentice" && (
          <DropdownMenuItem
            className="min-h-10"
            render={<Link href={`/profile/${user.id}`} />}
          >
            <UserRound />
            View profile
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          variant="destructive"
          disabled={pending}
          className="min-h-10"
          onClick={() => {
            toast.success("You've been logged out");
            startTransition(() => logout());
          }}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
