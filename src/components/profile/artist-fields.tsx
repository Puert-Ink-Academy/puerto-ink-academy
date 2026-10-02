"use client";

import { useLocale, useTranslations } from "next-intl";
import { useId, type ReactNode } from "react";

import { CountryFlag } from "@/components/ui/country-flag";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sectionLabelVariants } from "@/components/ui/section-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ARTIST_NAME_MAX_LENGTH,
  STUDIO_MAX_LENGTH,
  type ArtistDetailsErrors,
  type ArtistDetailsInput,
  type ArtistFieldError,
} from "@/lib/artist";
import { countryName, isCountryCode, sortedCountryCodes } from "@/lib/countries";
import { cn } from "cn";

const accentFields = {
  amber: "focus-visible:border-amber-400 focus-visible:ring-amber-400/30",
  violet: "focus-visible:border-violet-400 focus-visible:ring-violet-400/30",
} as const;

function FieldLabel({
  htmlFor,
  optional,
  optionalLabel,
  children,
}: {
  htmlFor: string;
  optional?: boolean;
  optionalLabel?: string;
  children: ReactNode;
}) {
  return (
    <Label htmlFor={htmlFor} className={sectionLabelVariants()}>
      {children}
      {optional && (
        <span className="font-normal tracking-normal text-zinc-500 normal-case">{optionalLabel}</span>
      )}
    </Label>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-rose-400">
      {message}
    </p>
  );
}

export function ArtistFields({
  value,
  onChange,
  errors,
  accent,
}: {
  value: ArtistDetailsInput;
  onChange: (value: ArtistDetailsInput) => void;
  errors: ArtistDetailsErrors;
  accent: keyof typeof accentFields;
}) {
  const baseId = useId();
  const locale = useLocale();
  const t = useTranslations("Profile.Edit");
  const fieldError = (field: keyof ArtistDetailsInput, code?: ArtistFieldError) => {
    if (!code) return undefined;
    if (code === "tooLong") {
      return t("tooLong", {
        max: field === "studio" ? STUDIO_MAX_LENGTH : ARTIST_NAME_MAX_LENGTH,
      });
    }
    return t("chooseNationality");
  };
  const id = (field: keyof ArtistDetailsInput) => `${baseId}-${field}`;
  const errorId = (field: keyof ArtistDetailsInput) => `${id(field)}-error`;
  const fieldClass = cn(
    "h-11 border-zinc-700 bg-zinc-950/60 text-zinc-100",
    accentFields[accent],
  );
  const update = (field: keyof ArtistDetailsInput, next: string) =>
    onChange({ ...value, [field]: next });

  return (
    <>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={id("artistName")} optional optionalLabel={t("optional")}>
          {t("artistName")}
        </FieldLabel>
        <Input
          id={id("artistName")}
          autoComplete="off"
          maxLength={ARTIST_NAME_MAX_LENGTH}
          value={value.artistName}
          onChange={(event) => update("artistName", event.target.value)}
          placeholder={t("artistPlaceholder")}
          aria-invalid={errors.artistName ? true : undefined}
          aria-describedby={errors.artistName ? errorId("artistName") : undefined}
          className={fieldClass}
        />
        <FieldError id={errorId("artistName")} message={fieldError("artistName", errors.artistName)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={id("studio")} optional optionalLabel={t("optional")}>
          {t("studio")}
        </FieldLabel>
        <Input
          id={id("studio")}
          autoComplete="off"
          maxLength={STUDIO_MAX_LENGTH}
          value={value.studio}
          onChange={(event) => update("studio", event.target.value)}
          placeholder={t("studioPlaceholder")}
          aria-invalid={errors.studio ? true : undefined}
          aria-describedby={errors.studio ? errorId("studio") : undefined}
          className={fieldClass}
        />
        <FieldError id={errorId("studio")} message={fieldError("studio", errors.studio)} />
      </div>
      <div className="flex flex-col gap-2">
        <FieldLabel htmlFor={id("nationality")}>{t("nationality")}</FieldLabel>
        <Select
          value={isCountryCode(value.nationality) ? value.nationality : null}
          onValueChange={(next) => {
            if (isCountryCode(next)) update("nationality", next);
          }}
        >
          <SelectTrigger
            id={id("nationality")}
            aria-invalid={errors.nationality ? true : undefined}
            aria-describedby={errors.nationality ? errorId("nationality") : undefined}
            className={cn(fieldClass, "w-full data-[size=default]:h-11")}
          >
            <SelectValue>
              {(selected: unknown) =>
                isCountryCode(selected) ? (
                  <>
                    <CountryFlag code={selected} />
                    {countryName(selected, locale)}
                  </>
                ) : (
                  <span className="text-zinc-500">{t("chooseCountry")}</span>
                )
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} className="max-h-72">
            {sortedCountryCodes(locale).map((code) => (
              <SelectItem
                key={code}
                value={code}
                label={countryName(code, locale)}
                className="min-h-10"
              >
                <CountryFlag code={code} className="self-center" />
                {countryName(code, locale)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError
          id={errorId("nationality")}
          message={fieldError("nationality", errors.nationality)}
        />
      </div>
    </>
  );
}
