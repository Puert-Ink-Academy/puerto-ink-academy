import { roleLabels, type Role } from "@/lib/roles";
import { cn } from "cn";

const roleBadgeClassName: Record<Role, string> = {
  APPRENTICE: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  TEACHER: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  ADMIN: "border-violet-400/40 bg-violet-400/10 text-violet-300",
};

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-[0.65rem] font-medium tracking-[0.12em] uppercase",
        roleBadgeClassName[role],
      )}
    >
      {roleLabels[role]}
    </span>
  );
}
