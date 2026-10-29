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
      className={`group inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] ${className}`}
    >
      <span className="flex gap-0.5 text-clay" aria-hidden>
        {"★★★★★"}
      </span>
      <span className="font-medium">{studioInfo.googleRating}</span>
      <span className="opacity-85 transition-opacity group-hover:opacity-100">
        {reviews} ↗
      </span>
    </a>
  );
}
