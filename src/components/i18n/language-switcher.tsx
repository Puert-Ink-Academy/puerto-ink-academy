"use client";

import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { useChangeLocale } from "@/components/i18n/use-change-locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isLocale, localeNames, locales } from "@/i18n/config";
import { cn } from "cn";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("Common");
  const locale = useLocale();
  const { changeLocale, pending } = useChangeLocale();

  return (
    <Select
      value={locale}
      onValueChange={(next) => {
        if (isLocale(next) && next !== locale) changeLocale(next);
      }}
    >
      <SelectTrigger
        aria-label={t("language")}
        disabled={pending}
        className={cn(
          "h-9 gap-2 border-zinc-800 bg-zinc-900/60 px-3 text-sm text-zinc-300 hover:text-zinc-50 focus-visible:border-amber-400 focus-visible:ring-amber-400/30",
          className,
        )}
      >
        <Globe className="size-4 text-zinc-500" aria-hidden />
        <SelectValue>{() => localeNames[locale]}</SelectValue>
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="end">
        {locales.map((option) => (
          <SelectItem key={option} value={option} lang={option} className="min-h-10">
            {localeNames[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
