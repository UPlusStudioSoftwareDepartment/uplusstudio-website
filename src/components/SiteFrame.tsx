import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { sharedMessages } from "@/lib/clientMessages";
import MotionProvider from "@/components/MotionProvider";
import Navigation from "@/components/NavigationOptimized";
import { SkipToContent } from "@/components/SkipToContent";
import { ToastProvider } from "@/contexts/ToastContext";
import { AppointmentProvider } from "@/contexts/AppointmentContext";
import ArchitecturalBackdrop from "@/components/studio/ArchitecturalBackdrop";
import SiteFooter from "@/components/studio/SiteFooter";

// Providers plus header, main and footer; shared by the locale layout and the root 404, which sits outside it.
export default function SiteFrame({
  locale,
  messages,
  bare = false,
  children,
}: Readonly<{ locale: string; messages: AbstractIntlMessages; bare?: boolean; children: React.ReactNode }>) {
  return (
    <MotionProvider>
      <NextIntlClientProvider locale={locale} messages={sharedMessages(messages)} timeZone="Europe/Istanbul">
        <ToastProvider>
          <AppointmentProvider>
            {bare ? (
              children
            ) : (
              <>
                <SkipToContent />
                <ArchitecturalBackdrop />
                <Navigation />
                <main id="main-content" tabIndex={-1} className="relative outline-none">{children}</main>
                <SiteFooter />
              </>
            )}
          </AppointmentProvider>
        </ToastProvider>
      </NextIntlClientProvider>
    </MotionProvider>
  );
}
