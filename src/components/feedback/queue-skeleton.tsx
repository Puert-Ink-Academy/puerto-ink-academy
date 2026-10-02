function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-zinc-800 ${className}`} />;
}

export function QueueSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <div className="flex gap-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Bone key={index} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      {Array.from({ length: 3 }, (_, group) => (
        <div key={group} className="flex flex-col gap-2">
          <Bone className="h-4 w-28" />
          <div className="overflow-hidden rounded-xl border border-amber-400/15 bg-zinc-900">
            {Array.from({ length: 2 }, (_, row) => (
              <div key={row} className="flex items-center gap-4 border-b border-zinc-800 px-4 py-4 last:border-b-0">
                <Bone className="size-10 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Bone className="h-4 w-48" />
                  <Bone className="h-3 w-32" />
                </div>
                <Bone className="h-8 w-28 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
