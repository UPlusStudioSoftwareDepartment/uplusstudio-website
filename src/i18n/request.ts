import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "../lib/i18n-config";

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const requested = locale ?? (await requestLocale);
  const validLocale: Locale =
    requested && locales.includes(requested as Locale) ? (requested as Locale) : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}.ts`)).default,
  };
});
