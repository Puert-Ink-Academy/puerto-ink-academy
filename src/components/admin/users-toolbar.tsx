"use client";

import { Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { CountryFlag } from "@/components/ui/country-flag";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryName, isCountryCode } from "@/lib/countries";
import { roles, type Role } from "@/lib/roles";
import {
  isStudioFilter,
  isUserSort,
  studioFilters,
  userSorts,
  type CountryOption,
  type StudioFilter,
  type UserFilters,
  type UserSort,
} from "@/lib/user-directory";
import { cn } from "cn";

const roleChipKeys = {
  all: "all",
  APPRENTICE: "apprentices",
  TEACHER: "teachers",
  ADMIN: "admins",
} as const;

const studioKeys: Record<StudioFilter, "anyStudio" | "atStudio" | "independent"> = {
  all: "anyStudio",
  studio: "atStudio",
  independent: "independent",
};

const sortKeys: Record<UserSort, "nameAsc" | "nameDesc" | "joinedDesc" | "joinedAsc"> = {
  "name-asc": "nameAsc",
  "name-desc": "nameDesc",
  "joined-desc": "joinedDesc",
  "joined-asc": "joinedAsc",
};

const selectClass =
  "w-full border-zinc-700 data-[size=default]:h-11 bg-zinc-950/60 text-zinc-100 focus-visible:border-violet-400 focus-visible:ring-violet-400/30";

function FilterSelect({
  label,
  value,
  onValueChange,
  display,
  children,
  className,
}: {
  label: string;
  value: string;
  onValueChange: (value: unknown) => void;
  display: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger aria-label={label} className={cn(selectClass, className)}>
        <SelectValue>{() => display}</SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} className="max-h-72">
        {children}
      </SelectContent>
    </Select>
  );
}

export function UsersToolbar({
  filters,
  onChange,
  roleCounts,
  countries,
}: {
  filters: UserFilters;
  onChange: (filters: UserFilters) => void;
  roleCounts: Record<Role | "all", number>;
  countries: CountryOption[];
}) {
  const locale = useLocale();
  const t = useTranslations("Admin.Toolbar");
  const update = (patch: Partial<UserFilters>) => onChange({ ...filters, ...patch });
  const roleOptions: (Role | "all")[] = ["all", ...roles];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="relative lg:flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500"
            aria-hidden
          />
          <Input
            type="search"
            value={filters.query}
            onChange={(event) => update({ query: event.target.value })}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchLabel")}
            className="h-11 border-zinc-700 bg-zinc-950/60 pr-10 pl-9 text-zinc-100 focus-visible:border-violet-400 focus-visible:ring-violet-400/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => update({ query: "" })}
              aria-label={t("clearSearch")}
              className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-zinc-500 outline-none hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-violet-400"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 lg:flex lg:w-auto">
          <FilterSelect
            label={t("country")}
            value={filters.country}
            onValueChange={(value) => {
              if (value === "all" || isCountryCode(value)) update({ country: value });
            }}
            className="col-span-2 lg:w-52"
            display={
              filters.country === "all" ? (
                t("allCountries")
              ) : (
                <>
                  <CountryFlag code={filters.country} />
                  <span className="truncate">{countryName(filters.country, locale)}</span>
                </>
              )
            }
          >
            <SelectItem value="all" className="min-h-10">
              {t("allCountries")}
            </SelectItem>
            {countries.map(({ code, count }) => (
              <SelectItem
                key={code}
                value={code}
                label={countryName(code, locale)}
                className="min-h-10"
              >
                <CountryFlag code={code} className="self-center" />
                {countryName(code, locale)}
                <span className="text-zinc-500 tabular-nums">{count}</span>
              </SelectItem>
            ))}
          </FilterSelect>
          <FilterSelect
            label={t("studio")}
            value={filters.studio}
            onValueChange={(value) => {
              if (isStudioFilter(value)) update({ studio: value });
            }}
            className="lg:w-40"
            display={t(studioKeys[filters.studio])}
          >
            {studioFilters.map((option) => (
              <SelectItem key={option} value={option} className="min-h-10">
                {t(studioKeys[option])}
              </SelectItem>
            ))}
          </FilterSelect>
          <FilterSelect
            label={t("sort")}
            value={filters.sort}
            onValueChange={(value) => {
              if (isUserSort(value)) update({ sort: value });
            }}
            className="lg:w-40"
            display={t(sortKeys[filters.sort])}
          >
            {userSorts.map((option) => (
              <SelectItem key={option} value={option} className="min-h-10">
                {t(sortKeys[option])}
              </SelectItem>
            ))}
          </FilterSelect>
        </div>
      </div>
      <div
        role="group"
        aria-label={t("role")}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0"
      >
        {roleOptions.map((option) => {
          const active = filters.role === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => update({ role: option })}
              className={cn(
                "flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
                active
                  ? "border-violet-400/60 bg-violet-400/15 text-violet-200"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100",
              )}
            >
              {t(roleChipKeys[option])}
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs tabular-nums",
                  active ? "bg-violet-400/20 text-violet-100" : "bg-zinc-800 text-zinc-400",
                )}
              >
                {roleCounts[option]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
