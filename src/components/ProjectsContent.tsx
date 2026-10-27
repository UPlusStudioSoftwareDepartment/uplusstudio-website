"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import PageHeader from "@/components/studio/PageHeader";
import { MaskReveal, EASE_STUDIO, EASE_OUT } from "@/components/studio/Reveal";
import MotionReel from "@/components/studio/MotionReel";
import FramedImage from "@/components/studio/FramedImage";
import { MascotDuo } from "@/components/mascots/Mascots";
import { useAppointment } from "@/contexts/AppointmentContext";
import { projects, projectCategories, projectNumber, type Project, type ProjectCategory } from "@/lib/projects";
import type { Locale } from "@/lib/i18n-config";

type Filter = "all" | ProjectCategory;
type View = "grid" | "list";

function GridCard({ project }: Readonly<{ project: Project }>) {
  const locale = useLocale() as Locale;
  const t = useTranslations("studio.work");

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={{ duration: 0.8, ease: EASE_OUT }}
    >
      <Link href={`/${locale}/projects/${project.slug}`} className="group block">
        <MaskReveal className="relative aspect-[3/2] bg-paper-2">
          <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
            <FramedImage src={project.cover.src} alt={project.cover.alt[locale]} sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          {project.video && (
            <span className="eyebrow absolute left-4 top-4 bg-night/55 px-2.5 py-1 text-bone backdrop-blur-sm">▶ Film</span>
          )}
        </MaskReveal>
        <div className="mt-5 flex items-baseline gap-4 border-t border-line pt-4">
          <span className="font-mono text-[12px] text-mute">{projectNumber(project.slug)}</span>
          <div className="min-w-0 flex-1">
            <h2 className="font-sans text-2xl font-light tracking-[-0.02em] text-ink transition-colors group-hover:text-clay sm:text-3xl">
              {project.title[locale]}
            </h2>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-mute">{project.tagline[locale]}</p>
          </div>
          <span className="eyebrow hidden shrink-0 text-mute sm:block">{t(`categories.${project.category}`)}</span>
        </div>
      </Link>
    </motion.li>
  );
}

function ListView({ items }: Readonly<{ items: Project[] }>) {
  const locale = useLocale() as Locale;
  const t = useTranslations("studio.work");
  const [hovered, setHovered] = useState<string | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 30, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 240, damping: 30, mass: 0.6 });

  return (
    <div
      onMouseMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onMouseLeave={() => setHovered(null)}
    >
      <div className="hidden grid-cols-12 gap-4 border-b border-ink pb-3 font-mono text-[12px] uppercase tracking-[0.12em] text-mute md:grid">
        <span className="col-span-1">{t("no")}</span>
        <span className="col-span-5">{t("project")}</span>
        <span className="col-span-2">{t("type")}</span>
        <span className="col-span-4">{t("scope")}</span>
      </div>
      <ul>
        <AnimatePresence mode="popLayout">
          {items.map((project) => (
            <motion.li
              key={project.slug}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="border-b border-line"
              onMouseEnter={() => setHovered(project.slug)}
            >
              <Link
                href={`/${locale}/projects/${project.slug}`}
                className="group grid grid-cols-12 items-center gap-4 py-5 md:py-7"
              >
                <span className="col-span-2 font-mono text-[12px] text-mute md:col-span-1">{projectNumber(project.slug)}</span>
                <span className="relative col-span-3 aspect-[4/3] overflow-hidden bg-paper-2 md:hidden">
                  <Image src={project.cover.src} alt="" fill sizes="25vw" className="object-cover" />
                </span>
                <span className="col-span-7 font-sans text-xl font-light tracking-[-0.02em] text-ink transition-[color,transform] duration-500 group-hover:translate-x-2 group-hover:text-clay md:col-span-5 md:text-4xl">
                  {project.title[locale]}
                </span>
                <span className="eyebrow col-span-2 hidden text-mute md:block">{t(`categories.${project.category}`)}</span>
                <span className="col-span-4 hidden text-[14px] text-mute md:block">
                  {project.scope.map((s) => s[locale]).join(" · ")}
                </span>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-40 hidden [@media(hover:hover)]:block"
        style={{ x: springX, y: springY }}
        aria-hidden
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="preview"
              className="relative h-[260px] w-[360px] -translate-y-1/2 translate-x-8 overflow-hidden"
              initial={{ clipPath: "inset(50% 50% 50% 50%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ clipPath: "inset(50% 50% 50% 50%)" }}
              transition={{ duration: 0.5, ease: EASE_STUDIO }}
            >
              {items.map((p) => (
                <Image
                  key={p.slug}
                  src={p.cover.src}
                  alt=""
                  fill
                  sizes="360px"
                  className={`object-cover transition-opacity duration-500 ${hovered === p.slug ? "opacity-100" : "opacity-0"}`}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function ProjectsContent() {
  const t = useTranslations("studio.work");
  const tm = useTranslations("studio.mascots");
  const { openAppointment } = useAppointment();
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("grid");

  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const filters: Filter[] = ["all", ...projectCategories.filter((c) => projects.some((p) => p.category === c))];
  const countFor = (f: Filter) => (f === "all" ? projects.length : projects.filter((p) => p.category === f).length);

  return (
    <div className="relative text-ink">
      <PageHeader
        index="04"
        label={t("label")}
        titleLines={[t("title")]}
        intro={<p>{t("intro")}</p>}
        meta={[
          { label: t("project"), value: `${String(projects.length).padStart(2, "0")} ${t("count")}` },
          { label: t("type"), value: projectCategories.map((c) => t(`categories.${c}`)).join(" · ") },
        ]}
      />

      <div className="sticky top-0 z-30 mt-16 border-y border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[2560px] items-center justify-between gap-6 px-4 sm:px-8 lg:px-12">
          <div className="no-scrollbar -mx-1 flex overflow-x-auto">
            {filters.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className={`relative shrink-0 px-3 py-4 text-[14px] transition-colors sm:px-4 ${active ? "text-ink" : "text-mute hover:text-ink"}`}
                >
                  {f === "all" ? t("all") : t(`categories.${f}`)}
                  <sup className="ml-1 font-mono text-[11px]">{countFor(f)}</sup>
                  {active && (
                    <motion.span layoutId="filter-underline" className="absolute inset-x-3 bottom-0 h-px bg-ink sm:inset-x-4" transition={{ duration: 0.5, ease: EASE_STUDIO }} />
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex shrink-0 items-center gap-1 font-mono text-[12px] uppercase tracking-[0.12em]">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`px-3 py-2 transition-colors ${view === v ? "bg-ink text-paper" : "text-mute hover:text-ink"}`}
              >
                {t(v)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[2560px] px-4 pb-24 pt-16 sm:px-8 sm:pt-24 lg:px-12">
        {view === "grid" ? (
          <ul className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-20">
            <AnimatePresence mode="popLayout">
              {visible.map((project) => (
                <GridCard key={project.slug} project={project} />
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <ListView items={visible} />
        )}
      </section>

      <section className="mx-auto max-w-[2560px] px-4 pb-24 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start gap-8 border-y border-line py-12 sm:flex-row sm:items-center sm:justify-between">
          <MascotDuo pose="cheer" size="md" message={tm("projects")} />
          <button
            type="button"
            onClick={openAppointment}
            className="group inline-flex min-h-12 w-full items-center justify-between gap-4 border border-ink bg-transparent px-7 py-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night hover:text-bone sm:w-auto sm:justify-start"
          >
            {tm("projectsCta")}
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </button>
        </div>
      </section>

      <div className="border-t border-line">
        <MotionReel />
      </div>
    </div>
  );
}
