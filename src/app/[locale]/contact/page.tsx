import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd, pageMetadata, resolveLocale, SEO_COPY, webPageLd } from "@/lib/seo";
import ContactContent from "@/components/ContactContent";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata(resolveLocale((await params).locale), "contact");
}

export default async function Page({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  return (
    <>
      <JsonLd data={[webPageLd(locale, "contact", "ContactPage"), breadcrumbLd(locale, [[SEO_COPY[locale].contact.crumb, "/contact"]])]} />
      <ContactContent />
    </>
  );
}
