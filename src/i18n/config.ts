export const locales = ["en-US", "de", "fr", "el"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en-US";

export const localeCookie = "NEXT_LOCALE";

export const localeNames: Record<AppLocale, string> = {
  "en-US": "English (US)",
  de: "Deutsch",
  fr: "Français",
  el: "Ελληνικά",
};

export function isLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

const languageToLocale: Record<string, AppLocale> = {
  en: "en-US",
  de: "de",
  fr: "fr",
  el: "el",
};

export function matchAcceptLanguage(header: string | null): AppLocale | undefined {
  if (!header) return undefined;

  const preferences = header
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";");
      const quality = params.find((param) => param.trim().startsWith("q="));
      return { tag: tag.toLowerCase(), q: quality ? Number(quality.trim().slice(2)) : 1 };
    })
    .filter((preference) => preference.tag && !Number.isNaN(preference.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferences) {
    const match = languageToLocale[tag.split("-")[0] ?? ""];
    if (match) return match;
  }
  return undefined;
}
