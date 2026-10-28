import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, resolveLocale, webPageLd } from "@/lib/seo";
import HomePageClient from "./HomePageClient";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMetadata(resolveLocale((await params).locale), "home");
}

export default async function HomePage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  return (
    <>
      <JsonLd data={webPageLd(locale, "home")} />
      <HomePageClient />
    </>
  );
}
