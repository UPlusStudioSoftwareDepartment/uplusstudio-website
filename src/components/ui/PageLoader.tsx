"use client";

import { motion, useReducedMotion } from "framer-motion";

interface PageLoaderProps {
  label?: string;
  className?: string;
  size?: "sm" | "lg";
}

const EASE = [0.76, 0, 0.24, 1] as const;
const LETTERS = "STUDIO".split("");

export function LoadingLine({ className = "" }: Readonly<{ className?: string }>) {
  const reduce = useReducedMotion();
  return (
    <span className={`relative block h-px overflow-hidden bg-line ${className}`} aria-hidden>
      {reduce ? (
        <span className="absolute inset-y-0 left-0 w-1/3 bg-ink" />
      ) : (
        <motion.span
          className="absolute inset-y-0 left-0 w-1/3 bg-ink"
          initial={{ x: "-100%" }}
          animate={{ x: "300%" }}
          transition={{ duration: 1.4, ease: EASE, repeat: Infinity }}
        />
      )}
    </span>
  );
}

function LogoMark({ size }: Readonly<{ size: "sm" | "lg" }>) {
  const reduce = useReducedMotion();
  const draw = (delay: number, duration = 0.5) =>
    reduce ? {} : { initial: { pathLength: 0.45 }, animate: { pathLength: 1 }, transition: { duration, ease: EASE, delay } };
  const grow = (delay: number, axis: "scaleX" | "scaleY") =>
    reduce ? {} : { initial: { [axis]: 0.4 }, animate: { [axis]: 1 }, transition: { duration: 0.4, ease: EASE, delay } };

  return (
    <div className={`flex flex-col items-center text-ink ${size === "lg" ? "w-[clamp(180px,24vw,300px)]" : "w-28"}`} aria-hidden>
      <svg viewBox="0 0 200 120" className="w-[78%] overflow-visible">
        <motion.path
          d="M22 4 V66 a42 42 0 0 0 84 0 V4"
          fill="none"
          stroke="currentColor"
          strokeWidth="24"
          strokeLinecap="butt"
          {...draw(0)}
        />
        <g transform="translate(156 48)">
          <motion.rect x="-30" y="-9" width="60" height="18" fill="currentColor" style={{ transformBox: "fill-box", originX: 0.5 }} {...grow(0.05, "scaleX")} />
          <motion.rect x="-9" y="-30" width="18" height="60" fill="currentColor" style={{ transformBox: "fill-box", originY: 0.5 }} {...grow(0.1, "scaleY")} />
        </g>
      </svg>

      <span className="relative mt-[7%] block h-[2px] w-full overflow-hidden">
        <motion.span className="absolute inset-0 bg-current" style={{ originX: 0.5 }} {...grow(0.05, "scaleX")} />
        {!reduce && (
          <motion.span
            className="absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-transparent via-clay to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "400%" }}
            transition={{ duration: 1.4, ease: EASE, repeat: Infinity, delay: 0.3, repeatDelay: 0.1 }}
          />
        )}
      </span>

      <span className={`mt-[6%] flex w-full justify-between font-sans font-light leading-none ${size === "lg" ? "text-[clamp(1.9rem,4.2vw,3.3rem)]" : "text-[1.15rem]"}`}>
        {LETTERS.map((letter, i) => (
          <span key={letter + i} className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block"
              initial={reduce ? false : { y: "55%", opacity: 0.35 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ duration: 0.45, ease: EASE, delay: 0.05 + i * 0.035 }}
            >
              {letter}
            </motion.span>
          </span>
        ))}
      </span>
    </div>
  );
}

export function PageLoader({ label = "Loading", className = "", size = "sm" }: Readonly<PageLoaderProps>) {
  return (
    <output className={`flex flex-col items-center justify-center ${className}`} aria-label={label}>
      <LogoMark size={size} />
      <span className="sr-only">{label}</span>
    </output>
  );
}

export function PageLoaderFull({ label = "Loading" }: Readonly<{ label?: string }>) {
  return (
    <div className="flex min-h-[100svh] items-center justify-center px-4">
      <PageLoader label={label} size="lg" />
    </div>
  );
}
