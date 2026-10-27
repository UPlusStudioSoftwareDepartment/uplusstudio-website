"use client";

import { motion } from "framer-motion";
import { Pass } from "@/components/AppointmentPass";

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

function whatsappNumber(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `90${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("5")) digits = `90${digits}`;
  return digits;
}

function calendarUrl(a: Appointment) {
  const d = /^(\d{4})-(\d{2})-(\d{2})/.exec(a.date);
  const t = /^(\d{1,2}):(\d{2})/.exec(a.time);
  if (!d) return "";
  const start = new Date(Date.UTC(Number(d[1]), Number(d[2]) - 1, Number(d[3]), (t ? Number(t[1]) : 10) - 3, t ? Number(t[2]) : 0));
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const stamp = (x: Date) => x.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const details = `Hizmet: ${a.service}\nTelefon: ${a.phone}\nE-posta: ${a.email}\n\n${a.message}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`U+ Studio — ${a.name}`)}&dates=${stamp(start)}/${stamp(end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent("Merkez İncek Plaza, Reyhan Cd. No:3, İncek · Gölbaşı / Ankara")}&ctz=Europe/Istanbul`;
}

export default function AppointmentCardView({ appointment, reference, via = "whatsapp" }: Readonly<{ appointment: Appointment | null; reference: string; via?: "mail" | "whatsapp" }>) {
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
  const gcal = calendarUrl(appointment);
  const actions = [
    { href: waLink, label: "WhatsApp'tan yanıtla", primary: true },
    { href: `tel:${appointment.phone.replace(/[^\d+]/g, "")}`, label: "Ara" },
    ...(gcal ? [{ href: gcal, label: "Takvime ekle" }] : []),
    { href: `mailto:${appointment.email}`, label: "E-posta" },
  ];

  return (
    <section className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-14 px-4 pb-28 pt-32 text-ink sm:px-8 sm:pt-40 lg:grid-cols-12 lg:gap-10">
      <motion.div className="min-w-0 lg:col-span-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
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
        <div className="mt-10 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          {actions.map((a) => (
            <a
              key={a.label}
              href={a.href}
              target={a.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className={`inline-flex min-h-12 items-center justify-center gap-3 whitespace-nowrap rounded-[3px] border px-5 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors hover:bg-night ${
                a.primary ? "col-span-2 border-bone sm:col-span-1" : "border-ink/30 hover:border-bone"
              }`}
            >
              {a.label} →
            </a>
          ))}
        </div>
      </motion.div>
      <motion.div className="min-w-0 lg:col-span-5 lg:col-start-8" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}>
        <Pass appointment={appointment} reference={reference} status={via === "mail" ? "E-postayla geldi" : "WhatsApp'tan geldi"} />
      </motion.div>
    </section>
  );
}
