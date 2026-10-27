import "@/app/globals.css";
export { metadata } from "./metadata";
import { Hanken_Grotesk, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import MaintenancePage from "@/components/MaintenancePage";
import { isInMaintenance } from "@/lib/app-config";
import { getLocale } from "next-intl/server";
import { defaultLocale, isLocaleSupported, type Locale } from "@/lib/i18n-config";
import { siteGraph } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

const sans = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-family",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif-family",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono-family",
  weight: ["400", "500"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requested = await getLocale();
  const locale: Locale = isLocaleSupported(requested) ? requested : defaultLocale;
  return (
    <html
      lang={locale}
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        <meta name="theme-color" content="#121110" />
        <JsonLd data={siteGraph(locale)} />
      </head>
      <body className="font-sans antialiased bg-paper text-ink">
        {isInMaintenance ? <MaintenancePage /> : children}
      </body>
    </html>
  );
}
