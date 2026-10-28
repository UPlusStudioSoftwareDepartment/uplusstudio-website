import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, resolveLocale, webPageLd } from "@/lib/seo";
import { projectVideoLd } from "@/lib/seo-projects";
import { getProject } from "@/lib/projects";
import HomeHero from "@/components/home/HomeHero";
import HomeStudio from "@/components/home/HomeStudio";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata(resolveLocale((await params).locale), "home");
}

export default async function HomePage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const villa = getProject("villa-donusumu");
  const video = villa?.video ? [{ "@context": "https://schema.org", ...projectVideoLd(locale, villa, villa.video) }] : [];
  return (
    <>
      <JsonLd data={[webPageLd(locale, "home"), ...video]} />
      <HomeHero />
      <HomeStudio locale={locale} />
    </>
  );
}
