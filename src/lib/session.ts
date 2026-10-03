import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import type { NavKey } from "@/lib/nav";
import type { Role } from "@/lib/roles";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  artistName: string | null;
};

const dashboardForRole: Record<Role, string> = {
  APPRENTICE: "/apprentice/dashboard",
  TEACHER: "/teacher/dashboard",
  ADMIN: "/admin/dashboard",
};

const navForRole: Record<Role, NavKey> = {
  APPRENTICE: "apprentice",
  TEACHER: "teacher",
  ADMIN: "admin",
};

export function dashboardPath(role: Role): string {
  return dashboardForRole[role];
}

export function navKeyFor(role: Role): NavKey {
  return navForRole[role];
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id || !user.email || !user.role) return null;

  return {
    id: user.id,
    name: user.name ?? user.email,
    email: user.email,
    role: user.role,
    artistName: user.artistName ?? null,
  };
}

export async function requireSessionUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(role: Role): Promise<SessionUser> {
  const user = await requireSessionUser();
  if (user.role !== role) redirect(dashboardForRole[user.role]);
  return user;
}

export async function getCurrentApprentice(): Promise<SessionUser> {
  return requireRole("APPRENTICE");
}
