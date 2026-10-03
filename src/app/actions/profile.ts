"use server";

import { parseArtistDetails, type ArtistDetails, type ArtistDetailsErrors } from "@/lib/people/artist";
import { getCurrentApprentice } from "@/lib/auth/session";

export type ProfileActionError = "ownProfile" | "checkFields";

export type UpdateArtistDetailsResult =
  | { ok: true; details: ArtistDetails }
  | { error: ProfileActionError; fieldErrors?: ArtistDetailsErrors };

// Drizzle replaces the mock: it will save the details on the user's row.
export async function updateArtistDetails(
  profileId: unknown,
  input: unknown,
): Promise<UpdateArtistDetailsResult> {
  const apprentice = await getCurrentApprentice();
  if (profileId !== apprentice.id) {
    return { error: "ownProfile" };
  }

  const parsed = parseArtistDetails(input);
  if (!parsed.ok) {
    return { error: "checkFields", fieldErrors: parsed.errors };
  }

  return { ok: true, details: parsed.details };
}
