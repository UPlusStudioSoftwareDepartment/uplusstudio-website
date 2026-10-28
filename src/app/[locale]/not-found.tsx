"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { m, useReducedMotion } from "framer-motion";
import { EASE_OUT, EASE_STUDIO } from "@/components/studio/Reveal";
import { MascotDuo } from "@/components/mascots/Mascots";

export default function LocaleNotFound() {
  const locale = useLocale();
  const t = useTranslations("common");
  const tm = useTranslations("studio.mascots");
  const reduce = useReducedMotion();

  return (
    <section className="relative mx-auto flex min-h-[100svh] max-w-[2560px] flex-col justify-center px-4 pb-20 pt-32 sm:px-8 lg:px-12">
      <m.p
        className="eyebrow flex flex-wrap items-center gap-x-4 gap-y-2 text-mute"
        initial={reduce ? false : { opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      >
        <span className="text-ink">Err</span>
        <span className="h-px w-10 bg-ink/40" aria-hidden />
        <span>{t("notFound")}</span>
      </m.p>

      <h1 className="display mt-8 overflow-hidden pb-[0.06em] text-[clamp(8rem,32vw,30rem)] leading-[0.82] text-ink">
        <m.span
          className="block"
          initial={reduce ? false : { y: "105%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 1.1, ease: EASE_STUDIO, delay: 0.1 }}
        >
          4<em className="font-serif font-normal italic tracking-normal">0</em>4
        </m.span>
        <span className="sr-only"> — {t("notFound")}</span>
      </h1>

      <m.div
        className="mt-10 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-baseline sm:justify-between"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.5 }}
      >
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute">
          {`/${locale}`} · {t("notFound")}
        </p>
        <MascotDuo pose="think" size="sm" message={tm("notFound")} className="self-start sm:self-auto" />
        <Link
          href={`/${locale}`}
          className="group inline-flex items-center gap-3 self-start border-b border-ink pb-1 text-[17px] text-ink hover:border-clay hover:text-clay"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1" aria-hidden>←</span>
          {t("backHome")}
        </Link>
      </m.div>
    </section>
  );
}
