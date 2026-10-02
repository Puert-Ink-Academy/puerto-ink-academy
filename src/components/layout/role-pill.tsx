import { roleBadge } from "@/components/layout/nav-items";
import type { NavKey } from "@/lib/nav";
import { cn } from "cn";

export function RolePill({ nav, className }: { nav: NavKey; className?: string }) {
  const badge = roleBadge[nav];

  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[0.65rem] tracking-[0.12em] uppercase",
        badge.className,
        className,
      )}
    >
      {badge.label}
    </span>
  );
}
