"use client";

import { useState } from "react";
import { m } from "framer-motion";
import { Pass } from "@/components/AppointmentPass";
import { calendarUrl, whatsappNumber } from "@/lib/appointmentLinks";
import { CARD_FILE, canShareFiles, imageAsJpeg } from "@/lib/cardImage";
import { followLink } from "@/lib/gmailCompose";

interface Appointment {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
}

const EASE = [0.76, 0, 0.24, 1] as const;

const CARD_BUTTON =
  "inline-flex min-h-12 w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-[3px] border border-ink/30 px-4 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors hover:border-bone hover:bg-night disabled:opacity-50";

export default function AppointmentCardView({
  appointment,
  token,
  reference,
  via = "whatsapp",
}: Readonly<{ appointment: Appointment | null; token: string; reference: string; via?: "mail" | "whatsapp" }>) {
  const [sharing, setSharing] = useState(false);
  if (!appointment) {
    return (
      <section className="mx-auto flex min-h-[100svh] max-w-xl flex-col items-center justify-center px-4 text-center text-ink">
        <p className="eyebrow text-clay">Randevu kartı</p>
        <h1 className="mt-6 font-sans text-[clamp(2rem,5vw,3rem)] font-light leading-tight tracking-[-0.02em]">Bu kart geçersiz ya da süresi dolmuş.</h1>
      </section>
    );
  }

  const first = appointment.name.trim().split(/\s+/)[0] ?? "";
  const wa = whatsappNumber(appointment.phone);
  const waLink = `https://wa.me/${wa}?text=${encodeURIComponent(`Merhaba ${first}, U+ Studio'dan yazıyoruz. Randevu talebinizi aldık.`)}`;
  const image = `/api/appointment-card?t=${encodeURIComponent(token)}`;

  const shareCard = async () => {
    const download = () => followLink(`${image}&download=1`);
    if (!canShareFiles()) {
      download();
      return;
    }
    setSharing(true);
    try {
      const jpeg = await imageAsJpeg(image);
      if (!jpeg) return download();
      await navigator.share({ files: [new File([jpeg], CARD_FILE, { type: "image/jpeg" })], title: `U+ Studio randevu kartı · UP-${reference}` });
    } catch (e) {
      if ((e as Error)?.name !== "AbortError") download();
    } finally {
      setSharing(false);
    }
  };

  const gcal = calendarUrl({
    date: appointment.date,
    time: appointment.time,
    title: `U+ Studio — ${appointment.name}`,
    details: `Hizmet: ${appointment.service}\nTelefon: ${appointment.phone}\nE-posta: ${appointment.email}\n\n${appointment.message}`,
  });
  const actions = [
    { href: waLink, label: "WhatsApp'tan yanıtla", primary: true },
    { href: `tel:${appointment.phone.replace(/[^\d+]/g, "")}`, label: "Ara" },
    ...(gcal ? [{ href: gcal, label: "Takvime ekle" }] : []),
    { href: `mailto:${appointment.email}`, label: "E-posta" },
  ];

  return (
    <section className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-14 px-4 pb-28 pt-32 text-ink sm:px-8 sm:pt-40 lg:grid-cols-12 lg:gap-10">
      <m.div className="min-w-0 lg:col-span-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
        <p className="eyebrow text-clay">Yeni randevu talebi · UP-{reference}</p>
        <h1 className="mt-6 font-sans text-[clamp(2.25rem,5vw,3.75rem)] font-light leading-[1.05] tracking-[-0.03em]">
          {appointment.name} <span className="font-serif italic text-mute">yüz yüze görüşmek istiyor.</span>
        </h1>
        {appointment.message.trim() && (
          <blockquote className="mt-8 border-l-2 border-clay pl-5 font-serif text-[18px] italic leading-relaxed text-ink/90">“{appointment.message.trim()}”</blockquote>
        )}
        <dl className="mt-8 border-t border-line text-[15px]">
          <div className="grid grid-cols-3 gap-4 border-b border-line py-3.5">
            <dt className="eyebrow pt-1 text-mute">Telefon</dt>
            <dd className="col-span-2 break-words">{appointment.phone}</dd>
          </div>
          <div className="grid grid-cols-3 gap-4 border-b border-line py-3.5">
            <dt className="eyebrow pt-1 text-mute">E-posta</dt>
            <dd className="col-span-2 break-all">{appointment.email}</dd>
          </div>
        </dl>
        <div className="mt-10 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          {actions.map((a) => (
            <a
              key={a.label}
              href={a.href}
              target={a.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`group inline-flex min-h-12 w-full items-center justify-between gap-3 whitespace-nowrap rounded-[3px] border px-5 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors hover:bg-night ${
                a.primary ? "border-bone" : "border-ink/30 hover:border-bone"
              }`}
            >
              {a.label}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          ))}
        </div>
      </m.div>
      <m.div className="min-w-0 lg:col-span-5 lg:col-start-8" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}>
        <Pass appointment={appointment} reference={reference} status={via === "mail" ? "E-postayla geldi" : "WhatsApp'tan geldi"} />
        <div className="mx-auto mt-4 grid w-full max-w-[440px] grid-cols-2 gap-2">
          <a href={`${image}&download=1`} download className={CARD_BUTTON}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={1.5} strokeLinecap="round" d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" /></svg>
            Kartı indir
          </a>
          <button type="button" onClick={shareCard} disabled={sharing} className={CARD_BUTTON}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={1.5} strokeLinecap="round" d="M12 3v12m0-12 4 4m-4-4-4 4M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" /></svg>
            Kartı paylaş
          </button>
        </div>
      </m.div>
    </section>
  );
}
