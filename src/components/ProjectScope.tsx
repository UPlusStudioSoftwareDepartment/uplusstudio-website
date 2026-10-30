import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n-config";
import { projectScope } from "@/lib/projectScope";

export default function ProjectScope({ locale }: Readonly<{ locale: Locale }>) {
  const copy = projectScope[locale];
  return (
    <section aria-labelledby="project-scope-title" className="project-scope border-t border-line py-16 sm:py-24">
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow text-clay">{locale === "tr" ? "DOĞRU KAPSAMLA BAŞLAYIN" : "START WITH THE RIGHT SCOPE"}</p>
          <h2 id="project-scope-title" className="mt-5 font-serif text-[clamp(2rem,4vw,3.5rem)] leading-tight">{copy.title}</h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-mute">{copy.intro}</p>
          <figure className="mt-8">
            <Image src="/media/diagrams/design-to-detail.svg" width={640} height={320} alt="" className="scope-drawing h-auto w-full" />
            <figcaption className="mt-3 max-w-xl text-sm leading-relaxed text-mute">{copy.caption}</figcaption>
          </figure>
        </div>
        <div>
          {copy.stages.map((stage, index) => (
            <details key={stage.title} className="group border-b border-line" open={index === 0}>
              <summary className="flex min-h-16 cursor-pointer list-none items-start gap-4 py-5 [&::-webkit-details-marker]:hidden">
                <span className="pt-1 font-mono text-xs text-clay">0{index + 1}</span>
                <span className="flex-1 text-xl leading-snug">{stage.title}<span className="mt-2 block text-sm text-mute">{stage.summary}</span></span>
                <span aria-hidden="true" className="text-xl group-open:rotate-45">+</span>
              </summary>
              <p className="pb-6 text-[16px] leading-relaxed text-mute">{stage.detail}</p>
            </details>
          ))}
          <p className="mt-6 border-l border-clay pl-4 text-sm leading-relaxed text-mute">{copy.note}</p>
          <div className="mt-6 flex flex-col items-start gap-3">
            <Link href={`/${locale}/contact`} className="inline-flex min-h-12 items-center border border-ink px-5 py-3 text-base transition-colors hover:bg-ink hover:text-paper">{copy.contact} →</Link>
            <Link href={`/${locale}/guides/ankara-ev-yenileme-hazirlik`} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-clay">{copy.guide} →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
