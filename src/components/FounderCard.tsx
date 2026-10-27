'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { EASE_OUT } from '@/components/studio/Reveal';

export interface Founder {
  name: string;
  title: string;
  role: string;
  image: string;
  description: string;
}

interface FounderCardProps {
  founder: Founder;
  variant: 'left' | 'right';
  onSelect: () => void;
  index?: string;
  tone?: 'ink' | 'light';
  viewLabel?: string;
  className?: string;
}

export default function FounderCard({
  founder,
  variant,
  onSelect,
  index,
  tone = 'light',
  viewLabel = 'Profili gör',
  className = 'w-[260px] sm:w-[300px]',
}: Readonly<FounderCardProps>) {
  const reduce = useReducedMotion();
  const isLight = tone === 'light';
  const text = isLight ? 'text-bone' : 'text-ink';
  const muted = isLight ? 'text-bone/60' : 'text-mute';
  const rule = isLight ? 'border-bone/15' : 'border-line';

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: EASE_OUT, delay: variant === 'right' ? 0.12 : 0 }}
    >
      <button
        type="button"
        onClick={onSelect}
        className={`group block w-full text-left ${text}`}
        aria-haspopup="dialog"
        aria-label={`${founder.name}, ${founder.title} — ${viewLabel}`}
      >
        <span className="relative block aspect-[4/5] w-full overflow-hidden bg-paper-2">
          <Image
            src={founder.image}
            alt={founder.name}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover object-top grayscale transition-[filter,transform,scale] duration-[1200ms] ease-out-studio group-hover:scale-[1.03] group-hover:grayscale-0 group-focus-visible:grayscale-0 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </span>

        <span className={`mt-6 flex items-baseline justify-between gap-4 border-t ${rule} pt-5`}>
          <span className={`font-mono text-[12px] uppercase tracking-[0.14em] tabular-nums ${muted}`}>
            {index ?? (variant === 'left' ? '01' : '02')}
          </span>
          <span className={`inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] ${muted} transition-colors group-hover:text-clay`}>
            {viewLabel}
            <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </span>
        </span>

        <span className="mt-4 block text-[clamp(2rem,3.6vw,3.25rem)] font-light leading-[1] tracking-[-0.03em]">
          {founder.name}
        </span>
        <span className={`mt-3 block font-mono text-[12px] uppercase tracking-[0.14em] ${muted}`}>
          {founder.title}
          {founder.role ? <> &nbsp;/&nbsp; {founder.role}</> : null}
        </span>
      </button>
    </motion.div>
  );
}
