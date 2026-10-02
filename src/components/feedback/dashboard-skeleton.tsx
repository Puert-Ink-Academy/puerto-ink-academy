function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-zinc-800 ${className}`} />;
}

const statTones = [
  "border-amber-400/20 bg-gradient-to-b from-amber-400/10 to-zinc-900",
  "border-amber-400/20 bg-gradient-to-b from-amber-400/10 to-zinc-900",
  "border-zinc-800 bg-zinc-900",
  "border-zinc-800 bg-zinc-900",
  "col-span-2 border-rose-500/20 bg-gradient-to-b from-rose-500/10 to-zinc-900 lg:col-span-1",
];

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-hidden>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {statTones.map((tone, index) => (
          <div key={index} className={`rounded-xl border p-4 ${tone}`}>
            <Bone className="h-3 w-20" />
            <Bone className="mt-4 h-9 w-14" />
          </div>
        ))}
      </div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <li
            key={index}
            className="rounded-2xl border border-amber-400/15 bg-zinc-900 p-5"
          >
            <div className="flex items-start gap-3">
              <Bone className="size-11 shrink-0 rounded-xl" />
              <div className="flex flex-1 flex-col gap-2 pt-1">
                <Bone className="h-4 w-32" />
                <Bone className="h-3 w-48" />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Bone className="h-12" />
              <Bone className="h-12" />
            </div>
            <Bone className="mt-5 h-2 w-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
