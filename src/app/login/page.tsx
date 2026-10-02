import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { Wordmark } from "@/components/brand/wordmark";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Sign in · Puerto Ink Academy",
};

export default function LoginPage() {
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
          <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 mb-5 text-sm text-zinc-400">
            We&apos;ll email you a one-time code. No password needed.
          </p>
          <LoginForm />
        </Panel>
        <p className="mt-4 text-center text-xs text-zinc-500">
          Demo mode: any 6-digit code works.
        </p>
      </div>
    </main>
  );
}
