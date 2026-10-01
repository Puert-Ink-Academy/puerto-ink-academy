import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import type { NavKey } from "@/components/layout/nav-items";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export function AppLayout({
  nav,
  children,
}: {
  nav: NavKey;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-zinc-950 text-zinc-50">
      <SidebarNav nav={nav} />
      <div className="pt-[env(safe-area-inset-top)] pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0 md:pl-60">
        {children}
      </div>
      <MobileBottomNav nav={nav} />
    </div>
  );
}
