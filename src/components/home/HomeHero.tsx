"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import CallCta from "@/components/studio/CallCta";
import SocialLinks from "@/components/studio/SocialLinks";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { m, useReducedMotion } from "framer-motion";
import { LineReveal } from "@/components/studio/Reveal";
import { DesignerMascot, BuilderMascot, HIGH_FIVE } from "@/components/mascots/Mascots";
import { projects } from "@/lib/projects";
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
const PROJECT_COLUMNS = [["villa-donusumu", "evox-gym-center"], ["butik-kafe", "modern-villa"], ["konut-uygulama", "pastane"]];
const heroProjectNumber = (slug: string) => String(PROJECT_COLUMNS.flat().indexOf(slug) + 1).padStart(2, "0");

const videoSource = () => (globalThis.innerWidth < 768 ? VIDEO.small : VIDEO.large);
const MUSIC_KEY = "u-film-music";

function musicWanted() {
  try {
    return sessionStorage.getItem(MUSIC_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberMusic(on: boolean) {
  try {
    sessionStorage.setItem(MUSIC_KEY, on ? "1" : "0");
  } catch {}
}

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
  const stalledRef = useRef(false);
  const musicRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const listed = PROJECT_COLUMNS.map((column) => projects.filter((p) => column.includes(p.slug)));

  preload(VIDEO.poster, { as: "image", fetchPriority: "high" });

  const playMusic = () => followFilm(videoRef.current, musicRef.current);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const motionPreference = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      if (!motionPreference.matches) return;
      video.pause();
      musicRef.current?.pause();
    };
    const start = () => {
      if (motionPreference.matches) return;
      video.src = videoSource();
      video.play().catch(() => {});
    };
    motionPreference.addEventListener("change", syncMotionPreference);
    if (document.readyState === "complete") start();
    else globalThis.addEventListener("load", start, { once: true });
    return () => {
      globalThis.removeEventListener("load", start);
      motionPreference.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const sync = () => {
      const video = videoRef.current;
      if (video?.duration && progressRef.current) {
        progressRef.current.style.transform = `scaleX(${video.currentTime / video.duration})`;
      }
    };
    const tick = () => {
      sync();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      sync();
    };
  }, [playing]);

  const toggleFilm = () => {
    const video = videoRef.current;
    if (!video) return;
    if (film === "audible") {
      rememberMusic(false);
      video.pause();
      musicRef.current?.pause();
      return;
    }
    rememberMusic(true);
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
          onPlaying={() => {
            stalledRef.current = false;
            if (musicWanted()) playMusic();
          }}
          onWaiting={() => {
            stalledRef.current = true;
            musicRef.current?.pause();
          }}
          onPause={() => {
            stalledRef.current = false;
            setPlaying(false);
            setMusicOn(false);
            musicRef.current?.pause();
          }}
        >
          <source src={VIDEO.large} type="video/mp4" />
        </video>
        <audio
          ref={musicRef}
          preload="none"
          onPlay={() => setMusicOn(true)}
          onPlaying={(e) => {
            const video = videoRef.current;
            if (video && Math.abs(e.currentTarget.currentTime - video.currentTime) > MUSIC_DRIFT_S) e.currentTarget.currentTime = video.currentTime;
          }}
          onPause={() => stalledRef.current || setMusicOn(false)}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-night/60 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-linear-to-t from-night/90 via-night/45 to-transparent" aria-hidden />

      <div className="relative z-10 mx-auto flex h-full max-w-[2560px] flex-col px-4 pb-6 pt-[8.75rem] [justify-content:safe_flex-end] sm:px-8 sm:pb-10 sm:pt-32 lg:px-12 [@media(max-height:560px)]:pb-3 [@media(max-height:560px)]:pt-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12 [@media(max-height:560px)]:flex-row [@media(max-height:560px)]:items-end [@media(max-height:560px)]:justify-between [@media(max-height:560px)]:gap-4">
          <h1 className="display min-w-0 text-[clamp(1.9rem,min(8vw,10dvh),9rem)] max-sm:flex max-sm:flex-col">
            <span className="sr-only">U+ Studio — </span>
            <span className="mb-5 block animate-[rise_0.9s_var(--ease-out-studio)_backwards] font-sans text-[clamp(0.875rem,1.3vw,1.125rem)] font-medium leading-relaxed tracking-[0.025em] text-bone [text-shadow:0_2px_12px_rgb(0_0_0/0.65)] [--rise:12px] motion-reduce:animate-none max-sm:order-last max-sm:mb-0 max-sm:mt-4 max-sm:[animation-delay:0.9s] sm:mb-8 [@media(max-height:560px)]:mb-2">
              {t("hero.eyebrow")}
            </span>
            {" "}
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
            <CallCta
              onMouseEnter={celebrate}
              className="inline-flex min-h-11 animate-[rise_0.9s_var(--ease-out-studio)_1s_backwards] items-center justify-center gap-2 border border-bone/50 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.12em] text-bone transition-colors [--rise:12px] motion-reduce:animate-none hover:border-bone hover:bg-night"
            />
          </div>
        </div>

        <div className="mt-8 grid animate-[rise_1s_ease_1.2s_backwards] grid-cols-1 gap-4 border-t border-bone/25 pt-5 motion-reduce:animate-none sm:mt-12 md:grid-cols-12 md:gap-6 md:items-start xl:grid-cols-[auto_minmax(auto,calc(33.333%_-_16px))_auto_auto_auto] xl:items-stretch xl:justify-between xl:gap-x-10 [@media(max-height:560px)]:mt-4 [@media(max-height:560px)]:pt-3">
          <p className="eyebrow flex flex-col gap-1 md:col-span-5 xl:col-span-1 xl:gap-2">
            <Link href={`/${locale}/services/incek-golbasi-mimarlik-ofisi`} className="w-fit text-bone transition-colors hover:text-bone/70 xl:flex xl:h-6 xl:items-center">{t("hero.place")}</Link>
            <span className="text-bone/60 xl:flex xl:h-6 xl:items-center">{t("hero.country")}</span>
          </p>

          <div className="md:col-span-7 xl:col-span-1">
            <span className="flex min-h-8 items-center gap-2.5 xl:h-8">
              <button
                type="button"
                onClick={toggleFilm}
                aria-label={t(`hero.${FILM_LABEL[film]}`)}
                className="relative -my-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-bone/75 bg-night/45 text-bone transition-colors after:absolute after:-inset-1.5 after:content-[''] hover:border-bone hover:bg-night focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bone"
              >
                {film === "silent" ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-5 w-5 [shape-rendering:geometricPrecision]">
                    <path d="M3 7v6h3l5 4V3L6 7H3z" />
                    <path d="m14 7 4 6m0-6-4 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-5 w-5 [shape-rendering:geometricPrecision]">
                    <path d={film === "stopped" ? "M6 4v12l10-6z" : "M5 5h10v10H5z"} />
                  </svg>
                )}
              </button>
              <span className="eyebrow block text-bone/55">{t("hero.featured")}</span>
            </span>
            <div className="mt-2 flex items-center justify-between gap-2 xl:h-6">
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

          <div className="hidden md:col-span-12 md:flex md:justify-between md:gap-x-6 xl:contents [@media(max-height:560px)]:!hidden">
            {listed.map((column) => (
              <ul key={column[0].slug} className="flex flex-col justify-end gap-2 xl:translate-y-2">
                {column.map((p) => (
                  <li key={p.slug} className="flex h-6 items-center">
                    <Link href={`/${locale}/projects/${p.slug}`} className="group flex items-baseline gap-3 whitespace-nowrap text-[14px] text-bone/70 hover:text-bone">
                      <span data-home-project-number className="font-mono text-[11px] text-bone/60">{heroProjectNumber(p.slug)}</span>
                      <span className="border-b border-transparent group-hover:border-bone/60">{p.title[locale]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
