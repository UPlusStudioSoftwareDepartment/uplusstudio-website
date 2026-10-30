import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocaleSupported, locales } from "@/lib/i18n-config";
import { isInMaintenance } from "@/lib/app-config";
import { siteGraph } from "@/lib/seo";
import { fontVariables } from "@/app/fonts";
import JsonLd from "@/components/seo/JsonLd";
import Telemetry from "@/components/Telemetry";
import HeadOrphans from "@/components/HeadOrphans";
import SiteFrame from "@/components/SiteFrame";

const CURTAIN_BOOT = `try{var r=document.documentElement;if(sessionStorage.getItem("u-curtain")==="1"){r.dataset.curtainSeen=""}else if(/^\\/(tr|en)\\/?$/.test(location.pathname)&&!matchMedia("(prefers-reduced-motion: reduce)").matches){r.dataset.curtain="";setTimeout(function(){delete r.dataset.curtain},4000)}}catch(e){}`;

// Scroll reveals start hidden in the HTML (framer's initial styles); without JavaScript they would never run, so show their end state.
const NO_JS_REVEALS = `main [style*="opacity:0;"]:not(g),main [style="opacity:0"]:not(g){opacity:1!important;transform:none!important}main [style*="translateY(105%)"],main [style*="scale(1.12)"]{transform:none!important}main [style*="clip-path:inset("]{clip-path:none!important}`;

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
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#121110" />
        <script dangerouslySetInnerHTML={{ __html: CURTAIN_BOOT }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: NO_JS_REVEALS }} />
        </noscript>
        <JsonLd data={siteGraph(locale)} />
      </head>
      <body className="font-sans antialiased bg-paper text-ink">
        <SiteFrame locale={locale} messages={messages} bare={isInMaintenance}>
          {children}
        </SiteFrame>
        <Telemetry />
        <HeadOrphans />
      </body>
    </html>
  );
}
