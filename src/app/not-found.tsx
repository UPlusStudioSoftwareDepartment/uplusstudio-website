import type { Metadata, Viewport } from "next";
import { defaultLocale } from "@/lib/i18n-config";
import NotFoundDocument from "@/components/NotFoundDocument";

export const metadata: Metadata = { robots: { index: false, follow: true } };
export const viewport: Viewport = { themeColor: "#121110" };

// Keep the render boundary static; unmatched localized URLs use global-not-found.
export default function NotFound() {
  return <NotFoundDocument locale={defaultLocale} />;
}
