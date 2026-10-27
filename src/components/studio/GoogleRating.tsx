"use client";

import { useLocale } from "next-intl";
import { studioInfo } from "@/lib/studio-info";

export default function GoogleRating({ className = "" }: Readonly<{ className?: string }>) {
  const locale = useLocale();
  const reviews =
    locale === "tr" ? `Google'da ${studioInfo.googleReviewCount} yorum` : `${studioInfo.googleReviewCount} Google reviews`;

  return (
    <a
      href={studioInfo.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-3 text-[14px] ${className}`}
      aria-label={`${studioInfo.googleRating} / 5 — ${reviews}`}
    >
      <span className="flex gap-0.5 text-clay" aria-hidden>
        {"★★★★★"}
      </span>
      <span className="font-medium">{studioInfo.googleRating}</span>
      <span className="opacity-70 transition-opacity group-hover:opacity-100">
        {reviews} ↗
      </span>
    </a>
  );
}
