import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

import { locales } from "../constants";
import { Locale, ActiveLanguage } from "../types";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const supportedLocale = locales.includes(locale as Locale) ? locale : ActiveLanguage.UK;

  if (!supportedLocale) {
    notFound();
  }

  return {
    locale: supportedLocale,
    messages: (await import(`./messages/${supportedLocale}.json`)).default,
  };
});
