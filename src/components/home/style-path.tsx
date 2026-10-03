import { useTranslations } from "next-intl";

import { SectionLabel } from "@/components/ui/section-label";
import { categoryStyles } from "@/lib/curriculum/categories";
import { categories } from "@/lib/mock/categories";
import { cn } from "cn";

export function StylePath() {
  const t = useTranslations("Marketing.Path");

  return (
    <section aria-labelledby="path-heading" className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <SectionLabel tone="marketing">{t("eyebrow")}</SectionLabel>
        <h2
          id="path-heading"
          className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
        >
          {t("title")}
        </h2>
        <p className="mt-3 text-zinc-400">{t("body")}</p>
      </div>

      <ol className="relative mt-10 grid gap-3 sm:grid-cols-5 sm:gap-4">
        <span
          aria-hidden
          className="absolute top-6 bottom-6 left-[1.6rem] w-0.5 bg-gradient-to-b from-amber-400/70 via-zinc-700 to-zinc-800 sm:top-[1.6rem] sm:right-[10%] sm:bottom-auto sm:left-[10%] sm:h-0.5 sm:w-auto sm:bg-gradient-to-r"
        />
        {categories.map((category, index) => {
          const style = categoryStyles[category.id];
          const Icon = style.icon;
          const isFirst = index === 0;
          return (
            <li
              key={category.id}
              className="relative flex items-center gap-4 sm:flex-col sm:gap-3 sm:text-center"
            >
              <span
                className={cn(
                  "relative z-10 flex size-[3.2rem] shrink-0 items-center justify-center rounded-full border-2 bg-zinc-950",
                  style.chip,
                  isFirst && "shadow-[0_0_24px_-4px_var(--color-amber-400)]",
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.65rem] font-medium tracking-[0.12em] text-zinc-500 uppercase">
                  {isFirst ? t("startHere") : t("step", { number: category.sequenceOrder })}
                </span>
                <span className="mt-0.5 block font-semibold text-zinc-50">{category.name}</span>
                <span className="mt-0.5 block text-xs text-zinc-400">{category.tagline}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
