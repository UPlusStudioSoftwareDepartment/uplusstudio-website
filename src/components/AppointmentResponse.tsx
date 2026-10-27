"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MascotDuo } from "@/components/mascots/Mascots";
import { copyRich, gmailComposeUrl, mailPlatform, mailtoUrl, openUrl, pasteableHtml } from "@/lib/gmailCompose";

interface Appointment {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
}

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const EASE = [0.76, 0, 0.24, 1] as const;

function formatDate(date: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (!m) return { line: date, day: "" };
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  return { line: `${d} ${MONTHS[mo - 1]} ${y}`, day: DAYS[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()] };
}

export default function AppointmentResponse({
  token,
  initialAction,
  reference,
  appointment,
}: Readonly<{ token: string; initialAction: "approve" | "decline"; reference: string; appointment: Appointment | null }>) {
  const [action, setAction] = useState<"approve" | "decline">(initialAction);
  const [note, setNote] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [composed, setComposed] = useState(false);
  const [pasted, setPasted] = useState(false);

  if (!appointment) {
    return (
      <section className="mx-auto flex min-h-[100svh] max-w-xl flex-col items-center justify-center px-4 text-center text-ink">
        <p className="eyebrow text-clay">Randevu yanıtı</p>
        <h1 className="mt-6 font-sans text-[clamp(2rem,5vw,3rem)] font-light leading-tight tracking-[-0.02em]">Bu bağlantı geçersiz ya da süresi dolmuş.</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-mute">Randevu e-postasındaki bağlantıyı yeniden açmayı deneyin. Bağlantılar 30 gün geçerlidir.</p>
        <Link href="/tr" className="mt-10 inline-flex min-h-12 items-center gap-4 rounded-[3px] border border-ink/50 px-6 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors hover:border-bone hover:bg-night">
          Ana sayfa →
        </Link>
      </section>
    );
  }

  const { line, day } = formatDate(appointment.date);
  const decline = action === "decline";
  const canSend = state !== "sending" && (!decline || note.trim().length >= 3);

  const submit = async () => {
    if (!canSend) return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/appointment-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, action, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data?.error as string) || "Gönderilemedi, lütfen tekrar deneyin.");
        setState("error");
        return;
      }
      const compose = data?.compose as { to: string; subject: string; html: string; text: string } | undefined;
      if (compose && mailPlatform() !== "desktop") {
        globalThis.location.href = mailtoUrl(compose.to, compose.subject, compose.text);
        setPasted(false);
      } else if (compose) {
        const copied = await copyRich(pasteableHtml(compose.html), compose.text);
        openUrl(gmailComposeUrl(compose.to, compose.subject, copied ? undefined : compose.text));
        setPasted(copied);
      }
      setComposed(Boolean(compose));
      setState("done");
    } catch {
      setError("Bağlantı hatası, lütfen tekrar deneyin.");
      setState("error");
    }
  };

  return (
    <section className="mx-auto max-w-[1100px] px-4 pb-28 pt-32 text-ink sm:px-8 sm:pt-40">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-5">
        <p className="eyebrow text-clay">Randevu yanıtı</p>
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-mute">
          Talep <span className="text-ink">#{reference}</span>
        </p>
      </div>

      <AnimatePresence mode="wait">
        {state === "done" ? (
          <motion.div
            key="done"
            className="flex flex-col items-center py-24 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <MascotDuo pose="cheer" size="md" />
            <h1 className="mt-8 font-sans text-[clamp(2rem,5vw,3.25rem)] font-light leading-tight tracking-[-0.02em]">
              {composed
                ? "Yanıtınız Gmail'de hazır."
                : decline
                  ? "Açıklamanız müşteriye iletildi."
                  : "Onay müşteriye gönderildi."}
            </h1>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-mute">
              {composed
                ? pasted
                  ? `${decline ? "Açıklamalı bilgilendirme" : "Onay"} kartı kopyalandı. Gmail'de mesaj alanına tıklayıp Ctrl+V (Mac'te ⌘+V) ile yapıştırın ve Gönder'e basın.`
                  : `Gmail'de ${appointment.email} adresine e-posta açıldı; Gönder'e basmanız yeterli.`
                : `${appointment.name} (${appointment.email}) adresine ${decline ? "açıklamalı bilgilendirme" : "takvim davetiyle onay"} e-postası gitti.`}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="lg:col-span-6">
              <h1 className="font-sans text-[clamp(2rem,4.4vw,3.5rem)] font-light leading-[1.05] tracking-[-0.03em]">
                {appointment.name} <span className="font-serif italic text-mute">ile görüşme</span>
              </h1>

              <div className="mt-8 overflow-hidden rounded-[6px] border border-line bg-paper-2/60">
                <div className="p-6 sm:p-7">
                  <p className="eyebrow text-mute">Tarih</p>
                  <p className="mt-3 font-serif text-[clamp(2.25rem,4vw,3rem)] italic leading-none">{line}</p>
                </div>
                <div className="mx-6 border-t border-dashed border-line sm:mx-7" />
                <dl className="grid grid-cols-3 gap-4 p-6 sm:p-7">
                  <div>
                    <dt className="eyebrow text-mute">Gün</dt>
                    <dd className="mt-2 text-[15px]">{day || "—"}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-mute">Saat</dt>
                    <dd className="mt-2 text-[15px] font-medium">{appointment.time}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-mute">Hizmet</dt>
                    <dd className="mt-2 text-[15px] text-clay">{appointment.service}</dd>
                  </div>
                </dl>
              </div>

              <dl className="mt-8 border-t border-line text-[15px]">
                {[
                  ["E-posta", <a key="e" href={`mailto:${appointment.email}`} className="hover:text-clay">{appointment.email}</a>],
                  ["Telefon", <a key="p" href={`tel:${appointment.phone.replace(/[^\d+]/g, "")}`} className="hover:text-clay">{appointment.phone}</a>],
                ].map(([label, value]) => (
                  <div key={label as string} className="grid grid-cols-3 gap-4 border-b border-line py-3.5">
                    <dt className="eyebrow pt-1 text-mute">{label}</dt>
                    <dd className="col-span-2">{value}</dd>
                  </div>
                ))}
              </dl>
              {appointment.message.trim() && (
                <blockquote className="mt-8 border-l-2 border-clay pl-5 font-serif text-[18px] italic leading-relaxed text-ink/90">
                  “{appointment.message.trim()}”
                </blockquote>
              )}
            </div>

            <div className="lg:col-span-5 lg:col-start-8">
              <div className="rounded-[6px] border border-line bg-paper-2/40 p-6 sm:p-8">
                <p className="eyebrow text-mute">Yanıtınız</p>
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-[4px] border border-line p-1" role="tablist" aria-label="Yanıt">
                  {(["approve", "decline"] as const).map((a) => (
                    <button
                      key={a}
                      type="button"
                      role="tab"
                      aria-selected={action === a}
                      onClick={() => setAction(a)}
                      className={`min-h-11 rounded-[3px] font-mono text-[12px] uppercase tracking-[0.12em] transition-colors ${
                        action === a ? (a === "approve" ? "bg-bone text-night" : "bg-clay text-night") : "text-mute hover:text-ink"
                      }`}
                    >
                      {a === "approve" ? "Onayla ✓" : "Reddet ✕"}
                    </button>
                  ))}
                </div>

                <label htmlFor="response-note" className="mt-8 block font-mono text-[12px] uppercase tracking-[0.12em] text-mute">
                  {decline ? "Açıklama (müşteriye iletilecek) *" : "Not (isteğe bağlı)"}
                </label>
                <textarea
                  id="response-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={5}
                  maxLength={1000}
                  placeholder={
                    decline
                      ? "Örn. O saatte şantiyedeyiz; 6 Kasım Perşembe 10:00 size uyar mı?"
                      : "Örn. Gelirken mevcut planlarınızı ve fotoğraflarınızı getirebilirsiniz."
                  }
                  className="mt-3 w-full resize-none border-0 border-b border-line bg-transparent py-3 text-[16px] leading-relaxed text-ink placeholder:text-mute/60 focus:border-ink"
                />
                <p className="mt-2 text-right font-mono text-[11px] text-mute">{note.length} / 1000</p>

                <button
                  type="button"
                  onClick={submit}
                  disabled={!canSend}
                  className={`mt-6 inline-flex min-h-14 w-full items-center justify-between rounded-[3px] border px-6 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    decline ? "border-clay text-clay hover:bg-night" : "border-bone text-ink hover:bg-night"
                  }`}
                >
                  {state === "sending" ? "Gönderiliyor…" : decline ? "Açıklamayla reddet" : "Onayla ve müşteriye bildir"}
                  <span aria-hidden>→</span>
                </button>
                <p className="mt-4 text-[13px] leading-relaxed text-mute">
                  {decline
                    ? "Müşteriye nazik bir bilgilendirme ve yeni zaman seçebileceği bir bağlantı gider."
                    : "Müşteriye adres, yol tarifi ve takvim dosyasıyla bir onay e-postası gider."}
                </p>
                {state === "error" && <p className="mt-4 text-[14px] text-clay" role="alert">{error}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
