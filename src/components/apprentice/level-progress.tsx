import { Lock } from "lucide-react";

import { Progress } from "@/components/ui/progress";

export function LevelProgress({
  currentLevel,
  progress,
}: {
  currentLevel: number;
  progress: number;
}) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-medium tracking-[0.12em] text-zinc-400 uppercase">
            Level {currentLevel}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-zinc-300">
            <Lock className="size-4 text-zinc-500" aria-hidden />
            Next Level: Locked
          </p>
        </div>
        <span className="text-2xl font-semibold text-amber-300 tabular-nums">
          {progress}%
        </span>
      </div>
      <Progress
        value={progress}
        aria-label={`Level ${currentLevel} progress`}
        className="mt-4 [&_[data-slot=progress-indicator]]:bg-amber-400 [&_[data-slot=progress-indicator]]:shadow-[0_0_12px_var(--color-amber-400)] [&_[data-slot=progress-track]]:h-2.5 [&_[data-slot=progress-track]]:bg-zinc-800"
      />
    </section>
  );
}
