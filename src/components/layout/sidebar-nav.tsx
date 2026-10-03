"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import type { LayoutUser } from "@/components/layout/layout-user";
import { isActivePath, navAccent, navItemsFor } from "@/components/layout/nav-items";
import { Wordmark } from "@/components/brand/wordmark";
import { RolePill } from "@/components/layout/role-pill";
import { UserMenu } from "@/components/layout/user-menu";
import { buttonVariants } from "@/components/ui/button";
import type { NavKey } from "@/lib/nav";
import { cn } from "cn";

export function SidebarNav({ nav, user }: { nav: NavKey; user: LayoutUser }) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const accent = navAccent[nav];
  const items = navItemsFor(nav, user.id);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-zinc-800 bg-zinc-900 md:flex">
      <div className="flex items-center gap-2 px-5 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-6">
        <span aria-hidden className={cn("size-2 rounded-full", accent.dot)} />
        <Wordmark />
        <RolePill nav={nav} className="ml-auto" />
      </div>
      <nav aria-label={t("primary")} className="flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => {
          const active = isActivePath(pathname, item);
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
              {t(item.label)}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-800 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <UserMenu nav={nav} variant="sidebar" user={user} />
      </div>
    </aside>
  );
}
