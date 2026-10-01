import { cn } from "cn";

export function Wordmark({
  size = "sm",
  className,
}: {
  size?: "sm" | "lg";
  className?: string;
}) {
  if (size === "lg") {
    return (
      <span className={cn("flex flex-col items-center leading-none", className)}>
        <span className="font-brand text-7xl text-zinc-50 drop-shadow-[0_0_28px_var(--color-amber-400)] sm:text-8xl lg:text-9xl">
          Puerto Ink
        </span>
        <span className="mt-3 pl-[0.5em] text-xs font-medium tracking-[0.5em] text-amber-400 uppercase sm:text-sm">
          Academy
        </span>
      </span>
    );
  }

  return (
    <span className={cn("font-brand text-[1.35rem] leading-none text-zinc-50", className)}>
      Puerto Ink
    </span>
  );
}
