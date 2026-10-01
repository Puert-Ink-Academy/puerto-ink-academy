import { BookOpen, Camera, Crown, Sparkles, Target, TrendingUp, type LucideIcon } from "lucide-react";

type Step = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const steps: Step[] = [
  {
    icon: BookOpen,
    title: "Learn the level",
    body: "Each level has a clear objective, a hands-on exercise, teacher tips and reference material.",
  },
  {
    icon: Camera,
    title: "Submit your work",
    body: "Photograph your practice skin and send it in. Your teacher sees it in their grading queue.",
  },
  {
    icon: TrendingUp,
    title: "Get graded and level up",
    body: "Get a score and written feedback. Pass to unlock the next level, or retry as often as you need.",
  },
];

const rules = [
  { icon: Target, label: "8/10 passes" },
  { icon: Sparkles, label: "Score × 10 = XP" },
  { icon: Crown, label: "10/10 = Mastery" },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="mx-auto w-full max-w-6xl scroll-mt-8 px-4 sm:px-6"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[0.7rem] font-medium tracking-[0.12em] text-amber-400 uppercase">
          How it works
        </p>
        <h2
          id="how-heading"
          className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
        >
          Three steps, on repeat
        </h2>
      </div>

      <ol className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <span
                aria-hidden
                className="font-brand pointer-events-none absolute -top-4 right-3 text-8xl text-zinc-800/70"
              >
                {index + 1}
              </span>
              <span className="relative flex size-11 items-center justify-center rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-300">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="relative mt-4 text-lg font-semibold text-zinc-50">{step.title}</h3>
              <p className="relative mt-1.5 text-sm leading-relaxed text-zinc-400">{step.body}</p>
            </li>
          );
        })}
      </ol>

      <ul className="mt-6 flex flex-wrap justify-center gap-2.5">
        {rules.map((rule) => {
          const Icon = rule.icon;
          return (
            <li
              key={rule.label}
              className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 text-sm font-medium text-zinc-200"
            >
              <Icon className="size-4 text-amber-400" aria-hidden />
              {rule.label}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
