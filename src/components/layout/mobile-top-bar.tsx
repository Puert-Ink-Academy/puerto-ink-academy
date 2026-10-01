import { navAccent, type NavKey } from "@/components/layout/nav-items";
import { RolePill } from "@/components/layout/role-pill";
import { UserMenu } from "@/components/layout/user-menu";
import { cn } from "cn";

export function MobileTopBar({ nav }: { nav: NavKey }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 pt-[env(safe-area-inset-top)] backdrop-blur-md md:hidden">
      <div className="flex h-14 items-center gap-2 px-4">
        <span aria-hidden className={cn("size-2 rounded-full", navAccent[nav].dot)} />
        <span className="text-sm font-semibold tracking-wide text-zinc-50">Puerto Ink</span>
        <RolePill nav={nav} />
        <div className="ml-auto">
          <UserMenu nav={nav} variant="compact" />
        </div>
      </div>
    </header>
  );
}
