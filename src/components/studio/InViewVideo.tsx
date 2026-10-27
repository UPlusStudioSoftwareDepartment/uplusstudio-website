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
    if (globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.15 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      src={eager ? src : undefined}
      muted
      loop
      playsInline
      autoPlay={eager}
      preload={eager ? "auto" : "none"}
      aria-label={label}
      disableRemotePlayback
    />
  );
}
