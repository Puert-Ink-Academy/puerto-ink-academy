function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-zinc-800 ${className}`} />;
}

export function CurriculumSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden>
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-xl border border-amber-400/15 bg-zinc-900 p-4"
        >
          <Bone className="size-12 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Bone className="h-3 w-16" />
            <Bone className="h-4 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}
