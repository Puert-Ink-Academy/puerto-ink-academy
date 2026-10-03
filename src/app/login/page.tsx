import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { LoginForm } from "@/components/auth/login-form";
import { Wordmark } from "@/components/brand/wordmark";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Panel } from "@/components/ui/panel";
import { dashboardPath, getSessionUser } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Auth");
  return { title: t("title"), description: t("subtitle") };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const user = await getSessionUser();
  if (user) redirect(dashboardPath(user.role));

  const t = await getTranslations("Auth");
  const tErrors = await getTranslations("Errors");
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <main className="flex min-h-svh items-center justify-center bg-zinc-950 px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-zinc-50">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 flex items-center justify-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <span
            aria-hidden
            className="size-2 rounded-full bg-amber-400 shadow-[0_0_12px_var(--color-amber-400)]"
          />
          <Wordmark className="text-3xl" />
        </Link>
        <Panel as="section" padding="lg">
          <h1 className="text-xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-1 mb-5 text-sm text-zinc-400">{t("subtitle")}</p>
          <LoginForm initialError={error ? tErrors("invalidCode") : null} />
        </Panel>
        <p className="mt-4 text-center text-xs text-zinc-500">{t("demo")}</p>
        <div className="mt-4 flex justify-center">
          <LanguageSwitcher />
        </div>
      </div>
    </main>
  );
}
