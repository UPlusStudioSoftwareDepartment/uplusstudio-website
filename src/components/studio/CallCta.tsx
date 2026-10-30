"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { studioInfo } from "@/lib/studio-info";
import PhoneRing from "./PhoneRing";

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
        <PhoneRing />
        {t("callNow")}
      </span>
      {arrow}
    </a>
  );
}
