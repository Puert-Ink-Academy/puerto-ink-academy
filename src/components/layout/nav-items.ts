import {
  BookOpen,
  LayoutDashboard,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type NavKey = "apprentice" | "teacher" | "admin";

export const navItems: Record<NavKey, NavItem[]> = {
  apprentice: [
    { href: "/apprentice/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/apprentice/curriculum", label: "Curriculum", icon: BookOpen },
    { href: "/apprentice/leaderboard", label: "Leaderboard", icon: Trophy },
  ],
  teacher: [
    { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/teacher/curriculum", label: "Curriculum", icon: BookOpen },
  ],
  admin: [{ href: "/admin/dashboard", label: "Users", icon: Users }],
};

export type NavAccent = {
  dot: string;
  active: string;
  activeText: string;
  icon: string;
};

const amberAccent: NavAccent = {
  dot: "bg-amber-400 shadow-[0_0_12px_var(--color-amber-400)]",
  active: "bg-amber-400/10 text-amber-400 hover:bg-amber-400/15 hover:text-amber-400",
  activeText: "text-amber-400 hover:text-amber-400",
  icon: "text-amber-400",
};

export const navAccent: Record<NavKey, NavAccent> = {
  apprentice: amberAccent,
  teacher: amberAccent,
  admin: {
    dot: "bg-violet-400 shadow-[0_0_12px_var(--color-violet-400)]",
    active: "bg-violet-400/10 text-violet-400 hover:bg-violet-400/15 hover:text-violet-400",
    activeText: "text-violet-400 hover:text-violet-400",
    icon: "text-violet-400",
  },
};

export const roleBadge: Partial<Record<NavKey, { label: string; className: string }>> = {
  teacher: { label: "Teacher", className: "border-zinc-700 text-zinc-400" },
  admin: { label: "Admin", className: "border-violet-400/40 text-violet-300" },
};

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
