import type { LucideIcon } from "lucide-react";

import { Panel } from "@/components/ui/panel";

export function EmptyState({
  title,
  icon: Icon,
}: {
  title: string;
  icon?: LucideIcon;
}) {
  return (
    <Panel
      variant="dashed"
      padding="none"
      className="flex flex-col items-center gap-3 border-amber-400/20 px-6 py-14 text-center"
    >
      {Icon && <Icon className="size-8 text-amber-400/80" aria-hidden />}
      <p className="max-w-sm text-sm font-medium text-zinc-200">{title}</p>
    </Panel>
  );
}
