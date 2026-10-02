import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, isLocale, localeCookie, matchAcceptLanguage } from "@/i18n/config";
import { formats } from "@/i18n/formats";

export default getRequestConfig(async () => {
  const fromCookie = (await cookies()).get(localeCookie)?.value;
  const locale = isLocale(fromCookie)
    ? fromCookie
    : (matchAcceptLanguage((await headers()).get("accept-language")) ?? defaultLocale);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    formats,
    timeZone: "UTC",
    now: new Date(),
  };
});
