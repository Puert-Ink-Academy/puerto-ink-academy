import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export function ComingSoonPage() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center px-6 py-16 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.985_0_0/0.08),transparent_55%)]"
      />
      <div className="relative flex max-w-xl flex-col items-center gap-6">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground drop-shadow-[0_0_24px_oklch(0.985_0_0/0.45)] sm:text-6xl">
          Puerto Ink Academy
        </h1>
        <p className="max-w-md text-base text-muted-foreground sm:text-lg">
          The Next Evolution in Tattoo Education
        </p>
        <Link
          href="/login"
          className={buttonVariants({
            size: "lg",
            variant: "outline",
            className: "mt-2 h-11 px-5 text-foreground",
          })}
        >
          Login
        </Link>
      </div>
    </main>
  );
}
