"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { MascotDuo } from "@/components/mascots/Mascots";

export default function LocaleNotFound() {
  const locale = useLocale();
  const t = useTranslations("common");
  const tm = useTranslations("studio.mascots");

  return (
    <section className="relative mx-auto flex min-h-[100svh] max-w-[2560px] flex-col justify-center px-4 pb-20 pt-32 sm:px-8 lg:px-12">
      {/* CSS keyframes, not framer: the text is readable before the app hydrates. */}
      <p className="eyebrow flex animate-[rise_0.8s_var(--ease-out-studio)_backwards] flex-wrap items-center gap-x-4 gap-y-2 text-mute [--rise:10px] motion-reduce:animate-none">
        <span className="text-ink">Err</span>
        <span className="h-px w-10 bg-ink/40" aria-hidden />
        <span>{t("notFound")}</span>
      </p>

      <h1 className="display mt-8 overflow-hidden pb-[0.06em] text-[clamp(8rem,32vw,30rem)] leading-[0.82] text-ink">
        <span className="block animate-[line-up_1s_var(--ease-studio)_0.1s_backwards] motion-reduce:animate-none">
          4<em className="font-serif font-normal italic tracking-normal">0</em>4
        </span>
        <span className="sr-only"> — {t("notFound")}</span>
      </h1>

      <div className="mt-10 flex animate-[rise_0.9s_var(--ease-out-studio)_0.5s_backwards] flex-col gap-6 border-t border-line pt-6 [--rise:16px] motion-reduce:animate-none sm:flex-row sm:items-baseline sm:justify-between">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute">
          {`/${locale}`} · {t("notFound")}
        </p>
        <MascotDuo pose="think" size="sm" message={tm("notFound")} className="self-start sm:self-auto" />
        <Link
          href={`/${locale}`}
          className="group inline-flex items-center gap-3 self-start border-b border-ink pb-1 text-[17px] text-ink hover:border-clay hover:text-clay"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1" aria-hidden>←</span>
          {t("backHome")}
        </Link>
      </div>
    </section>
  );
}
