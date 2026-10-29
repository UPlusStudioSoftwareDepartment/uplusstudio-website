"use client";

import type { MouseEvent, ReactNode } from "react";

// A global 404 bypasses the normal layout tree. Start a fresh document when leaving it,
// rather than retaining that tree in Next's client router after the URL has changed.
export default function NotFoundNavigation({
  children,
}: Readonly<{ children: ReactNode }>) {
  function navigate(event: MouseEvent<HTMLDivElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const link =
      event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!(link instanceof HTMLAnchorElement) || link.hasAttribute("download"))
      return;
    if (link.target && link.target !== "_self") return;
    const url = new URL(link.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search)
      return;
    event.preventDefault();
    event.stopPropagation();
    location.assign(url.href);
  }

  return (
    <div className="contents" onClickCapture={navigate}>
      {children}
    </div>
  );
}
