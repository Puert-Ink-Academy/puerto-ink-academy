import { Panel } from "@/components/ui/panel";
import { SectionLabel } from "@/components/ui/section-label";
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
        <Panel
          as="section"
          key={section.title}
          className={cn(section.teacherNote && "border-l-4 border-l-amber-400")}
        >
          <SectionLabel as="h2">{section.title}</SectionLabel>
          <p className="mt-2 text-sm leading-relaxed text-zinc-200 sm:text-base">
            {section.body}
          </p>
        </Panel>
      ))}
    </div>
  );
}
