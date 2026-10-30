"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Starts the drawing's CSS animation once it scrolls into view and pauses it off screen.
 * Without JavaScript, or with reduced motion, the drawing stays in its finished state.
 */
export default function PlayWhenVisible({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.play = "";
          delete el.dataset.paused;
        } else if ("play" in el.dataset) {
          el.dataset.paused = "";
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`explainer ${className}`}>
      {children}
    </div>
  );
}
