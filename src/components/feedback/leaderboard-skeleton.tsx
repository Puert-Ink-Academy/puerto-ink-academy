function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-zinc-800 ${className}`} />;
}

export function LeaderboardSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-hidden>
      <Bone className="mb-2 h-8 w-48 rounded-full" />
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-xl border border-amber-400/15 bg-zinc-900 px-4 py-3"
        >
          <Bone className="size-8 rounded-full" />
          <Bone className="h-4 w-32" />
          <Bone className="ml-auto h-4 w-12" />
        </div>
      ))}
    </div>
  );
}
