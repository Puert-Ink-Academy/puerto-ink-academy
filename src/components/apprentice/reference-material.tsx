import { ImageIcon } from "lucide-react";

import type { LevelReference } from "@/lib/mock/level-lessons";

export function ReferenceMaterial({ references }: { references: LevelReference[] }) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5">
      <h2 className="text-[0.7rem] font-medium tracking-[0.12em] text-zinc-400 uppercase">
        Reference Material
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {references.map((reference) => (
          <li key={reference.id}>
            <figure className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-800 to-zinc-950 text-zinc-500">
              <ImageIcon className="size-6" aria-hidden />
              <figcaption className="px-2 text-center text-xs text-zinc-400">
                {reference.label}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
