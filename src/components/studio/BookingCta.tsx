"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { studioInfo } from "@/lib/studio-info";
import { icons } from "./SocialLinks";

export default function BookingCta({
  className,
  label,
  onBook,
  arrow,
  onMouseEnter,
}: Readonly<{ className: string; label: ReactNode; onBook: () => void; arrow?: ReactNode; onMouseEnter?: () => void }>) {
  const t = useTranslations("studio");
  return (
    <>
      <a href={studioInfo.phoneHref} className={`${className} sm:hidden`}>
        <span className="inline-flex items-center gap-2 [&>svg]:h-4 [&>svg]:w-4">
          {icons.phone}
          {t("nav.callNow")}
        </span>
        {arrow}
      </a>
      <button type="button" onClick={onBook} onMouseEnter={onMouseEnter} className={`${className} max-sm:hidden`}>
        {label}
        {arrow}
      </button>
    </>
  );
}
