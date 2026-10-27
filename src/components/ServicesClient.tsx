"use client";

import Link from "next/link";
import { Fragment, useRef, useState, type ReactNode } from "react";
import { LazyMotion, domAnimation, motion, useScroll, useTransform } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import PageHeader from "@/components/studio/PageHeader";
import FramedImage from "@/components/studio/FramedImage";
import BeforeAfter from "@/components/studio/BeforeAfter";
import GoogleRating from "@/components/studio/GoogleRating";
import { MascotDuo } from "@/components/mascots/Mascots";
import { Eyebrow, FadeUp, LineReveal, MaskReveal } from "@/components/studio/Reveal";
import { useAppointment } from "@/contexts/AppointmentContext";
import ShowcaseModal, { type Showcase } from "@/components/studio/ShowcaseModal";
import { examplePair, type ExamplePair } from "@/lib/showcase";
import { priceRange } from "@/lib/pricing";
import { STUDIO_SERVICES } from "@/lib/services";
import { LANDING_BY_BOOKING } from "@/lib/serviceLandings";
import { services_tr } from "@/app/[locale]/services/locales/tr_TR";
import { services_en } from "@/app/[locale]/services/locales/en_US";

export type ServicesCopy = typeof services_tr;

export function useServicesCopy(): ServicesCopy {
  const locale = useLocale();
  return locale === "en" ? (services_en as ServicesCopy) : services_tr;
}

export function withEm(text: string): ReactNode {
  const parts = text.split(/\*([^*]+)\*/);
  return parts.map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>));
}

const DISCIPLINE_KEYS = ["architectural", "interior", "consulting", "project"] as const;
type DisciplineKey = (typeof DISCIPLINE_KEYS)[number];

const DISCIPLINE_EXAMPLE: Partial<Record<DisciplineKey, ExamplePair>> = {
  consulting: "villa",
  project: "office",
};

const DISCIPLINE_IMAGES: Record<DisciplineKey, string> = {
  architectural: "/media/projects/modern-villa/exterior-dusk.jpg",
  interior: "/media/projects/villa-ic-mekan/living.jpg",
  consulting: "/media/projects/villa-donusumu/before.jpg",
  project: "/media/projects/ofis-yenileme/site-banner.jpg",
};

const CONTAINER = "mx-auto max-w-[2560px] px-4 sm:px-8 lg:px-12";
const HEADING = "display text-ink [&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:tracking-normal";

function DisciplineBlock({
  index,
  service,
  image,
  imageAlt,
  scopeLabel,
  ctaLabel,
  exampleLabel,
  onExample,
}: Readonly<{
  index: number;
  service: ServicesCopy["services"][DisciplineKey];
  image: string;
  imageAlt: string;
  scopeLabel: string;
  ctaLabel: string;
  exampleLabel: string;
  onExample?: () => void;
}>) {
  const { openAppointment } = useAppointment();
  const flipped = index % 2 === 1;

  return (
    <li className="grid grid-cols-1 items-center gap-10 border-b border-line py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
      <MaskReveal
        from={flipped ? "left" : "bottom"}
        className={`relative aspect-[4/3] w-full lg:col-span-6 ${flipped ? "lg:order-2" : ""}`}
      >
        {onExample ? (
          <button type="button" onClick={onExample} aria-label={`${service.title} — ${exampleLabel}`} className="group/img absolute inset-0 block">
            <FramedImage src={image} alt={imageAlt} sizes="(min-width: 1024px) 50vw, 100vw" />
            <span className="absolute bottom-4 right-4 rounded-[3px] bg-night/75 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-bone backdrop-blur-sm transition-colors group-hover/img:bg-night">
              {exampleLabel} →
            </span>
          </button>
        ) : (
          <FramedImage src={image} alt={imageAlt} sizes="(min-width: 1024px) 50vw, 100vw" />
        )}
      </MaskReveal>

      <div className={`flex flex-col lg:col-span-6 ${flipped ? "lg:order-1" : ""}`}>
        <span className="font-mono text-[12px] tracking-[0.14em] text-clay">{String(index + 1).padStart(2, "0")} / 04</span>
        <h3 className="display mt-6 text-[clamp(2.25rem,4.4vw,4rem)] leading-[1.02]! text-ink">{service.title}</h3>
        <p className="mt-4 font-serif text-xl italic text-mute sm:text-2xl">{service.subtitle}</p>
        <p className="mt-8 max-w-[60ch] text-[17px] leading-relaxed text-ink/85">{service.description}</p>

        <p className="eyebrow mt-10 text-mute">{scopeLabel}</p>
        <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-[16px] text-ink sm:grid-cols-2">
          {service.features.map((f) => (
            <li key={f} className="flex gap-3 border-b border-line pb-2">
              <span aria-hidden className="text-clay">—</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <button
            type="button"
            onClick={openAppointment}
            className="group inline-flex min-h-12 items-center justify-between gap-6 border border-ink bg-transparent px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night hover:text-bone"
          >
            {ctaLabel}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          {onExample && (
            <button
              type="button"
              onClick={onExample}
              className="group inline-flex items-center gap-3 border-b border-ink/40 pb-1 text-[15px] text-ink transition-colors hover:border-clay hover:text-clay"
            >
              {exampleLabel}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

function Marquee({ items }: Readonly<{ items: string[] }>) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-line py-8 sm:py-10" aria-hidden>
      <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-12 whitespace-nowrap motion-reduce:animate-none">
        {[0, 1].map((copyIdx) => (
          <div key={copyIdx} className="flex gap-12">
            {row.map((item, i) => (
              <span key={`${copyIdx}-${i}`} className="flex items-center gap-12 font-sans text-[clamp(2.5rem,7vw,6rem)] font-light tracking-[-0.03em] text-ink/90">
                {i % 2 === 0 ? item : <em className="font-serif font-normal italic tracking-normal text-mute">{item}</em>}
                <span className="h-3 w-3 rounded-full bg-clay" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcessTimeline({ steps }: Readonly<{ steps: ServicesCopy["process"]["steps"] }>) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={ref} className="relative mt-16 grid grid-cols-1 gap-y-12 sm:mt-24 lg:grid-cols-4 lg:gap-x-8">
      <span className="absolute left-[11px] top-3 bottom-3 w-px bg-line lg:inset-x-0 lg:top-[11px] lg:bottom-auto lg:h-px lg:w-auto" aria-hidden />
      <motion.span
        className="absolute left-[11px] top-3 bottom-3 w-px origin-top bg-clay lg:hidden"
        style={{ scaleY: fill }}
        aria-hidden
      />
      <motion.span
        className="absolute inset-x-0 top-[11px] hidden h-px origin-left bg-clay lg:block"
        style={{ scaleX: fill }}
        aria-hidden
      />
      {steps.map((step, i) => (
        <li key={step.step} className="relative pl-12 lg:pl-0 lg:pt-14">
          <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-clay bg-paper" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-clay" />
          </span>
          <FadeUp delay={i * 0.08}>
            <span className="font-serif text-6xl italic leading-none text-ink/25 sm:text-7xl">{step.step}</span>
            <h3 className="display mt-4 text-3xl text-ink">{step.title}</h3>
            <p className="mt-3 max-w-xs text-[16px] leading-relaxed text-mute">{step.description}</p>
          </FadeUp>
        </li>
      ))}
    </ol>
  );
}

interface ServicesClientProps {
  children: ReactNode;
}

export default function ServicesClient({ children }: Readonly<ServicesClientProps>) {
  const copy = useServicesCopy();
  const page = copy.page;
  const locale = useLocale();
  const { openAppointment, openAppointmentWith } = useAppointment();
  const tm = useTranslations("studio.mascots");
  const ts = useTranslations("studio");
  const lang = locale === "en" ? "en" : "tr";
  const [showcase, setShowcase] = useState<Showcase | null>(null);

  return (
    <LazyMotion features={domAnimation}>
      <PageHeader
        index="03"
        label={page.label}
        titleLines={page.title.map((line) => withEm(line))}
        intro={<p>{page.intro}</p>}
        meta={[
          { label: page.meta.disciplines, value: "04" },
          { label: page.meta.packages, value: "08" },
          { label: page.meta.priceRange, value: <span className="font-serif text-[17px]">{priceRange(locale)}</span> },
          { label: "Google", value: <GoogleRating className="text-bone" /> },
        ]}
        image={{ src: "/media/projects/villa-ic-mekan/kitchen-island.jpg", alt: page.imageAlt }}
      />

      <section aria-labelledby="disciplines-title" className={`${CONTAINER} pt-24 sm:pt-32`}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>{page.disciplinesEyebrow}</Eyebrow>
          </div>
          <h2 id="disciplines-title" className={`text-[clamp(2.5rem,6vw,5.5rem)] lg:col-span-8 ${HEADING}`}>
            <LineReveal lines={page.disciplinesTitle.map((l) => withEm(l))} />
          </h2>
        </div>

        <ol className="mt-12 border-t border-line lg:mt-16">
          {DISCIPLINE_KEYS.map((key, i) => (
            <DisciplineBlock
              key={key}
              index={i}
              service={copy.services[key]}
              image={DISCIPLINE_IMAGES[key]}
              imageAlt={page.disciplineImages[key]}
              scopeLabel={page.scope}
              ctaLabel={page.ctaButton}
              exampleLabel={ts("showcase.cta")}
              onExample={DISCIPLINE_EXAMPLE[key] && (() => {
                const pair = DISCIPLINE_EXAMPLE[key];
                const service = copy.services[key];
                const example = pair && examplePair(pair, lang, ts("showcase.example"));
                if (!example) return;
                setShowcase({
                  index: `${String(i + 1).padStart(2, "0")} / 04`,
                  title: service.title,
                  audience: service.subtitle,
                  body: service.description,
                  includes: service.features,
                  example,
                });
              })}
            />
          ))}
        </ol>
        <ShowcaseModal
          item={showcase}
          onClose={() => setShowcase(null)}
          onCta={openAppointment}
          labels={{
            includes: page.scope,
            before: ts("transform.before"),
            after: ts("transform.after"),
            drag: ts("transform.drag"),
            close: ts("showcase.close"),
            cta: page.ctaButton,
          }}
        />
      </section>

      <section aria-labelledby="all-services-title" className={`${CONTAINER} pt-24 sm:pt-32`}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>{page.allEyebrow}</Eyebrow>
            <p className="mt-6 max-w-sm text-[16px] leading-relaxed text-mute">{page.allIntro}</p>
          </div>
          <h2 id="all-services-title" className={`text-[clamp(2.25rem,5vw,4.5rem)] lg:col-span-8 ${HEADING}`}>
            <LineReveal lines={page.allTitle.map((l) => withEm(l))} />
          </h2>
        </div>
        <ol className="mt-12 grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:mt-16 xl:grid-cols-5">
          {STUDIO_SERVICES[lang].map((service, i) => (
            <li key={service.title} className="flex flex-col border-b border-r border-line p-5 sm:p-6">
              <span className="font-mono text-[12px] tracking-[0.14em] text-clay">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-[19px] font-medium leading-snug text-ink">{service.title}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-mute">{service.desc}</p>
              <button
                type="button"
                onClick={() => openAppointmentWith({ service: service.booking, message: page.allMessage.replace("{service}", service.title) })}
                className="group mt-6 inline-flex min-h-11 items-center justify-between gap-3 border-t border-line pt-4 text-left font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:text-clay"
              >
                {page.allCta}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
              {LANDING_BY_BOOKING[service.booking] && (
                <Link
                  href={`/${lang}/services/${LANDING_BY_BOOKING[service.booking]}`}
                  className="mt-3 inline-flex min-h-11 items-center font-mono text-[12px] uppercase tracking-[0.12em] text-mute underline-offset-4 hover:text-ink hover:underline"
                >
                  {page.allDetail} →
                </Link>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="services-transform" className={`${CONTAINER} pt-24 sm:pt-32`}>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Eyebrow>{ts("transform.label")}</Eyebrow>
            <h2 id="services-transform" className={`mt-8 text-[clamp(2.25rem,5vw,4.5rem)] ${HEADING}`}>
              <LineReveal lines={[ts("transform.title")]} />
            </h2>
            <p className="mt-6 max-w-md text-[17px] leading-relaxed text-mute">{ts("transform.body")}</p>
            <Link
              href={`/${locale}/projects/ofis-yenileme`}
              className="group mt-8 inline-flex items-center gap-3 border-b border-ink/40 pb-1 text-[15px] transition-colors hover:border-clay hover:text-clay"
            >
              {ts("motion.items.office")}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <FadeUp className="mx-auto w-full max-w-md lg:col-span-5 lg:col-start-8">
            <BeforeAfter
              before={{ src: "/media/projects/ofis-yenileme/before.jpg", alt: ts("transform.before") }}
              after={{ src: "/media/projects/ofis-yenileme/after.jpg", alt: ts("transform.after") }}
              beforeLabel={ts("transform.before")}
              afterLabel={ts("transform.after")}
              dragLabel={ts("transform.drag")}
              aspectClass="aspect-[9/16]"
              sizes="(min-width: 1024px) 30vw, 90vw"
            />
          </FadeUp>
        </div>
      </section>

      <div className="mt-24 sm:mt-32">
        <Marquee items={DISCIPLINE_KEYS.map((k) => copy.services[k].title)} />
      </div>

      <section aria-labelledby="process-title" className={`${CONTAINER} pt-24 sm:pt-32`}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>{page.processEyebrow}</Eyebrow>
          </div>
          <div className="lg:col-span-8">
            <h2 id="process-title" className={`text-[clamp(2.5rem,6vw,5.5rem)] ${HEADING}`}>
              <LineReveal lines={[copy.process.title]} />
            </h2>
            <p className="mt-6 font-serif text-xl italic text-mute">{copy.process.subtitle}</p>
          </div>
        </div>
        <ProcessTimeline steps={copy.process.steps} />
      </section>

      {children}

      <section aria-labelledby="services-cta-title" className="relative isolate mt-28 overflow-hidden text-bone sm:mt-40">
        <FramedImage src="/media/projects/pastane/interior.jpg" alt="" sizes="100vw" className="-z-10 opacity-60" />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-night via-night/80 to-night/30" aria-hidden />
        <div className={`${CONTAINER} grid grid-cols-1 gap-12 py-28 sm:py-40 lg:grid-cols-12`}>
          <div className="lg:col-span-3">
            <Eyebrow tone="light">{page.ctaEyebrow}</Eyebrow>
            <MascotDuo pose="think" size="md" message={tm("services")} className="mt-10 text-bone" />
          </div>
          <div className="lg:col-span-8">
            <h2 id="services-cta-title" className="display text-[clamp(2.5rem,6.5vw,6rem)] text-bone">
              <LineReveal lines={[copy.cta.title]} />
            </h2>
            <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-bone/75">{copy.cta.subtitle}</p>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <button
                type="button"
                onClick={openAppointment}
                className="group inline-flex min-h-12 items-center justify-between gap-6 border border-bone bg-transparent px-6 py-4 text-[15px] text-bone transition-colors hover:bg-night hover:text-bone sm:justify-start"
              >
                {page.ctaButton}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </button>
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center gap-3 self-start border-b border-bone/40 pb-1 text-[15px] text-bone/85 hover:border-bone hover:text-bone sm:self-auto"
              >
                {page.ctaSecondary}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
