import { BookOpen, LayoutDashboard, Trophy, type LucideIcon } from "lucide-react";

export type AcademyNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const academyNav: AcademyNavItem[] = [
  { href: "/apprentice/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/apprentice/curriculum", label: "Curriculum", icon: BookOpen },
  { href: "/apprentice/leaderboard", label: "Leaderboard", icon: Trophy },
];
