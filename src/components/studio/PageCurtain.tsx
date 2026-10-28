"use client";

import { useEffect, useState } from "react";

const LETTERS = "STUDIO".split("");
const FIRST_VISIT_MIN_MS = 1100;
const FIRST_VISIT_MAX_MS = 2600;
const ROUTE_MS = 500;
const LEAVE_MS = 1500;

let booted = false;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));

function pageReady() {
  const loaded =
    document.readyState === "complete" ? Promise.resolve() : new Promise((resolve) => globalThis.addEventListener("load", resolve, { once: true }));
  return Promise.race([
    Promise.all([loaded, document.fonts.ready, wait(FIRST_VISIT_MIN_MS - performance.now())]),
    wait(FIRST_VISIT_MAX_MS - performance.now()),
  ]);
}

export default function PageCurtain() {
  const [phase, setPhase] = useState<"cover" | "leave" | "done">("cover");

  useEffect(() => {
    const root = document.documentElement;
    const still = globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!still) root.dataset.curtain = "";
    let alive = true;
    (still ? Promise.resolve() : booted ? wait(ROUTE_MS) : pageReady()).then(() => {
      booted = true;
      delete root.dataset.curtain;
      if (alive) setPhase(still ? "done" : "leave");
    });
    return () => {
      alive = false;
      delete root.dataset.curtain;
    };
  }, []);

  useEffect(() => {
    if (phase !== "leave") return;
    const id = setTimeout(() => setPhase("done"), LEAVE_MS);
    return () => clearTimeout(id);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className={`page-curtain ${phase === "leave" ? "is-leaving" : ""}`} aria-hidden data-nosnippet>
      <div className="curtain-mark flex w-[clamp(150px,22vw,240px)] flex-col items-center">
        <svg viewBox="0 0 200 120" className="w-[78%] overflow-visible">
          <path
            d="M22 4 V66 a42 42 0 0 0 84 0 V4"
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth="24"
            strokeDasharray="1"
            className="animate-[curtain-draw_0.6s_var(--ease-studio)_backwards]"
          />
          <g transform="translate(156 48)">
            <rect x="-30" y="-9" width="60" height="18" fill="currentColor" className="origin-center animate-[curtain-grow-x_0.45s_var(--ease-studio)_0.05s_backwards] [transform-box:fill-box]" />
            <rect x="-9" y="-30" width="18" height="60" fill="currentColor" className="origin-center animate-[curtain-grow-y_0.45s_var(--ease-studio)_0.1s_backwards] [transform-box:fill-box]" />
          </g>
        </svg>

        <span className="relative mt-[7%] block h-[2px] w-full overflow-hidden">
          <span className="absolute inset-0 animate-[curtain-grow-x_0.45s_var(--ease-studio)_0.05s_backwards] bg-current" />
          <span className="absolute inset-y-0 left-0 w-1/4 animate-[curtain-sweep_1.4s_var(--ease-studio)_0.3s_infinite_backwards] bg-linear-to-r from-transparent via-clay to-transparent" />
        </span>

        <span className="mt-[6%] flex w-full justify-between font-sans text-[clamp(1.6rem,3.4vw,2.6rem)] font-light leading-none">
          {LETTERS.map((letter, i) => (
            <span key={letter + i} className="block overflow-hidden pb-[0.08em]">
              <span className="block animate-[curtain-letter_0.45s_var(--ease-studio)_backwards]" style={{ animationDelay: `${0.05 + i * 0.035}s` }}>
                {letter}
              </span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
