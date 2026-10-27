"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MascotDuo } from "@/components/mascots/Mascots";
import { useAppointment } from "@/contexts/AppointmentContext";

interface Appointment {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
}

type Mode = "confirm" | "edit" | "cancel";

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const EASE = [0.76, 0, 0.24, 1] as const;

function dateParts(date: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (!m) return { day: "—", monthYear: date, weekday: "" };
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  return {
    day: String(d).padStart(2, "0"),
    monthYear: `${MONTHS[mo - 1]} ${y}`,
    weekday: DAYS[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()],
  };
}

export function Pass({ appointment, reference, status }: Readonly<{ appointment: Appointment; reference: string; status: string }>) {
  const { day, monthYear, weekday } = dateParts(appointment.date);
  return (
    <div className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-[14px] border border-line bg-[#141413] text-bone shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
      <div className="px-8 pt-10 text-center">
        <p className="font-serif text-[64px] font-bold leading-none">U+</p>
        <p className="mt-3 text-[11px] font-bold tracking-[0.55em] text-bone/70">STUDIO</p>
        <div className="mt-6 h-px bg-bone/25" />
        <p className="mt-5 text-[10px] font-bold tracking-[0.3em] text-bone/60">RANDEVU KARTI</p>
        <span className="mt-3 inline-block rounded-full border border-clay px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-clay">{status}</span>
      </div>
      <dl className="space-y-6 px-9 pt-8">
        <div>
          <dt className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-bone/50">Misafir</dt>
          <dd className="mt-2 font-serif text-[28px] font-bold leading-tight">{appointment.name}</dd>
        </div>
        <div>
          <dt className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-bone/50">Hizmet</dt>
          <dd className="mt-2 font-serif text-[20px] font-bold text-clay">{appointment.service}</dd>
        </div>
        <div className="grid grid-cols-[1.4fr_1fr] gap-3">
          <div className="overflow-hidden rounded-[10px] border border-bone/15 bg-paper-2">
            <div className="h-1 bg-clay" />
            <div className="p-4">
              <dt className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-bone/50">Tarih</dt>
              <dd className="mt-2 flex items-center gap-3">
                <span className="font-serif text-[44px] font-bold leading-[0.9]">{day}</span>
                <span className="border-l border-bone/15 pl-3">
                  <span className="block font-serif text-[16px] italic leading-tight">{monthYear}</span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-clay">{weekday}</span>
                </span>
              </dd>
            </div>
          </div>
          <div className="overflow-hidden rounded-[10px] border border-bone/15 bg-paper-2">
            <div className="h-1 bg-bone/35" />
            <div className="p-4">
              <dt className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-bone/50">Saat</dt>
              <dd className="mt-2 font-serif text-[34px] font-bold leading-none">{appointment.time}</dd>
              <dd className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-mute">1 saat · İncek</dd>
            </div>
          </div>
        </div>
      </dl>
      <div className="relative mt-8 flex items-center">
        <span className="-ml-3.5 h-7 w-7 rounded-full bg-night" aria-hidden />
        <span className="mx-2 h-0 flex-1 border-t-2 border-dashed border-white/20" aria-hidden />
        <span className="-mr-3.5 h-7 w-7 rounded-full bg-night" aria-hidden />
      </div>
      <div className="flex items-center justify-between px-9 pb-9 pt-6">
        <span className="flex h-9 items-stretch gap-[2px]" aria-hidden>
          {Array.from({ length: 34 }, (_, i) => (
            <span key={i} className={i % 2 === 0 ? "bg-bone" : "bg-transparent"} style={{ width: ((i * 7 + reference.charCodeAt(i % reference.length || 0)) % 3) + 1 }} />
          ))}
        </span>
        <span className="text-right">
          <span className="block font-mono text-[11px] font-bold text-bone/65">UP-{reference}</span>
          <span className="mt-1 block text-[8.5px] font-bold tracking-[0.14em] text-bone/45">U+ STUDIO · ANKARA</span>
        </span>
      </div>
    </div>
  );
}

export default function AppointmentCustomerAction({
  mode,
  token,
  reference,
  appointment,
}: Readonly<{ mode: Mode; token: string; reference: string; appointment: Appointment | null }>) {
  const { openAppointment, openAppointmentWith } = useAppointment();
  const [state, setState] = useState<"working" | "done" | "error">(mode === "confirm" ? "working" : "done");
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (!appointment || started.current) return;
    started.current = true;
    if (mode === "edit") {
      openAppointmentWith(appointment);
      return;
    }
    if (mode !== "confirm") return;
    const key = `uplus-confirmed-${reference}`;
    let already = false;
    try {
      already = sessionStorage.getItem(key) === "1";
    } catch {}
    if (already) {
      setTimeout(() => setState("done"), 0);
      return;
    }
    fetch("/api/appointment-confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (res.ok) {
          try {
            sessionStorage.setItem(key, "1");
          } catch {}
          setState("done");
          return;
        }
        const data = await res.json().catch(() => ({}));
        setError(
          data?.error === "Email service not configured"
            ? "E-posta servisi henüz yapılandırılmadı. Lütfen bizi arayın: +90 545 320 40 07"
            : (data?.error as string) || "Talebiniz iletilemedi, lütfen tekrar deneyin."
        );
        setState("error");
      })
      .catch(() => {
        setError("Bağlantı hatası, lütfen tekrar deneyin.");
        setState("error");
      });
  }, [appointment, mode, token, reference, openAppointmentWith]);

  if (!appointment) {
    return (
      <section className="mx-auto flex min-h-[100svh] max-w-xl flex-col items-center justify-center px-4 text-center text-ink">
        <p className="eyebrow text-clay">Randevu</p>
        <h1 className="mt-6 font-sans text-[clamp(2rem,5vw,3rem)] font-light leading-tight tracking-[-0.02em]">Bu bağlantı geçersiz ya da süresi dolmuş.</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-mute">Yeni bir randevu talebi oluşturabilirsiniz.</p>
        <button type="button" onClick={openAppointment} className="mt-10 inline-flex min-h-12 items-center gap-4 rounded-[3px] border border-ink/50 px-6 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors hover:border-bone hover:bg-night">
          Randevu al →
        </button>
      </section>
    );
  }

  const copy = {
    confirm: {
      eyebrow: "Randevu onayı",
      status: state === "done" ? "Stüdyoya iletildi" : state === "error" ? "İletilemedi" : "İletiliyor…",
      title: state === "done" ? "Teşekkürler, talebiniz stüdyomuza iletildi." : state === "error" ? "Talebiniz şu an iletilemedi." : "Talebiniz iletiliyor…",
      body:
        state === "done"
          ? "Mimarımız talebinizi inceleyip kısa süre içinde onay ya da alternatif bir saatle size e-posta ile dönecek."
          : state === "error"
            ? error
            : "Lütfen birkaç saniye bekleyin.",
    },
    edit: {
      eyebrow: "Randevuyu düzelt",
      status: "Düzenleniyor",
      title: "Bilgilerinizi düzeltin.",
      body: "Randevu formu bilgilerinizle dolu olarak açıldı. Değiştirip yeniden gönderdiğinizde size yeni bir kart gelir; eski kartı yok sayabilirsiniz.",
    },
    cancel: {
      eyebrow: "Randevu talebi",
      status: "İptal edildi",
      title: "Talebiniz iptal edildi.",
      body: "Bu talep stüdyomuza iletilmedi. Dilediğiniz zaman yeni bir randevu oluşturabilirsiniz.",
    },
  }[mode];

  return (
    <section className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-14 px-4 pb-28 pt-32 text-ink sm:px-8 sm:pt-40 lg:grid-cols-12 lg:gap-10">
      <motion.div className="lg:col-span-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
        <p className="eyebrow text-clay">{copy.eyebrow}</p>
        <h1 className="mt-6 font-sans text-[clamp(2.25rem,5vw,3.75rem)] font-light leading-[1.05] tracking-[-0.03em]">{copy.title}</h1>
        <p className="mt-6 max-w-md text-[17px] leading-relaxed text-mute">{copy.body}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          {mode === "edit" && (
            <button type="button" onClick={() => openAppointmentWith(appointment)} className="inline-flex min-h-12 items-center gap-4 rounded-[3px] border border-bone px-6 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors hover:bg-night">
              Formu aç →
            </button>
          )}
          {mode === "cancel" && (
            <button type="button" onClick={openAppointment} className="inline-flex min-h-12 items-center gap-4 rounded-[3px] border border-bone px-6 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors hover:bg-night">
              Yeni randevu al →
            </button>
          )}
          {mode === "confirm" && state === "error" && (
            <a href="tel:+905453204007" className="inline-flex min-h-12 items-center gap-4 rounded-[3px] border border-bone px-6 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors hover:bg-night">
              Bizi arayın →
            </a>
          )}
          <Link href="/tr" className="inline-flex min-h-12 items-center gap-4 rounded-[3px] border border-ink/30 px-6 font-mono text-[12px] uppercase tracking-[0.12em] text-mute transition-colors hover:border-bone hover:bg-night hover:text-ink">
            Ana sayfa
          </Link>
        </div>
        {mode === "confirm" && state === "done" && <MascotDuo pose="cheer" size="sm" message="Görüşmek üzere!" className="mt-12" />}
      </motion.div>
      <motion.div className="lg:col-span-5 lg:col-start-8" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}>
        <Pass appointment={appointment} reference={reference} status={copy.status} />
      </motion.div>
    </section>
  );
}
