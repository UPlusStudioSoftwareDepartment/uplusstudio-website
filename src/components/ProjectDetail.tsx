"use client";

import Image from "next/image";
import BookingCta from "@/components/studio/BookingCta";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import BeforeAfter from "@/components/studio/BeforeAfter";
import FramedImage from "@/components/studio/FramedImage";
import { MascotDuo } from "@/components/mascots/Mascots";
import InViewVideo from "@/components/studio/InViewVideo";
import Fullscreenable from "@/components/studio/Fullscreenable";
import { Eyebrow, FadeUp, LineReveal, MaskReveal } from "@/components/studio/Reveal";
import { useAppointment } from "@/contexts/AppointmentContext";
import { getAdjacentProject, getProject, projectNumber, screenPoster, type ProjectImage } from "@/lib/projects";
import { SERVICE_LANDINGS } from "@/lib/serviceLandings";
import { icons } from "@/components/studio/SocialLinks";
import type { Locale } from "@/lib/i18n-config";

const isPortrait = (img: { width: number; height: number }) => img.height > img.width;

export default function ProjectDetail({ slug }: Readonly<{ slug: string }>) {
  const project = getProject(slug)!;
  const nextProject = getAdjacentProject(slug);
  const locale = useLocale() as Locale;
  const t = useTranslations("studio");
  const { openAppointment } = useAppointment();

  const portraitCover = isPortrait(project.cover);
  const category = t(`work.categories.${project.category}`);
  const landings = SERVICE_LANDINGS.filter((s) => s.projects.includes(slug));

  return (
    <article className="text-ink">
      <header className="relative min-h-[100svh] overflow-hidden bg-night text-bone">
        {portraitCover ? (
          <div className="absolute inset-y-0 right-0 w-full md:w-[46%]">
            <Image src={project.cover.src} alt={project.cover.alt[locale]} fill priority fetchPriority="high" sizes="(min-width:768px) 46vw, 100vw" className="object-cover opacity-70 md:opacity-100" />
          </div>
        ) : (
          <div className="absolute inset-0 animate-[settle_2.2s_var(--ease-out-studio)_backwards] [--settle:1.08] motion-reduce:animate-none">
            <Image src={project.cover.src} alt={project.cover.alt[locale]} fill priority fetchPriority="high" sizes="100vw" className="object-cover" />
          </div>
        )}
        <div
          className={`absolute inset-0 ${portraitCover ? "bg-linear-to-t from-paper via-night/60 to-night/30 md:bg-linear-to-r md:from-paper md:via-night/80 md:to-transparent" : "bg-linear-to-t from-paper via-night/25 to-night/50"}`}
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[2560px] flex-col justify-end px-4 pb-10 pt-32 sm:px-8 lg:px-12">
          <Link href={`/${locale}/projects`} className="eyebrow mb-auto inline-flex w-fit items-center gap-2 text-bone/70 hover:text-bone">
            ← {t("project.back")}
          </Link>
          <p className="eyebrow mt-16 animate-[rise_0.9s_var(--ease-out-studio)_0.2s_backwards] text-bone/70 [--rise:10px] motion-reduce:animate-none">
            {projectNumber(slug)} — {category}
          </p>
          <h1 className={`display mt-6 text-[clamp(min(3rem,14vw),9vw,9rem)] ${portraitCover ? "md:max-w-[55%]" : "max-w-[14ch]"}`}>
            <LineReveal lines={[project.title[locale]]} immediate delay={0.3} />
          </h1>
          <p className={`mt-8 animate-[rise_1s_var(--ease-out-studio)_backwards] font-serif text-2xl italic leading-snug text-bone/85 [--rise:16px] motion-reduce:animate-none sm:text-3xl ${portraitCover ? "md:max-w-[45%]" : "max-w-2xl"}`}>
            {project.tagline[locale]}
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[2560px] px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <dl className="grid grid-cols-2 content-start gap-x-8 lg:col-span-4 lg:grid-cols-1">
            {[
              { label: t("project.category"), value: category },
              { label: t("project.studio"), value: "U+ Studio" },
              { label: t("project.scope"), value: project.scope.map((s) => s[locale]).join("\n") },
              ...(project.status ? [{ label: t("project.status"), value: project.status[locale] }] : []),
            ].map((row) => (
              <div key={row.label} className="border-t border-line py-5">
                <dt className="eyebrow text-mute">{row.label}</dt>
                <dd className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink">{row.value}</dd>
              </div>
            ))}
            {landings.length > 0 && (
              <div className="border-t border-line py-5">
                <dt className="eyebrow text-mute">{t("nav.services")}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-ink">
                  {landings.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/${locale}/services/${s.slug}`}
                      className="block w-fit underline decoration-ink/30 underline-offset-4 transition-colors not-first:mt-2 hover:text-clay hover:decoration-clay"
                    >
                      {s.copy[locale].title} →
                    </Link>
                  ))}
                </dd>
              </div>
            )}
          </dl>
          <FadeUp className="lg:col-span-7 lg:col-start-6">
            <p className="text-[clamp(1.4rem,2.4vw,2.25rem)] font-light leading-[1.3] tracking-[-0.015em] text-ink">
              {project.description[locale]}
            </p>
            {project.story && (
              <div className="mt-8 max-w-2xl space-y-5 text-[17px] leading-relaxed text-ink/85">
                {project.story.map((paragraph) => (
                  <p key={paragraph.en}>{paragraph[locale]}</p>
                ))}
              </div>
            )}
            {project.post && (
              <a
                href={project.post}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 underline decoration-ink/30 underline-offset-4 transition-colors hover:text-clay hover:decoration-clay"
              >
                {icons.linkedin}
                {t("project.post")}
              </a>
            )}
          </FadeUp>
        </div>
      </section>

      {project.video && (
        <section className="bg-night py-20 text-bone sm:py-28">
          <div className="mx-auto max-w-[2560px] px-4 sm:px-8 lg:px-12">
            <Eyebrow tone="light" className="mb-10">{t("project.film")}</Eyebrow>
            <FadeUp>
              <div
                className={`relative mx-auto overflow-hidden ${isPortrait(project.video) ? "aspect-[9/16] w-[min(100%,calc(min(82svh,900px)*9/16))]" : "w-full"}`}
                style={isPortrait(project.video) ? undefined : { aspectRatio: `${project.video.width} / ${project.video.height}` }}
              >
                <Fullscreenable className="absolute inset-0">
                  <InViewVideo src={project.video.src} poster={screenPoster(project.video)} className="h-full w-full object-contain" label={project.title[locale]} />
                </Fullscreenable>
              </div>
            </FadeUp>
            <Link
              href={`/${locale}/projects/${slug}/video`}
              className="mx-auto mt-8 flex w-fit items-center gap-3 font-mono text-[12px] uppercase tracking-[0.12em] text-bone/75 underline decoration-bone/30 underline-offset-4 transition-colors hover:text-bone"
            >
              {t("project.watch")} <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
      )}

      {project.beforeAfter && (
        <section className="mx-auto max-w-[2560px] px-4 pt-24 sm:px-8 sm:pt-36 lg:px-12">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <Eyebrow>{t("transform.label")}</Eyebrow>
            <p className="max-w-sm text-[15px] text-mute">{t("transform.body")}</p>
          </div>
          <Fullscreenable
            className={`relative data-[fullscreen]:[&>div]:h-full data-[fullscreen]:[&>div]:w-auto ${isPortrait(project.beforeAfter.after) ? "mx-auto max-w-md" : ""}`}
          >
            <BeforeAfter
              before={{ src: project.beforeAfter.before.src, alt: project.beforeAfter.before.alt[locale] }}
              after={{ src: project.beforeAfter.after.src, alt: project.beforeAfter.after.alt[locale] }}
              beforeLabel={t("transform.before")}
              afterLabel={t("transform.after")}
              dragLabel={t("transform.drag")}
              aspectClass={isPortrait(project.beforeAfter.after) ? "aspect-[9/16]" : "aspect-video"}
              sizes={isPortrait(project.beforeAfter.after) ? "448px" : "100vw"}
            />
          </Fullscreenable>
        </section>
      )}

      {project.gallery.length > 0 && (
        <section className="mx-auto max-w-[2560px] px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
          <Eyebrow className="mb-12">{t("project.gallery")}</Eyebrow>
          <Gallery images={project.gallery} locale={locale} />
        </section>
      )}

      <section className="mx-auto max-w-[2560px] px-4 pb-24 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 border-y border-line py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:gap-6">
            <MascotDuo pose="wave" size="sm" />
            <div>
              <p className="font-serif text-lg italic text-mute">{t("mascots.project")}</p>
              <p className="mt-1 text-2xl font-light tracking-[-0.02em] sm:text-3xl">{t("project.similar")}</p>
            </div>
          </div>
          <BookingCta
            onBook={openAppointment}
            label={t("nav.appointment")}
            arrow={<span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>}
            className="group inline-flex min-h-12 items-center justify-between gap-4 border border-ink bg-transparent px-7 py-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night hover:text-bone"
          />
        </div>
      </section>

      <Link href={`/${locale}/projects/${nextProject.slug}`} className="group relative block overflow-hidden bg-night text-bone">
        <Image
          src={nextProject.cover.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40 transition-[opacity,transform,scale,translate] duration-[1.2s] group-hover:scale-[1.03] group-hover:opacity-60"
        />
        <div className="relative mx-auto flex min-h-[60svh] max-w-[2560px] flex-col justify-end px-4 py-14 sm:px-8 lg:px-12">
          <span className="eyebrow text-bone/70">{t("project.next")} — {projectNumber(nextProject.slug)}</span>
          <span className="display mt-6 flex items-end justify-between gap-6 text-[clamp(2.75rem,8vw,8rem)]">
            {nextProject.title[locale]}
            <span className="mb-[0.15em] text-[0.4em] transition-transform duration-500 group-hover:translate-x-2" aria-hidden>→</span>
          </span>
        </div>
      </Link>
    </article>
  );
}

function Gallery({ images, locale }: Readonly<{ images: ProjectImage[]; locale: Locale }>) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      {images.map((img, i) => (
        <MaskReveal key={img.src} delay={(i % 2) * 0.1}>
          <Fullscreenable className="relative aspect-[3/2]">
            <FramedImage src={img.src} alt={img.alt[locale]} sizes="(min-width:768px) 50vw, 100vw" />
          </Fullscreenable>
          <p className="mt-3 font-mono text-[12px] text-mute">{img.alt[locale]}</p>
        </MaskReveal>
      ))}
    </div>
  );
}
