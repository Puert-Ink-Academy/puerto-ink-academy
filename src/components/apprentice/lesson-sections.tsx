import type { LevelLesson } from "@/lib/mock/level-lessons";
import { cn } from "cn";

export function LessonSections({ lesson }: { lesson: LevelLesson }) {
  const sections = [
    { title: "Objective", body: lesson.objective, teacherNote: false },
    { title: "Exercise", body: lesson.exercise, teacherNote: false },
    { title: "Tips", body: lesson.tips, teacherNote: true },
  ];

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section) => (
        <section
          key={section.title}
          className={cn(
            "rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5",
            section.teacherNote && "border-l-4 border-l-amber-400",
          )}
        >
          <h2 className="text-[0.7rem] font-medium tracking-[0.12em] text-zinc-400 uppercase">
            {section.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-200 sm:text-base">
            {section.body}
          </p>
        </section>
      ))}
    </div>
  );
}
