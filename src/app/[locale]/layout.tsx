import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { sharedMessages } from "@/lib/clientMessages";
import { notFound } from "next/navigation";
import { isLocaleSupported, locales } from "@/lib/i18n-config";
import { isInMaintenance } from "@/lib/app-config";
import { siteGraph } from "@/lib/seo";
import { fontVariables } from "@/app/fonts";
import JsonLd from "@/components/seo/JsonLd";
import MaintenancePage from "@/components/MaintenancePage";
import SetPageScrollBackground from "@/components/SetPageScrollBackground";
import Navigation from "@/components/NavigationOptimized";
import { SkipToContent } from "@/components/SkipToContent";
import { ToastProvider } from "@/contexts/ToastContext";
import { AppointmentProvider } from "@/contexts/AppointmentContext";
import ArchitecturalBackdrop from "@/components/studio/ArchitecturalBackdrop";
import SiteFooter from "@/components/studio/SiteFooter";

const CURTAIN_BOOT = `if(!matchMedia("(prefers-reduced-motion: reduce)").matches){var r=document.documentElement;r.dataset.curtain="";setTimeout(function(){delete r.dataset.curtain},4000)}`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocaleSupported(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta name="theme-color" content="#121110" />
        <script dangerouslySetInnerHTML={{ __html: CURTAIN_BOOT }} />
        <JsonLd data={siteGraph(locale)} />
      </head>
      <body className="font-sans antialiased bg-paper text-ink">
        {isInMaintenance ? (
          <MaintenancePage />
        ) : (
          <NextIntlClientProvider locale={locale} messages={sharedMessages(messages)} timeZone="Europe/Istanbul">
            <ToastProvider>
              <AppointmentProvider>
                <SetPageScrollBackground />
                <SkipToContent />
                <ArchitecturalBackdrop />
                <Navigation />
                <main id="main-content" tabIndex={-1} className="relative outline-none">{children}</main>
                <SiteFooter />
              </AppointmentProvider>
            </ToastProvider>
          </NextIntlClientProvider>
        )}
      </body>
    </html>
  );
}
