import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { sharedMessages } from "@/lib/clientMessages";
import { notFound } from "next/navigation";
import { isLocaleSupported } from "@/lib/i18n-config";
import SetDocumentLocale from "@/components/SetDocumentLocale";
import SetPageScrollBackground from "@/components/SetPageScrollBackground";
import Navigation from "@/components/NavigationOptimized";
import { SkipToContent } from "@/components/SkipToContent";
import { ToastProvider } from "@/contexts/ToastContext";
import { AppointmentProvider } from "@/contexts/AppointmentContext";
import ArchitecturalBackdrop from "@/components/studio/ArchitecturalBackdrop";
import SiteFooter from "@/components/studio/SiteFooter";

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

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={sharedMessages(messages)} timeZone="Europe/Istanbul">
      <ToastProvider>
        <AppointmentProvider>
          <SetDocumentLocale />
          <SetPageScrollBackground />
          <SkipToContent />
          <ArchitecturalBackdrop />
          <Navigation />
          <main id="main-content" tabIndex={-1} className="relative outline-none">{children}</main>
          <SiteFooter />
        </AppointmentProvider>
      </ToastProvider>
    </NextIntlClientProvider>
  );
}
