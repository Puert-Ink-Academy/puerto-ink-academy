"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  isActivePath,
  navAccent,
  navItems,
  roleBadge,
  type NavKey,
} from "@/components/layout/nav-items";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export function SidebarNav({ nav }: { nav: NavKey }) {
  const pathname = usePathname();
  const accent = navAccent[nav];
  const badge = roleBadge[nav];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-zinc-800 bg-zinc-900 md:flex">
      <div className="flex items-center gap-2 px-5 py-6">
        <span aria-hidden className={cn("size-2 rounded-full", accent.dot)} />
        <span className="text-sm font-semibold tracking-wide text-zinc-50">
          Puerto Ink
        </span>
        {badge && (
          <span
            className={cn(
              "ml-auto rounded-full border px-2 py-0.5 text-[0.65rem] tracking-[0.12em] uppercase",
              badge.className,
            )}
          >
            {badge.label}
          </span>
        )}
      </div>
      <nav aria-label="Academy" className="flex flex-1 flex-col gap-1 px-3">
        {navItems[nav].map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "h-11 w-full justify-start px-3 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50",
                active && accent.active,
              )}
            >
              <Icon className={cn("size-4", active && accent.icon)} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
