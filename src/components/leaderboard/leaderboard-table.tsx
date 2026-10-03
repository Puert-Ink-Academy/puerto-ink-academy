import { Crown, Medal } from "lucide-react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";

import { CountryFlag } from "@/components/ui/country-flag";
import { Panel } from "@/components/ui/panel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LeaderboardEntry } from "@/lib/progress/leaderboard";
import { cn } from "cn";

type PodiumStyle = {
  badge: string;
  edge: string;
  row: string;
  name: string;
};

const podiumStyles: Record<number, PodiumStyle> = {
  1: {
    badge:
      "border-amber-300 bg-amber-400 text-zinc-950 shadow-[0_0_16px_var(--color-amber-400)]",
    edge: "shadow-[inset_3px_0_0_var(--color-amber-400)]",
    row: "bg-amber-400/[0.07] hover:bg-amber-400/10",
    name: "text-amber-200",
  },
  2: {
    badge:
      "border-zinc-100 bg-zinc-300 text-zinc-900 shadow-[0_0_14px_var(--color-zinc-400)]",
    edge: "shadow-[inset_3px_0_0_var(--color-zinc-300)]",
    row: "bg-zinc-300/[0.05] hover:bg-zinc-300/[0.08]",
    name: "text-zinc-100",
  },
  3: {
    badge:
      "border-orange-400 bg-orange-700 text-orange-50 shadow-[0_0_14px_var(--color-orange-600)]",
    edge: "shadow-[inset_3px_0_0_var(--color-orange-600)]",
    row: "bg-orange-600/[0.07] hover:bg-orange-600/10",
    name: "text-orange-200",
  },
};

const defaultStyle: PodiumStyle = {
  badge: "border-zinc-700 bg-zinc-800 text-zinc-300",
  edge: "",
  row: "hover:bg-zinc-800/50",
  name: "text-zinc-50",
};

function RankBadge({ rank, className, label }: { rank: number; className: string; label: string }) {
  const Icon = rank === 1 ? Crown : rank <= 3 ? Medal : null;

  return (
    <span
      className={cn(
        "flex size-9 items-center justify-center rounded-full border text-sm font-semibold tabular-nums",
        className,
      )}
      aria-label={label}
    >
      {Icon ? <Icon className="size-4" aria-hidden /> : `#${rank}`}
    </span>
  );
}

const currentUserStyle: Pick<PodiumStyle, "edge" | "row"> = {
  edge: "shadow-[inset_3px_0_0_var(--color-amber-400)]",
  row: "bg-amber-400/[0.06] hover:bg-amber-400/10",
};

export function LeaderboardTable({
  entries,
  highlightCurrentUser = false,
  linkProfiles = false,
}: {
  entries: LeaderboardEntry[];
  highlightCurrentUser?: boolean;
  linkProfiles?: boolean;
}) {
  const format = useFormatter();
  const t = useTranslations("Leaderboard.Table");
  const tCommon = useTranslations("Common");
  const levelsText = (personal: number, style: number) =>
    t("levelsCompact", { personal, style });

  return (
    <Panel padding="flush">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="w-14 pl-4 text-[0.7rem] tracking-[0.12em] text-zinc-400 uppercase">
              {t("rank")}
            </TableHead>
            <TableHead className="text-[0.7rem] tracking-[0.12em] text-zinc-400 uppercase">
              {t("apprentice")}
            </TableHead>
            <TableHead className="hidden text-[0.7rem] tracking-[0.12em] whitespace-nowrap text-zinc-400 uppercase sm:table-cell">
              {t("personal")}
            </TableHead>
            <TableHead className="hidden text-[0.7rem] tracking-[0.12em] whitespace-nowrap text-zinc-400 uppercase sm:table-cell">
              {t("style")}
            </TableHead>
            <TableHead className="text-right text-[0.7rem] tracking-[0.12em] text-zinc-400 uppercase">
              {t("xp")}
            </TableHead>
            <TableHead className="pr-4 text-right text-[0.7rem] tracking-[0.12em] text-zinc-400 uppercase">
              {t("average")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const isYou = highlightCurrentUser && entry.isCurrentUser === true;
            const podium = podiumStyles[entry.rank];
            const style =
              podium ?? (isYou ? { ...defaultStyle, ...currentUserStyle } : defaultStyle);

            return (
              <TableRow key={entry.id} className={cn("border-zinc-800", style.row)}>
                <TableCell className={cn("py-3 pl-4", style.edge)}>
                  <RankBadge
                    rank={entry.rank}
                    className={style.badge}
                    label={t("rankLabel", { rank: entry.rank })}
                  />
                </TableCell>
                <TableCell className="py-3">
                  <p className={cn("font-semibold", style.name)}>
                    <span className="text-zinc-500">#{entry.rank}</span>{" "}
                    {entry.nationality && (
                      <CountryFlag code={entry.nationality} className="mr-1.5 align-[-1px]" />
                    )}
                    {linkProfiles ? (
                      <Link
                        href={`/profile/${entry.slug}`}
                        className="underline-offset-4 outline-none hover:underline focus-visible:underline"
                      >
                        {entry.name}
                      </Link>
                    ) : (
                      entry.name
                    )}
                    {isYou && (
                      <span className="ml-2 rounded-full border border-amber-400/50 bg-amber-400/10 px-1.5 py-0.5 align-middle text-[0.6rem] font-medium tracking-[0.12em] text-amber-300 uppercase">
                        {tCommon("you")}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500 sm:hidden">
                    {levelsText(entry.personalLevel, entry.level)}
                  </p>
                </TableCell>
                <TableCell className="hidden py-3 text-zinc-300 tabular-nums sm:table-cell">
                  {entry.personalLevel}
                </TableCell>
                <TableCell className="hidden py-3 text-zinc-300 tabular-nums sm:table-cell">
                  {entry.level}
                </TableCell>
                <TableCell className="py-3 text-right font-semibold text-zinc-50 tabular-nums">
                  {format.number(entry.xp)}
                </TableCell>
                <TableCell className="py-3 pr-4 text-right text-zinc-300 tabular-nums">
                  {format.number(entry.averageScore, "score")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Panel>
  );
}
