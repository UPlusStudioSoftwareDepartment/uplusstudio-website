"use client";

import ServiceCard from "@/components/ServiceCard";
import { icons } from "@/components/studio/SocialLinks";
import { useAppointment } from "@/contexts/AppointmentContext";
import { studioInfo } from "@/lib/studio-info";

const COPY = {
  tr: { call: "Ara", whatsapp: "WhatsApp", directions: "Yol tarifi", save: "Rehbere ekle", book: "Randevu al" },
  en: { call: "Call", whatsapp: "WhatsApp", directions: "Directions", save: "Save contact", book: "Book a meeting" },
};

const action =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] border border-bone/30 px-3 font-mono text-[12px] uppercase tracking-[0.1em] text-bone transition-colors hover:border-bone hover:bg-night [&>svg]:h-4 [&>svg]:w-4";

export default function BusinessCardPage({ locale }: Readonly<{ locale: "tr" | "en" }>) {
  const c = COPY[locale];
  const { openAppointment } = useAppointment();
  return (
    <section className="mx-auto w-full max-w-[560px] px-3 pb-16 pt-[9.5rem] sm:pt-40">
      <ServiceCard locale={locale} />
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
        <button type="button" onClick={() => (globalThis.location.href = "/api/vcard")} className={action}>
          {icons.card}
          {c.save}
        </button>
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
