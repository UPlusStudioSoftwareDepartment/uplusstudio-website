"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import CallCta from "./CallCta";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import BeforeAfter from "@/components/studio/BeforeAfter";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { EASE_STUDIO as EASE } from "@/lib/motion";

type Shot = { src: string; alt: string };

export interface Showcase {
  index: string;
  title: string;
  audience?: string;
  body: string;
  includes?: string[];
  example: { before: Shot; after: Shot; label: string; title: string; href: string };
}

interface ShowcaseModalProps {
  item: Showcase | null;
  onClose: () => void;
  labels: { includes: string; before: string; after: string; drag: string; close: string; cta: string };
}

export default function ShowcaseModal({ item, onClose, labels }: Readonly<ShowcaseModalProps>) {
  const open = item !== null;
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useScrollLock(open);
  useFocusTrap(open, dialogRef, closeRef);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {item && (
        <m.div
          ref={dialogRef}
          key="showcase"
          className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          <button type="button" aria-label={labels.close} className="absolute inset-0 cursor-default bg-night/85 backdrop-blur-md" onClick={onClose} />

          <m.div
            className="relative z-10 grid h-[min(92dvh,820px)] w-[min(96vw,1240px)] grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-[6px] border border-bone/15 bg-[#0d0c0b] text-bone shadow-[0_40px_120px_rgba(0,0,0,0.7)] lg:grid-cols-[1.35fr_1fr] lg:grid-rows-1"
            initial={reduce ? false : { y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
          >
            <div className="relative min-h-0">
              <BeforeAfter
                before={item.example.before}
                after={item.example.after}
                beforeLabel={labels.before}
                afterLabel={labels.after}
                dragLabel={labels.drag}
                aspectClass="h-full"
                sizes="(max-width: 1024px) 96vw, 56vw"
              />
            </div>

            <div className="flex min-h-0 flex-col overflow-hidden border-t border-bone/10 p-5 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-clay">{item.index}</span>
              <h2 className="mt-2 font-sans text-[clamp(1.5rem,3.2vw,2.75rem)] font-light leading-[1.02] tracking-[-0.03em] lg:mt-4">{item.title}</h2>
              {item.audience && <p className="mt-2 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-bone/55 lg:mt-4">{item.audience}</p>}
              <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-bone/80 sm:text-[16px] lg:mt-6 lg:line-clamp-none">{item.body}</p>

              {item.includes && (
                <div className="mt-4 hidden lg:mt-8 lg:block [@media(min-height:860px)]:block">
                  <p className="eyebrow text-bone/45">{labels.includes}</p>
                  <ul className="mt-3 space-y-2 text-[15px] text-bone/80">
                    {item.includes.map((inc) => (
                      <li key={inc} className="flex gap-3">
                        <svg className="mt-[0.35em] h-3.5 w-3.5 shrink-0 text-clay" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
                          <path d="m3 8.5 3 3 7-7" />
                        </svg>
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-auto pt-4 lg:pt-8">
                <Link
                  href={item.example.href}
                  onClick={onClose}
                  className="group flex items-baseline justify-between gap-4 border-t border-bone/10 py-3 text-[14px] text-bone/75 transition-colors hover:text-bone"
                >
                  <span>
                    <span className="eyebrow mr-2 text-bone/45">{item.example.label}</span>
                    {item.example.title}
                  </span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <CallCta
                  onClick={onClose}
                  arrow={<span aria-hidden>→</span>}
                  className="flex min-h-12 w-full items-center justify-between rounded-[3px] border border-bone/50 bg-transparent px-5 font-mono text-[12px] uppercase tracking-[0.12em] text-bone transition-colors hover:border-bone hover:bg-night"
                />
              </div>
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={labels.close}
              className="absolute left-1/2 top-3 z-20 flex h-10 w-10 -translate-x-1/2 lg:left-auto lg:right-3 lg:translate-x-0 items-center justify-center rounded-full border border-bone/40 bg-night/60 text-bone backdrop-blur-sm transition-colors hover:bg-night"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeWidth={1.25} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
