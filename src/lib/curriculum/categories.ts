import { Anchor, Droplets, Eye, Layers, PenLine, Waves, type LucideIcon } from "lucide-react";

import { isCategoryId, type CategoryId } from "@/lib/mock/categories";

export type CategoryStyle = {
  icon: LucideIcon;
  text: string;
  chip: string;
  card: string;
  glow: string;
  progress: string;
  ring: string;
};

export const categoryStyles: Record<CategoryId, CategoryStyle> = {
  "fine-line": {
    icon: PenLine,
    text: "text-amber-300",
    chip: "border-amber-400/40 bg-amber-400/10 text-amber-300",
    card: "border-amber-400/25 hover:border-amber-400/60 hover:shadow-[0_0_32px_-10px_var(--color-amber-400)]",
    glow: "bg-[radial-gradient(circle_at_top_right,var(--color-amber-400)_0%,transparent_60%)]",
    progress:
      "[&_[data-slot=progress-indicator]]:bg-amber-400 [&_[data-slot=progress-indicator]]:shadow-[0_0_12px_var(--color-amber-400)]",
    ring: "focus-visible:ring-amber-400",
  },
  realism: {
    icon: Eye,
    text: "text-slate-200",
    chip: "border-slate-300/40 bg-slate-300/10 text-slate-200",
    card: "border-slate-300/20 hover:border-slate-300/50 hover:shadow-[0_0_32px_-10px_var(--color-slate-300)]",
    glow: "bg-[radial-gradient(circle_at_top_right,var(--color-slate-300)_0%,transparent_60%)]",
    progress:
      "[&_[data-slot=progress-indicator]]:bg-slate-200 [&_[data-slot=progress-indicator]]:shadow-[0_0_12px_var(--color-slate-300)]",
    ring: "focus-visible:ring-slate-300",
  },
  japanese: {
    icon: Waves,
    text: "text-indigo-300",
    chip: "border-indigo-400/40 bg-indigo-400/10 text-indigo-300",
    card: "border-indigo-400/25 hover:border-indigo-400/60 hover:shadow-[0_0_32px_-10px_var(--color-indigo-400)]",
    glow: "bg-[radial-gradient(circle_at_top_right,var(--color-indigo-400)_0%,transparent_60%)]",
    progress:
      "[&_[data-slot=progress-indicator]]:bg-indigo-400 [&_[data-slot=progress-indicator]]:shadow-[0_0_12px_var(--color-indigo-400)]",
    ring: "focus-visible:ring-indigo-400",
  },
  traditional: {
    icon: Anchor,
    text: "text-rose-300",
    chip: "border-rose-400/40 bg-rose-400/10 text-rose-300",
    card: "border-rose-400/25 hover:border-rose-400/60 hover:shadow-[0_0_32px_-10px_var(--color-rose-500)]",
    glow: "bg-[radial-gradient(circle_at_top_right,var(--color-rose-500)_0%,transparent_60%)]",
    progress:
      "[&_[data-slot=progress-indicator]]:bg-rose-400 [&_[data-slot=progress-indicator]]:shadow-[0_0_12px_var(--color-rose-500)]",
    ring: "focus-visible:ring-rose-400",
  },
  watercolor: {
    icon: Droplets,
    text: "text-sky-300",
    chip: "border-sky-400/40 bg-sky-400/10 text-sky-300",
    card: "border-sky-400/25 hover:border-sky-400/60 hover:shadow-[0_0_32px_-10px_var(--color-sky-400)]",
    glow: "bg-[radial-gradient(circle_at_top_right,var(--color-sky-400)_0%,transparent_60%)]",
    progress:
      "[&_[data-slot=progress-indicator]]:bg-sky-400 [&_[data-slot=progress-indicator]]:shadow-[0_0_12px_var(--color-sky-400)]",
    ring: "focus-visible:ring-sky-400",
  },
};

export const fallbackCategoryStyle: CategoryStyle = {
  icon: Layers,
  text: "text-zinc-200",
  chip: "border-zinc-500/40 bg-zinc-500/10 text-zinc-200",
  card: "border-zinc-700 hover:border-zinc-500 hover:shadow-[0_0_32px_-10px_var(--color-zinc-400)]",
  glow: "bg-[radial-gradient(circle_at_top_right,var(--color-zinc-400)_0%,transparent_60%)]",
  progress:
    "[&_[data-slot=progress-indicator]]:bg-zinc-300 [&_[data-slot=progress-indicator]]:shadow-[0_0_12px_var(--color-zinc-400)]",
  ring: "focus-visible:ring-zinc-400",
};

export function getCategoryStyle(id: string): CategoryStyle {
  return isCategoryId(id) ? categoryStyles[id] : fallbackCategoryStyle;
}
