import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { MobileTopBar } from "@/components/layout/mobile-top-bar";
import type { LayoutUser } from "@/components/layout/layout-user";
import type { NavKey } from "@/lib/nav";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export type { LayoutUser };

export function AppLayout({
  nav,
  user,
  children,
}: {
  nav: NavKey;
  user: LayoutUser;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-zinc-950 text-zinc-50">
      <SidebarNav nav={nav} user={user} />
      <MobileTopBar nav={nav} user={user} />
      <div className="md:pt-[env(safe-area-inset-top)] pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0 md:pl-60">
        {children}
      </div>
      <MobileBottomNav nav={nav} userId={user.id} />
    </div>
  );
}
