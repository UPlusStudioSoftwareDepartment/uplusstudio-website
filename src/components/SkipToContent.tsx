"use client";

import { useTranslations } from "next-intl";

const MAIN_ID = "main-content";

export function SkipToContent() {
  const t = useTranslations("common");

  return (
    <a
      href={`#${MAIN_ID}`}
      className="fixed left-4 top-4 z-[100] -translate-y-[200%] bg-night px-4 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-bone transition-transform duration-300 focus:translate-y-0 focus-visible:outline-clay"
    >
      {t("skipToContent")}
    </a>
  );
}
