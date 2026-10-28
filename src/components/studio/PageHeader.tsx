"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { LineReveal } from "./Reveal";

interface PageHeaderProps {
  index: string;
  label: string;
  titleLines: ReactNode[];
  intro?: ReactNode;
  image?: { src: string; alt: string };
  meta?: { label: string; value: ReactNode }[];
  titleClassName?: string;
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

export default function PageHeader({ index, label, titleLines, intro, image, meta, titleClassName = "", children }: Readonly<PageHeaderProps>) {
  const src = image?.src ?? DEFAULT_IMAGES[index] ?? FALLBACK_IMAGE;

  return (
    <header className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-night text-bone">
      <div className="absolute inset-0 -z-10 animate-[settle_2.4s_var(--ease-out-studio)_backwards] [--settle:1.12] motion-reduce:animate-none">
        <Image src={src} alt={image?.alt ?? ""} fill priority fetchPriority="high" sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-paper via-night/50 to-night/35" aria-hidden />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-night/70 to-transparent" aria-hidden />

      <div className="mx-auto w-full max-w-[2560px] px-4 pb-10 pt-36 sm:px-8 sm:pb-14 lg:px-12">
        <div className="flex animate-[rise_0.8s_var(--ease-out-studio)_0.15s_backwards] items-center gap-4 font-mono text-[12px] uppercase tracking-[0.14em] text-bone/70 [--rise:10px] motion-reduce:animate-none">
          <span className="flex items-center gap-4">
            <span className="text-bone">{index}</span>
            <span className="h-px w-10 bg-bone/50" aria-hidden />
            <span>{label}</span>
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:mt-8 sm:gap-8">
          <h1 className={`display text-[clamp(3rem,9.5vw,9.5rem)] [&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:tracking-normal ${titleClassName}`}>
            <LineReveal lines={titleLines} immediate delay={0.25} />
          </h1>
          <div className="flex animate-[rise_1s_var(--ease-out-studio)_backwards] flex-wrap items-end justify-between gap-x-10 gap-y-4 [--rise:20px] motion-reduce:animate-none">
            {intro && <div className="max-w-md text-[17px] leading-relaxed text-bone/75 lg:max-w-xl">{intro}</div>}
            <span className="ml-auto pb-1 font-mono text-[12px] uppercase tracking-[0.14em] text-bone/70 max-sm:hidden">U+ Studio — Ankara</span>
          </div>
        </div>

        {meta && meta.length > 0 && (
          <dl className={`mt-6 animate-[rise_1s_ease_0.8s_backwards] ${meta.length === 3 ? "flex justify-between md:grid" : "grid grid-cols-2"} gap-x-6 border-t border-bone/20 motion-reduce:animate-none sm:mt-12 md:grid-cols-4`}>
            {meta.map((m) => (
              <div key={m.label} className="min-w-0 pt-5">
                <dt className="font-mono text-[12px] uppercase tracking-[0.12em] text-bone/60">{m.label}</dt>
                <dd className="mt-2 text-[15px] text-bone [&_a:hover]:text-bone [&_a]:text-bone">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {children}
      </div>
    </header>
  );
}
