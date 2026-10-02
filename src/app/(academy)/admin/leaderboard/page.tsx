import { Suspense } from "react";

import { LeaderboardBoard } from "@/components/leaderboard/leaderboard-board";
import { LeaderboardSkeleton } from "@/components/feedback/leaderboard-skeleton";
import { screenMetadata } from "@/lib/page-metadata";

export async function generateMetadata() {
  return screenMetadata("leaderboard");
}

export default function AdminLeaderboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardBoard nav="admin" />
      </Suspense>
    </main>
  );
}
