import { BookOpen, LayoutDashboard, Trophy, type LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type NavKey = "apprentice" | "teacher";

export const navItems: Record<NavKey, NavItem[]> = {
  apprentice: [
    { href: "/apprentice/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/apprentice/curriculum", label: "Curriculum", icon: BookOpen },
    { href: "/apprentice/leaderboard", label: "Leaderboard", icon: Trophy },
  ],
  teacher: [
    { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ],
};

export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
