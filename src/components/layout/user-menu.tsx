"use client";

import { ChevronsUpDown, Globe, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

import { logout } from "@/app/actions/auth";
import { useChangeLocale } from "@/components/i18n/use-change-locale";
import { navAccent } from "@/components/layout/nav-items";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isLocale, localeNames, locales } from "@/i18n/config";
import type { NavKey } from "@/lib/nav";
import { profilePath } from "@/lib/profile-slug";
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
  const t = useTranslations("Nav");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const { changeLocale, pending: changingLocale } = useChangeLocale();
  const user = getSessionUser(nav);
  const accent = navAccent[nav];
  const [pending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={variant === "compact" ? t("accountMenu") : undefined}
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
            render={<Link href={profilePath(user.id)} />}
          >
            <UserRound />
            {t("viewProfile")}
          </DropdownMenuItem>
        )}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Globe className="size-3.5" aria-hidden />
            {tCommon("language")}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={locale}
            onValueChange={(next) => {
              if (isLocale(next) && next !== locale) changeLocale(next);
            }}
          >
            {locales.map((option) => (
              <DropdownMenuRadioItem
                key={option}
                value={option}
                lang={option}
                disabled={changingLocale}
                className="min-h-10"
              >
                {localeNames[option]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={pending}
          className="min-h-10"
          onClick={() => {
            toast.success(t("loggedOut"));
            startTransition(() => logout());
          }}
        >
          <LogOut />
          {t("logOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
