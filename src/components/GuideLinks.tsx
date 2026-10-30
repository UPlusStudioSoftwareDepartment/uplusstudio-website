import Link from "next/link";
import { getGuide, guideLabels, guides, guideTaxonomy, type StudioGuide } from "@/lib/guides";
import type { Locale } from "@/lib/i18n-config";

// One guide per kind of reader, so the home page answers "is there something for me?" without
// listing the whole library; the rest is one click away on /guides.
const HOME_GUIDES = [
  "ilk-mimarlik-gorusmesi",
  "incek-golbasi-villa-yenileme",
  "ankara-ev-yaptirma-adim-adim",
  "banyo-yenileme-oncesi",
  "ticari-mekan-kiralamadan-once",
  "muteahhit-alici-profiline-gore-proje",
] as const;

export default function GuideLinks({ locale }: Readonly<{ locale: Locale }>) {
  const labels = guideLabels[locale];
  const taxonomy = guideTaxonomy[locale];
  const selected = HOME_GUIDES.map(getGuide).filter((guide): guide is StudioGuide => Boolean(guide));
  return (
    <section aria-labelledby="project-guides" className="border-t border-line py-20 sm:py-28">
      <p className="eyebrow text-clay">{labels.label}</p>
      <h2 id="project-guides" className="mt-5 font-serif text-[clamp(2rem,5vw,4rem)] leading-tight">{labels.title}</h2>
      <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-mute">{labels.intro}</p>
      <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {selected.map(({ slug, copy, topic }) => (
          <article key={slug} className="flex flex-col border-t border-line pt-6">
            <p className="eyebrow text-mute">{taxonomy.topics[topic]}</p>
            <h3 className="mt-3 text-2xl font-light leading-snug">{copy[locale].title}</h3>
            <p className="mt-4 flex-1 text-[16px] leading-relaxed text-mute">{copy[locale].description}</p>
            <Link href={`/${locale}/guides/${slug}`} className="mt-6 inline-flex min-h-11 w-fit items-center gap-3 underline underline-offset-4 hover:text-clay">{labels.read}<span aria-hidden>→</span></Link>
          </article>
        ))}
      </div>
      <Link href={`/${locale}/guides`} className="mt-12 inline-flex min-h-12 items-center border border-ink px-6 py-3 text-[16px] transition-colors hover:bg-night hover:text-bone">
        {labels.all} ({guides.length}) →
      </Link>
    </section>
  );
}
