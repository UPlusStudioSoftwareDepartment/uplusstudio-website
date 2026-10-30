"use client";

import Image from "next/image";
import CallCta from "@/components/studio/CallCta";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import PageHeader from "@/components/studio/PageHeader";
import ScrubText from "@/components/studio/ScrubText";
import BeforeAfter from "@/components/studio/BeforeAfter";
import { MascotDuo } from "@/components/mascots/Mascots";
import { Eyebrow, FadeUp, LineReveal, MaskReveal } from "@/components/studio/Reveal";
import { studioInfo } from "@/lib/studio-info";
import ShowcaseModal, { type Showcase } from "@/components/studio/ShowcaseModal";
import { getProject, projects } from "@/lib/projects";
import { ExplainerScene } from "@/components/explainers/ExplainerScenes";
import PlayWhenVisible from "@/components/explainers/PlayWhenVisible";
import { examplePair, type ExamplePair } from "@/lib/showcase";
import PhoneRing from "@/components/studio/PhoneRing";

const CONTAINER = "mx-auto max-w-[2560px] px-4 sm:px-8 lg:px-12";
const EM = "[&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:tracking-normal";
const VALUE_KEYS = ["v1", "v2", "v3", "v4"] as const;

function accentLines(text: string): ReactNode[] {
  const [first, ...rest] = text.split(" ");
  return rest.length ? [first, <em key="accent">{rest.join(" ")}</em>] : [text];
}

function quoteLines(text: string): string[] {
  const comma = text.indexOf(", ");
  if (comma > 0) return [text.slice(0, comma + 1), text.slice(comma + 2)];
  const words = text.split(" ");
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

function Caption({ fig, children }: Readonly<{ fig: string; children?: ReactNode }>) {
  return (
    <figcaption className="mt-4 flex items-baseline justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.14em] text-mute">
      <span>{children}</span>
      <span className="tabular-nums">Fig. {fig}</span>
    </figcaption>
  );
}

interface Person {
  name: string;
  title: string;
  position: string;
  experience: string;
  bio: string;
  focus: string[];
  imageAlt: string;
  quote: string;
  work: string[];
}
interface People {
  label: string;
  titleLine1: string;
  titleAccent: string;
  titleLine2: string;
  lead: string;
  experienceLabel: string;
  focusLabel: string;
  workLabel: string;
  hacer: Person;
  ridvan: Person;
}
interface Offer {
  label: string;
  titleLine1: string;
  titleAccent: string;
  lead: string;
  forLabel: string;
  includesLabel: string;
  cta: string;
  more: string;
  exampleCta: string;
  exampleLabel: string;
  items: { key: string; title: string; for: string; pitch: string; includes: string[]; image: string }[];
}

const EXAMPLE_FOR: Partial<Record<string, ExamplePair>> = {
  build: "villa",
};

function CardMedia({ onClick, label, children }: Readonly<{ onClick?: () => void; label: string; children: ReactNode }>) {
  const cls = "relative block aspect-[4/3] w-full overflow-hidden text-left";
  return onClick ? (
    <button type="button" onClick={onClick} aria-label={label} className={cls}>
      {children}
    </button>
  ) : (
    <span className={cls}>{children}</span>
  );
}

function FounderProfile({
  person,
  image,
  index,
  labels,
  flip = false,
  locale,
}: Readonly<{
  person: Person;
  image: string;
  index: string;
  labels: { experience: string; focus: string; work: string };
  flip?: boolean;
  locale: "tr" | "en";
}>) {
  const work = person.work.map((slug) => getProject(slug)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  return (
    <article className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
      <figure className={`relative lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}>
        <MaskReveal className="relative aspect-[4/5] w-full overflow-hidden bg-paper-2" from={flip ? "bottom" : "left"}>
          <Image src={image} alt={person.imageAlt} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover object-top" />
        </MaskReveal>
        <Caption fig={index}>{person.name}</Caption>
      </figure>

      <div className={`flex flex-col lg:col-span-6 lg:pt-10 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}>
        <Eyebrow>
          {index} — {person.position} · {person.title}
        </Eyebrow>
        <h3 className="mt-6 font-sans text-[clamp(2.75rem,6.5vw,6rem)] font-light leading-[0.95] tracking-[-0.035em] text-ink">
          <LineReveal lines={[person.name]} />
        </h3>
        <FadeUp delay={0.1}>
          <p className="mt-8 max-w-xl text-[18px] leading-relaxed text-ink/85">{person.bio}</p>
        </FadeUp>
        <FadeUp delay={0.15}>
          <blockquote className="mt-10 border-l border-clay pl-6">
            <p className="max-w-xl font-serif text-[clamp(1.35rem,2.1vw,1.85rem)] italic leading-snug text-ink">“{person.quote}”</p>
            <footer className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">— {person.name}</footer>
          </blockquote>
        </FadeUp>

        <dl className="mt-10 grid grid-cols-1 gap-8 border-t border-line pt-8 sm:grid-cols-2">
          <FadeUp>
            <dt className="eyebrow text-mute">{labels.experience}</dt>
            <dd className="mt-3 text-[15px] leading-relaxed text-ink/80">{person.experience}</dd>
          </FadeUp>
          <FadeUp delay={0.08}>
            <dt className="eyebrow text-mute">{labels.focus}</dt>
            <dd className="mt-3">
              <ul className="space-y-2 text-[15px] text-ink/80">
                {person.focus.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 bg-clay" />
                    {f}
                  </li>
                ))}
              </ul>
            </dd>
          </FadeUp>
        </dl>

        <div className="mt-12">
          <p className="eyebrow text-mute">{labels.work}</p>
          <ul className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
            {work.map((project, i) => (
              <li key={project.slug}>
                <FadeUp delay={i * 0.08}>
                  <Link href={`/${locale}/projects/${project.slug}`} className="group block">
                    <span className="relative block aspect-[4/5] overflow-hidden bg-paper-2">
                      <Image
                        src={project.cover.src}
                        alt={project.cover.alt[locale]}
                        fill
                        sizes="(max-width: 1024px) 33vw, 16vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </span>
                    <span className="mt-2 flex items-baseline justify-between gap-2 text-[13px] leading-snug text-ink/80 group-hover:text-clay">
                      {project.title[locale]}
                      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                    </span>
                  </Link>
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function AboutContent() {
  const t = useTranslations("about");
  const ts = useTranslations("studio");
  const tm = useTranslations("studio.mascots");
  const locale = useLocale();

  const people = t.raw("people") as People;
  const offer = t.raw("offer") as Offer;
  const why = t.raw("why") as { label: string; items: { title: string; desc: string }[] };
  const process = t.raw("process") as { label: string; titleLine1: string; titleAccent: string; lead: string; outputLabel: string; drawingCaption: string; drawingLink: string; steps: { title: string; body: string; output: string }[] };
  const studio = t.raw("studio") as { label: string; titleLine1: string; titleAccent: string; body: string; bringLabel: string; bring: string[]; addressLabel: string; directions: string; imageAlt: string; reviewsLabel: string };
  const [showcase, setShowcase] = useState<Showcase | null>(null);
  const lang = locale === "en" ? "en" : "tr";
  const facts = [
    { value: t("facts.foundersValue"), label: t("facts.founders"), note: t("facts.foundersNote") },
    { value: String(projects.length), label: t("facts.projects"), note: t("facts.projectsNote"), href: `/${locale}/projects` },
    { value: studioInfo.googleRating, label: t("facts.rating"), note: t("facts.ratingNote", { count: studioInfo.googleReviewCount }), href: studioInfo.mapsUrl, external: true },
    { value: t("facts.areaValue"), label: t("facts.area"), note: t("facts.areaNote"), href: `/${locale}/services/incek-golbasi-mimarlik-ofisi` },
  ];
  const profiles = [
    { label: t("studio.google", { rating: studioInfo.googleRating, count: studioInfo.googleReviewCount }), href: studioInfo.mapsUrl },
    { label: t("studio.armut"), href: studioInfo.armutUrl },
    { label: t("studio.yandex"), href: studioInfo.yandexMapsUrl },
    { label: t("studio.peyzaj"), href: studioInfo.peyzajRehberUrl },
    { label: t("studio.instagram"), href: studioInfo.instagramUrl },
  ];

  const openExample = (item: Offer["items"][number], i: number) => {
    const pair = EXAMPLE_FOR[item.key];
    const example = pair && examplePair(pair, lang, offer.exampleLabel);
    if (!example) return;
    setShowcase({
      index: `${String(i + 1).padStart(2, "0")} — ${offer.label}`,
      title: item.title,
      audience: `${offer.forLabel}: ${item.for}`,
      body: item.pitch,
      includes: item.includes,
      example,
    });
  };

  return (
    <div className="relative text-ink">
      <PageHeader
        index="02"
        label={t("header.label")}
        titleLines={[t("header.line1"), <em key="accent">{t("header.accent")}</em>, t("header.line2")]}
        titleClassName="max-sm:[--title-size:clamp(2rem,6.333vw,6.333rem)]"
        intro={<p>{t("intro.quote")}</p>}
        meta={[
          {
            label: t("meta.locationLabel"),
            value: (
              <Link href={`/${locale}/services/incek-golbasi-mimarlik-ofisi`} className="transition-colors hover:text-clay">
                {t("meta.location")}
              </Link>
            ),
          },
          { label: t("meta.practiceLabel"), value: t("meta.practice") },
          { label: t("meta.foundersLabel"), value: (
              <span className="text-[13px] sm:text-[15px]">
                {t.rich("meta.founders", { name: (chunks) => <span className="whitespace-nowrap">{chunks}</span> })}
              </span>
            ),
          },
          {
            label: t("meta.contactLabel"),
            value: (
              <a href={`mailto:${studioInfo.email}`} className="text-[13px] transition-colors hover:text-clay sm:text-[15px]">
                {studioInfo.email.split("@")[0]}@<wbr />
                <span className="whitespace-nowrap">{studioInfo.email.split("@")[1]}</span>
              </a>
            ),
          },
        ]}
        image={{ src: "/images/persons/founders/hacer_uyar/hacer-uyar-u-plus-studio-ofis.jpg", alt: t("header.imageAlt") }}
      />

      <section className={`${CONTAINER} pt-16 sm:pt-24`} aria-label={t("header.label")}>
        <ul className="grid grid-cols-2 border-y border-line lg:grid-cols-4">
          {facts.map((fact, i) => {
            const body = (
              <>
                <span className="block font-sans text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-none tracking-[-0.03em] text-ink tabular-nums">{fact.value}</span>
                <span className="eyebrow mt-4 block text-clay">{fact.label}</span>
                <span className="mt-2 block text-[14px] leading-snug text-mute sm:text-[15px]">{fact.note}</span>
              </>
            );
            const cell = `block h-full min-w-0 px-4 py-8 sm:px-6 sm:py-10 ${i % 2 === 1 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`;
            return (
              <li key={fact.label}>
                <FadeUp delay={i * 0.06} className="h-full">
                  {fact.href ? (
                    <a href={fact.href} {...(fact.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`${cell} transition-colors hover:bg-paper-2/60`}>
                      {body}
                    </a>
                  ) : (
                    <div className={cell}>{body}</div>
                  )}
                </FadeUp>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={`${CONTAINER} py-28 sm:py-40`} aria-labelledby="about-people">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <Eyebrow>01 — {people.label}</Eyebrow>
            <h2 id="about-people" className={`display mt-8 text-[clamp(2.5rem,6.5vw,6.5rem)] text-ink ${EM}`}>
              <LineReveal
                lines={[
                  people.titleLine1,
                  <>
                    <em>{people.titleAccent}</em> {people.titleLine2}
                  </>,
                ]}
              />
            </h2>
          </div>
          <FadeUp className="lg:col-span-4 lg:col-start-9" delay={0.15}>
            <p className="text-[17px] leading-relaxed text-mute">{people.lead}</p>
          </FadeUp>
        </div>

        <div className="mt-20 space-y-28 sm:mt-28 sm:space-y-40">
          <FounderProfile
            person={people.hacer}
            locale={lang}
            image="/images/persons/founders/hacer_uyar/hacer-uyar-portre.jpg"
            index="01"
            labels={{ experience: people.experienceLabel, focus: people.focusLabel, work: people.workLabel }}
          />
          <FounderProfile
            person={people.ridvan}
            locale={lang}
            image="/images/persons/founders/ridvan_uyar/ridvanuyar_face.jpeg"
            index="02"
            labels={{ experience: people.experienceLabel, focus: people.focusLabel, work: people.workLabel }}
            flip
          />
        </div>
      </section>

      <section className={`${CONTAINER} py-28 sm:py-40`} aria-labelledby="about-offer">
        <div className="grid grid-cols-1 gap-10 border-t border-line pt-28 sm:pt-40 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <Eyebrow>02 — {offer.label}</Eyebrow>
            <h2 id="about-offer" className={`display mt-8 text-[clamp(2.5rem,6.5vw,6.5rem)] text-ink ${EM}`}>
              <LineReveal lines={[offer.titleLine1, <em key="a">{offer.titleAccent}</em>]} />
            </h2>
          </div>
          <FadeUp className="lg:col-span-4 lg:col-start-9" delay={0.15}>
            <p className="text-[17px] leading-relaxed text-mute">{offer.lead}</p>
          </FadeUp>
        </div>

        <ul className="mt-20 grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
          {offer.items.map((item, i) => (
            <li key={item.key}>
              <FadeUp delay={(i % 3) * 0.08} className="group flex h-full flex-col border border-line bg-paper-2/40 transition-colors duration-500 hover:border-ink/40">
                <CardMedia
                  onClick={EXAMPLE_FOR[item.key] ? () => openExample(item, i) : undefined}
                  label={`${item.title} — ${offer.exampleCta}`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out-studio group-hover:scale-[1.04]"
                  />
                  <span
                    className="absolute left-4 top-4 bg-night/70 px-2.5 py-1 font-mono text-[11px] tracking-[0.14em] text-bone backdrop-blur-sm before:content-[attr(data-index)]"
                    data-index={String(i + 1).padStart(2, "0")}
                    aria-hidden
                  />
                  {EXAMPLE_FOR[item.key] && (
                    <span className="absolute bottom-4 right-4 rounded-[3px] bg-night/70 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-bone opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      {offer.exampleCta}
                    </span>
                  )}
                </CardMedia>
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <h3 className="font-sans text-[clamp(1.5rem,2.2vw,2rem)] font-light leading-[1.1] tracking-[-0.02em] text-ink">{item.title}</h3>
                  <p className="mt-3 font-mono text-[12px] uppercase leading-relaxed tracking-[0.12em] text-clay sm:text-[13px]">
                    {offer.forLabel}: {item.for}
                  </p>
                  <p className="mt-5 text-[16px] leading-relaxed text-ink/80">{item.pitch}</p>
                  <p className="eyebrow mt-7 text-mute">{offer.includesLabel}</p>
                  <ul className="mt-3 space-y-2 text-[15px] text-ink/80">
                    {item.includes.map((inc) => (
                      <li key={inc} className="flex gap-3">
                        <svg className="mt-[0.35em] h-3.5 w-3.5 shrink-0 text-clay" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
                          <path d="m3 8.5 3 3 7-7" />
                        </svg>
                        {inc}
                      </li>
                    ))}
                  </ul>
                  {EXAMPLE_FOR[item.key] ? (
                    <button
                      type="button"
                      onClick={() => openExample(item, i)}
                      className="mt-auto inline-flex items-center justify-between gap-4 border-t border-line pt-5 text-left text-[15px] text-ink transition-colors hover:text-clay [margin-top:max(2rem,auto)]"
                    >
                      {offer.exampleCta}
                      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </button>
                  ) : (
                    <a href={studioInfo.phoneHref} className="mt-auto inline-flex min-h-11 items-center justify-between gap-4 border-t border-line pt-5 text-[15px] text-ink hover:text-clay">
                      <span className="inline-flex items-center gap-2"><PhoneRing />{ts("nav.callNow")}</span> <span aria-hidden>→</span>
                    </a>
                  )}
                </div>
              </FadeUp>
            </li>
          ))}
        </ul>

        <div className="mt-20 border-y border-line py-10">
          <p className="eyebrow text-mute">{why.label}</p>
          <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {why.items.map((w, i) => (
              <li key={w.title}>
                <FadeUp delay={i * 0.06}>
                  <p className="text-[clamp(1.25rem,1.8vw,1.6rem)] font-light tracking-[-0.015em] text-ink">{w.title}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-mute">{w.desc}</p>
                </FadeUp>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href={`/${locale}/services`}
          className="group mt-8 inline-flex items-center gap-3 border-b border-ink/40 pb-1 text-[15px] transition-colors hover:border-clay hover:text-clay"
        >
          {offer.more}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </section>

      <ShowcaseModal
        item={showcase}
        onClose={() => setShowcase(null)}
        labels={{
          includes: offer.includesLabel,
          before: ts("transform.before"),
          after: ts("transform.after"),
          drag: ts("transform.drag"),
          close: t("founders.close"),
          cta: offer.cta,
        }}
      />

      <section className={`${CONTAINER} pb-28 sm:pb-40`} aria-labelledby="about-transform">
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <Eyebrow className="lg:col-span-3">{ts("transform.label")}</Eyebrow>
          <h2 id="about-transform" className="display text-[clamp(2.25rem,5vw,4.5rem)] text-ink lg:col-span-5">
            <LineReveal lines={[ts("transform.title")]} />
          </h2>
          <p className="max-w-sm text-[16px] leading-relaxed text-mute lg:col-span-4">{ts("transform.body")}</p>
        </div>
        <FadeUp>
          <BeforeAfter
            before={{ src: "/media/projects/villa-donusumu/before.jpg", alt: ts("transform.before") }}
            after={{ src: "/media/projects/villa-donusumu/after.jpg", alt: ts("transform.after") }}
            beforeLabel={ts("transform.before")}
            afterLabel={ts("transform.after")}
            dragLabel={ts("transform.drag")}
            aspectClass="aspect-[4/3] sm:aspect-video"
          />
        </FadeUp>
        <Link
          href={`/${locale}/projects/villa-donusumu`}
          className="group mt-6 inline-flex items-center gap-3 border-b border-ink/40 pb-1 text-[15px] transition-colors hover:border-clay hover:text-clay"
        >
          {ts("motion.items.villa")}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </section>

      <section className={`${CONTAINER} pb-28 sm:pb-40`} aria-labelledby="about-process">
        <div className="grid grid-cols-1 gap-14 border-t border-line pt-28 sm:pt-40 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-5">
            <Eyebrow>03 — {process.label}</Eyebrow>
            <h2 id="about-process" className={`display mt-8 text-[clamp(2.5rem,5.5vw,5.5rem)] text-ink ${EM}`}>
              <LineReveal lines={[process.titleLine1, <em key="a">{process.titleAccent}</em>]} />
            </h2>
            <p className="mt-8 max-w-md text-[17px] leading-relaxed text-mute">{process.lead}</p>
            <figure className="mt-12 lg:sticky lg:top-28">
              <PlayWhenVisible className="overflow-hidden rounded-[3px]">
                <div role="img" aria-label={process.drawingCaption}>
                  <ExplainerScene id="projeler" />
                </div>
              </PlayWhenVisible>
              <figcaption className="mt-4 text-[14px] leading-relaxed text-mute">
                {process.drawingCaption}{" "}
                <Link href={`/${locale}/guides/ankara-ev-yaptirma-adim-adim#projeler`} className="whitespace-nowrap text-ink underline underline-offset-4 hover:text-clay">
                  {process.drawingLink} →
                </Link>
              </figcaption>
            </figure>
          </div>
          <ol className="min-w-0 border-t border-line lg:col-span-6 lg:col-start-7">
            {process.steps.map((step, i) => (
              <li key={step.title} className="border-b border-line">
                <FadeUp delay={i * 0.05} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 py-8 sm:grid-cols-[4rem_minmax(0,1fr)] sm:py-10">
                  <span className="pt-1.5 font-mono text-[12px] tracking-[0.14em] text-clay tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-sans text-[clamp(1.4rem,2.3vw,2rem)] font-light leading-[1.15] tracking-[-0.02em] text-ink">{step.title}</h3>
                    <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-ink/80">{step.body}</p>
                    <p className="mt-4 font-mono text-[12px] uppercase leading-relaxed tracking-[0.12em] text-clay">
                      <span className="text-mute">{process.outputLabel} · </span>
                      {step.output}
                    </p>
                  </div>
                </FadeUp>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${CONTAINER} py-28 sm:py-40`} aria-labelledby="about-statement">
        <div className="grid grid-cols-1 items-center gap-16 border-t border-line pt-28 sm:pt-40 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col lg:col-span-6">
            <Eyebrow>04 — {t("intro.label")}</Eyebrow>
            <ScrubText
              as="h2"
              id="about-statement"
              text={t("intro.statement")}
              className="mt-10 font-sans text-[clamp(1.875rem,3.4vw,3.25rem)] font-light leading-[1.08] tracking-[-0.025em] text-ink"
            />
            <dl className="mt-14 grid grid-cols-1 gap-10 border-t border-line pt-8 sm:grid-cols-2 sm:gap-8">
              <FadeUp>
                <dt className="eyebrow text-mute">{t("labels.mission")}</dt>
                <dd className="mt-4 text-[16px] leading-relaxed text-ink/80">{t("mission")}</dd>
              </FadeUp>
              <FadeUp delay={0.1}>
                <dt className="eyebrow text-mute">{t("labels.vision")}</dt>
                <dd className="mt-4 text-[16px] leading-relaxed text-ink/80">{t("vision")}</dd>
              </FadeUp>
            </dl>
          </div>

          <figure className="lg:col-span-5 lg:col-start-8">
            <MaskReveal className="relative aspect-[4/5] max-h-[78svh] w-full" from="left">
              <Image
                src="/media/projects/konut-uygulama/stair.jpg"
                alt={t("labels.introImageAlt")}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </MaskReveal>
            <Caption fig="01">{t("gallery.residence")}</Caption>
          </figure>
        </div>
      </section>

      <section className={`${CONTAINER} pb-28 sm:pb-40`} aria-labelledby="about-values">
        <Eyebrow>05 — {t("values.title")}</Eyebrow>
        <h2 id="about-values" className={`display mt-8 text-[clamp(2.5rem,6.5vw,6.5rem)] text-ink ${EM}`}>
          <LineReveal lines={accentLines(t("values.label"))} />
        </h2>

        <ol className="mt-20 border-t border-line">
          {VALUE_KEYS.map((key, i) => {
            const v = t.raw(`values.${key}`) as { title: string; desc: string };
            return (
              <li key={key} className="border-b border-line">
                <FadeUp delay={i * 0.06} className="group grid grid-cols-12 gap-x-4 gap-y-4 py-8 sm:py-12">
                  <span className="col-span-2 pt-2 font-mono text-[12px] tracking-[0.14em] text-mute tabular-nums transition-colors group-hover:text-clay sm:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="col-span-10 font-sans text-[clamp(1.5rem,2.6vw,2.5rem)] font-light leading-[1.1] tracking-[-0.02em] sm:col-span-6 lg:col-span-5">
                    {v.title}
                  </h3>
                  <p className="col-span-10 col-start-3 max-w-md text-[16px] leading-relaxed text-mute sm:col-span-5 sm:col-start-8 lg:col-span-4 lg:col-start-9">
                    {v.desc}
                  </p>
                </FadeUp>
              </li>
            );
          })}
        </ol>
      </section>

      <section className={`${CONTAINER} pb-28 sm:pb-40`} aria-labelledby="about-studio">
        <div className="grid grid-cols-1 gap-12 border-t border-line pt-28 sm:pt-40 lg:grid-cols-12 lg:items-center lg:gap-8">
          <figure className="min-w-0 lg:col-span-6">
            <MaskReveal className="relative aspect-[1264/842] w-full overflow-hidden bg-paper-2" from="left">
              <Image
                src="/images/persons/founders/hacer_uyar/hacer-uyar-u-plus-studio-ofis.jpg"
                alt={studio.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </MaskReveal>
            <Caption fig="02">Merkez İncek Plaza</Caption>
          </figure>
          <div className="flex min-w-0 flex-col lg:col-span-5 lg:col-start-8">
            <Eyebrow>06 — {studio.label}</Eyebrow>
            <h2 id="about-studio" className={`display mt-8 text-[clamp(2.5rem,5.5vw,5rem)] text-ink ${EM}`}>
              <LineReveal lines={[studio.titleLine1, <em key="a">{studio.titleAccent}</em>]} />
            </h2>
            <p className="mt-8 max-w-lg text-[17px] leading-relaxed text-ink/85">{studio.body}</p>
            <p className="eyebrow mt-10 text-mute">{studio.bringLabel}</p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-ink/80">
              {studio.bring.map((item) => (
                <li key={item} className="flex gap-3">
                  <svg className="mt-[0.35em] h-3.5 w-3.5 shrink-0 text-clay" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
                    <path d="m3 8.5 3 3 7-7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <address className="mt-10 border-t border-line pt-6 text-[15px] not-italic leading-relaxed text-ink/80">
              <span className="eyebrow mb-2 block text-mute">{studio.addressLabel}</span>
              {studioInfo.address[0]}
              <br />
              {studioInfo.address[1]}
            </address>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
              <a
                href={studioInfo.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 items-center justify-between gap-6 rounded-[5px] border border-ink px-6 py-3 text-[15px] text-ink transition-colors hover:border-clay hover:bg-clay hover:text-night"
              >
                {studio.directions}
                <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
              </a>
              <CallCta
                arrow={<span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>}
                className="group inline-flex min-h-11 items-center gap-3 self-start whitespace-nowrap border-b border-ink/40 pb-1 text-[15px] transition-colors hover:border-clay hover:text-clay sm:self-auto"
              />
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-line pt-8">
          <p className="eyebrow text-mute">{studio.reviewsLabel}</p>
          <ul className="mt-5 flex flex-wrap gap-3">
            {profiles.map((profile) => (
              <li key={profile.href}>
                <a
                  href={profile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 py-2 text-[14px] text-ink/85 transition-colors hover:border-clay hover:text-clay"
                >
                  {profile.label}
                  <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative bg-night text-bone" aria-labelledby="about-quote">
        <div className={`${CONTAINER} grid grid-cols-1 gap-16 py-32 sm:py-48 lg:grid-cols-12 lg:gap-8`}>
          <div className="flex flex-col justify-between gap-10 lg:col-span-3">
            <Eyebrow tone="light">{t("quote.label")}</Eyebrow>
            <FadeUp className="hidden lg:block">
              <MaskReveal className="relative aspect-[4/5] w-full max-w-[280px]">
                <Image
                  src="/media/projects/brand/lapel-logo.jpg"
                  alt={`U+ Studio — ${t("quote.label")}`}
                  fill
                  sizes="280px"
                  className="object-cover object-[60%_50%]"
                />
              </MaskReveal>
            </FadeUp>
          </div>
          <figure className="lg:col-span-9">
            <blockquote>
              <p
                id="about-quote"
                className="font-serif text-[clamp(2.75rem,8vw,8.5rem)] leading-[0.98] tracking-[-0.01em] text-bone"
              >
                <LineReveal lines={quoteLines(t("quote.text"))} />
              </p>
            </blockquote>
            <figcaption className="mt-12 grid grid-cols-1 gap-4 border-t border-bone/15 pt-6 sm:grid-cols-2">
              <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-bone/50">— U+ Studio</span>
              <span className="text-[17px] leading-relaxed text-bone/70">{t("quote.lead")}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className={`${CONTAINER} py-32 sm:py-48`} aria-labelledby="about-cta">
        <Eyebrow>{t("cta.label")}</Eyebrow>
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <h2 id="about-cta" className={`display text-[clamp(2.75rem,8.5vw,8.5rem)] text-ink ${EM} [&_em]:inline-block [&_em]:pl-[0.1em]`}>
            <LineReveal
              lines={[
                t("cta.line1"),
                <>
                  <em>{t("cta.line2")}</em> {t("cta.line3")}
                </>,
              ]}
            />
          </h2>
          <FadeUp delay={0.2}>
            <div className="mb-8 flex justify-start lg:justify-center">
              <MascotDuo pose="wave" size="md" message={tm("about")} />
            </div>
            <p className="max-w-sm text-[17px] leading-relaxed text-mute">{t("cta.note")}</p>
            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10">
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center justify-between gap-10 whitespace-nowrap border border-ink bg-transparent px-7 py-5 text-[15px] text-ink transition-colors duration-300 hover:border-bone hover:bg-night hover:text-bone"
              >
                {t("cta.button")}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <CallCta
                arrow={<span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>}
                className="group inline-flex min-h-11 items-center gap-3 self-start whitespace-nowrap border-b border-ink/40 pb-1 text-[15px] transition-colors hover:border-clay hover:text-clay sm:self-auto"
              />
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
