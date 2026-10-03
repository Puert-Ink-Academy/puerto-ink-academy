"use client";

import { Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { UserRankBanner } from "@/components/leaderboard/user-rank-banner";
import { Panel } from "@/components/ui/panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCategoryStyle } from "@/lib/curriculum/categories";
import type { LeaderboardEntry, LeaderboardScope } from "@/lib/progress/leaderboard";
import { isCategoryId } from "@/lib/mock/categories";
import { cn } from "cn";

const scopeActive: Record<LeaderboardScope, string> = {
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

export function LeaderboardTabs({
  tabs,
  rankings,
  highlightCurrentUser = false,
  linkProfiles = false,
  showBanner = false,
  viewerPersonalLevel,
  lockedHints = {},
}: {
  tabs: { id: string; label: string; slug: string }[];
  rankings: Record<string, LeaderboardEntry[]>;
  highlightCurrentUser?: boolean;
  linkProfiles?: boolean;
  showBanner?: boolean;
  viewerPersonalLevel?: number;
  lockedHints?: Record<string, string>;
}) {
  const t = useTranslations("Leaderboard");
  const [scope, setScope] = useState(tabs[0]?.id ?? "");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>("[data-active]")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [scope]);

  if (tabs.length === 0) return null;

  const ranking = rankings[scope] ?? [];
  const active = tabs.find((tab) => tab.id === scope) ?? tabs[0];
  const currentEntry = ranking.find((entry) => entry.isCurrentUser);
  const entryAbove = currentEntry
    ? ranking.find((entry) => entry.rank === currentEntry.rank - 1)
    : undefined;

  return (
    <>
      <Tabs value={scope} onValueChange={setScope} className="gap-4">
        <TabsList
          ref={listRef}
          aria-label={t("tabsLabel")}
          className="-mx-4 h-auto w-auto justify-start gap-2 overflow-x-auto rounded-none bg-transparent px-4 py-0 pb-1 [scrollbar-width:none] group-data-horizontal/tabs:h-auto sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const Icon = getCategoryStyle(tab.slug).icon;
            const activeClass = isCategoryId(tab.slug) ? scopeActive[tab.slug] : scopeActive["fine-line"];
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "h-9 flex-none rounded-full border-zinc-800 bg-zinc-900 px-3.5 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100",
                  activeClass,
                )}
              >
                <Icon aria-hidden />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tabs.map((tab) => {
          const entries = rankings[tab.id] ?? [];
          return (
            <TabsContent key={tab.id} value={tab.id} className="flex flex-col gap-3">
              <p className="text-xs text-zinc-500">
                {t("captionScope", { scope: tab.label, count: entries.length })}
              </p>
              {entries.length > 0 ? (
                <LeaderboardTable
                  entries={entries}
                  highlightCurrentUser={highlightCurrentUser}
                  linkProfiles={linkProfiles}
                />
              ) : (
                <Panel
                  variant="dashed"
                  padding="none"
                  className="flex flex-col items-center gap-2 border-amber-400/20 px-6 py-10 text-center"
                >
                  <Users className="size-6 text-amber-400/70" aria-hidden />
                  <p className="text-sm font-medium text-zinc-200">{t("emptyBody")}</p>
                </Panel>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {showBanner && (
        <UserRankBanner
          rank={currentEntry?.rank ?? null}
          scopeLabel={active.label}
          lockedHint={lockedHints[scope]}
          levelText={
            currentEntry
              ? t("Banner.levels", {
                  personal: currentEntry.personalLevel,
                  style: currentEntry.level,
                })
              : viewerPersonalLevel !== undefined
                ? t("Banner.personalOnly", { personal: viewerPersonalLevel })
                : null
          }
          xp={currentEntry?.xp ?? 0}
          nextRankXp={entryAbove?.xp}
        />
      )}
    </>
  );
}
