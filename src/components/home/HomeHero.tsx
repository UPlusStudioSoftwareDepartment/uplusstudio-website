"use client";

import { useEffect, useRef, useState } from "react";
import BookingCta from "@/components/studio/BookingCta";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { LineReveal, EASE_OUT } from "@/components/studio/Reveal";
import { useAppointment } from "@/contexts/AppointmentContext";
import { Hayzer, Rayzer, HIGH_FIVE } from "@/components/mascots/Mascots";
import { projects, projectNumber } from "@/lib/projects";
import type { Locale } from "@/lib/i18n-config";

const CELEBRATION_S = HIGH_FIVE.duration;
const JUMP = {
  y: [0, 2, -18, -22, -22, -20, 0, -3, 0],
  scaleY: [1, 0.86, 1.1, 1, 1, 1, 0.88, 1.04, 1],
  scaleX: [1, 1.1, 0.94, 1, 1, 1, 1.1, 0.98, 1],
};

const VIDEO = {
  large: "/media/video/villa-transformation.mp4",
  small: "/media/video/villa-transformation-sm.mp4",
  poster: "/media/video/villa-transformation.jpg",
};

export default function HomeHero() {
  const t = useTranslations("studio");
  const locale = useLocale() as Locale;
  const reduce = useReducedMotion();
  const { openAppointment } = useAppointment();
  const [celebrating, setCelebrating] = useState(false);
  const [mascotsHovered, setMascotsHovered] = useState(false);

  const celebrate = () => {
    if (reduce || celebrating) return;
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), CELEBRATION_S * 1000);
  };
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const featured = projects.filter((p) => p.featured);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce) return;
    video.src = globalThis.innerWidth < 768 ? VIDEO.small : VIDEO.large;
    video.play().catch(() => {});
  }, [reduce]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const video = videoRef.current;
      if (video?.duration && progressRef.current) {
        progressRef.current.style.transform = `scaleX(${video.currentTime / video.duration})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const fadeIn = (delay: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE_OUT, delay } };

  return (
    <section id="home" className="relative h-[100svh] min-h-[540px] overflow-hidden bg-night text-bone">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: EASE_OUT }}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover object-[50%_55%]"
          poster={VIDEO.poster}
          muted
          loop
          playsInline
          preload="auto"
          aria-label={t("motion.items.villa")}
          disableRemotePlayback
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-night/60 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-linear-to-t from-night/90 via-night/45 to-transparent" aria-hidden />

      <div className="relative z-10 mx-auto flex h-full max-w-[2560px] flex-col justify-end px-4 pb-6 sm:px-8 sm:pb-10 lg:px-12">
        <motion.p className="eyebrow mb-5 text-bone/75 sm:mb-8" {...fadeIn(0.2)}>
          {t("hero.eyebrow")}
          <span className="mt-1.5 block text-bone sm:ml-3 sm:mt-0 sm:inline">
            <span className="mr-3 hidden text-bone/40 sm:inline" aria-hidden>·</span>
            {t("hero.place")}
          </span>
        </motion.p>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <h1 className="display text-[clamp(2.6rem,8vw,9rem)]">
            <span className="sr-only">U+ Studio — </span>
            <LineReveal
              immediate
              delay={0.35}
              lines={[t("hero.line1"), t("hero.line2"), <em key="l3" className="font-serif font-normal italic tracking-normal">{t("hero.line3")}</em>]}
            />
          </h1>

          <motion.div className="inline-flex w-fit flex-col items-stretch self-start lg:mb-5 lg:self-end" {...fadeIn(1)}>
            <motion.p
              className="w-0 min-w-full text-center font-serif text-[15px] italic leading-snug text-bone/90"
              animate={celebrating ? { y: JUMP.y } : { y: 0 }}
              transition={{ duration: CELEBRATION_S, times: HIGH_FIVE.times, ease: "easeInOut" }}
            >
              {t("mascots.hero")}
            </motion.p>
            <div className="relative z-10 mx-auto -mb-[3px] mt-1 flex w-28 justify-between self-center" aria-hidden onMouseEnter={() => setMascotsHovered(true)} onMouseLeave={() => setMascotsHovered(false)}>
              <motion.div
                style={{ originY: 1 }}
                animate={celebrating ? { ...JUMP, x: [0, 0, 0, 0, 0, 0, 0, 0, 0], rotate: [0, -3, 17, 19, 19, 17, 0, 0, 0] } : { y: 0, x: 0, scaleX: 1, scaleY: 1, rotate: 0 }}
                transition={{ duration: CELEBRATION_S, times: HIGH_FIVE.times, ease: "easeInOut" }}
              >
                <Hayzer pose={celebrating ? "highfive" : "wave"} joy={mascotsHovered} className="-mr-2 h-16 w-16" />
              </motion.div>
              <motion.div
                style={{ originY: 1 }}
                animate={celebrating ? { ...JUMP, x: [0, 0, 0, 0, 0, 0, 0, 0, 0], rotate: [0, 3, -17, -19, -19, -17, 0, 0, 0] } : { y: 0, x: 0, scaleX: 1, scaleY: 1, rotate: 0 }}
                transition={{ duration: CELEBRATION_S, times: HIGH_FIVE.times, ease: "easeInOut" }}
              >
                <Rayzer pose={celebrating ? "highfive" : "idle"} joy={mascotsHovered} className="-ml-2 h-16 w-16" />
              </motion.div>
              <motion.svg
                viewBox="-20 -20 40 40"
                className="pointer-events-none absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2 overflow-visible"
                initial={{ opacity: 0, scale: 0.2, y: -8 }}
                animate={
                  celebrating
                    ? { opacity: [0, 0, 1, 1, 0], scale: [0.2, 0.2, 0.6, 1.25, 1.5], y: -8 }
                    : { opacity: 0, scale: 0.2, y: -8 }
                }
                transition={{ duration: CELEBRATION_S, times: [0, HIGH_FIVE.contact - 0.01, HIGH_FIVE.contact, 0.44, 0.56] }}
                aria-hidden
              >
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <line key={deg} x1="0" y1="-9" x2="0" y2="-16" stroke="#ffd968" strokeWidth="2.4" strokeLinecap="round" transform={`rotate(${deg})`} />
                ))}
                <circle r="6" fill="none" stroke="#ede9e1" strokeWidth="1.5" />
                <path d="M0 -4 L1.2 -1.2 L4 0 L1.2 1.2 L0 4 L-1.2 1.2 L-4 0 L-1.2 -1.2 Z" fill="#fff6d6" />
              </motion.svg>
            </div>
            <BookingCta
              onBook={openAppointment}
              onMouseEnter={celebrate}
              label={t("nav.appointment")}
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-bone/50 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.12em] text-bone transition-colors hover:border-bone hover:bg-night"
            />
          </motion.div>
        </div>

        <motion.div
          className="mt-8 grid grid-cols-1 gap-6 border-t border-bone/25 pt-5 sm:mt-12 md:grid-cols-12 md:items-start"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <p className="eyebrow hidden text-bone/60 md:col-span-2 md:block">{t("hero.location")}</p>

          <Link href={`/${locale}/projects/villa-donusumu`} className="group md:col-span-4">
            <span className="eyebrow block text-bone/55">{t("hero.featured")}</span>
            <span className="mt-2 flex items-center gap-3 text-[15px]">
              {t("hero.featuredProject")}
              <span className="transition-transform duration-500 group-hover:translate-x-1" aria-hidden>→</span>
            </span>
            <span className="mt-3 block h-px w-full bg-bone/20">
              <span ref={progressRef} className="block h-full origin-left bg-bone" style={{ transform: "scaleX(0)" }} />
            </span>
          </Link>

          <ul className="hidden md:col-span-5 md:col-start-8 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-2">
            {featured.map((p) => (
              <li key={p.slug}>
                <Link href={`/${locale}/projects/${p.slug}`} className="group flex items-baseline gap-3 text-[14px] text-bone/70 hover:text-bone">
                  <span className="font-mono text-[11px] text-bone/60">{projectNumber(p.slug)}</span>
                  <span className="border-b border-transparent group-hover:border-bone/60">{p.title[locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
