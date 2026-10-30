"use client";

import { useEffect, type RefObject } from "react";

// Keep decoding and audio idle while the film is outside the viewport or tab.
export function useVideoVisibility(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let inView = true;
    let resume = false;
    const sync = () => {
      if (!inView || document.hidden) {
        resume ||= !video.paused;
        video.pause();
      } else if (resume) {
        resume = false;
        if (!matchMedia("(prefers-reduced-motion: reduce)").matches) video.play().catch(() => {});
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    video.addEventListener("play", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      video.removeEventListener("play", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ref]);
}
