import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { sharedMessages } from "@/lib/clientMessages";
import MotionProvider from "@/components/MotionProvider";
import Navigation from "@/components/NavigationOptimized";
import { SkipToContent } from "@/components/SkipToContent";
import { ToastProvider } from "@/contexts/ToastContext";
import ArchitecturalBackdrop from "@/components/studio/ArchitecturalBackdrop";
import SiteFooter from "@/components/studio/SiteFooter";
import { SERVICE_LANDINGS } from "@/lib/serviceLandings";

// Providers plus header, main and footer; shared by the locale layout and the root 404, which sits outside it.
export default function SiteFrame({
  locale,
  messages,
  bare = false,
  children,
}: Readonly<{ locale: string; messages: AbstractIntlMessages; bare?: boolean; children: React.ReactNode }>) {
  const services = SERVICE_LANDINGS.map(({ slug, copy }) => ({
    slug,
    label: copy[locale === "en" ? "en" : "tr"].crumb,
  }));
  return (
    <MotionProvider>
      <NextIntlClientProvider locale={locale} messages={sharedMessages(messages)} timeZone="Europe/Istanbul">
        <ToastProvider>
          {bare ? (
            children
          ) : (
            <>
              <SkipToContent />
              <ArchitecturalBackdrop />
              <Navigation />
              <main id="main-content" tabIndex={-1} className="relative outline-none no-scrollbar">{children}</main>
              <SiteFooter services={services} />
            </>
          )}
        </ToastProvider>
      </NextIntlClientProvider>
    </MotionProvider>
  );
}
