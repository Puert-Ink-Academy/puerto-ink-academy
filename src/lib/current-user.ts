import "server-only";

import { requireSessionUser, type SessionUser } from "@/lib/session";

export type { SessionUser };

export async function getCurrentUser(): Promise<SessionUser> {
  return requireSessionUser();
}
