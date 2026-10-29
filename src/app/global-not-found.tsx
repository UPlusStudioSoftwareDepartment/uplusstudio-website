import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { defaultLocale, isLocaleSupported } from "@/lib/i18n-config";
import NotFoundDocument from "@/components/NotFoundDocument";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 | U+ Studio",
  robots: { index: false, follow: true },
};

export const viewport: Viewport = { themeColor: "#121110" };

// Routing-level 404s bypass layouts, so reading the locale here does not make real pages dynamic.
export default async function GlobalNotFound() {
  const requestedLocale = (await headers()).get("X-NEXT-INTL-LOCALE") ?? "";
  const locale = isLocaleSupported(requestedLocale)
    ? requestedLocale
    : defaultLocale;
  return <NotFoundDocument locale={locale} />;
}
