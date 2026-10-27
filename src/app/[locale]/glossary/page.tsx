import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, breadcrumbLd, localePath, pageMetadata, resolveLocale, SEO_COPY, webPageLd } from "@/lib/seo";
import type { Locale } from "@/lib/i18n-config";
import { Suspense } from "react";
import GlossaryContent from "@/components/GlossaryContent";
import { PageLoaderFull } from "@/components/ui/PageLoader";
import { getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { withNamespaces } from "@/lib/clientMessages";

type Term = { key: string; term: string; definition: string };

async function glossaryLd(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "glossary" });
  const terms = t.raw("terms") as Term[];
  const url = absoluteUrl(localePath(locale, "/glossary"));
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${url}#terms`,
    name: SEO_COPY[locale].glossary.title,
    url,
    inLanguage: locale === "en" ? "en-US" : "tr-TR",
    hasDefinedTerm: terms.map(({ key, term, definition }) => ({
      "@type": "DefinedTerm",
      "@id": `${url}#${key}`,
      name: term,
      description: definition,
      inDefinedTermSet: `${url}#terms`,
    })),
  };
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata(resolveLocale((await params).locale), "glossary");
}

export default async function Page({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  return (
    <>
      <JsonLd data={[webPageLd(locale, "glossary", "WebPage"), breadcrumbLd(locale, [[SEO_COPY[locale].glossary.crumb, "/glossary"]]), await glossaryLd(locale)]} />
      <NextIntlClientProvider locale={locale} messages={withNamespaces(await getMessages({ locale }), ["glossary"])} timeZone="Europe/Istanbul">
        <Suspense fallback={<PageLoaderFull />}>
          <GlossaryContent />
        </Suspense>
      </NextIntlClientProvider>
    </>
  );
}
