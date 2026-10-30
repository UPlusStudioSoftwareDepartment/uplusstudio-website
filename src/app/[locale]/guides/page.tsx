import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MascotDuo } from "@/components/mascots/Mascots";
import JsonLd from "@/components/seo/JsonLd";
import PageHeader from "@/components/studio/PageHeader";
import CallCta from "@/components/studio/CallCta";
import MotionReel from "@/components/studio/MotionReel";
import { ExplainerCards } from "@/components/explainers/ExplainerStory";
import { ExplainerScene } from "@/components/explainers/ExplainerScenes";
import PlayWhenVisible from "@/components/explainers/PlayWhenVisible";
import GuideLibrary from "@/components/GuideLibrary";
import { GUIDE_AUDIENCES, GUIDE_TOPICS, guideLabels, guides, guideTaxonomy, type StudioGuide } from "@/lib/guides";
import type { Locale } from "@/lib/i18n-config";
import { absoluteUrl, breadcrumbLd, buildMetadata, localePath, resolveLocale } from "@/lib/seo";

type Props = Readonly<{ params: Promise<{ locale: string }> }>;

const FEATURED = "ankara-ev-yaptirma-adim-adim";

const COPY = {
  tr: {
    title: ["Projenize", "*başlamadan önce.*"],
    meta: { guides: "Rehber", drawings: "Hareketli çizim", language: "Dil" },
    featured: "Öne çıkan rehber",
    minutes: "dk okuma",
    drawingsEyebrow: "Altı resimde mimarlık",
    drawingsTitle: "Kavramları önce resimle görün.",
    drawingsIntro: "İmar, zemin, iklim, projeler, izinler ve tadilat. Her biri tek bir hareketli çizim ve günlük hayattan bir benzetmeyle.",
    drawingsLink: "Rehberde okuyun",
    pathsEyebrow: "Nereden başlamalı?",
    pathsTitle: "Durumunuza göre bir rehber seçin.",
    paths: [
      ["Henüz araştırıyorum, mimarla ilk kez konuşacağım", "ilk-mimarlik-gorusmesi"],
      ["Birkaç teklif aldım, nasıl karşılaştıracağımı bilmiyorum", "mimari-teklif-karsilastirma"],
      ["Bütçemi kalemlere ayırmak istiyorum", "mimarlik-ucreti-ve-butce"],
      ["Arsam var, kaç daire çıkacağını merak ediyorum", "arsaya-kac-daire-sigar"],
      ["Ruhsat sürecinin adımlarını öğrenmek istiyorum", "ankara-yapi-ruhsati-sureci"],
      ["Evimin iç mekânını yeniden tasarlamak istiyorum", "ic-mekan-tasarimina-nasil-baslanir"],
      ["Mevcut evimi yenilemeye hazırlanıyorum", "ankara-ev-yenileme-hazirlik"],
      ["Mutfakla salonu birleştirmek istiyorum", "mutfak-salon-birlestirme"],
      ["Eski bir villa almayı düşünüyorum", "villa-almadan-once-tadilat-fizibilitesi"],
      ["Emlak danışmanıyım, portföyümü daha iyi sunmak istiyorum", "emlak-danismanlari-satisa-hazirlik"],
      ["İncek veya Gölbaşı'ndaki villamı yenilemek istiyorum", "incek-golbasi-villa-yenileme"],
      ["Banyomu yenileyeceğim", "banyo-yenileme-oncesi"],
      ["Kafe, mağaza veya ofis için mekân kiralayacağım", "ticari-mekan-kiralamadan-once"],
      ["Müteahhidim, projemi alıcıya göre kurgulamak istiyorum", "muteahhit-alici-profiline-gore-proje"],
      ["Mülkümü kiraya vermeden veya satmadan önce yenilemek istiyorum", "kiraya-vermeden-once-yenileme"],
      ["Mimara mı, iç mimara mı, mühendise mi gideceğimi bilmiyorum", "mimar-ic-mimar-muhendis-farki"],
    ],
    ctaTitle: "Sorunuz rehberlerde yoksa bize sorun.",
    ctaText: "İlk görüşmede durumunuzu dinler, hangi adımın sizin için önce geldiğini birlikte belirleriz.",
  },
  en: {
    title: ["Before you", "*start your project.*"],
    meta: { guides: "Guides", drawings: "Animated drawings", language: "Language" },
    featured: "Featured guide",
    minutes: "min read",
    drawingsEyebrow: "Architecture in six pictures",
    drawingsTitle: "See the ideas as pictures first.",
    drawingsIntro: "Zoning, ground, climate, drawings, permits and renovation. Each explained with one animated drawing and an everyday comparison.",
    drawingsLink: "Read in the guide",
    pathsEyebrow: "Where to start?",
    pathsTitle: "Pick a guide for your situation.",
    paths: [
      ["I am still researching and will talk to an architect for the first time", "ilk-mimarlik-gorusmesi"],
      ["I have several proposals and do not know how to compare them", "mimari-teklif-karsilastirma"],
      ["I want to break my budget into headings", "mimarlik-ucreti-ve-butce"],
      ["I own a plot and wonder how many flats it allows", "arsaya-kac-daire-sigar"],
      ["I want to understand the permit steps", "ankara-yapi-ruhsati-sureci"],
      ["I want to redesign my home's interior", "ic-mekan-tasarimina-nasil-baslanir"],
      ["I am preparing to renovate my current home", "ankara-ev-yenileme-hazirlik"],
      ["I want to join my kitchen and living room", "mutfak-salon-birlestirme"],
      ["I am considering buying an older villa", "villa-almadan-once-tadilat-fizibilitesi"],
      ["I am an estate agent and want to present my listings better", "emlak-danismanlari-satisa-hazirlik"],
      ["I want to renovate my villa in İncek or Gölbaşı", "incek-golbasi-villa-yenileme"],
      ["I am going to renovate my bathroom", "banyo-yenileme-oncesi"],
      ["I am about to lease a space for a café, shop or office", "ticari-mekan-kiralamadan-once"],
      ["I am a contractor and want to shape my project around the buyer", "muteahhit-alici-profiline-gore-proje"],
      ["I want to renovate before letting or selling my property", "kiraya-vermeden-once-yenileme"],
      ["I do not know whether I need an architect, interior architect or engineer", "mimar-ic-mimar-muhendis-farki"],
    ],
    ctaTitle: "If your question is not covered, ask us.",
    ctaText: "At the first meeting we listen to your situation and work out together which step comes first for you.",
  },
} as const;

const words = (guide: StudioGuide, locale: Locale) => {
  const copy = guide.copy[locale];
  const text = [copy.intro, copy.takeaway, ...copy.sections.flatMap((s) => [s.title, s.body, ...(s.points ?? [])])].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
};
const readingMinutes = (guide: StudioGuide, locale: Locale) => Math.max(1, Math.ceil(words(guide, locale) / 200));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  return buildMetadata({ locale, path: "/guides", title: guideLabels[locale].label, description: guideLabels[locale].description });
}

export default async function GuidesPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  setRequestLocale(locale);
  const tm = await getTranslations({ locale, namespace: "studio.mascots" });
  const labels = guideLabels[locale];
  const copy = COPY[locale];
  const featured = guides.find((g) => g.slug === FEATURED);
  const bySlug = (slug: string) => guides.find((g) => g.slug === slug);
  const taxonomy = guideTaxonomy[locale];
  const explainerCount = new Set(guides.flatMap((g) => g.explainers ?? [])).size;

  return (
    <div className="text-ink">
      <JsonLd
        data={[
          breadcrumbLd(locale, [[labels.label, "/guides"]]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: labels.label,
            numberOfItems: guides.length,
            itemListElement: guides.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(localePath(locale, `/guides/${g.slug}`)), name: g.copy[locale].title })),
          },
        ]}
      />
      <PageHeader
        index="06"
        label={labels.label}
        titleLines={[copy.title[0], <em key="accent">{copy.title[1].replaceAll("*", "")}</em>]}
        intro={<p>{labels.intro}</p>}
        meta={[
          { label: copy.meta.guides, value: String(guides.length).padStart(2, "0") },
          { label: copy.meta.drawings, value: String(explainerCount).padStart(2, "0") },
          { label: copy.meta.language, value: "TR / EN" },
        ]}
        image={{ src: "/media/projects/modern-villa/exterior-pool-hd.jpg", alt: "" }}
      />

      <div className="mx-auto max-w-[2560px] px-4 sm:px-8 lg:px-12">
        {featured && (
          <article aria-labelledby="featured-guide" className="grid grid-cols-1 items-center gap-10 border-b border-line py-16 sm:py-24 lg:grid-cols-12 lg:gap-16">
            <PlayWhenVisible className="overflow-hidden rounded-[3px] lg:col-span-7">
              <Link href={`/${locale}/guides/${featured.slug}`} aria-hidden aria-label={featured.copy[locale].title} tabIndex={-1} className="block">
                <ExplainerScene id="imar" />
              </Link>
            </PlayWhenVisible>
            <div className="lg:col-span-5">
              <p className="eyebrow text-clay">{copy.featured} · {readingMinutes(featured, locale)} {copy.minutes}</p>
              <h2 id="featured-guide" className="mt-5 font-serif text-[clamp(2rem,4.4vw,3.5rem)] leading-tight">
                <Link href={`/${locale}/guides/${featured.slug}`} className="hover:text-clay">{featured.copy[locale].title}</Link>
              </h2>
              <p className="mt-6 text-[17px] leading-relaxed text-mute">{featured.copy[locale].intro}</p>
              <Link href={`/${locale}/guides/${featured.slug}`} className="mt-8 inline-flex min-h-12 items-center border border-ink px-6 py-3 text-[16px] transition-colors hover:bg-night hover:text-bone">
                {labels.read} →
              </Link>
            </div>
          </article>
        )}

        <GuideLibrary
          locale={locale}
          cards={guides.map((g) => ({
            slug: g.slug,
            title: g.copy[locale].title,
            description: g.copy[locale].description,
            topic: g.topic,
            audiences: g.audiences,
            minutes: readingMinutes(g, locale),
            image: g.card,
          }))}
          topics={GUIDE_TOPICS}
          topicLabels={taxonomy.topics}
          audiences={GUIDE_AUDIENCES}
          audienceLabels={taxonomy.audiences}
          labels={{ minutes: copy.minutes, read: labels.read }}
        />

        <section aria-labelledby="guide-drawings" className="border-b border-line py-16 sm:py-24">
          <p className="eyebrow text-clay">{copy.drawingsEyebrow}</p>
          <h2 id="guide-drawings" className="mt-5 max-w-3xl font-serif text-[clamp(2rem,5vw,4rem)] leading-tight">{copy.drawingsTitle}</h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-mute">{copy.drawingsIntro}</p>
          <div className="mt-10">
            <ExplainerCards ids={["imar", "zemin", "iklim", "projeler", "surec", "tadilat"]} locale={locale} href={`/${locale}/guides/${FEATURED}`} linkLabel={copy.drawingsLink} />
          </div>
        </section>

        <section aria-labelledby="guide-paths" className="py-16 sm:py-24">
          <p className="eyebrow text-clay">{copy.pathsEyebrow}</p>
          <h2 id="guide-paths" className="mt-5 max-w-3xl font-serif text-[clamp(2rem,5vw,4rem)] leading-tight">{copy.pathsTitle}</h2>
          <ul className="mt-10 border-t border-line">
            {copy.paths.map(([situation, slug]) => {
              const guide = bySlug(slug);
              if (!guide) return null;
              return (
                <li key={slug} className="border-b border-line">
                  <Link href={`/${locale}/guides/${slug}`} className="group grid min-h-16 grid-cols-1 gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
                    <span className="text-[clamp(1.1rem,2.2vw,1.45rem)] font-light leading-snug">{situation}</span>
                    <span className="inline-flex items-center gap-3 text-[15px] text-mute transition-colors group-hover:text-clay">
                      {guide.copy[locale].title.split(":")[0]}
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <MotionReel />

      <section aria-labelledby="guides-cta" className="mx-auto max-w-[2560px] px-4 pb-24 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 border-y border-line py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-3xl flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-8">
            <MascotDuo pose="think" size="sm" message={tm("guides")} className="shrink-0" />
            <div>
              <h2 id="guides-cta" className="font-serif text-[clamp(1.9rem,4vw,3rem)] leading-tight">{copy.ctaTitle}</h2>
              <p className="mt-4 text-[17px] leading-relaxed text-mute">{copy.ctaText}</p>
            </div>
          </div>
          <CallCta className="inline-flex min-h-12 items-center justify-center gap-3 border border-ink px-7 py-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night hover:text-bone" />
        </div>
      </section>
    </div>
  );
}
