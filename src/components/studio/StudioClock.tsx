"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export default function StudioClock({ className = "" }: Readonly<{ className?: string }>) {
  const locale = useLocale();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 15_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  if (!now) return <span className={className}>&nbsp;</span>;

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Istanbul",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const hour = Number(get("hour"));
  const open = get("weekday") !== "Sun" && hour >= 9 && hour < 19;

  const label = locale === "tr" ? (open ? "Stüdyo açık" : "Stüdyo kapalı") : open ? "Studio open" : "Studio closed";

  return (
    <span className={`inline-flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.12em] ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-clay animate-pulse" : "bg-mute"}`} aria-hidden />
      Ankara {get("hour")}:{get("minute")} — {label}
    </span>
  );
}
