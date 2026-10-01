import { ArrowRight, ChevronDown, Mail, Smartphone } from "lucide-react";
import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { HowItWorks } from "@/components/home/how-it-works";
import { ProductPreview } from "@/components/home/product-preview";
import { StylePath } from "@/components/home/style-path";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const primaryButton = cn(
  buttonVariants({ size: "lg" }),
  "h-12 bg-amber-400 px-6 text-base text-zinc-950 shadow-[0_0_32px_-6px_var(--color-amber-400)] hover:bg-amber-300",
);

const secondaryButton = cn(
  buttonVariants({ size: "lg", variant: "outline" }),
  "h-12 px-6 text-base text-zinc-100",
);

export function LandingPage() {
  return (
    <div className="relative overflow-x-clip bg-zinc-950 text-zinc-50">
      <header className="absolute inset-x-0 top-0 z-20 pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-end px-4 sm:px-6">
          <Link
            href="/login"
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-300 transition-colors outline-none hover:text-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-[92svh] flex-col items-center justify-center px-6 pt-[calc(5rem+env(safe-area-inset-top))] pb-20 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,color-mix(in_oklab,var(--color-amber-400)_18%,transparent),transparent_60%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgb(255_255_255/0.05)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] bg-[size:22px_22px]"
          />
          <div className="relative flex max-w-2xl flex-col items-center">
            <h1>
              <Wordmark size="lg" />
            </h1>
            <p className="mt-8 text-xl font-medium text-zinc-100 sm:text-2xl">
              The Next Evolution in Tattoo Education
            </p>
            <p className="mt-3 max-w-md text-zinc-400">
              Train level by level, get graded by real artists, and climb the leaderboard.
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/login" className={primaryButton}>
                Sign in
                <ArrowRight aria-hidden />
              </Link>
              <a href="#how-it-works" className={secondaryButton}>
                How it works
              </a>
            </div>
            <p className="mt-5 text-sm text-zinc-500">
              Invite only. Your studio sets up your account.
            </p>
          </div>
          <a
            href="#how-it-works"
            aria-label="Scroll to how it works"
            className="absolute bottom-6 text-zinc-600 transition-colors hover:text-zinc-300"
          >
            <ChevronDown className="size-6 animate-bounce motion-reduce:animate-none" aria-hidden />
          </a>
        </section>

        <div className="flex flex-col gap-24 pb-24 sm:gap-32">
          <HowItWorks />
          <ProductPreview />
          <StylePath />

          <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-zinc-900 px-6 py-12 text-center shadow-[0_0_60px_-24px_var(--color-amber-400)] sm:py-16">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklab,var(--color-amber-400)_20%,transparent),transparent_70%)]"
              />
              <h2 className="font-brand relative text-5xl text-zinc-50 sm:text-6xl">
                Ready to pick up the machine?
              </h2>
              <p className="relative mx-auto mt-4 max-w-md text-zinc-400">
                Sign in with the email your studio registered. We&apos;ll send you a one-time code.
              </p>
              <Link href="/login" className={cn(primaryButton, "relative mt-8")}>
                Sign in
                <ArrowRight aria-hidden />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-900 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <Wordmark className="text-2xl" />
            <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500">
              <Smartphone className="size-4" aria-hidden />
              Add it to your home screen for the full-screen app.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-zinc-500 sm:items-end">
            <a
              href="mailto:hello@puertoink.academy"
              className="flex items-center gap-1.5 text-zinc-300 transition-colors hover:text-amber-300"
            >
              <Mail className="size-4" aria-hidden />
              Studio wants in? hello@puertoink.academy
            </a>
            <p>© 2026 Puerto Ink Academy</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
