import { sessionUsers, type SessionUser } from "@/lib/mock/session";
import type { NavKey } from "@/lib/nav";

export type { SessionUser };

export function getSessionUser(nav: NavKey): SessionUser {
  return sessionUsers[nav];
}

export function getCurrentApprentice(): SessionUser {
  return getSessionUser("apprentice");
}
