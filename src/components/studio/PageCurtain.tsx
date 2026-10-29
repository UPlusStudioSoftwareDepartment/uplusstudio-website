"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const LETTERS = "STUDIO".split("");
const FIRST_VISIT_MIN_MS = 900;
const FIRST_VISIT_MAX_MS = 2600;
const LEAVE_MS = 1500;
// Longest the screen stays frozen waiting for the next route; slower routes finish without the fade, under the pending line.
const SWAP_TIMEOUT_MS = 600;
const PENDING_MAX_MS = 10000;
const SEEN_KEY = "u-curtain";

let booted = false;
let swapped: (() => void) | null = null;
let pendingTimer: ReturnType<typeof setTimeout> | undefined;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
const stillMotion = () => globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;

function seenThisSession() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {}
}

// html[data-navigating] draws the thin line at the top (globals.css) until the next route mounts.
function markPending() {
  document.documentElement.dataset.navigating = "";
  clearTimeout(pendingTimer);
  pendingTimer = setTimeout(clearPending, PENDING_MAX_MS);
}

function clearPending() {
  clearTimeout(pendingTimer);
  delete document.documentElement.dataset.navigating;
}

export function navigateSmoothly(go: () => void) {
  markPending();
  if (!document.startViewTransition || stillMotion()) {
    go();
    return;
  }
  const transition = document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        swapped = resolve;
        setTimeout(resolve, SWAP_TIMEOUT_MS);
        go();
      })
  );
  // A second tap skips the running transition; its promises then reject with AbortError, which is expected.
  transition.ready.catch(() => {});
  transition.finished.catch(() => {});
}

function pageLink(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const link = (event.target as Element | null)?.closest?.("a[href]");
  if (!(link instanceof HTMLAnchorElement) || (link.target && link.target !== "_self") || link.hasAttribute("download")) return null;
  const button = (event.target as Element).closest("button");
  if (button && link.contains(button)) return null;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || url.pathname === location.pathname) return null;
  if (url.pathname.startsWith("/api/") || /\.[a-z0-9]+$/i.test(url.pathname)) return null;
  return url;
}

function pageReady() {
  const loaded =
    document.readyState === "complete" ? Promise.resolve() : new Promise((resolve) => globalThis.addEventListener("load", resolve, { once: true }));
  return Promise.race([
    Promise.all([loaded, document.fonts.ready, wait(FIRST_VISIT_MIN_MS - performance.now())]),
    wait(FIRST_VISIT_MAX_MS - performance.now()),
  ]);
}

export default function PageCurtain() {
  return <Curtain key={usePathname()} />;
}

function Curtain() {
  const [phase, setPhase] = useState<"cover" | "leave" | "done">(() => (booted ? "done" : "cover"));
  const router = useRouter();

  useLayoutEffect(() => {
    swapped?.();
    swapped = null;
    clearPending();
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const url = pageLink(event);
      if (!url) return;
      if (!document.startViewTransition || stillMotion()) {
        markPending();
        return;
      }
      event.preventDefault();
      navigateSmoothly(() => router.push(url.pathname + url.search + url.hash));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    if (booted) return;
    const root = document.documentElement;
    const skip = stillMotion() || seenThisSession();
    if (!skip) root.dataset.curtain = "";
    let alive = true;
    (skip ? Promise.resolve() : pageReady()).then(() => {
      booted = true;
      delete root.dataset.curtain;
      if (!skip) markSeen();
      if (alive) setPhase(skip ? "done" : "leave");
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
