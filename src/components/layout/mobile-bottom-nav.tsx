"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isActivePath, navAccent, navItems, type NavKey } from "@/components/layout/nav-items";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export function MobileBottomNav({ nav }: { nav: NavKey }) {
  const pathname = usePathname();
  const items = navItems[nav];
  const accent = navAccent[nav];

  return (
    <nav
      aria-label="Academy"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-zinc-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul
        className="grid"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const active = isActivePath(pathname, item);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-auto min-h-11 w-full flex-col gap-1 rounded-none px-2 py-2 text-[0.7rem] text-zinc-400 hover:bg-transparent hover:text-zinc-50",
                  active && accent.activeText,
                )}
              >
                <Icon className={cn("size-5", active && accent.icon)} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
