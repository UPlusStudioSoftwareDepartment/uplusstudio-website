import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import GuideLinks from "@/components/GuideLinks";
import JsonLd from "@/components/seo/JsonLd";
import { guideLabels } from "@/lib/guides";
import { breadcrumbLd, buildMetadata, resolveLocale } from "@/lib/seo";

type Props = Readonly<{ params: Promise<{ locale: string }> }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  return buildMetadata({ locale, path: "/guides", title: guideLabels[locale].label, description: guideLabels[locale].description });
}

export default async function GuidesPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-32 text-ink sm:px-8 lg:px-12">
      <JsonLd data={breadcrumbLd(locale, [[guideLabels[locale].label, "/guides"]])} />
      <h1 className="font-serif text-[clamp(3rem,8vw,6rem)] leading-tight">{guideLabels[locale].label}</h1>
      <div className="mt-12"><GuideLinks locale={locale} /></div>
    </div>
  );
}
