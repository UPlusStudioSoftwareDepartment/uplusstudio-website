"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { MascotDuo } from "@/components/mascots/Mascots";
import { type ComposedMail, mailPlatform, mailtoUrl, openGmail } from "@/lib/gmailCompose";
import { FLEXIBLE_DATE, NO_DATE_HINT, TIME_SLOTS, TR_DAYS, TR_MONTHS, istanbulToday, parseAppointmentDate } from "@/lib/appointmentDate";

interface Appointment {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
  locale?: "tr" | "en";
}

const EASE = [0.76, 0, 0.24, 1] as const;

function formatDate(date: string) {
  const p = parseAppointmentDate(date);
  if (!p) return { line: FLEXIBLE_DATE.tr, day: "" };
  return { line: `${p.day} ${TR_MONTHS[p.month - 1]} ${p.year}`, day: TR_DAYS[p.weekday] };
}

export default function AppointmentResponse({
  token,
  signature,
  initialAction,
  reference,
  appointment,
}: Readonly<{ token: string; signature: string; initialAction: "approve" | "decline"; reference: string; appointment: Appointment | null }>) {
  const [action, setAction] = useState<"approve" | "decline">(initialAction);
  const [note, setNote] = useState("");
  const [pickedDate, setPickedDate] = useState("");
  const [pickedTime, setPickedTime] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [mail, setMail] = useState<ComposedMail | null>(null);
  const [opened, setOpened] = useState<boolean | null>(null);
  const [sentTo, setSentTo] = useState("");

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
  const english = appointment.locale === "en";
  const decline = action === "decline";
  const needsDate = !appointment.date;
  const needsTime = !appointment.time;
  const picking = !decline && (needsDate || needsTime);
  const slotReady = (!needsDate || Boolean(pickedDate)) && (!needsTime || Boolean(pickedTime));
  const canSend = state !== "sending" && (decline ? note.trim().length >= 3 : slotReady);
  const desktop = mailPlatform() === "desktop";

  const openMail = (prepared: ComposedMail) => {
    if (desktop) {
      setOpened(openGmail(prepared));
    } else {
      globalThis.location.assign(mailtoUrl(prepared));
      setOpened(true);
    }
  };

  const submit = async () => {
    if (!canSend) return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/appointment-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          signature,
          action,
          note,
          ...(picking && needsDate ? { date: pickedDate } : {}),
          ...(picking && needsTime ? { time: pickedTime } : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.sent) {
        setSentTo(String(data.to ?? appointment.email));
        setState("done");
        return;
      }
      const compose = data?.compose as ComposedMail | undefined;
      if (!res.ok || !compose) {
        setError((data?.error as string) || "Yanıt hazırlanamadı, lütfen tekrar deneyin.");
        setState("error");
        return;
      }
      setMail(compose);
      setState("done");
      openMail(compose);
    } catch {
      setError("Bağlantı hatası, lütfen tekrar deneyin.");
      setState("error");
    }
  };

  const doneMessage = sentTo
    ? `${decline ? "Açıklamalı bilgilendirme" : "Takvim bağlantılı onay"} e-postası ${sentTo} adresine gönderildi.`
    : opened === null
      ? "E-posta hazırlanıyor…"
      : opened
        ? `${appointment.email} adresine yanıt e-postası hazır; Gönder'e basmanız yeterli.`
        : "Gmail'i açmak için aşağıdaki butona basın; yanıtınız hazır, Gönder'e basmanız yeterli.";

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
          <m.div
            key="done"
            className="flex flex-col items-center py-24 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <MascotDuo pose="cheer" size="md" />
            <h1 className="mt-8 font-sans text-[clamp(2rem,5vw,3.25rem)] font-light leading-tight tracking-[-0.02em]">
              {sentTo ? "Yanıtınız gönderildi." : "Yanıtınız e-postada hazır."}
            </h1>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-mute">{doneMessage}</p>
            {mail && opened !== null && (
              <button
                type="button"
                onClick={() => openMail(mail)}
                className={`mt-8 inline-flex min-h-12 items-center gap-4 rounded-[3px] border px-6 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors hover:bg-night ${
                  opened ? "border-ink/30 text-mute hover:text-ink" : "border-bone text-ink"
                }`}
              >
                {desktop ? "Gmail'i aç" : "E-posta uygulamasını aç"}
                <span aria-hidden>→</span>
              </button>
            )}
          </m.div>
        ) : (
          <m.div
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
                  {needsDate && <p className="mt-3 text-[14px] text-clay">{NO_DATE_HINT}</p>}
                </div>
                <div className="mx-6 border-t border-dashed border-line sm:mx-7" />
                <dl className="grid grid-cols-3 gap-4 p-6 sm:p-7">
                  {day && (
                    <div>
                      <dt className="eyebrow text-mute">Gün</dt>
                      <dd className="mt-2 text-[15px]">{day}</dd>
                    </div>
                  )}
                  {appointment.time && (
                    <div>
                      <dt className="eyebrow text-mute">Saat</dt>
                      <dd className="mt-2 text-[15px] font-medium">{appointment.time}</dd>
                    </div>
                  )}
                  <div className={day || appointment.time ? "" : "col-span-3"}>
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
                {english && <p className="mt-3 text-[13px] leading-relaxed text-clay">Müşteri siteyi İngilizce kullandı; yanıt e-postası İngilizce hazırlanır. Notunuzu İngilizce yazabilirsiniz.</p>}
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

                {picking && (
                  <div className="mt-8">
                    <p className="text-[14px] leading-relaxed text-clay">
                      {needsDate ? "Müşteri tarih seçmedi." : "Müşteri saat seçmedi."} Onaylamak için görüşme {needsDate ? "gününü ve saatini" : "saatini"} seçin.
                    </p>
                    {needsDate && (
                      <>
                        <label htmlFor="response-date" className="mt-6 block font-mono text-[12px] uppercase tracking-[0.12em] text-mute">
                          Görüşme günü *
                        </label>
                        <input
                          id="response-date"
                          type="date"
                          min={istanbulToday()}
                          value={pickedDate}
                          onChange={(e) => setPickedDate(e.target.value)}
                          className="mt-3 w-full border-0 border-b border-line bg-transparent py-3 text-[16px] text-ink [color-scheme:dark] focus:border-ink"
                        />
                      </>
                    )}
                    {needsTime && (
                      <fieldset className="mt-6">
                        <legend className="font-mono text-[12px] uppercase tracking-[0.12em] text-mute">Saat *</legend>
                        <div className="mt-3 grid grid-cols-4 gap-px border border-line bg-line">
                          {TIME_SLOTS.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              aria-pressed={pickedTime === slot}
                              onClick={() => setPickedTime(slot)}
                              className={`py-3 font-mono text-[13px] transition-colors ${pickedTime === slot ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-night hover:text-bone"}`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    )}
                  </div>
                )}

                <label htmlFor="response-note" className="mt-8 block font-mono text-[12px] uppercase tracking-[0.12em] text-mute">
                  {decline ? "Açıklama (müşteriye iletilecek) *" : "Not (isteğe bağlı)"}
                </label>
                <textarea
                  id="response-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder={
                    decline
                      ? "Örn. Bu hafta şantiyedeyiz; gelecek hafta size uygun bir saat önerebilir misiniz?"
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
                  {state === "sending" ? "Hazırlanıyor…" : decline ? "Açıklamayla reddet" : "Onayla ve müşteriye bildir"}
                  <span aria-hidden>→</span>
                </button>
                <p className="mt-4 text-[13px] leading-relaxed text-mute">
                  {decline
                    ? "Müşteriye nazik bir bilgilendirme ve yeniden randevu alabileceği bir bağlantı içeren e-posta hazırlanır."
                    : "Müşteriye adres, yol tarifi ve takvim bağlantısıyla bir onay e-postası hazırlanır."}
                </p>
                {state === "error" && <p className="mt-4 text-[14px] text-clay" role="alert">{error}</p>}
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}
