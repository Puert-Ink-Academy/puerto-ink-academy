"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { setLocale } from "@/app/actions/locale";
import type { AppLocale } from "@/i18n/config";

export function useChangeLocale() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const changeLocale = (locale: AppLocale) =>
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });

  return { changeLocale, pending };
}
