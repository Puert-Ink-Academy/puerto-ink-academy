"use server";

import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

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
    const t = await getTranslations("Errors");
    return { error: t("unknownEmail") };
  }
  return { ok: true };
}

// Auth.js replaces this: it will check the stored code and start the session.
export async function verifyLoginCode(
  email: string,
  code: string,
): Promise<AuthActionResult> {
  const t = await getTranslations("Errors");
  const user = findUser(email);
  if (!user) {
    return { error: t("unknownEmail") };
  }
  if (!/^\d{6}$/.test(code.trim())) {
    return { error: t("invalidCode") };
  }
  redirect(dashboardForRole[user.role]);
}

export async function logout() {
  redirect("/login");
}
