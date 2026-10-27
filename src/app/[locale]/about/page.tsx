import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbLd, pageMetadata, resolveLocale, SEO_COPY, webPageLd } from "@/lib/seo";
import AboutWrapper from "@/components/AboutWrapper";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata(resolveLocale((await params).locale), "about");
}

export default async function Page({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  return (
    <>
      <JsonLd data={[webPageLd(locale, "about", "AboutPage"), breadcrumbLd(locale, [[SEO_COPY[locale].about.crumb, "/about"]])]} />
      <AboutWrapper />
    </>
  );
}
