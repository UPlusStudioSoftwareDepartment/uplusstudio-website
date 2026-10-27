"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LineReveal, EASE_OUT } from "./Reveal";

interface PageHeaderProps {
  index: string;
  label: string;
  titleLines: ReactNode[];
  intro?: ReactNode;
  image?: { src: string; alt: string };
  meta?: { label: string; value: ReactNode }[];
  children?: ReactNode;
}

const DEFAULT_IMAGES: Record<string, string> = {
  "02": "/media/projects/modern-villa/exterior-dusk.jpg",
  "03": "/media/projects/villa-ic-mekan/kitchen-island.jpg",
  "04": "/media/projects/konut-projeleri/complex.jpg",
  "05": "/media/projects/modern-villa/exterior-pool-hd.jpg",
  "06": "/media/projects/yonetici-ofisi/study.jpg",
  "07": "/media/projects/butik-kafe/interior-hd.jpg",
};
const FALLBACK_IMAGE = "/media/projects/modern-villa/exterior-dusk.jpg";

export default function PageHeader({ index, label, titleLines, intro, image, meta, children }: Readonly<PageHeaderProps>) {
  const reduce = useReducedMotion();
  const src = image?.src ?? DEFAULT_IMAGES[index] ?? FALLBACK_IMAGE;

  return (
    <header className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-night text-bone">
      <motion.div
        className="absolute inset-0 -z-10"
        initial={reduce ? false : { scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE_OUT }}
      >
        <Image src={src} alt={image?.alt ?? ""} fill priority sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-paper via-night/50 to-night/35" aria-hidden />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-night/70 to-transparent" aria-hidden />

      <div className="mx-auto w-full max-w-[2560px] px-4 pb-10 pt-36 sm:px-8 sm:pb-14 lg:px-12">
        <motion.div
          className="flex items-center justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.14em] text-bone/70"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.15 }}
        >
          <span className="flex items-center gap-4">
            <span className="text-bone">{index}</span>
            <span className="h-px w-10 bg-bone/50" aria-hidden />
            <span>{label}</span>
          </span>
          <span className="hidden sm:inline">U+ Studio — Ankara</span>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <h1 className="display text-[clamp(3rem,9.5vw,9.5rem)] lg:col-span-8 [&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:tracking-normal">
            <LineReveal lines={titleLines} immediate delay={0.25} />
          </h1>
          {intro && (
            <motion.div
              className="max-w-md text-[17px] leading-relaxed text-bone/75 lg:col-span-4 lg:pb-3"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.6 }}
            >
              {intro}
            </motion.div>
          )}
        </div>

        {meta && meta.length > 0 && (
          <motion.dl
            className="mt-12 grid grid-cols-2 gap-x-6 border-t border-bone/20 md:grid-cols-4"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {meta.map((m) => (
              <div key={m.label} className="min-w-0 pt-5">
                <dt className="font-mono text-[12px] uppercase tracking-[0.12em] text-bone/50">{m.label}</dt>
                <dd className="mt-2 text-[15px] text-bone [&_a:hover]:text-bone [&_a]:text-bone">{m.value}</dd>
              </div>
            ))}
          </motion.dl>
        )}

        {children}
      </div>
    </header>
  );
}
