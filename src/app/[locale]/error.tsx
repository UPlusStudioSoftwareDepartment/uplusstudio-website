"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LocaleError({ error, reset }: Readonly<ErrorProps>) {
  const t = useTranslations("common");
  const locale = useLocale();

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Route error:", error);
    }
  }, [error]);

  return (
    <section
      role="alert"
      className="relative mx-auto flex min-h-[100svh] max-w-[2560px] flex-col justify-center px-4 pb-20 pt-32 sm:px-8 lg:px-12"
    >
      <p className="eyebrow flex flex-wrap items-center gap-x-4 gap-y-2 text-mute">
        <span className="text-clay">Err</span>
        <span className="h-px w-10 bg-ink/40" aria-hidden />
        <span>{error.digest ? `ref ${error.digest}` : "500"}</span>
      </p>

      <h1 className="display mt-8 max-w-5xl text-[clamp(3rem,9vw,8.5rem)] text-ink">{t("errorTitle")}</h1>

      <div className="mt-12 grid grid-cols-1 gap-8 border-t border-line pt-6 lg:grid-cols-12">
        <p className="max-w-prose text-[17px] leading-relaxed text-mute lg:col-span-6">{t("errorDescription")}</p>
        <div className="flex flex-wrap items-baseline gap-x-10 gap-y-4 lg:col-span-6 lg:justify-end">
          <button
            type="button"
            onClick={reset}
            className="group inline-flex items-center gap-3 border-b border-ink pb-1 text-[17px] text-ink hover:border-clay hover:text-clay"
          >
            {t("retry")}
            <span className="transition-transform duration-300 group-hover:rotate-90" aria-hidden>↻</span>
          </button>
          <Link
            href={`/${locale}`}
            className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute hover:text-clay"
          >
            ← {t("backHome")}
          </Link>
        </div>
      </div>
    </section>
  );
}
