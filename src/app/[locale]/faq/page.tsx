import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd, pageMetadata, resolveLocale, SEO_COPY, webPageLd } from "@/lib/seo";
import type { Locale } from "@/lib/i18n-config";
import FAQContent from "@/components/FAQContent";
import { getTranslations } from "next-intl/server";

type QA = { q: string; a: string };

async function faqLd(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "faq" });
  const groups = t.raw("questions") as Record<string, QA[]>;
  return {
    ...webPageLd(locale, "faq", "FAQPage"),
    mainEntity: Object.values(groups)
      .flat()
      .map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata(resolveLocale((await params).locale), "faq");
}

export default async function Page({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  return (
    <>
      <JsonLd data={[breadcrumbLd(locale, [[SEO_COPY[locale].faq.crumb, "/faq"]]), await faqLd(locale)]} />
      <FAQContent />
    </>
  );
}
