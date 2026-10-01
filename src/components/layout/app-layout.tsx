import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-zinc-950 text-zinc-50">
      <SidebarNav />
      <div className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0 md:pl-60">
        {children}
      </div>
      <MobileBottomNav />
    </div>
  );
}
