"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

export const EASE_STUDIO = [0.76, 0, 0.24, 1] as const;
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

interface MaskRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "bottom" | "left";
}

export function MaskReveal({ children, className = "", delay = 0, from = "bottom" }: Readonly<MaskRevealProps>) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const hidden = from === "bottom" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";

  if (reduce) return <div className={`overflow-hidden ${className}`}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="relative h-full w-full overflow-hidden"
        initial={{ clipPath: hidden }}
        animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
        transition={{ duration: 1.2, ease: EASE_STUDIO, delay }}
      >
        <motion.div
          className="relative h-full w-full"
          initial={{ scale: 1.12 }}
          animate={inView ? { scale: 1 } : undefined}
          transition={{ duration: 1.6, ease: EASE_OUT, delay }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

interface LineRevealProps {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  immediate?: boolean;
}

export function LineReveal({ lines, className = "", lineClassName = "", delay = 0, immediate = false }: Readonly<LineRevealProps>) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <span ref={ref} className={`block ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          {immediate ? (
            <span
              className={`block animate-[line-up_1s_var(--ease-studio)_backwards] motion-reduce:animate-none ${lineClassName}`}
              style={{ animationDelay: `${delay + i * 0.09}s` }}
            >
              {line}
            </span>
          ) : (
            <motion.span
              className={`block ${lineClassName}`}
              initial={reduce ? false : { y: "105%" }}
              animate={inView ? { y: "0%" } : undefined}
              transition={{ duration: 1, ease: EASE_STUDIO, delay: delay + i * 0.09 }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </span>
  );
}

interface FadeUpProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeUp({ children, className = "", delay = 0 }: Readonly<FadeUpProps>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, className = "", tone = "ink" }: Readonly<{ children: ReactNode; className?: string; tone?: "ink" | "light" }>) {
  const color = tone === "light" ? "text-bone/70" : "text-mute";
  const rule = tone === "light" ? "bg-bone/40" : "bg-ink/40";
  return (
    <span className={`eyebrow inline-flex items-center gap-3 ${color} ${className}`}>
      <span className={`h-px w-8 ${rule}`} aria-hidden />
      {children}
    </span>
  );
}
