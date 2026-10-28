import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, breadcrumbLd, localePath, pageMetadata, resolveLocale, SEO_COPY, webPageLd } from "@/lib/seo";
import type { Locale } from "@/lib/i18n-config";
import GlossaryContent from "@/components/GlossaryContent";
import GlossaryList from "@/components/GlossaryList";
import { glossaryIndex, type Term } from "@/lib/glossary";
import { sharedMessages } from "@/lib/clientMessages";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

function glossaryLd(locale: Locale, terms: Term[]) {
  const url = absoluteUrl(localePath(locale, "/glossary"));
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${url}#terms`,
    name: SEO_COPY[locale].glossary.title,
    url,
    inLanguage: locale === "en" ? "en-US" : "tr-TR",
    hasDefinedTerm: terms.map(({ key, term }) => ({ "@type": "DefinedTerm", "@id": `${url}#${key}`, name: term })),
  };
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata(resolveLocale((await params).locale), "glossary");
}

export default async function Page({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const { terms, ...glossaryUi } = messages.glossary as Record<string, unknown> & { terms: Term[] };
  const { total, sections, counts, alphabet } = glossaryIndex(terms, locale);
  return (
    <>
      <JsonLd data={[webPageLd(locale, "glossary", "WebPage"), breadcrumbLd(locale, [[SEO_COPY[locale].glossary.crumb, "/glossary"]]), glossaryLd(locale, terms)]} />
      <NextIntlClientProvider locale={locale} messages={{ ...sharedMessages(messages), glossary: glossaryUi }} timeZone="Europe/Istanbul">
        <GlossaryContent total={total} counts={counts} alphabet={alphabet}>
          <GlossaryList sections={sections} counts={counts} />
        </GlossaryContent>
      </NextIntlClientProvider>
    </>
  );
}
