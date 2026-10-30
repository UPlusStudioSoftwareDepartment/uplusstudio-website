"use client";

import { studioInfo } from "@/lib/studio-info";
import PhoneRing from "@/components/studio/PhoneRing";

import Link from "next/link";
import { Fragment, useRef, useState, type ReactNode } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import PageHeader from "@/components/studio/PageHeader";
import FramedImage from "@/components/studio/FramedImage";
import BeforeAfter from "@/components/studio/BeforeAfter";
import GoogleRating from "@/components/studio/GoogleRating";
import { MascotDuo } from "@/components/mascots/Mascots";
import { Eyebrow, FadeUp, LineReveal, MaskReveal } from "@/components/studio/Reveal";
import ShowcaseModal, { type Showcase } from "@/components/studio/ShowcaseModal";
import { examplePair, type ExamplePair } from "@/lib/showcase";
import { priceRange } from "@/lib/pricing";
import { SERVICE_LANDINGS, SERVICE_ORDER } from "@/lib/serviceLandings";
import { getProject, screenPoster } from "@/lib/projects";
import InViewVideo from "@/components/studio/InViewVideo";
import Fullscreenable from "@/components/studio/Fullscreenable";
import { AUDIENCES, audienceLabels } from "@/lib/serviceAudiences";
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

const DISCIPLINE_IMAGE_SIZES: Partial<Record<DisciplineKey, string>> = {
  project: "(min-width: 1024px) 25vw, 56vw",
};

const CONTAINER = "mx-auto max-w-[2560px] px-4 sm:px-8 lg:px-12";
const HEADING = "display text-ink [&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:tracking-normal";
const CENTERED = "text-center lg:col-span-12 [&>span>span]:ml-0";

function DisciplineBlock({
  index,
  number,
  service,
  image,
  imageAlt,
  imageSizes = "(min-width: 1024px) 45vw, 100vw",
  scopeLabel,
  callLabel,
  exampleLabel,
  onExample,
}: Readonly<{
  /** Position in the list, used to alternate the layout. */
  index: number;
  /** Discipline number shown as 01 / 04. */
  number: number;
  service: ServicesCopy["services"][DisciplineKey];
  image: string;
  imageAlt: string;
  imageSizes?: string;
  scopeLabel: string;
  callLabel: string;
  exampleLabel: string;
  onExample?: () => void;
}>) {

  const flipped = index % 2 === 1;

  return (
    <li className="grid grid-cols-1 items-center gap-10 border-b border-line py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
      <MaskReveal
        from={flipped ? "left" : "bottom"}
        className={`relative aspect-[4/3] w-full lg:col-span-6 ${flipped ? "lg:order-2" : ""}`}
      >
        {onExample ? (
          <button type="button" onClick={onExample} aria-label={`${service.title} — ${exampleLabel}`} className="group/img absolute inset-0 block">
            <FramedImage src={image} alt={imageAlt} sizes={imageSizes} />
            <span className="absolute bottom-4 right-4 rounded-[3px] bg-night/75 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-bone backdrop-blur-sm transition-colors group-hover/img:bg-night">
              {exampleLabel} →
            </span>
          </button>
        ) : (
          <FramedImage src={image} alt={imageAlt} sizes={imageSizes} />
        )}
      </MaskReveal>

      <div className={`flex flex-col lg:col-span-6 ${flipped ? "lg:order-1" : ""}`}>
        <span className="font-mono text-[12px] tracking-[0.14em] text-clay">{String(number + 1).padStart(2, "0")} / 04</span>
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
          <a
            href={studioInfo.phoneHref}
            className="group inline-flex min-h-12 items-center justify-between gap-6 border border-ink bg-transparent px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night hover:text-bone"
          >
            <span className="inline-flex items-center gap-2"><PhoneRing />{callLabel}</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
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

type FeaturedWork = Readonly<{ project: string; landing: string }>;

// Real project films shown in the discipline card layout, ahead of the disciplines.
const FEATURED_WORK: readonly FeaturedWork[] = [
  { project: "villa-donusumu", landing: "tadilat-donusum-ankara" },
  { project: "konut-ic-mekan", landing: "ic-mimarlik-ankara" },
  { project: "ofis-yenileme", landing: "ofis-ic-mimarlik-ankara" },
];

const FEATURED_LABELS = {
  tr: { eyebrow: "Örnek proje", project: "Projeyi inceleyin", service: "Hizmet sayfası" },
  en: { eyebrow: "Featured project", project: "Explore the project", service: "Service page" },
} as const;

function FeaturedWorkBlock({ item, index, lang, callLabel }: Readonly<{ item: FeaturedWork; index: number; lang: "tr" | "en"; callLabel: string }>) {
  const project = getProject(item.project);
  const landing = SERVICE_LANDINGS.find((l) => l.slug === item.landing);
  if (!project?.video || !landing) return null;
  const flipped = index % 2 === 1;
  const portrait = project.video.height > project.video.width;
  const labels = FEATURED_LABELS[lang];
  return (
    <li className="grid grid-cols-1 items-center gap-10 border-b border-line py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
      <MaskReveal from={flipped ? "left" : "bottom"} className={`relative aspect-[4/3] w-full overflow-hidden bg-night lg:col-span-6 ${flipped ? "lg:order-2" : ""}`}>
        <Fullscreenable className="absolute inset-0">
          <InViewVideo
            src={project.video.src}
            poster={screenPoster(project.video)}
            label={project.title[lang]}
            className={`h-full w-full ${portrait ? "object-contain" : "object-cover"}`}
          />
        </Fullscreenable>
      </MaskReveal>

      <div className={`flex flex-col lg:col-span-6 ${flipped ? "lg:order-1" : ""}`}>
        <span className="font-mono text-[12px] tracking-[0.14em] text-clay">{labels.eyebrow} · {landing.copy[lang].label}</span>
        <h3 className="display mt-6 text-[clamp(2.25rem,4.4vw,4rem)] leading-[1.02]! text-ink">{project.title[lang]}</h3>
        <p className="mt-4 font-serif text-xl italic text-mute sm:text-2xl">{project.tagline[lang]}</p>
        <p className="mt-8 max-w-[60ch] text-[17px] leading-relaxed text-ink/85">{project.description[lang]}</p>

        <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-2 text-[16px] text-ink sm:grid-cols-2">
          {landing.copy[lang].scope.slice(0, 6).map((f) => (
            <li key={f} className="flex gap-3 border-b border-line pb-2">
              <span aria-hidden className="text-clay">—</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={studioInfo.phoneHref}
            className="group inline-flex min-h-12 items-center justify-between gap-6 border border-ink bg-transparent px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night hover:text-bone"
          >
            <span className="inline-flex items-center gap-2"><PhoneRing />{callLabel}</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <Link href={`/${lang}/projects/${project.slug}`} className="group inline-flex min-h-11 items-center gap-3 border-b border-ink/40 pb-1 text-[15px] text-ink transition-colors hover:border-clay hover:text-clay">
            {labels.project}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link href={`/${lang}/services/${landing.slug}`} className="inline-flex min-h-11 items-center text-[15px] text-mute underline-offset-4 hover:text-ink hover:underline">
            {labels.service} →
          </Link>
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

/** Lets the last card fill its row in the 2-column (sm) and 3-column (xl) service list. */
function lastRowSpan(i: number, n: number) {
  if (i !== n - 1) return "";
  const sm = n % 2 === 1 ? "sm:col-span-2" : "";
  const xl = n % 3 === 1 ? "xl:col-span-3" : sm ? "xl:col-span-1" : "";
  return `${sm} ${xl}`.trim();
}

// One drawing per step: brief, massing concept, dimensioned detail, structure on site.
const PROCESS_DRAWINGS = ["/media/diagrams/process-brief.svg", "/media/diagrams/process-concept.svg", "/media/diagrams/process-detail.svg", "/media/diagrams/process-coordination.svg"];

function ProcessTimeline({ steps }: Readonly<{ steps: ServicesCopy["process"]["steps"] }>) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={ref} className="relative mt-16 grid grid-cols-1 gap-y-12 sm:mt-24 lg:grid-cols-4 lg:gap-x-8">
      <span className="absolute left-[11px] top-3 bottom-3 w-px bg-line lg:inset-x-0 lg:top-[11px] lg:bottom-auto lg:h-px lg:w-auto" aria-hidden />
      <m.span
        className="absolute left-[11px] top-3 bottom-3 w-px origin-top bg-clay lg:hidden"
        style={{ scaleY: fill }}
        aria-hidden
      />
      <m.span
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
            {PROCESS_DRAWINGS[i] && (
              <Image src={PROCESS_DRAWINGS[i]} alt="" width={320} height={160} unoptimized className="mb-6 h-auto w-full max-w-[260px] rounded-[3px] border border-line bg-paper-2/60" />
            )}
            <span className="font-serif text-6xl italic leading-none text-ink/40 sm:text-7xl" aria-hidden>{step.step}</span>
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

  const tm = useTranslations("studio.mascots");
  const ts = useTranslations("studio");
  const lang = locale === "en" ? "en" : "tr";
  const [showcase, setShowcase] = useState<Showcase | null>(null);
  const audience = audienceLabels[lang];
  const landings = SERVICE_ORDER.map((slug) => SERVICE_LANDINGS.find((landing) => landing.slug === slug)).filter(
    (landing): landing is (typeof SERVICE_LANDINGS)[number] => Boolean(landing),
  );

  return (
    <>
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
          <h2 id="disciplines-title" className={`text-[clamp(2.5rem,6vw,5.5rem)] ${CENTERED} ${HEADING}`}>
            <LineReveal lines={page.disciplinesTitle.map((l) => withEm(l))} />
          </h2>
        </div>

        <ol className="mt-12 border-t border-line lg:mt-16">
          {FEATURED_WORK.map((item, i) => (
            <FeaturedWorkBlock key={item.project} item={item} index={i} lang={lang} callLabel={ts("nav.callNow")} />
          ))}
          {DISCIPLINE_KEYS.map((key, i) => (
            <DisciplineBlock
              key={key}
              index={i + FEATURED_WORK.length}
              number={i}
              service={copy.services[key]}
              image={DISCIPLINE_IMAGES[key]}
              imageAlt={page.disciplineImages[key]}
              imageSizes={DISCIPLINE_IMAGE_SIZES[key]}
              scopeLabel={page.scope}
              callLabel={ts("nav.callNow")}
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

      {/* Sales order: what we do → the packages and prices → real before/after proof → everything else. */}
      {children}

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

      <section aria-labelledby="all-services-title" className={`${CONTAINER} pt-24 sm:pt-32`}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>{page.allEyebrow}</Eyebrow>
            <p className="mt-6 max-w-sm text-[16px] leading-relaxed text-mute">{page.allIntro}</p>
          </div>
          <h2 id="all-services-title" className={`text-[clamp(2.25rem,5vw,4.5rem)] ${CENTERED} ${HEADING}`}>
            <LineReveal lines={[withEm(page.allTitle.join(" "))]} />
          </h2>
        </div>
        <ol className="mt-12 grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:mt-16 xl:grid-cols-3">
          {landings.map((landing, i) => (
            <li key={landing.slug} className={`flex flex-col border-b border-r border-line p-5 sm:p-7 ${lastRowSpan(i, landings.length)}`}>
              <span className="font-mono text-[12px] tracking-[0.14em] text-clay">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-[21px] font-medium leading-snug text-ink">
                <Link href={`/${lang}/services/${landing.slug}`} className="hover:text-clay">{landing.copy[lang].crumb}</Link>
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-mute">{landing.copy[lang].description}</p>
              <Link
                href={`/${lang}/services/${landing.slug}`}
                className="group mt-6 inline-flex min-h-11 items-center justify-between gap-3 border-t border-line pt-4 text-[15px] text-ink transition-colors hover:text-clay"
              >
                {page.allDetail}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <a
                href={studioInfo.phoneHref}
                className="mt-2 inline-flex min-h-11 items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-mute transition-colors hover:text-ink"
              >
                <PhoneRing />{ts("nav.callNow")}
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="audiences-title" className={`${CONTAINER} pt-24 sm:pt-32`}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>{audience.eyebrow}</Eyebrow>
            <p className="mt-6 max-w-sm text-[16px] leading-relaxed text-mute">{audience.intro}</p>
          </div>
          <h2 id="audiences-title" className={`text-[clamp(2.25rem,5vw,4.5rem)] ${CENTERED} ${HEADING}`}>
            <LineReveal lines={[audience.title]} />
          </h2>
        </div>
        <ol className="mt-12 border-t border-line lg:mt-16">
          {AUDIENCES.map((group, i) => (
            <li key={group.key} className="grid grid-cols-1 gap-6 border-b border-line py-10 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-4">
                <span className="font-mono text-[12px] tracking-[0.14em] text-clay">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-serif text-[clamp(1.75rem,3.4vw,2.6rem)] leading-tight text-ink">{group.copy[lang].title}</h3>
                <p className="mt-4 text-[16px] leading-relaxed text-ink/85">{group.copy[lang].situation}</p>
              </div>
              <div className="lg:col-span-4">
                <p className="eyebrow text-mute">{audience.gains}</p>
                <ul className="mt-4 space-y-3">
                  {group.copy[lang].gains.map((gain) => (
                    <li key={gain} className="flex gap-3 text-[16px] leading-relaxed text-ink">
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                      {gain}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-4">
                <p className="eyebrow text-mute">{audience.services}</p>
                <ul className="mt-4 flex flex-wrap gap-2.5">
                  {group.services.map((slug) => {
                    const landing = landings.find((item) => item.slug === slug);
                    return landing ? (
                      <li key={slug}>
                        <Link href={`/${lang}/services/${slug}`} className="inline-flex min-h-11 items-center border border-line px-4 py-2 text-[15px] text-ink transition-colors hover:border-clay hover:text-clay">
                          {landing.copy[lang].crumb}
                        </Link>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-24 sm:mt-32">
        <Marquee items={DISCIPLINE_KEYS.map((k) => copy.services[k].title)} />
      </div>

      <section aria-labelledby="process-title" className={`${CONTAINER} pt-24 sm:pt-32`}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>{page.processEyebrow}</Eyebrow>
          </div>
          <div className="lg:col-span-12">
            <h2 id="process-title" className={`text-[clamp(2.5rem,6vw,5.5rem)] ${CENTERED} ${HEADING}`}>
              <LineReveal lines={[copy.process.title]} />
            </h2>
            <p className="mt-6 text-center font-serif text-xl italic text-mute">{copy.process.subtitle}</p>
          </div>
        </div>
        <ProcessTimeline steps={copy.process.steps} />
      </section>

      <section aria-labelledby="services-cta-title" className="relative isolate mt-28 overflow-hidden text-bone sm:mt-40">
        <FramedImage src="/media/projects/pastane/interior.jpg" alt="" sizes="100vw" className="-z-10 opacity-60" />
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-night/85 via-night/90 to-night sm:bg-linear-to-r sm:from-night sm:via-night/80 sm:to-night/30" aria-hidden />
        <div className={`${CONTAINER} grid grid-cols-1 gap-12 py-28 sm:py-40 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16`}>
          <div>
            <Eyebrow tone="light">{page.ctaEyebrow}</Eyebrow>
            <MascotDuo pose="think" size="md" message={tm("services")} className="mt-10 text-bone" />
          </div>
          <div>
            <h2 id="services-cta-title" className="display text-[clamp(2.5rem,6.5vw,6rem)] text-bone">
              <LineReveal lines={[copy.cta.title]} />
            </h2>
            <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-bone/75">{copy.cta.subtitle}</p>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <a
                href={studioInfo.phoneHref}
                className="group inline-flex min-h-12 items-center justify-between gap-6 border border-bone bg-transparent px-6 py-4 text-[15px] text-bone transition-colors hover:bg-night hover:text-bone sm:justify-start"
              >
                <span className="inline-flex items-center gap-2"><PhoneRing />{ts("nav.callNow")}</span>
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </a>
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
    </>
  );
}
