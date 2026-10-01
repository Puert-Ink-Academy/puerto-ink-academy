import { Check, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";

import { levelStatus, type LevelStatus } from "@/lib/levels";
import type { LevelLesson } from "@/lib/mock/level-lessons";
import type { LevelResult } from "@/lib/mock/level-results";
import { cn } from "cn";

function SkillNode({ level, status }: { level: number; status: LevelStatus }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative z-10 flex size-12 items-center justify-center rounded-full border text-sm font-semibold tabular-nums md:col-start-2 md:row-start-1",
        status === "completed" &&
          "border-emerald-400 bg-emerald-500 text-zinc-950 ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-950",
        status === "active" &&
          "animate-pulse border-amber-300 bg-zinc-950 text-amber-300 shadow-[0_0_24px_var(--color-amber-400)] ring-4 ring-amber-400/30",
        status === "locked" && "border-zinc-800 bg-zinc-900 text-zinc-600",
      )}
    >
      {status === "completed" && <Check className="size-5" />}
      {status === "active" && level}
      {status === "locked" && <Lock className="size-4" />}
    </span>
  );
}

function CardBody({
  lesson,
  status,
  result,
}: {
  lesson: LevelLesson;
  status: LevelStatus;
  result: LevelResult | undefined;
}) {
  return (
    <>
      <p
        className={cn(
          "text-[0.7rem] font-medium tracking-[0.12em] uppercase",
          status === "completed" && "text-emerald-400",
          status === "active" && "text-amber-400",
          status === "locked" && "text-zinc-600",
        )}
      >
        Level {lesson.level}
      </p>
      <p
        className={cn(
          "mt-0.5 font-semibold",
          status === "locked" ? "text-zinc-500" : "text-zinc-50",
        )}
      >
        {lesson.title}
      </p>
      <div className="mt-2 flex items-center justify-between gap-3 text-xs">
        {status === "completed" && (
          <>
            <span className="text-emerald-400">Completed</span>
            {result && (
              <span className="font-semibold text-amber-300 tabular-nums">
                {result.score}/10
              </span>
            )}
          </>
        )}
        {status === "active" && (
          <>
            <span className="text-amber-300">Active</span>
            <span className="flex items-center gap-0.5 font-medium text-amber-300">
              Continue
              <ChevronRight className="size-3.5" aria-hidden />
            </span>
          </>
        )}
        {status === "locked" && (
          <span className="flex items-center gap-1 text-zinc-600">
            <Lock className="size-3" aria-hidden />
            Locked
          </span>
        )}
      </div>
    </>
  );
}

export function SkillTree({
  lessons,
  results,
  currentLevel,
}: {
  lessons: LevelLesson[];
  results: LevelResult[];
  currentLevel: number;
}) {
  return (
    <ol className="flex flex-col">
      {lessons.map((lesson, index) => {
        const status = levelStatus(lesson.level, currentLevel);
        const result = results.find((entry) => entry.level === lesson.level);
        const isLast = index === lessons.length - 1;
        const cardClassName = cn(
          "block min-h-12 rounded-xl border p-4 transition-colors md:row-start-1",
          index % 2 === 0 ? "md:col-start-1" : "md:col-start-3",
          status === "completed" &&
            "border-emerald-500/30 bg-zinc-900 hover:border-emerald-400/60",
          status === "active" &&
            "border-amber-400/60 bg-amber-400/5 shadow-[0_0_24px_-8px_var(--color-amber-400)] hover:border-amber-300",
          status === "locked" &&
            "border-zinc-800/80 bg-zinc-900/40 opacity-60 grayscale",
        );

        return (
          <li
            key={lesson.level}
            className="relative grid grid-cols-[3rem_1fr] items-start gap-4 pb-5 last:pb-0 md:grid-cols-[1fr_3rem_1fr]"
          >
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-12 left-6 h-[calc(100%-3rem)] w-0.5 -translate-x-1/2 md:left-1/2",
                  lesson.level < currentLevel
                    ? "bg-amber-400/70 shadow-[0_0_8px_var(--color-amber-400)]"
                    : "bg-zinc-800",
                )}
              />
            )}
            <SkillNode level={lesson.level} status={status} />
            {status === "locked" ? (
              <div aria-disabled="true" className={cardClassName}>
                <CardBody lesson={lesson} status={status} result={result} />
              </div>
            ) : (
              <Link
                href={`/apprentice/level/${lesson.level}`}
                className={cn(
                  cardClassName,
                  "outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                )}
              >
                <CardBody lesson={lesson} status={status} result={result} />
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
