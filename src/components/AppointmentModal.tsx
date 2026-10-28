"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import AdvancedCalendar from "./AdvancedCalendar";
import { useToast } from "@/contexts/ToastContext";
import { useScrollLock } from "@/hooks/useScrollLock";
import { studioInfo } from "@/lib/studio-info";
import { type ComposedMail, followLink, gmailAppUrl, mailPlatform, mailtoUrl, openGmail } from "@/lib/gmailCompose";
import { icons } from "@/components/studio/SocialLinks";
import type { AppointmentPrefill } from "@/contexts/AppointmentContext";
import { MascotDuo } from "@/components/mascots/Mascots";
import { TIME_SLOTS, localDate } from "@/lib/appointmentDate";
import { APPOINTMENT_SERVICES } from "@/lib/services";
import { formatPhone } from "@/lib/appointmentLinks";
import { CARD_FILE, canShareFiles, imageAsJpeg } from "@/lib/cardImage";
import { isPersonName, isPhoneNumber } from "@/lib/validations";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: AppointmentPrefill | null;
}

const EASE = [0.76, 0, 0.24, 1] as const;
const SERVICES = APPOINTMENT_SERVICES;

function FieldError({ message }: Readonly<{ message?: string }>) {
  if (!message) return null;
  return <p className="mt-2 font-mono text-[12px] text-clay">{message}</p>;
}

function SectionHeading({ index, children }: Readonly<{ index: string; children: React.ReactNode }>) {
  return (
    <div className="flex items-baseline gap-4 mb-8">
      <span className="font-mono text-[12px] text-mute">{index}</span>
      <h3 className="font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-ink">{children}</h3>
      <span className="h-px flex-1 bg-line translate-y-[-3px]" aria-hidden />
    </div>
  );
}

export default function AppointmentModal({ isOpen, onClose, prefill }: Readonly<AppointmentModalProps>) {
  const t = useTranslations("appointment");
  const ts = useTranslations("studio");
  const locale = useLocale();
  const toast = useToast();
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);
  const [sentValues, setSentValues] = useState<AppointmentFormValues | null>(null);
  const messageValueRef = useRef<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const [preparedMail, setPreparedMail] = useState<ComposedMail | null>(null);
  const [gmailOpened, setGmailOpened] = useState(true);
  const [delivered, setDelivered] = useState(false);
  const [cardImage, setCardImage] = useState("");
  const [mailLinks, setMailLinks] = useState<{ label: string; href: string }[]>([]);

  useScrollLock(isOpen);

  const appointmentSchema = useMemo(() => z.object({
    name: z.string()
      .min(1, t("validation.required"))
      .refine((val) => val.trim().length >= 3, { message: t("validation.nameMin") })
      .refine((val) => isPersonName(val), { message: t("validation.nameInvalid") }),
    email: z.string()
      .min(1, t("validation.required"))
      .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()), { message: t("validation.emailInvalid") }),
    phone: z.string()
      .min(1, t("validation.required"))
      .refine((val) => isPhoneNumber(val), { message: t("validation.phoneInvalid") }),
    service: z.string()
      .min(1, t("validation.required")),
    date: z.string()
      .min(1, t("validation.dateRequired"))
      .refine((val) => {
        const selectedDate = localDate(val);
        if (!selectedDate) return false;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return selectedDate >= tomorrow;
      }, { message: t("validation.dateFuture") }),
    time: z.string().min(1, t("validation.timeRequired")),
    message: z.string()
      .max(500, t("validation.messageMax"))
      .refine((val) => val.trim().length > 0, { message: t("validation.required") })
      .refine((val) => val.trim().length === 0 || val.trim().length >= 10, { message: t("validation.messageMin") })
  }), [t]);

  type AppointmentFormValues = z.infer<typeof appointmentSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    reset,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      service: "",
      message: ""
    }
  });

  useEffect(() => {
    if (!isOpen || !prefill) return;
    const serviceKey =
      SERVICES.find((k) => k === prefill.service || t(`services.${k}`) === prefill.service) ?? "";
    reset({
      name: prefill.name ?? "",
      email: prefill.email ?? "",
      phone: prefill.phone ?? "",
      date: prefill.date ?? "",
      time: prefill.time ?? "",
      service: serviceKey,
      message: prefill.message ?? "",
    });
    messageValueRef.current = prefill.message ?? "";
  }, [isOpen, prefill, reset, t]);

  const values = useWatch({ control });
  const messageRegister = register("message");

  useEffect(() => {
    if (isOpen) messageValueRef.current = values.message ?? "";
  }, [isOpen, values.message]);

  const sentByStudioMail = async (token: string) => {
    if (!token) return false;
    const res = await fetch("/api/appointment-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    return res.ok && Boolean((await res.json()).sent);
  };

  const requestMail = (data: AppointmentFormValues, cardUrl: string): ComposedMail => ({
    to: studioInfo.formInbox,
    subject: `${locale === "tr" ? "Randevu talebi" : "Appointment request"} · ${data.name.trim()} · ${showDate(data.date, { day: "numeric", month: "long", year: "numeric" })} ${data.time}`,
    text: appointmentText(data, cardUrl, false),
  });

  const showDelivered = (data: AppointmentFormValues) => {
    setDelivered(true);
    setSentValues({ ...data });
    setSubmitStatus("success");
    formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    toast.success(t("successSent"));
  };

  const onSubmit = async (data: AppointmentFormValues) => {
    setSubmitStatus(null);
    setSubmitErrorMessage(null);
    const platform = mailPlatform();
    if (platform !== "desktop") {
      const { token, image, url: cardUrl } = await appointmentLink(data, "mail");
      setCardImage(image);
      if (await sentByStudioMail(token)) {
        showDelivered(data);
        return;
      }
      const mail = requestMail(data, cardUrl);
      const mailto = mailtoUrl(mail);
      setMailLinks(
        platform === "ios"
          ? [
              { label: locale === "tr" ? "Gmail'de aç" : "Open in Gmail", href: gmailAppUrl(mail) },
              { label: locale === "tr" ? "Mail uygulamasında aç" : "Open in Mail", href: mailto },
            ]
          : [{ label: locale === "tr" ? "Gmail'de aç" : "Open in Gmail", href: mailto }]
      );
      setSentValues({ ...data });
      setSubmitStatus("success");
      formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      globalThis.location.assign(mailto);
      return;
    }
    try {
      const link = await appointmentLink(data, "mail");
      setCardImage(link.image);
      if (await sentByStudioMail(link.token)) {
        showDelivered(data);
        return;
      }
      const mail = requestMail(data, link.url);
      const opened = openGmail(mail);
      setPreparedMail(mail);
      setGmailOpened(opened);
      setSentValues({ ...data });
      setSubmitStatus('success');
      formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      if (opened) toast.success(t("successMessage"));
    } catch {
      const message = t("error");
      setSubmitErrorMessage(message);
      setSubmitStatus('error');
      toast.error(message);
    }
  };

  const handleClose = useCallback(() => {
    setSubmitStatus(null);
    setSentValues(null);
    setPreparedMail(null);
    setGmailOpened(true);
    setDelivered(false);
    setCardImage("");
    setMailLinks([]);
    reset();
    messageValueRef.current = '';
    onClose();
  }, [reset, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  const dateLocale = locale === 'tr' ? 'tr-TR' : 'en-US';
  const showDate = (date: string, options?: Intl.DateTimeFormatOptions) =>
    localDate(date)?.toLocaleDateString(dateLocale, options) ?? t("flexibleDate");
  const shortDate = (date: string) => localDate(date)?.toLocaleDateString(dateLocale) ?? t("flexibleShort");

  const reopenGmail = () => {
    if (preparedMail) setGmailOpened(openGmail(preparedMail));
  };

  const saveBlob = (blob: Blob) => {
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = CARD_FILE;
    a.click();
    setTimeout(() => globalThis.URL.revokeObjectURL(url), 1000);
  };

  const passBlob = async (vals: AppointmentFormValues) => {
    const image = cardImage || (await appointmentLink(vals, "mail")).image;
    return image ? imageAsJpeg(image) : null;
  };

  const downloadPass = async (vals: AppointmentFormValues) => {
    const blob = await passBlob(vals);
    if (blob) saveBlob(blob);
    else toast.error(t("error"));
  };

  const sharePass = async (vals: AppointmentFormValues) => {
    const blob = await passBlob(vals);
    if (!blob) {
      toast.error(t("error"));
      return;
    }
    const file = new File([blob], CARD_FILE, { type: 'image/jpeg' });
    const text = locale === 'tr'
      ? `U+ Studio randevum: ${t(`services.${vals.service}`)} · ${shortDate(vals.date)}${vals.time ? ` ${vals.time}` : ""}`
      : `My U+ Studio appointment: ${t(`services.${vals.service}`)} · ${shortDate(vals.date)}${vals.time ? ` ${vals.time}` : ""}`;
    try {
      if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'U+ Studio', text });
        return;
      }
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') return;
    }
    saveBlob(blob);
    toast.success(locale === 'tr' ? 'Paylaşım bu tarayıcıda desteklenmiyor; kart indirildi.' : 'Sharing isn\'t supported here; the card was downloaded.');
  };

  const appointmentLink = async (v: AppointmentFormValues, via: "mail" | "whatsapp") => {
    try {
      const res = await fetch("/api/appointment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, service: t(`services.${v.service}`), locale, via }),
      });
      if (res.ok) {
        const json = await res.json();
        return { token: String(json.token ?? ""), url: String(json.url ?? ""), image: String(json.image ?? "") };
      }
    } catch {}
    return { token: "", url: "", image: "" };
  };


  const appointmentText = (v: AppointmentFormValues, cardUrl: string, markup: boolean) => {
    const tr = locale === "tr";
    const heading = (text: string) => (markup ? `*${text}*` : text.toLocaleUpperCase(tr ? "tr-TR" : "en-US"));
    const field = (label: string, value: string) => `${markup ? `*${label}:*` : `${label}:`} ${value}`;
    const cardLabel = tr ? "Randevu kartı" : "Appointment card";
    return [
      tr ? "Merhaba U+ Studio," : "Hello U+ Studio,",
      "",
      tr ? "Randevu formunuz üzerinden yüz yüze görüşme talep ediyorum." : "I would like to book a face-to-face meeting through your booking form.",
      "",
      heading(tr ? "Hizmet" : "Service"),
      t(`services.${v.service}`),
      "",
      heading(tr ? "Tarih ve saat" : "Date and time"),
      `${showDate(v.date, { day: "numeric", month: "long", year: "numeric", weekday: "long" })}, ${v.time}`,
      "",
      heading(tr ? "Mesaj" : "Message"),
      v.message.trim(),
      "",
      heading(tr ? "İletişim bilgilerim" : "My contact details"),
      field(tr ? "Ad Soyad" : "Name", v.name.trim()),
      field(tr ? "Telefon" : "Phone", formatPhone(v.phone)),
      field(tr ? "E-posta" : "Email", v.email.trim()),
      ...(cardUrl ? ["", ...(markup ? [field(cardLabel, cardUrl)] : [heading(cardLabel), cardUrl])] : []),
      "",
      `— ${tr ? "uplusstudio.com.tr randevu formu" : "uplusstudio.com.tr booking form"}`,
    ].join("\n");
  };

  const sendViaWhatsApp = async () => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error(t("fillRequired"));
      return;
    }
    const shareFiles = canShareFiles();
    const popup = shareFiles ? null : globalThis.open("about:blank", "_blank");
    const v = getValues();
    const { url: cardUrl, image: imageUrl } = await appointmentLink(v, "whatsapp");
    const url = `${studioInfo.whatsappUrl}?text=${encodeURIComponent(appointmentText(v, cardUrl, true))}`;
    if (shareFiles && imageUrl) {
      try {
        const jpeg = await imageAsJpeg(imageUrl);
        if (jpeg) {
          const file = new File([jpeg], CARD_FILE, { type: "image/jpeg" });
          await navigator.share({ files: [file], text: appointmentText(v, "", true) });
          return;
        }
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return;
      }
    }
    if (popup) popup.location.href = url;
    else followLink(url);
  };

  const handleDownload = async () => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error(t("fillRequired"));
      return;
    }
    await downloadPass({ ...getValues() });
  };

  const inputClass = (hasError: boolean) =>
    `w-full bg-transparent border-0 border-b py-3 text-lg text-ink placeholder:text-mute/50 outline-none transition-colors rounded-none ${
      hasError ? "border-clay" : "border-line focus:border-ink"
    }`;
  const labelClass = "block font-mono text-[12px] uppercase tracking-[0.12em] text-mute";

  const formattedDate = localDate(values.date ?? "")?.toLocaleDateString(dateLocale, { day: "numeric", month: "long", weekday: "long" }) ?? null;
  const completed = [values.name, values.email, values.phone, values.service, values.date, values.time, values.message].filter(Boolean).length;

  const passRows: { label: string; value: string | null }[] = [
    { label: t("guest"), value: values.name || null },
    { label: t("service"), value: values.service ? t(`services.${values.service}`) : null },
    { label: t("date"), value: formattedDate },
    { label: t("time"), value: values.time || null },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="appointment-overlay"
          className="fixed inset-0 z-[70] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.25, duration: 0.3 } }}
        >
          <button
            type="button"
            aria-label={t("cancel")}
            className="absolute inset-0 bg-night/60 backdrop-blur-sm cursor-default"
            onClick={handleClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-modal-title"
            className="relative z-10 flex h-full w-full max-w-[1320px] bg-paper shadow-[0_0_80px_rgba(0,0,0,0.35)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <aside className="relative hidden lg:flex w-[40%] shrink-0 flex-col justify-between overflow-hidden bg-night text-bone p-10 xl:p-12">
              <Image
                src="/media/projects/modern-villa/exterior-dusk.jpg"
                alt=""
                fill
                sizes="40vw"
                className="object-cover opacity-55"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-b from-night/70 via-night/20 to-night/90" aria-hidden />

              <div className="relative flex items-center justify-between">
                <span className="font-sans text-lg tracking-tight">U+ Studio</span>
                <span className="eyebrow text-bone/60">{t("title")}</span>
              </div>

              <div className="relative">
                <motion.p
                  className="font-serif text-5xl xl:text-6xl leading-[0.95] max-w-md"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: EASE, delay: 0.45 }}
                >
                  {ts("cta.title")}
                </motion.p>
                <p className="mt-6 max-w-sm text-sm leading-relaxed text-bone/70">{t("subtitle")}</p>
              </div>

              <motion.div
                className="relative border border-bone/20 bg-night/50 backdrop-blur-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.6 }}
              >
                <div className="flex items-center justify-between border-b border-bone/15 px-6 py-4">
                  <span className="eyebrow text-bone/60">{t("digitalPass")}</span>
                  <span className="font-mono text-[12px] text-bone/50">{String(completed).padStart(2, "0")} / 07</span>
                </div>
                <dl className="grid grid-cols-2">
                  {passRows.map((row, i) => (
                    <div key={row.label} className={`px-6 py-4 ${i % 2 === 0 ? "border-r border-bone/15" : ""} ${i < 2 ? "border-b border-bone/15" : ""}`}>
                      <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-bone/45">{row.label}</dt>
                      <dd className={`mt-1.5 truncate text-[15px] ${row.value ? "text-bone" : "text-bone/30"}`}>{row.value ?? "—"}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex items-center justify-between border-t border-bone/15 px-6 py-4">
                  <div className="flex items-end gap-[3px]" aria-hidden>
                    {Array.from({ length: 22 }, (_, i) => (
                      <span key={i} className="w-px bg-bone/50" style={{ height: `${8 + ((i * 7) % 4) * 4}px` }} />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="group inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-bone/80 hover:text-bone"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" strokeWidth={1.25} /></svg>
                    {locale === "tr" ? "Kartı indir" : "Download pass"}
                  </button>
                </div>
              </motion.div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
              <header className="flex shrink-0 items-center justify-between gap-6 border-b border-line px-6 py-2 sm:items-start sm:px-12 sm:py-8">
                <div>
                  <span className="eyebrow hidden text-mute sm:inline">U+ Studio — {t("title")}</span>
                  <h2 id="appointment-modal-title" className="font-serif text-[1.75rem] leading-none text-ink sm:mt-3 sm:text-5xl">
                    {t("title")}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="group flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.12em] text-ink"
                  aria-label={t("cancel")}
                >
                  <span className="hidden sm:inline">{ts("nav.close")}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors sm:h-11 sm:w-11 group-hover:border-ink group-hover:bg-night hover:text-bone group-hover:text-bone">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={1.25} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                </button>
              </header>

              <form
                id="appointment-form"
                ref={formRef}
                onSubmit={(event) => handleSubmit(onSubmit)(event)}
                className="custom-scrollbar flex-1 min-h-0 overflow-y-auto px-6 py-10 sm:px-12"
                noValidate
              >
                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-10 flex flex-col items-center gap-5 rounded-[6px] border border-line bg-paper-2 px-6 py-8 text-center text-ink">
                      <MascotDuo pose="cheer" size="sm" />
                      <p className="max-w-md text-[16px] leading-relaxed text-ink/90">
                        {delivered ? t("successSent") : mailLinks.length ? t("successMobile") : !gmailOpened ? t("successRetry") : t("success")}
                      </p>
                      {preparedMail && !mailLinks.length && (
                        <button
                          type="button"
                          onClick={reopenGmail}
                          className={`inline-flex min-h-12 w-full max-w-md items-center justify-center gap-2 rounded-[3px] border px-4 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors ${
                            gmailOpened ? "border-bone/60 text-ink hover:border-bone hover:bg-night" : "border-bone bg-bone text-night hover:bg-transparent hover:text-bone"
                          }`}
                        >
                          {icons.email}
                          {t("openGmail")}
                        </button>
                      )}
                      {mailLinks.length > 0 && (
                        <div className="flex w-full max-w-md flex-col gap-2">
                          {mailLinks.map((m, i) => (
                            <a
                              key={m.href}
                              href={m.href}
                              className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] border px-4 font-mono text-[12px] uppercase tracking-[0.12em] transition-colors ${
                                i === 0 ? "border-bone bg-bone text-night hover:bg-transparent hover:text-bone" : "border-bone/60 text-ink hover:border-bone hover:bg-night"
                              }`}
                            >
                              {icons.email}
                              {m.label}
                            </a>
                          ))}
                        </div>
                      )}
                      {sentValues && (
                        <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => sharePass(sentValues)}
                            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[3px] border border-bone/60 bg-transparent px-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={1.5} strokeLinecap="round" d="M12 3v12m0-12 4 4m-4-4-4 4M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" /></svg>
                            {locale === "tr" ? "Kartı paylaş" : "Share card"}
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadPass(sentValues)}
                            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[3px] border border-bone/60 bg-transparent px-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeWidth={1.5} strokeLinecap="round" d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" /></svg>
                            {locale === "tr" ? "Kartı indir" : "Download card"}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                  {submitStatus === 'error' && submitErrorMessage && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-10 border border-clay px-6 py-5 text-clay">
                      {submitErrorMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                <section className="mb-14">
                  <SectionHeading index="01">{t("personalInfo")}</SectionHeading>
                  <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label htmlFor="appointment-name" className={labelClass}>{t("name")}</label>
                      <input id="appointment-name" {...register("name")} autoComplete="name" className={inputClass(!!errors.name)} placeholder={t("namePlaceholder")} />
                      <FieldError message={errors.name?.message} />
                    </div>
                    <div>
                      <label htmlFor="appointment-email" className={labelClass}>{t("email")}</label>
                      <input id="appointment-email" type="email" {...register("email")} autoComplete="email" className={inputClass(!!errors.email)} placeholder={t("emailPlaceholder")} />
                      <FieldError message={errors.email?.message} />
                    </div>
                    <div>
                      <label htmlFor="appointment-phone" className={labelClass}>{t("phone")}</label>
                      <input id="appointment-phone" type="tel" inputMode="tel" {...register("phone")} autoComplete="tel" className={inputClass(!!errors.phone)} placeholder={t("phonePlaceholder")} />
                      <FieldError message={errors.phone?.message} />
                    </div>
                  </div>

                  <fieldset className="mt-10">
                    <legend className={labelClass}>{t("service")}</legend>
                    <div className="mt-4 grid grid-cols-2 gap-px border border-line bg-line xl:grid-cols-5">
                      {SERVICES.map((service) => {
                        const active = values.service === service;
                        return (
                          <button
                            key={service}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setValue("service", service, { shouldValidate: true })}
                            className={`px-4 py-5 text-left text-sm transition-colors ${active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-night hover:text-bone"}`}
                          >
                            <span className={`block font-mono text-[11px] mb-2 ${active ? "text-paper/60" : "text-mute"}`}>
                              {String(SERVICES.indexOf(service) + 1).padStart(2, "0")}
                            </span>
                            {t(`services.${service}`)}
                          </button>
                        );
                      })}
                    </div>
                    <FieldError message={errors.service?.message} />
                  </fieldset>
                </section>

                <section className="mb-14">
                  <SectionHeading index="02">{t("schedule")}</SectionHeading>
                  <p className="-mt-5 mb-8 text-[14px] leading-relaxed text-mute">{t("scheduleHint")}</p>
                  <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1.3fr_1fr]">
                    <div>
                      <AdvancedCalendar
                        selectedDate={values.date ?? ""}
                        onDateSelect={(date) => setValue('date', date, { shouldValidate: true })}
                        selectedTime={values.time}
                        onTimeSelect={(time) => setValue('time', time, { shouldValidate: true })}
                      />
                      <FieldError message={errors.date?.message} />
                    </div>
                    <div>
                      <p className={labelClass}>{t("time")}</p>
                      <div className="mt-4 grid grid-cols-4 gap-px border border-line bg-line xl:grid-cols-2">
                        {TIME_SLOTS.map((slot) => {
                          const active = values.time === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              aria-pressed={active}
                              onClick={() => setValue('time', slot, { shouldValidate: true })}
                              className={`py-4 font-mono text-[13px] transition-colors ${active ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-night hover:text-bone"}`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                      <FieldError message={errors.time?.message} />
                      {formattedDate && (
                        <p className="mt-6 text-sm text-mute">
                          <span className="text-ink">{formattedDate}</span>
                          {values.time && <> · <span className="text-ink">{values.time}</span></>}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="mb-6">
                  <SectionHeading index="03">{t("message")}</SectionHeading>
                  <label htmlFor="appointment-message" className="sr-only">{t("message")}</label>
                  <textarea
                    id="appointment-message"
                    {...messageRegister}
                    onChange={(e) => {
                      messageRegister.onChange(e);
                      messageValueRef.current = e.target.value;
                    }}
                    rows={4}
                    maxLength={500}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    className={`${inputClass(!!errors.message)} resize-none`}
                    placeholder={t("messagePlaceholder")}
                  />
                  <div className="mt-2 flex justify-between">
                    <FieldError message={errors.message?.message} />
                    <span className="ml-auto font-mono text-[12px] text-mute">{values.message?.length ?? 0} / 500</span>
                  </div>
                </section>

                <p className="mt-10 text-sm text-mute lg:hidden">
                  {studioInfo.phoneDisplay} · {studioInfo.email}
                </p>
              </form>

              <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-line px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-12">
                <div className="hidden sm:flex items-center gap-4">
                  <div className="h-px w-32 bg-line overflow-hidden">
                    <motion.div className="h-full bg-ink" animate={{ width: `${(completed / 7) * 100}%` }} transition={{ duration: 0.5, ease: EASE }} />
                  </div>
                  <span className="font-mono text-[12px] text-mute">{String(completed).padStart(2, "0")} / 07</span>
                </div>
                <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="order-2 min-h-12 whitespace-nowrap rounded-[3px] border border-line px-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink hover:bg-night sm:order-1 sm:px-6"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={sendViaWhatsApp}
                    className="order-3 inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[3px] border border-line px-4 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night sm:order-2 sm:px-5"
                  >
                    {icons.whatsapp}
                    WhatsApp
                  </button>
                  <button
                    type="submit"
                    form="appointment-form"
                    disabled={isSubmitting}
                    className="group order-1 col-span-2 inline-flex min-h-12 items-center justify-center gap-4 whitespace-nowrap rounded-[3px] border border-ink bg-transparent px-6 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-bone hover:bg-night hover:text-bone disabled:opacity-50 sm:order-3 sm:px-8"
                  >
                    {isSubmitting ? t("sending") : t("book")}
                    <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                  </button>
                </div>
              </footer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
