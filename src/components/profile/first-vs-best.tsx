"use client";

import { ArrowDown, ArrowRight, Crown, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import { PhotoViewer } from "@/components/submissions/photo-viewer";
import { Panel } from "@/components/ui/panel";
import { categoryStyles } from "@/lib/categories";
import { MASTERY_SCORE } from "@/lib/grading";
import type { EvolutionAttempt } from "@/lib/leaderboard";
import type { EvolutionCard } from "@/lib/mock/profiles";
import { cn } from "cn";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysBetween(from: string, to: string): number {
  return Math.max(0, Math.round((Date.parse(to) - Date.parse(from)) / DAY_MS));
}

function AttemptPanel({
  kind,
  attempt,
  onOpen,
}: {
  kind: "first" | "best";
  attempt: EvolutionAttempt;
  onOpen: () => void;
}) {
  const format = useFormatter();
  const t = useTranslations("Profile.Evolution");
  const isBest = kind === "best";
  const isEpic = isBest && attempt.score === MASTERY_SCORE;
  const label = t(isBest ? "best" : "first");

  return (
    <figure
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl border bg-zinc-950/60",
        !isBest && "border-zinc-800",
        isBest && !isEpic && "border-emerald-500/50 shadow-[0_0_28px_-12px_var(--color-emerald-500)]",
        isEpic && "border-amber-400/60 shadow-[0_0_36px_-10px_var(--color-amber-400)]",
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={t(isBest ? "openBest" : "openFirst")}
        className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-inset"
      >
        <Image
          src={attempt.photo.src}
          alt={attempt.photo.alt}
          fill
          sizes="(min-width: 640px) 45vw, 100vw"
          className={cn(
            "object-cover transition-transform duration-300 group-hover:scale-[1.03]",
            !isBest && "opacity-80 saturate-50",
          )}
        />
        <span
          className={cn(
            "absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.12em] uppercase backdrop-blur",
            isEpic
              ? "bg-amber-400 text-zinc-950"
              : isBest
                ? "bg-emerald-500/90 text-zinc-950"
                : "bg-zinc-950/80 text-zinc-300",
          )}
        >
          {isEpic && <Crown className="size-3" aria-hidden />}
          {label}
        </span>
      </button>
      <figcaption className="flex items-center justify-between gap-3 px-3.5 py-3">
        <span className="text-xs text-zinc-500">
          {format.dateTime(new Date(attempt.date), "date")}
        </span>
        <span
          className={cn(
            "text-sm font-semibold tabular-nums",
            !isBest && "text-rose-300",
            isBest && !isEpic && "text-emerald-300",
            isEpic &&
              "bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent",
          )}
        >
          {t("score", { score: attempt.score })}
          {isEpic && t("epic")}
        </span>
      </figcaption>
    </figure>
  );
}

export function FirstVsBest({ card }: { card: EvolutionCard }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const t = useTranslations("Profile.Evolution");
  const style = categoryStyles[card.category.id];
  const Icon = style.icon;
  const gain = card.best.score - card.first.score;
  const days = daysBetween(card.first.date, card.best.date);

  const open = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <Panel as="article" className="rounded-2xl">
      <header className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.6rem] font-medium tracking-[0.1em] uppercase",
            style.chip,
          )}
        >
          <Icon className="size-3" aria-hidden />
          {card.category.name}
        </span>
        <h3 className="text-sm font-semibold text-zinc-50">
          {t("levelTitle", { level: card.level, title: card.title })}
        </h3>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300 tabular-nums">
          <TrendingUp className="size-3.5" aria-hidden />
          {t("gain", { points: gain })}
          {days > 0 && <span className="text-emerald-400/70"> · {t("inDays", { days })}</span>}
        </span>
      </header>

      <div className="mt-4 grid grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <AttemptPanel kind="first" attempt={card.first} onOpen={() => open(0)} />
        <span
          aria-hidden
          className="mx-auto flex size-10 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_18px_-6px_var(--color-emerald-500)]"
        >
          <ArrowDown className="size-5 sm:hidden" />
          <ArrowRight className="hidden size-5 sm:block" />
        </span>
        <AttemptPanel kind="best" attempt={card.best} onOpen={() => open(1)} />
      </div>

      <PhotoViewer
        photos={[card.first.photo, card.best.photo]}
        index={viewerIndex}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        onIndexChange={setViewerIndex}
      />
    </Panel>
  );
}
