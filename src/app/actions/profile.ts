"use server";

import { parseArtistDetails, type ArtistDetails, type ArtistDetailsErrors } from "@/lib/artist";
import { getCurrentApprentice } from "@/lib/session";

export type UpdateArtistDetailsResult =
  | { ok: true; details: ArtistDetails }
  | { error: string; fieldErrors?: ArtistDetailsErrors };

// Drizzle replaces the mock: it will save the details on the user's row.
export async function updateArtistDetails(
  profileId: unknown,
  input: unknown,
): Promise<UpdateArtistDetailsResult> {
  if (profileId !== getCurrentApprentice().id) {
    return { error: "You can only edit your own profile." };
  }

  const parsed = parseArtistDetails(input);
  if (!parsed.ok) {
    return { error: "Check the highlighted fields.", fieldErrors: parsed.errors };
  }

  return { ok: true, details: parsed.details };
}
