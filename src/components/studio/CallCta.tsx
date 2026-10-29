"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { studioInfo } from "@/lib/studio-info";
import { icons } from "./SocialLinks";

export default function CallCta({ className, arrow, onMouseEnter, onClick }: Readonly<{
  className: string;
  arrow?: ReactNode;
  onMouseEnter?: () => void;
  onClick?: () => void;
}>) {
  const t = useTranslations("studio.nav");
  return (
    <a href={studioInfo.phoneHref} className={className} onMouseEnter={onMouseEnter} onClick={onClick}>
      <span className="inline-flex items-center gap-2">
        <span className="phone-ring relative inline-flex [&>svg]:!h-[1.3em] [&>svg]:!w-[1.3em]" aria-hidden>{icons.phone}</span>
        {t("callNow")}
      </span>
      {arrow}
    </a>
  );
}
