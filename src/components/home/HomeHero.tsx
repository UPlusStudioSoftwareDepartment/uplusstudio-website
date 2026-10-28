"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import BookingCta from "@/components/studio/BookingCta";
import SocialLinks from "@/components/studio/SocialLinks";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { m, useReducedMotion } from "framer-motion";
import { LineReveal } from "@/components/studio/Reveal";
import { useAppointment } from "@/contexts/AppointmentContext";
import { DesignerMascot, BuilderMascot, HIGH_FIVE } from "@/components/mascots/Mascots";
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
  poster: "/media/video/villa-transformation.webp",
  music: "/media/audio/villa-transformation.aac",
};
const MUSIC_DRIFT_S = 0.25;
const FILM_LABEL = { stopped: "playFilm", silent: "unmuteFilm", audible: "stopFilm" } as const;

const videoSource = () => (globalThis.innerWidth < 768 ? VIDEO.small : VIDEO.large);

function followFilm(video: HTMLVideoElement | null, music: HTMLAudioElement | null) {
  if (!video || !music || video.paused) return;
  if (!music.src) music.src = VIDEO.music;
  if (Math.abs(music.currentTime - video.currentTime) > MUSIC_DRIFT_S) music.currentTime = video.currentTime;
  music.play().catch(() => {});
}

export default function HomeHero() {
  const t = useTranslations("studio");
  const locale = useLocale() as Locale;
  const reduce = useReducedMotion();
  const { openAppointment } = useAppointment();
  const [celebrating, setCelebrating] = useState(false);
  const [mascotsHovered, setMascotsHovered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const film = !playing ? "stopped" : musicOn ? "audible" : "silent";

  const celebrate = () => {
    if (reduce || celebrating) return;
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), CELEBRATION_S * 1000);
  };
  const videoRef = useRef<HTMLVideoElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const filmButtonRef = useRef<HTMLButtonElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const featured = projects.filter((p) => p.featured);

  preload(VIDEO.poster, { as: "image", fetchPriority: "high" });

  const playMusic = () => followFilm(videoRef.current, musicRef.current);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce) return;
    const start = () => {
      video.src = videoSource();
      video.play().catch(() => {});
    };
    const unmute = (e: Event) => {
      if (musicRef.current?.paused && !filmButtonRef.current?.contains(e.target as Node)) followFilm(video, musicRef.current);
    };
    if (document.readyState === "complete") start();
    else globalThis.addEventListener("load", start, { once: true });
    document.addEventListener("pointerup", unmute);
    document.addEventListener("keydown", unmute);
    return () => {
      globalThis.removeEventListener("load", start);
      document.removeEventListener("pointerup", unmute);
      document.removeEventListener("keydown", unmute);
    };
  }, [reduce]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const video = videoRef.current;
      const music = musicRef.current;
      if (video?.duration && progressRef.current) {
        progressRef.current.style.transform = `scaleX(${video.currentTime / video.duration})`;
      }
      if (video && music && !music.paused && Math.abs(music.currentTime - video.currentTime) > MUSIC_DRIFT_S) music.currentTime = video.currentTime;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggleFilm = () => {
    const video = videoRef.current;
    if (!video) return;
    if (film === "audible") {
      video.pause();
      return;
    }
    if (film === "silent") {
      playMusic();
      return;
    }
    if (!video.src) video.src = videoSource();
    if (video.ended) video.currentTime = 0;
    video.play().catch(() => {});
    playMusic();
  };

  return (
    <section id="home" className="relative h-[100svh] min-h-[540px] overflow-hidden bg-night text-bone">
      <div className="absolute inset-0 animate-[settle_2s_var(--ease-out-studio)_backwards] [--settle:1.06] motion-reduce:animate-none">
        <video
          ref={videoRef}
          className="h-full w-full object-cover object-[50%_55%]"
          poster={VIDEO.poster}
          muted
          playsInline
          preload="none"
          aria-label={t("motion.items.villa")}
          disableRemotePlayback
          onPlay={() => setPlaying(true)}
          onPlaying={playMusic}
          onWaiting={() => musicRef.current?.pause()}
          onPause={() => {
            setPlaying(false);
            musicRef.current?.pause();
          }}
        />
        <audio ref={musicRef} preload="none" onPlay={() => setMusicOn(true)} onPause={() => setMusicOn(false)} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-night/60 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-linear-to-t from-night/90 via-night/45 to-transparent" aria-hidden />

      <div className="relative z-10 mx-auto flex h-full max-w-[2560px] flex-col px-4 pb-6 pt-[8.75rem] [justify-content:safe_flex-end] sm:px-8 sm:pb-10 sm:pt-32 lg:px-12 [@media(max-height:560px)]:pb-3 [@media(max-height:560px)]:pt-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12 [@media(max-height:560px)]:flex-row [@media(max-height:560px)]:items-end [@media(max-height:560px)]:justify-between [@media(max-height:560px)]:gap-4">
          <h1 className="display min-w-0 text-[clamp(1.9rem,min(8vw,10dvh),9rem)] max-sm:flex max-sm:flex-col">
            <span className="sr-only">U+ Studio — </span>
            <span className="eyebrow mb-5 block animate-[rise_0.9s_var(--ease-out-studio)_backwards] font-normal leading-normal text-bone/75 [--rise:12px] motion-reduce:animate-none max-sm:order-last max-sm:mb-0 max-sm:mt-4 max-sm:[animation-delay:0.9s] sm:mb-8 [@media(max-height:560px)]:mb-2">
              {t("hero.eyebrow")}
            </span>
            <LineReveal
              immediate
              delay={0.35}
              lines={[t("hero.line1"), t("hero.line2"), <em key="l3" className="font-serif font-normal italic tracking-normal">{t("hero.line3")}</em>]}
            />
          </h1>

          <div className="inline-flex w-fit shrink-0 flex-col items-stretch self-start lg:mb-5 lg:self-end">
            <m.p
              className="w-0 min-w-full animate-[rise_0.9s_var(--ease-out-studio)_backwards] text-center font-serif text-[15px] italic leading-snug text-bone/90 [--rise:12px] motion-reduce:animate-none [@media(max-height:600px)]:hidden"
              animate={celebrating ? { y: JUMP.y } : { y: 0 }}
              transition={{ duration: CELEBRATION_S, times: HIGH_FIVE.times, ease: "easeInOut" }}
            >
              {t("mascots.hero")}
            </m.p>
            <div className="relative z-10 -mb-[3px] mt-1 flex w-[4.75rem] animate-[rise_0.9s_var(--ease-out-studio)_1s_backwards] justify-between self-center [--rise:12px] motion-reduce:animate-none sm:mx-auto sm:w-28" aria-hidden onMouseEnter={() => setMascotsHovered(true)} onMouseLeave={() => setMascotsHovered(false)}>
              <m.div
                style={{ originY: 1 }}
                animate={celebrating ? { ...JUMP, x: [0, 0, 0, 0, 0, 0, 0, 0, 0], rotate: [0, -3, 17, 19, 19, 17, 0, 0, 0] } : { y: 0, x: 0, scaleX: 1, scaleY: 1, rotate: 0 }}
                transition={{ duration: CELEBRATION_S, times: HIGH_FIVE.times, ease: "easeInOut" }}
              >
                <DesignerMascot pose={celebrating ? "highfive" : "wave"} joy={mascotsHovered} className="-mr-1.5 h-11 w-11 sm:-mr-2 sm:h-16 sm:w-16" />
              </m.div>
              <m.div
                style={{ originY: 1 }}
                animate={celebrating ? { ...JUMP, x: [0, 0, 0, 0, 0, 0, 0, 0, 0], rotate: [0, 3, -17, -19, -19, -17, 0, 0, 0] } : { y: 0, x: 0, scaleX: 1, scaleY: 1, rotate: 0 }}
                transition={{ duration: CELEBRATION_S, times: HIGH_FIVE.times, ease: "easeInOut" }}
              >
                <BuilderMascot pose={celebrating ? "highfive" : "idle"} joy={mascotsHovered} className="-ml-1.5 h-11 w-11 sm:-ml-2 sm:h-16 sm:w-16" />
              </m.div>
              <m.svg
                viewBox="-20 -20 40 40"
                className="pointer-events-none absolute left-1/2 top-0 h-8 w-8 -translate-x-1/2 overflow-visible sm:h-12 sm:w-12"
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
              </m.svg>
            </div>
            <BookingCta
              onBook={openAppointment}
              onMouseEnter={celebrate}
              label={t("nav.appointment")}
              className="inline-flex min-h-11 animate-[rise_0.9s_var(--ease-out-studio)_1s_backwards] items-center justify-center gap-2 border border-bone/50 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.12em] text-bone transition-colors [--rise:12px] motion-reduce:animate-none hover:border-bone hover:bg-night"
            />
          </div>
        </div>

        <div className="mt-8 grid animate-[rise_1s_ease_1.2s_backwards] grid-cols-1 gap-4 border-t border-bone/25 pt-5 motion-reduce:animate-none sm:mt-12 md:grid-cols-12 md:gap-6 md:items-start [@media(max-height:560px)]:hidden">
          <p className="eyebrow flex flex-col gap-1 md:col-span-12 lg:col-span-3">
            <Link href={`/${locale}/services/incek-golbasi-mimarlik-ofisi`} className="w-fit text-bone transition-colors hover:text-bone/70">{t("hero.place")}</Link>
            <span className="text-bone/60">{t("hero.country")}</span>
          </p>

          <div className="md:col-span-6 lg:col-span-4">
            <span className="flex items-center gap-2.5">
              <button
                ref={filmButtonRef}
                type="button"
                onClick={toggleFilm}
                aria-label={t(`hero.${FILM_LABEL[film]}`)}
                className="relative -my-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-bone/45 text-bone transition-colors after:absolute after:-inset-2.5 after:content-[''] hover:border-bone hover:bg-night"
              >
                {film === "silent" ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-3.5 w-3.5">
                    <path d="M3 9v6h4l5 4V5L7 9H3z" />
                    <path d="m16 9.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`h-2.5 w-2.5 ${film === "stopped" ? "translate-x-px" : ""}`}>
                    <path d={film === "stopped" ? "M6 3.5v17L20.5 12z" : "M5 5h14v14H5z"} />
                  </svg>
                )}
              </button>
              <span className="eyebrow block text-bone/55">{t("hero.featured")}</span>
            </span>
            <div className="mt-2 flex items-center justify-between gap-2">
              <Link href={`/${locale}/projects/villa-donusumu`} className="group whitespace-nowrap text-[15px] max-[359px]:text-[13px]">
                {t("hero.featuredProject")}
                <span className="ml-2 inline-block transition-transform duration-500 group-hover:translate-x-1" aria-hidden>→</span>
              </Link>
              <SocialLinks
                only={["directions", "whatsapp", "instagram"]}
                tooltip="above"
                className="-my-1 -mr-1.5 lg:hidden [&_a]:h-7 [&_a]:w-7 [&_svg]:h-4 [&_svg]:w-4 max-[359px]:-mr-1 max-[359px]:[&_a]:h-6 max-[359px]:[&_a]:w-6 max-[359px]:[&_svg]:h-3.5 max-[359px]:[&_svg]:w-3.5"
              />
            </div>
            <span className="mt-3 block h-px w-full bg-bone/20">
              <span ref={progressRef} className="block h-full origin-left bg-bone" style={{ transform: "scaleX(0)" }} />
            </span>
          </div>

          <ul className="hidden md:col-span-6 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-2 lg:col-span-5">
            {featured.map((p) => (
              <li key={p.slug}>
                <Link href={`/${locale}/projects/${p.slug}`} className="group flex items-baseline gap-3 text-[14px] text-bone/70 hover:text-bone">
                  <span className="font-mono text-[11px] text-bone/60">{projectNumber(p.slug)}</span>
                  <span className="border-b border-transparent group-hover:border-bone/60">{p.title[locale]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
