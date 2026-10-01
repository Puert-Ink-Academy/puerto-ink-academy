import type { NavKey } from "@/components/layout/nav-items";
import { platformUsers } from "@/lib/mock/admin-users";

export type SessionUser = { name: string; email: string };

function sessionUser(id: string): SessionUser {
  const user = platformUsers.find((entry) => entry.id === id);
  if (!user) throw new Error(`Unknown mock user: ${id}`);
  return { name: user.name, email: user.email };
}

export const sessionUsers: Record<NavKey, SessionUser> = {
  apprentice: sessionUser("john-doe"),
  teacher: sessionUser("jane-smith"),
  admin: sessionUser("admin-user"),
};
