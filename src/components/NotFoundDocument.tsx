import { getMessages } from "next-intl/server";
import { fontVariables } from "@/app/fonts";
import type { Locale } from "@/lib/i18n-config";
import SiteFrame from "./SiteFrame";
import LocaleNotFound from "@/app/[locale]/not-found";
import NotFoundNavigation from "./NotFoundNavigation";

export default async function NotFoundDocument({
  locale,
}: Readonly<{ locale: Locale }>) {
  const messages = await getMessages({ locale });
  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <body className="font-sans antialiased bg-paper text-ink">
        <NotFoundNavigation>
          <SiteFrame locale={locale} messages={messages}>
            <LocaleNotFound />
          </SiteFrame>
        </NotFoundNavigation>
      </body>
    </html>
  );
}
