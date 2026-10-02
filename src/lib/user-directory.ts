import { countryName, type CountryCode } from "@/lib/countries";
import type { PlatformUser } from "@/lib/mock/admin-users";
import { roles, type Role } from "@/lib/roles";

export const studioFilters = ["all", "studio", "independent"] as const;
export type StudioFilter = (typeof studioFilters)[number];

export const userSorts = ["name-asc", "name-desc", "joined-desc", "joined-asc"] as const;
export type UserSort = (typeof userSorts)[number];

export type UserFilters = {
  query: string;
  role: Role | "all";
  country: CountryCode | "all";
  studio: StudioFilter;
  sort: UserSort;
};

export const defaultUserFilters: UserFilters = {
  query: "",
  role: "all",
  country: "all",
  studio: "all",
  sort: "name-asc",
};

export function isStudioFilter(value: unknown): value is StudioFilter {
  return typeof value === "string" && (studioFilters as readonly string[]).includes(value);
}

export function isUserSort(value: unknown): value is UserSort {
  return typeof value === "string" && (userSorts as readonly string[]).includes(value);
}

export function hasActiveFilters(filters: UserFilters): boolean {
  return (
    filters.query.trim() !== "" ||
    filters.role !== "all" ||
    filters.country !== "all" ||
    filters.studio !== "all"
  );
}

function normalize(text: string): string {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function matchesQuery(user: PlatformUser, query: string, locale: string): boolean {
  const needle = normalize(query.trim());
  if (!needle) return true;

  const haystack = [
    user.name,
    user.email,
    user.artistName,
    user.studio,
    user.nationality && countryName(user.nationality, locale),
  ];
  return haystack.some((value) => value !== undefined && normalize(value).includes(needle));
}

function matchesStudio(user: PlatformUser, studio: StudioFilter): boolean {
  if (studio === "studio") return user.studio !== undefined;
  if (studio === "independent") return user.studio === undefined;
  return true;
}

function matches(user: PlatformUser, filters: UserFilters, locale: string): boolean {
  return (
    matchesQuery(user, filters.query, locale) &&
    (filters.role === "all" || user.role === filters.role) &&
    (filters.country === "all" || user.nationality === filters.country) &&
    matchesStudio(user, filters.studio)
  );
}

export function filterUsers(
  users: PlatformUser[],
  filters: UserFilters,
  locale: string,
): PlatformUser[] {
  const collator = new Intl.Collator(locale, { sensitivity: "base" });
  const byName = (a: PlatformUser, b: PlatformUser) => collator.compare(a.name, b.name);

  return users
    .filter((user) => matches(user, filters, locale))
    .sort((a, b) => {
      switch (filters.sort) {
        case "name-desc":
          return byName(b, a);
        case "joined-desc":
          return b.joinedAt.localeCompare(a.joinedAt) || byName(a, b);
        case "joined-asc":
          return a.joinedAt.localeCompare(b.joinedAt) || byName(a, b);
        default:
          return byName(a, b);
      }
    });
}

export function roleCounts(
  users: PlatformUser[],
  filters: UserFilters,
  locale: string,
): Record<Role | "all", number> {
  const pool = users.filter((user) => matches(user, { ...filters, role: "all" }, locale));
  const counts: Record<Role | "all", number> = { all: pool.length, APPRENTICE: 0, TEACHER: 0, ADMIN: 0 };
  for (const role of roles) {
    counts[role] = pool.filter((user) => user.role === role).length;
  }
  return counts;
}

export type CountryOption = { code: CountryCode; count: number };

export function countryOptions(users: PlatformUser[], locale: string): CountryOption[] {
  const counts = new Map<CountryCode, number>();
  for (const user of users) {
    if (user.nationality) counts.set(user.nationality, (counts.get(user.nationality) ?? 0) + 1);
  }
  const collator = new Intl.Collator(locale);
  return [...counts]
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => collator.compare(countryName(a.code, locale), countryName(b.code, locale)));
}
