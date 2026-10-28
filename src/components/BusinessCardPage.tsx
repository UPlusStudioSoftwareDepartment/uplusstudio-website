"use client";

import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { icons } from "@/components/studio/SocialLinks";
import { useAppointment } from "@/contexts/AppointmentContext";
import { studioInfo } from "@/lib/studio-info";

const COPY = {
  tr: { title: "U+ Studio dijital kartviziti", call: "Ara", whatsapp: "WhatsApp", directions: "Yol tarifi", save: "Rehbere ekle", book: "Randevu al", close: "Kapat ve ana sayfaya dön" },
  en: { title: "U+ Studio digital business card", call: "Call", whatsapp: "WhatsApp", directions: "Directions", save: "Save contact", book: "Book a meeting", close: "Close and go to the home page" },
};

const action =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] border border-bone/30 px-3 font-mono text-[12px] uppercase tracking-[0.1em] text-bone transition-colors hover:border-bone hover:bg-night [&>svg]:h-4 [&>svg]:w-4";

export default function BusinessCardPage({ locale }: Readonly<{ locale: "tr" | "en" }>) {
  const c = COPY[locale];
  const { openAppointment } = useAppointment();
  return (
    <section className="mx-auto w-full max-w-[560px] px-3 pb-16 pt-[6.25rem] sm:pt-36">
      <h1 className="sr-only">{c.title}</h1>
      <ServiceCard
        locale={locale}
        priority
        topAction={
          <Link
            href={`/${locale}`}
            aria-label={c.close}
            className="mb-2 flex h-9 w-9 items-center justify-center rounded-full border border-bone/40 text-bone transition-colors hover:border-bone hover:bg-bone hover:text-night"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeWidth={1.5} strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </Link>
        }
      />
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <a href={studioInfo.phoneHref} className={action}>
          {icons.phone}
          {c.call}
        </a>
        <a href={studioInfo.whatsappUrl} target="_blank" rel="noopener noreferrer" className={action}>
          {icons.whatsapp}
          {c.whatsapp}
        </a>
        <a href={studioInfo.directionsUrl} target="_blank" rel="noopener noreferrer" className={action}>
          {icons.directions}
          {c.directions}
        </a>
        <a href="/api/vcard" download className={action}>
          {icons.card}
          {c.save}
        </a>
      </div>
      <button
        type="button"
        onClick={openAppointment}
        className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-[3px] border border-bone bg-bone font-mono text-[12px] uppercase tracking-[0.12em] text-night transition-colors hover:bg-transparent hover:text-bone"
      >
        {c.book} →
      </button>
    </section>
  );
}
