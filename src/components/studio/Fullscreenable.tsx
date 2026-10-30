"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "next-intl";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export default function Fullscreenable({ children, className = "" }: Readonly<{ children: ReactNode; className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [native, setNative] = useState(false);
  const [fallback, setFallback] = useState(false);
  const en = useLocale() === "en";
  const full = native || fallback;
  useScrollLock(fallback);
  useFocusTrap(fallback, dialogRef, closeRef);

  useEffect(() => {
    const onChange = () => setNative(document.fullscreenElement === ref.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (!fallback) return;
    ref.current?.querySelector("video")?.pause();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFallback(false);
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [fallback]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = ref.current;
    if (!el) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    if (fallback) {
      setFallback(false);
      return;
    }
    // Keep photos inside the page on touch devices so the browser does not
    // enter immersive mode and display its swipe/back-to-exit notification.
    if (matchMedia("(pointer: coarse)").matches && !el.querySelector("video")) {
      setFallback(true);
      return;
    }
    if (typeof el.requestFullscreen === "function") {
      el.requestFullscreen().catch(() => setFallback(true));
      return;
    }
    const video = el.querySelector("video") as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (video?.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
      return;
    }
    setFallback(true);
  };

  return (
    <div
      ref={ref}
      data-fullscreen={native || undefined}
      className={`group/fs ${className} data-[fullscreen]:flex data-[fullscreen]:items-center data-[fullscreen]:justify-center data-[fullscreen]:bg-black data-[fullscreen]:[&_video]:object-contain`}
    >
      {children}
      <button
        type="button"
        onClick={toggle}
        aria-label={full ? (en ? "Exit full screen" : "Tam ekrandan çık") : en ? "Full screen" : "Tam ekran"}
        className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-night/55 text-bone opacity-80 backdrop-blur-sm transition-[opacity,background-color] hover:bg-night hover:opacity-100 focus-visible:opacity-100 sm:opacity-0 sm:group-hover/fs:opacity-100 data-[on]:opacity-100"
        data-on={full || undefined}
      >
        {full ? (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
            <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
          </svg>
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        )}
      </button>

      {fallback &&
        createPortal(
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={en ? "Full screen" : "Tam ekran"}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black [&_video]:object-contain [&>div:first-child]:relative [&>div:first-child]:h-full [&>div:first-child]:w-full"
          >
            <div>{children}</div>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setFallback(false)}
              aria-label={en ? "Exit full screen" : "Tam ekrandan çık"}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-night/70 text-bone backdrop-blur-sm transition-colors hover:bg-night"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden>
            <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
          </svg>
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}
