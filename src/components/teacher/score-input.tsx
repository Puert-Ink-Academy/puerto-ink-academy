"use client";

import { cn } from "cn";

const scores = Array.from({ length: 11 }, (_, score) => score);

export function ScoreInput({
  value,
  onChange,
  labelId,
}: {
  value: number | null;
  onChange: (score: number) => void;
  labelId: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      className="grid grid-cols-6 gap-2"
    >
      {scores.map((score) => {
        const selected = value === score;

        return (
          <button
            key={score}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(score)}
            className={cn(
              "flex h-11 items-center justify-center rounded-lg border text-sm font-semibold tabular-nums transition-colors outline-none focus-visible:ring-3 focus-visible:ring-amber-400/40",
              selected
                ? "border-amber-300 bg-amber-400 text-zinc-950 shadow-[0_0_14px_var(--color-amber-400)]"
                : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 hover:text-zinc-50",
            )}
          >
            {score}
          </button>
        );
      })}
    </div>
  );
}
