"use client";

import { useEffect, useRef } from "react";

interface InViewVideoProps {
  src: string;
  poster: string;
  className?: string;
  eager?: boolean;
  label?: string;
}

export default function InViewVideo({ src, poster, className = "", eager = false, label }: Readonly<InViewVideoProps>) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reducedMotion = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    let userPaused = false;
    const rememberPause = () => {
      if (inView && !reducedMotion.matches) userPaused = true;
    };
    const rememberPlay = () => { userPaused = false; };
    const syncMotionPreference = () => {
      if (reducedMotion.matches) video.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (!inView) video.pause();
        else if (!reducedMotion.matches && !userPaused) video.play().catch(() => {});
      },
      { rootMargin: "200px 0px", threshold: 0.15 }
    );
    video.addEventListener("pause", rememberPause);
    video.addEventListener("play", rememberPlay);
    reducedMotion.addEventListener("change", syncMotionPreference);
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.removeEventListener("pause", rememberPause);
      video.removeEventListener("play", rememberPlay);
      reducedMotion.removeEventListener("change", syncMotionPreference);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      src={src}
      controls
      tabIndex={0}
      muted
      loop
      playsInline
      preload={eager ? "metadata" : "none"}
      aria-label={label}
      disableRemotePlayback
    />
  );
}
