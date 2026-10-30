"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { reportError } from "@/lib/errorReport";

const ANALYTICS = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === "1";
const Analytics = dynamic(() => import("@vercel/analytics/next").then((mod) => mod.Analytics));
const SpeedInsights = dynamic(() => import("@vercel/speed-insights/next").then((mod) => mod.SpeedInsights));

// Contact intent only: which kind of contact link was used and on which page. No visitor data,
// no cookies; sent only where Vercel Analytics is switched on.
function contactEvent(target: EventTarget | null): string | null {
  const link = target instanceof Element ? target.closest("a[href]") : null;
  const href = link?.getAttribute("href") ?? "";
  if (href.startsWith("tel:")) return "click_phone";
  if (href.startsWith("mailto:")) return "click_email";
  if (href.includes("wa.me/") || href.includes("api.whatsapp.com")) return "click_whatsapp";
  return null;
}

export default function Telemetry() {
  useEffect(() => {
    if (!ANALYTICS) return;
    const onClick = (e: MouseEvent) => {
      const name = contactEvent(e.target);
      if (!name) return;
      void import("@vercel/analytics").then(({ track }) => track(name, { page: globalThis.location.pathname }));
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    const onError = (e: ErrorEvent) => reportError(e.error ?? e.message, { source: `${e.filename}:${e.lineno}:${e.colno}` });
    const onRejection = (e: PromiseRejectionEvent) => reportError(e.reason);
    globalThis.addEventListener("error", onError);
    globalThis.addEventListener("unhandledrejection", onRejection);
    return () => {
      globalThis.removeEventListener("error", onError);
      globalThis.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return ANALYTICS ? (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  ) : null;
}
