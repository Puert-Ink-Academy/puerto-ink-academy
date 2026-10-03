"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { signIn, signOut } from "@/auth";
import { getUserByEmail } from "@/db/queries";
import { normalizeEmail } from "@/lib/email";
import { dashboardPath } from "@/lib/session";

export type AuthActionResult = { ok: true } | { error: string };

function authResult(url: string): { error: string | null; sent: boolean } {
  const parsed = new URL(url, "http://localhost");
  return {
    error: parsed.searchParams.get("error"),
    sent: parsed.pathname.endsWith("/verify-request"),
  };
}

export async function requestLoginCode(email: string): Promise<AuthActionResult> {
  const t = await getTranslations("Errors");
  const normalized = normalizeEmail(email);
  if (!normalized) return { error: t("unknownEmail") };

  const user = await getUserByEmail(normalized);
  if (!user) return { error: t("unknownEmail") };

  try {
    const url = await signIn("email", {
      email: normalized,
      redirect: false,
      redirectTo: dashboardPath(user.role),
    });

    const result = typeof url === "string" ? authResult(url) : { error: "Configuration", sent: false };
    if (!result.sent || result.error) {
      return { error: result.error === "AccessDenied" ? t("unknownEmail") : t("sendFailed") };
    }
  } catch (error) {
    unstable_rethrow(error);
    return { error: t("sendFailed") };
  }

  return { ok: true };
}

export async function verifyLoginCode(
  email: string,
  code: string,
): Promise<AuthActionResult> {
  const t = await getTranslations("Errors");
  const normalized = normalizeEmail(email);
  const token = code.trim();

  if (!normalized || !/^\d{6}$/.test(token)) {
    return { error: t("invalidCode") };
  }

  const user = await getUserByEmail(normalized);
  if (!user) return { error: t("unknownEmail") };

  const params = new URLSearchParams({
    email: normalized,
    token,
    callbackUrl: dashboardPath(user.role),
  });
  redirect(`/api/auth/callback/email?${params.toString()}`);
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
