"use client";

import Link from "next/link";
import CallCta from "@/components/studio/CallCta";
import { useLocale, useTranslations } from "next-intl";
import { studioInfo } from "@/lib/studio-info";
import GoogleRating from "./GoogleRating";

type FooterServiceLink = Readonly<{ slug: string; label: string }>;

export default function SiteFooter({ services }: Readonly<{ services: readonly FooterServiceLink[] }>) {
  const t = useTranslations("studio");
  const locale = useLocale() === "en" ? "en" : "tr";

  const prefix = `/${locale}`;
  const year = new Date().getFullYear();

  const pages = [
    { href: `${prefix}/projects`, label: t("nav.work") },
    { href: `${prefix}/about`, label: t("nav.studio") },
    { href: `${prefix}/services`, label: t("nav.services") },
    { href: `${prefix}/contact`, label: t("nav.contact") },
    { href: `${prefix}/glossary`, label: t("nav.glossary") },
    { href: `${prefix}/guides`, label: t("nav.guides") },
  ];

  return (
    <footer className="relative overflow-hidden bg-night text-bone">
      <div className="mx-auto max-w-[2560px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 border-b border-bone/10 py-20 md:grid-cols-12 xl:grid-cols-[repeat(5,auto)] xl:justify-between">
          <div className="md:col-span-5 xl:col-span-1">
            <p className="eyebrow text-bone/85">{t("footer.studio")}</p>
            <p className="mt-6 max-w-md font-serif text-4xl leading-[1.05] sm:text-5xl">
              {t.rich("footer.tagline", { br: () => <br /> })}
            </p>
            <CallCta
              arrow={<span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>}
              className="group mt-10 inline-flex min-h-11 items-center gap-4 border-b border-bone/40 pb-2 text-lg hover:border-clay hover:text-clay"
            />
          </div>

          <div className="md:col-span-2 md:col-start-10 md:row-start-1 xl:col-span-1 xl:col-start-auto xl:row-start-auto">
            <p className="eyebrow text-bone/85">{t("footer.pages")}</p>
            <ul className="mt-6 space-y-2 text-[15px]">
              {pages.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="text-bone/95 hover:text-clay">{p.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 xl:col-span-1">
            <p className="eyebrow text-bone/85">{t("nav.services")}</p>
            <ul className="mt-6 space-y-2 text-[15px]">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`${prefix}/services/${s.slug}`} className="text-bone/95 hover:text-clay">{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 xl:col-span-1">
            <p className="eyebrow text-bone/85">{t("footer.social")}</p>
            <ul className="mt-6 space-y-2 text-[15px]">
              <li>
                <a href={studioInfo.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-bone/80 hover:text-bone">
                  Instagram ↗
                </a>
              </li>
              <li>
                <a href={studioInfo.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-bone/80 hover:text-bone">
                  Google Maps ↗
                </a>
              </li>
              <li>
                <a href={studioInfo.yandexMapsUrl} target="_blank" rel="noopener noreferrer" className="text-bone/80 hover:text-bone">
                  Yandex Maps ↗
                </a>
              </li>
              <li>
                <a href={studioInfo.armutUrl} target="_blank" rel="noopener noreferrer" className="text-bone/80 hover:text-bone">
                  Armut ↗
                </a>
              </li>
              <li>
                <a href={studioInfo.peyzajRehberUrl} target="_blank" rel="noopener noreferrer" className="text-bone/80 hover:text-bone">
                  Peyzaj Rehber ↗
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 md:col-start-7 md:row-start-1 xl:col-span-1 xl:col-start-auto xl:row-start-auto">
            <p className="eyebrow text-bone/85">{t("footer.contact")}</p>
            <address className="mt-6 space-y-1 not-italic text-[16px] leading-relaxed text-bone/95">
              <a href={studioInfo.mapsUrl} target="_blank" rel="noopener noreferrer" className="block whitespace-pre-line hover:text-bone">
                {t("footer.address")}
              </a>
              <a href={`mailto:${studioInfo.email}`} className="block pt-4 hover:text-bone">{studioInfo.email}</a>
              <a href={studioInfo.phoneHref} className="block hover:text-bone">{studioInfo.phoneDisplay}</a>
            </address>
            <GoogleRating className="mt-6 text-bone" />
          </div>
        </div>

        <div className="pointer-events-none select-none pt-10" aria-hidden>
          <p aria-hidden className="display whitespace-nowrap text-[24vw] leading-[0.78] text-bone/20 -mb-[3vw] before:content-['U+_Studio']" />
        </div>

        <div className="relative flex flex-col-reverse gap-4 border-t border-bone/25 py-6 font-mono text-[min(13px,3.15vw)] uppercase tracking-[0.05em] text-bone/85 sm:flex-row sm:items-center sm:justify-between sm:text-[13px] sm:tracking-[0.1em]">
          <span className="whitespace-nowrap">© {year} U+ Studio — {t("footer.rights")}</span>
          <Link href={`${prefix}/kvkk`} className="hover:text-bone">{t("footer.privacy")}</Link>
          <button
            type="button"
            onClick={() => globalThis.scrollTo({ top: 0, behavior: globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}
            className="text-left hover:text-bone"
          >
            {t("footer.backToTop")} ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
