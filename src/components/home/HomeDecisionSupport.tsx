import Link from "next/link";
import Image from "next/image";
import CallCta from "@/components/studio/CallCta";
import ProjectPreparation from "@/components/ProjectPreparation";
import HomeBudgetTimeline from "./HomeBudgetTimeline";
import HomeExplainers from "./HomeExplainers";
import { services_tr } from "@/app/[locale]/services/locales/tr_TR";
import { services_en } from "@/app/[locale]/services/locales/en_US";
import { projectPlanning } from "@/lib/projectPlanning";
import type { Locale } from "@/lib/i18n-config";

const PROCESS_ART = ["brief", "concept", "detail", "coordination"];

export default function HomeDecisionSupport({ locale }: Readonly<{ locale: Locale }>) {
  const copy = projectPlanning[locale];
  const services = locale === "en" ? services_en : services_tr;
  return (
    <div className="border-t border-line py-20 sm:py-28">
      <section aria-labelledby="home-process">
        <h2 id="home-process" className="font-serif text-[clamp(2rem,5vw,4rem)] leading-tight">{copy.processTitle}</h2>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-mute">{copy.processIntro}</p>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {services.process.steps.map((step, index) => (
            <li key={step.step} className="border-t border-line pt-5">
              <Image src={`/media/diagrams/process-${PROCESS_ART[index]}.svg`} alt="" width={320} height={160} className="mb-6 h-auto w-full rounded-sm bg-paper-2" />
              <span className="font-mono text-[12px] text-clay">{step.step}</span>
              <h3 className="mt-3 text-xl">{step.title}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-mute">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>
      <div className="mt-16"><HomeExplainers locale={locale} /></div>
      <div className="mt-16"><HomeBudgetTimeline locale={locale} /></div>
      <div className="mt-16"><ProjectPreparation locale={locale} /></div>
      <section aria-labelledby="home-faq" className="pt-16">
        <h2 id="home-faq" className="font-serif text-[clamp(2rem,5vw,4rem)] leading-tight">{copy.faqTitle}</h2>
        <dl className="mt-10 border-t border-line">
          {copy.faq.map(([question, answer]) => (
            <div key={question} className="grid gap-3 border-b border-line py-6 lg:grid-cols-2 lg:gap-12">
              <dt className="text-xl leading-snug">{question}</dt>
              <dd className="text-[16px] leading-relaxed text-mute">{answer}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <CallCta className="inline-flex min-h-12 items-center border border-ink px-6 py-3 text-[16px] transition-colors hover:bg-night hover:text-bone" />
          <Link href={`/${locale}/contact`} className="inline-flex min-h-11 items-center underline underline-offset-4">{copy.contact}</Link>
          <Link href={`/${locale}/projects`} className="inline-flex min-h-11 items-center underline underline-offset-4">{copy.projects}</Link>
        </div>
      </section>
    </div>
  );
}
