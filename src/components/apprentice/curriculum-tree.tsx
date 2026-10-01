import { Check, Lock } from "lucide-react";
import Link from "next/link";

import { cn } from "cn";

type LevelStatus = "completed" | "active" | "locked";

function levelStatus(level: number, currentLevel: number): LevelStatus {
  if (level < currentLevel) return "completed";
  if (level === currentLevel) return "active";
  return "locked";
}

const statusLabel: Record<LevelStatus, string> = {
  completed: "Completed",
  active: "Active",
  locked: "Locked",
};

export function CurriculumTree({
  currentLevel,
  totalLevels,
}: {
  currentLevel: number;
  totalLevels: number;
}) {
  const levels = Array.from({ length: totalLevels }, (_, index) => index + 1);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
      <h2 className="text-[0.7rem] font-medium tracking-[0.12em] text-zinc-400 uppercase">
        Progression Path
      </h2>
      <ol className="mt-5">
        {levels.map((level, index) => {
          const status = levelStatus(level, currentLevel);
          const isLast = index === levels.length - 1;

          return (
            <li key={level} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-10 left-5 h-[calc(100%-2.5rem)] w-px -translate-x-1/2",
                    level < currentLevel ? "bg-amber-400/70" : "bg-zinc-800",
                  )}
                />
              )}
              <span
                className={cn(
                  "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums",
                  status === "completed" &&
                    "border-amber-400 bg-amber-400 text-zinc-950",
                  status === "active" &&
                    "animate-pulse border-amber-300 bg-zinc-950 text-amber-300 shadow-[0_0_20px_var(--color-amber-400)] ring-4 ring-amber-400/30",
                  status === "locked" && "border-zinc-800 bg-zinc-800 text-zinc-500",
                )}
              >
                {status === "completed" && <Check className="size-4" aria-hidden />}
                {status === "active" && level}
                {status === "locked" && <Lock className="size-4" aria-hidden />}
              </span>
              <div className="flex min-h-10 flex-col justify-center">
                <p
                  className={cn(
                    "text-sm font-medium",
                    status === "locked" ? "text-zinc-500" : "text-zinc-50",
                  )}
                >
                  {status === "active" ? (
                    <Link
                      href={`/apprentice/level/${level}`}
                      className="underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:text-amber-300 hover:underline"
                    >
                      Level {level}
                    </Link>
                  ) : (
                    <>Level {level}</>
                  )}
                </p>
                <p
                  className={cn(
                    "text-xs",
                    status === "completed" && "text-amber-400/80",
                    status === "active" && "text-amber-300",
                    status === "locked" && "text-zinc-600",
                  )}
                >
                  {statusLabel[status]}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
