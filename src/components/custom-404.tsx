import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export function Custom404() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center px-6 py-16 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.985_0_0/0.08),transparent_55%)]"
      />
      <div className="relative flex max-w-xl flex-col items-center gap-6">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground drop-shadow-[0_0_24px_oklch(0.985_0_0/0.45)] sm:text-5xl">
          404 - Level Not Found
        </h1>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 px-5",
          )}
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
