import { getLocale, getMessages } from "next-intl/server";
import { fontVariables } from "@/app/fonts";
import SiteFrame from "@/components/SiteFrame";
import LocaleNotFound from "./[locale]/not-found";

// Every unknown address ends here (React boundaries don't catch notFound() during server rendering),
// so this page carries the full site frame itself, in the language of the requested path.
export default async function NotFound() {
  const locale = await getLocale();
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#121110" />
      </head>
      <body className="font-sans antialiased bg-paper text-ink">
        <SiteFrame locale={locale} messages={messages}>
          <LocaleNotFound />
        </SiteFrame>
      </body>
    </html>
  );
}
