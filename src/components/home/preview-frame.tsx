import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "cn";

export function PreviewFrame({
  icon: Icon,
  title,
  caption,
  className,
  children,
}: {
  icon: LucideIcon;
  title: string;
  caption: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <figure
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5",
        className,
      )}
    >
      <figcaption>
        <p className="flex items-center gap-2 text-sm font-semibold text-zinc-50">
          <Icon className="size-4 text-amber-400" aria-hidden />
          {title}
        </p>
        <p className="mt-1 text-sm text-zinc-400">{caption}</p>
      </figcaption>
      <div inert className="pointer-events-none select-none">
        {children}
      </div>
    </figure>
  );
}
