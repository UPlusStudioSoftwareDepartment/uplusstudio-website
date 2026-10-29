import Link from "next/link";
import { serviceDecisions } from "@/lib/marketingContent";
import type { Locale } from "@/lib/i18n-config";

export default function ServiceDecisionContent({ slug, locale }: Readonly<{ slug: string; locale: Locale }>) {
  const copy = serviceDecisions[slug]?.[locale];
  if (!copy) return null;
  return (
    <section aria-labelledby="service-decisions" className="mx-auto max-w-[2560px] px-4 pt-20 sm:px-8 sm:pt-28 lg:px-12">
      <div className="border-t border-line pt-10">
        <h2 id="service-decisions" className="max-w-4xl font-serif text-[clamp(2rem,5vw,4rem)] leading-tight">{copy.heading}</h2>
        <p className="mt-6 max-w-3xl text-[18px] leading-relaxed">{copy.introduction}</p>
        <dl className="mt-10 grid gap-8 lg:grid-cols-3">
          {copy.decisions.map(([question, answer]) => <div key={question} className="border-t border-line pt-5"><dt className="text-xl">{question}</dt><dd className="mt-4 text-[16px] leading-relaxed text-mute">{answer}</dd></div>)}
        </dl>
        <aside className="mt-12 max-w-3xl border-l border-clay pl-6">
          <h3 className="text-xl">{locale === "tr" ? "Kapsamı konuşurken" : "When discussing scope"}</h3>
          <p className="mt-4 text-[16px] leading-relaxed text-mute">{copy.scope}</p>
          <Link href={`/${locale}/guides/mimari-teklif-karsilastirma`} className="mt-4 inline-flex min-h-11 items-center underline underline-offset-4 hover:text-clay">{locale === "tr" ? "Teklif karşılaştırma rehberini okuyun" : "Read the proposal comparison guide"} →</Link>
        </aside>
      </div>
    </section>
  );
}
