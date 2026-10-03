import "server-only";

import { requireSessionUser, type SessionUser } from "@/lib/auth/session";

export type { SessionUser };

export async function getCurrentUser(): Promise<SessionUser> {
  return requireSessionUser();
}
