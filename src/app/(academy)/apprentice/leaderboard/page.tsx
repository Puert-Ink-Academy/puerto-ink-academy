import { Suspense } from "react";

import { LeaderboardBoard } from "@/components/leaderboard/leaderboard-board";
import { LeaderboardSkeleton } from "@/components/feedback/leaderboard-skeleton";

export default function LeaderboardPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100svh-8rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 md:min-h-svh">
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardBoard nav="apprentice" />
      </Suspense>
    </main>
  );
}
