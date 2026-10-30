"use client";

import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/studio/PageHeader";
import CallCta from "@/components/studio/CallCta";
import { Eyebrow, FadeUp, LineReveal } from "@/components/studio/Reveal";
import { useServicesCopy, withEm } from "@/components/ServicesClient";
import { getProject } from "@/lib/projects";
import { formatTry, packagePrices } from "@/lib/pricing";
import { getServiceLanding, SERVICE_LANDINGS } from "@/lib/serviceLandings";
import type { Locale } from "@/lib/i18n-config";
import ProjectPreparation from "./ProjectPreparation";
import DiagramFigure from "@/components/studio/DiagramFigure";
import BeforeAfter from "@/components/studio/BeforeAfter";
import { MascotDuo } from "@/components/mascots/Mascots";
import { guidesForService } from "@/lib/guides";
import { useTranslations } from "next-intl";
import { ExplainerStory } from "@/components/explainers/ExplainerStory";
import type { ReactNode } from "react";

const CONTAINER = "mx-auto max-w-[2560px] px-4 sm:px-8 lg:px-12";
const HEADING = "display text-ink [&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:tracking-normal";

const LABELS = {
  tr: { area: "Hizmet bölgesi", areaText: "İncek'teki ofisimizden başta Ankara (İncek, Gölbaşı, Çankaya) olmak üzere Türkiye genelindeki projelere hizmet veriyoruz.", projects: "İlgili projeler", process: "Nasıl çalışıyoruz", faq: "Sık sorulanlar", allServices: "Tüm hizmetler", related: "Diğer hizmetler", gainsLabel: "Size ne kazandırır", gainsTitle: "Bu hizmetle elinize geçenler.", beforeAfterLabel: "Gerçek proje · önce / sonra", beforeAfterLink: "Projeyi inceleyin", before: "Önce", after: "Sonra", drag: "Karşılaştırmak için sürükleyin", stepsTitle: "Adım adım nasıl ilerliyoruz?", budgetTitle: "Bütçeyi neler etkiler?", budgetNote: "Kesin bedel, kapsam ve mevcut durum yerinde değerlendirildikten sonra konuşulur.", checklistTitle: "Sık yapılan hatalar", guides: "İlgili rehberler", cta: "Projenizi konuşalım", ctaText: "İlk görüşmede ihtiyacınızı dinler, kapsamı ve sonraki adımları birlikte belirleriz." },
  en: { area: "Service area", areaText: "From our office in İncek we work on projects across Türkiye, first of all in Ankara (İncek, Gölbaşı, Çankaya).", projects: "Related projects", process: "How we work", faq: "Common questions", allServices: "All services", related: "Other services", gainsLabel: "What you gain", gainsTitle: "What this service gives you.", beforeAfterLabel: "Real project · before / after", beforeAfterLink: "Explore the project", before: "Before", after: "After", drag: "Drag to compare", stepsTitle: "How we proceed, step by step", budgetTitle: "What affects the budget?", budgetNote: "A firm fee is discussed once scope and existing conditions have been assessed on site.", checklistTitle: "Common mistakes", guides: "Related guides", cta: "Let's talk about your project", ctaText: "At the first meeting we listen to your brief and agree the scope and next steps together." },
};

export default function ServiceLandingContent({ slug, locale, children }: Readonly<{ slug: string; locale: Locale; children: ReactNode }>) {
  const landing = getServiceLanding(slug);
  const services = useServicesCopy();
  const tm = useTranslations("studio.mascots");

  if (!landing) return null;
  const c = landing.copy[locale];
  const l = LABELS[locale];
  const pricing = c.pricing
    ?.replace("{price}", formatTry(packagePrices.basic, locale))
    .replace("{cafe}", formatTry(packagePrices.cafe, locale))
    .replace("{gym}", formatTry(packagePrices.gym, locale));
  const related = landing.projects.map(getProject).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const beforeAfterProject = landing.beforeAfter ? getProject(landing.beforeAfter) : undefined;
  const relatedGuides = guidesForService(slug);

  return (
    <>
      <PageHeader
        index="03"
        label={c.label}
        titleLines={c.heading.map((line) => withEm(line))}
        intro={<p>{c.intro}</p>}
        image={{ src: landing.image, alt: c.imageAlt ?? c.title }}
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

      {c.gains && c.gains.length > 0 && (
        <section aria-labelledby="landing-gains" className={`${CONTAINER} pt-20 sm:pt-28`}>
          <div className="border-t border-line pt-10">
            <p className="eyebrow text-clay">{l.gainsLabel}</p>
            <h2 id="landing-gains" className="mt-4 max-w-3xl font-serif text-[clamp(2rem,4.6vw,3.5rem)] leading-tight">{l.gainsTitle}</h2>
            <ol className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
              {c.gains.map(([title, body], i) => (
                <li key={title} className="flex flex-col border-t-2 border-clay/70 pt-5">
                  <span className="font-mono text-[12px] tracking-[0.12em] text-clay">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-[21px] leading-snug text-ink">{title}</h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-mute">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {beforeAfterProject?.beforeAfter && (
        <section aria-labelledby="landing-before-after" className={`${CONTAINER} pt-20 sm:pt-28`}>
          <div className="grid grid-cols-1 items-center gap-10 border-t border-line pt-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="eyebrow text-clay">{l.beforeAfterLabel}</p>
              <h2 id="landing-before-after" className="mt-4 font-serif text-[clamp(1.9rem,4vw,3rem)] leading-tight">{beforeAfterProject.title[locale]}</h2>
              <p className="mt-5 text-[16px] leading-relaxed text-mute">{beforeAfterProject.description[locale]}</p>
              <Link href={`/${locale}/projects/${beforeAfterProject.slug}`} className="mt-6 inline-flex min-h-11 items-center gap-3 border-b border-ink/40 pb-1 text-[15px] hover:border-clay hover:text-clay">
                {l.beforeAfterLink} →
              </Link>
            </div>
            <div className="lg:col-span-8">
              <BeforeAfter
                before={{ src: beforeAfterProject.beforeAfter.before.src, alt: beforeAfterProject.beforeAfter.before.alt[locale] }}
                after={{ src: beforeAfterProject.beforeAfter.after.src, alt: beforeAfterProject.beforeAfter.after.alt[locale] }}
                beforeLabel={l.before}
                afterLabel={l.after}
                dragLabel={l.drag}
                aspectClass="aspect-video"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
            </div>
          </div>
        </section>
      )}

      {c.comparison && (
        <section aria-labelledby="landing-comparison" className={`${CONTAINER} pt-20 sm:pt-28`}>
          <div className="border-t border-line pt-10">
            <h2 id="landing-comparison" className="max-w-3xl font-serif text-[clamp(2rem,4.4vw,3.5rem)] leading-tight">{c.comparison.title}</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {c.comparison.options.map((option) => (
                <div key={option.title} className="rounded-[3px] border border-line bg-paper-2/60 p-6 sm:p-8">
                  <h3 className="text-[23px] leading-snug text-ink">{option.title}</h3>
                  <ul className="mt-5 space-y-3">
                    {option.points.map((point) => (
                      <li key={point} className="flex gap-3 text-[16px] leading-relaxed text-ink/85">
                        <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {c.steps && (
        <section aria-labelledby="landing-steps" className={`${CONTAINER} pt-20 sm:pt-28`}>
          <div className="border-t border-line pt-10">
            <p className="eyebrow text-clay">{l.process}</p>
            <h2 id="landing-steps" className="mt-4 max-w-3xl font-serif text-[clamp(2rem,4.4vw,3.5rem)] leading-tight">{l.stepsTitle}</h2>
            <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
              {c.steps.map(([step, body], i) => (
                <li key={step} className="relative border-t border-line pt-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-clay font-mono text-[13px] text-clay">{i + 1}</span>
                  <h3 className="mt-4 text-[19px] leading-snug text-ink">{step}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-mute">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {(c.budgetFactors || c.checklist) && (
        <section aria-label={l.budgetTitle} className={`${CONTAINER} pt-20 sm:pt-28`}>
          <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-2 lg:gap-16">
            {c.budgetFactors && (
              <div>
                <h2 className="font-serif text-[clamp(1.75rem,3.4vw,2.5rem)] leading-tight">{l.budgetTitle}</h2>
                <p className="mt-4 text-[15px] leading-relaxed text-mute">{l.budgetNote}</p>
                <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {c.budgetFactors.map((factor) => (
                    <li key={factor} className="flex gap-3 border-b border-line pb-3 text-[16px] leading-snug text-ink">
                      <span aria-hidden className="text-clay">—</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {c.checklist && (
              <div className="rounded-[3px] bg-paper-2 p-6 sm:p-8">
                <h2 className="font-serif text-[clamp(1.75rem,3.4vw,2.5rem)] leading-tight">{l.checklistTitle}</h2>
                <ul className="mt-6 space-y-4">
                  {c.checklist.map((item) => (
                    <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-ink/90">
                      <span aria-hidden className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#e05a4a] text-[11px] text-[#e05a4a]">×</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {landing.diagram && c.diagramCaption && (
        <div className={`${CONTAINER} pt-16 sm:pt-20`}>
          <DiagramFigure
            src={landing.diagram}
            alt={c.diagramCaption}
            caption={c.diagramCaption}
            items={c.diagramItems}
            locale={locale}
            numbered
            className="max-w-4xl"
          />
        </div>
      )}

      {landing.explainers && (
        <div className={`${CONTAINER} pt-20 sm:pt-28`}>
          <ExplainerStory ids={landing.explainers} locale={locale} />
        </div>
      )}

      {children}
      <section className={`${CONTAINER} pt-20 sm:pt-28`}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>{c.whyTitle}</Eyebrow>
          </div>
          <p className="max-w-3xl text-[clamp(1.25rem,2.4vw,1.75rem)] leading-snug text-ink lg:col-span-8">{c.why}</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow>{l.area}</Eyebrow>
          </div>
          <p className="max-w-3xl text-[17px] leading-relaxed text-ink lg:col-span-8">{l.areaText}</p>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="landing-projects" className={`${CONTAINER} pt-20 sm:pt-28`}>
          <h2 id="landing-projects" className={`text-[clamp(2rem,5vw,4rem)] ${HEADING}`}>
            <LineReveal lines={[l.projects]} />
          </h2>
          <ul className={`mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 ${related.length % 4 === 0 ? "xl:grid-cols-4" : related.length % 3 === 0 ? "xl:grid-cols-3" : "xl:grid-cols-2"}`}>
            {related.map((p, i) => (
              <li key={p.slug} className={related.length % 2 === 1 && i === related.length - 1 ? "sm:col-span-2 xl:col-span-1" : undefined}>
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

      {c.faq && (
        <section aria-labelledby="landing-faq" className={`${CONTAINER} pt-20 sm:pt-28`}>
          <h2 id="landing-faq" className={`text-[clamp(2rem,5vw,4rem)] ${HEADING}`}>
            <LineReveal lines={[l.faq]} />
          </h2>
          <dl className="mt-10 border-t border-line">
            {c.faq.map(([question, answer]) => (
              <div key={question} className="grid grid-cols-1 gap-3 border-b border-line py-6 lg:grid-cols-12 lg:gap-10">
                <dt className="text-[19px] leading-snug text-ink lg:col-span-5">{question}</dt>
                <dd className="text-[17px] leading-relaxed text-mute lg:col-span-7">{answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className={`${CONTAINER} pt-20 sm:pt-28`}><ProjectPreparation locale={locale} /></div>
      {relatedGuides.length > 0 && (
        <section aria-labelledby="landing-guides" className={`${CONTAINER} pt-20 sm:pt-28`}>
          <h2 id="landing-guides" className="eyebrow text-mute">{l.guides}</h2>
          <ul className="mt-6 grid gap-x-8 gap-y-6 border-t border-line pt-6 md:grid-cols-2">
            {relatedGuides.map((guide) => (
              <li key={guide.slug}>
                <Link href={`/${locale}/guides/${guide.slug}`} className="group block">
                  <span className="block text-[clamp(1.15rem,2vw,1.4rem)] font-light leading-snug transition-colors group-hover:text-clay">{guide.copy[locale].title} →</span>
                  <span className="mt-2 block text-[15px] leading-relaxed text-mute">{guide.copy[locale].description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section aria-labelledby="landing-related" className={`${CONTAINER} pt-20 sm:pt-28`}>
        <h2 id="landing-related" className="eyebrow text-mute">{l.related}</h2>
        <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-3">
          {SERVICE_LANDINGS.filter((item) => item.slug !== slug).map((item) => (
            <li key={item.slug}>
              <Link
                href={`/${locale}/services/${item.slug}`}
                className="inline-flex min-h-11 items-center border border-line px-4 py-2 text-[15px] text-ink transition-colors hover:border-clay hover:text-clay"
              >
                {item.copy[locale].crumb}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className={`${CONTAINER} pb-28 pt-20 sm:pb-40 sm:pt-28`}>
        <div className="flex flex-col gap-6 border-t border-line pt-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-2xl flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-8">
            <MascotDuo pose="cheer" size="sm" message={tm("service")} className="shrink-0" />
            <div>
              <h2 className={`text-[clamp(2rem,4.5vw,3.5rem)] ${HEADING}`}>{l.cta}</h2>
              <p className="mt-4 text-[16px] leading-relaxed text-mute">{l.ctaText}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <CallCta
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
