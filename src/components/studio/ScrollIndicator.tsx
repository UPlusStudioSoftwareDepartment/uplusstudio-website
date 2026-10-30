"use client";

import { useEffect, useRef } from "react";

const IDLE_MS = 800;
// Only scrolling the visitor started shows the bar; restored positions and route changes stay silent.
const INTENT_MS = 1000;
const MIN_THUMB = 32;

/** Thin page scroll bar that appears while scrolling and fades out when the page is still. */
export default function ScrollIndicator() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    let lastIntent = -Infinity;
    let idle: ReturnType<typeof setTimeout> | undefined;
    let raf = 0;

    const intent = () => {
      lastIntent = performance.now();
    };
    const keys = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);
    const onKey = (event: KeyboardEvent) => keys.has(event.key) && intent();

    const draw = () => {
      raf = 0;
      const view = globalThis.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (total <= view + 1) {
        bar.classList.remove("is-active");
        return;
      }
      const thumb = Math.max(MIN_THUMB, (view * view) / total);
      const progress = globalThis.scrollY / (total - view);
      bar.style.height = `${thumb}px`;
      bar.style.transform = `translate3d(0, ${Math.min(1, Math.max(0, progress)) * (view - thumb)}px, 0)`;
    };

    const onScroll = () => {
      if (performance.now() - lastIntent > INTENT_MS) return;
      if (!raf) raf = requestAnimationFrame(draw);
      bar.classList.add("is-active");
      clearTimeout(idle);
      idle = setTimeout(() => bar.classList.remove("is-active"), IDLE_MS);
    };

    const opts = { passive: true } as const;
    globalThis.addEventListener("wheel", intent, opts);
    globalThis.addEventListener("touchmove", intent, opts);
    globalThis.addEventListener("keydown", onKey, opts);
    globalThis.addEventListener("scroll", onScroll, opts);
    return () => {
      globalThis.removeEventListener("wheel", intent);
      globalThis.removeEventListener("touchmove", intent);
      globalThis.removeEventListener("keydown", onKey);
      globalThis.removeEventListener("scroll", onScroll);
      clearTimeout(idle);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="scroll-indicator motion-reduce:transition-none" aria-hidden />;
}
