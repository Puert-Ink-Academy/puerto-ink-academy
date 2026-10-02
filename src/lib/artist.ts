import { isCountryCode, type CountryCode } from "@/lib/countries";

export const ARTIST_NAME_MAX_LENGTH = 40;
export const STUDIO_MAX_LENGTH = 60;

export type ArtistDetails = {
  artistName?: string;
  studio?: string;
  nationality: CountryCode;
};

export type ArtistDetailsInput = {
  artistName: string;
  studio: string;
  nationality: string;
};

export type ArtistDetailsErrors = Partial<Record<keyof ArtistDetailsInput, string>>;

export type ParsedArtistDetails =
  | { ok: true; details: ArtistDetails }
  | { ok: false; errors: ArtistDetailsErrors };

export function artistDetailsInput(details: Partial<ArtistDetails>): ArtistDetailsInput {
  return {
    artistName: details.artistName ?? "",
    studio: details.studio ?? "",
    nationality: details.nationality ?? "",
  };
}

function readText(input: unknown, key: keyof ArtistDetailsInput): string {
  if (typeof input !== "object" || input === null) return "";
  const value: unknown = (input as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : "";
}

export function parseArtistDetails(input: unknown): ParsedArtistDetails {
  const artistName = readText(input, "artistName");
  const studio = readText(input, "studio");
  const nationality = readText(input, "nationality");
  const errors: ArtistDetailsErrors = {};

  if (artistName.length > ARTIST_NAME_MAX_LENGTH) {
    errors.artistName = `Keep it under ${ARTIST_NAME_MAX_LENGTH} characters.`;
  }
  if (studio.length > STUDIO_MAX_LENGTH) {
    errors.studio = `Keep it under ${STUDIO_MAX_LENGTH} characters.`;
  }
  if (!isCountryCode(nationality)) {
    errors.nationality = "Choose a nationality.";
  }

  if (errors.artistName || errors.studio || !isCountryCode(nationality)) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    details: {
      artistName: artistName || undefined,
      studio: studio || undefined,
      nationality,
    },
  };
}
