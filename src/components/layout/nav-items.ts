import {
  BookOpen,
  ClipboardCheck,
  LayoutDashboard,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  activePrefixes?: string[];
};

export type NavKey = "apprentice" | "teacher" | "admin";

export type StaffNav = Exclude<NavKey, "apprentice">;

export const navItems: Record<NavKey, NavItem[]> = {
  apprentice: [
    {
      href: "/apprentice/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      activePrefixes: ["/apprentice/category"],
    },
    { href: "/apprentice/leaderboard", label: "Leaderboard", icon: Trophy },
  ],
  teacher: [
    { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/teacher/curriculum", label: "Curriculum", icon: BookOpen },
    { href: "/teacher/leaderboard", label: "Leaderboard", icon: Trophy },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Users", icon: Users },
    { href: "/admin/grading", label: "Grading", icon: ClipboardCheck },
    { href: "/admin/curriculum", label: "Curriculum", icon: BookOpen },
    { href: "/admin/leaderboard", label: "Leaderboard", icon: Trophy },
  ],
};

export type NavAccent = {
  dot: string;
  active: string;
  activeText: string;
  icon: string;
  avatar: string;
  eyebrow: string;
};

const amberAccent: NavAccent = {
  dot: "bg-amber-400 shadow-[0_0_12px_var(--color-amber-400)]",
  active: "bg-amber-400/10 text-amber-400 hover:bg-amber-400/15 hover:text-amber-400",
  activeText: "text-amber-400 hover:text-amber-400",
  icon: "text-amber-400",
  avatar: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  eyebrow: "text-amber-400",
};

export const navAccent: Record<NavKey, NavAccent> = {
  apprentice: amberAccent,
  teacher: amberAccent,
  admin: {
    dot: "bg-violet-400 shadow-[0_0_12px_var(--color-violet-400)]",
    active: "bg-violet-400/10 text-violet-400 hover:bg-violet-400/15 hover:text-violet-400",
    activeText: "text-violet-400 hover:text-violet-400",
    icon: "text-violet-400",
    avatar: "border-violet-400/40 bg-violet-400/10 text-violet-300",
    eyebrow: "text-violet-400",
  },
};

export const roleBadge: Record<NavKey, { label: string; className: string }> = {
  apprentice: { label: "Apprentice", className: "border-zinc-700 text-zinc-400" },
  teacher: { label: "Teacher", className: "border-zinc-700 text-zinc-400" },
  admin: { label: "Admin", className: "border-violet-400/40 text-violet-300" },
};

function matchesPath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isActivePath(pathname: string, item: NavItem) {
  return [item.href, ...(item.activePrefixes ?? [])].some((href) =>
    matchesPath(pathname, href),
  );
}
