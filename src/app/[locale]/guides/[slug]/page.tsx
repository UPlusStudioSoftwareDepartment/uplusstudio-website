import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import CallCta from "@/components/studio/CallCta";
import JsonLd from "@/components/seo/JsonLd";
import { guides, getGuide, guideLabels } from "@/lib/guides";
import { locales } from "@/lib/i18n-config";
import { absoluteUrl, breadcrumbLd, buildMetadata, localePath, ORG_ID, resolveLocale } from "@/lib/seo";

type Props = Readonly<{ params: Promise<{ locale: string; slug: string }> }>;
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => guides.map(({ slug }) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const guide = getGuide(slug);
  if (!guide) return {};
  return buildMetadata({ locale, path: `/guides/${slug}`, title: guide.copy[locale].title, description: guide.copy[locale].description, type: "article" });
}

export default async function GuidePage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const guide = getGuide(slug);
  if (!guide) notFound();
  const copy = guide.copy[locale];
  const labels = guideLabels[locale];
  const next = guides.find((item) => item.slug !== slug);
  return (
    <article className="mx-auto max-w-4xl px-4 pb-24 pt-32 text-ink sm:px-8 sm:pt-40">
      <JsonLd data={[
        breadcrumbLd(locale, [[labels.label, "/guides"], [copy.title, `/guides/${slug}`]]),
        { "@context": "https://schema.org", "@type": "Article", headline: copy.title, description: copy.description, inLanguage: locale, author: { "@id": ORG_ID }, publisher: { "@id": ORG_ID }, mainEntityOfPage: absoluteUrl(localePath(locale, `/guides/${slug}`)) },
      ]} />
      <Link href={`/${locale}/guides`} className="inline-flex min-h-11 items-center text-[15px] text-mute underline underline-offset-4 hover:text-clay">← {labels.all}</Link>
      <header className="mt-8 border-b border-line pb-10">
        <p className="eyebrow text-clay">U+ Studio · {labels.label}</p>
        <h1 className="mt-5 font-serif text-[clamp(2.5rem,7vw,4.75rem)] leading-[1.05]">{copy.title}</h1>
        <p className="mt-8 text-[20px] leading-relaxed text-mute">{copy.intro}</p>
      </header>
      <div className="space-y-12 py-12">
        {copy.sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">{section.title}</h2>
            <p className="mt-5 text-[18px] leading-[1.8] text-ink/90">{section.body}</p>
            {section.points && <ul className="mt-6 list-disc space-y-3 pl-6 text-[17px] leading-relaxed text-mute">{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}
          </section>
        ))}
      </div>
      <aside className="border-y border-line py-8">
        <h2 className="text-xl">{labels.takeaway}</h2>
        <p className="mt-4 text-[18px] leading-relaxed text-mute">{copy.takeaway}</p>
      </aside>
      <section className="pt-12">
        <h2 className="font-serif text-3xl leading-tight">{labels.next}</h2>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          <CallCta className="inline-flex min-h-12 items-center border border-ink px-6 py-3 hover:bg-ink hover:text-night" />
          <Link href={`/${locale}/services/${guide.service}`} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-clay">{labels.service}</Link>
          <Link href={`/${locale}/projects/${guide.project}`} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-clay">{labels.project}</Link>
        </div>
        {next && <Link href={`/${locale}/guides/${next.slug}`} className="mt-10 block border-t border-line pt-6 text-[18px] hover:text-clay"><span className="eyebrow block pb-3 text-mute">{labels.related}</span>{next.copy[locale].title} →</Link>}
      </section>
    </article>
  );
}
