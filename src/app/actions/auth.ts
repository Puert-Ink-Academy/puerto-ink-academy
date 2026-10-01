"use server";

import { redirect } from "next/navigation";

import { platformUsers, type PlatformUser } from "@/lib/mock/admin-users";
import type { Role } from "@/lib/roles";

export type AuthActionResult = { ok: true } | { error: string };

const dashboardForRole: Record<Role, string> = {
  APPRENTICE: "/apprentice/dashboard",
  TEACHER: "/teacher/dashboard",
  ADMIN: "/admin/dashboard",
};

function findUser(email: string): PlatformUser | undefined {
  const normalized = email.trim().toLowerCase();
  return platformUsers.find((user) => user.email.toLowerCase() === normalized);
}

// Auth.js email sign-in replaces this: it will create and email a one-time code.
export async function requestLoginCode(email: string): Promise<AuthActionResult> {
  if (!findUser(email)) {
    return { error: "No account uses this email. Ask an admin to add you." };
  }
  return { ok: true };
}

// Auth.js replaces this: it will check the stored code and start the session.
export async function verifyLoginCode(
  email: string,
  code: string,
): Promise<AuthActionResult> {
  const user = findUser(email);
  if (!user) {
    return { error: "No account uses this email. Ask an admin to add you." };
  }
  if (!/^\d{6}$/.test(code.trim())) {
    return { error: "Enter the 6-digit code from your email." };
  }
  redirect(dashboardForRole[user.role]);
}

export async function logout() {
  redirect("/login");
}
