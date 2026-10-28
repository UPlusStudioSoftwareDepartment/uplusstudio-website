"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

const TOUCH_SLOP_PX = 8;

interface BeforeAfterProps {
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  beforeLabel: string;
  afterLabel: string;
  dragLabel?: string;
  aspectClass?: string;
  sizes?: string;
}

export default function BeforeAfter({
  before,
  after,
  beforeLabel,
  afterLabel,
  dragLabel,
  aspectClass = "aspect-video",
  sizes = "100vw",
}: Readonly<BeforeAfterProps>) {
  const [position, setPosition] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") startDrag(e);
    else touchStartRef.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) {
      updateFromClientX(e.clientX);
      return;
    }
    const start = touchStartRef.current;
    if (!start) return;
    const dx = Math.abs(e.clientX - start.x);
    if (dx > TOUCH_SLOP_PX && dx > Math.abs(e.clientY - start.y)) startDrag(e);
  };
  const onPointerUp = () => {
    draggingRef.current = false;
    touchStartRef.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
  };

  return (
    <div
      ref={frameRef}
      className={`relative w-full touch-pan-y select-none overflow-hidden cursor-ew-resize ${aspectClass}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
        <Image src={after.src} alt={after.alt} fill sizes={sizes} className="object-cover" draggable={false} />
        <span className="eyebrow absolute right-4 top-4 bg-night/60 px-3 py-1.5 text-bone backdrop-blur-sm">{afterLabel}</span>
      </div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes={sizes} className="object-cover" draggable={false} />
        <span className="eyebrow absolute left-4 top-4 bg-night/60 px-3 py-1.5 text-bone backdrop-blur-sm">{beforeLabel}</span>
      </div>

      <div
        role="slider"
        tabIndex={0}
        aria-label={dragLabel ?? `${beforeLabel} / ${afterLabel}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onKeyDown={onKeyDown}
        className="absolute inset-y-0 -ml-px w-px bg-bone outline-none"
        style={{ left: `${position}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bone/80 bg-night/40 text-bone backdrop-blur-md">
          <svg className="h-4 w-6" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
            <path d="M7 3L2 8l5 5M17 3l5 5-5 5" />
          </svg>
        </span>
      </div>
    </div>
  );
}
