import { countries } from "country-flag-icons";

declare const countryCodeBrand: unique symbol;

export type CountryCode = string & { readonly [countryCodeBrand]: true };

const regionNamesByLocale = new Map<string, Intl.DisplayNames>();

function regionNames(locale: string): Intl.DisplayNames {
  let names = regionNamesByLocale.get(locale);
  if (!names) {
    names = new Intl.DisplayNames([locale], { type: "region" });
    regionNamesByLocale.set(locale, names);
  }
  return names;
}

const notNationalities = new Set(["EU", "UN", "XA"]);

const knownCodes = new Set(
  countries.filter(
    (code) =>
      /^[A-Z]{2}$/.test(code) &&
      !notNationalities.has(code) &&
      regionNames("en").of(code) !== code,
  ),
);

export function isCountryCode(value: unknown): value is CountryCode {
  return typeof value === "string" && knownCodes.has(value);
}

export function countryName(code: CountryCode, locale: string): string {
  return regionNames(locale).of(code) ?? code;
}

export const countryCodes: CountryCode[] = [...knownCodes].filter(isCountryCode);

export function sortedCountryCodes(locale: string): CountryCode[] {
  const collator = new Intl.Collator(locale);
  return [...countryCodes].sort((a, b) =>
    collator.compare(countryName(a, locale), countryName(b, locale)),
  );
}

export function countryCode(value: string): CountryCode {
  if (!isCountryCode(value)) throw new Error(`Unknown country code: ${value}`);
  return value;
}
