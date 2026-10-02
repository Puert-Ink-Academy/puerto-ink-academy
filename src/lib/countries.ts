import { countries } from "country-flag-icons";

declare const countryCodeBrand: unique symbol;

export type CountryCode = string & { readonly [countryCodeBrand]: true };

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const notNationalities = new Set(["EU", "UN", "XA"]);

const knownCodes = new Set(
  countries.filter(
    (code) =>
      /^[A-Z]{2}$/.test(code) && !notNationalities.has(code) && regionNames.of(code) !== code,
  ),
);

export function isCountryCode(value: unknown): value is CountryCode {
  return typeof value === "string" && knownCodes.has(value);
}

export function countryName(code: CountryCode): string {
  return regionNames.of(code) ?? code;
}

export const countryCodes: CountryCode[] = [...knownCodes]
  .filter(isCountryCode)
  .sort((a, b) => countryName(a).localeCompare(countryName(b)));

export function countryCode(value: string): CountryCode {
  if (!isCountryCode(value)) throw new Error(`Unknown country code: ${value}`);
  return value;
}
