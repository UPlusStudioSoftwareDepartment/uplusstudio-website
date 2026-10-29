import Link from "next/link";
import { guides, guideLabels } from "@/lib/guides";
import type { Locale } from "@/lib/i18n-config";

export default function GuideLinks({ locale }: Readonly<{ locale: Locale }>) {
  const labels = guideLabels[locale];
  return (
    <section aria-labelledby="project-guides" className="border-t border-line py-20 sm:py-28">
      <p className="eyebrow text-clay">{labels.label}</p>
      <h2 id="project-guides" className="mt-5 font-serif text-[clamp(2rem,5vw,4rem)] leading-tight">{labels.title}</h2>
      <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-mute">{labels.intro}</p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {guides.map(({ slug, copy }) => (
          <article key={slug} className="flex flex-col border-t border-line pt-6">
            <h3 className="text-2xl font-light leading-snug">{copy[locale].title}</h3>
            <p className="mt-4 flex-1 text-[16px] leading-relaxed text-mute">{copy[locale].description}</p>
            <Link href={`/${locale}/guides/${slug}`} className="mt-6 inline-flex min-h-11 w-fit items-center gap-3 underline underline-offset-4 hover:text-clay">{labels.read}<span aria-hidden>→</span></Link>
          </article>
        ))}
      </div>
    </section>
  );
}
