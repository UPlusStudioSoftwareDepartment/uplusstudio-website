import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CallCta from "@/components/studio/CallCta";
import { MascotDuo } from "@/components/mascots/Mascots";
import DiagramFigure from "@/components/studio/DiagramFigure";
import { ExplainerStory } from "@/components/explainers/ExplainerStory";
import JsonLd from "@/components/seo/JsonLd";
import { guides, getGuide, guideLabels, guideTaxonomy, relatedGuides } from "@/lib/guides";
import { locales } from "@/lib/i18n-config";
import { getProject } from "@/lib/projects";
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
  const project = getProject(guide.project);
  return buildMetadata({ locale, path: `/guides/${slug}`, title: guide.copy[locale].title, description: guide.copy[locale].description, type: "article", image: project ? { url: project.cover.src, alt: project.cover.alt[locale] } : undefined });
}

export default async function GuidePage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const tm = await getTranslations({ locale, namespace: "studio.mascots" });
  const guide = getGuide(slug);
  if (!guide) notFound();
  const copy = guide.copy[locale];
  const labels = guideLabels[locale];
  const project = getProject(guide.project);
  const taxonomy = guideTaxonomy[locale];
  const related = relatedGuides(guide);
  const tr = locale === "tr";
  return (
    <article className="mx-auto max-w-4xl px-4 pb-24 pt-32 text-ink sm:px-8 sm:pt-40">
      <JsonLd data={[
        breadcrumbLd(locale, [[labels.label, "/guides"], [copy.title, `/guides/${slug}`]]),
        { "@context": "https://schema.org", "@type": "Article", headline: copy.title, description: copy.description, inLanguage: locale, author: { "@id": ORG_ID }, publisher: { "@id": ORG_ID }, mainEntityOfPage: absoluteUrl(localePath(locale, `/guides/${slug}`)), ...(project ? { image: absoluteUrl(project.cover.src) } : {}) },
      ]} />
      <Link href={`/${locale}/guides`} className="inline-flex min-h-11 items-center text-[15px] text-mute underline underline-offset-4 hover:text-clay">← {labels.all}</Link>
      <header className="mt-8 border-b border-line pb-10">
        <p className="eyebrow text-clay">U+ Studio · {labels.label}</p>
        <h1 className="mt-5 font-serif text-[clamp(2.5rem,7vw,4.75rem)] leading-[1.05]">{copy.title}</h1>
        <p className="mt-8 text-[20px] leading-relaxed text-mute">{copy.intro}</p>
        <div className="mt-8">
          <h2 className="eyebrow text-mute">{taxonomy.readers}</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-ink/85">{guide.audiences.map((key) => taxonomy.audiences[key]).join(" · ")}</p>
        </div>
      </header>
      {project && <figure className="mt-10">
        <Link href={`/${locale}/projects/${project.slug}`} className="block">
          <div className="relative aspect-[3/2] overflow-hidden bg-paper-2">
            <Image src={project.cover.src} alt={project.cover.alt[locale]} fill sizes="(min-width: 896px) 832px, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-3 text-sm leading-relaxed text-mute">{locale === "tr" ? "İlgili U+ Studio projesini inceleyin" : "Explore the related U+ Studio project"}: {project.title[locale]} →</figcaption>
        </Link>
      </figure>}
      {guide.diagram && (
        <DiagramFigure
          src={guide.diagram.src}
          alt={guide.diagram.caption[locale]}
          caption={guide.diagram.caption[locale]}
          items={guide.diagram.items[locale]}
          locale={locale}
          numbered={guide.diagram.numbered}
          className="mt-10 border-t border-line pt-8"
        />
      )}
      {guide.explainers && (
        <div className="mt-12">
          <ExplainerStory ids={guide.explainers} locale={locale} stacked />
        </div>
      )}
      <div className="space-y-12 py-12">
        {copy.sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">{section.title}</h2>
            <p className="mt-5 text-[18px] leading-[1.8] text-ink/90">{section.body}</p>
            {section.points && <ul className="mt-6 list-disc space-y-3 pl-6 text-[17px] leading-relaxed text-mute">{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}
          </section>
        ))}
      </div>
      {copy.faq && (
        <section aria-labelledby="guide-faq" className="border-t border-line py-12">
          <h2 id="guide-faq" className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">{taxonomy.faq}</h2>
          <dl className="mt-8 space-y-8">
            {copy.faq.map(([question, answer]) => (
              <div key={question}>
                <dt className="text-[19px] leading-snug text-ink">{question}</dt>
                <dd className="mt-3 text-[17px] leading-relaxed text-mute">{answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      {guide.links && (
        <section aria-labelledby="guide-links" className="border-t border-line py-12">
          <h2 id="guide-links" className="font-serif text-[clamp(1.5rem,3.4vw,2.1rem)] leading-tight">{tr ? "Resmî kaynaklar ve sorgu sayfaları" : "Official sources and query pages"}</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-mute">
            {tr
              ? "Mevzuatın güncel metnine ve belediyenin kendi sayfalarına buradan ulaşabilirsiniz. Bazı sorgular e-Devlet girişi ister; parselinize özgü bilgi bu sayfalardan teyit edilmelidir."
              : "Open the current text of the regulations and the municipality's own pages here. Some queries require an e-Devlet login; parcel-specific information should be confirmed on these pages."}
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {guide.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 border border-ink/60 px-4 py-2 text-[15px] transition-colors hover:border-clay hover:text-clay">
                  {link.label[locale]}
                  <span aria-hidden>↗</span>
                  <span className="sr-only">{tr ? "(yeni sekmede açılır)" : "(opens in a new tab)"}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      <aside className="border-y border-line py-8">
        <h2 className="text-xl">{labels.takeaway}</h2>
        <p className="mt-4 text-[18px] leading-relaxed text-mute">{copy.takeaway}</p>
      </aside>
      <section className="pt-12">
        <MascotDuo pose="wave" size="sm" message={tm("guide")} className="mb-8" />
        <h2 className="font-serif text-3xl leading-tight">{labels.next}</h2>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          <CallCta className="inline-flex min-h-12 items-center border border-ink px-6 py-3 hover:bg-ink hover:text-night" />
          <Link href={`/${locale}/services/${guide.service}`} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-clay">{labels.service}</Link>
          <Link href={`/${locale}/projects/${guide.project}`} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-clay">{labels.project}</Link>
        </div>
        {related.length > 0 && (
          <nav aria-labelledby="guide-related" className="mt-10 border-t border-line pt-6">
            <h2 id="guide-related" className="eyebrow text-mute">{labels.related}</h2>
            <ul className="mt-4 divide-y divide-line">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/${locale}/guides/${item.slug}`} className="block py-4 text-[18px] leading-snug hover:text-clay">{item.copy[locale].title} →</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </section>
    </article>
  );
}
