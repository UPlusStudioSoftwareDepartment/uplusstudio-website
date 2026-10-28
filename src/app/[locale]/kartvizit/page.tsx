import type { Metadata } from "next";
import { resolveLocale } from "@/lib/seo";
import BusinessCardPage from "@/components/BusinessCardPage";
import { setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const title = locale === "en" ? "Digital business card" : "Dijital kartvizit";
  const description =
    locale === "en"
      ? "U+ Studio — Architecture & Interior Architecture & Engineering · İncek, Gölbaşı / Ankara. Call, WhatsApp, directions and booking."
      : "U+ Studio — Mimarlık & İç Mimarlık & Mühendislik · İncek, Gölbaşı / Ankara. Arayın, WhatsApp'tan yazın, yol tarifi alın, randevu planlayın.";
  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: { title: `U+ Studio | ${title}`, description, type: "profile", siteName: "U+ Studio" },
    twitter: { card: "summary_large_image", title: `U+ Studio | ${title}`, description },
  };
}

export default async function Page({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  return <BusinessCardPage locale={locale} />;
}
