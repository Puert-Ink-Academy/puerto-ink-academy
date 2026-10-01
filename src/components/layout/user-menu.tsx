"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { logout } from "@/app/actions/auth";
import { navAccent, type NavKey } from "@/components/layout/nav-items";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sessionUsers } from "@/lib/mock/session";
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
  const user = sessionUsers[nav];
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
