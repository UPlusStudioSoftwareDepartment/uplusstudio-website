import Link from "next/link";
import { getTranslations } from "next-intl/server";
import FramedImage from "@/components/studio/FramedImage";
import { Eyebrow } from "@/components/studio/Reveal";
import { SERVICE_LANDINGS } from "@/lib/serviceLandings";
import { projects, projectNumber, coverSizes } from "@/lib/projects";
import type { Locale } from "@/lib/i18n-config";

const MORE_LINK = "group inline-flex min-h-11 items-center gap-3 border-b border-ink/40 pb-1 text-[15px] transition-colors hover:border-clay hover:text-clay";
const ARROW = <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>;

export default async function HomeStudio({ locale }: Readonly<{ locale: Locale }>) {
  const t = await getTranslations({ locale, namespace: "studio" });
  const prefix = `/${locale}`;
  const featured = projects.filter((p) => p.featured);

  return (
    <div className="relative bg-paper text-ink">
      <div className="mx-auto max-w-[2560px] px-4 sm:px-8 lg:px-12">
        <section className="py-20 sm:py-28">
          <Eyebrow>{t("intro.label")}</Eyebrow>
          <p className="mt-6 max-w-4xl font-serif text-[clamp(1.75rem,5.5vw,3.5rem)] leading-[1.15]">
            {t("intro.statementA")} <em>{t("intro.statementItalic")}</em> {t("intro.statementB")}
          </p>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-mute">{t("intro.place")}</p>
          <Link href={`${prefix}/about`} className={`${MORE_LINK} mt-8`}>
            {t("intro.more")} {ARROW}
          </Link>
        </section>

        <section className="border-t border-line py-20 sm:py-28">
          <Eyebrow>{t("nav.services")}</Eyebrow>
          <h2 className="display -ml-[0.075em] mt-5 text-[clamp(2.5rem,9vw,5.5rem)]">{t("disciplines.title")}</h2>
          <ul className="mt-10 border-t border-line">
            {SERVICE_LANDINGS.map((service, i) => (
              <li key={service.slug} className="border-b border-line">
                <Link href={`${prefix}/services/${service.slug}`} className="group flex min-h-16 items-center gap-4 py-4">
                  <span className="font-mono text-[12px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-[clamp(1.25rem,4.5vw,2rem)] font-light tracking-[-0.02em] transition-colors group-hover:text-clay">
                    {service.copy[locale].crumb}
                  </span>
                  {ARROW}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`${prefix}/services`} className={`${MORE_LINK} mt-8`}>
            {t("disciplines.cta")} {ARROW}
          </Link>
        </section>

        <section className="border-t border-line py-20 sm:py-28">
          <Eyebrow>{t("work.label")}</Eyebrow>
          <h2 className="display -ml-[0.075em] mt-5 text-[clamp(2.5rem,9vw,5.5rem)]">{t("work.title")}</h2>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-mute">{t("work.intro")}</p>
          <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2">
            {featured.map((project) => (
              <li key={project.slug}>
                <Link href={`${prefix}/projects/${project.slug}`} className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden bg-paper-2">
                    <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
                      <FramedImage src={project.cover.src} alt={project.cover.alt[locale]} sizes={coverSizes(project.cover)} />
                    </div>
                  </div>
                  <div className="mt-5 flex items-baseline gap-4 border-t border-line pt-4">
                    <span className="font-mono text-[12px] text-mute">{projectNumber(project.slug)}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-2xl font-light tracking-[-0.02em] transition-colors group-hover:text-clay sm:text-3xl">{project.title[locale]}</h3>
                      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-mute">{project.tagline[locale]}</p>
                    </div>
                    <span className="eyebrow hidden shrink-0 text-mute sm:block">{t(`work.categories.${project.category}`)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`${prefix}/projects`} className={`${MORE_LINK} mt-12`}>
            {t("work.viewAll")} {ARROW}
          </Link>
        </section>
      </div>
    </div>
  );
}
