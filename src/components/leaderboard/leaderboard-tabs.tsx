"use client";

import { Trophy, Users, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { UserRankBanner } from "@/components/leaderboard/user-rank-banner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categoryStyles } from "@/lib/categories";
import { getCategory } from "@/lib/mock/categories";
import type { LeaderboardEntry, LeaderboardScope } from "@/lib/mock/leaderboard";
import { cn } from "cn";

type ScopeTab = {
  label: string;
  icon: LucideIcon;
  active: string;
};

const scopeActive: Record<LeaderboardScope, string> = {
  global:
    "dark:data-active:border-amber-400/50 dark:data-active:bg-amber-400/10 dark:data-active:text-amber-300 group-data-[variant=default]/tabs-list:data-active:shadow-[0_0_18px_-6px_var(--color-amber-400)]",
  "fine-line":
    "dark:data-active:border-amber-400/50 dark:data-active:bg-amber-400/10 dark:data-active:text-amber-300 group-data-[variant=default]/tabs-list:data-active:shadow-[0_0_18px_-6px_var(--color-amber-400)]",
  realism:
    "dark:data-active:border-slate-300/50 dark:data-active:bg-slate-300/10 dark:data-active:text-slate-200 group-data-[variant=default]/tabs-list:data-active:shadow-[0_0_18px_-6px_var(--color-slate-300)]",
  japanese:
    "dark:data-active:border-indigo-400/50 dark:data-active:bg-indigo-400/10 dark:data-active:text-indigo-300 group-data-[variant=default]/tabs-list:data-active:shadow-[0_0_18px_-6px_var(--color-indigo-400)]",
  traditional:
    "dark:data-active:border-rose-400/50 dark:data-active:bg-rose-400/10 dark:data-active:text-rose-300 group-data-[variant=default]/tabs-list:data-active:shadow-[0_0_18px_-6px_var(--color-rose-500)]",
  watercolor:
    "dark:data-active:border-sky-400/50 dark:data-active:bg-sky-400/10 dark:data-active:text-sky-300 group-data-[variant=default]/tabs-list:data-active:shadow-[0_0_18px_-6px_var(--color-sky-400)]",
};

function scopeTab(scope: LeaderboardScope): ScopeTab {
  if (scope === "global") {
    return { label: "Global", icon: Trophy, active: scopeActive.global };
  }
  return {
    label: getCategory(scope).name,
    icon: categoryStyles[scope].icon,
    active: scopeActive[scope],
  };
}

function caption(scope: LeaderboardScope, label: string, count: number): string {
  const basis = scope === "global" ? "Ranked by total XP across all styles" : `Ranked by ${label} XP`;
  return `${basis} · ${count} ranked`;
}

export function LeaderboardTabs({
  scopes,
  rankings,
  highlightCurrentUser = false,
  showBanner = false,
  lockedHints = {},
}: {
  scopes: LeaderboardScope[];
  rankings: Record<LeaderboardScope, LeaderboardEntry[]>;
  highlightCurrentUser?: boolean;
  showBanner?: boolean;
  lockedHints?: Partial<Record<LeaderboardScope, string>>;
}) {
  const [scope, setScope] = useState<LeaderboardScope>(scopes[0] ?? "global");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>("[data-active]")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [scope]);

  const ranking = rankings[scope];
  const activeLabel = scopeTab(scope).label;
  const currentEntry = ranking.find((entry) => entry.isCurrentUser);
  const entryAbove = currentEntry
    ? ranking.find((entry) => entry.rank === currentEntry.rank - 1)
    : undefined;

  return (
    <>
      <Tabs value={scope} onValueChange={(value: LeaderboardScope) => setScope(value)} className="gap-4">
        <TabsList
          ref={listRef}
          aria-label="Leaderboard"
          className="-mx-4 h-auto w-auto justify-start gap-2 overflow-x-auto rounded-none bg-transparent px-4 py-0 pb-1 [scrollbar-width:none] group-data-horizontal/tabs:h-auto sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {scopes.map((item) => {
            const tab = scopeTab(item);
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={item}
                value={item}
                className={cn(
                  "h-9 flex-none rounded-full border-zinc-800 bg-zinc-900 px-3.5 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100",
                  tab.active,
                )}
              >
                <Icon aria-hidden />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {scopes.map((item) => {
          const entries = rankings[item];
          const label = scopeTab(item).label;
          return (
            <TabsContent key={item} value={item} className="flex flex-col gap-3">
              <p className="text-xs text-zinc-500">{caption(item, label, entries.length)}</p>
              {entries.length > 0 ? (
                <LeaderboardTable
                  entries={entries}
                  highlightCurrentUser={highlightCurrentUser}
                  levelLabel={item === "global" ? "Cleared" : "Level"}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 px-6 py-10 text-center">
                  <Users className="size-6 text-zinc-600" aria-hidden />
                  <p className="text-sm font-medium text-zinc-200">No one ranked in {label} yet</p>
                  <p className="text-xs text-zinc-500">The first passed level takes the crown.</p>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {showBanner && (
        <UserRankBanner
          rank={currentEntry?.rank ?? null}
          scopeLabel={activeLabel}
          lockedHint={lockedHints[scope]}
          levelText={
            currentEntry
              ? scope === "global"
                ? `${currentEntry.level} levels cleared`
                : `Level ${currentEntry.level} · ${activeLabel}`
              : null
          }
          xp={currentEntry?.xp ?? 0}
          nextRankXp={entryAbove?.xp}
        />
      )}
    </>
  );
}
