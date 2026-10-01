"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { academyNav } from "@/components/layout/nav-items";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-zinc-800 bg-zinc-900 md:flex">
      <div className="flex items-center gap-2 px-5 py-6">
        <span
          aria-hidden
          className="size-2 rounded-full bg-amber-400 shadow-[0_0_12px_var(--color-amber-400)]"
        />
        <span className="text-sm font-semibold tracking-wide text-zinc-50">
          Puerto Ink
        </span>
      </div>
      <nav aria-label="Academy" className="flex flex-1 flex-col gap-1 px-3">
        {academyNav.map((item) => {
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
                active &&
                  "bg-amber-400/10 text-amber-400 hover:bg-amber-400/15 hover:text-amber-400",
              )}
            >
              <Icon className={cn("size-4", active && "text-amber-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
