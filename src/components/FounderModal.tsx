'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { EASE_OUT, EASE_STUDIO } from '@/components/studio/Reveal';

interface Founder {
  name: string;
  title: string;
  role: string;
  image: string;
  description?: string;
}

interface FounderModalProps {
  founder: Founder | null;
  isOpen: boolean;
  onClose: () => void;
  closeLabel?: string;
}

export default function FounderModal({ founder, isOpen, onClose, closeLabel = 'Kapat' }: Readonly<FounderModalProps>) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = isOpen && !!founder;
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const scrollY = globalThis.scrollY;
    const previousFocus = document.activeElement as HTMLElement | null;
    const { style } = document.body;
    style.overflow = 'hidden';
    style.position = 'fixed';
    style.width = '100%';
    style.top = `-${scrollY}px`;
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    globalThis.addEventListener('keydown', onKey);

    return () => {
      globalThis.removeEventListener('keydown', onKey);
      style.overflow = '';
      style.position = '';
      style.width = '';
      style.top = '';
      globalThis.scrollTo({ top: scrollY, behavior: 'instant' });
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && founder && (
        <motion.div
          key="founder-modal"
          className="fixed inset-0 z-[100] flex items-stretch justify-center bg-night/80 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.4, ease: EASE_OUT }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="founder-modal-name"
            className="relative grid h-full w-full max-w-5xl grid-cols-1 overflow-y-auto overscroll-contain border border-line bg-paper text-ink sm:h-auto sm:max-h-[90vh] md:grid-cols-12"
            initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: reduce ? 0 : 0.8, ease: EASE_STUDIO }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute right-0 top-0 z-10 flex h-12 w-12 items-center justify-center border-b border-l border-line bg-paper text-ink transition-colors hover:bg-night hover:text-bone"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="square" strokeWidth={1.25} d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>

            <div className="relative aspect-[4/5] w-full bg-paper-2 md:col-span-5 md:aspect-auto md:min-h-[560px]">
              <Image
                src={founder.image}
                alt={founder.name}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-top"
              />
            </div>

            <div className="flex flex-col justify-between gap-12 p-6 pb-10 sm:p-10 md:col-span-7 md:p-12">
              <div>
                <p className="eyebrow inline-flex items-center gap-3 text-mute">
                  <span className="h-px w-8 bg-ink/40" aria-hidden />
                  {founder.role}
                </p>
                <h2
                  id="founder-modal-name"
                  className="display mt-8 text-[clamp(2.5rem,5vw,4.5rem)] text-ink"
                >
                  {founder.name}
                </h2>
                <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.14em] text-mute">{founder.title}</p>
              </div>

              {founder.description && (
                <motion.p
                  className="max-w-prose border-t border-line pt-8 text-[17px] leading-relaxed text-ink/80"
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.35 }}
                >
                  {founder.description}
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
