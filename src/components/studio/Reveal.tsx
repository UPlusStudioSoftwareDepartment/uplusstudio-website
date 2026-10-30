"use client";

import { useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { DURATION, EASE_OUT, EASE_STUDIO } from "@/lib/motion";

export { EASE_OUT, EASE_STUDIO };

interface MaskRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "bottom" | "left";
}

export function MaskReveal({ children, className = "", delay = 0 }: Readonly<MaskRevealProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <div ref={ref} className={className}>
      <div
        className="relative h-full w-full overflow-hidden motion-reduce:!opacity-100 motion-reduce:transition-none"
        style={{ opacity: inView ? 1 : 0, transition: `opacity ${DURATION.fade}s var(--ease-out-studio) ${delay}s` }}
      >
        {children}
      </div>
    </div>
  );
}

interface LineRevealProps {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  immediate?: boolean;
  /** CSS length added to every line's delay in immediate mode, e.g. "var(--hero-offset, 0s)". */
  delayOffset?: string;
}

export function LineReveal({ lines, className = "", lineClassName = "", delay = 0, immediate = false, delayOffset }: Readonly<LineRevealProps>) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <span ref={ref} className={`block ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.08em] -ml-[0.075em] block overflow-hidden pb-[0.08em]">
          {immediate ? (
            <span
              className={`block animate-[line-up_var(--duration-line)_var(--ease-studio)_backwards] motion-reduce:animate-none ${lineClassName}`}
              style={{ animationDelay: delayOffset ? `calc(${delay + i * 0.08}s + ${delayOffset})` : `${delay + i * 0.08}s` }}
            >
              {line}
            </span>
          ) : (
            <span
              className={`block motion-reduce:![transform:none] motion-reduce:transition-none ${lineClassName}`}
              style={{ transform: inView ? "none" : "translateY(105%)", transition: `transform ${DURATION.line}s var(--ease-studio) ${delay + i * 0.08}s` }}
            >
              {line}
            </span>
          )}
          {i < lines.length - 1 ? " " : null}
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div
      ref={ref}
      className={`motion-reduce:!opacity-100 motion-reduce:![transform:none] motion-reduce:transition-none ${className}`}
      style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: `opacity ${DURATION.fade}s var(--ease-out-studio) ${delay}s, transform ${DURATION.fade}s var(--ease-out-studio) ${delay}s` }}
    >
      {children}
    </div>
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
