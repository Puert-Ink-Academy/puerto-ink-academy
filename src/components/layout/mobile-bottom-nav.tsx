"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { academyNav } from "@/components/layout/nav-items";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Academy"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-zinc-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="grid grid-cols-3">
        {academyNav.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-auto min-h-11 w-full flex-col gap-1 rounded-none px-2 py-2 text-[0.7rem] text-zinc-400 hover:bg-transparent hover:text-zinc-50",
                  active && "text-amber-400 hover:text-amber-400",
                )}
              >
                <Icon className={cn("size-5", active && "text-amber-400")} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
