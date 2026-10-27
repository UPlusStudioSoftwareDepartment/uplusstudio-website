"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import PageHeader from "@/components/studio/PageHeader";
import BookingCta from "@/components/studio/BookingCta";
import { Eyebrow, FadeUp, LineReveal } from "@/components/studio/Reveal";
import { useAppointment } from "@/contexts/AppointmentContext";
import { useServicesCopy, withEm } from "@/components/ServicesClient";
import { getProject } from "@/lib/projects";
import { formatTry, packagePrices } from "@/lib/pricing";
import { getServiceLanding } from "@/lib/serviceLandings";
import type { Locale } from "@/lib/i18n-config";

const CONTAINER = "mx-auto max-w-[2560px] px-4 sm:px-8 lg:px-12";
const HEADING = "display text-ink [&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:tracking-normal";

const LABELS = {
  tr: { projects: "İlgili projeler", process: "Nasıl çalışıyoruz", allServices: "Tüm hizmetler", cta: "Projenizi konuşalım", ctaText: "İlk görüşmede ihtiyacınızı dinler, kapsamı ve sonraki adımları birlikte belirleriz." },
  en: { projects: "Related projects", process: "How we work", allServices: "All services", cta: "Let's talk about your project", ctaText: "At the first meeting we listen to your brief and agree the scope and next steps together." },
};

export default function ServiceLandingContent({ slug, locale }: Readonly<{ slug: string; locale: Locale }>) {
  const landing = getServiceLanding(slug);
  const services = useServicesCopy();
  const t = useTranslations("studio");
  const { openAppointmentWith } = useAppointment();
  if (!landing) return null;
  const c = landing.copy[locale];
  const l = LABELS[locale];
  const pricing = c.pricing
    ?.replace("{price}", formatTry(packagePrices.basic, locale))
    .replace("{cafe}", formatTry(packagePrices.cafe, locale))
    .replace("{gym}", formatTry(packagePrices.gym, locale));
  const related = landing.projects.map(getProject).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const book = () => openAppointmentWith({ service: landing.booking });

  return (
    <>
      <PageHeader
        index="03"
        label={c.label}
        titleLines={c.heading.map((line) => withEm(line))}
        intro={<p>{c.intro}</p>}
        image={{ src: landing.image, alt: c.title }}
      />

      <section className={`${CONTAINER} grid grid-cols-1 gap-12 pt-20 sm:pt-28 lg:grid-cols-12 lg:gap-10`}>
        <FadeUp className="lg:col-span-5">
          <Eyebrow>{c.forWhoTitle}</Eyebrow>
          <ul className="mt-6 border-t border-line">
            {c.forWho.map((item) => (
              <li key={item} className="border-b border-line py-4 text-[17px] leading-relaxed text-ink">{item}</li>
            ))}
          </ul>
        </FadeUp>
        <FadeUp delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <Eyebrow>{c.scopeTitle}</Eyebrow>
          <ol className="mt-6 border-t border-line">
            {c.scope.map((item, i) => (
              <li key={item} className="grid grid-cols-[2.5rem_1fr] border-b border-line py-4 text-[17px] leading-relaxed text-ink">
                <span className="pt-1 font-mono text-[12px] tracking-[0.14em] text-clay">{String(i + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ol>
          {pricing && <p className="mt-6 text-[15px] leading-relaxed text-mute">{pricing}</p>}
        </FadeUp>
      </section>

      <section className={`${CONTAINER} pt-20 sm:pt-28`}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>{c.whyTitle}</Eyebrow>
          </div>
          <p className="max-w-3xl text-[clamp(1.25rem,2.4vw,1.75rem)] leading-snug text-ink lg:col-span-8">{c.why}</p>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="landing-projects" className={`${CONTAINER} pt-20 sm:pt-28`}>
          <h2 id="landing-projects" className={`text-[clamp(2rem,5vw,4rem)] ${HEADING}`}>
            <LineReveal lines={[l.projects]} />
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((p) => (
              <li key={p.slug}>
                <Link href={`/${locale}/projects/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-paper-2">
                    <Image
                      src={p.cover.src}
                      alt={p.cover.alt[locale]}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-3 text-[17px] text-ink">{p.title[locale]}</p>
                  <p className="text-[14px] text-mute">{p.tagline[locale]}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="landing-process" className={`${CONTAINER} pt-20 sm:pt-28`}>
        <h2 id="landing-process" className={`text-[clamp(2rem,5vw,4rem)] ${HEADING}`}>
          <LineReveal lines={[l.process]} />
        </h2>
        <ol className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[3px] border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
          {services.process.steps.map((step) => (
            <li key={step.step} className="bg-paper p-6">
              <span className="font-mono text-[12px] tracking-[0.14em] text-clay">{step.step}</span>
              <p className="mt-3 text-[19px] text-ink">{step.title}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-mute">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={`${CONTAINER} pb-28 pt-20 sm:pb-40 sm:pt-28`}>
        <div className="flex flex-col gap-6 border-t border-line pt-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className={`text-[clamp(2rem,4.5vw,3.5rem)] ${HEADING}`}>{l.cta}</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-mute">{l.ctaText}</p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <BookingCta
              onBook={book}
              label={t("nav.appointment")}
              arrow={<span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>}
              className="group inline-flex min-h-12 items-center justify-between gap-4 border border-ink bg-transparent px-7 py-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night hover:text-bone"
            />
            <Link href={`/${locale}/services`} className="font-mono text-[12px] uppercase tracking-[0.12em] text-mute underline-offset-4 hover:text-ink hover:underline">
              {l.allServices} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
